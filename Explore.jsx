import React, { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Search, SlidersHorizontal, Map as MapIcon, LayoutGrid, LocateFixed } from "lucide-react";
import { base44 } from "@/api/base44Client";
import DestinationCard from "@/components/DestinationCard";
import MapView from "@/components/MapView";
import { addToDraft } from "@/lib/draftTrip";
import { haversineKm } from "@/lib/travel";
import { useToast } from "@/components/ui/use-toast";

const CATEGORIES = ["Historical", "Beaches", "Mountains", "Wildlife", "Religious", "Architecture", "Nature", "Food", "Adventure", "Romantic", "Cultural", "Luxury", "UNESCO", "Museums", "Shopping", "Spiritual", "Photography"];
const CONTINENTS = ["Asia", "Europe", "North America", "South America", "Africa", "Oceania"];

export default function Explore() {
  const [params, setParams] = useSearchParams();
  const [all, setAll] = useState([]);
  const [loading, setLoading] = useState(true);
  const [visible, setVisible] = useState(12);
  const [viewMode, setViewMode] = useState("grid");
  const [userLoc, setUserLoc] = useState(null);
  const [locating, setLocating] = useState(false);
  const [nearby, setNearby] = useState(false);
  const { toast } = useToast();

  const q = params.get("q") || "";
  const category = params.get("category") || "";
  const continent = params.get("continent") || "";
  const country = params.get("country") || "";

  useEffect(() => {
    (async () => {
      try {
        const list = await base44.entities.Destination.list("-rating", 1000);
        setAll(list || []);
      } catch {} finally { setLoading(false); }
    })();
  }, []);

  const setParam = (k, v) => {
    const next = new URLSearchParams(params);
    if (v) next.set(k, v); else next.delete(k);
    setParams(next);
    setVisible(12);
  };

  const useMyLocation = () => {
    if (!navigator.geolocation) {
      toast({ title: "Geolocation not supported", variant: "destructive" });
      return;
    }
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setUserLoc({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        setNearby(true);
        setViewMode("map");
        setLocating(false);
        toast({ title: "Location found", description: "Showing destinations near you, sorted by distance" });
      },
      () => {
        setLocating(false);
        toast({ title: "Could not get location", description: "Please allow location access in your browser", variant: "destructive" });
      }
    );
  };

  const filtered = useMemo(() => {
    let result = all.filter((d) => {
      if (q) {
        const s = `${d.name} ${d.city || ""} ${d.state || ""} ${d.country || ""} ${(d.categories || []).join(" ")}`.toLowerCase();
        if (!s.includes(q.toLowerCase())) return false;
      }
      if (category && !(d.categories || []).includes(category)) return false;
      if (continent && d.continent !== continent) return false;
      if (country && d.country !== country) return false;
      return true;
    });
    if (nearby && userLoc) {
      result = result
        .filter((d) => d.latitude)
        .map((d) => ({ ...d, _dist: haversineKm(userLoc.lat, userLoc.lng, d.latitude, d.longitude) }))
        .sort((a, b) => a._dist - b._dist);
    }
    return result;
  }, [all, q, category, continent, country, nearby, userLoc]);

  const onAdd = (d) => { addToDraft({ ...d, id: d.id }); toast({ title: "Added to your trip", description: d.name }); };

  const mapMarkers = useMemo(() => {
    const ms = filtered
      .filter((d) => d.latitude)
      .map((d) => ({
        id: d.id,
        lat: d.latitude,
        lng: d.longitude,
        name: d.name,
        subtitle: [d.city, d.country].filter(Boolean).join(", "),
        distanceKm: d._dist != null ? Math.round(d._dist) : null,
        type: "destination",
      }));
    if (userLoc) ms.unshift({ id: "user", lat: userLoc.lat, lng: userLoc.lng, name: "Your location", type: "start", label: "You" });
    return ms;
  }, [filtered, userLoc]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="font-display font-bold text-3xl mb-2">Explore Destinations</h1>
      <p className="text-muted-foreground mb-6">Search {all.length}+ real destinations across the world.</p>

      <div className="flex flex-col md:flex-row gap-4 mb-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input value={q} onChange={(e) => setParam("q", e.target.value)} placeholder="Search by name, city, country, category…" className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-border bg-card text-sm" />
        </div>
        <select value={continent} onChange={(e) => setParam("continent", e.target.value)} className="px-3 py-2.5 rounded-xl border border-border bg-card text-sm">
          <option value="">All continents</option>
          {CONTINENTS.map((c) => <option key={c}>{c}</option>)}
        </select>
        <select value={category} onChange={(e) => setParam("category", e.target.value)} className="px-3 py-2.5 rounded-xl border border-border bg-card text-sm">
          <option value="">All categories</option>
          {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
        </select>
        <button
          onClick={useMyLocation}
          disabled={locating}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 text-white text-sm font-medium hover:bg-emerald-700 disabled:opacity-60 whitespace-nowrap"
        >
          <LocateFixed className="w-4 h-4" /> {locating ? "Locating…" : "Use my location"}
        </button>
      </div>

      {category === "Food" && (
        <Link
          to="/food"
          className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 rounded-2xl border border-primary/20 bg-primary/5 px-4 py-3 mb-4 hover:bg-primary/10 transition-colors"
        >
          <span className="text-sm text-foreground">
            <span className="font-semibold">Looking for dishes?</span> Browse foods of the world — street food, mains and desserts from every continent.
          </span>
          <span className="text-sm font-semibold text-primary whitespace-nowrap">Open food guide →</span>
        </Link>
      )}

      <div className="flex items-center justify-between gap-2 mb-4">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <SlidersHorizontal className="w-4 h-4" /> {filtered.length} destinations{nearby && userLoc ? " · sorted by distance from you" : ""}
        </div>
        <div className="inline-flex rounded-lg border border-border bg-card p-0.5">
          <button onClick={() => setViewMode("grid")} className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition ${viewMode === "grid" ? "bg-sky-600 text-white" : "text-muted-foreground hover:text-foreground"}`}><LayoutGrid className="w-4 h-4" /> Grid</button>
          <button onClick={() => setViewMode("map")} className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition ${viewMode === "map" ? "bg-sky-600 text-white" : "text-muted-foreground hover:text-foreground"}`}><MapIcon className="w-4 h-4" /> Map</button>
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">{Array.from({ length: 8 }).map((_, i) => <div key={i} className="h-72 rounded-2xl bg-muted animate-pulse" />)}</div>
      ) : viewMode === "map" ? (
        <div className="grid lg:grid-cols-[1fr_340px] gap-4">
          <div className="rounded-2xl overflow-hidden border border-border/60 h-[60vh] min-h-[420px]">
            <MapView markers={mapMarkers} height="100%" onSelect={(m) => {
              if (m.id === "user") return;
              const d = filtered.find((x) => x.id === m.id);
              if (d) onAdd(d);
            }} />
          </div>
          <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-1">
            {filtered.slice(0, 50).map((d) => (
              <div key={d.id} className="flex items-center gap-3 p-2.5 rounded-xl border border-border/60 bg-card">
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-sm truncate">{d.name}</div>
                  <div className="text-xs text-muted-foreground truncate">{[d.city, d.country].filter(Boolean).join(", ")}</div>
                </div>
                {d._dist != null && <span className="text-xs text-emerald-700 font-medium whitespace-nowrap">{Math.round(d._dist)} km</span>}
                <button onClick={() => onAdd(d)} className="px-2.5 py-1.5 rounded-lg bg-sky-600 text-white text-xs font-medium hover:bg-sky-700">Add</button>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {filtered.slice(0, visible).map((d) => <DestinationCard key={d.id} destination={d} onAdd={onAdd} />)}
          </div>
          {visible < filtered.length && (
            <div className="text-center mt-8">
              <button onClick={() => setVisible((v) => v + 12)} className="px-6 py-2.5 rounded-full bg-sky-600 text-white font-medium hover:bg-sky-700">Load more</button>
            </div>
          )}
        </>
      )}
    </div>
  );
}