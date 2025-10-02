using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Session001.Data;
using Session001.Data.Entities;
using Session001.DTOs;
using Session001.Services.Interfaces;
using iText.Kernel.Pdf;
using iText.Layout;
using iText.Layout.Element;

namespace Session001.Services.Implementations
{
    public class ToolService : IToolService
    {
        private readonly ApplicationDbContext _context;
        private readonly ILogger<ToolService> _logger;
        private const int MAX_REPAIRS_THRESHOLD = 3;
        private const decimal REPAIR_COST_PERCENTAGE_THRESHOLD = 0.7m;

        public ToolService(ApplicationDbContext context, ILogger<ToolService> logger)
        {
            _context = context;
            _logger = logger;
        }

        public async Task<IReadOnlyList<ToolDto>> GetToolsAsync(string? searchTerm = null)
        {
            _logger.LogInformation("Retrieving tools with search term {SearchTerm}", searchTerm);

            var query = _context.Tools
                .Include(t => t.History)
                .AsSplitQuery()
                .AsNoTracking();

            if (!string.IsNullOrWhiteSpace(searchTerm))
            {
                var normalized = searchTerm.Trim();
                query = query.Where(t =>
                    EF.Functions.Like(t.Name, $"%{normalized}%") ||
                    EF.Functions.Like(t.ToolNumber, $"%{normalized}%"));
            }

            var tools = await query
                .OrderBy(t => t.Name)
                .ToListAsync();

            return tools.Select(tool => MapToDto(tool, CalculateToolMetrics(tool))).ToList();
        }

        public async Task<ToolHistoryResponseDto> GetToolHistoryAsync(int toolId, ToolHistoryFilterDto? filter = null)
        {
            _logger.LogInformation("Getting tool history for tool {ToolId}", toolId);

            var tool = await _context.Tools
                .Include(t => t.History)
                .AsSplitQuery()
                .FirstOrDefaultAsync(t => t.Id == toolId);

            if (tool == null)
            {
                throw new KeyNotFoundException($"Tool with ID {toolId} not found.");
            }

            var metrics = CalculateToolMetrics(tool);

            IEnumerable<ToolHistory> historySource = tool.History ?? Enumerable.Empty<ToolHistory>();

            if (filter != null)
            {
                if (filter.StartDate.HasValue)
                {
                    historySource = historySource.Where(h => h.EventDate >= filter.StartDate.Value);
                }

                if (filter.EndDate.HasValue)
                {
                    historySource = historySource.Where(h => h.EventDate <= filter.EndDate.Value);
                }

                if (!string.IsNullOrWhiteSpace(filter.EventType))
                {
                    var normalizedEventType = filter.EventType.Trim();
                    historySource = historySource.Where(h => string.Equals(h.EventType, normalizedEventType, StringComparison.OrdinalIgnoreCase));
                }
            }

            var orderedHistory = historySource
                .OrderBy(h => h.EventDate)
                .Select(MapHistoryToDto)
                .ToList();

            var analytics = BuildAnalytics(metrics);

            return new ToolHistoryResponseDto
            {
                Tool = MapToDto(tool, metrics),
                History = orderedHistory,
                Analytics = analytics
            };
        }

