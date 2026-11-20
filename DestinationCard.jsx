import React from "react";
import { Link } from "react-router-dom";
import { Star, Plus, Clock, Calendar } from "lucide-react";
import DestinationImage from "@/components/DestinationImage";
import { formatDuration } from "@/lib/travel";

export default function DestinationCard({ destination, onAdd, compact = false }) {
  const cats = destination.categories || [];
  return (
    <div className="group rounded-3xl overflow-hidden bg-card border border-border/70 shadow-[0_1px_2px_rgba(15,42,48,0.05)] hover:shadow-[0_20px_45px_-16px_rgba(15,42,48,0.35)] transition-all duration-300 hover:-translate-y-1 flex flex-col">
      <Link to={`/destination/${destination.slug}`} className="block relative">
        <DestinationImage destination={destination} className={compact ? "h-36" : "h-48 w-full"} />
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-70 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
        <div className="absolute top-3 left-3 flex flex-wrap gap-1">
          {cats.slice(0, 2).map((c) => (
            <span key={c} className="px-2.5 py-1 rounded-full text-[10px] font-semibold tracking-wide uppercase bg-white/90 text-foreground ring-1 ring-black/5 backdrop-blur">
              {c}
            </span>
          ))}
        </div>
        {destination.rating ? (
          <div className="absolute top-3 right-3 flex items-center gap-1 px-2 py-0.5 rounded-full bg-black/60 text-white text-xs backdrop-blur">
            <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
            {destination.rating}
          </div>
        ) : null}
      </Link>
      <div className="p-4 flex flex-col flex-1">
        <Link to={`/destination/${destination.slug}`}>
          <h3 className="font-display font-semibold text-lg text-foreground group-hover:text-primary transition-colors">{destination.name}</h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            {[destination.city, destination.state, destination.country].filter(Boolean).join(", ")}
          </p>
        </Link>
        {!compact && destination.description && (
          <p className="text-[13px] leading-relaxed text-muted-foreground mt-2 line-clamp-3">{destination.description}</p>
        )}
        <div className="flex items-center gap-3 mt-3 text-xs text-muted-foreground">
          {destination.recommendedDurationMinutes ? (
            <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{formatDuration(destination.recommendedDurationMinutes)}</span>
          ) : null}
          {destination.bestSeason ? (
            <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{destination.bestSeason}</span>
          ) : null}
        </div>
        <div className="flex gap-2 mt-4 pt-3 border-t border-border/40">
          <Link to={`/destination/${destination.slug}`} className="flex-1 text-center text-sm font-medium px-3 py-2 rounded-lg border border-border hover:bg-accent transition-colors">
            View Details
          </Link>
          {onAdd && (
            <button onClick={() => onAdd(destination)} className="px-3 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors flex items-center gap-1">
              <Plus className="w-4 h-4" /> Add
            </button>
          )}
        </div>
      </div>
    </div>
  );
}