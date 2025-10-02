using Microsoft.EntityFrameworkCore;
using Session001.Data.Entities;

namespace Session001.Data
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options)
        {
        }

        public DbSet<Product> Products { get; set; } = null!;
        public DbSet<Tool> Tools { get; set; } = null!;
        public DbSet<ToolHistory> ToolHistory { get; set; } = null!;

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Configure entity relationships and constraints
            ConfigureProduct(modelBuilder);
            ConfigureToolEntities(modelBuilder);
        }

        private void ConfigureProduct(ModelBuilder modelBuilder)
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

        private void ConfigureToolEntities(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Tool>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.Property(e => e.ModifiedDate).HasDefaultValueSql("getdate()");
                entity.Property(e => e.CreatedDate).HasDefaultValueSql("getdate()");
                entity.HasIndex(e => e.ToolNumber).IsUnique();
                entity.HasIndex(e => e.Name);
                
                // Initialize default values
                entity.Property(e => e.IsUsable).HasDefaultValue(true);
                entity.Property(e => e.CurrentStatus).HasDefaultValue("Available");
                entity.Property(e => e.TotalBorrowCount).HasDefaultValue(0);
                entity.Property(e => e.TotalRepairCount).HasDefaultValue(0);
                entity.Property(e => e.OverdueCount).HasDefaultValue(0);
                entity.Property(e => e.TotalRepairCost).HasDefaultValue(0m);

                entity.HasMany(e => e.History)
                      .WithOne(h => h.Tool)
                      .HasForeignKey(h => h.ToolId)
                      .OnDelete(DeleteBehavior.Cascade);
            });

            modelBuilder.Entity<ToolHistory>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.Property(e => e.CreatedDate).HasDefaultValueSql("getdate()");
                entity.Property(e => e.IsOverdue).HasDefaultValue(false);
                entity.HasIndex(e => e.EventDate);
                entity.HasIndex(e => e.EventType);
                entity.HasIndex(e => e.UserId);
                entity.HasIndex(e => new { e.ToolId, e.EventType, e.EventDate });
            });
        }
    }
}
