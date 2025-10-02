using Microsoft.Extensions.Logging;
using Moq;
using FluentAssertions;
using Session001.Data.DTOs;
using Session001.Data.Entities;
using Session001.Services.Implementations;
using Session001.Services.Interfaces;

namespace Session001.Tests.Services;

public class ProductServiceTests : BaseServiceTest
{
    private readonly Mock<ILogger<ProductService>> _loggerMock;
    private readonly IProductService _productService;

    public ProductServiceTests()
    {
        _loggerMock = CreateLoggerMock<ProductService>();
        _productService = new ProductService(Context, _loggerMock.Object);

        // Seed test data
        SeedTestData();
    }

    private void SeedTestData()
    {
        var products = new List<Product>
        {
            new Product
            {
                ProductID = 1,
                Name = "Test Product 1",
                ProductNumber = "TP-001",
                ListPrice = 19.99m,
                Color = "Red",
                Size = "M",
                SellStartDate = DateTime.Now.AddDays(-30),
                SellEndDate = null, // Active product
                MakeFlag = true,
                FinishedGoodsFlag = true,
                SafetyStockLevel = 100,
                ReorderPoint = 50,
                StandardCost = 10.00m,
                DaysToManufacture = 5,
                rowguid = Guid.NewGuid(),
                ModifiedDate = DateTime.Now
            },
            new Product
            {
                ProductID = 2,
                Name = "Test Product 2",
                ProductNumber = "TP-002",
                ListPrice = 29.99m,
                Color = "Blue",
                Size = "L",
                SellStartDate = DateTime.Now.AddDays(-60),
                SellEndDate = DateTime.Now.AddDays(-10), // Inactive product
                MakeFlag = true,
                FinishedGoodsFlag = true,
                SafetyStockLevel = 75,
                ReorderPoint = 25,
                StandardCost = 15.00m,
                DaysToManufacture = 3,
                rowguid = Guid.NewGuid(),
                ModifiedDate = DateTime.Now
            },
            new Product
            {
                ProductID = 3,
                Name = "Another Product",
                ProductNumber = "AP-003",
                ListPrice = 39.99m,
                Color = "Green",
                Size = "S",
                SellStartDate = DateTime.Now.AddDays(-15),
                SellEndDate = null, // Active product
                MakeFlag = true,
                FinishedGoodsFlag = true,
                SafetyStockLevel = 50,
                ReorderPoint = 20,
                StandardCost = 20.00m,
                DaysToManufacture = 7,
                rowguid = Guid.NewGuid(),
                ModifiedDate = DateTime.Now
            }
        };

        Context.Products.AddRange(products);
        Context.SaveChanges();
    }

    #region GetProductsAsync Tests

    [Fact]
    public async Task GetProductsAsync_WithDefaultParameters_ShouldReturnActiveProducts()
    {
        // Act
        var result = await _productService.GetProductsAsync();

        // Assert
        result.Should().NotBeNull();
        result.Should().HaveCount(2); // Only active products
        result.All(p => p.IsActive).Should().BeTrue();
        result.Should().BeInAscendingOrder(p => p.Name);
    }

    [Fact]
    public async Task GetProductsAsync_WithActiveOnlyFalse_ShouldReturnAllProducts()
    {
        // Act
        var result = await _productService.GetProductsAsync(activeOnly: false);

        // Assert
        result.Should().NotBeNull();
        result.Should().HaveCount(3); // All products
    }

    [Fact]
    public async Task GetProductsAsync_WithSearchTerm_ShouldReturnMatchingProducts()
    {
        // Act
        var result = await _productService.GetProductsAsync(searchTerm: "Test");

        // Assert
        result.Should().NotBeNull();
        result.Should().HaveCount(1); // Only "Test Product 1" is active
        result.First().Name.Should().Contain("Test");
    }

    [Fact]
    public async Task GetProductsAsync_WithProductNumberSearch_ShouldReturnMatchingProduct()
    {
        // Act
        var result = await _productService.GetProductsAsync(searchTerm: "TP-001");

        // Assert
        result.Should().NotBeNull();
        result.Should().HaveCount(1);
        result.First().ProductNumber.Should().Be("TP-001");
    }

    [Fact]
    public async Task GetProductsAsync_WithPagination_ShouldReturnCorrectPage()
    {
        // Act
        var result = await _productService.GetProductsAsync(pageNumber: 1, pageSize: 1);

        // Assert
        result.Should().NotBeNull();
        result.Should().HaveCount(1);
    }

    [Theory]
    [InlineData(0, 20)] // Invalid page number
    [InlineData(1, 0)]  // Invalid page size
    [InlineData(1, 200)] // Page size too large
    public async Task GetProductsAsync_WithInvalidParameters_ShouldUseDefaults(
        int pageNumber, int pageSize)
    {
        // Act
        var result = await _productService.GetProductsAsync(pageNumber, pageSize);

        // Assert
        result.Should().NotBeNull();
        // Verify that the method handles invalid parameters gracefully
    }

    [Fact]
    public async Task GetProductsAsync_ShouldLogInformation()
    {
        // Act
        await _productService.GetProductsAsync();

        // Assert
        VerifyLogCalled(_loggerMock, LogLevel.Information, "Retrieved", Moq.Times.Once());
    }

    #endregion

    #region GetProductByIdAsync Tests

    [Fact]
    public async Task GetProductByIdAsync_WithValidId_ShouldReturnProduct()
    {
        // Act
        var result = await _productService.GetProductByIdAsync(1);

        // Assert
        result.Should().NotBeNull();
        result!.ProductID.Should().Be(1);
        result.Name.Should().Be("Test Product 1");
        result.ProductNumber.Should().Be("TP-001");
    }

