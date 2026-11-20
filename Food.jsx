import React, { useEffect, useMemo, useState } from "react";
import { Search, Utensils, Leaf, Globe2 } from "lucide-react";
import { base44 } from "@/api/base44Client";
import FoodCard from "@/components/food/FoodCard";
import { WORLD_FOODS } from "@/data/worldFoods";

const CONTINENTS = ["Asia", "Europe", "North America", "South America", "Africa", "Oceania"];
const TYPES = ["Street food", "Main", "Dessert", "Local specialty"];

export default function Food() {
  const [fromPlaces, setFromPlaces] = useState([]);
  const [q, setQ] = useState("");
  const [continent, setContinent] = useState("");
  const [type, setType] = useState("");
  const [vegOnly, setVegOnly] = useState(false);
  const [visible, setVisible] = useState(12);

  useEffect(() => {
    (async () => {
      try {
        const list = await base44.entities.Destination.list("-rating", 1000);
        const dishes = [];
        (list || []).forEach((d) => {
          (d.foods || []).forEach((f) => {
            if (!f?.name) return;
            dishes.push({
              name: f.name,
              description: f.description || "",
              ingredients: f.ingredients || "",
              veg: f.veg !== false,
              country: d.country || "",
              continent: d.continent || "",
              type: "Local specialty",
              destinationSlug: d.slug,
              destinationName: d.name,
            });
          });
        });
        setFromPlaces(dishes);
      } catch {
        /* keep the curated list */
      }
    })();
  }, []);

  const dishes = useMemo(() => {
    const seen = new Set(WORLD_FOODS.map((d) => d.name.toLowerCase()));
    const merged = [...WORLD_FOODS];
    fromPlaces.forEach((d) => {
      if (seen.has(d.name.toLowerCase())) return;
      seen.add(d.name.toLowerCase());
      merged.push(d);
    });
    return merged;
  }, [fromPlaces]);

  const filtered = useMemo(() => {
    const term = q.trim().toLowerCase();
    return dishes.filter((d) => {
      if (continent && d.continent !== continent) return false;
      if (type && d.type !== type) return false;
      if (vegOnly && !d.veg) return false;
      if (term) {
        const s = `${d.name} ${d.country} ${d.ingredients} ${d.description}`.toLowerCase();
        if (!s.includes(term)) return false;
      }
      return true;
    });
  }, [dishes, q, continent, type, vegOnly]);

  const reset = (setter) => (value) => {
    setter(value);
    setVisible(12);
  };

  const countryCount = new Set(dishes.map((d) => d.country).filter(Boolean)).size;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-rose-600 via-orange-600 to-amber-500 text-white p-6 md:p-8">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_85%_10%,rgba(255,255,255,0.3),transparent_55%)]" />
        <div className="relative">
          <span className="inline-flex items-center gap-2 text-[10px] font-semibold uppercase tracking-wider bg-white/15 border border-white/25 rounded-full px-3 py-1">
            <Utensils className="w-3.5 h-3.5" /> Foods of the world
          </span>
          <h1 className="font-display font-semibold text-3xl md:text-4xl mt-3">Eat your way around the globe</h1>
          <p className="text-white/90 mt-2 max-w-xl text-sm md:text-base">
            Street food, hearty mains and sweets from every continent, with what goes into each dish and where to try it.
          </p>
          <div className="flex flex-wrap gap-2 mt-4 text-xs font-semibold">
            <span className="px-3 py-1 rounded-full bg-white/20 border border-white/25">{dishes.length} dishes</span>
            <span className="px-3 py-1 rounded-full bg-white/20 border border-white/25">{countryCount} countries</span>
            <span className="px-3 py-1 rounded-full bg-white/20 border border-white/25 flex items-center gap-1">
              <Globe2 className="w-3 h-3" /> 6 continents
            </span>
          </div>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-3 mt-6">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            value={q}
            onChange={(e) => reset(setQ)(e.target.value)}
            placeholder="Search a dish, country or ingredient…"
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-border bg-card text-sm"
          />
        </div>
        <select
          value={continent}
          onChange={(e) => reset(setContinent)(e.target.value)}
          className="px-3 py-2.5 rounded-xl border border-border bg-card text-sm"
        >
          <option value="">All continents</option>
          {CONTINENTS.map((c) => (
            <option key={c}>{c}</option>
          ))}
        </select>
        <button
          onClick={() => reset(setVegOnly)(!vegOnly)}
          className={`inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium border transition ${
            vegOnly
              ? "bg-emerald-600 text-white border-emerald-600"
              : "bg-card text-muted-foreground border-border hover:text-foreground"
          }`}
        >
          <Leaf className="w-4 h-4" /> Veg only
        </button>
      </div>

      <div className="flex flex-wrap gap-2 mt-3">
        <button
          onClick={() => reset(setType)("")}
          className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition ${
            !type ? "bg-primary text-primary-foreground border-primary" : "bg-card border-border text-muted-foreground hover:text-foreground"
          }`}
        >
          All dishes
        </button>
        {TYPES.map((t) => (
          <button
            key={t}
            onClick={() => reset(setType)(t)}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition ${
              type === t ? "bg-primary text-primary-foreground border-primary" : "bg-card border-border text-muted-foreground hover:text-foreground"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      <p className="text-sm text-muted-foreground mt-5 mb-4">{filtered.length} dishes</p>

      {filtered.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-border bg-card py-16 text-center">
          <Utensils className="w-8 h-8 mx-auto text-muted-foreground mb-2" />
          <p className="font-medium text-foreground">No dishes match those filters</p>
          <p className="text-sm text-muted-foreground mt-1">Try another continent, dish type or search term.</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {filtered.slice(0, visible).map((d, i) => (
              <FoodCard key={`${d.name}-${i}`} dish={d} />
            ))}
          </div>
          {visible < filtered.length && (
            <div className="text-center mt-8">
              <button
                onClick={() => setVisible((v) => v + 12)}
                className="px-6 py-2.5 rounded-full bg-primary text-primary-foreground font-medium hover:opacity-90 transition"
              >
                Load more dishes
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}