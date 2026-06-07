import { useNavigate } from "react-router-dom";
import { Bus, Hotel, Info, Plane, Utensils, Wallet } from "lucide-react";
import { Button } from "../components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Pie, PieChart, Tooltip, Cell } from "recharts";
import { useTrip } from "../context/TripContext";
import { formatINR } from "../utils/currency";

const COLORS = ["#1e40af", "#3b82f6", "#60a5fa", "#1e293b", "#64748b"];
const CATEGORY_ICONS = {
  "Flight Cost": Plane,
  "Hotel Cost": Hotel,
  "Food Expenses": Utensils,
  "Local Transport": Bus,
  "Local Transportation": Bus,
};

export default function Budget() {
  const navigate = useNavigate();
  const { trip } = useTrip();
  const { budget } = trip;

  const categories = Array.isArray(budget.categories) ? budget.categories :
    Array.isArray(budget.items) ? budget.items :
    Array.isArray(budget.breakdown) ? budget.breakdown : [];

  const chartData = categories.map((cat, i) => ({
    ...cat,
    fill: COLORS[i % COLORS.length],
  }));

  return (
    <div className="p-8">
      <div className="flex mb-6 justify-between items-center">
        <div>
          <h1 className="text-slate-900 font-bold text-2xl leading-8">
            Trip Budget Estimation
          </h1>
          <p className="text-[#71717b] text-sm leading-5 mt-1">
            {trip.source} to {trip.destination} · {trip.days} days · All amounts
            in ₹ (INR)
          </p>
        </div>
        <div className="rounded-xl bg-white border flex px-4 py-2 items-center gap-2">
          <Wallet className="size-4 text-blue-500" />
          <span className="text-slate-900 font-semibold text-sm leading-5">
            {formatINR(budget.totalInr)} total
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6 gap-4">
          <CardHeader className="p-0 gap-1">
            <CardTitle className="text-slate-900 font-bold text-base leading-6">
              Expense Distribution
            </CardTitle>
            <p className="text-sm text-gray-500">
              Share of total trip budget by category (INR)
            </p>
          </CardHeader>
          <CardContent className="flex p-0 flex-col items-center gap-4">
            <PieChart width={300} height={250}>
              <Tooltip formatter={(value) => formatINR(value)} />
              <Pie
                data={chartData}
                dataKey="amountInr"
                innerRadius={55}
                nameKey="name"
                outerRadius={95}
                paddingAngle={2}
              >
                {chartData.map((entry) => (
                  <Cell key={entry.name} fill={entry.fill} />
                ))}
              </Pie>
            </PieChart>
            <div className="grid grid-cols-2 pt-2 gap-2 w-full">
              {chartData.map((item) => (
                <div key={item.name} className="flex items-center gap-2">
                  <span
                    className="size-3 rounded-full"
                    style={{ backgroundColor: item.fill }}
                  />
                  <span className="text-zinc-950 text-sm leading-5">
                    {item.name}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="p-6 gap-4">
          <CardHeader className="p-0 gap-1">
            <CardTitle className="text-slate-900 font-bold text-base leading-6">
              Cost Breakdown
            </CardTitle>
            <p className="text-sm text-gray-500">
              AI-estimated costs in Indian Rupees
            </p>
          </CardHeader>
          <CardContent className="flex p-0 flex-col gap-4">
            {categories.map((item) => {
              const Icon = CATEGORY_ICONS[item.name] || Wallet;
              return (
                <div key={item.name} className="flex flex-col gap-2">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <Icon className="size-4 text-blue-600" />
                      <span className="font-medium text-zinc-950 text-sm leading-5">
                        {item.name}
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-slate-900 font-semibold text-sm leading-5">
                        {formatINR(item.amountInr)}
                      </span>
                      <span className="text-right text-[#71717b] text-xs leading-4 w-9">
                        {item.percentage}%
                      </span>
                    </div>
                  </div>
                  <div className="rounded-full bg-zinc-100 w-full h-2">
                    <div
                      className="rounded-full bg-blue-500 h-2"
                      style={{ width: `${item.percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </CardContent>
          <CardFooter className="p-0">
            <div className="rounded-xl bg-blue-500 text-white flex px-5 py-4 justify-between items-center w-full">
              <div className="flex items-center gap-2">
                <Wallet className="size-5" />
                <span className="font-bold text-sm leading-5">
                  Total Estimated Budget
                </span>
              </div>
              <span className="font-bold text-xl leading-7">
                {formatINR(budget.totalInr)}
              </span>
            </div>
          </CardFooter>
        </Card>
      </div>

      <div className="bg-blue-50 border border-blue-100 rounded-xl flex mt-6 px-5 py-4 items-center gap-3 flex-wrap">
        <Info className="size-5 shrink-0 text-blue-500" />
        <p className="text-slate-900 text-sm leading-5 flex-1">
          Budget is AI-estimated in INR based on your trip duration, destination,
          real weather, and selected flight and hotel.
        </p>
        <Button
          type="button"
          onClick={() => navigate("/itinerary")}
          className="bg-blue-500 text-white shrink-0"
        >
          Continue to Itinerary →
        </Button>
      </div>
    </div>
  );
}
