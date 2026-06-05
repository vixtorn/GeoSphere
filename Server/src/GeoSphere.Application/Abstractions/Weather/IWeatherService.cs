using GeoSphere.Application.DTOs.Weather;

namespace GeoSphere.Application.Abstractions.Weather;

public interface IWeatherService
{
    Task<CurrentWeatherDto> GetCurrentWeatherAsync(
        double latitude,
        double longitude,
        CancellationToken cancellationToken = default);
}