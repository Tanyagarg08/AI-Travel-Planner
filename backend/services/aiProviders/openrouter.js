import { buildTravelPrompt } from "./schema.js";

const BASE_URL = "https://openrouter.ai/api/v1";

export async function validateOpenRouterKey(apiKey) {
  if (!apiKey) {
    return {
      ok: false,
      error: "OPENROUTER_API_KEY is missing. Get a FREE key at openrouter.ai/keys",
    };
  }

  if (apiKey.includes("your-") || apiKey === "your-openrouter-api-key-here") {
    return { ok: false, error: "Replace the placeholder OPENROUTER_API_KEY in backend/.env" };
  }

  if (!apiKey.startsWith("sk-or-")) {
    return {
      ok: false,
      error: "OpenRouter key should start with sk-or-. Get one free at openrouter.ai/keys",
    };
  }

  try {
    const res = await fetch(`${BASE_URL}/models`, {
      headers: { Authorization: `Bearer ${apiKey}` },
    });

    if (res.ok) {
      return { ok: true, provider: "openrouter", label: "OpenRouter (Free)" };
    }

    const data = await res.json().catch(() => ({}));

    if (res.status === 401) {
      return {
        ok: false,
        error: "Invalid OpenRouter API key. Get a free key at openrouter.ai/keys",
      };
    }

    return {
      ok: false,
      error: data?.error?.message || `OpenRouter error (status ${res.status})`,
    };
  } catch {
    return { ok: false, error: "Could not reach OpenRouter API." };
  }
}

export async function generateWithOpenRouter(tripData, apiKey, model) {
  const prompt = buildTravelPrompt(tripData);

  const res = await fetch(`${BASE_URL}/chat/completions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
      "HTTP-Referer": "http://localhost:5173",
      "X-Title": "AI Travel Planner",
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
    const msg = data?.error?.message || `OpenRouter error (status ${res.status})`;
    if (res.status === 429) {
      throw new Error(`OpenRouter free limit reached. Wait and try again. (${msg})`);
    }
    throw new Error(msg);
  }

  const content = data.choices?.[0]?.message?.content;
  if (!content) {
    throw new Error("OpenRouter returned an empty response.");
  }

  // Strip markdown code fences if model wraps JSON in ```json ... ```
  const clean = content.replace(/^```(?:json)?\s*/i, "").replace(/```\s*$/i, "").trim();

  try {
    return JSON.parse(clean);
  } catch {
    throw new Error("OpenRouter returned invalid JSON: " + clean.slice(0, 200));
  }
}