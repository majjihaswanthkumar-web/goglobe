import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Globe } from "lucide-react";
import { base44 } from "@/api/base44Client";
import { slugify } from "@/lib/travel";

const CONTINENTS = ["Asia", "Europe", "North America", "South America", "Africa", "Oceania"];

export default function WorldExplorer() {
  const [byContinent, setByContinent] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const list = await base44.entities.Destination.list("-rating", 1000);
        const grouped = {};
        (list || []).forEach((d) => {
          const cont = d.continent || "Other";
          if (!grouped[cont]) grouped[cont] = {};
          const c = d.country || "Other";
          grouped[cont][c] = (grouped[cont][c] || 0) + 1;
        });
        setByContinent(grouped);
      } catch {} finally { setLoading(false); }
    })();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="rounded-3xl bg-gradient-to-br from-sky-600 to-blue-900 p-8 text-white mb-8">
        <h1 className="font-display font-bold text-4xl">Explore the World</h1>
        <p className="text-white/85 mt-2 max-w-2xl">Iconic destinations across every continent — real places, real history, real culture.</p>
      </div>

      {CONTINENTS.map((cont) => {
        const countries = byContinent[cont] || {};
        const entries = Object.entries(countries).sort((a, b) => b[1] - a[1]);
        if (!entries.length && !loading) return null;
        return (
          <div key={cont} className="mb-8">
            <h2 className="font-display font-semibold text-2xl mb-3 flex items-center gap-2"><Globe className="w-5 h-5 text-sky-600" /> {cont}</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
              {entries.length ? entries.map(([c, n]) => (
                <Link key={c} to={`/world/${slugify(c)}`} className="group p-4 rounded-2xl border border-border/60 bg-card hover:shadow-md hover:border-sky-300 transition">
                  <div className="font-medium text-sm group-hover:text-sky-700">{c}</div>
                  <div className="text-xs text-muted-foreground">{n} destinations</div>
                </Link>
              )) : <div className="text-sm text-muted-foreground col-span-full">Loading…</div>}
            </div>
          </div>
        );
      })}
    </div>
  );
}