        public async Task<byte[]> ExportToolHistoryAsPdfAsync(int toolId)
        {
            var historyData = await GetToolHistoryAsync(toolId);

            using var memoryStream = new MemoryStream();
            using var writer = new PdfWriter(memoryStream);
            using var pdf = new PdfDocument(writer);
            using var document = new Document(pdf);

            document.Add(new Paragraph($"Tool History Report - {historyData.Tool.Name} ({historyData.Tool.ToolNumber})"));
            document.Add(new Paragraph("Analytics Summary"));
            document.Add(new Paragraph($"Status: {(historyData.Analytics.IsUsable ? "Usable" : "Not Usable")}"));
            document.Add(new Paragraph($"Reason: {historyData.Analytics.UsabilityReason}"));

            document.Add(new Paragraph("Borrowing History"));
            document.Add(new Paragraph($"Total Borrows: {historyData.Analytics.BorrowingHistory.TotalBorrowCount}"));
            document.Add(new Paragraph($"Last Borrowed: {historyData.Analytics.BorrowingHistory.LastBorrowedDate:yyyy-MM-dd HH:mm}"));
            document.Add(new Paragraph($"Overdue Count: {historyData.Analytics.BorrowingHistory.OverdueCount}"));

            document.Add(new Paragraph("Repair History"));
            document.Add(new Paragraph($"Total Repairs: {historyData.Analytics.RepairHistory.TotalRepairCount}"));
            document.Add(new Paragraph($"Total Repair Cost: ${historyData.Analytics.RepairHistory.TotalRepairCost:N2}"));
            document.Add(new Paragraph($"Last Repair Status: {FormatRepairStatus(historyData.Analytics.RepairHistory.LastRepairStatus)}"));
            document.Add(new Paragraph($"Repair Cost % of Procurement: {historyData.Analytics.RepairHistory.RepairCostPercentage:N2}%"));

            var table = new Table(5);
            table.AddCell("Date");
            table.AddCell("Event Type");
            table.AddCell("User");
            table.AddCell("Details");
            table.AddCell("Status");

            foreach (var eventDto in historyData.History)
            {
                table.AddCell(eventDto.EventDate.ToString("yyyy-MM-dd HH:mm"));
                table.AddCell(eventDto.EventType);
                table.AddCell(string.IsNullOrWhiteSpace(eventDto.UserName) ? eventDto.UserId : eventDto.UserName);
                table.AddCell(GetEventDetails(eventDto));
                table.AddCell(GetEventStatus(eventDto));
            }

            document.Add(table);
            document.Close();

            return memoryStream.ToArray();
        }

        public async Task UpdateToolStatusAsync(int toolId)
        {
            var tool = await _context.Tools
                .Include(t => t.History)
                .AsSplitQuery()
                .FirstOrDefaultAsync(t => t.Id == toolId);

            if (tool == null)
            {
                throw new KeyNotFoundException($"Tool with ID {toolId} not found.");
            }

            var metrics = CalculateToolMetrics(tool);

            tool.TotalBorrowCount = metrics.TotalBorrowCount;
            tool.LastBorrowedDate = metrics.LastBorrowedDate;
            tool.OverdueCount = metrics.OverdueCount;
            tool.TotalRepairCount = metrics.TotalRepairCount;
            tool.TotalRepairCost = metrics.TotalRepairCost;
            tool.IsUsable = metrics.IsUsable;
            tool.CurrentStatus = metrics.IsUsable ? "Usable" : $"Not Usable: {metrics.UsabilityReason}";
            tool.ModifiedDate = DateTime.UtcNow;

            await _context.SaveChangesAsync();
        }

        private ToolAnalyticsDto BuildAnalytics(ToolMetrics metrics) => new()
        {
            BorrowingHistory = new BorrowingAnalytics
            {
                TotalBorrowCount = metrics.TotalBorrowCount,
                LastBorrowedDate = metrics.LastBorrowedDate,
                OverdueCount = metrics.OverdueCount
            },
            RepairHistory = new RepairAnalytics
            {
                TotalRepairCount = metrics.TotalRepairCount,
                TotalRepairCost = metrics.TotalRepairCost,
                LastRepairStatus = metrics.LastRepairStatus,
                RepairCostPercentage = Math.Round(metrics.RepairCostRatio * 100, 2, MidpointRounding.AwayFromZero)
            },
            IsUsable = metrics.IsUsable,
            UsabilityReason = metrics.UsabilityReason
        };

        private static ToolDto MapToDto(Tool tool, ToolMetrics metrics) => new()
        {
            Id = tool.Id,
            Name = tool.Name,
            ToolNumber = tool.ToolNumber,
            ProcurementPrice = tool.ProcurementPrice,
            ProcurementDate = tool.ProcurementDate,
            CurrentStatus = tool.CurrentStatus,
            IsUsable = metrics.IsUsable,
            LastQCDate = metrics.LastQcDate,
            LastQCPassed = metrics.LastQcPassed,
            TotalRepairCost = metrics.TotalRepairCost,
            TotalRepairCount = metrics.TotalRepairCount,
            TotalBorrowCount = metrics.TotalBorrowCount,
            OverdueCount = metrics.OverdueCount,
            LastBorrowedDate = metrics.LastBorrowedDate,
            CreatedDate = tool.CreatedDate,
            ModifiedDate = tool.ModifiedDate
        };

