# Database Schema Documentation

This document describes the Session001 framework database schema using Entity Framework Code First approach. The schema is designed to demonstrate modern .NET development patterns with a sample Product entity.

## Overview

The Session001 template uses **Entity Framework Code First** approach where:
- Database schema is generated from C# entity classes
- Migrations manage schema changes over time
- Database constraints and relationships are defined in code
- No dependency on pre-existing database schemas

## Code First Approach

### Benefits
- **Version Control**: Database schema is version controlled with application code
- **Team Collaboration**: Developers can easily share and apply schema changes
- **Environment Consistency**: Same schema across development, testing, and production
- **Type Safety**: Strong typing prevents runtime errors
- **Migration Management**: Automatic handling of schema evolution

### Entity Framework Configuration
The template demonstrates proper Entity Framework setup with:
- DbContext configuration
- Entity configurations using Fluent API
- Proper data annotations
- Migration management
- Connection string configuration

## Sample Entity: Product

### Product Entity Structure

The `Product` entity demonstrates modern Entity Framework patterns:

```csharp
[Table("Product", Schema = "Production")]
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
```

### Database Table: Production.Product

**Purpose:** Demonstrates a comprehensive entity with various data types and constraints.

| Column Name | Data Type | Nullable | Description |
|-------------|-----------|----------|-------------|
| `ProductID` | int | NO | Primary key identifier |
| `Name` | nvarchar(50) | NO | Product name |
| `ProductNumber` | nvarchar(25) | NO | Unique product number |
| `MakeFlag` | bit | NO | Whether product is manufactured |
| `FinishedGoodsFlag` | bit | NO | Whether product is finished goods |
| `Color` | nvarchar(15) | YES | Product color |
| `SafetyStockLevel` | smallint | NO | Safety stock level |
| `ReorderPoint` | smallint | NO | Reorder point threshold |
| `StandardCost` | money | NO | Standard cost |
| `ListPrice` | money | NO | List price |
| `Size` | nvarchar(5) | YES | Product size |
| `SizeUnitMeasureCode` | nchar(3) | YES | Size unit measure |
| `WeightUnitMeasureCode` | nchar(3) | YES | Weight unit measure |
| `Weight` | decimal(8,2) | YES | Product weight |
| `DaysToManufacture` | int | NO | Manufacturing lead time |
| `ProductLine` | nchar(2) | YES | Product line code |
| `Class` | nchar(2) | YES | Product class code |
| `Style` | nchar(2) | YES | Product style code |
| `ProductSubcategoryID` | int | YES | Foreign key to subcategory |
| `ProductModelID` | int | YES | Foreign key to product model |
| `SellStartDate` | datetime | NO | Start date for sales |
| `SellEndDate` | datetime | YES | End date for sales |
| `DiscontinuedDate` | datetime | YES | Discontinuation date |
| `rowguid` | uniqueidentifier | NO | Row GUID for replication |
| `ModifiedDate` | datetime | NO | Last modified timestamp |

### Entity Patterns Demonstrated

#### 1. Data Annotations
- `[Table]` - Specifies table name and schema
- `[Key]` - Defines primary key
- `[Required]` - Marks non-nullable properties
- `[StringLength]` - Sets maximum string length
- `[Column]` - Specifies SQL column type

#### 2. Data Types
- **Integer Types**: `int`, `short` for numeric data
- **String Types**: Various lengths with nullable options
- **Decimal Types**: `decimal` and `money` for financial data
- **Boolean Types**: `bool` for flags
- **DateTime Types**: For date and timestamp tracking
- **Guid**: For unique identifiers

#### 3. Business Logic Patterns
- **Audit Fields**: `ModifiedDate`, `rowguid` for tracking changes
- **Lifecycle Management**: `SellStartDate`, `SellEndDate`, `DiscontinuedDate`
- **Financial Data**: `StandardCost`, `ListPrice` with proper money type
- **Inventory Management**: `SafetyStockLevel`, `ReorderPoint`
- **Manufacturing**: `MakeFlag`, `DaysToManufacture`

## DbContext Configuration

### ApplicationDbContext
```csharp
public class ApplicationDbContext : DbContext
{
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
        : base(options)
    {
    }

    public DbSet<Product> Products { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        // Configure Product entity
        modelBuilder.Entity<Product>(entity =>
        {
            entity.HasKey(e => e.ProductID);
            
            entity.Property(e => e.rowguid)
                .HasDefaultValueSql("NEWID()");
                
            entity.Property(e => e.ModifiedDate)
                .HasDefaultValueSql("GETDATE()");
                
            entity.HasIndex(e => e.ProductNumber)
                .IsUnique();
        });

        base.OnModelCreating(modelBuilder);
    }
}
```

