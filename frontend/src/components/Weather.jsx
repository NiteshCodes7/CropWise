import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Cloud,
  Sun,
  CloudRain,
  Wind,
  Droplets,
  Eye,
  MapPin,
  Search,
  RefreshCw,
  AlertCircle,
} from "lucide-react";

const WEATHER_API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY;

export default function Weather() {
  const [location, setLocation] = useState("");
  const [searchLocation, setSearchLocation] = useState("");
  const [weatherData, setWeatherData] = useState(null);
  const [weatherLoading, setWeatherLoading] = useState(false);
  const [weatherError, setWeatherError] = useState(null);

  const getWeatherIcon = (code) => {
    if (code.includes("01")) return Sun;
    if (code.includes("09") || code.includes("10")) return CloudRain;
    return Cloud;
  };

  useEffect(() => {
    fetchWeather();
  }, []);

  const fetchWeather = async (customLocation) => {
    setWeatherLoading(true);
    setWeatherError(null);

    try {
      let lat, lon;
      let queryUrl = "";

      if (customLocation) {
        queryUrl = `https://api.openweathermap.org/data/2.5/weather?q=${customLocation}&units=metric&appid=${WEATHER_API_KEY}`;
      } else {
        const pos = await new Promise((resolve, reject) =>
          navigator.geolocation.getCurrentPosition(resolve, reject, {
              enableHighAccuracy: true, 
              timeout: 10000,
              maximumAge: 0
          })
        );
        lat = pos.coords.latitude;
        lon = pos.coords.longitude;
        queryUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${WEATHER_API_KEY}`;
      }

      const currentRes = await fetch(queryUrl);
      if (!currentRes.ok) throw new Error("Weather data not found");
      const current = await currentRes.json();

      if (!lat || !lon) {
        lat = current.coord.lat;
        lon = current.coord.lon;
      }

      const forecastRes = await fetch(
        `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${WEATHER_API_KEY}`
      );
      const forecastData = forecastRes.ok ? await forecastRes.json() : null;

      console.log(forecastData)

      const iconComponent = getWeatherIcon(current.weather[0].icon);

      setWeatherData({
        location: `${current.name}, ${current.sys.country}`,
        current: {
          temperature: Math.round(current.main.temp),
          condition: current.weather[0].description,
          icon: iconComponent,
          humidity: current.main.humidity,
          windSpeed: Math.round(current.wind?.speed * 3.6),
          visibility: Math.round((current.visibility || 10000) / 1000),
          uvIndex: 6,
        },
        forecast: forecastData ? processForecast(forecastData.list) : [],
      });

      setLocation(`${current.name}, ${current.sys.country}`);
    } catch (err) {
      setWeatherError(err.message);
    } finally {
      setWeatherLoading(false);
    }
  };

  const processForecast = (list) => {
    const daily = {};

    list.forEach((item) => {
      const date = new Date(item.dt_txt).toDateString();
      if (!daily[date]) {
        daily[date] = {
          day: new Date(item.dt_txt).toLocaleDateString("en", {
            weekday: "short",
          }),
          temp_max: item.main.temp_max,
          temp_min: item.main.temp_min,
          condition: item.weather[0].description,
          icon: getWeatherIcon(item.weather[0].icon),
        };
      } else {
        daily[date].temp_max = Math.max(daily[date].temp_max, item.main.temp_max);
        daily[date].temp_min = Math.min(daily[date].temp_min, item.main.temp_min);
      }
    });

    return Object.values(daily).slice(0, 5);
  };

  const handleLocationSearch = () => {
    if (searchLocation.trim()) {
      fetchWeather(searchLocation);
      setSearchLocation("");
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-green-900 flex items-center">
        <Cloud className="w-6 h-6 mr-2" />
        Weather Conditions
      </h2>

      {/* Search Box */}
      <Card className="backdrop-blur-md bg-white/70 border-white/20 shadow-lg">
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row gap-4 items-center">
            <div className="flex items-center text-green-700">
              <MapPin className="w-5 h-5 mr-2" />
              <span className="font-medium">Location:</span>
              <span className="ml-2 font-semibold">{location}</span>
            </div>
            <div className="flex gap-2 flex-1 max-w-md">
              <Input
                placeholder="Search location..."
                value={searchLocation}
                onChange={(e) => setSearchLocation(e.target.value)}
                onKeyPress={(e) =>
                  e.key === "Enter" && handleLocationSearch()
                }
                className="bg-white/50 border-white/30"
              />
              <Button
                onClick={handleLocationSearch}
                className="bg-green-600 hover:bg-green-700 cursor-pointer"
              >
                <Search className="w-4 h-4" />
              </Button>
            </div>
            <Button
              onClick={() => fetchWeather()}
              variant="outline"
              className="border-green-600 text-green-600 hover:bg-green-50 cursor-pointer"
              disabled={weatherLoading}
            >
              <RefreshCw
                className={`w-4 h-4 mr-2 ${
                  weatherLoading ? "animate-spin" : ""
                }`}
              />
              Refresh
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Current Weather */}
      <Card className="backdrop-blur-md bg-white/70 border-white/20 shadow-lg">
        <CardHeader>
          <CardTitle className="text-green-900">Current Weather</CardTitle>
        </CardHeader>
        <CardContent>
          {weatherLoading ? (
            <div className="flex items-center justify-center py-8">
              <RefreshCw className="w-6 h-6 animate-spin text-green-600" />
            </div>
          ) : weatherError ? (
            <div className="flex items-center justify-center py-8 text-red-600">
              <AlertCircle className="w-5 h-5 mr-2" />
              <span className="text-sm">{weatherError}</span>
            </div>
          ) : weatherData ? (
            <div className="space-y-4">
              <div className="flex items-center">
                {React.createElement(weatherData.current.icon, {
                  className: "w-12 h-12 text-green-600 mr-4",
                })}
                <div>
                  <div className="text-3xl font-bold text-green-900">
                    {weatherData.current.temperature}°C
                  </div>
                  <div className="text-green-700 capitalize">
                    {weatherData.current.condition}
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center text-green-700">
                  <Droplets className="w-4 h-4 mr-2" />
                  <span className="text-sm">
                    Humidity: {weatherData.current.humidity}%
                  </span>
                </div>
                <div className="flex items-center text-green-700">
                  <Wind className="w-4 h-4 mr-2" />
                  <span className="text-sm">
                    Wind: {weatherData.current.windSpeed} km/h
                  </span>
                </div>
                <div className="flex items-center text-green-700">
                  <Eye className="w-4 h-4 mr-2" />
                  <span className="text-sm">
                    Visibility: {weatherData.current.visibility} km
                  </span>
                </div>
                <div className="flex items-center text-green-700">
                  <Sun className="w-4 h-4 mr-2" />
                  <span className="text-sm">
                    UV Index: {weatherData.current.uvIndex}
                  </span>
                </div>
              </div>
            </div>
          ) : null}
        </CardContent>
      </Card>

      {/* 5-Day Forecast */}
      <Card className="backdrop-blur-md bg-white/70 border-white/20 shadow-lg">
        <CardHeader>
          <CardTitle className="text-green-900">5-Day Forecast</CardTitle>
        </CardHeader>
        <CardContent>
          {weatherData?.forecast.length > 0 ? (
            <div className="space-y-3">
              {weatherData.forecast.map((day, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 rounded-lg bg-white/50"
                >
                  <div className="flex items-center">
                    {React.createElement(day.icon, {
                      className: "w-6 h-6 text-green-600 mr-3",
                    })}
                    <span className="font-medium text-green-900 w-20">
                      {day.day}
                    </span>
                  </div>
                  <span className="text-sm text-green-700 flex-1 text-center capitalize">
                    {day.condition}
                  </span>
                  <div className="flex items-center space-x-2 text-green-900">
                    <span className="font-semibold">
                      {Math.round(day.temp_max)}°
                    </span>
                    <span className="text-green-600">
                      {Math.round(day.temp_min)}°
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex items-center justify-center py-8 text-green-500">
              <Cloud className="w-16 h-16" />
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
