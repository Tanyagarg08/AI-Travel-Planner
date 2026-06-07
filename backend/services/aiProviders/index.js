import { generateWithGemini, validateGeminiKey } from "./gemini.js";
import { generateWithGroq, validateGroqKey } from "./groq.js";
import { generateWithOpenRouter, validateOpenRouterKey } from "./openrouter.js";

const PROVIDERS = {
  gemini: {
    label: "Google Gemini (Free)",
    validate: validateGeminiKey,
    generate: generateWithGemini,
    getKey: (env) => env.geminiKey,
    getModel: (env) => env.geminiModel,
    keyName: "GEMINI_API_KEY",
  },
  groq: {
    label: "Groq (Free)",
    validate: validateGroqKey,
    generate: generateWithGroq,
    getKey: (env) => env.groqKey,
    getModel: (env) => env.groqModel,
    keyName: "GROQ_API_KEY",
  },
  openrouter: {
    label: "OpenRouter (Free)",
    validate: validateOpenRouterKey,
    generate: generateWithOpenRouter,
    getKey: (env) => env.openrouterKey,
    getModel: (env) => env.openrouterModel,
    keyName: "OPENROUTER_API_KEY",
  },
};

export function getActiveProvider(env) {
  const name = env.aiProvider;
  const provider = PROVIDERS[name];

  if (!provider) {
    throw new Error(
      `Unknown AI_PROVIDER "${name}". Use "openrouter", "gemini", or "groq" in backend/.env`,
    );
  }

  return { name, ...provider };
}

export async function validateAiProvider(env) {
  const provider = getActiveProvider(env);
  const apiKey = provider.getKey(env);
  const result = await provider.validate(apiKey);

  return {
    ...result,
    provider: provider.name,
    label: provider.label,
    model: provider.getModel(env),
  };
}

export async function generateTravelPlan(tripData, env) {
  const provider = getActiveProvider(env);
  const apiKey = provider.getKey(env);
  const model = provider.getModel(env);

  if (!apiKey) {
    throw new Error(`${provider.keyName} is missing in backend/.env`);
  }

  return provider.generate(tripData, apiKey, model);
}
