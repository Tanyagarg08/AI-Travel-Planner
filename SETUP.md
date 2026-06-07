# AI Travel Planner — FREE API Setup

All APIs used in this project have **free tiers**. No paid OpenAI key needed.

## FREE API Keys You Need

| Service | Cost | Get Key |
|---------|------|---------|
| **Google Gemini** (AI) | Free | [aistudio.google.com/apikey](https://aistudio.google.com/apikey) |
| **OpenWeather** (weather) | Free | [openweathermap.org/api_keys](https://openweathermap.org/api_keys) |

**Optional alternative AI (also free):**
| **Groq** | Free | [console.groq.com/keys](https://console.groq.com/keys) |

## Setup

### 1. Create `backend/.env`

```bash
cd backend
copy .env.example .env
```

### 2. Add your FREE keys to `backend/.env`

**Option A — Google Gemini (recommended, default):**
```env
AI_PROVIDER=gemini
GEMINI_API_KEY=your-gemini-key-from-aistudio
OPENWEATHER_API_KEY=your-openweather-key
```

**Option B — Groq (alternative free AI):**
```env
AI_PROVIDER=groq
GROQ_API_KEY=gsk_your-groq-key
OPENWEATHER_API_KEY=your-openweather-key
```

### 3. Run the app

```bash
# Terminal 1 — Backend
cd backend
npm install
npm run dev

# Terminal 2 — Frontend
cd frontend
npm run dev
```

Open [http://localhost:5173/plan-trip](http://localhost:5173/plan-trip) — you should see a green "FREE API keys are working" banner.

## Notes

- **OpenWeather** new keys can take up to 2 hours to activate
- **Gemini** free tier has daily limits — if you hit them, wait a minute or switch to Groq
- **Groq** keys start with `gsk_`
- Budget is always shown in **Indian Rupees (₹)**
