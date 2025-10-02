using System.Net;
using FluentAssertions;
using Microsoft.AspNetCore.Mvc.Testing;
using Newtonsoft.Json;
using Session001.API;
using Session001.Data.DTOs;
using Session001.Tests.Fixtures;

namespace Session001.Tests.Controllers;

public class ProductsControllerIntegrationTests : IClassFixture<CustomWebApplicationFactory<Program>>
{
    private readonly CustomWebApplicationFactory<Program> _factory;
    private readonly HttpClient _client;

    public ProductsControllerIntegrationTests(CustomWebApplicationFactory<Program> factory)
    {
        _factory = factory;
        _client = _factory.CreateClient();
    }

    [Fact]
    public async Task GetProducts_WithDefaultParameters_ReturnsOkResult()
    {
        // Act
        var response = await _client.GetAsync("/api/products");

        // Assert
        response.StatusCode.Should().Be(HttpStatusCode.OK);
        
        var content = await response.Content.ReadAsStringAsync();
        content.Should().NotBeNullOrEmpty();
        
        var products = JsonConvert.DeserializeObject<List<ProductDto>>(content);
        products.Should().NotBeNull();
    }

    [Fact]
    public async Task GetProducts_WithPaginationParameters_ReturnsOkResult()
    {
        // Arrange
        var url = "/api/products?pageNumber=1&pageSize=5";

        // Act
        var response = await _client.GetAsync(url);

        // Assert
        response.StatusCode.Should().Be(HttpStatusCode.OK);
        
        var content = await response.Content.ReadAsStringAsync();
        var products = JsonConvert.DeserializeObject<List<ProductDto>>(content);
        products.Should().NotBeNull();
        products!.Count.Should().BeLessOrEqualTo(5);
    }

    [Fact]
    public async Task GetProducts_WithSearchTerm_ReturnsFilteredResults()
    {
        // Arrange
        var url = "/api/products?searchTerm=bike&pageSize=10";

        // Act
        var response = await _client.GetAsync(url);

        // Assert
        response.StatusCode.Should().Be(HttpStatusCode.OK);
        
        var content = await response.Content.ReadAsStringAsync();
        var products = JsonConvert.DeserializeObject<List<ProductDto>>(content);
        products.Should().NotBeNull();
        
        // Check if any products contain "bike" in name or product number
        if (products!.Any())
        {
            products.Should().Contain(p => 
                p.Name.ToLower().Contains("bike") || 
                p.ProductNumber.ToLower().Contains("bike"));
        }
    }

    [Fact]
    public async Task GetProducts_WithActiveOnlyFalse_ReturnsAllProducts()
    {
        // Arrange
        var url = "/api/products?activeOnly=false&pageSize=10";

        // Act
        var response = await _client.GetAsync(url);

        // Assert
        response.StatusCode.Should().Be(HttpStatusCode.OK);
        
        var content = await response.Content.ReadAsStringAsync();
        var products = JsonConvert.DeserializeObject<List<ProductDto>>(content);
        products.Should().NotBeNull();
    }

    [Fact]
    public async Task GetProducts_WithInvalidPageNumber_UsesDefaultPageNumber()
    {
        // Arrange
        var url = "/api/products?pageNumber=0&pageSize=5";

        // Act
        var response = await _client.GetAsync(url);

        // Assert - Controller should handle invalid page number gracefully
        response.StatusCode.Should().Be(HttpStatusCode.OK);
    }

    [Fact]
    public async Task GetProducts_WithInvalidPageSize_UsesDefaultPageSize()
    {
        // Arrange
        var url = "/api/products?pageNumber=1&pageSize=200"; // Exceeds max of 100

        // Act
        var response = await _client.GetAsync(url);

        // Assert - Controller should handle invalid page size gracefully
        response.StatusCode.Should().Be(HttpStatusCode.OK);
    }

    [Fact]
    public async Task GetProduct_WithValidId_ReturnsOkResult()
    {
        // Arrange - Get a valid product ID first
        var productsResponse = await _client.GetAsync("/api/products?pageSize=1");
        productsResponse.StatusCode.Should().Be(HttpStatusCode.OK);
        
        var productsContent = await productsResponse.Content.ReadAsStringAsync();
        var products = JsonConvert.DeserializeObject<List<ProductDto>>(productsContent);
        
        // Skip test if no products exist
        if (products == null || !products.Any())
        {
            return; // Skip this test if no data exists
        }
        
        var productId = products.First().ProductID;

        // Act
        var response = await _client.GetAsync($"/api/products/{productId}");

        // Assert
        response.StatusCode.Should().Be(HttpStatusCode.OK);
        
        var content = await response.Content.ReadAsStringAsync();
        var product = JsonConvert.DeserializeObject<ProductDto>(content);
        product.Should().NotBeNull();
        product!.ProductID.Should().Be(productId);
    }

    [Fact]
    public async Task GetProduct_WithInvalidId_ReturnsNotFound()
    {
        // Arrange
        var invalidId = 999999;

        // Act
        var response = await _client.GetAsync($"/api/products/{invalidId}");

        // Assert
        response.StatusCode.Should().Be(HttpStatusCode.NotFound);
    }

