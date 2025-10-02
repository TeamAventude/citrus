# AI/Agent Development Guidelines

This document provides comprehensive guidelines for AI agents (Copilot, Claude, xAI, etc.) working with the Session001 framework template. It establishes best practices, architectural principles, and development standards based on the existing documentation and codebase patterns.

## Framework Overview

The Session001 framework template implements the **BOYK (Build On Your Knowledge) model**, supporting OpenAI, Claude, and xAI integrations. It follows clean architecture principles with a multi-layered .NET 9.0 solution structure.

### Core Architecture Patterns

#### Clean Architecture (3-Layer Pattern)
Follow the established Controller-Service-Model pattern:

```
┌─────────────────┐
│   Controllers   │ ← API Layer (HTTP/REST endpoints)
├─────────────────┤
│    Services     │ ← Business Logic Layer
├─────────────────┤
│  Data/Models    │ ← Data Access Layer
└─────────────────┘
```

#### Project Structure
The solution contains 6 projects with clear separation of concerns:
- **Session001.API**: Web API controllers and configuration
- **Session001.Services**: Business logic and service interfaces
- **Session001.Data**: Entity Framework contexts and data access
- **Session001.DTOs**: Data transfer objects for API communication
- **Session001.Tests**: Comprehensive integration tests (54+ tests)
- **Session001.Utils**: Shared utilities and helper functions

## AI Agent Development Principles

### 1. Architectural Consistency
**ALWAYS maintain the established architecture patterns:**

- Use dependency injection for all service registrations
- Implement interfaces before concrete classes (IProductService → ProductService)
- Follow the request-response flow: Controller → Service → Data
- Maintain clear separation between API layer and business logic

### 2. Code-First Database Approach
The framework uses **Entity Framework Code First** approach with:

- **Database schema** generated from C# entity classes
- **Migration management** for schema evolution over time
- **Proper data annotations** and Fluent API configuration
- **Type safety** with compile-time validation

**Key Database Patterns:**
```csharp
// Entity configuration with proper annotations
[Table("Product", Schema = "Production")]
public class Product
{
    [Key]
    public int ProductID { get; set; }
    
    [Required]
    [StringLength(50)]
    public string Name { get; set; } = string.Empty;
}

// DbContext configuration
modelBuilder.Entity<Product>(entity =>
{
    entity.HasKey(e => e.ProductID);
    entity.HasIndex(e => e.ProductNumber).IsUnique();
    entity.Property(e => e.ModifiedDate).HasDefaultValueSql("GETDATE()");
});
```

### 3. Testing Excellence Standards
Maintain the **100% test success rate** with comprehensive coverage:

- **Integration Tests**: Real database connections, no mocks
- **Comprehensive Tests**: Covering all controllers with positive/negative scenarios
- **Entity Framework**: Properly configured Code First approach
- **Constraint Validation**: Handle database constraints and business rules

**Test Categories:**
- CRUD operations with Entity Framework
- Search & Filtering with LINQ queries
- Business logic validation and error handling

## Code Generation Guidelines

### 1. Controller Development
**Pattern for new controllers:**

```csharp
[ApiController]
[Route("api/[controller]")]
public class {EntityName}Controller : ControllerBase
{
    private readonly I{EntityName}Service _service;
    private readonly ILogger<{EntityName}Controller> _logger;

    // Constructor injection
    // GET endpoints with pagination
    // POST endpoints with validation
    // PUT endpoints with business logic
    // DELETE endpoints (soft delete preferred)
}
```

**Required Elements:**
- Dependency injection for services and logging
- Comprehensive error handling with appropriate HTTP status codes
- Input validation using data annotations and FluentValidation
- Pagination support for list endpoints
- Consistent response patterns using DTOs

### 2. Service Implementation
**Service layer pattern:**

```csharp
public interface I{EntityName}Service
{
    Task<PagedResult<{EntityName}Dto>> GetAllAsync(int page, int pageSize);
    Task<{EntityName}Dto> GetByIdAsync(int id);
    Task<{EntityName}Dto> CreateAsync(Create{EntityName}Dto dto);
    Task<{EntityName}Dto> UpdateAsync(int id, Update{EntityName}Dto dto);
    Task<bool> DeleteAsync(int id);
}

public class {EntityName}Service : I{EntityName}Service
{
    private readonly ApplicationDbContext _context;
    private readonly ILogger<{EntityName}Service> _logger;
    
    // Implement business logic
    // Handle data validation
    // Manage database transactions
    // Include error handling and logging
}
```

