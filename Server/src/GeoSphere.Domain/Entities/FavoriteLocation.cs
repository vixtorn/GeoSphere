namespace GeoSphere.Domain.Entities;

public sealed class FavoriteLocation
{
    public Guid Id { get; private set; }

    public string Name { get; private set; } = string.Empty;

    public double Latitude { get; private set; }

    public double Longitude { get; private set; }

    public DateTimeOffset CreatedAtUtc { get; private set; }

    private FavoriteLocation()
    {
    }

    public FavoriteLocation(
        string name,
        double latitude,
        double longitude)
    {
        if (string.IsNullOrWhiteSpace(name))
        {
            throw new ArgumentException("Favorite location name cannot be empty.", nameof(name));
        }

        if (latitude < -90 || latitude > 90)
        {
            throw new ArgumentOutOfRangeException(nameof(latitude), "Latitude must be between -90 and 90.");
        }

        if (longitude < -180 || longitude > 180)
        {
            throw new ArgumentOutOfRangeException(nameof(longitude), "Longitude must be between -180 and 180.");
        }

        Id = Guid.NewGuid();
        Name = name.Trim();
        Latitude = latitude;
        Longitude = longitude;
        CreatedAtUtc = DateTimeOffset.UtcNow;
    }
}