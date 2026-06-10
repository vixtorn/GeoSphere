namespace GeoSphere.Application.DTOs.Weather;

public sealed class DailyForecastDto
{
    public string Date { get; init; } = string.Empty;

    public double TemperatureMaxCelsius { get; init; }

    public double TemperatureMinCelsius { get; init; }

    public int PrecipitationProbabilityMaxPercentage { get; init; }

    public double WindSpeedMaxKmh { get; init; }

    public int WeatherCode { get; init; }

    public string Condition { get; init; } = string.Empty;
}