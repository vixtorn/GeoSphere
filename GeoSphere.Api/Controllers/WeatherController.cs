using GeoSphere.Application.Abstractions.Weather;
using GeoSphere.Application.DTOs.Weather;
using Microsoft.AspNetCore.Mvc;

namespace GeoSphere.Api.Controllers;

[ApiController]
[Route("api/weather")]
public sealed class WeatherController : ControllerBase
{
    private readonly IWeatherService _weatherService;

    public WeatherController(IWeatherService weatherService)
    {
        _weatherService = weatherService;
    }

    [HttpGet("current")]
    public async Task<ActionResult<CurrentWeatherDto>> GetCurrentWeather(
        [FromQuery] double lat,
        [FromQuery] double lng,
        CancellationToken cancellationToken)
    {
        if (!IsValidLatitude(lat) || !IsValidLongitude(lng))
        {
            return BadRequest("Latitude must be between -90 and 90. Longitude must be between -180 and 180.");
        }

        var response = await _weatherService.GetCurrentWeatherAsync(
            lat,
            lng,
            cancellationToken);

        return Ok(response);
    }

    [HttpGet("forecast")]
    public async Task<ActionResult<WeatherForecastDto>> GetForecast(
        [FromQuery] double lat,
        [FromQuery] double lng,
        CancellationToken cancellationToken)
    {
        if (!IsValidLatitude(lat) || !IsValidLongitude(lng))
        {
            return BadRequest("Latitude must be between -90 and 90. Longitude must be between -180 and 180.");
        }

        var response = await _weatherService.GetForecastAsync(
            lat,
            lng,
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