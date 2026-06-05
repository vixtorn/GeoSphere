using GeoSphere.Application.DTOs.FavoriteLocations;
using Microsoft.AspNetCore.Mvc;

namespace GeoSphere.Api.Controllers;

[ApiController]
[Route("api/favorite-locations")]
public sealed class FavoriteLocationsController : ControllerBase
{
    [HttpGet]
    public ActionResult<IReadOnlyList<FavoriteLocationDto>> GetFavoriteLocations()
    {
        var response = new List<FavoriteLocationDto>
        {
            new()
            {
                Id = Guid.NewGuid(),
                Name = "Istanbul",
                Latitude = 41.0082,
                Longitude = 28.9784,
                CreatedAtUtc = DateTimeOffset.UtcNow.AddDays(-3)
            },
            new()
            {
                Id = Guid.NewGuid(),
                Name = "Berlin",
                Latitude = 52.52,
                Longitude = 13.405,
                CreatedAtUtc = DateTimeOffset.UtcNow.AddDays(-2)
            },
            new()
            {
                Id = Guid.NewGuid(),
                Name = "Tokyo",
                Latitude = 35.6762,
                Longitude = 139.6503,
                CreatedAtUtc = DateTimeOffset.UtcNow.AddDays(-1)
            }
        };

        return Ok(response);
    }
}