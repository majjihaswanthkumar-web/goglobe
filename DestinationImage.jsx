import React, { useState } from "react";
import { cn } from "@/lib/utils";

const GRADIENTS = {
  Historical: "from-amber-500 via-orange-600 to-rose-700",
  Architecture: "from-slate-600 via-stone-700 to-zinc-800",
  Nature: "from-emerald-500 via-green-600 to-teal-700",
  Mountains: "from-sky-500 via-cyan-600 to-slate-700",
  Beaches: "from-cyan-400 via-sky-500 to-blue-600",
  Wildlife: "from-lime-500 via-emerald-600 to-green-700",
  Religious: "from-yellow-400 via-amber-500 to-orange-600",
  Cultural: "from-fuchsia-500 via-purple-600 to-indigo-700",
  Food: "from-red-500 via-rose-600 to-orange-600",
  Adventure: "from-orange-500 via-red-600 to-rose-700",
  Romantic: "from-pink-500 via-rose-500 to-red-500",
  Luxury: "from-violet-500 via-purple-600 to-fuchsia-600",
  UNESCO: "from-teal-500 via-cyan-600 to-blue-700",
  Museums: "from-stone-500 via-neutral-600 to-zinc-700",
  Shopping: "from-indigo-500 via-blue-600 to-cyan-600",
  Nightlife: "from-violet-600 via-purple-700 to-indigo-800",
  Photography: "from-cyan-500 via-teal-600 to-emerald-700",
  Monument: "from-amber-600 via-orange-700 to-red-700",
  Spiritual: "from-amber-400 via-yellow-500 to-orange-600",
};

export default function DestinationImage({ destination, className, large = false }) {
  const cat = (destination?.categories || [])[0] || "Nature";
  const gradient = GRADIENTS[cat] || "from-sky-500 via-blue-600 to-indigo-700";
  const img = (destination?.images || [])[0];
  const [imgError, setImgError] = useState(false);

  if (img && !imgError) {
    return (
      <div className={cn("relative overflow-hidden bg-muted", className)}>
        <img src={img} alt={destination?.name || "Destination"} loading="lazy" className="w-full h-full object-cover" onError={() => setImgError(true)} />
      </div>
    );
  }

  return (
    <div className={cn("relative overflow-hidden bg-gradient-to-br flex items-center justify-center", gradient, className)}>
      <div className="absolute inset-0 opacity-30" style={{ backgroundImage: "radial-gradient(circle at 30% 20%, rgba(255,255,255,0.4), transparent 40%), radial-gradient(circle at 80% 80%, rgba(0,0,0,0.3), transparent 50%)" }} />
      <div className="relative text-center px-4">
        <div className={cn("font-display font-semibold text-white drop-shadow-lg", large ? "text-4xl md:text-6xl" : "text-xl")}>
          {destination?.name || "Destination"}
        </div>
        {destination?.city && (
          <div className={cn("text-white/80 mt-1", large ? "text-lg" : "text-xs")}>
            {destination.city}, {destination.country}
          </div>
        )}
      </div>
    </div>
  );
}
