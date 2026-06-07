import { useEffect, useState } from "react";
import { AlertCircle, CheckCircle2, Loader2, XCircle } from "lucide-react";
import { validateApiKeys } from "../services/api";

export default function ApiStatus() {
  const [status, setStatus] = useState({ loading: true });

  useEffect(() => {
    validateApiKeys()
      .then(setStatus)
      .catch((err) =>
        setStatus({
          loading: false,
          ready: false,
          message: err.message,
          envFileExists: false,
          openweather: { ok: false, error: "Cannot reach backend" },
          ai: { ok: false, error: "Cannot reach backend" },
        }),
      );
  }, []);

  if (status.loading) {
    return (
      <div className="mb-6 bg-gray-50 border border-gray-200 rounded-xl p-4 flex items-center gap-3">
        <Loader2 className="size-5 text-blue-500 animate-spin" />
        <span className="text-sm text-gray-600">Checking FREE API keys...</span>
      </div>
    );
  }

  if (status.ready) {
    return (
      <div className="mb-6 bg-green-50 border border-green-200 rounded-xl p-4 flex items-center gap-3">
        <CheckCircle2 className="size-5 text-green-600 shrink-0" />
        <div>
          <p className="font-medium text-green-800">FREE API keys are working</p>
          <p className="text-sm text-green-700">
            Using {status.ai?.label || "free AI"} + OpenWeather. Ready to plan!
          </p>
        </div>
      </div>
    );
  }

  const aiLabel =
    status.aiProvider === "groq"
      ? "Groq (Free)"
      : status.aiProvider === "openrouter"
        ? "OpenRouter (Free)"
        : "Google Gemini (Free)";

  return (
    <div className="mb-6 bg-amber-50 border border-amber-200 rounded-xl p-4">
      <div className="flex items-start gap-3">
        <AlertCircle className="size-5 text-amber-600 shrink-0 mt-0.5" />
        <div className="flex-1">
          <p className="font-medium text-amber-900">FREE API setup needs attention</p>
          <p className="text-sm text-amber-800 mt-1">{status.message}</p>

          {!status.envFileExists && (
            <div className="mt-3 bg-white rounded-lg p-3 text-sm text-gray-700 font-mono">
              cd backend{"\n"}
              copy .env.example .env
            </div>
          )}

          <ul className="mt-3 space-y-2 text-sm">
            <li className="flex items-start gap-2">
              {status.openweather?.ok ? (
                <CheckCircle2 className="size-4 text-green-600 mt-0.5 shrink-0" />
              ) : (
                <XCircle className="size-4 text-red-500 mt-0.5 shrink-0" />
              )}
              <span>
                <strong>OpenWeather (Free):</strong>{" "}
                {status.openweather?.ok
                  ? "Connected"
                  : status.openweather?.error || "Not configured"}
              </span>
            </li>
            <li className="flex items-start gap-2">
              {status.ai?.ok ? (
                <CheckCircle2 className="size-4 text-green-600 mt-0.5 shrink-0" />
              ) : (
                <XCircle className="size-4 text-red-500 mt-0.5 shrink-0" />
              )}
              <span>
                <strong>{aiLabel}:</strong>{" "}
                {status.ai?.ok
                  ? "Connected"
                  : status.ai?.error || "Not configured"}
              </span>
            </li>
          </ul>

          <div className="mt-3 text-xs text-amber-800 space-y-1">
            <p>
              <strong>OpenRouter (free, sk-or- keys):</strong>{" "}
              <a href="https://openrouter.ai/keys" target="_blank" rel="noreferrer" className="underline">
                openrouter.ai/keys
              </a>
            </p>
            <p>
              <strong>Gemini (free, AIza keys):</strong>{" "}
              <a href="https://aistudio.google.com/apikey" target="_blank" rel="noreferrer" className="underline">
                aistudio.google.com/apikey
              </a>
            </p>
            <p>
              <strong>OpenWeather (free):</strong>{" "}
              <a href="https://openweathermap.org/api_keys" target="_blank" rel="noreferrer" className="underline">
                openweathermap.org/api_keys
              </a>
            </p>
          </div>

          <p className="text-xs text-amber-700 mt-3">
            Edit <code className="bg-amber-100 px-1 rounded">backend/.env</code>,
            restart backend, then refresh.
          </p>
        </div>
      </div>
    </div>
  );
}
