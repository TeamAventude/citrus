using Microsoft.Extensions.Logging;
using Moq;
using FluentAssertions;
using Session001.Data.Entities;
using Session001.Services.Implementations;
using Session001.Services.Interfaces;
using System.Diagnostics;

namespace Session001.Tests.Services;

/// <summary>
/// Performance and load tests for ProductService to ensure it can handle large datasets efficiently
/// </summary>
public class ProductServicePerformanceTests : BaseServiceTest
{
    private readonly Mock<ILogger<ProductService>> _loggerMock;
    private readonly IProductService _productService;

    public ProductServicePerformanceTests()
    {
        _loggerMock = CreateLoggerMock<ProductService>();
        _productService = new ProductService(Context, _loggerMock.Object);
    }

    [Fact]
    public async Task GetProductsAsync_WithLargeDataset_ShouldPerformWithinReasonableTime()
    {
        // Arrange
        await SeedLargeDataset(1000);
        var stopwatch = new Stopwatch();

        // Act
        stopwatch.Start();
        var result = await _productService.GetProductsAsync(pageNumber: 1, pageSize: 50);
        stopwatch.Stop();

        // Assert
        result.Should().HaveCount(50);
        stopwatch.ElapsedMilliseconds.Should().BeLessThan(5000); // Should complete within 5 seconds
    }

    [Fact]
    public async Task SearchProductsAsync_WithLargeDataset_ShouldPerformWithinReasonableTime()
    {
        // Arrange
        await SeedLargeDataset(1000);
        var stopwatch = new Stopwatch();

        // Act
        stopwatch.Start();
        var result = await _productService.SearchProductsAsync("Product", limit: 10);
        stopwatch.Stop();

        // Assert
        result.Should().HaveCountLessThanOrEqualTo(10);
        stopwatch.ElapsedMilliseconds.Should().BeLessThan(3000); // Should complete within 3 seconds
    }

    [Fact]
    public async Task GetProductsAsync_WithDifferentPageSizes_ShouldReturnConsistentResults()
    {
        // Arrange
        await SeedLargeDataset(100);

        // Act
        var page1Size20 = await _productService.GetProductsAsync(1, 20);
        var page2Size20 = await _productService.GetProductsAsync(2, 20);
        var page1Size40 = await _productService.GetProductsAsync(1, 40);

        // Assert
        page1Size20.Should().HaveCount(20);
        page2Size20.Should().HaveCount(20);
        page1Size40.Should().HaveCount(40);

        // First 20 items should be the same
        for (int i = 0; i < 20; i++)
        {
            page1Size20[i].ProductID.Should().Be(page1Size40[i].ProductID);
        }

        // Next 20 items should match second page
        for (int i = 0; i < 20; i++)
        {
            page2Size20[i].ProductID.Should().Be(page1Size40[i + 20].ProductID);
        }
    }

    [Fact]
    public async Task GetProductsAsync_WithConcurrentRequests_ShouldHandleMultipleRequests()
    {
        // Arrange
        await SeedLargeDataset(200);
        var tasks = new List<Task<List<Session001.Data.DTOs.ProductDto>>>();

        // Act
        for (int i = 0; i < 10; i++)
        {
            var pageNumber = i + 1;
            tasks.Add(_productService.GetProductsAsync(pageNumber, 20));
        }

        var results = await Task.WhenAll(tasks);

        // Assert
        results.Should().HaveCount(10);
        results.Should().AllSatisfy(result => result.Should().HaveCount(20));

        // Verify no duplicate products across pages
        var allProductIds = results.SelectMany(r => r.Select(p => p.ProductID)).ToList();
        allProductIds.Should().OnlyHaveUniqueItems();
    }

    [Theory]
    [InlineData(1)]
    [InlineData(50)]
    [InlineData(100)]
    public async Task ProductExistsAsync_WithDifferentDatasetSizes_ShouldPerformConsistently(int datasetSize)
    {
        // Arrange
        await SeedLargeDataset(datasetSize);
        var stopwatch = new Stopwatch();

        // Act
        stopwatch.Start();
        // Check for the first product ID which should always exist
        var exists = await _productService.ProductExistsAsync(1);
        stopwatch.Stop();

        // Assert
        exists.Should().BeTrue();
        stopwatch.ElapsedMilliseconds.Should().BeLessThan(1000); // Should complete within 1 second
    }

    [Fact]
    public async Task SearchProductsAsync_WithPartialMatches_ShouldReturnRelevantResults()
    {
        // Arrange
        await SeedSpecificTestData();

        // Act
        var results = await _productService.SearchProductsAsync("Bike");

        // Assert
        results.Should().NotBeEmpty();
        results.Should().AllSatisfy(product => 
        {
            (product.Name.Contains("Bike", StringComparison.OrdinalIgnoreCase) ||
             product.ProductNumber.Contains("Bike", StringComparison.OrdinalIgnoreCase)).Should().BeTrue();
        });
    }

