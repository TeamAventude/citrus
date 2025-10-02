using Session001.Data.DTOs;

namespace Session001.Services.Interfaces;

public interface IProductService
{
    /// <summary>
    /// Get all products with pagination and filtering
    /// </summary>
    /// <param name="pageNumber">Page number (default: 1)</param>
    /// <param name="pageSize">Page size (default: 20, max: 100)</param>
    /// <param name="searchTerm">Search term for product name or number</param>
    /// <param name="activeOnly">Filter to show only active products (default: true)</param>
    /// <returns>List of products</returns>
    Task<List<ProductDto>> GetProductsAsync(int pageNumber = 1, int pageSize = 20, string? searchTerm = null, bool activeOnly = true);

    /// <summary>
    /// Get a specific product by ID
    /// </summary>
    /// <param name="id">Product ID</param>
    /// <returns>Product details or null if not found</returns>
    Task<ProductDto?> GetProductByIdAsync(int id);

    /// <summary>
    /// Search products by name or product number
    /// </summary>
    /// <param name="searchTerm">Search term</param>
    /// <param name="limit">Maximum number of results (default: 10, max: 50)</param>
    /// <returns>List of matching products</returns>
    Task<List<ProductDto>> SearchProductsAsync(string searchTerm, int limit = 10);

    /// <summary>
    /// Check if a product exists
    /// </summary>
    /// <param name="id">Product ID</param>
    /// <returns>True if product exists, false otherwise</returns>
    Task<bool> ProductExistsAsync(int id);
}