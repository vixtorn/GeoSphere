namespace GeoSphere.Application.DTOs.FavoriteLocations;

public sealed class CreateFavoriteLocationRequest
{
    public string Name { get; init; } = string.Empty;

    public double Latitude { get; init; }

    public double Longitude { get; init; }
}