    [Fact]
    public async Task GetProductsAsync_WithActiveOnlyFilter_ShouldOnlyReturnActiveProducts()
    {
        // Arrange
        await SeedMixedStatusProducts();

        // Act
        var activeProducts = await _productService.GetProductsAsync(activeOnly: true);
        var allProducts = await _productService.GetProductsAsync(activeOnly: false);

        // Assert
        activeProducts.Should().AllSatisfy(p => p.IsActive.Should().BeTrue());
        allProducts.Should().HaveCountGreaterThan(activeProducts.Count);
    }

    private async Task SeedLargeDataset(int count)
    {
        var products = new List<Product>();

        for (int i = 1; i <= count; i++)
        {
            products.Add(new Product
            {
                ProductID = i,
                Name = $"Product {i:D4}",
                ProductNumber = $"P-{i:D6}",
                ListPrice = (decimal)(10.0 + (i % 1000)),
                Color = i % 2 == 0 ? "Red" : "Blue",
                Size = i % 3 == 0 ? "S" : (i % 3 == 1 ? "M" : "L"),
                SellStartDate = DateTime.Now.AddDays(-i),
                SellEndDate = i % 10 == 0 ? DateTime.Now.AddDays(i) : null,
                MakeFlag = true,
                FinishedGoodsFlag = true,
                SafetyStockLevel = (short)(50 + (i % 100)),
                ReorderPoint = (short)(25 + (i % 50)),
                StandardCost = (decimal)(5.0 + (i % 500)),
                DaysToManufacture = (i % 30) + 1,
                rowguid = Guid.NewGuid(),
                ModifiedDate = DateTime.Now.AddDays(-i)
            });
        }

        Context.Products.AddRange(products);
        await Context.SaveChangesAsync();
    }

    private async Task SeedSpecificTestData()
    {
        var products = new List<Product>
        {
            new Product
            {
                ProductID = 1001,
                Name = "Mountain Bike Pro",
                ProductNumber = "MB-001",
                ListPrice = 499.99m,
                SellStartDate = DateTime.Now.AddDays(-30),
                MakeFlag = true,
                FinishedGoodsFlag = true,
                SafetyStockLevel = 50,
                ReorderPoint = 25,
                StandardCost = 250.00m,
                DaysToManufacture = 10,
                rowguid = Guid.NewGuid(),
                ModifiedDate = DateTime.Now
            },
            new Product
            {
                ProductID = 1002,
                Name = "Road Bike Elite",
                ProductNumber = "RB-002",
                ListPrice = 799.99m,
                SellStartDate = DateTime.Now.AddDays(-60),
                MakeFlag = true,
                FinishedGoodsFlag = true,
                SafetyStockLevel = 30,
                ReorderPoint = 15,
                StandardCost = 400.00m,
                DaysToManufacture = 15,
                rowguid = Guid.NewGuid(),
                ModifiedDate = DateTime.Now
            },
            new Product
            {
                ProductID = 1003,
                Name = "Bike Helmet",
                ProductNumber = "BH-003",
                ListPrice = 49.99m,
                SellStartDate = DateTime.Now.AddDays(-15),
                MakeFlag = true,
                FinishedGoodsFlag = true,
                SafetyStockLevel = 100,
                ReorderPoint = 50,
                StandardCost = 20.00m,
                DaysToManufacture = 2,
                rowguid = Guid.NewGuid(),
                ModifiedDate = DateTime.Now
            }
        };

        Context.Products.AddRange(products);
        await Context.SaveChangesAsync();
    }

    private async Task SeedMixedStatusProducts()
    {
        var products = new List<Product>();

        for (int i = 1; i <= 20; i++)
        {
            products.Add(new Product
            {
                ProductID = 2000 + i,
                Name = $"Mixed Product {i}",
                ProductNumber = $"MX-{i:D3}",
                ListPrice = 100m + i,
                SellStartDate = DateTime.Now.AddDays(-30),
                SellEndDate = i % 3 == 0 ? DateTime.Now.AddDays(-5) : null, // Every 3rd product is inactive
                MakeFlag = true,
                FinishedGoodsFlag = true,
                SafetyStockLevel = 50,
                ReorderPoint = 25,
                StandardCost = 50m + i,
                DaysToManufacture = 5,
                rowguid = Guid.NewGuid(),
                ModifiedDate = DateTime.Now
            });
        }

        Context.Products.AddRange(products);
        await Context.SaveChangesAsync();
    }
}