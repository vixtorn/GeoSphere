using System.Globalization;
using System.Net.Http.Json;
using GeoSphere.Application.Abstractions.Weather;
using GeoSphere.Application.DTOs.Weather;

namespace GeoSphere.Infrastructure.ExternalApis.OpenMeteo;

public sealed class OpenMeteoWeatherService : IWeatherService
{
    private readonly HttpClient _httpClient;

    public OpenMeteoWeatherService(HttpClient httpClient)
    {
        _httpClient = httpClient;
    }

    public async Task<CurrentWeatherDto> GetCurrentWeatherAsync(
        double latitude,
        double longitude,
        CancellationToken cancellationToken = default)
    {
        if (!IsValidLatitude(latitude) || !IsValidLongitude(longitude))
        {
            throw new ArgumentOutOfRangeException(
                nameof(latitude),
                "Latitude must be between -90 and 90. Longitude must be between -180 and 180.");
        }

        var lat = latitude.ToString(CultureInfo.InvariantCulture);
        var lng = longitude.ToString(CultureInfo.InvariantCulture);

        var endpoint =
            $"v1/forecast?latitude={lat}&longitude={lng}" +
            "&current=temperature_2m,relative_humidity_2m,apparent_temperature,wind_speed_10m,pressure_msl,weather_code" +
            "&timezone=auto";

        var response = await _httpClient.GetFromJsonAsync<OpenMeteoWeatherResponse>(
            endpoint,
            cancellationToken);

        if (response is null)
        {
            throw new InvalidOperationException("Open-Meteo returned an empty response.");
        }

        return new CurrentWeatherDto
        {
            Latitude = latitude,
            Longitude = longitude,
            LocationName = "Selected Location",
            TemperatureCelsius = response.Current.Temperature2m,
            FeelsLikeCelsius = response.Current.ApparentTemperature,
            HumidityPercentage = response.Current.RelativeHumidity2m,
            WindSpeedKmh = response.Current.WindSpeed10m,
            PressureHPa = (int)Math.Round(response.Current.PressureMsl),
            Condition = MapWeatherCode(response.Current.WeatherCode),
            RetrievedAtUtc = DateTimeOffset.UtcNow
        };
    }

    private static string MapWeatherCode(int weatherCode)
    {
        return weatherCode switch
        {
            0 => "Clear Sky",
            1 or 2 or 3 => "Partly Cloudy",
            45 or 48 => "Fog",
            51 or 53 or 55 => "Drizzle",
            56 or 57 => "Freezing Drizzle",
            61 or 63 or 65 => "Rain",
            66 or 67 => "Freezing Rain",
            71 or 73 or 75 => "Snow",
            77 => "Snow Grains",
            80 or 81 or 82 => "Rain Showers",
            85 or 86 => "Snow Showers",
            95 => "Thunderstorm",
            96 or 99 => "Thunderstorm With Hail",
            _ => "Unknown"
        };
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