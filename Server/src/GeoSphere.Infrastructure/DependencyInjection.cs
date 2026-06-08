using GeoSphere.Application.Abstractions.Geospatial;
using GeoSphere.Application.Abstractions.Weather;
using GeoSphere.Infrastructure.ExternalApis.Geospatial;
using GeoSphere.Infrastructure.ExternalApis.OpenMeteo;
using Microsoft.Extensions.DependencyInjection;

namespace GeoSphere.Infrastructure;

public static class DependencyInjection
{
    public static IServiceCollection AddInfrastructure(this IServiceCollection services)
    {
        services.AddMemoryCache();

        services.AddHttpClient<IWeatherService, OpenMeteoWeatherService>(client =>
        {
            client.BaseAddress = new Uri("https://api.open-meteo.com/");
            client.Timeout = TimeSpan.FromSeconds(10);
        });

        services.AddHttpClient("OpenMeteo", client =>
        {
            client.BaseAddress = new Uri("https://api.open-meteo.com/");
            client.Timeout = TimeSpan.FromSeconds(10);
        });

        services.AddHttpClient("Nominatim", client =>
        {
            client.BaseAddress = new Uri("https://nominatim.openstreetmap.org/");
            client.Timeout = TimeSpan.FromSeconds(10);

            client.DefaultRequestHeaders.UserAgent.ParseAdd(
                "GeoSphereWeather/1.0 (local-development)");

            client.DefaultRequestHeaders.Accept.ParseAdd("application/json");
        });

        services.AddScoped<IGeospatialService, GeospatialService>();

        return services;
    }
}