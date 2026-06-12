using System.Globalization;
using System.Net.Http.Json;
using GeoSphere.Application.Abstractions.Geospatial;
using GeoSphere.Application.DTOs.Geospatial;
using GeoSphere.Infrastructure.ExternalApis.Nominatim;
using GeoSphere.Infrastructure.ExternalApis.OpenMeteo;
using Microsoft.Extensions.Caching.Memory;

namespace GeoSphere.Infrastructure.ExternalApis.Geospatial;

public sealed class GeospatialService : IGeospatialService
{
    private static readonly SemaphoreSlim NominatimRateLimiter = new(1, 1);
    private static DateTimeOffset _lastNominatimRequestUtc = DateTimeOffset.MinValue;

    private readonly IHttpClientFactory _httpClientFactory;
    private readonly IMemoryCache _cache;

    public GeospatialService(
        IHttpClientFactory httpClientFactory,
        IMemoryCache cache)
    {
        _httpClientFactory = httpClientFactory;
        _cache = cache;
    }

    public async Task<GeospatialLocationDto> GetLocationDataAsync(
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

        var cacheKey = BuildCacheKey(latitude, longitude);

        if (_cache.TryGetValue(cacheKey, out GeospatialLocationDto? cachedResult) &&
            cachedResult is not null)
        {
            return cachedResult;
        }

        var elevationTask = GetElevationAsync(latitude, longitude, cancellationToken);
        var reverseGeocodingTask = GetReverseGeocodingAsync(latitude, longitude, cancellationToken);

        await Task.WhenAll(elevationTask, reverseGeocodingTask);

        var elevationMeters = await elevationTask;
        var reverseGeocoding = await reverseGeocodingTask;

        var address = reverseGeocoding?.Address;

        var result = new GeospatialLocationDto
        {
            Latitude = latitude,
            Longitude = longitude,

            Country = GetValueOrFallback(address?.Country, "Unknown Country"),
            City = ResolveCity(address),
            Region = ResolveRegion(address),

            ElevationMeters = elevationMeters,
            TerrainType = ResolveTerrainType(elevationMeters),
            SettlementType = ResolveSettlementType(address),

            RetrievedAtUtc = DateTimeOffset.UtcNow
        };

        _cache.Set(
            cacheKey,
            result,
            new MemoryCacheEntryOptions
            {
                AbsoluteExpirationRelativeToNow = TimeSpan.FromHours(12)
            });

        return result;
    }

    public async Task<IReadOnlyList<GeospatialSearchResultDto>> SearchLocationsAsync(
        string query,
        CancellationToken cancellationToken)
    {
        if (string.IsNullOrWhiteSpace(query))
        {
            return Array.Empty<GeospatialSearchResultDto>();
        }

        var normalizedQuery = query.Trim();

        if (normalizedQuery.Length < 2)
        {
            return Array.Empty<GeospatialSearchResultDto>();
        }

        await WaitForNominatimRateLimitAsync(cancellationToken);

        try
        {
            var client = _httpClientFactory.CreateClient("Nominatim");

            var endpoint =
                "search" +
                $"?q={Uri.EscapeDataString(normalizedQuery)}" +
                "&format=jsonv2" +
                "&addressdetails=1" +
                "&limit=5" +
                "&accept-language=en";

            var response = await client.GetFromJsonAsync<List<NominatimSearchResponse>>(
                endpoint,
                cancellationToken);

            _lastNominatimRequestUtc = DateTimeOffset.UtcNow;

            if (response is null || response.Count == 0)
            {
                return Array.Empty<GeospatialSearchResultDto>();
            }

            return response
                .Select(MapToSearchResult)
                .Where(result => result is not null)
                .Select(result => result!)
                .ToList();
        }
        finally
        {
            NominatimRateLimiter.Release();
        }
    }

    private async Task<double> GetElevationAsync(
        double latitude,
        double longitude,
        CancellationToken cancellationToken)
    {
        var client = _httpClientFactory.CreateClient("OpenMeteo");

        var lat = latitude.ToString(CultureInfo.InvariantCulture);
        var lng = longitude.ToString(CultureInfo.InvariantCulture);

        var endpoint = $"v1/elevation?latitude={lat}&longitude={lng}";

        var response = await client.GetFromJsonAsync<OpenMeteoElevationResponse>(
            endpoint,
            cancellationToken);

        if (response?.Elevation is null || response.Elevation.Length == 0)
        {
            return 0;
        }

        return response.Elevation[0];
    }

