namespace GeoSphere.Application.DTOs.FavoriteLocations;

public sealed class FavoriteLocationDto
{
    public Guid Id { get; init; }

    public string Name { get; init; } = string.Empty;

    public double Latitude { get; init; }
    public double Longitude { get; init; }

    public DateTimeOffset CreatedAtUtc { get; init; }
}