import { Router } from "express";
import { getEnv } from "../config/env.js";
import { generateTravelPlan } from "../services/aiProviders/index.js";
import { fetchWeatherForecast } from "../services/weatherService.js";
import { validateAiProvider, validateOpenWeatherKey } from "../services/validateKeys.js";
import { fetchHotelImage } from "../services/pexelsService.js";

const router = Router();

router.get("/health", async (_req, res) => {
  const env = getEnv();
  res.json({
    status: "ok",
    envFileExists: env.envFileExists,
    aiProvider: env.aiProvider,
    openweather: Boolean(env.openweatherKey),
    ai: Boolean(
      env.aiProvider === "groq"
        ? env.groqKey
        : env.aiProvider === "openrouter"
          ? env.openrouterKey
          : env.geminiKey,
    ),
  });
});

router.get("/validate-keys", async (_req, res) => {
  const env = getEnv();

  if (!env.envFileExists) {
    return res.status(500).json({
      ready: false,
      envFileExists: false,
      aiProvider: env.aiProvider,
      message: "backend/.env file not found. Copy backend/.env.example to backend/.env and add your FREE API keys.",
      openweather: { ok: false, error: "No .env file" },
      ai: { ok: false, error: "No .env file" },
    });
  }

  const [openweather, ai] = await Promise.all([
    validateOpenWeatherKey(env.openweatherKey),
    validateAiProvider(env),
  ]);

  const ready = openweather.ok && ai.ok;

  res.status(ready ? 200 : 500).json({
    ready,
    envFileExists: true,
    aiProvider: env.aiProvider,
    openweather,
    ai,
    message: ready
      ? `All FREE API keys are working (${ai.label}).`
      : "One or more API keys need to be fixed.",
  });
});

