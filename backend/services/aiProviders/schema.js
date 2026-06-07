export const TRAVEL_PLAN_SCHEMA = {
 hotels: {
      type: "array",
      items: {
        type: "object",
        properties: {
          name: { type: "string" },
          rating: { type: "number" },
          location: { type: "string" },
          description: { type: "string" },
          pricePerNightInr: { type: "number" },
          amenities: { type: "array", items: { type: "string" } },
          tag: { type: "string" },
        },
        required: ["name", "rating", "location", "description", "pricePerNightInr", "amenities", "tag"],
    },
    hotel: {
      type: "object",
      properties: {
        name: { type: "string" },
        rating: { type: "number" },
        location: { type: "string" },
        description: { type: "string" },
        pricePerNightInr: { type: "number" },
        amenities: { type: "array", items: { type: "string" } },
      },
      required: [
        "name",
        "rating",
        "location",
        "description",
        "pricePerNightInr",
        "amenities",
      ],
    },
    budget: {
      type: "object",
      properties: {
        categories: {
          type: "array",
          items: {
            type: "object",
            properties: {
              name: { type: "string" },
              amountInr: { type: "number" },
              percentage: { type: "number" },
            },
            required: ["name", "amountInr", "percentage"],
          },
        },
        totalInr: { type: "number" },
      },
      required: ["categories", "totalInr"],
    },
    itinerary: {
      type: "array",
      items: {
        type: "object",
        properties: {
          day: { type: "number" },
          title: { type: "string" },
          badge: { type: "string" },
          activities: { type: "array", items: { type: "string" } },
          tip: { type: "string" },
        },
        required: ["day", "title", "badge", "activities", "tip"],
      },
    },
  },
  required: ["flight", "hotels", "budget", "itinerary"],
};

export function buildTravelPrompt({ source, destination, days, weather }) {
  return `You are an expert Indian travel planner AI agent. Create a realistic travel plan.

Trip details:
- Source: ${source}
- Destination: ${destination}
- Duration: ${days} days

Real weather forecast for ${weather.city}, ${weather.country}:
${weather.daily.map((d) => `- ${d.day}: ${d.min}°C to ${d.max}°C, ${d.condition}`).join("\n")}
Average high: ${weather.avgHigh}°C, Average low: ${weather.avgLow}°C
Overall: ${weather.overallCondition}

Requirements:
1. Suggest a realistic flight from ${source} to ${destination} with Indian-market pricing in INR (₹).
2. Suggest 3 hotels in ${destination} at different price points (budget, mid-range, luxury) with nightly rate in INR. Set tag as "Budget Pick", "Best Value", or "Luxury".
3. Build a complete budget breakdown in INR only (flight, hotel for ${days} nights, food, local transport).
4. 4. Create a day-by-day itinerary for exactly ${days} days tailored to ${destination}, considering the weather. Each day MUST have exactly 3 activities array items: one starting with "Morning:", one with "Afternoon:", one with "Evening:". Example: ["Morning: Visit the fort", "Afternoon: Lunch at local restaurant", "Evening: Sunset at beach"].
5. Use real-sounding airline names, airport codes, and hotel names appropriate for the destination.
6. Budget totalInr must equal the sum of category amounts. Percentages must add to 100.
7. Return ONLY valid JSON matching the schema. All money values as plain numbers in INR.`;
}
