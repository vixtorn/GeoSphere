using GeoSphere.Application.DTOs.Geospatial;
using Microsoft.AspNetCore.Mvc;

namespace GeoSphere.Api.Controllers;

[ApiController]
[Route("api/geospatial")]
public sealed class GeospatialController : ControllerBase
{
    [HttpGet("location")]
    public ActionResult<GeospatialLocationDto> GetLocationData(
        [FromQuery] double lat,
        [FromQuery] double lng)
    {
        if (!IsValidLatitude(lat) || !IsValidLongitude(lng))
        {
            return BadRequest("Latitude must be between -90 and 90. Longitude must be between -180 and 180.");
        }

        var response = new GeospatialLocationDto
        {
            Latitude = lat,
            Longitude = lng,
            Country = "Mock Country",
            City = "Mock City",
            Region = "Mock Region",
            ElevationMeters = 35,
            TerrainType = "Coastal",
            SettlementType = "Urban",
            RetrievedAtUtc = DateTimeOffset.UtcNow
        };

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