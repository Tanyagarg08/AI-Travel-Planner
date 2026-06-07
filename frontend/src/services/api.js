const API_BASE = import.meta.env.VITE_API_URL || "";

export async function generateTravelPlan({ source, destination, days }) {
  const response = await fetch(`${API_BASE}/api/generate-plan`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ source, destination, days }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || "Failed to generate travel plan.");
  }

  return data;
}

export async function checkApiHealth() {
  const response = await fetch(`${API_BASE}/api/health`);
  return response.json();
}

export async function validateApiKeys() {
  let response;
  try {
    response = await fetch(`${API_BASE}/api/validate-keys`);
  } catch {
    throw new Error(
      "Cannot reach backend server. Start it with: cd backend && npm run dev",
    );
  }

  const data = await response.json();
  return { loading: false, ...data };
}
