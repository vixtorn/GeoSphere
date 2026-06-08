using GeoSphere.Application.DTOs.FavoriteLocations;
using GeoSphere.Domain.Entities;
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

    [HttpPost]
    public async Task<ActionResult<FavoriteLocationDto>> CreateFavoriteLocation(
        [FromBody] CreateFavoriteLocationRequest request,
        CancellationToken cancellationToken)
    {
        if (string.IsNullOrWhiteSpace(request.Name))
        {
            return BadRequest("Favorite location name cannot be empty.");
        }

        if (!IsValidLatitude(request.Latitude) || !IsValidLongitude(request.Longitude))
        {
            return BadRequest("Latitude must be between -90 and 90. Longitude must be between -180 and 180.");
        }

        var normalizedName = request.Name.Trim();

        var alreadyExists = await _dbContext.FavoriteLocations
            .AnyAsync(
                location =>
                    location.Latitude == request.Latitude &&
                    location.Longitude == request.Longitude,
                cancellationToken);

        if (alreadyExists)
        {
            return Conflict("This location is already saved.");
        }

        var favoriteLocation = new FavoriteLocation(
            normalizedName,
            request.Latitude,
            request.Longitude);

        _dbContext.FavoriteLocations.Add(favoriteLocation);

        await _dbContext.SaveChangesAsync(cancellationToken);

        var response = new FavoriteLocationDto
        {
            Id = favoriteLocation.Id,
            Name = favoriteLocation.Name,
            Latitude = favoriteLocation.Latitude,
            Longitude = favoriteLocation.Longitude,
            CreatedAtUtc = favoriteLocation.CreatedAtUtc
        };

        return CreatedAtAction(
            nameof(GetFavoriteLocations),
            new { id = response.Id },
            response);
    }

    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> DeleteFavoriteLocation(
        [FromRoute] Guid id,
        CancellationToken cancellationToken)
    {
        var favoriteLocation = await _dbContext.FavoriteLocations
            .FirstOrDefaultAsync(location => location.Id == id, cancellationToken);

        if (favoriteLocation is null)
        {
            return NotFound("Favorite location was not found.");
        }

        _dbContext.FavoriteLocations.Remove(favoriteLocation);

        await _dbContext.SaveChangesAsync(cancellationToken);

        return NoContent();
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