    [Fact]
    public async Task GetProductByIdAsync_WithNonExistentId_ShouldReturnNull()
    {
        // Act
        var result = await _productService.GetProductByIdAsync(999);

        // Assert
        result.Should().BeNull();
    }

    [Theory]
    [InlineData(0)]
    [InlineData(-1)]
    [InlineData(-100)]
    public async Task GetProductByIdAsync_WithInvalidId_ShouldReturnNull(int invalidId)
    {
        // Act
        var result = await _productService.GetProductByIdAsync(invalidId);

        // Assert
        result.Should().BeNull();
    }

    [Fact]
    public async Task GetProductByIdAsync_WithValidId_ShouldLogInformation()
    {
        // Act
        await _productService.GetProductByIdAsync(1);

        // Assert
        VerifyLogCalled(_loggerMock, LogLevel.Information, "Retrieved product", Moq.Times.Once());
    }

    #endregion

    #region SearchProductsAsync Tests

    [Fact]
    public async Task SearchProductsAsync_WithValidSearchTerm_ShouldReturnMatchingProducts()
    {
        // Act
        var result = await _productService.SearchProductsAsync("Test");

        // Assert
        result.Should().NotBeNull();
        result.Should().HaveCount(2); // Both test products (including inactive)
        result.All(p => p.Name.Contains("Test") || p.ProductNumber.Contains("Test")).Should().BeTrue();
    }

    [Fact]
    public async Task SearchProductsAsync_WithProductNumber_ShouldReturnMatchingProduct()
    {
        // Act
        var result = await _productService.SearchProductsAsync("AP-003");

        // Assert
        result.Should().NotBeNull();
        result.Should().HaveCount(1);
        result.First().ProductNumber.Should().Be("AP-003");
    }

    [Theory]
    [InlineData("")]
    [InlineData(null)]
    public async Task SearchProductsAsync_WithEmptySearchTerm_ShouldReturnEmptyList(string? searchTerm)
    {
        // Act
        var result = await _productService.SearchProductsAsync(searchTerm!);

        // Assert
        result.Should().NotBeNull();
        result.Should().BeEmpty();
    }

    [Fact]
    public async Task SearchProductsAsync_WithLimit_ShouldRespectLimit()
    {
        // Act
        var result = await _productService.SearchProductsAsync("Product", limit: 1);

        // Assert
        result.Should().NotBeNull();
        result.Should().HaveCount(1);
    }

    [Theory]
    [InlineData(0)]   // Invalid limit
    [InlineData(-1)]  // Invalid limit
    [InlineData(100)] // Limit too large
    public async Task SearchProductsAsync_WithInvalidLimit_ShouldUseDefault(int limit)
    {
        // Act
        var result = await _productService.SearchProductsAsync("Product", limit);

        // Assert
        result.Should().NotBeNull();
        // The method should handle invalid limits gracefully
    }

    [Fact]
    public async Task SearchProductsAsync_ShouldLogInformation()
    {
        // Act
        await _productService.SearchProductsAsync("Test");

        // Assert
        VerifyLogCalled(_loggerMock, LogLevel.Information, "Found", Moq.Times.Once());
    }

    #endregion

    #region ProductExistsAsync Tests

    [Fact]
    public async Task ProductExistsAsync_WithExistingProduct_ShouldReturnTrue()
    {
        // Act
        var result = await _productService.ProductExistsAsync(1);

        // Assert
        result.Should().BeTrue();
    }

    [Fact]
    public async Task ProductExistsAsync_WithNonExistentProduct_ShouldReturnFalse()
    {
        // Act
        var result = await _productService.ProductExistsAsync(999);

        // Assert
        result.Should().BeFalse();
    }

    [Theory]
    [InlineData(0)]
    [InlineData(-1)]
    [InlineData(-100)]
    public async Task ProductExistsAsync_WithInvalidId_ShouldReturnFalse(int invalidId)
    {
        // Act
        var result = await _productService.ProductExistsAsync(invalidId);

        // Assert
        result.Should().BeFalse();
    }

    #endregion

    #region Error Handling Tests

    [Fact]
    public async Task GetProductsAsync_WhenDatabaseThrowsException_ShouldLogErrorAndRethrow()
    {
        // Arrange
        await Context.Database.EnsureDeletedAsync(); // Force database error
        await Context.DisposeAsync();

        // Act & Assert
        await Assert.ThrowsAsync<ObjectDisposedException>(() => 
            _productService.GetProductsAsync());

        VerifyLogCalledWithException(_loggerMock, LogLevel.Error, "Error occurred while retrieving products");
    }

    #endregion

    #region Data Transfer Object Mapping Tests

    [Fact]
    public async Task GetProductByIdAsync_ShouldMapAllDtoProperties()
    {
        // Act
        var result = await _productService.GetProductByIdAsync(1);

        // Assert
        result.Should().NotBeNull();
        result!.ProductID.Should().Be(1);
        result.Name.Should().Be("Test Product 1");
        result.ProductNumber.Should().Be("TP-001");
        result.ListPrice.Should().Be(19.99m);
        result.Color.Should().Be("Red");
        result.Size.Should().Be("M");
        result.SellStartDate.Should().BeCloseTo(DateTime.Now.AddDays(-30), TimeSpan.FromMinutes(1));
        result.SellEndDate.Should().BeNull();
        result.IsActive.Should().BeTrue();
    }

    [Fact]
    public async Task GetProductByIdAsync_WithInactiveProduct_ShouldMapCorrectly()
    {
        // Act
        var result = await _productService.GetProductByIdAsync(2);

        // Assert
        result.Should().NotBeNull();
        result!.ProductID.Should().Be(2);
        result.IsActive.Should().BeFalse();
        result.SellEndDate.Should().NotBeNull();
    }

    #endregion


}