using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Session001.Data;
using Session001.Data.DTOs;
using Session001.Services.Interfaces;

namespace Session001.Services.Implementations;

public class ProductService : IProductService
{
    private readonly ApplicationDbContext _context;
    private readonly ILogger<ProductService> _logger;

    public ProductService(ApplicationDbContext context, ILogger<ProductService> logger)
    {
        _context = context;
        _logger = logger;
    }

    public async Task<List<ProductDto>> GetProductsAsync(int pageNumber = 1, int pageSize = 20, string? searchTerm = null, bool activeOnly = true)
    {
        try
        {
            // Validate parameters
            if (pageNumber < 1) pageNumber = 1;
            if (pageSize < 1 || pageSize > 100) pageSize = 20;

            var query = _context.Products.AsQueryable();

            // Apply search filter
            if (!string.IsNullOrEmpty(searchTerm))
            {
                query = query.Where(p => p.Name.Contains(searchTerm) || p.ProductNumber.Contains(searchTerm));
            }

            // Apply active filter
            if (activeOnly)
            {
                query = query.Where(p => p.SellEndDate == null || p.SellEndDate > DateTime.Now);
            }

            var products = await query
                .OrderBy(p => p.Name)
                .Skip((pageNumber - 1) * pageSize)
                .Take(pageSize)
                .Select(p => new ProductDto
                {
                    ProductID = p.ProductID,
                    Name = p.Name,
                    ProductNumber = p.ProductNumber,
                    ListPrice = p.ListPrice,
                    Color = p.Color,
                    Size = p.Size,
                    SellStartDate = p.SellStartDate,
                    SellEndDate = p.SellEndDate
                })
                .ToListAsync();

            _logger.LogInformation("Retrieved {ProductCount} products (page {PageNumber}, size {PageSize})", 
                products.Count, pageNumber, pageSize);

            return products;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error occurred while retrieving products");
            throw;
        }
    }

    public async Task<ProductDto?> GetProductByIdAsync(int id)
    {
        try
        {
            if (id <= 0)
            {
                return null;
            }

            var product = await _context.Products
                .Where(p => p.ProductID == id)
                .Select(p => new ProductDto
                {
                    ProductID = p.ProductID,
                    Name = p.Name,
                    ProductNumber = p.ProductNumber,
                    ListPrice = p.ListPrice,
                    Color = p.Color,
                    Size = p.Size,
                    SellStartDate = p.SellStartDate,
                    SellEndDate = p.SellEndDate
                })
                .FirstOrDefaultAsync();

            if (product != null)
            {
                _logger.LogInformation("Retrieved product {ProductId}", id);
            }

            return product;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error occurred while retrieving product {ProductId}", id);
            throw;
        }
    }

    public async Task<List<ProductDto>> SearchProductsAsync(string searchTerm, int limit = 10)
    {
        try
        {
            if (string.IsNullOrEmpty(searchTerm))
            {
                return new List<ProductDto>();
            }

            if (limit < 1 || limit > 50) limit = 10;

            var products = await _context.Products
                .Where(p => p.Name.Contains(searchTerm) || p.ProductNumber.Contains(searchTerm))
                .OrderBy(p => p.Name)
                .Take(limit)
                .Select(p => new ProductDto
                {
                    ProductID = p.ProductID,
                    Name = p.Name,
                    ProductNumber = p.ProductNumber,
                    ListPrice = p.ListPrice,
                    Color = p.Color,
                    Size = p.Size,
                    SellStartDate = p.SellStartDate,
                    SellEndDate = p.SellEndDate
                })
                .ToListAsync();

            _logger.LogInformation("Found {ProductCount} products matching search term '{SearchTerm}'", 
                products.Count, searchTerm);

            return products;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error occurred while searching products with term '{SearchTerm}'", searchTerm);
            throw;
        }
    }

    public async Task<bool> ProductExistsAsync(int id)
    {
        try
        {
            if (id <= 0)
            {
                return false;
            }

            return await _context.Products.AnyAsync(p => p.ProductID == id);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error occurred while checking if product {ProductId} exists", id);
            throw;
        }
    }
}