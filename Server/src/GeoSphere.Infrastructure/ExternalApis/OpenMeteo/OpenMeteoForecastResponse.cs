using System.Text.Json.Serialization;

namespace GeoSphere.Infrastructure.ExternalApis.OpenMeteo;

public sealed class OpenMeteoForecastResponse
{
    [JsonPropertyName("latitude")]
    public double Latitude { get; init; }

    [JsonPropertyName("longitude")]
    public double Longitude { get; init; }

    [JsonPropertyName("daily")]
    public OpenMeteoDailyForecast Daily { get; init; } = new();
}

public sealed class OpenMeteoDailyForecast
{
    [JsonPropertyName("time")]
    public List<string> Time { get; init; } = new();

    [JsonPropertyName("weather_code")]
    public List<int> WeatherCodes { get; init; } = new();

    [JsonPropertyName("temperature_2m_max")]
    public List<double> TemperatureMaxCelsius { get; init; } = new();

    [JsonPropertyName("temperature_2m_min")]
    public List<double> TemperatureMinCelsius { get; init; } = new();

    [JsonPropertyName("precipitation_probability_max")]
    public List<int?> PrecipitationProbabilityMaxPercentage { get; init; } = new();

    [JsonPropertyName("wind_speed_10m_max")]
    public List<double> WindSpeedMaxKmh { get; init; } = new();
}