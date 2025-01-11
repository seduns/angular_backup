using Microsoft.EntityFrameworkCore;
using SurveyService.Entities;

namespace SurveyService.Data
{
    public class SurveyServiceDbContext : DbContext
    {
        public SurveyServiceDbContext(DbContextOptions<SurveyServiceDbContext> options) : base(options)
        {
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            // Define the primary key for AllProduct
            modelBuilder.Entity<AllProduct>()
                .HasKey(p => p.prodId);  // Setting prodId as the primary key

            // Define the primary key for surveyItem
            modelBuilder.Entity<surveyItem>()
                .HasKey(s => s.Id);  // Setting Id as the primary key for surveyItem

            // Define the relationship between surveyItem and AllProduct (via prodId)
            modelBuilder.Entity<surveyItem>()
                .HasOne<AllProduct>()  // Link to AllProduct entity
                .WithMany()  // AllProduct can have many surveyItems (no navigation property needed in AllProduct)
                .HasForeignKey(s => s.prodId)  // Foreign key in surveyItem is prodId
                .OnDelete(DeleteBehavior.Restrict);  // Prevent deleting AllProduct if related surveyItems exist

        }

        // Define DbSets for the entities
        public DbSet<surveyItem> surveyItems { get; set; }
        public DbSet<AllProduct> AllProducts { get; set; }
        public DbSet<fileEntity> FileEntitys { get; set; }
    }
}
