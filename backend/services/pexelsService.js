const PEXELS_URL = "https://api.pexels.com/v1/search";

async function searchPexels(query, apiKey) {
  try {
    const res = await fetch(
      `${PEXELS_URL}?query=${encodeURIComponent(query)}&per_page=3&orientation=landscape`,
      { headers: { Authorization: apiKey } }
    );
    if (!res.ok) return null;
    const data = await res.json();
    const photos = data.photos || [];
    if (!photos.length) return null;
    const random = photos[Math.floor(Math.random() * photos.length)];
    return random?.src?.large || null;
  } catch {
    return null;
  }
}

export async function fetchHotelImage(hotelName, destination, tag, apiKey) {
  if (!apiKey) return null;

  let image = await searchPexels(`${hotelName} hotel ${destination}`, apiKey);
  if (image) return image;

  const tagQueries = {
    "Budget Pick": `budget hotel ${destination} room`,
    "Best Value": `hotel ${destination} lobby`,
    "Luxury": `luxury resort ${destination} pool`,
  };
  const fallbackQuery = tagQueries[tag] || `hotel ${destination}`;
  return await searchPexels(fallbackQuery, apiKey);
}