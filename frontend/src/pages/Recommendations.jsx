import { useNavigate } from "react-router-dom";
import {
  Car,
  Check,
  CheckCircle2,
  Clock,
  Coffee,
  Dumbbell,
  Eye,
  Hotel,
  MapPin,
  Plane,
  Star,
  TrendingDown,
  Waves,
  Wifi,
} from "lucide-react";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";
import { useTrip } from "../context/TripContext";
import { formatINR } from "../utils/currency";

const amenityIcons = {
  "Free WiFi": Wifi,
  WiFi: Wifi,
  Pool: Waves,
  Breakfast: Coffee,
  Gym: Dumbbell,
  Parking: Car,
};

export default function Recommendations() {
  const navigate = useNavigate();
  const { trip } = useTrip();
  const { flight, hotels = [] } = trip;

  return (
    <div className="p-8">
      <div className="flex mb-6 justify-between items-center">
        <div>
          <h1 className="font-bold text-zinc-950 text-2xl leading-8 tracking-tight">
            Flight & Hotel Recommendations
          </h1>
          <p className="text-[#71717b] text-sm leading-5 mt-1">
            AI-generated matches for {trip.source} → {trip.destination}
          </p>
        </div>
        <Badge className="bg-blue-500/10 text-blue-600 px-3 py-1.5 gap-1.5">
          <CheckCircle2 className="size-3.5" />
          AI Generated
        </Badge>
      </div>

      <section className="mb-8">
        <div className="shadow-md shadow-blue-500/20 rounded-lg bg-blue-500 flex mb-4 px-4 py-3 items-center gap-3">
          <Plane className="size-5 text-white" />
          <h2 className="font-semibold text-white text-base leading-6">
            Best Flight Found
          </h2>
        </div>
        <Card className="shadow-lg shadow-blue-500/10 border-blue-500/10 border-0 overflow-hidden">
          <CardContent className="flex p-0 items-stretch gap-0 flex-col lg:flex-row">
            <div className="relative shrink-0 w-full lg:w-44 h-40 lg:h-auto">
              <img
                alt="Airplane"
                className="object-cover w-full h-full"
                src="https://images.unsplash.com/photo-1436491865332-7a61a109cc05?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400"
              />
            </div>
            <div className="flex p-6 flex-col flex-1">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div className="size-10 rounded-lg bg-blue-500/10 flex justify-center items-center">
                    <Plane className="size-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-bold text-zinc-950 text-base leading-6">
                      {flight.airline}
                    </p>
                    <p className="text-[#71717b] text-xs leading-4">
                      Flight {flight.flightNumber} · {flight.aircraft}
                    </p>
                  </div>
                </div>
                <Badge className="bg-zinc-100 text-zinc-900 gap-1">
                  <TrendingDown className="size-3" />
                  {flight.stops}
                </Badge>
              </div>
              <div className="flex mt-6 items-center gap-6">
                <div className="text-left">
                  <p className="font-bold text-zinc-950 text-2xl leading-8">
                    {flight.departureTime}
                  </p>
                  <p className="font-medium text-zinc-950 text-sm leading-5">
                    {trip.source}
                  </p>
                  <p className="text-[#71717b] text-xs leading-4">
                    {flight.departureAirport}
                  </p>
                </div>
                <div className="flex flex-col items-center flex-1">
                  <span className="font-medium text-[#71717b] text-xs leading-4 flex items-center gap-1">
                    <Clock className="size-3" />
                    {flight.duration}
                  </span>
                  <div className="flex mt-1 items-center w-full">
                    <span className="size-2 rounded-full bg-blue-500" />
                    <span className="bg-zinc-200 flex-1 h-0.5" />
                    <Plane className="size-4 text-blue-500" />
                    <span className="bg-zinc-200 flex-1 h-0.5" />
                    <span className="size-2 rounded-full bg-blue-500" />
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-zinc-950 text-2xl leading-8">
                    {flight.arrivalTime}
                  </p>
                  <p className="font-medium text-zinc-950 text-sm leading-5">
                    {trip.destination}
                  </p>
                  <p className="text-[#71717b] text-xs leading-4">
                    {flight.arrivalAirport}
                  </p>
                </div>
              </div>
            </div>
            <div className="shrink-0 bg-zinc-100/40 border-zinc-200 border-t lg:border-t-0 lg:border-l flex p-6 flex-col justify-center items-center gap-3 w-full lg:w-56">
              <div className="text-center">
                <p className="text-[#71717b] text-xs leading-4">Total price</p>
                <p className="font-bold text-blue-600 text-3xl leading-9">
                  {formatINR(flight.priceInr)}
                </p>
                <p className="text-[#71717b] text-xs leading-4">per person</p>
              </div>
              <Button
                type="button"
                onClick={() => window.open(`https://www.google.com/flights#search;f=${trip.source};t=${trip.destination}`, '_blank')}
                className="bg-blue-500 text-white gap-2 w-full"
              >
                <Check className="size-4" />
                Search Real Flights →
              </Button>
            </div>
          </CardContent>
        </Card>
      </section>

<section>
  <div className="shadow-md shadow-blue-500/20 rounded-lg bg-blue-500 flex mb-4 px-4 py-3 items-center gap-3">
    <Hotel className="size-5 text-white" />
    <h2 className="font-semibold text-white text-base leading-6">
      Hotel Options — Choose Your Stay
    </h2>
  </div>
  <div className="flex flex-col gap-4">
    {hotels.map((hotel, index) => (
      <Card key={index} className="shadow-lg shadow-blue-500/10 border-blue-500/10 border-0 overflow-hidden">
        <CardContent className="flex p-0 items-stretch gap-0 flex-col lg:flex-row">
          <div className="relative shrink-0 w-full lg:w-64 h-48 lg:h-auto">
            <img
              alt={hotel.name}
              className="object-cover w-full h-full"
              src={hotel.image || "https://images.unsplash.com/photo-1715191904112-4a5d9c3089fa?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400"}
              onError={(e) => {
                e.target.src = "https://images.unsplash.com/photo-1715191904112-4a5d9c3089fa?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400";
              }}
            />
            <div className="absolute left-3 top-3">
              <Badge className="bg-blue-500 text-white">{hotel.tag}</Badge>
            </div>
          </div>
          <div className="flex p-6 flex-col flex-1">
            <div className="flex items-center gap-1">
              {Array.from({ length: Math.round(hotel.rating || 0) }).map((_, i) => (
                <Star key={i} className="size-4 fill-amber-400 text-amber-400" />
              ))}
            </div>
            <p className="font-bold text-zinc-950 text-lg leading-7 mt-1.5">{hotel.name}</p>
            <p className="text-[#71717b] text-xs leading-4 flex mt-0.5 items-center gap-1">
              <MapPin className="size-3.5" />
              {hotel.location}
            </p>
            <p className="text-[#71717b] text-sm leading-5 mt-3">{hotel.description}</p>
            <div className="flex mt-4 flex-wrap gap-2">
              {(hotel.amenities || []).map((amenity) => {
                const Icon = amenityIcons[amenity] || Wifi;
                return (
                  <Badge key={amenity} className="bg-blue-500/10 text-blue-600 gap-1">
                    <Icon className="size-3" />
                    {amenity}
                  </Badge>
                );
              })}
            </div>
          </div>
          <div className="shrink-0 bg-zinc-100/40 border-zinc-200 border-t lg:border-t-0 lg:border-l flex p-6 flex-col justify-center items-center gap-3 w-full lg:w-56">
            <div className="text-center">
              <p className="text-[#71717b] text-xs leading-4">Price per night</p>
              <p className="font-bold text-blue-600 text-3xl leading-9">
                {formatINR(hotel.pricePerNightInr)}
              </p>
              <p className="text-[#71717b] text-xs leading-4">incl. taxes</p>
            </div>
           <Button
                type="button"
                onClick={() => window.open(`https://www.booking.com/search.html?ss=${encodeURIComponent(hotel.name + ' ' + trip.destination)}`, '_blank')}
                className="w-full bg-white border border-blue-200 text-blue-600 font-medium hover:bg-blue-50 transition-all duration-200 gap-2"
              >
                Book on Booking.com →
              </Button>
              <Button
                type="button"
                onClick={() => navigate("/weather")}
                className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 hover:scale-[1.02] transition-all duration-200"
              >
                Select & Continue →
              </Button>
          </div>
        </CardContent>
      </Card>
    ))}
  </div>
</section>
    </div>
  );
}
