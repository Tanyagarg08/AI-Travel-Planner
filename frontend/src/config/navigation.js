import {
  Calendar,
  Cloud,
  DollarSign,
  Home,
  Hotel,
  MapPin,
  Plane,
} from "lucide-react";

export const mainNavItems = [
  { path: "/", label: "Home", end: true },
  { path: "/plan-trip", label: "Plan a Trip" },
  { path: "/recommendations", label: "Features" },
  { path: "/weather", label: "Weather" },
  { path: "/budget", label: "Budget" },
  { path: "/itinerary", label: "Itinerary" },
];

export const sidebarItems = [
  { path: "/", label: "Dashboard", icon: Home, end: true },
  { path: "/plan-trip", label: "Plan Trip", icon: MapPin },
  { path: "/recommendations", label: "Flights", icon: Plane },
  { path: "/recommendations", label: "Hotels", icon: Hotel, matchPath: "/recommendations" },
  { path: "/weather", label: "Weather", icon: Cloud },
  { path: "/budget", label: "Budget", icon: DollarSign },
  { path: "/itinerary", label: "Itinerary", icon: Calendar },
];

export const tripFlowSteps = [
  { path: "/plan-trip", label: "Plan" },
  { path: "/recommendations", label: "Flights & Hotels" },
  { path: "/weather", label: "Weather" },
  { path: "/budget", label: "Budget" },
  { path: "/itinerary", label: "Itinerary" },
];
