namespace GeoSphere.Application.DTOs.Weather;

public sealed class CurrentWeatherDto
{
    public double Latitude { get; init; }
    public double Longitude { get; init; }

    public string LocationName { get; init; } = string.Empty;

    public double TemperatureCelsius { get; init; }
    public double FeelsLikeCelsius { get; init; }
    public int HumidityPercentage { get; init; }
    public double WindSpeedKmh { get; init; }
    public int PressureHPa { get; init; }

    public string Condition { get; init; } = string.Empty;
    public DateTimeOffset RetrievedAtUtc { get; init; }
}