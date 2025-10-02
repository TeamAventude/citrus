using System;
using System.Collections.Generic;

namespace Session001.DTOs
{
    public class ToolDto
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string ToolNumber { get; set; } = string.Empty;
        public decimal ProcurementPrice { get; set; }
        public DateTime ProcurementDate { get; set; }
        public string CurrentStatus { get; set; } = string.Empty;
        public bool IsUsable { get; set; }
        public DateTime? LastQCDate { get; set; }
        public bool? LastQCPassed { get; set; }
        public decimal TotalRepairCost { get; set; }
        public int TotalRepairCount { get; set; }
        public int TotalBorrowCount { get; set; }
        public int OverdueCount { get; set; }
        public DateTime? LastBorrowedDate { get; set; }
        public DateTime CreatedDate { get; set; }
        public DateTime ModifiedDate { get; set; }
    }

    public class ToolHistoryDto
    {
        public int Id { get; set; }
        public string EventType { get; set; } = string.Empty;
        public DateTime EventDate { get; set; }
        public string UserId { get; set; } = string.Empty;
        public string UserName { get; set; } = string.Empty;
        public string? ProjectNumber { get; set; }
        public string? PurchaseOrderNumber { get; set; }
        public decimal? Cost { get; set; }
        public string? Notes { get; set; }
        public bool? QCPassed { get; set; }
        public bool? RepairPassed { get; set; }
        public DateTime? DueDate { get; set; }
        public bool IsOverdue { get; set; }
    }

    public class ToolHistoryFilterDto
    {
        public DateTime? StartDate { get; set; }
        public DateTime? EndDate { get; set; }
        public string? EventType { get; set; }
    }

    public class ToolAnalyticsDto
    {
        public BorrowingAnalytics BorrowingHistory { get; set; } = new();
        public RepairAnalytics RepairHistory { get; set; } = new();
        public bool IsUsable { get; set; }
        public string UsabilityReason { get; set; } = string.Empty;
    }

    public class BorrowingAnalytics
    {
        public int TotalBorrowCount { get; set; }
        public DateTime? LastBorrowedDate { get; set; }
        public int OverdueCount { get; set; }
    }

    public class RepairAnalytics
    {
        public int TotalRepairCount { get; set; }
        public decimal TotalRepairCost { get; set; }
        public bool? LastRepairStatus { get; set; }
        public decimal RepairCostPercentage { get; set; }
    }

    public class ToolHistoryResponseDto
    {
        public ToolDto Tool { get; set; } = null!;
        public List<ToolHistoryDto> History { get; set; } = new();
        public ToolAnalyticsDto Analytics { get; set; } = new();
    }
}