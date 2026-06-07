import {
  Calendar,
  Cloud,
  Compass,
  DollarSign,
  Hotel,
  MapPin,
  Plane,
  Sparkles,
} from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";
import { mainNavItems } from "../config/navigation";

const featureCards = [
  {
    icon: Plane,
    title: "Flight Recommendations",
    description: "Finds the cheapest flights between your source and destination.",
    path: "/recommendations",
  },
  {
    icon: Hotel,
    title: "Hotel Recommendations",
    description: "Suggests the best available hotels for your destination.",
    path: "/recommendations",
  },
  {
    icon: Cloud,
    title: "Weather Forecast",
    description: "Daily forecasts with temperature trends and insights.",
    path: "/weather",
  },
  {
    icon: DollarSign,
    title: "Budget Estimation",
    description: "Calculates total travel expenses with visual breakdowns.",
    path: "/budget",
  },
  {
    icon: Calendar,
    title: "Travel Itinerary",
    description: "Generates day-wise travel plans and recommendations.",
    path: "/itinerary",
  },
];

function Landing() {
  const navigate = useNavigate();

  return (
    <div className="bg-white min-h-screen flex flex-col">
      <nav className="bg-slate-900 text-white px-8 h-16 flex items-center justify-between">
        <NavLink to="/" className="flex items-center gap-2">
          <Compass className="text-blue-300" />
          <span className="font-bold text-lg">Yatri AI</span>
        </NavLink>

        <div className="flex gap-2">
          {mainNavItems.map((item) => (
            <NavLink
              key={item.path + item.label}
              to={item.path}
              end={item.end}
              className={({ isActive }) =>
                `text-sm px-3 py-2 rounded-lg transition-colors ${
                  isActive
                    ? "bg-blue-500 text-white font-semibold"
                    : "text-white/70 hover:text-white hover:bg-white/10"
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </div>
      </nav>

      <section
        className="relative h-[550px] bg-cover bg-center"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1541417904950-b855846fe074?auto=format&fit=crop&w=1600&q=80')",
        }}
      >
        <div className="absolute inset-0 bg-slate-900/70" />

        <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-6">
          <div className="bg-white/20 text-white px-4 py-2 rounded-full flex items-center gap-2 mb-6">
            <Sparkles size={16} />
            Yatri AI Powered Trip Planning
          </div>

          <h1 className="text-5xl md:text-6xl font-bold text-white max-w-5xl leading-tight">
            Your Yatri AI Travel Companion
          </h1>

          <p className="text-white/90 text-lg mt-6 max-w-2xl">
            Real weather data + AI-generated flights, hotels, budget in ₹, and
            day-by-day itineraries — all in one place.
          </p>

          <button
            type="button"
            onClick={() => navigate("/plan-trip")}
            className="mt-8 bg-blue-500 hover:bg-blue-600 text-white px-8 py-3 rounded-xl flex items-center gap-2 transition"
          >
            <MapPin size={18} />
            Start Planning Your Trip
          </button>
        </div>
      </section>

      <section id="features" className="p-12">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold">Everything You Need in One Dashboard</h2>
          <p className="text-gray-500 mt-3">
            Five smart services working together to craft your perfect trip.
          </p>
        </div>

        <div className="grid md:grid-cols-5 gap-5">
          {featureCards.map((feature) => {
            const Icon = feature.icon;
            return (
              <button
                key={feature.title}
                type="button"
                onClick={() => navigate(feature.path)}
                className="bg-white rounded-xl shadow-md p-6 text-left hover:shadow-lg hover:-translate-y-0.5 transition-all"
              >
                <div className="bg-blue-100 w-12 h-12 rounded-xl flex items-center justify-center mb-4">
                  <Icon className="text-blue-600" />
                </div>
                <h3 className="font-semibold mb-2">{feature.title}</h3>
                <p className="text-sm text-gray-500">{feature.description}</p>
              </button>
            );
          })}
        </div>
      </section>

      <footer className="bg-slate-900 text-white px-10 py-5 flex justify-between items-center mt-auto">
        <div className="flex items-center gap-2">
          <Compass size={16} className="text-blue-300" />
          <span className="text-sm">© 2026 Yatri AI</span>
        </div>
        <div className="flex gap-6 text-sm text-gray-400">
          <span>Privacy</span>
          <span>Terms</span>
          <span>Contact</span>
        </div>
      </footer>
    </div>
  );
}

export default Landing;
