namespace Session001.Data.DTOs;

public class ProductDto
{
    public int ProductID { get; set; }
    public string Name { get; set; } = string.Empty;
    public string ProductNumber { get; set; } = string.Empty;
    public decimal ListPrice { get; set; }
    public string? Color { get; set; }
    public string? Size { get; set; }
    public DateTime SellStartDate { get; set; }
    public DateTime? SellEndDate { get; set; }
    public bool IsActive => !SellEndDate.HasValue || SellEndDate.Value > DateTime.Now;
}
