import { useNavigate } from "react-router-dom";
import {
  Camera,
  Coffee,
  Download,
  Lightbulb,
  MapPin,
  Moon,
  Share2,
  ShoppingBag,
  Sparkles,
  Sun,
  Sunset,
  Utensils,
  Landmark,
} from "lucide-react";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Card, CardContent } from "../components/ui/card";
import { useTrip } from "../context/TripContext";
import { formatINR } from "../utils/currency";

// Assign icons based on keywords in activity text
function getActivityIcon(activity) {
  const text = activity.toLowerCase();
  if (text.includes("breakfast") || text.includes("morning") || text.includes("coffee")) return Coffee;
  if (text.includes("lunch") || text.includes("dinner") || text.includes("eat") || text.includes("food") || text.includes("restaurant")) return Utensils;
  if (text.includes("shop") || text.includes("market") || text.includes("mall") || text.includes("bazar") || text.includes("bazaar")) return ShoppingBag;
  if (text.includes("photo") || text.includes("view") || text.includes("scenic") || text.includes("beach") || text.includes("sunset")) return Camera;
  if (text.includes("evening") || text.includes("sunset")) return Sunset;
  if (text.includes("night") || text.includes("hotel") || text.includes("check-in") || text.includes("sleep")) return Moon;
  if (text.includes("afternoon")) return Sun;
  if (text.includes("visit") || text.includes("temple") || text.includes("fort") || text.includes("museum") || text.includes("monument")) return Landmark;
  return MapPin;
}

// Assign time slot based on keywords
function getTimeSlot(activity, index) {
  const text = activity.toLowerCase();
  if (text.includes("morning") || text.includes("breakfast") || index === 0) return "Morning";
  if (text.includes("afternoon") || text.includes("lunch") || index === 1) return "Afternoon";
  if (text.includes("evening") || text.includes("sunset") || index === 2) return "Evening";
  if (text.includes("night") || text.includes("dinner") || index >= 3) return "Night";
  return ["Morning", "Afternoon", "Evening"][index % 3] || "Morning";
}

const timeColors = {
  Morning: "bg-amber-50 text-amber-700 border-amber-200",
  Afternoon: "bg-blue-50 text-blue-700 border-blue-200",
  Evening: "bg-orange-50 text-orange-700 border-orange-200",
  Night: "bg-indigo-50 text-indigo-700 border-indigo-200",
};

const badgeColors = [
  "bg-blue-500/10 text-blue-600",
  "bg-green-500/10 text-green-600",
  "bg-purple-500/10 text-purple-600",
  "bg-orange-500/10 text-orange-600",
  "bg-pink-500/10 text-pink-600",
];

