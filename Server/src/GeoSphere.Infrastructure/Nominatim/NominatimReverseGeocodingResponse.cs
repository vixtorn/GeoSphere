using System.Text.Json.Serialization;

namespace GeoSphere.Infrastructure.ExternalApis.Nominatim;

internal sealed class NominatimReverseGeocodingResponse
{
    [JsonPropertyName("display_name")]
    public string DisplayName { get; init; } = string.Empty;

    [JsonPropertyName("address")]
    public NominatimAddress Address { get; init; } = new();
}

internal sealed class NominatimAddress
{
    [JsonPropertyName("country")]
    public string? Country { get; init; }

    [JsonPropertyName("state")]
    public string? State { get; init; }

    [JsonPropertyName("province")]
    public string? Province { get; init; }

    [JsonPropertyName("region")]
    public string? Region { get; init; }

    [JsonPropertyName("county")]
    public string? County { get; init; }

    [JsonPropertyName("city")]
    public string? City { get; init; }

    [JsonPropertyName("town")]
    public string? Town { get; init; }

    [JsonPropertyName("village")]
    public string? Village { get; init; }

    [JsonPropertyName("municipality")]
    public string? Municipality { get; init; }
}