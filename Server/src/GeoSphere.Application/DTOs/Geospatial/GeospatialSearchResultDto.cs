namespace GeoSphere.Application.DTOs.Geospatial;

public sealed class GeospatialSearchResultDto
{
    public string Name { get; init; } = string.Empty;

    public double Latitude { get; init; }

    public double Longitude { get; init; }

    public string Country { get; init; } = string.Empty;

    public string City { get; init; } = string.Empty;

    public string Region { get; init; } = string.Empty;
}