    private async Task<NominatimReverseGeocodingResponse?> GetReverseGeocodingAsync(
        double latitude,
        double longitude,
        CancellationToken cancellationToken)
    {
        await WaitForNominatimRateLimitAsync(cancellationToken);

        try
        {
            var client = _httpClientFactory.CreateClient("Nominatim");

            var lat = latitude.ToString(CultureInfo.InvariantCulture);
            var lng = longitude.ToString(CultureInfo.InvariantCulture);

            var endpoint =
                $"reverse?format=jsonv2&lat={lat}&lon={lng}" +
                "&zoom=10&addressdetails=1&accept-language=en";

            var response = await client.GetFromJsonAsync<NominatimReverseGeocodingResponse>(
                endpoint,
                cancellationToken);

            _lastNominatimRequestUtc = DateTimeOffset.UtcNow;

            return response;
        }
        finally
        {
            NominatimRateLimiter.Release();
        }
    }

    private static async Task WaitForNominatimRateLimitAsync(
        CancellationToken cancellationToken)
    {
        await NominatimRateLimiter.WaitAsync(cancellationToken);

        var elapsed = DateTimeOffset.UtcNow - _lastNominatimRequestUtc;

        if (elapsed < TimeSpan.FromSeconds(1))
        {
            await Task.Delay(TimeSpan.FromSeconds(1) - elapsed, cancellationToken);
        }
    }

    private static GeospatialSearchResultDto? MapToSearchResult(
        NominatimSearchResponse response)
    {
        if (!double.TryParse(
                response.Latitude,
                NumberStyles.Float,
                CultureInfo.InvariantCulture,
                out var latitude))
        {
            return null;
        }

        if (!double.TryParse(
                response.Longitude,
                NumberStyles.Float,
                CultureInfo.InvariantCulture,
                out var longitude))
        {
            return null;
        }

        var city = GetSearchCityName(response.Address);
        var country = response.Address.Country ?? "Unknown Country";
        var region = response.Address.State ?? "Unknown Region";

        var name = BuildSearchResultName(
            response.DisplayName,
            city,
            country);

        return new GeospatialSearchResultDto
        {
            Name = name,
            Latitude = latitude,
            Longitude = longitude,
            Country = country,
            City = city,
            Region = region
        };
    }

    private static string BuildCacheKey(double latitude, double longitude)
    {
        var roundedLatitude = Math.Round(latitude, 2, MidpointRounding.AwayFromZero);
        var roundedLongitude = Math.Round(longitude, 2, MidpointRounding.AwayFromZero);

        return string.Create(
            CultureInfo.InvariantCulture,
            $"geospatial:{roundedLatitude}:{roundedLongitude}");
    }

    private static string ResolveCity(NominatimAddress? address)
    {
        if (address is null)
        {
            return "Unknown Location";
        }

        return GetFirstNonEmpty(
            address.City,
            address.Town,
            address.Village,
            address.Municipality,
            address.County,
            "Unknown Location");
    }

    private static string ResolveRegion(NominatimAddress? address)
    {
        if (address is null)
        {
            return "Unknown Region";
        }

        return GetFirstNonEmpty(
            address.State,
            address.Province,
            address.Region,
            address.County,
            "Unknown Region");
    }

    private static string ResolveSettlementType(NominatimAddress? address)
    {
        if (!string.IsNullOrWhiteSpace(address?.City))
        {
            return "City";
        }

        if (!string.IsNullOrWhiteSpace(address?.Town))
        {
            return "Town";
        }

        if (!string.IsNullOrWhiteSpace(address?.Village))
        {
            return "Village";
        }

        if (!string.IsNullOrWhiteSpace(address?.Municipality))
        {
            return "Municipality";
        }

        return "Unknown";
    }

    private static string ResolveTerrainType(double elevationMeters)
    {
        return elevationMeters switch
        {
            < 0 => "Below Sea Level",
            < 50 => "Lowland",
            < 500 => "Plain",
            < 1500 => "Highland",
            _ => "Mountainous"
        };
    }

    private static string GetSearchCityName(NominatimSearchAddress address)
    {
        return GetFirstNonEmpty(
            address.City,
            address.Town,
            address.Village,
            address.Municipality,
            "Unknown Location");
    }

    private static string BuildSearchResultName(
        string displayName,
        string city,
        string country)
    {
        if (city != "Unknown Location" && country != "Unknown Country")
        {
            return $"{city}, {country}";
        }

        if (!string.IsNullOrWhiteSpace(displayName))
        {
            return displayName;
        }

        return "Unknown Location";
    }

    private static string GetValueOrFallback(string? value, string fallback)
    {
        return string.IsNullOrWhiteSpace(value) ? fallback : value;
    }

    private static string GetFirstNonEmpty(params string?[] values)
    {
        foreach (var value in values)
        {
            if (!string.IsNullOrWhiteSpace(value))
            {
                return value;
            }
        }

        return "Unknown";
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