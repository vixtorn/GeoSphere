using GeoSphere.Application.DTOs.Geospatial;

namespace GeoSphere.Application.Abstractions.Geospatial;

public interface IGeospatialService
{
    Task<GeospatialLocationDto> GetLocationDataAsync(
        double latitude,
        double longitude,
        CancellationToken cancellationToken);

    Task<IReadOnlyList<GeospatialSearchResultDto>> SearchLocationsAsync(
        string query,
        CancellationToken cancellationToken);
}