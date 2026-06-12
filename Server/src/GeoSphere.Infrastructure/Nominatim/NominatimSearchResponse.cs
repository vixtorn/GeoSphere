using System.Text.Json.Serialization;

namespace GeoSphere.Infrastructure.ExternalApis.Nominatim;

public sealed class NominatimSearchResponse
{
    [JsonPropertyName("display_name")]
    public string DisplayName { get; init; } = string.Empty;

    [JsonPropertyName("lat")]
    public string Latitude { get; init; } = string.Empty;

    [JsonPropertyName("lon")]
    public string Longitude { get; init; } = string.Empty;

    [JsonPropertyName("address")]
    public NominatimSearchAddress Address { get; init; } = new();
}

public sealed class NominatimSearchAddress
{
    [JsonPropertyName("city")]
    public string? City { get; init; }

    [JsonPropertyName("town")]
    public string? Town { get; init; }

    [JsonPropertyName("village")]
    public string? Village { get; init; }

    [JsonPropertyName("municipality")]
    public string? Municipality { get; init; }

    [JsonPropertyName("state")]
    public string? State { get; init; }

    [JsonPropertyName("country")]
    public string? Country { get; init; }
}