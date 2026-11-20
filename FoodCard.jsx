import React from "react";
import { Link } from "react-router-dom";
import { Leaf, Drumstick, MapPin } from "lucide-react";

const TYPE_STYLES = {
  "Street food": "from-amber-400 via-orange-500 to-rose-500",
  Main: "from-teal-500 via-emerald-600 to-green-700",
  Dessert: "from-pink-400 via-rose-500 to-fuchsia-600",
  Drink: "from-sky-400 via-cyan-500 to-blue-600",
  "Local specialty": "from-indigo-400 via-violet-500 to-purple-600",
};

const TYPE_EMOJI = {
  "Street food": "🌮",
  Main: "🍲",
  Dessert: "🍰",
  Drink: "🥤",
  "Local specialty": "🍽️",
};

export default function FoodCard({ dish }) {
  return (
    <div className="group rounded-3xl overflow-hidden bg-card border border-border/70 flex flex-col hover:shadow-[0_18px_40px_-20px_rgba(15,42,48,0.35)] transition-all duration-300 hover:-translate-y-1">
      <div className={`relative h-24 bg-gradient-to-br ${TYPE_STYLES[dish.type] || TYPE_STYLES.Main} flex items-center justify-center`}>
        <span className="text-3xl drop-shadow-md">{TYPE_EMOJI[dish.type] || "🍽️"}</span>
        <span className="absolute top-2 left-2 px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wide bg-white/90 text-foreground">
          {dish.type}
        </span>
        <span
          className={`absolute top-2 right-2 inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold ${
            dish.veg ? "bg-emerald-600 text-white" : "bg-rose-600 text-white"
          }`}
        >
          {dish.veg ? <Leaf className="w-3 h-3" /> : <Drumstick className="w-3 h-3" />}
          {dish.veg ? "Veg" : "Non-veg"}
        </span>
      </div>

      <div className="p-4 flex flex-col flex-1">
        <h3 className="font-display font-semibold text-base text-foreground leading-snug">{dish.name}</h3>
        <p className="text-xs text-muted-foreground mt-0.5 flex items-center gap-1">
          <MapPin className="w-3 h-3" /> {dish.country}
          {dish.continent ? ` · ${dish.continent}` : ""}
        </p>
        <p className="text-[13px] text-muted-foreground leading-relaxed mt-2 line-clamp-3">{dish.description}</p>
        {dish.ingredients && (
          <p className="text-[11px] text-muted-foreground mt-2">
            <span className="font-semibold text-foreground">In it:</span> {dish.ingredients}
          </p>
        )}
        {dish.destinationSlug && (
          <Link
            to={`/destination/${dish.destinationSlug}`}
            className="mt-3 text-xs font-semibold text-primary hover:underline"
          >
            Seen at {dish.destinationName} →
          </Link>
        )}
      </div>
    </div>
  );
}