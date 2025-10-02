using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.DependencyInjection.Extensions;
using Session001.Data;

namespace Session001.Tests.Fixtures;

public class CustomWebApplicationFactory<TStartup> : WebApplicationFactory<TStartup> where TStartup : class
{
    protected override void ConfigureWebHost(IWebHostBuilder builder)
    {
        builder.ConfigureServices(services =>
        {
            // Remove the existing DbContext registration
            var descriptor = services.SingleOrDefault(
                d => d.ServiceType == typeof(DbContextOptions<ApplicationDbContext>));
            if (descriptor != null)
            {
                services.Remove(descriptor);
            }

            // Use the real database connection for integration tests
            services.AddDbContext<ApplicationDbContext>(options =>
            {
                options.UseSqlServer("Server=tcp:qryon-avt-sql01-dev.database.windows.net,1433;Initial Catalog=AdventureWorks2022;Persist Security Info=False;User ID=botuser;Password=4w+tHzfX!;MultipleActiveResultSets=False;Encrypt=True;TrustServerCertificate=False;");
            });

            // Ensure database is created and migrations are applied
            var serviceProvider = services.BuildServiceProvider();
            using var scope = serviceProvider.CreateScope();
            var context = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
            
            // Note: Since we're using the real database, we don't need to create it
            // But we could add any test-specific setup here if needed
        });

        builder.UseEnvironment("Testing");
    }
}
