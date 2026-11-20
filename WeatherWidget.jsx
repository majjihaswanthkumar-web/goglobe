import React, { useEffect, useState } from "react";
import { Cloud, Loader2, Droplets, Wind } from "lucide-react";
import { base44 } from "@/api/base44Client";

const WMO = {
  0: "Clear sky", 1: "Mainly clear", 2: "Partly cloudy", 3: "Overcast",
  45: "Fog", 48: "Rime fog", 51: "Light drizzle", 53: "Drizzle", 55: "Dense drizzle",
  61: "Slight rain", 63: "Rain", 65: "Heavy rain", 71: "Slight snow", 73: "Snow", 75: "Heavy snow",
  80: "Rain showers", 81: "Rain showers", 82: "Violent rain showers", 95: "Thunderstorm", 96: "Thunderstorm w/ hail", 99: "Thunderstorm w/ hail",
};

export default function WeatherWidget({ lat, lng, name }) {
  const [data, setData] = useState(null);
  const [err, setError] = useState(null);

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const res = await base44.functions.invoke("weather", { lat, lon: lng });
        if (active) setData(res.data);
      } catch (e) {
        if (active) setError("Weather unavailable");
      }
    })();
    return () => { active = false; };
  }, [lat, lng]);

  if (err) return <div className="text-sm text-muted-foreground">{err}</div>;
  if (!data) return <div className="flex items-center gap-2 text-sm text-muted-foreground"><Loader2 className="w-4 h-4 animate-spin" /> Loading weather…</div>;

  const c = data.current;
  return (
    <div className="rounded-2xl border border-border/60 bg-gradient-to-br from-sky-50 to-blue-50 p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Cloud className="w-8 h-8 text-sky-600" />
          <div>
            <div className="text-2xl font-bold">{Math.round(c.temperature_2m)}°C</div>
            <div className="text-xs text-muted-foreground">{WMO[c.weather_code] || "—"}</div>
          </div>
        </div>
        <div className="text-right text-xs text-muted-foreground space-y-1">
          <div className="flex items-center gap-1 justify-end"><Droplets className="w-3 h-3" /> {data.daily.precipitation_probability_max?.[0] ?? 0}%</div>
          <div className="flex items-center gap-1 justify-end"><Wind className="w-3 h-3" /> {Math.round(c.wind_speed_10m)} km/h</div>
        </div>
      </div>
      <div className="flex justify-between mt-3 text-xs">
        {data.daily.time.slice(0, 5).map((t, i) => (
          <div key={t} className="text-center">
            <div className="text-muted-foreground">{new Date(t).toLocaleDateString("en", { weekday: "short" })}</div>
            <div className="font-medium">{Math.round(data.daily.temperature_2m_max[i])}°</div>
            <div className="text-muted-foreground">{Math.round(data.daily.temperature_2m_min[i])}°</div>
          </div>
        ))}
      </div>
      <div className="text-[10px] text-muted-foreground mt-2">Source: Open-Meteo · Updated {new Date(data.fetchedAt).toLocaleTimeString()}</div>
    </div>
  );
}