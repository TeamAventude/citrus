using System;
using System.Collections.Generic;
using FluentAssertions;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Moq;
using Session001.Data.Entities;
using Session001.DTOs;
using Session001.Services.Implementations;

namespace Session001.Tests.Services;

public class ToolServiceTests : BaseServiceTest
{
    private readonly ToolService _toolService;
    private readonly Mock<ILogger<ToolService>> _loggerMock;

    public ToolServiceTests()
    {
        _loggerMock = CreateLoggerMock<ToolService>();
        _toolService = new ToolService(Context, _loggerMock.Object);
    }

    [Fact]
    public async Task GetToolHistoryAsync_ReturnsChronologicalHistoryAndAnalytics()
    {
        // Arrange
        var tool = CreateTool(history =>
        {
            history.Add(CreateEvent(
                eventType: "Procurement",
                eventDate: DateTime.UtcNow.AddMonths(-6),
                configure: e =>
                {
                    e.PurchaseOrderNumber = "PO-1001";
                    e.Cost = 1000m;
                    e.Notes = "Initial purchase";
                }));

            history.Add(CreateEvent(
                eventType: "Borrowing",
                eventDate: DateTime.UtcNow.AddDays(-30),
                configure: e =>
                {
                    e.ProjectNumber = "PRJ-001";
                    e.DueDate = DateTime.UtcNow.AddDays(-20);
                }));

            history.Add(CreateEvent(
                eventType: "Return",
                eventDate: DateTime.UtcNow.AddDays(-20)));

            history.Add(CreateEvent(
                eventType: "Repair",
                eventDate: DateTime.UtcNow.AddDays(-15),
                configure: e =>
                {
                    e.Cost = 150m;
                    e.RepairPassed = true;
                    e.Notes = "Replaced cutting head";
                }));

            history.Add(CreateEvent(
                eventType: "QC",
                eventDate: DateTime.UtcNow.AddDays(-5),
                configure: e => e.QCPassed = true));

            history.Add(CreateEvent(
                eventType: "Borrowing",
                eventDate: DateTime.UtcNow.AddDays(-3),
                configure: e =>
                {
                    e.ProjectNumber = "PRJ-002";
                    e.DueDate = DateTime.UtcNow.AddDays(4);
                }));
        });

        Context.Tools.Add(tool);
        await Context.SaveChangesAsync();

        // Act
        var response = await _toolService.GetToolHistoryAsync(tool.Id);

        // Assert
        response.History.Should().BeInAscendingOrder(e => e.EventDate);
        response.History.First().EventType.Should().Be("Procurement");
        response.History.Last().EventType.Should().Be("Borrowing");

        response.Analytics.BorrowingHistory.TotalBorrowCount.Should().Be(2);
        response.Analytics.BorrowingHistory.OverdueCount.Should().Be(0);
        response.Analytics.RepairHistory.TotalRepairCount.Should().Be(1);
        response.Analytics.RepairHistory.TotalRepairCost.Should().Be(150m);
        response.Analytics.IsUsable.Should().BeTrue();
        response.Analytics.UsabilityReason.Should().Be("Tool is in good condition");

        response.Tool.IsUsable.Should().BeTrue();
        response.Tool.TotalBorrowCount.Should().Be(2);
        response.Tool.TotalRepairCount.Should().Be(1);
        response.Tool.TotalRepairCost.Should().Be(150m);
    }

    [Fact]
    public async Task GetToolHistoryAsync_AppliesFiltersCorrectly()
    {
        // Arrange
        var repairDate = DateTime.UtcNow.AddDays(-10);
        var tool = CreateTool(history =>
        {
            history.Add(CreateEvent("Borrowing", DateTime.UtcNow.AddDays(-30)));
            history.Add(CreateEvent("Repair", repairDate, e =>
            {
                e.Cost = 75m;
                e.RepairPassed = true;
            }));
            history.Add(CreateEvent("QC", DateTime.UtcNow.AddDays(-5), e => e.QCPassed = true));
        });

        Context.Tools.Add(tool);
        await Context.SaveChangesAsync();

        var filter = new ToolHistoryFilterDto
        {
            StartDate = repairDate.AddDays(-1),
            EndDate = repairDate.AddDays(1),
            EventType = "Repair"
        };

        // Act
        var response = await _toolService.GetToolHistoryAsync(tool.Id, filter);

        // Assert
        response.History.Should().HaveCount(1);
        response.History.Single().EventType.Should().Be("Repair");
        response.History.Single().EventDate.Should().Be(repairDate);
        response.Analytics.RepairHistory.TotalRepairCount.Should().Be(1);
        response.Analytics.RepairHistory.TotalRepairCost.Should().Be(75m);
    }

