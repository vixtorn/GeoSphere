using System.Text.Json.Serialization;

namespace GeoSphere.Infrastructure.ExternalApis.OpenMeteo;

internal sealed class OpenMeteoWeatherResponse
{
    [JsonPropertyName("latitude")]
    public double Latitude { get; init; }

    [JsonPropertyName("longitude")]
    public double Longitude { get; init; }

    [JsonPropertyName("current")]
    public OpenMeteoCurrentWeather Current { get; init; } = new();
}

internal sealed class OpenMeteoCurrentWeather
{
    [JsonPropertyName("time")]
    public string Time { get; init; } = string.Empty;

    [JsonPropertyName("temperature_2m")]
    public double Temperature2m { get; init; }

    [JsonPropertyName("relative_humidity_2m")]
    public int RelativeHumidity2m { get; init; }

    [JsonPropertyName("apparent_temperature")]
    public double ApparentTemperature { get; init; }

    [JsonPropertyName("wind_speed_10m")]
    public double WindSpeed10m { get; init; }

    [JsonPropertyName("pressure_msl")]
    public double PressureMsl { get; init; }

    [JsonPropertyName("weather_code")]
    public int WeatherCode { get; init; }
}