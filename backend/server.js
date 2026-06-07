import express from "express";
import cors from "cors";
import { getEnv } from "./config/env.js";
import tripRoutes from "./routes/tripRoutes.js";

const env = getEnv();
const app = express();

app.use(cors());
app.use(express.json());
app.use("/api", tripRoutes);

app.listen(env.port, () => {
  console.log(`AI Travel Planner API running on http://localhost:5176/}`);

  if (!env.envFileExists) {
    console.warn("");
    console.warn("⚠️  backend/.env NOT FOUND");
    console.warn("   Run:  copy .env.example .env   (inside the backend folder)");
    console.warn("   Then add your FREE API keys (Gemini + OpenWeather)");
    console.warn("");
  } else {
    console.log("✓ backend/.env loaded");
    console.log(`  AI Provider: ${env.aiProvider} (free)`);
    console.log(`  OpenWeather: ${env.openweatherKey ? "set" : "MISSING"}`);
      console.log(`  OpenRouter key: ${env.OPENROUTER_API_KEY ? "set" : "MISSING"}`);
    }
  }
);
