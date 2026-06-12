using GeoSphere.Application.Abstractions.Geospatial;
using GeoSphere.Application.DTOs.Geospatial;
using Microsoft.AspNetCore.Mvc;

namespace GeoSphere.Api.Controllers;

[ApiController]
[Route("api/geospatial")]
public sealed class GeospatialController : ControllerBase
{
    private readonly IGeospatialService _geospatialService;

    public GeospatialController(IGeospatialService geospatialService)
    {
        _geospatialService = geospatialService;
    }

    [HttpGet("location")]
    public async Task<ActionResult<GeospatialLocationDto>> GetLocationData(
        [FromQuery] double lat,
        [FromQuery] double lng,
        CancellationToken cancellationToken)
    {
        if (!IsValidLatitude(lat) || !IsValidLongitude(lng))
        {
            return BadRequest("Latitude must be between -90 and 90. Longitude must be between -180 and 180.");
        }

        var response = await _geospatialService.GetLocationDataAsync(
            lat,
            lng,
            cancellationToken);

        return Ok(response);
    }

    [HttpGet("search")]
    public async Task<ActionResult<IReadOnlyList<GeospatialSearchResultDto>>> SearchLocations(
        [FromQuery] string query,
        CancellationToken cancellationToken)
    {
        if (string.IsNullOrWhiteSpace(query))
        {
            return BadRequest("Search query cannot be empty.");
        }

        if (query.Trim().Length < 2)
        {
            return BadRequest("Search query must be at least 2 characters long.");
        }

        var response = await _geospatialService.SearchLocationsAsync(
            query,
            cancellationToken);

        return Ok(response);
    }

    private static bool IsValidLatitude(double latitude)
    {
        return latitude >= -90 && latitude <= 90;
    }

    private static bool IsValidLongitude(double longitude)
    {
        return longitude >= -180 && longitude <= 180;
    }
}