using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Session001.Data.Entities
{
    [Table("Tool")]
    public class Tool
    {
        [Key]
        public int Id { get; set; }

        [Required]
        [StringLength(100)]
        public string Name { get; set; } = string.Empty;

        [Required]
        [StringLength(50)]
        public string ToolNumber { get; set; } = string.Empty;

        [Column(TypeName = "decimal(18,2)")]
        public decimal ProcurementPrice { get; set; }

        public DateTime ProcurementDate { get; set; }

        [Required]
        [StringLength(200)]
        public string CurrentStatus { get; set; } = string.Empty;

        public bool IsUsable { get; set; }

        [Column(TypeName = "decimal(18,2)")]
        public decimal TotalRepairCost { get; set; }

        public int TotalRepairCount { get; set; }

        public int TotalBorrowCount { get; set; }

        public int OverdueCount { get; set; }

        public DateTime? LastBorrowedDate { get; set; }

        public DateTime CreatedDate { get; set; }

        public DateTime ModifiedDate { get; set; }

        // Navigation property
        public virtual ICollection<ToolHistory> History { get; set; } = new List<ToolHistory>();
    }
}