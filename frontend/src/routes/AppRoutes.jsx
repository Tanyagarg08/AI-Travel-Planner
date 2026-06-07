import { BrowserRouter, Routes, Route } from "react-router-dom";

import Landing from "../pages/Landing";
import PlanTrip from "../pages/PlanTrip";
import Recommendations from "../pages/Recommendations";
import Weather from "../pages/Weather";
import Budget from "../pages/Budget";
import Itinerary from "../pages/Itinerary";

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/plan-trip" element={<PlanTrip />} />
        <Route path="/recommendations" element={<Recommendations />} />
        <Route path="/weather" element={<Weather />} />
        <Route path="/budget" element={<Budget />} />
        <Route path="/itinerary" element={<Itinerary />} />
      </Routes>
    </BrowserRouter>
  );
}