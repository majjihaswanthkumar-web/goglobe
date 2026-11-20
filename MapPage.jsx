import React, { useEffect, useState, useMemo } from "react";
import { Search, LocateFixed, Globe, Map as MapIcon } from "lucide-react";
import { base44 } from "@/api/base44Client";
import MapView from "@/components/MapView";
import GlobeView from "@/components/GlobeView";
import DestinationImage from "@/components/DestinationImage";
import { Link } from "react-router-dom";
import { addToDraft } from "@/lib/draftTrip";
import { haversineKm } from "@/lib/travel";
import { useToast } from "@/components/ui/use-toast";

const CONTINENTS = ["", "Asia", "Europe", "North America", "South America", "Africa", "Oceania"];

export default function MapPage() {
  const [all, setAll] = useState([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState("");
  const [continent, setContinent] = useState("");
  const [selected, setSelected] = useState(null);
  const [viewMode, setViewMode] = useState("map");
  const [userLoc, setUserLoc] = useState(null);
  const [locating, setLocating] = useState(false);
  const { toast } = useToast();

  const useMyLocation = () => {
    if (!navigator.geolocation) { toast({ title: "Geolocation not supported", variant: "destructive" }); return; }
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setUserLoc({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        setLocating(false);
        toast({ title: "Location found", description: "Showing your location on the map" });
      },
      () => { setLocating(false); toast({ title: "Could not get location", description: "Please allow location access", variant: "destructive" }); }
    );
  };

  useEffect(() => {
    (async () => {
      try {
        const list = await base44.entities.Destination.list("-rating", 1000);
        setAll(list || []);
      } catch {} finally { setLoading(false); }
    })();
  }, []);

  const markers = useMemo(() => {
    const ms = all
      .filter((d) => d.latitude && (!continent || d.continent === continent) && (!q || `${d.name} ${d.city || ""} ${d.country || ""}`.toLowerCase().includes(q.toLowerCase())))
      .map((d) => {
        const m = { id: d.id, lat: d.latitude, lng: d.longitude, name: d.name, subtitle: [d.city, d.country].filter(Boolean).join(", "), type: "destination", destinationId: d.id, data: d };
        if (userLoc) m.distanceKm = Math.round(haversineKm(userLoc.lat, userLoc.lng, d.latitude, d.longitude));
        return m;
      });
    if (userLoc) ms.unshift({ id: "user", lat: userLoc.lat, lng: userLoc.lng, name: "Your location", type: "start", label: "You" });
    return ms;
  }, [all, q, continent, userLoc]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex items-start justify-between gap-4 mb-4">
        <div>
          <h1 className="font-display font-bold text-3xl mb-1">World Map</h1>
          <p className="text-muted-foreground">Explore {all.length} destinations on an interactive {viewMode === "globe" ? "3D globe" : "map"}. Click a marker for details.</p>
        </div>
        <div className="inline-flex rounded-lg border border-border bg-card p-0.5 shrink-0">
          <button onClick={() => setViewMode("map")} className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition ${viewMode === "map" ? "bg-sky-600 text-white" : "text-muted-foreground hover:text-foreground"}`}><MapIcon className="w-4 h-4" /> Map</button>
          <button onClick={() => setViewMode("globe")} className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition ${viewMode === "globe" ? "bg-sky-600 text-white" : "text-muted-foreground hover:text-foreground"}`}><Globe className="w-4 h-4" /> Globe</button>
        </div>
      </div>
      <div className="flex gap-3 mb-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search…" className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-border bg-card text-sm" />
        </div>
        <select value={continent} onChange={(e) => setContinent(e.target.value)} className="px-3 py-2.5 rounded-xl border border-border bg-card text-sm">
          {CONTINENTS.map((c, i) => <option key={i} value={c}>{c || "All continents"}</option>)}
        </select>
        <button onClick={useMyLocation} disabled={locating} className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 text-white text-sm font-medium hover:bg-emerald-700 disabled:opacity-60 whitespace-nowrap">
          <LocateFixed className="w-4 h-4" /> {locating ? "Locating…" : "My location"}
        </button>
      </div>
      <div className="grid lg:grid-cols-[1fr_340px] gap-4">
        <div className="rounded-2xl overflow-hidden border border-border/60 h-[60vh] min-h-[400px]">
          {viewMode === "globe" ? (
            <GlobeView markers={markers} height="100%" onSelect={(m) => { if (m.id === "user") return; setSelected(m.data || all.find((d) => d.id === m.id)); }} />
          ) : (
            <MapView markers={markers} height="100%" onSelect={(m) => setSelected(m.data || all.find((d) => d.id === m.id))} />
          )}
        </div>
        <div>
          {selected ? (
            <div className="rounded-2xl border border-border/60 bg-card overflow-hidden">
              <DestinationImage destination={selected} className="h-40 w-full" />
              <div className="p-4">
                <h3 className="font-display font-semibold text-lg">{selected.name}</h3>
                <p className="text-xs text-muted-foreground">{[selected.city, selected.country].filter(Boolean).join(", ")}</p>
                {selected.description && <p className="text-sm text-muted-foreground mt-2 line-clamp-3">{selected.description}</p>}
                <div className="flex gap-2 mt-3">
                  <Link to={`/destination/${selected.slug}`} className="flex-1 text-center text-sm px-3 py-2 rounded-lg border border-border hover:bg-accent">View</Link>
                  <button onClick={() => { addToDraft({ ...selected, id: selected.id }); toast({ title: "Added to trip", description: selected.name }); }} className="px-3 py-2 rounded-lg bg-sky-600 text-white text-sm">Add</button>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-6 rounded-2xl border border-dashed text-center text-sm text-muted-foreground">Click a marker to see destination details.</div>
          )}
        </div>
      </div>
    </div>
  );
}