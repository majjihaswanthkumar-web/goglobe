import React from "react";
import { Plane, Utensils, Navigation, Bed, Coffee } from "lucide-react";
import { formatDuration } from "@/lib/travel";

const ICONS = {
  travel: Navigation,
  explore: Plane,
  meal: Utensils,
  rest: Bed,
  free: Coffee,
};

const COLORS = {
  travel: "bg-sky-100 text-sky-700 border-sky-300",
  explore: "bg-emerald-100 text-emerald-700 border-emerald-300",
  meal: "bg-amber-100 text-amber-700 border-amber-300",
  rest: "bg-violet-100 text-violet-700 border-violet-300",
  free: "bg-stone-100 text-stone-700 border-stone-300",
};

export default function ItineraryTimeline({ days, onSelectItem, activeId }) {
  if (!days?.length) {
    return <div className="text-muted-foreground text-sm py-8 text-center">No itinerary yet. Generate one from your selected places.</div>;
  }
  return (
    <div className="space-y-6">
      {days.map((day) => (
        <div key={day.day}>
          <div className="flex items-center gap-2 mb-3">
            <div className="w-9 h-9 rounded-full bg-sky-600 text-white flex items-center justify-center font-bold text-sm">{day.day}</div>
            <h3 className="font-display font-semibold text-lg">Day {day.day}</h3>
          </div>
          <div className="relative pl-6 border-l-2 border-sky-200 space-y-3">
            {day.items.map((it, i) => {
              const Icon = ICONS[it.type] || Plane;
              return (
                <button
                  key={i}
                  onClick={() => onSelectItem && onSelectItem(it)}
                  className={`w-full text-left flex gap-3 p-3 rounded-xl border transition-all ${COLORS[it.type] || ""} ${activeId === it.destinationId ? "ring-2 ring-sky-500" : ""} hover:shadow-sm`}
                >
                  <div className="flex flex-col items-center pt-0.5">
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-sm">{it.label}</span>
                      <span className="text-xs font-mono">{it.time}{it.endTime ? `–${it.endTime}` : ""}</span>
                    </div>
                    <div className="text-xs opacity-80 mt-0.5">
                      {it.type === "travel" ? `${formatDuration(it.durationMinutes)}${it.distanceKm ? ` · ~${it.distanceKm} km` : ""}` : formatDuration(it.durationMinutes)}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}