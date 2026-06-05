namespace GeoSphere.Application.DTOs.Geospatial;

public sealed class GeospatialLocationDto
{
    public double Latitude { get; init; }
    public double Longitude { get; init; }

    public string Country { get; init; } = string.Empty;
    public string City { get; init; } = string.Empty;
    public string Region { get; init; } = string.Empty;

    public double ElevationMeters { get; init; }
    public string TerrainType { get; init; } = string.Empty;
    public string SettlementType { get; init; } = string.Empty;

    public DateTimeOffset RetrievedAtUtc { get; init; }
}