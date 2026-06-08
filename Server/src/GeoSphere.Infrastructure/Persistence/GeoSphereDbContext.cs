using GeoSphere.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace GeoSphere.Infrastructure.Persistence;

public sealed class GeoSphereDbContext : DbContext
{
    public GeoSphereDbContext(DbContextOptions<GeoSphereDbContext> options)
        : base(options)
    {
    }

    public DbSet<FavoriteLocation> FavoriteLocations => Set<FavoriteLocation>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<FavoriteLocation>(entity =>
        {
            entity.ToTable("FavoriteLocations");

            entity.HasKey(location => location.Id);

            entity.Property(location => location.Name)
                .HasMaxLength(120)
                .IsRequired();

            entity.Property(location => location.Latitude)
                .IsRequired();

            entity.Property(location => location.Longitude)
                .IsRequired();

            entity.Property(location => location.CreatedAtUtc)
                .IsRequired();

            entity.HasIndex(location => new
            {
                location.Latitude,
                location.Longitude
            });
        });
    }
}