# GeoSphere Weather

GeoSphere Weather is a full-stack weather and geospatial dashboard built around an interactive 3D globe. Users can select locations on the globe, search for cities, view current weather, check a 5-day forecast, inspect geospatial data, and save favorite locations locally.

## Demo

![GeoSphere Weather Demo](docs/demo/geosphere-demo.gif)

## Screenshots

### Main Globe View

![GeoSphere main page](docs/screenshots/main-page.png)

### Weather Dashboard

![GeoSphere weather dashboard](docs/screenshots/weather-dashboard.png)

### Geospatial Data

![GeoSphere geospatial data](docs/screenshots/geo-data.png)

### Saved Locations

![GeoSphere saved locations](docs/screenshots/saved-locations.png)

### 5-Day Forecast

![GeoSphere 5-day forecast](docs/screenshots/five-day-forecast.png)

## Features

* Interactive 3D globe with day/night texture switching
* Location search with geocoding support
* Current weather data based on selected coordinates
* 5-day weather forecast
* Geospatial information such as city, country, region, elevation, terrain type, and settlement type
* Favorite locations with save, delete, and navigate functionality
* Local SQLite persistence through a .NET Web API

## Tech Stack

### Frontend

* React
* TypeScript
* Vite
* Tailwind CSS
* Framer Motion
* react-globe.gl
* lucide-react

### Backend

* ASP.NET Core Web API
* C#
* Entity Framework Core
* SQLite
* Clean Architecture-inspired project structure

### External APIs

* Open-Meteo Weather API
* Open-Meteo Elevation API
* Nominatim / OpenStreetMap Geocoding API

## Project Structure

```txt
GeoSphere/
├── client/                         # React frontend
├── GeoSphere.Api/                  # ASP.NET Core Web API
├── Server/src/GeoSphere.Application
├── Server/src/GeoSphere.Domain
├── Server/src/GeoSphere.Infrastructure
└── docs/
    ├── demo/
    └── screenshots/
```

## Getting Started

Clone the repository:

```bash
git clone https://github.com/vixtorn/GeoSphere.git
cd GeoSphere
```

Create the frontend environment file:

```bash
cp client/.env.example client/.env.local
```

Create or update the local SQLite database:

```bash
dotnet ef database update --project ./Server/src/GeoSphere.Infrastructure/GeoSphere.Infrastructure.csproj --startup-project ./GeoSphere.Api/GeoSphere.Api.csproj
```

Run the frontend and backend together:

```bash
npm run dev
```

Frontend:

```txt
http://localhost:5173
```

Backend Swagger UI:

```txt
http://localhost:5276/swagger
```

## API Overview

```txt
GET    /api/weather/current
GET    /api/weather/forecast
GET    /api/geospatial/location
GET    /api/geospatial/search
GET    /api/favorite-locations
POST   /api/favorite-locations
DELETE /api/favorite-locations/{id}
```

## Notes

Local database files, environment files, build outputs, and large unused texture source files are excluded from version control through `.gitignore`.

This project was built as a portfolio project to demonstrate full-stack development, API integration, interactive frontend design, and backend persistence.

## Credits

* Weather and forecast data: Open-Meteo
* Elevation data: Open-Meteo Elevation API
* Geocoding and reverse geocoding: Nominatim / OpenStreetMap
* Day/Night toggle visual inspiration: Colt4D5 — “Day & Night Toggle Button” on CodePen
