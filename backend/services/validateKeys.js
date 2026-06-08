import { validateAiProvider } from "./aiProviders/index.js";

export async function validateOpenWeatherKey(apiKey) {
  if (!apiKey) {
    return { ok: false, error: "OPENWEATHER_API_KEY is missing in backend/.env" };
  }

  if (apiKey.includes("your-") || apiKey === "your-openweather-api-key-here") {
    return { ok: false, error: "Replace the placeholder OpenWeather key in backend/.env" };
  }

  if (apiKey.startsWith("http")) {
    return {
      ok: false,
      error:
        "Paste only the API KEY (32 characters), not the full URL. Example: OPENWEATHER_API_KEY=your_32_char_key_here",
    };  // ✅ this closing brace was missing!
  }

  try {
    const res = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=London&appid=${apiKey}&units=metric`,
    );
    const data = await res.json();

    if (res.ok) {
      return { ok: true, label: "OpenWeather (Free)" };
    }

    if (data?.cod === 401) {
      return {
        ok: false,
        error:
          "Invalid OpenWeather API key. Get a FREE key at openweathermap.org/api_keys. New keys can take up to 2 hours to activate.",
      };
    }

    return {
      ok: false,
      error: data?.message || `OpenWeather error (status ${res.status})`,
    };
  } catch {
    return { ok: false, error: "Could not reach OpenWeather API. Check your internet connection." };
  }
}

export { validateAiProvider };