        private static ToolHistoryDto MapHistoryToDto(ToolHistory history) => new()
        {
            Id = history.Id,
            EventType = history.EventType,
            EventDate = history.EventDate,
            UserId = history.UserId,
            UserName = history.UserName,
            ProjectNumber = history.ProjectNumber,
            PurchaseOrderNumber = history.PurchaseOrderNumber,
            Cost = history.Cost,
            Notes = history.Notes,
            QCPassed = history.QCPassed,
            RepairPassed = history.RepairPassed,
            DueDate = history.DueDate,
            IsOverdue = history.IsOverdue
        };

        private ToolMetrics CalculateToolMetrics(Tool tool)
        {
            var history = (tool.History ?? new List<ToolHistory>()).OrderBy(h => h.EventDate).ToList();

            var borrowingEvents = history.Where(IsBorrowingEvent).ToList();
            var repairEvents = history.Where(IsRepairEvent).ToList();
            var qcEvents = history.Where(IsQcEvent).ToList();
            var eolEvents = history.Where(IsEolEvent).ToList();

            var totalBorrowCount = borrowingEvents.Count;
            var lastBorrowedDate = borrowingEvents
                .OrderByDescending(e => e.EventDate)
                .Select(e => (DateTime?)e.EventDate)
                .FirstOrDefault();
            var overdueCount = history.Count(e => e.IsOverdue);

            var totalRepairCount = repairEvents.Count;
            var totalRepairCost = repairEvents.Sum(e => e.Cost ?? 0m);
            var lastRepairStatus = repairEvents
                .OrderByDescending(e => e.EventDate)
                .Select(e => e.RepairPassed)
                .FirstOrDefault();

            var lastQcEvent = qcEvents
                .OrderByDescending(e => e.EventDate)
                .FirstOrDefault();

            var lastEolEvent = eolEvents
                .OrderByDescending(e => e.EventDate)
                .FirstOrDefault();

            var repairCostRatio = tool.ProcurementPrice > 0
                ? totalRepairCost / tool.ProcurementPrice
                : 0m;

            var (isUsable, usabilityReason) = EvaluateUsability(
                totalRepairCount,
                repairCostRatio,
                lastQcEvent?.QCPassed,
                GetEolPassStatus(lastEolEvent));

            return new ToolMetrics(
                totalBorrowCount,
                lastBorrowedDate,
                overdueCount,
                totalRepairCount,
                Math.Round(totalRepairCost, 2, MidpointRounding.AwayFromZero),
                lastRepairStatus,
                repairCostRatio,
                lastQcEvent?.EventDate,
                lastQcEvent?.QCPassed,
                isUsable,
                usabilityReason);
        }

        private static (bool IsUsable, string Reason) EvaluateUsability(
            int totalRepairCount,
            decimal repairCostRatio,
            bool? latestQcPassed,
            bool? latestEolPassed)
        {
            var reasons = new List<string>();
            var isUsable = true;

            if (totalRepairCount > MAX_REPAIRS_THRESHOLD)
            {
                isUsable = false;
                reasons.Add($"Exceeded maximum repairs ({totalRepairCount} > {MAX_REPAIRS_THRESHOLD})");
            }

            if (repairCostRatio > REPAIR_COST_PERCENTAGE_THRESHOLD)
            {
                isUsable = false;
                reasons.Add($"Repair costs exceed threshold ({repairCostRatio:P0} > {REPAIR_COST_PERCENTAGE_THRESHOLD:P0} of procurement price)");
            }

            if (latestQcPassed == false)
            {
                isUsable = false;
                reasons.Add("Latest QC failed");
            }

            if (latestEolPassed == false)
            {
                isUsable = false;
                reasons.Add("Latest EoL assessment failed");
            }

            var reason = reasons.Any()
                ? string.Join(", ", reasons)
                : "Tool is in good condition";

            return (isUsable, reason);
        }

