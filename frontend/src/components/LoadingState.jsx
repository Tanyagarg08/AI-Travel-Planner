import { Loader2, Sparkles } from "lucide-react";

export default function LoadingState({ message = "AI is planning your trip..." }) {
  return (
    <div className="p-12 flex flex-col items-center justify-center min-h-[400px] gap-4">
      <div className="size-16 rounded-2xl bg-blue-500/10 flex items-center justify-center">
        <Loader2 className="size-8 text-blue-500 animate-spin" />
      </div>
      <div className="text-center">
        <p className="font-semibold text-lg flex items-center gap-2 justify-center">
          <Sparkles className="size-5 text-blue-500" />
          {message}
        </p>
        <p className="text-gray-500 text-sm mt-2 max-w-md">
          Fetching real weather data and generating personalized recommendations
          with AI...
        </p>
      </div>
    </div>
  );
}
