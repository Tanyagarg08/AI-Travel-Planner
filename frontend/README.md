# ✈️ AI Travel Planner

An AI-powered travel planning web app that generates complete trip plans in seconds. Enter your source and destination city, and get real-time weather forecasts, AI-generated flight & hotel recommendations, budget breakdown in INR, and a day-by-day itinerary — all for free.

---

## 🚀 Live Demo
> Coming soon after deployment

---

## 📸 Screenshots

> Add screenshots of your app here

---

## ✨ Features

- 🤖 **AI-Generated Plans** — Uses Groq / Gemini / OpenRouter to generate complete trip plans
- 🌤️ **Real-Time Weather** — Live weather forecast from OpenWeatherMap
- ✈️ **Flight Recommendations** — AI-suggested flights with Google Flights link
- 🏨 **3 Hotel Options** — Budget, Best Value & Luxury with real images from Pexels
- 💰 **Budget Breakdown** — Full cost breakdown in INR with pie chart
- 🗺️ **Day-by-Day Itinerary** — Detailed itinerary with time slots and activity icons
- 📥 **Download Plan** — Download your complete trip plan as a text file
- 🔗 **Book on Booking.com** — Direct links to book hotels
- 🏙️ **City Autocomplete** — Smart suggestions for Indian cities

---

## 🛠️ Tech Stack

**Frontend**
- React + Vite
- Tailwind CSS
- Recharts (charts)
- React Router

**Backend**
- Node.js + Express
- Groq AI / Google Gemini / OpenRouter (free AI models)
- OpenWeatherMap API
- Pexels API (hotel images)

---

## ⚙️ Setup & Installation

### Prerequisites
- Node.js v18+
- Free API keys (see below)

### 1. Clone the repo
```bash
git clone https://github.com/Tanyagarg08/AI-Travel-Planner.git
cd AI-Travel-Planner
```

### 2. Install dependencies
```bash
# Frontend
cd frontend
npm install

# Backend
cd ../backend
npm install
```

### 3. Create `backend/.env`
```env
AI_PROVIDER=groq

GROQ_API_KEY=your_groq_key_here
GEMINI_API_KEY=
OPENROUTER_API_KEY=
OPENROUTER_MODEL=

OPENWEATHER_API_KEY=your_openweather_key_here
PEXELS_API_KEY=your_pexels_key_here

PORT=3001
```

### 4. Create `frontend/.env`
```env
VITE_API_URL=http://localhost:3001
```

### 5. Run the app
```bash
# Terminal 1 - Backend
cd backend
node server.js

# Terminal 2 - Frontend
cd frontend
npm run dev
```

Open **http://localhost:5173** in your browser 🎉

---

## 🔑 Free API Keys

| Service | Link | Free Tier |
|---------|------|-----------|
| **Groq** | [console.groq.com](https://console.groq.com) | ✅ Free |
| **Gemini** | [aistudio.google.com](https://aistudio.google.com/apikey) | ✅ Free |
| **OpenRouter** | [openrouter.ai/keys](https://openrouter.ai/keys) | ✅ Free |
| **OpenWeather** | [openweathermap.org](https://openweathermap.org/api_keys) | ✅ Free |
| **Pexels** | [pexels.com/api](https://www.pexels.com/api/) | ✅ Free |

---

## 📁 Project Structure

```
AI-Travel-Planner/
├── frontend/
│   ├── src/
│   │   ├── pages/          # All page components
│   │   ├── components/     # Reusable components
│   │   ├── context/        # Trip context (state)
│   │   ├── services/       # API calls
│   │   └── utils/          # Helper functions
│   └── .env
└── backend/
    ├── config/             # Environment config
    ├── routes/             # API routes
    ├── services/           # AI, weather, image services
    └── .env
```

---

## 🤝 Contributing

Pull requests are welcome! For major changes, please open an issue first.

---

## 📄 License

MIT License

---

## 👩‍💻 Built by

**Tanya Garg** — [github.com/Tanyagarg08](https://github.com/Tanyagarg08)

> Built with ❤️ using React, Node.js, and free AI APIs
