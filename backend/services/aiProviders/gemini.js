import { TRAVEL_PLAN_SCHEMA, buildTravelPrompt } from "./schema.js";

const BASE_URL = "https://generativelanguage.googleapis.com/v1beta";

export async function validateGeminiKey(apiKey) {
  if (!apiKey) {
    return {
      ok: false,
      error: "GEMINI_API_KEY is missing. Get a FREE key at aistudio.google.com/apikey",
    };
  }

  if (apiKey.includes("your-") || apiKey === "your-gemini-api-key-here") {
    return { ok: false, error: "Replace the placeholder GEMINI_API_KEY in backend/.env" };
  }

  if (apiKey.startsWith("sk-or-")) {
    return {
      ok: false,
      error:
        "This is an OpenRouter key (sk-or-), not a Gemini key. Set AI_PROVIDER=openrouter and put the key in OPENROUTER_API_KEY instead.",
    };
  }

  if (!apiKey.startsWith("AIza") && !apiKey.startsWith("AQ")) {
    return {
      ok: false,
      error:
        "Google Gemini keys start with AIza. Get a free key at aistudio.google.com/apikey",
    };
  }

  try {
    const res = await fetch(`${BASE_URL}/models?key=${apiKey}`);
    const data = await res.json().catch(() => ({}));

    if (res.ok) {
      return { ok: true, provider: "gemini", label: "Google Gemini (Free)" };
    }

    if (res.status === 400 || res.status === 403) {
      return {
        ok: false,
        error: `Invalid Gemini API key. Get a free key at aistudio.google.com/apikey. (${data?.error?.message || "Unauthorized"})`,
      };
    }

    return {
      ok: false,
      error: data?.error?.message || `Gemini error (status ${res.status})`,
    };
  } catch {
    return { ok: false, error: "Could not reach Google Gemini API." };
  }
}

export async function generateWithGemini(tripData, apiKey, model) {
  const prompt = buildTravelPrompt(tripData);

  const res = await fetch(
    `${BASE_URL}/models/${model}:generateContent?key=${apiKey}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          responseMimeType: "application/json",
          responseSchema: TRAVEL_PLAN_SCHEMA,
          temperature: 0.7,
        },
      }),
    },
  );

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    const msg = data?.error?.message || `Gemini error (status ${res.status})`;
    if (res.status === 429) {
      throw new Error(`Gemini free tier limit reached. Wait a minute and try again. (${msg})`);
    }
    throw new Error(msg);
  }

  const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!text) {
    throw new Error("Gemini returned an empty response.");
  }

  return JSON.parse(text);
}
