using System.Text.Json.Serialization;

namespace GeoSphere.Infrastructure.ExternalApis.OpenMeteo;

internal sealed class OpenMeteoElevationResponse
{
    [JsonPropertyName("elevation")]
    public double[] Elevation { get; init; } = [];
}