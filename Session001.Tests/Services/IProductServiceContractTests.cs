using FluentAssertions;
using Session001.Services.Interfaces;
using System.Reflection;

namespace Session001.Tests.Services;

/// <summary>
/// Tests to validate the IProductService interface contract and ensure it follows expected patterns
/// </summary>
public class IProductServiceContractTests
{
    [Fact]
    public void IProductService_ShouldHaveCorrectMethodSignatures()
    {
        // Arrange
        var interfaceType = typeof(IProductService);

        // Act
        var methods = interfaceType.GetMethods();

        // Assert
        methods.Should().HaveCount(4);
        methods.Should().Contain(m => m.Name == "GetProductsAsync");
        methods.Should().Contain(m => m.Name == "GetProductByIdAsync");
        methods.Should().Contain(m => m.Name == "SearchProductsAsync");
        methods.Should().Contain(m => m.Name == "ProductExistsAsync");
    }

    [Fact]
    public void GetProductsAsync_ShouldHaveCorrectSignature()
    {
        // Arrange
        var interfaceType = typeof(IProductService);
        var method = interfaceType.GetMethod("GetProductsAsync");

        // Assert
        method.Should().NotBeNull();
        method!.ReturnType.Should().Be(typeof(Task<List<Session001.Data.DTOs.ProductDto>>));
        
        var parameters = method.GetParameters();
        parameters.Should().HaveCount(4);
        parameters[0].Name.Should().Be("pageNumber");
        parameters[0].ParameterType.Should().Be(typeof(int));
        parameters[0].HasDefaultValue.Should().BeTrue();
        parameters[0].DefaultValue.Should().Be(1);
        
        parameters[1].Name.Should().Be("pageSize");
        parameters[1].ParameterType.Should().Be(typeof(int));
        parameters[1].HasDefaultValue.Should().BeTrue();
        parameters[1].DefaultValue.Should().Be(20);
        
        parameters[2].Name.Should().Be("searchTerm");
        parameters[2].ParameterType.Should().Be(typeof(string));
        parameters[2].HasDefaultValue.Should().BeTrue();
        parameters[2].DefaultValue.Should().BeNull();
        
        parameters[3].Name.Should().Be("activeOnly");
        parameters[3].ParameterType.Should().Be(typeof(bool));
        parameters[3].HasDefaultValue.Should().BeTrue();
        parameters[3].DefaultValue.Should().Be(true);
    }

    [Fact]
    public void GetProductByIdAsync_ShouldHaveCorrectSignature()
    {
        // Arrange
        var interfaceType = typeof(IProductService);
        var method = interfaceType.GetMethod("GetProductByIdAsync");

        // Assert
        method.Should().NotBeNull();
        method!.ReturnType.Should().Be(typeof(Task<Session001.Data.DTOs.ProductDto?>));
        
        var parameters = method.GetParameters();
        parameters.Should().HaveCount(1);
        parameters[0].Name.Should().Be("id");
        parameters[0].ParameterType.Should().Be(typeof(int));
        parameters[0].HasDefaultValue.Should().BeFalse();
    }

    [Fact]
    public void SearchProductsAsync_ShouldHaveCorrectSignature()
    {
        // Arrange
        var interfaceType = typeof(IProductService);
        var method = interfaceType.GetMethod("SearchProductsAsync");

        // Assert
        method.Should().NotBeNull();
        method!.ReturnType.Should().Be(typeof(Task<List<Session001.Data.DTOs.ProductDto>>));
        
        var parameters = method.GetParameters();
        parameters.Should().HaveCount(2);
        parameters[0].Name.Should().Be("searchTerm");
        parameters[0].ParameterType.Should().Be(typeof(string));
        parameters[0].HasDefaultValue.Should().BeFalse();
        
        parameters[1].Name.Should().Be("limit");
        parameters[1].ParameterType.Should().Be(typeof(int));
        parameters[1].HasDefaultValue.Should().BeTrue();
        parameters[1].DefaultValue.Should().Be(10);
    }

    [Fact]
    public void ProductExistsAsync_ShouldHaveCorrectSignature()
    {
        // Arrange
        var interfaceType = typeof(IProductService);
        var method = interfaceType.GetMethod("ProductExistsAsync");

        // Assert
        method.Should().NotBeNull();
        method!.ReturnType.Should().Be(typeof(Task<bool>));
        
        var parameters = method.GetParameters();
        parameters.Should().HaveCount(1);
        parameters[0].Name.Should().Be("id");
        parameters[0].ParameterType.Should().Be(typeof(int));
        parameters[0].HasDefaultValue.Should().BeFalse();
    }

    [Fact]
    public void AllMethods_ShouldBeAsync()
    {
        // Arrange
        var interfaceType = typeof(IProductService);

        // Act
        var methods = interfaceType.GetMethods();

        // Assert
        methods.Should().AllSatisfy(method =>
        {
            method.Name.Should().EndWith("Async");
            method.ReturnType.Should().Match(type => 
                type.IsGenericType && type.GetGenericTypeDefinition() == typeof(Task<>) ||
                type == typeof(Task));
        });
    }

    [Fact]
    public void Interface_ShouldBeInCorrectNamespace()
    {
        // Arrange
        var interfaceType = typeof(IProductService);

        // Assert
        interfaceType.Namespace.Should().Be("Session001.Services.Interfaces");
    }

    [Fact]
    public void Interface_ShouldHaveCorrectName()
    {
        // Arrange
        var interfaceType = typeof(IProductService);

        // Assert
        interfaceType.Name.Should().Be("IProductService");
        interfaceType.IsInterface.Should().BeTrue();
        interfaceType.IsPublic.Should().BeTrue();
    }
}