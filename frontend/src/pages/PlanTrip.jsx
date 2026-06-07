import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  AlertCircle,
  CalendarDays,
  ChevronDown,
  ChevronUp,
  Info,
  Map,
  PlaneLanding,
  PlaneTakeoff,
  Sparkles,
} from "lucide-react";

import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import ApiStatus from "../components/ApiStatus";
import { useTrip } from "../context/TripContext";
import { generateTravelPlan } from "../services/api";


const INDIAN_CITIES = [
  "Mumbai", "Delhi", "Bangalore", "Hyderabad", "Chennai", "Kolkata",
  "Pune", "Ahmedabad", "Jaipur", "Surat", "Lucknow", "Kanpur",
  "Nagpur", "Indore", "Thane", "Bhopal", "Visakhapatnam", "Patna",
  "Vadodara", "Goa", "Agra", "Nashik", "Ranchi", "Faridabad",
  "Meerut", "Rajkot", "Varanasi", "Srinagar", "Aurangabad", "Dhanbad",
  "Amritsar", "Allahabad", "Jodhpur", "Coimbatore", "Kochi", "Guwahati",
  "Chandigarh", "Dehradun", "Mysore", "Shimla", "Manali", "Ooty",
  "Darjeeling", "Udaipur", "Jaisalmer", "Rishikesh", "Haridwar",
  "Tirupati", "Madurai", "Vijayawada", "Bhubaneswar", "Raipur",
];

function fetchCitySuggestions(query) {
  if (!query || query.length < 2) return [];
  const q = query.toLowerCase();
  return INDIAN_CITIES
    .filter((city) => city.toLowerCase().startsWith(q))
    .slice(0, 5)
    .map((city) => ({ name: city, state: "", country: "IN" }));
}

