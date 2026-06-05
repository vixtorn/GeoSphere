export type CurrentWeatherDto = {
  latitude: number;
  longitude: number;
  locationName: string;
  temperatureCelsius: number;
  feelsLikeCelsius: number;
  humidityPercentage: number;
  windSpeedKmh: number;
  pressureHPa: number;
  condition: string;
  retrievedAtUtc: string;
};

export type GeospatialLocationDto = {
  latitude: number;
  longitude: number;
  country: string;
  city: string;
  region: string;
  elevationMeters: number;
  terrainType: string;
  settlementType: string;
  retrievedAtUtc: string;
};

export type FavoriteLocationDto = {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  createdAtUtc: string;
};