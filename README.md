# Aventude Session001 Application

Agent driven service architecture template with Entity Framework Code First and BOYK model. (Supports Open AI, Claude and xAI)

## 🚀 Quick Start

### Prerequisites
- .NET 9.0 SDK
- SQL Server or SQL Server LocalDB
- Visual Studio 2022 or VS Code with C# extension

### Install the template:
```bash
# From NuGet.org (recommended)
dotnet new install Aventude.Templates.Session001

# From local package
dotnet new install Aventude.Templates.Session001.1.0.1.nupkg
```

### Create and setup a new project:
```bash
# 1. Create new project
dotnet new session001 -n "YourProjectName"
cd YourProjectName

# 2. Restore packages
dotnet restore

# 3. Set up the database
dotnet ef database update --project YourProjectName.Data --startup-project YourProjectName.API

# 4. Run the application
dotnet run --project YourProjectName.API

# 5. Open API documentation at https://localhost:5001/swagger
```

## 📦 What's Included

- **API Layer**: ASP.NET Core Web API with controllers
- **Services Layer**: Business logic and service implementations  
- **Data Layer**: Entity Framework context and data access
- **DTOs**: Data Transfer Objects for clean API contracts
- **Tests**: Integration and unit tests with xUnit
- **Utils**: Shared utilities and common functionality

## 🏗️ Project Structure

```
YourProject/
├── YourProject.API/          # Web API controllers and configuration
├── YourProject.Services/     # Business logic layer
├── YourProject.Data/         # Data access layer
├── YourProject.DTOs/         # Data transfer objects
├── YourProject.Tests/        # Test projects
└── YourProject.Utils/        # Shared utilities
```

## 🛠️ Development

The template includes:
- ✅ Clean Architecture structure
- ✅ Entity Framework Code First with migrations
- ✅ Dependency Injection setup
- ✅ Sample Product entity with complete CRUD operations
- ✅ Integration testing framework
- ✅ API documentation ready

## 🗃️ Database

The template uses **Entity Framework Code First** approach:
- Sample `Product` entity with comprehensive business logic patterns
- Initial migration included and ready to apply
- Configurable connection strings for different environments
- Proper indexing and constraint configurations

### Database Configuration

The template includes connection strings for different environments:

**Development** (`appsettings.Development.json`):
```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=(localdb)\\mssqllocaldb;Database=YourProjectNameDevDb;Trusted_Connection=true;MultipleActiveResultSets=true"
  }
}
```

**Production** (`appsettings.json`):
```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=(localdb)\\mssqllocaldb;Database=YourProjectNameDb;Trusted_Connection=true;MultipleActiveResultSets=true"
  }
}
```

### Adding New Entities

1. **Create entity class** in `YourProjectName.Data/Entities/`:
```csharp
[Table("Category", Schema = "Production")]
public class Category
{
    [Key]
    public int CategoryID { get; set; }
    
    [Required]
    [StringLength(50)]
    public string Name { get; set; } = string.Empty;
    
    public DateTime ModifiedDate { get; set; }
}
```

2. **Add DbSet** to ApplicationDbContext:
```csharp
public DbSet<Category> Categories { get; set; }
```

3. **Configure entity** in OnModelCreating:
```csharp
modelBuilder.Entity<Category>(entity =>
{
    entity.HasKey(e => e.CategoryID);
    entity.Property(e => e.ModifiedDate).HasDefaultValueSql("GETDATE()");
    entity.HasIndex(e => e.Name);
});
```

4. **Create and apply migration**:
```bash
dotnet ef migrations add AddCategory --project YourProjectName.Data --startup-project YourProjectName.API
dotnet ef database update --project YourProjectName.Data --startup-project YourProjectName.API
```

## 🧪 Testing

The template includes comprehensive integration tests with Entity Framework Code First.

### Running Tests
```bash
# Run all tests
dotnet test

# Run specific test project
dotnet test YourProjectName.Tests

# Run tests with detailed output
dotnet test --verbosity normal
```

### Test Features
- Integration tests with real Entity Framework database connections
- Test data helpers for creating valid test entities
- Comprehensive controller testing
- Business logic validation testing

## 📚 API Documentation

The template includes Swagger/OpenAPI documentation:
- **Development**: Navigate to `/swagger` when running locally
- **API Explorer**: Built-in API testing interface
- **Schema Documentation**: Automatic DTO and validation documentation

## 🛠️ Development Workflow

### Recommended Process
1. **Design Entity**: Create entity classes with proper annotations
2. **Configure DbContext**: Add configuration in ApplicationDbContext
3. **Create Migration**: Generate migration for schema changes
4. **Create DTOs**: Define request/response objects
5. **Implement Service**: Add business logic in service layer
6. **Create Controller**: Implement API endpoints
7. **Write Tests**: Add comprehensive integration tests
8. **Update Documentation**: Keep documentation current

### Best Practices
- **Migration Naming**: Use descriptive migration names
- **Entity Validation**: Use data annotations and business validation
- **Service Layer**: Keep controllers thin, business logic in services
- **Testing**: Write tests for all new functionality
- **Documentation**: Update API documentation for new endpoints

## 🔧 Troubleshooting

### Common Issues
- **Migration fails**: Ensure SQL Server LocalDB is installed and running
- **Database not created**: Run `dotnet ef database update` to apply migrations
- **Build errors after adding entity**: Ensure proper references and using statements
- **Tests fail**: Check test connection strings and database accessibility

### Getting Help
- Check `Architecture.md` for architectural guidance
- Review `DATABASE.md` for Entity Framework patterns
- See `AGENTS.md` for AI/Agent development guidelines
- Examine existing `Product` entity as reference implementation

## 🚀 Next Steps

1. **Customize Entities**: Modify or add entities based on your business needs
2. **Add Authentication**: Implement authentication and authorization
3. **Add Logging**: Configure structured logging with Serilog
4. **Add Caching**: Implement caching for performance optimization
5. **Add Validation**: Implement comprehensive business validation
6. **Deploy**: Configure deployment to your preferred platform

## 📝 License

Created by Aventude - Feel free to use and modify!