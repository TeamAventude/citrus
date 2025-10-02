using Microsoft.EntityFrameworkCore;
using Session001.Data.Entities;

namespace Session001.Data;

public class ApplicationDbContext : DbContext
{
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options)
    {
    }

    // DbSets for Product entities only
    public DbSet<Product> Products { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // Configure entity relationships and constraints
        ConfigureProduct(modelBuilder);
    }

    private static void ConfigureProduct(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Product>(entity =>
        {
            entity.HasKey(e => e.ProductID);
            entity.Property(e => e.rowguid).HasDefaultValueSql("(newid())");
            entity.Property(e => e.ModifiedDate).HasDefaultValueSql("(getdate())");
            entity.HasIndex(e => e.rowguid).IsUnique();
            entity.HasIndex(e => e.ProductNumber).IsUnique();
            entity.HasIndex(e => e.Name);
        });
    }

}
