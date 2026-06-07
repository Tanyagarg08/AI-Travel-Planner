import { Cloud, CloudRain, CloudSun, Sun } from "lucide-react";

const iconMap = {
  sunny: Sun,
  cloudy: Cloud,
  rainy: CloudRain,
  "partly-cloudy": CloudSun,
};

export function getWeatherIcon(iconName) {
  return iconMap[iconName] || CloudSun;
}
