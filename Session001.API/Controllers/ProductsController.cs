using Microsoft.AspNetCore.Mvc;
using Session001.Data.DTOs;
using Session001.Services.Interfaces;

namespace Session001.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ProductsController : ControllerBase
{
    private readonly IProductService _productService;
    private readonly ILogger<ProductsController> _logger;

    public ProductsController(IProductService productService, ILogger<ProductsController> logger)
    {
        _productService = productService;
        _logger = logger;
    }

    /// <summary>
    /// Get all products with basic information
    /// </summary>
    /// <param name="pageNumber">Page number (default: 1)</param>
    /// <param name="pageSize">Page size (default: 20, max: 100)</param>
    /// <param name="searchTerm">Search term for product name or number</param>
    /// <param name="activeOnly">Filter to show only active products (default: true)</param>
    /// <returns>List of products</returns>
    [HttpGet]
    public async Task<ActionResult<List<ProductDto>>> GetProducts(
        [FromQuery] int pageNumber = 1,
        [FromQuery] int pageSize = 20,
        [FromQuery] string? searchTerm = null,
        [FromQuery] bool activeOnly = true)
    {
        try
        {
            var products = await _productService.GetProductsAsync(pageNumber, pageSize, searchTerm, activeOnly);
            return Ok(products);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error occurred while retrieving products");
            return StatusCode(500, "An error occurred while processing the request.");
        }
    }

    /// <summary>
    /// Get a specific product by ID
    /// </summary>
    /// <param name="id">Product ID</param>
    /// <returns>Product details</returns>
    [HttpGet("{id}")]
    public async Task<ActionResult<ProductDto>> GetProduct(int id)
    {
        try
        {
            if (id <= 0)
            {
                return BadRequest("Product ID must be greater than 0.");
            }

            var product = await _productService.GetProductByIdAsync(id);

            if (product == null)
            {
                return NotFound($"Product with ID {id} not found.");
            }

            return Ok(product);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error occurred while retrieving product {ProductId}", id);
            return StatusCode(500, "An error occurred while processing the request.");
        }
    }

    /// <summary>
    /// Search products by name or product number
    /// </summary>
    /// <param name="searchTerm">Search term</param>
    /// <param name="limit">Maximum number of results (default: 10, max: 50)</param>
    /// <returns>List of matching products</returns>
    [HttpGet("search")]
    public async Task<ActionResult<List<ProductDto>>> SearchProducts(
        [FromQuery] string searchTerm,
        [FromQuery] int limit = 10)
    {
        try
        {
            if (string.IsNullOrEmpty(searchTerm))
            {
                return BadRequest("Search term cannot be empty.");
            }

            var products = await _productService.SearchProductsAsync(searchTerm, limit);
            return Ok(products);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error occurred while searching products with term '{SearchTerm}'", searchTerm);
            return StatusCode(500, "An error occurred while processing the request.");
        }
    }
}
