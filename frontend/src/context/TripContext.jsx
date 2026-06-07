import { createContext, useContext, useState } from "react";

const TripContext = createContext(null);

const defaultTrip = {
  source: "",
  destination: "",
  days: 5,
  loading: false,
  error: null,
  generated: false,
  flight: null,
  hotel: null,
  hotels: [],
  weather: null,
  budget: null,
  itinerary: [],
};

export function TripProvider({ children }) {
  const [trip, setTrip] = useState(defaultTrip);

  const updateTrip = (updates) => {
    setTrip((prev) => ({ ...prev, ...updates }));
  };

 const setPlanData = (plan) => {
    setTrip({
      source: plan.source,
      destination: plan.destination,
      days: plan.days,
      loading: false,
      error: null,
      generated: true,
      flight: plan.flight,
      hotel: plan.hotel,
      hotels: plan.hotels || [],
      weather: plan.weather,
      budget: plan.budget,
      itinerary: plan.itinerary,
    });
  };

  const setLoading = (loading) => {
    setTrip((prev) => ({ ...prev, loading, error: loading ? null : prev.error }));
  };

  const setError = (error) => {
    setTrip((prev) => ({ ...prev, loading: false, error }));
  };

  const resetTrip = () => {
    setTrip(defaultTrip);
  };

  return (
    <TripContext.Provider
      value={{ trip, updateTrip, setPlanData, setLoading, setError, resetTrip }}
    >
      {children}
    </TripContext.Provider>
  );
}

export function useTrip() {
  const context = useContext(TripContext);
  if (!context) {
    throw new Error("useTrip must be used within a TripProvider");
  }
  return context;
}
