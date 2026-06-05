using GeoSphere.Application.DTOs.Weather;
using Microsoft.AspNetCore.Mvc;

namespace GeoSphere.Api.Controllers;

[ApiController]
[Route("api/weather")]
public sealed class WeatherController : ControllerBase
{
    [HttpGet("current")]
    public ActionResult<CurrentWeatherDto> GetCurrentWeather(
        [FromQuery] double lat,
        [FromQuery] double lng)
    {
        if (!IsValidLatitude(lat) || !IsValidLongitude(lng))
        {
            return BadRequest("Latitude must be between -90 and 90. Longitude must be between -180 and 180.");
        }

        var response = new CurrentWeatherDto
        {
            Latitude = lat,
            Longitude = lng,
            LocationName = "Mock Location",
            TemperatureCelsius = 24.0,
            FeelsLikeCelsius = 23.0,
            HumidityPercentage = 65,
            WindSpeedKmh = 15.0,
            PressureHPa = 1012,
            Condition = "Partly Cloudy",
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