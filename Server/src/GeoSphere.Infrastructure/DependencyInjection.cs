using GeoSphere.Application.Abstractions.Weather;
using GeoSphere.Infrastructure.ExternalApis.OpenMeteo;
using Microsoft.Extensions.DependencyInjection;

namespace GeoSphere.Infrastructure;

public static class DependencyInjection
{
    public static IServiceCollection AddInfrastructure(this IServiceCollection services)
    {
        services.AddHttpClient<IWeatherService, OpenMeteoWeatherService>(client =>
        {
            client.BaseAddress = new Uri("https://api.open-meteo.com/");
            client.Timeout = TimeSpan.FromSeconds(10);
        });

        return services;
    }
}