### 3. Data Access Patterns
**Entity Framework best practices:**

```csharp
public class ApplicationDbContext : DbContext
{
    // DbSet properties for entities
    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        // Configure entity relationships
        // Handle database constraints
        // Configure triggers
        // Set up indexes
    }
}
```

**Key Considerations:**
- Use async/await for all database operations
- Implement proper transaction handling
- Configure Entity Framework Code First with migrations
- Handle unique constraints and foreign key relationships

## AI-Specific Development Rules

### 1. Code Quality Standards
- **No Magic Numbers**: Use constants or configuration
- **Proper Error Handling**: Comprehensive try-catch with logging
- **Async Programming**: Use async/await consistently
- **Resource Management**: Proper disposal of resources
- **Security**: Validate all inputs, prevent injection attacks

### 2. Documentation Requirements
**Every generated component must include:**
- XML documentation for public methods
- Inline comments for complex business logic
- README updates for new features
- Test documentation for new test cases

### 3. Testing Requirements
**For every new feature, generate:**
- Unit tests for service layer logic
- Integration tests for controller endpoints
- Database constraint validation tests
- Error scenario tests

### 4. Configuration Management
**Follow the established configuration patterns:**
- Use `appsettings.json` for environment configuration
- Implement proper dependency injection in `Program.cs`
- Support multiple environments (Development, Testing, Production)
- Use Azure SQL Database connection strings

## Business Domain Knowledge

### Sample Business Context
Understanding the business domain is crucial for generating meaningful code:

**Core Sample Entity:**
- **Product Management**: Product catalog with inventory and pricing
- **Manufacturing Data**: Production flags, lead times, and specifications
- **Pricing Information**: Standard costs and list prices with lifecycle management
- **Inventory Management**: Safety stock levels and reorder points

**Key Business Rules:**
- Products must have unique ProductNumber identifiers
- Products have lifecycle management with start/end dates
- Inventory levels require safety stock and reorder point tracking
- Financial data uses proper decimal precision for money types
- Audit trails with modified dates and row versioning

### Analytics and Reporting
The framework includes sample analytics capabilities:
- **Product Analytics**: Product performance and inventory metrics
- **Manufacturing Analytics**: Production lead times and capacity analysis
- **Pricing Analytics**: Cost analysis and pricing trend tracking
- **Inventory Analytics**: Stock level monitoring and reorder analysis

## Error Handling Patterns

### 1. Standardized Error Responses
```csharp
public class ApiResponse<T>
{
    public bool Success { get; set; }
    public string Message { get; set; }
    public T Data { get; set; }
    public List<string> Errors { get; set; }
}
```

### 2. Exception Handling
**Use structured exception handling:**
- Custom exceptions for business logic violations
- Global exception middleware for unhandled exceptions  
- Proper logging with correlation IDs
- User-friendly error messages in responses

### 3. Validation Patterns
**Implement comprehensive validation:**
- Data annotation validation on DTOs
- FluentValidation for complex business rules
- Database constraint validation
- Cross-field validation rules

## Performance Optimization

### 1. Database Optimization
- Use appropriate indexes for query performance
- Implement pagination for large datasets
- Use projection (Select) to limit returned columns
- Optimize joins and include operations
- Implement caching for frequently accessed data

### 2. API Optimization
- Implement response compression
- Use appropriate HTTP status codes
- Implement rate limiting for API endpoints
- Use async patterns throughout the stack
- Optimize serialization with DTOs

## Security Considerations

### 1. Input Validation
- Validate all input parameters
- Sanitize data before database operations
- Implement parameter validation attributes
- Use strongly-typed DTOs for data transfer

### 2. Database Security
- Use parameterized queries (Entity Framework handles this)
- Implement proper authentication and authorization
- Follow principle of least privilege for database access
- Encrypt sensitive data at rest and in transit

## Deployment and DevOps

### 1. Template Distribution
The framework is distributed as a **.NET template package**:
- NuGet package: `Aventude.Templates.Session001`
- Version management with semantic versioning
- Automatic integration with Visual Studio New Project dialog
- Template parameters for customization during project creation