    [Fact]
    public async Task UpdateToolStatusAsync_RecalculatesAggregatesAndFlagsUsability()
    {
        // Arrange
        var tool = CreateTool(history =>
        {
            history.Add(CreateEvent("Repair", DateTime.UtcNow.AddDays(-40), e =>
            {
                e.Cost = 250m;
                e.RepairPassed = true;
            }));
            history.Add(CreateEvent("Repair", DateTime.UtcNow.AddDays(-30), e =>
            {
                e.Cost = 275m;
                e.RepairPassed = true;
            }));
            history.Add(CreateEvent("Repair", DateTime.UtcNow.AddDays(-20), e =>
            {
                e.Cost = 200m;
                e.RepairPassed = false;
            }));
            history.Add(CreateEvent("Repair", DateTime.UtcNow.AddDays(-10), e =>
            {
                e.Cost = 180m;
                e.RepairPassed = false;
            }));
            history.Add(CreateEvent("QC", DateTime.UtcNow.AddDays(-5), e => e.QCPassed = false));
            history.Add(CreateEvent("EOL", DateTime.UtcNow.AddDays(-2), e => e.QCPassed = false));
        });

        Context.Tools.Add(tool);
        await Context.SaveChangesAsync();

        // Act
        await _toolService.UpdateToolStatusAsync(tool.Id);
        var updatedTool = await Context.Tools
            .Include(t => t.History)
            .FirstAsync(t => t.Id == tool.Id);

        // Assert
        updatedTool.TotalRepairCount.Should().Be(4);
        updatedTool.TotalRepairCost.Should().Be(905m);
        updatedTool.IsUsable.Should().BeFalse();
        updatedTool.CurrentStatus.Should().Contain("Not Usable");

        var response = await _toolService.GetToolHistoryAsync(tool.Id);
        response.Analytics.IsUsable.Should().BeFalse();
        response.Analytics.UsabilityReason.Should().Contain("Exceeded maximum repairs");
        response.Analytics.UsabilityReason.Should().Contain("Repair costs exceed threshold");
        response.Analytics.UsabilityReason.Should().Contain("Latest QC failed");
        response.Analytics.UsabilityReason.Should().Contain("Latest EoL assessment failed");
        response.Analytics.RepairHistory.RepairCostPercentage.Should().BeGreaterThan(70m);
    }

    private static Tool CreateTool(Action<List<ToolHistory>> historyBuilder)
    {
        var tool = new Tool
        {
            Name = "Core Drill",
            ToolNumber = $"TL-{Guid.NewGuid():N}".ToUpperInvariant(),
            ProcurementPrice = 1000m,
            ProcurementDate = DateTime.UtcNow.AddMonths(-12),
            CurrentStatus = "Available",
            IsUsable = true,
            CreatedDate = DateTime.UtcNow.AddMonths(-12),
            ModifiedDate = DateTime.UtcNow.AddDays(-1)
        };

        var history = new List<ToolHistory>();
        historyBuilder(history);

        foreach (var item in history)
        {
            item.Tool = tool;
            tool.History.Add(item);
        }

        return tool;
    }

    private static ToolHistory CreateEvent(string eventType, DateTime eventDate, Action<ToolHistory>? configure = null)
    {
        var history = new ToolHistory
        {
            EventType = eventType,
            EventDate = eventDate,
            UserId = "system",
            UserName = "System",
            CreatedDate = eventDate,
            IsOverdue = false
        };

        configure?.Invoke(history);
        return history;
    }
}
