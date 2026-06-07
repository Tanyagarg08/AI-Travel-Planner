const GEO_URL = "https://api.openweathermap.org/geo/1.0/direct";
const FORECAST_URL = "https://api.openweathermap.org/data/2.5/forecast";

function mapCondition(main) {
  const map = {
    Clear: "sunny",
    Clouds: "cloudy",
    Rain: "rainy",
    Drizzle: "rainy",
    Thunderstorm: "rainy",
    Snow: "cloudy",
    Mist: "cloudy",
    Fog: "cloudy",
    Haze: "cloudy",
  };
  return map[main] || "partly-cloudy";
}

async function parseApiError(response, service) {
  const data = await response.json().catch(() => ({}));

  if (data?.cod === 401 || response.status === 401) {
    return `${service} API key is invalid. Check OPENWEATHER_API_KEY in backend/.env. New keys may take up to 2 hours to activate.`;
  }

  if (data?.cod === 429 || response.status === 429) {
    return `${service} rate limit reached. Wait a few minutes and try again.`;
  }

  return data?.message || `${service} request failed (status ${response.status})`;
}

export async function fetchWeatherForecast(city, days, apiKey) {
  const query = city.includes(",") ? city : `${city}, India`;
  const geoRes = await fetch(
    `${GEO_URL}?q=${encodeURIComponent(query)}&limit=1&appid=${apiKey}`,
  );

  const geoData = await geoRes.json().catch(() => []);

  if (!geoRes.ok) {
    throw new Error(await parseApiError(geoRes, "OpenWeather"));
  }

  if (!Array.isArray(geoData) || !geoData.length) {
    throw new Error(
      `City "${city}" not found. Try a well-known city name like Mumbai, Delhi, Goa, or Paris.`,
    );
  }

  const { lat, lon, name, country } = geoData[0];

  const forecastRes = await fetch(
    `${FORECAST_URL}?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`,
  );

  if (!forecastRes.ok) {
    throw new Error(await parseApiError(forecastRes, "OpenWeather"));
  }

  const forecastData = await forecastRes.json();
  const dailyMap = new Map();

  for (const entry of forecastData.list) {
    const date = entry.dt_txt.split(" ")[0];
    const existing = dailyMap.get(date) || {
      max: entry.main.temp_max,
      min: entry.main.temp_min,
      conditions: [],
    };

    existing.max = Math.max(existing.max, entry.main.temp_max);
    existing.min = Math.min(existing.min, entry.main.temp_min);
    existing.conditions.push(entry.weather[0].main);
    dailyMap.set(date, existing);
  }

  const sortedDays = [...dailyMap.entries()].slice(0, days).map(([date, data], index) => {
    const conditionCounts = data.conditions.reduce((acc, c) => {
      acc[c] = (acc[c] || 0) + 1;
      return acc;
    }, {});
    const dominant = Object.entries(conditionCounts).sort((a, b) => b[1] - a[1])[0][0];

    return {
      day: `Day ${index + 1}`,
      date,
      max: Math.round(data.max),
      min: Math.round(data.min),
      condition: dominant,
      icon: mapCondition(dominant),
    };
  });

  const avgHigh =
    sortedDays.reduce((sum, d) => sum + d.max, 0) / (sortedDays.length || 1);
  const avgLow =
    sortedDays.reduce((sum, d) => sum + d.min, 0) / (sortedDays.length || 1);

  const conditionCounts = sortedDays.reduce((acc, d) => {
    acc[d.condition] = (acc[d.condition] || 0) + 1;
    return acc;
  }, {});
  const overallCondition = Object.entries(conditionCounts).sort(
    (a, b) => b[1] - a[1],
  )[0]?.[0] || "Clear";

  return {
    city: name,
    country,
    daily: sortedDays,
    avgHigh: Math.round(avgHigh * 10) / 10,
    avgLow: Math.round(avgLow * 10) / 10,
    overallCondition: mapOverallLabel(overallCondition),
  };
}

function mapOverallLabel(condition) {
  const labels = {
    Clear: "Mostly Sunny",
    Clouds: "Partly Cloudy",
    Rain: "Rainy",
    Drizzle: "Light Rain",
    Thunderstorm: "Stormy",
    Snow: "Snowy",
    Mist: "Misty",
    Fog: "Foggy",
    Haze: "Hazy",
  };
  return labels[condition] || "Variable";
}
