import { TRAVEL_PLAN_SCHEMA, buildTravelPrompt } from "./schema.js";

const BASE_URL = "https://api.groq.com/openai/v1";

export async function validateGroqKey(apiKey) {
  if (!apiKey) {
    return {
      ok: false,
      error: "GROQ_API_KEY is missing. Get a FREE key at console.groq.com/keys",
    };
  }

  if (apiKey.includes("your-") || apiKey === "your-groq-api-key-here") {
    return { ok: false, error: "Replace the placeholder GROQ_API_KEY in backend/.env" };
  }

  if (!apiKey.startsWith("gsk_")) {
    return {
      ok: false,
      error: "Groq key should start with gsk_. Get one free at console.groq.com/keys",
    };
  }

  try {
    const res = await fetch(`${BASE_URL}/models`, {
      headers: { Authorization: `Bearer ${apiKey}` },
    });
    const data = await res.json().catch(() => ({}));

    if (res.ok) {
      return { ok: true, provider: "groq", label: "Groq (Free)" };
    }

    if (res.status === 401) {
      return {
        ok: false,
        error: "Invalid Groq API key. Get a free key at console.groq.com/keys",
      };
    }

    return {
      ok: false,
      error: data?.error?.message || `Groq error (status ${res.status})`,
    };
  } catch {
    return { ok: false, error: "Could not reach Groq API." };
  }
}

export async function generateWithGroq(tripData, apiKey, model) {
  const prompt = buildTravelPrompt(tripData);

  const res = await fetch(`${BASE_URL}/chat/completions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      messages: [
        {
          role: "system",
          content:
            "You are a travel planning AI. Return only valid JSON. All money in INR as plain numbers.",
        },
        { role: "user", content: prompt },
      ],
      response_format: { type: "json_object" },
      temperature: 0.7,
    }),
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    const msg = data?.error?.message || `Groq error (status ${res.status})`;
    if (res.status === 429) {
      throw new Error(`Groq free tier limit reached. Wait and try again. (${msg})`);
    }
    throw new Error(msg);
  }

  const content = data.choices?.[0]?.message?.content;
  if (!content) {
    throw new Error("Groq returned an empty response.");
  }

  return JSON.parse(content);
}