export default function PlanTrip() {
  const navigate = useNavigate();
  const { trip, setPlanData, setLoading, setError } = useTrip();

  const [form, setForm] = useState({
    source: trip.source || "",
    destination: trip.destination || "",
    days: trip.days || 5,
  });

  const [sourceSuggestions, setSourceSuggestions] = useState([]);
  const [destSuggestions, setDestSuggestions] = useState([]);
  const [showSourceSuggestions, setShowSourceSuggestions] = useState(false);
  const [showDestSuggestions, setShowDestSuggestions] = useState(false);

  const adjustDays = (delta) => {
    setForm((prev) => ({
      ...prev,
      days: Math.max(1, Math.min(14, prev.days + delta)),
    }));
  };

  const handleSubmit = async () => {
    if (!form.source.trim() || !form.destination.trim()) return;
    setLoading(true);
    try {
      const plan = await generateTravelPlan({
        source: form.source.trim(),
        destination: form.destination.trim(),
        days: form.days,
      });
      setPlanData(plan);
      navigate("/recommendations");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="p-12 flex justify-center">
      <div className="w-full max-w-2xl">
        <h1 className="text-3xl font-bold">Plan a Trip</h1>
        <p className="text-gray-500 mt-1 mb-8">
          Enter your cities — free AI (Gemini/Groq) + real weather builds your
          full plan in Indian Rupees (₹).
        </p>

        <ApiStatus />

        {trip.error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-xl p-4 flex gap-3">
            <AlertCircle className="size-5 text-red-500 shrink-0 mt-0.5" />
            <div>
              <p className="font-medium text-red-800">Could not generate plan</p>
              <p className="text-sm text-red-600 mt-1">{trip.error}</p>
              <p className="text-xs text-red-500 mt-2">
                Make sure the backend is running and API keys are set in backend/.env
              </p>
            </div>
          </div>
        )}

        <Card>
          <div className="bg-blue-500 px-6 py-5 flex items-center gap-3">
            <Map className="text-white" />
            <h2 className="text-white text-xl font-bold">Plan Your Trip</h2>
          </div>

          <CardContent className="p-6 flex flex-col gap-6">

            {/* Source City */}
            <div>
              <Label>Source City</Label>
              <div className="relative mt-2">
                <PlaneTakeoff className="absolute left-3 top-3 text-gray-500 z-10" size={16} />
                <Input
                  className="pl-10"
                  placeholder="e.g. Mumbai"
                  value={form.source}
                  disabled={trip.loading}
                  autoComplete="off"
                  onChange={async (e) => {
                    const val = e.target.value;
                    setForm((prev) => ({ ...prev, source: val }));
                    if (val.length >= 2) {
                      const suggestions = await fetchCitySuggestions(val);
                      setSourceSuggestions(suggestions);
                      setShowSourceSuggestions(true);
                    } else {
                      setShowSourceSuggestions(false);
                    }
                  }}
                  onBlur={() => setTimeout(() => setShowSourceSuggestions(false), 200)}
                />
                {showSourceSuggestions && sourceSuggestions.length > 0 && (
                  <div className="absolute z-20 w-full bg-white border border-gray-200 rounded-xl shadow-lg mt-1 overflow-hidden">
                    {sourceSuggestions.map((city, i) => (
                      <button
                        key={i}
                        type="button"
                        className="w-full text-left px-4 py-2.5 text-sm hover:bg-blue-50 flex items-center gap-2 border-b last:border-0"
                        onMouseDown={() => {
                          setForm((prev) => ({ ...prev, source: city.name }));
                          setShowSourceSuggestions(false);
                        }}
                      >
                        <PlaneTakeoff size={14} className="text-blue-500 shrink-0" />
                        <span className="font-medium">{city.name}</span>
                        <span className="text-gray-400 text-xs ml-1">
                          {city.state ? city.state + ", " : ""}{city.country}
                        </span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Destination City */}
            <div>
              <Label>Destination City</Label>
              <div className="relative mt-2">
                <PlaneLanding className="absolute left-3 top-3 text-gray-500 z-10" size={16} />
                <Input
                  className="pl-10"
                  placeholder="e.g. Goa"
                  value={form.destination}
                  disabled={trip.loading}
                  autoComplete="off"
                  onChange={async (e) => {
                    const val = e.target.value;
                    setForm((prev) => ({ ...prev, destination: val }));
                    if (val.length >= 2) {
                      const suggestions = await fetchCitySuggestions(val);
                      setDestSuggestions(suggestions);
                      setShowDestSuggestions(true);
                    } else {
                      setShowDestSuggestions(false);
                    }
                  }}
                  onBlur={() => setTimeout(() => setShowDestSuggestions(false), 200)}
                />
                {showDestSuggestions && destSuggestions.length > 0 && (
                  <div className="absolute z-20 w-full bg-white border border-gray-200 rounded-xl shadow-lg mt-1 overflow-hidden">
                    {destSuggestions.map((city, i) => (
                      <button
                        key={i}
                        type="button"
                        className="w-full text-left px-4 py-2.5 text-sm hover:bg-blue-50 flex items-center gap-2 border-b last:border-0"
                        onMouseDown={() => {
                          setForm((prev) => ({ ...prev, destination: city.name }));
                          setShowDestSuggestions(false);
                        }}
                      >
                        <PlaneLanding size={14} className="text-blue-500 shrink-0" />
                        <span className="font-medium">{city.name}</span>
                        <span className="text-gray-400 text-xs ml-1">
                          {city.state ? city.state + ", " : ""}{city.country}
                        </span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Trip Duration */}
            <div>
              <Label>Trip Duration (Days)</Label>
              <div className="flex gap-2 mt-2">
                <div className="relative flex-1">
                  <CalendarDays className="absolute left-3 top-3 text-gray-500" size={16} />
                  <Input
                    className="pl-10"
                    value={form.days}
                    type="number"
                    min={1}
                    max={14}
                    disabled={trip.loading}
                    onChange={(e) =>
                      setForm((prev) => ({
                        ...prev,
                        days: Math.max(1, Math.min(14, Number(e.target.value) || 1)),
                      }))
                    }
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <Button
                    type="button"
                    className="border px-2 py-1"
                    disabled={trip.loading}
                    onClick={() => adjustDays(1)}
                  >
                    <ChevronUp size={12} />
                  </Button>
                  <Button
                    type="button"
                    className="border px-2 py-1"
                    disabled={trip.loading}
                    onClick={() => adjustDays(-1)}
                  >
                    <ChevronDown size={12} />
                  </Button>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <Button
              type="button"
              className="bg-blue-500 text-white w-full py-3 flex items-center justify-center gap-2 disabled:opacity-60"
              disabled={trip.loading || !form.source.trim() || !form.destination.trim()}
              onClick={handleSubmit}
            >
              {trip.loading ? (
                <span className="flex items-center gap-3">
                  <span className="flex gap-1">
                    <span className="w-2 h-2 rounded-full bg-white animate-bounce" style={{ animationDelay: "0ms" }} />
                    <span className="w-2 h-2 rounded-full bg-white animate-bounce" style={{ animationDelay: "150ms" }} />
                    <span className="w-2 h-2 rounded-full bg-white animate-bounce" style={{ animationDelay: "300ms" }} />
                  </span>
                  Generating your plan...
                </span>
              ) : (
                <>
                  <Sparkles size={16} />
                  Generate My Travel Plan →
                </>
              )}
            </Button>

            {/* Skeleton while loading */}
            {trip.loading && (
              <div className="flex flex-col gap-3">
                <div className="h-4 bg-gray-200 rounded-full animate-pulse w-3/4" />
                <div className="h-4 bg-gray-200 rounded-full animate-pulse w-full" />
                <div className="h-4 bg-gray-200 rounded-full animate-pulse w-5/6" />
                <div className="grid grid-cols-3 gap-2 mt-1">
                  <div className="h-16 bg-gray-200 rounded-xl animate-pulse" />
                  <div className="h-16 bg-gray-200 rounded-xl animate-pulse" />
                  <div className="h-16 bg-gray-200 rounded-xl animate-pulse" />
                </div>
                <div className="h-4 bg-gray-200 rounded-full animate-pulse w-2/3" />
              </div>
            )}

            <div className="bg-gray-100 rounded-lg p-3 flex gap-2">
              <Info className="text-blue-500 mt-1" size={16} />
              <p className="text-xs text-gray-600">
                Uses FREE OpenWeather + FREE Google Gemini (or Groq) to generate
                flights, hotels, budget (₹), and day-by-day itinerary.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