### 2. CI/CD Considerations
When generating deployment code:
- Support Azure deployment scenarios
- Include Docker containerization support
- Implement health checks for monitoring
- Configure logging and telemetry
- Support environment-specific configurations

## Framework Extensions

### 1. Adding New Controllers
When adding new controllers, ensure:
- Follow the established naming conventions
- Implement comprehensive CRUD operations
- Add corresponding service interfaces and implementations
- Create appropriate DTOs for request/response
- Generate complete integration tests
- Update API documentation

### 2. Adding New Entities
For new database entities:
- Create Entity Framework model classes
- Configure relationships in DbContext
- Handle database constraints and triggers
- Create migration scripts
- Implement repository patterns if needed
- Add validation rules and business logic

### 3. Extending Analytics
For new analytics features:
- Follow the established analytics controller patterns
- Implement complex query optimization
- Support multiple aggregation levels
- Include time-period filtering capabilities
- Generate meaningful business insights
- Create visualization-friendly data structures

## Integration Patterns

### 1. External System Integration
The framework supports various integration patterns:
- REST API consumption with HttpClient
- Message queue integration (Service Bus, RabbitMQ)
- File import/export capabilities
- Third-party service integrations
- Webhook implementations

### 2. AI/ML Integration
For AI/ML feature development:
- Support for model inference endpoints
- Data preprocessing pipelines
- Result interpretation and formatting
- Performance monitoring and logging
- A/B testing framework integration

## Monitoring and Observability

### 1. Logging Standards
Implement comprehensive logging:
- Structured logging with Serilog or built-in providers
- Correlation IDs for request tracking
- Performance metrics logging
- Error tracking with stack traces
- Business event logging

### 2. Health Monitoring
Include health check implementations:
- Database connectivity checks
- External service dependency checks
- Performance threshold monitoring
- Resource utilization tracking

## Compliance and Standards

### 1. Code Standards
Follow established .NET coding standards:
- Use PascalCase for public members
- Use camelCase for private members
- Implement proper async naming (Async suffix)
- Follow SOLID principles
- Implement design patterns appropriately

### 2. Documentation Standards
Maintain documentation consistency:
- Use XML documentation for all public APIs
- Include example code in documentation
- Update README files for new features
- Document configuration options
- Include troubleshooting guides

## Best Practices Summary

### DO ✅
- Follow the established clean architecture patterns
- Implement comprehensive testing with real database connections
- Use dependency injection consistently
- Handle database triggers and constraints properly
- Include proper error handling and logging
- Generate complete integration tests for new features
- Follow established naming and coding conventions
- Update documentation for all changes

### DON'T ❌
- Break the established architecture patterns
- Use mocks instead of real database connections in integration tests
- Ignore database constraints and triggers
- Skip error handling or validation
- Create code without corresponding tests
- Modify existing database schema without migration scripts
- Ignore performance implications of generated queries
- Generate code that doesn't follow established patterns

## Template Usage for Agents

When working with this template:

1. **Understand the Domain**: Study the Product entity schema and business context
2. **Follow Patterns**: Use existing code as reference for new implementations
3. **Test Thoroughly**: Generate comprehensive tests for all new code
4. **Document Everything**: Update documentation for any changes
5. **Maintain Quality**: Follow the established quality standards and conventions

This framework template provides a solid foundation for enterprise-grade .NET applications with proper architecture, comprehensive testing, and production-ready patterns. AI agents should leverage these established patterns while extending the framework's capabilities.

## Quick Reference

### Common Commands
```bash
# Install template
dotnet new install Aventude.Templates.Session001

# Create new project
dotnet new session001 -n YourProjectName

# Run tests
dotnet test --verbosity minimal

# Run specific test category
dotnet test --filter "DisplayName~ProductsController"
```

### Key Files to Reference
- `Architecture.md`: Comprehensive architectural documentation
- `DATABASE.md`: Complete database schema reference
- `Session001.Tests/README.md`: Testing patterns and examples
- `Program.cs`: Dependency injection and configuration patterns
- `ApplicationDbContext.cs`: Entity Framework configuration examples

This document serves as the authoritative guide for AI agents working with the Session001 framework template. Follow these guidelines to ensure consistency, quality, and maintainability of generated code.