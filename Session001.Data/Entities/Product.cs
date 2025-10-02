using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Session001.Data.Entities;

[Table("Product")]
public class Product
{
    [Key]
    public int ProductID { get; set; }

    [Required]
    [StringLength(50)]
    public string Name { get; set; } = string.Empty;

    [Required]
    [StringLength(25)]
    public string ProductNumber { get; set; } = string.Empty;

    public bool MakeFlag { get; set; }

    public bool FinishedGoodsFlag { get; set; }

    [StringLength(15)]
    public string? Color { get; set; }

    public short SafetyStockLevel { get; set; }

    public short ReorderPoint { get; set; }

    [Column(TypeName = "money")]
    public decimal StandardCost { get; set; }

    [Column(TypeName = "money")]
    public decimal ListPrice { get; set; }

    [StringLength(5)]
    public string? Size { get; set; }

    [StringLength(3)]
    public string? SizeUnitMeasureCode { get; set; }

    [StringLength(3)]
    public string? WeightUnitMeasureCode { get; set; }

    [Column(TypeName = "decimal(8,2)")]
    public decimal? Weight { get; set; }

    public int DaysToManufacture { get; set; }

    [StringLength(2)]
    public string? ProductLine { get; set; }

    [StringLength(2)]
    public string? Class { get; set; }

    [StringLength(2)]
    public string? Style { get; set; }

    public int? ProductSubcategoryID { get; set; }

    public int? ProductModelID { get; set; }

    public DateTime SellStartDate { get; set; }

    public DateTime? SellEndDate { get; set; }

    public DateTime? DiscontinuedDate { get; set; }

    public Guid rowguid { get; set; }

    public DateTime ModifiedDate { get; set; }
}