router.post("/generate-plan", async (req, res) => {
  try {
    const { source, destination, days } = req.body;

    if (!source?.trim() || !destination?.trim()) {
      return res.status(400).json({
        error: "Source and destination cities are required.",
      });
    }

    const env = getEnv();
    const tripDays = Math.max(1, Math.min(14, Number(days) || 5));

    if (!env.envFileExists) {
      return res.status(500).json({
        error: "backend/.env file not found. Copy backend/.env.example to backend/.env and paste your FREE API keys.",
      });
    }

    if (!env.openweatherKey) {
      return res.status(500).json({
        error: "OPENWEATHER_API_KEY is missing in backend/.env (free at openweathermap.org).",
      });
    }

    const [weatherCheck, aiCheck] = await Promise.all([
      validateOpenWeatherKey(env.openweatherKey),
      validateAiProvider(env),
    ]);

    if (!weatherCheck.ok) {
      return res.status(500).json({ error: weatherCheck.error });
    }

    if (!aiCheck.ok) {
      return res.status(500).json({ error: aiCheck.error });
    }

    const weather = await fetchWeatherForecast(
      destination.trim() + ", IN",
      tripDays,
      env.openweatherKey,
    );

    const aiPlan = await generateTravelPlan(
      {
        source: source.trim(),
        destination: destination.trim(),
        days: tripDays,
        weather,
      },
      env,
    );

    // Fetch hotel images in parallel
    const hotelList =
      Array.isArray(aiPlan.hotels) ? aiPlan.hotels :
      Array.isArray(aiPlan.hotelOptions) ? aiPlan.hotelOptions :
      Array.isArray(aiPlan.hotelRecommendations) ? aiPlan.hotelRecommendations :
      Array.isArray(aiPlan.hotel) ? aiPlan.hotel :
      aiPlan.hotel ? [aiPlan.hotel] : [];

    const hotelsWithImages = await Promise.all(hotelList.map(async (h, i) => {
      const imageUrl = await fetchHotelImage(
        h.name || "hotel",
        destination.trim(),
        h.tag || "",
        env.pexelsKey
      );
      return {
        name: h.name || "Hotel",
        rating: h.rating || [3, 4, 5][i] || 4,
        location: h.location || h.address || destination.trim(),
        description: h.description || h.about || `A ${["budget-friendly", "well-rated", "luxury"][i] || "comfortable"} hotel in ${destination.trim()}.`,
        pricePerNightInr: Number(h.pricePerNightInr || h.nightlyRate || h.price || [2500, 6000, 15000][i] || 3000),
        amenities: h.amenities || [
          ["Free WiFi", "Parking"],
          ["Free WiFi", "Breakfast", "Parking"],
          ["Free WiFi", "Breakfast", "Pool", "Gym", "Parking"],
        ][i] || ["Free WiFi", "Parking"],
        tag: h.tag || ["Budget Pick", "Best Value", "Luxury"][i] || "Recommended",
        image: imageUrl || null,
      };
    }));

    
    const f = aiPlan.flight || aiPlan.flightDetails || aiPlan.flightInfo || {};
    const b = aiPlan.budget || aiPlan.budgetBreakdown || aiPlan.budgetDetails || {};

    const normalized = {
      flight: {
        airline: f.airline || "IndiGo",
        flightNumber: f.flightNumber || f.flight_number || "6E-001",
        aircraft: f.aircraft || "Airbus A320",
        departureTime: f.departureTime || f.departure_time || "08:00",
        arrivalTime: f.arrivalTime || f.arrival_time || "10:00",
        duration: f.duration || "2h 00m",
        departureAirport: f.departureAirport || f.sourceAirport || f.source || source.trim(),
        arrivalAirport: f.arrivalAirport || f.destinationAirport || f.destination || destination.trim(),
        priceInr: f.priceInr || f.price || f.priceINR || 5000,
        stops: f.stops || "Non-stop",
      },
      hotels: hotelsWithImages,
      budget: {
        categories: Array.isArray(b.categories)
          ? b.categories.map(c => ({
              name: c.name || c.category || "Other",
              amountInr: c.amountInr || c.amount || c.cost || c.amountINR || 0,
              percentage: c.percentage || c.percent || 0,
            }))
          : [
              { name: "Flight", amountInr: b.flight || 5000, percentage: b.percentages?.flight || 25 },
              { name: "Hotel", amountInr: b.hotel || 9000, percentage: b.percentages?.hotel || 45 },
              { name: "Food", amountInr: b.food || 3000, percentage: b.percentages?.food || 20 },
              { name: "Local Transport", amountInr: b.localTransport || b.transport || 2000, percentage: b.percentages?.localTransport || 10 },
            ],
        totalInr: b.totalInr || b.total || b.totalINR || 19000,
      },
      itinerary: (Array.isArray(aiPlan.itinerary)
        ? aiPlan.itinerary
        : Object.values(aiPlan.itinerary || {})
      ).map((day, i) => {
        const rawActivities = Array.isArray(day.activities)
          ? day.activities
          : Array.isArray(day.tasks)
            ? day.tasks
            : typeof day.activity === "string"
              ? day.activity.split(/,(?=\s*[A-Z])|\band\b/).map(a => a.trim()).filter(Boolean)
              : typeof day.description === "string"
                ? day.description.split(/,(?=\s*[A-Z])|\band\b/).map(a => a.trim()).filter(Boolean)
                : [`Explore ${destination.trim()}`];

        const title = day.title ||
          (typeof day.activity === "string" ? day.activity.split(",")[0].trim().slice(0, 40) : null) ||
          (typeof day.description === "string" ? day.description.split(",")[0].trim().slice(0, 40) : null) ||
          `Day ${day.day || i + 1}`;

        return {
          day: day.day || i + 1,
          title,
          badge: day.badge || "Explore",
          activities: rawActivities,
          tip: day.tip || day.note || day.weather_tip || "Enjoy your day!",
        };
      }),
    };

    res.json({
      source: source.trim(),
      destination: destination.trim(),
      days: tripDays,
      weather,
      aiProvider: env.aiProvider,
      ...normalized,
    });
  } catch (error) {
  
    res.status(500).json({
      error: error.message || "Failed to generate travel plan.",
    });
  }
});

export default router;