export default function Itinerary() {
  const navigate = useNavigate();
  const { trip, resetTrip } = useTrip();

  const handlePlanAnother = () => {
    resetTrip();
    navigate("/plan-trip");
  };

  return (
    <div className="p-8 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex mb-8 justify-between items-start">
        <div>
          <h1 className="text-slate-800 font-bold text-2xl leading-8">
            Your Day-by-Day Travel Itinerary
          </h1>
          <p className="text-[#71717b] text-sm leading-5 mt-1">
            {trip.source} → {trip.destination} · {trip.days} Days · AI-generated with real weather
          </p>
        </div>
        <div className="shadow-sm rounded-full bg-white text-[#71717b] text-xs leading-4 flex px-3 py-1.5 items-center gap-2">
          <Sparkles className="size-4 text-blue-500" />
          {trip.itinerary.length} days planned
        </div>
      </div>

      {/* Timeline */}
      <div className="relative pl-8">
        <div className="bg-gradient-to-b from-blue-500 to-blue-300 absolute left-[11px] inset-y-2 w-0.5" />
        <div className="flex flex-col gap-8">
          {trip.itinerary.map((day, dayIndex) => (
            <div key={day.day} className="relative">
              {/* Timeline dot */}
              <div className="size-7 rounded-full bg-blue-500 shadow-lg shadow-blue-500/30 border-white border-4 flex absolute -left-[30px] top-5 justify-center items-center z-10">
                <span className="text-white font-bold text-[10px]">{day.day}</span>
              </div>

              <Card className="border-0 shadow-lg overflow-hidden">
                {/* Day header */}
                <div className="bg-gradient-to-r from-blue-500 to-blue-600 px-6 py-4 flex justify-between items-center">
                  <div>
                    <p className="text-blue-100 text-xs font-medium mb-0.5">DAY {day.day}</p>
                    <h2 className="text-white font-bold text-lg leading-7">
                      {day.title?.length > 40 ? day.title.slice(0, 40) + "..." : day.title}
                    </h2>
                  </div>
                  <Badge className={`${badgeColors[dayIndex % badgeColors.length]} border-0 font-medium`}>
                    {day.badge}
                  </Badge>
                </div>

                <CardContent className="p-6 flex flex-col gap-4">
                  {/* Activities */}
                  <div className="flex flex-col gap-3">
                    {(day.activities || []).map((activity, actIndex) => {
                      const Icon = getActivityIcon(activity);
                      const timeSlot = getTimeSlot(activity, actIndex);
                      return (
                        <div
                          key={actIndex}
                          className="flex items-start gap-3 p-3 rounded-xl bg-zinc-50 hover:bg-blue-50/50 transition-colors"
                        >
                          <div className="size-8 rounded-lg bg-blue-500/10 flex items-center justify-center shrink-0 mt-0.5">
                            <Icon className="size-4 text-blue-600" />
                          </div>
                          <div className="flex-1">
                            <span className="text-zinc-800 text-sm leading-5">{activity}</span>
                          </div>
                          <span className={`text-xs px-2 py-0.5 rounded-full border font-medium shrink-0 ${timeColors[timeSlot]}`}>
                            {timeSlot}
                          </span>
                        </div>
                      );
                    })}
                  </div>

                  {/* Travel tip */}
                  {day.tip && day.tip !== "Enjoy your day!" && (
                    <div className="rounded-xl bg-amber-50 border border-amber-100 flex p-3 items-start gap-2">
                      <Lightbulb className="size-4 shrink-0 text-amber-500 mt-0.5" />
                      <p className="text-amber-800 text-xs leading-5">
                        <span className="font-semibold">Travel tip: </span>
                        {day.tip}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          ))}
        </div>
      </div>

      {/* Footer summary */}
      <div className="shadow-md rounded-2xl bg-white mt-10 p-8 flex flex-col items-center gap-4">
        <div className="text-center">
          <p className="text-sm text-gray-500">Total estimated trip budget</p>
          <p className="text-3xl font-bold text-blue-600 mt-1">
            {formatINR(trip.budget?.totalInr || 0)}
          </p>
          <p className="text-xs text-gray-400 mt-1">
            {trip.source} → {trip.destination} · {trip.days} days
          </p>
        </div>

        <div className="flex items-center gap-3 flex-wrap justify-center mt-2">
          <Button 
            className="bg-slate-700 text-white px-6 py-5 gap-2 hover:bg-slate-800"
            onClick={() => {
              const content = `AI TRAVEL PLAN\n${trip.source} → ${trip.destination} | ${trip.days} Days\n\nFLIGHT: ${trip.flight?.airline} ${trip.flight?.flightNumber} | ${trip.flight?.departureTime} → ${trip.flight?.arrivalTime} | ${formatINR(trip.flight?.priceInr)}\n\nHOTELS:\n${(trip.hotels||[]).map(h=>`${h.tag}: ${h.name} - ${formatINR(h.pricePerNightInr)}/night`).join('\n')}\n\nBUDGET TOTAL: ${formatINR(trip.budget?.totalInr)}\n\nITINERARY:\n${(trip.itinerary||[]).map(d=>`Day ${d.day}: ${d.title}\n${(d.activities||[]).map(a=>`  • ${a}`).join('\n')}`).join('\n\n')}`;
              const blob = new Blob([content], { type: "text/plain" });
              const url = URL.createObjectURL(blob);
              const a = document.createElement("a");
              a.href = url;
              a.download = `${trip.source}-to-${trip.destination}-plan.txt`;
              a.click();
              URL.revokeObjectURL(url);
            }}
          >
            <Download className="size-4" />
            Download Full Plan
          </Button>
          <Button
            className="text-blue-600 border-blue-300 px-6 py-5 gap-2"
            variant="outline"
            onClick={() => {
              const text = `🗺️ My trip: ${trip.source} → ${trip.destination} for ${trip.days} days! Budget: ${formatINR(trip.budget?.totalInr || 0)}`;
              if (navigator.share) {
                navigator.share({ title: "My Travel Plan", text });
              } else {
                navigator.clipboard.writeText(text);
                alert("Trip details copied to clipboard!");
              }
            }}
          >
            <Share2 className="size-4" />
            Share Itinerary
          </Button>
        </div>

        <p className="text-center text-[#71717b] text-sm leading-5 max-w-md">
          Your complete travel plan including flights, hotel, weather, budget, and itinerary is ready.
        </p>

        <Button
          type="button"
          onClick={handlePlanAnother}
          className="bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold px-8 shadow-lg shadow-blue-500/30 hover:scale-[1.02] transition-all duration-200"
        >
          ✈️ Plan Another Trip!
        </Button>
      </div>
    </div>
  );
}
