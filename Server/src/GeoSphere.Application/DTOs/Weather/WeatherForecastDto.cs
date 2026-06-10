namespace GeoSphere.Application.DTOs.Weather;

public sealed class WeatherForecastDto
{
    public double Latitude { get; init; }

    public double Longitude { get; init; }

    public IReadOnlyList<DailyForecastDto> DailyForecasts { get; init; } =
        Array.Empty<DailyForecastDto>();

    public DateTimeOffset RetrievedAtUtc { get; init; }
}