        private static bool? GetEolPassStatus(ToolHistory? eolEvent)
        {
            if (eolEvent == null)
            {
                return null;
            }

            return eolEvent.QCPassed ?? eolEvent.RepairPassed;
        }

        private static bool IsBorrowingEvent(ToolHistory history) => IsEventType(history, "Borrowing");

        private static bool IsRepairEvent(ToolHistory history) => IsEventType(history, "Repair");

        private static bool IsQcEvent(ToolHistory history) => IsEventType(history, "QC");

        private static bool IsEolEvent(ToolHistory history)
        {
            if (string.IsNullOrWhiteSpace(history.EventType))
            {
                return false;
            }

            return history.EventType.Contains("EOL", StringComparison.OrdinalIgnoreCase) ||
                   string.Equals(history.EventType, "EndOfLife", StringComparison.OrdinalIgnoreCase);
        }

        private static bool IsEventType(ToolHistory history, string eventType)
        {
            return !string.IsNullOrWhiteSpace(history.EventType) &&
                   string.Equals(history.EventType, eventType, StringComparison.OrdinalIgnoreCase);
        }

        private static string GetEventDetails(ToolHistoryDto eventDto)
        {
            var details = new StringBuilder();

            if (!string.IsNullOrWhiteSpace(eventDto.ProjectNumber))
            {
                details.Append($"Project: {eventDto.ProjectNumber} ");
            }

            if (!string.IsNullOrWhiteSpace(eventDto.PurchaseOrderNumber))
            {
                details.Append($"PO: {eventDto.PurchaseOrderNumber} ");
            }

            if (eventDto.Cost.HasValue)
            {
                details.Append($"Cost: ${eventDto.Cost.Value:N2} ");
            }

            if (!string.IsNullOrWhiteSpace(eventDto.Notes))
            {
                details.Append(eventDto.Notes);
            }

            return details.ToString().Trim();
        }

        private static string GetEventStatus(ToolHistoryDto eventDto)
        {
            if (IsQcEventType(eventDto.EventType))
            {
                return eventDto.QCPassed == true ? "Passed" : "Failed";
            }

            if (IsRepairEventType(eventDto.EventType))
            {
                return eventDto.RepairPassed == true ? "Passed" : "Failed";
            }

            if (IsBorrowingEventType(eventDto.EventType))
            {
                return eventDto.DueDate.HasValue
                    ? $"Due: {eventDto.DueDate:yyyy-MM-dd}"
                    : "No due date";
            }

            if (IsReturnEventType(eventDto.EventType))
            {
                return eventDto.IsOverdue ? "Overdue" : "On time";
            }

            return "N/A";
        }

        private static string FormatRepairStatus(bool? status) => status switch
        {
            true => "Pass",
            false => "Fail",
            _ => "Unknown"
        };

        private static bool IsQcEventType(string? eventType) => string.Equals(eventType, "QC", StringComparison.OrdinalIgnoreCase);

        private static bool IsRepairEventType(string? eventType) => string.Equals(eventType, "Repair", StringComparison.OrdinalIgnoreCase);

        private static bool IsBorrowingEventType(string? eventType) => string.Equals(eventType, "Borrowing", StringComparison.OrdinalIgnoreCase);

        private static bool IsReturnEventType(string? eventType) => string.Equals(eventType, "Return", StringComparison.OrdinalIgnoreCase);

        private sealed record ToolMetrics(
            int TotalBorrowCount,
            DateTime? LastBorrowedDate,
            int OverdueCount,
            int TotalRepairCount,
            decimal TotalRepairCost,
            bool? LastRepairStatus,
            decimal RepairCostRatio,
            DateTime? LastQcDate,
            bool? LastQcPassed,
            bool IsUsable,
            string UsabilityReason);
    }
}

