using GeoSphere.Application.DTOs.FavoriteLocations;
using GeoSphere.Infrastructure.Persistence;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace GeoSphere.Api.Controllers;

[ApiController]
[Route("api/favorite-locations")]
public sealed class FavoriteLocationsController : ControllerBase
{
    private readonly GeoSphereDbContext _dbContext;

    public FavoriteLocationsController(GeoSphereDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    [HttpGet]
    public async Task<ActionResult<IReadOnlyList<FavoriteLocationDto>>> GetFavoriteLocations(
        CancellationToken cancellationToken)
    {
        var locations = await _dbContext.FavoriteLocations
            .Select(location => new FavoriteLocationDto
            {
                Id = location.Id,
                Name = location.Name,
                Latitude = location.Latitude,
                Longitude = location.Longitude,
                CreatedAtUtc = location.CreatedAtUtc
            })
            .ToListAsync(cancellationToken);

        var response = locations
            .OrderByDescending(location => location.CreatedAtUtc)
            .ToList();

        return Ok(response);
    }
}