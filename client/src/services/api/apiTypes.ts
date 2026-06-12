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

export type DailyForecastDto = {
  date: string;
  temperatureMaxCelsius: number;
  temperatureMinCelsius: number;
  precipitationProbabilityMaxPercentage: number;
  windSpeedMaxKmh: number;
  weatherCode: number;
  condition: string;
};

export type WeatherForecastDto = {
  latitude: number;
  longitude: number;
  dailyForecasts: DailyForecastDto[];
  retrievedAtUtc: string;
};

export type GeospatialSearchResultDto = {
  name: string;
  latitude: number;
  longitude: number;
  country: string;
  city: string;
  region: string;
};