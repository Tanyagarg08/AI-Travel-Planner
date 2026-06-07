import { fileURLToPath } from "url";
import { dirname, join } from "path";
import dotenv from "dotenv";
import { existsSync } from "fs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const envPath = join(__dirname, "..", ".env");

if (existsSync(envPath)) {
  dotenv.config({ path: envPath });
} else {
  dotenv.config();
}

function clean(value) {
  if (!value) return "";
  return value.trim().replace(/^["']|["']$/g, "");
}

/** Users often paste the full API URL — extract just the appid/key */
function parseOpenWeatherKey(raw) {
  const value = clean(raw);
  if (!value) return "";

  if (value.startsWith("http")) {
    const match = value.match(/appid[=:{]([a-f0-9]{32})/i);
    if (match) return match[1];
  }

  return value;
}

export function getEnv() {
  const aiProvider = clean(process.env.AI_PROVIDER).toLowerCase() || "openrouter";

return {
    envFileExists: existsSync(envPath),
    envFilePath: envPath,
    aiProvider,
    geminiKey: clean(process.env.GEMINI_API_KEY),
    groqKey: clean(process.env.GROQ_API_KEY),
    openrouterKey: clean(process.env.OPENROUTER_API_KEY),
    geminiModel: clean(process.env.GEMINI_MODEL) || "gemini-2.0-flash",
    groqModel: clean(process.env.GROQ_MODEL) || "llama-3.3-70b-versatile",
    openrouterModel: clean(process.env.OPENROUTER_MODEL) || "google/gemini-2.0-flash-exp:free",
    openweatherKey: parseOpenWeatherKey(process.env.OPENWEATHER_API_KEY),
    pexelsKey: clean(process.env.PEXELS_API_KEY),
    port: Number(process.env.PORT) || 3001,
  };
}