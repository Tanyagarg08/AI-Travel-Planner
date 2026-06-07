import { BrowserRouter, Routes, Route } from "react-router-dom";

import Layout from "./components/Layout";
import TripGuard from "./components/TripGuard";
import Landing from "./pages/Landing";
import PlanTrip from "./pages/PlanTrip";
import Recommendations from "./pages/Recommendations";
import Weather from "./pages/Weather";
import Budget from "./pages/Budget";
import Itinerary from "./pages/Itinerary";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route element={<Layout />}>
          <Route path="/plan-trip" element={<PlanTrip />} />
          <Route
            path="/recommendations"
            element={
              <TripGuard>
                <Recommendations />
              </TripGuard>
            }
          />
          <Route
            path="/weather"
            element={
              <TripGuard>
                <Weather />
              </TripGuard>
            }
          />
          <Route
            path="/budget"
            element={
              <TripGuard>
                <Budget />
              </TripGuard>
            }
          />
          <Route
            path="/itinerary"
            element={
              <TripGuard>
                <Itinerary />
              </TripGuard>
            }
          />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
