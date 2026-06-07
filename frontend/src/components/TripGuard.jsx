import { Navigate } from "react-router-dom";
import { useTrip } from "../context/TripContext";
import LoadingState from "./LoadingState";

export default function TripGuard({ children }) {
  const { trip } = useTrip();

  if (trip.loading) {
    return <LoadingState />;
  }

  if (!trip.generated) {
    return <Navigate to="/plan-trip" replace />;
  }

  return children;
}
