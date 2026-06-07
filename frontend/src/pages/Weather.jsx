import { useNavigate } from "react-router-dom";
import { Button } from "../components/ui/button";
import { CloudSun, ThermometerSnowflake, ThermometerSun } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Tooltip } from "recharts";
import {
  Area,
  AreaChart as RechartsAreaChart,
  CartesianGrid,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "recharts";
import { useTrip } from "../context/TripContext";
import { getWeatherIcon } from "../utils/weatherIcons";

const CHART_COLORS = ["#1e40af", "#3b82f6", "#60a5fa", "#93c5fd", "#1e293b"];

export default function Weather() {
  const navigate = useNavigate();
  const { trip } = useTrip();
  const { weather } = trip;

  const chartData = weather.daily.map((d) => ({
    day: d.day,
    max: d.max,
    min: d.min,
  }));

  return (
    <div className="p-8">
      <div className="flex mb-6 items-center gap-3">
        <CloudSun className="size-7 text-blue-700" />
        <div>
          <h1 className="text-blue-900 font-bold text-2xl leading-8">
            Weather Forecast — {weather.city}, {weather.country}
          </h1>
          <p className="text-sm text-gray-500">Live data from OpenWeatherMap</p>
        </div>
      </div>

      <Card className="border-t-blue-500 border-t-4 mb-6 p-6 gap-4">
        <CardHeader className="p-0 gap-1">
          <CardTitle className="text-blue-900 font-bold text-lg leading-7">
            Temperature Trend
          </CardTitle>
          <CardDescription className="text-[#71717b] text-sm leading-5">
            Daily max and min temperatures over {trip.days} days
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <div className="w-full h-64">
            <ResponsiveContainer width="100%" height="100%">
            <RechartsAreaChart
              data={chartData}
              margin={{ bottom: 8, left: 8, right: 16, top: 8 }}
            >
              <CartesianGrid stroke="#e5e7eb" vertical={false} />
              <XAxis axisLine={false} dataKey="day" tickLine={false} tickMargin={8} />
              <YAxis axisLine={false} tickLine={false} tickMargin={8} />
              <Tooltip />
              <Area
                dataKey="max"
                fill="#3b82f6"
                fillOpacity={0.2}
                stroke="#3b82f6"
                strokeWidth={2}
                type="monotone"
              />
              <Area
                dataKey="min"
                fill="#93c5fd"
                fillOpacity={0.15}
                stroke="#93c5fd"
                strokeWidth={2}
                type="monotone"
              />
            </RechartsAreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <div className={`grid gap-2 mb-6 grid-cols-${Math.min(weather.daily.length, 7)}`} style={{ gridTemplateColumns: `repeat(${weather.daily.length}, minmax(0, 1fr))` }}>
        {weather.daily.map((day, index) => {
          const Icon = getWeatherIcon(day.icon);
          return (
            <Card
              key={day.day}
              className="border-t-4 text-center p-4 items-center gap-2"
              style={{ borderTopColor: CHART_COLORS[index % CHART_COLORS.length] }}
            >
              <span className="font-semibold text-[#71717b] text-xs leading-4">
                {day.day}
              </span>
              <Icon className="size-7 text-blue-500 mx-auto" />
              <span className="text-blue-700 font-bold text-lg leading-7">
                {day.max}°
              </span>
              <span className="text-blue-400 font-medium text-sm leading-5">
                {day.min}°
              </span>
              <span className="text-[10px] text-gray-400">{day.condition}</span>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-6 gap-2">
          <CardContent className="flex p-0 items-center gap-4">
            <div className="size-12 bg-blue-50 rounded-full flex justify-center items-center">
              <ThermometerSun className="size-6 text-blue-500" />
            </div>
            <div className="flex flex-col">
              <span className="text-[#71717b] text-sm leading-5">Average High</span>
              <span className="text-blue-800 font-bold text-xl leading-7">
                {weather.avgHigh} °C
              </span>
            </div>
          </CardContent>
        </Card>
        <Card className="p-6 gap-2">
          <CardContent className="flex p-0 items-center gap-4">
            <div className="size-12 bg-blue-50 rounded-full flex justify-center items-center">
              <ThermometerSnowflake className="size-6 text-blue-500" />
            </div>
            <div className="flex flex-col">
              <span className="text-[#71717b] text-sm leading-5">Average Low</span>
              <span className="text-blue-800 font-bold text-xl leading-7">
                {weather.avgLow} °C
              </span>
            </div>
          </CardContent>
        </Card>
        <Card className="p-6 gap-2">
          <CardContent className="flex p-0 items-center gap-4 justify-between">
            <div className="flex items-center gap-4">
              <div className="size-12 bg-blue-50 rounded-full flex justify-center items-center">
                <CloudSun className="size-6 text-blue-500" />
              </div>
              <div className="flex flex-col">
                <span className="text-[#71717b] text-sm leading-5">
                  Overall Condition
                </span>
                <span className="text-blue-800 font-bold text-xl leading-7">
                  {weather.overallCondition}
                </span>
              </div>
            </div>
            <Button
              type="button"
              onClick={() => navigate("/budget")}
              className="bg-blue-500 text-white shrink-0"
            >
              Continue to Budget →
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