### Key Configuration Patterns
- **Default Values**: Automatic GUID and timestamp generation
- **Unique Constraints**: Business rule enforcement
- **Indexes**: Performance optimization
- **Relationships**: Foreign key configuration (when needed)

## Migrations

### Initial Migration
The template includes an initial migration that creates the Product table:

```bash
# Create initial migration
dotnet ef migrations add InitialCreate

# Update database
dotnet ef database update
```

### Migration Best Practices
- **Descriptive Names**: Use clear migration names
- **Incremental Changes**: Make small, focused migrations
- **Data Preservation**: Consider existing data in migrations
- **Testing**: Test migrations in development environment first

## Connection String Configuration

### Development Configuration
```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=(localdb)\\mssqllocaldb;Database=Session001Db;Trusted_Connection=true;MultipleActiveResultSets=true"
  }
}
```

### Production Configuration
```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=your-server;Database=Session001Db;User Id=your-user;Password=your-password;TrustServerCertificate=true"
  }
}
```

## Database Design Patterns

### 1. Entity Conventions
- **Primary Keys**: Use `Id` or `{EntityName}ID` pattern
- **Foreign Keys**: Use `{ReferencedEntity}ID` pattern
- **Audit Fields**: Include `CreatedDate`, `ModifiedDate`
- **Soft Delete**: Use status flags instead of hard deletes
- **Row Versioning**: Include `rowguid` for optimistic concurrency

### 2. Schema Organization
- **Schema Separation**: Use schemas to organize related tables
- **Naming Conventions**: Use PascalCase for consistency
- **Constraint Naming**: Follow consistent naming patterns

### 3. Performance Considerations
- **Indexes**: Create indexes on frequently queried columns
- **Constraints**: Use database constraints for data integrity
- **Data Types**: Choose appropriate data types for storage efficiency

## Extending the Schema

### Adding New Entities
1. Create entity class with proper annotations
2. Add DbSet property to ApplicationDbContext
3. Configure relationships in OnModelCreating
4. Create and apply migration

### Example: Adding Category Entity
```csharp
[Table("Category", Schema = "Production")]
public class Category
{
    [Key]
    public int CategoryID { get; set; }
    
    [Required]
    [StringLength(50)]
    public string Name { get; set; } = string.Empty;
    
    [StringLength(500)]
    public string? Description { get; set; }
    
    public DateTime ModifiedDate { get; set; }
    
    // Navigation properties
    public ICollection<Product> Products { get; set; } = new List<Product>();
}
```

## Testing Database Code

### Integration Testing
- Use in-memory database for fast tests
- Use real database for integration tests
- Test migrations and schema changes
- Validate entity configurations

### Test Database Setup
```csharp
services.AddDbContext<ApplicationDbContext>(options =>
    options.UseInMemoryDatabase("TestDatabase"));
```

## Best Practices Summary

### DO ✅
- Use Entity Framework Code First approach
- Apply proper data annotations and configurations
- Create meaningful migrations with descriptive names
- Use consistent naming conventions
- Include audit fields (CreatedDate, ModifiedDate)
- Configure indexes for performance
- Use appropriate data types for each field

### DON'T ❌
- Depend on specific database schemas from external systems
- Use hard-coded connection strings in code
- Skip migration testing in development
- Ignore database constraints and validation
- Use overly complex entity relationships without business justification
- Modify generated migration files manually without understanding impact

## Future Considerations

### Potential Enhancements
1. **Additional Entities**: Expand with Category, Supplier, Order entities
2. **Relationships**: Implement proper foreign key relationships
3. **Stored Procedures**: Add support for stored procedures if needed
4. **Views**: Create database views for complex queries
5. **Auditing**: Implement change tracking and audit logs
6. **Security**: Add row-level security if required
7. **Performance**: Implement query optimization and caching

### Scalability Patterns
- **Read Replicas**: Configure read-only database replicas
- **Partitioning**: Implement table partitioning for large datasets
- **Caching**: Add distributed caching for frequently accessed data
- **Connection Pooling**: Optimize database connection management

This Code First approach provides flexibility, maintainability, and team collaboration benefits while maintaining professional database design patterns.