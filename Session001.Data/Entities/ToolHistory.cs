using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Session001.Data.Entities
{
    [Table("ToolHistory")]
    public class ToolHistory
    {
        [Key]
        public int Id { get; set; }

        public int ToolId { get; set; }

        [Required]
        [StringLength(50)]
        public string EventType { get; set; } = string.Empty; // Procurement, Borrowing, Return, QC, Repair

        public DateTime EventDate { get; set; }

        [Required]
        [StringLength(100)]
        public string UserId { get; set; } = string.Empty;

        [Required]
        [StringLength(50)]
        public string UserName { get; set; } = string.Empty;

        [StringLength(50)]
        public string? ProjectNumber { get; set; }

        [StringLength(50)]
        public string? PurchaseOrderNumber { get; set; }

        [Column(TypeName = "decimal(18,2)")]
        public decimal? Cost { get; set; }

        [StringLength(500)]
        public string? Notes { get; set; }

        public bool? QCPassed { get; set; }

        public bool? RepairPassed { get; set; }

        public DateTime? DueDate { get; set; }

        public bool IsOverdue { get; set; }

        public DateTime CreatedDate { get; set; }

        // Navigation property
        [ForeignKey("ToolId")]
        public virtual Tool Tool { get; set; } = null!;
    }
}