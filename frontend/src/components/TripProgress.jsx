import { NavLink, useLocation } from "react-router-dom";
import { Check } from "lucide-react";
import { tripFlowSteps } from "../config/navigation";

function TripProgress() {
  const { pathname } = useLocation();
  const currentIndex = tripFlowSteps.findIndex((step) => step.path === pathname);

  if (currentIndex === -1) return null;

  return (
    <div className="bg-white border-b border-gray-200 px-8 py-4">
      <div className="flex items-center justify-between max-w-4xl mx-auto">
        {tripFlowSteps.map((step, index) => {
          const isComplete = index < currentIndex;
          const isCurrent = index === currentIndex;

          return (
            <div key={step.path} className="flex items-center flex-1 last:flex-none">
              <NavLink
                to={step.path}
                className={`flex items-center gap-2 text-sm font-medium transition-colors ${
                  isCurrent
                    ? "text-blue-600"
                    : isComplete
                      ? "text-blue-500 hover:text-blue-600"
                      : "text-gray-400 pointer-events-none"
                }`}
              >
                <span
                  className={`size-7 rounded-full flex items-center justify-center text-xs ${
                    isCurrent
                      ? "bg-blue-500 text-white"
                      : isComplete
                        ? "bg-blue-100 text-blue-600"
                        : "bg-gray-100 text-gray-400"
                  }`}
                >
                  {isComplete ? <Check className="size-3.5" /> : index + 1}
                </span>
                <span className="hidden sm:inline">{step.label}</span>
              </NavLink>

              {index < tripFlowSteps.length - 1 && (
                <div
                  className={`h-0.5 flex-1 mx-3 ${
                    index < currentIndex ? "bg-blue-400" : "bg-gray-200"
                  }`}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default TripProgress;