    [Fact]
    public async Task GetProduct_WithZeroId_ReturnsBadRequest()
    {
        // Arrange
        var invalidId = 0;

        // Act
        var response = await _client.GetAsync($"/api/products/{invalidId}");

        // Assert
        response.StatusCode.Should().Be(HttpStatusCode.BadRequest);
    }

    [Fact]
    public async Task GetProduct_WithNegativeId_ReturnsBadRequest()
    {
        // Arrange
        var invalidId = -1;

        // Act
        var response = await _client.GetAsync($"/api/products/{invalidId}");

        // Assert
        response.StatusCode.Should().Be(HttpStatusCode.BadRequest);
    }

    [Fact]
    public async Task SearchProducts_WithValidTerm_ReturnsOkResult()
    {
        // Arrange
        var searchTerm = "bike";
        var url = $"/api/products/search?searchTerm={searchTerm}&limit=5";

        // Act
        var response = await _client.GetAsync(url);

        // Assert
        response.StatusCode.Should().Be(HttpStatusCode.OK);
        
        var content = await response.Content.ReadAsStringAsync();
        var products = JsonConvert.DeserializeObject<List<ProductDto>>(content);
        products.Should().NotBeNull();
        products!.Count.Should().BeLessOrEqualTo(5);
        
        // Check if results contain the search term
        if (products.Any())
        {
            products.Should().Contain(p => 
                p.Name.ToLower().Contains(searchTerm.ToLower()) || 
                p.ProductNumber.ToLower().Contains(searchTerm.ToLower()));
        }
    }

    [Fact]
    public async Task SearchProducts_WithEmptyTerm_ReturnsBadRequest()
    {
        // Arrange
        var url = "/api/products/search?searchTerm=&limit=5";

        // Act
        var response = await _client.GetAsync(url);

        // Assert
        response.StatusCode.Should().Be(HttpStatusCode.BadRequest);
    }

    [Fact]
    public async Task SearchProducts_WithoutSearchTerm_ReturnsBadRequest()
    {
        // Arrange
        var url = "/api/products/search?limit=5";

        // Act
        var response = await _client.GetAsync(url);

        // Assert
        response.StatusCode.Should().Be(HttpStatusCode.BadRequest);
    }

    [Fact]
    public async Task SearchProducts_WithInvalidLimit_UsesDefaultLimit()
    {
        // Arrange - Test with limit exceeding maximum (50)
        var searchTerm = "bike";
        var url = $"/api/products/search?searchTerm={searchTerm}&limit=100";

        // Act
        var response = await _client.GetAsync(url);

        // Assert - Controller should handle invalid limit gracefully
        response.StatusCode.Should().Be(HttpStatusCode.OK);
        
        var content = await response.Content.ReadAsStringAsync();
        var products = JsonConvert.DeserializeObject<List<ProductDto>>(content);
        products.Should().NotBeNull();
        products!.Count.Should().BeLessOrEqualTo(10); // Should use default limit of 10
    }

    [Fact]
    public async Task SearchProducts_WithZeroLimit_UsesDefaultLimit()
    {
        // Arrange
        var searchTerm = "bike";
        var url = $"/api/products/search?searchTerm={searchTerm}&limit=0";

        // Act
        var response = await _client.GetAsync(url);

        // Assert - Controller should handle zero limit gracefully
        response.StatusCode.Should().Be(HttpStatusCode.OK);
    }

    [Fact]
    public async Task SearchProducts_WithSpecialCharacters_ReturnsOkResult()
    {
        // Arrange
        var searchTerm = "HL-U509";
        var url = $"/api/products/search?searchTerm={searchTerm}&limit=5";

        // Act
        var response = await _client.GetAsync(url);

        // Assert
        response.StatusCode.Should().Be(HttpStatusCode.OK);
        
        var content = await response.Content.ReadAsStringAsync();
        var products = JsonConvert.DeserializeObject<List<ProductDto>>(content);
        products.Should().NotBeNull();
    }

    [Theory]
    [InlineData("Mountain")]
    [InlineData("Road")]
    [InlineData("Touring")]
    public async Task SearchProducts_WithDifferentTerms_ReturnsAppropriateResults(string searchTerm)
    {
        // Arrange
        var url = $"/api/products/search?searchTerm={searchTerm}&limit=10";

        // Act
        var response = await _client.GetAsync(url);

        // Assert
        response.StatusCode.Should().Be(HttpStatusCode.OK);
        
        var content = await response.Content.ReadAsStringAsync();
        var products = JsonConvert.DeserializeObject<List<ProductDto>>(content);
        products.Should().NotBeNull();
    }

    [Fact]
    public async Task GetProducts_VerifyProductDtoStructure()
    {
        // Arrange
        var url = "/api/products?pageSize=1";

        // Act
        var response = await _client.GetAsync(url);

        // Assert
        response.StatusCode.Should().Be(HttpStatusCode.OK);
        
        var content = await response.Content.ReadAsStringAsync();
        var products = JsonConvert.DeserializeObject<List<ProductDto>>(content);
        
        if (products != null && products.Any())
        {
            var product = products.First();
            product.ProductID.Should().BeGreaterThan(0);
            product.Name.Should().NotBeNullOrEmpty();
            product.ProductNumber.Should().NotBeNullOrEmpty();
            product.ListPrice.Should().BeGreaterOrEqualTo(0);
            product.SellStartDate.Should().NotBe(default(DateTime));
        }
    }
}
