import React, { useEffect, useMemo, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Map as MapIcon, ArrowLeft } from "lucide-react";
import { base44 } from "@/api/base44Client";
import DestinationCard from "@/components/DestinationCard";
import MapView from "@/components/MapView";
import { addToDraft } from "@/lib/draftTrip";
import { useToast } from "@/components/ui/use-toast";
import { INDIAN_STATES } from "@/pages/IndiaExplorer";

const STATE_NAMES = {
  "uttar-pradesh": "Uttar Pradesh", "rajasthan": "Rajasthan", "maharashtra": "Maharashtra", "delhi": "Delhi",
  "telangana": "Telangana", "karnataka": "Karnataka", "kerala": "Kerala", "tamil-nadu": "Tamil Nadu",
  "odisha": "Odisha", "madhya-pradesh": "Madhya Pradesh", "goa": "Goa", "assam": "Assam",
  "west-bengal": "West Bengal", "punjab": "Punjab", "andaman-nicobar-islands": "Andaman & Nicobar Islands",
  "ladakh": "Ladakh", "jammu-kashmir": "Jammu & Kashmir", "himachal-pradesh": "Himachal Pradesh",
  "uttarakhand": "Uttarakhand",
};

function deslugify(slug) {
  if (STATE_NAMES[slug]) return STATE_NAMES[slug];
  return INDIAN_STATES.find((s) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-") === slug) || slug.replace(/-/g, " ");
}

export default function StatePage() {
  const { state } = useParams();
  const stateName = deslugify(state);
  const [dests, setDests] = useState([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    (async () => {
      try {
        const list = await base44.entities.Destination.filter({ country: "India", state: stateName }, "-rating", 200);
        setDests(list || []);
      } catch {} finally { setLoading(false); }
    })();
  }, [stateName]);

  const onAdd = (d) => { addToDraft({ ...d, id: d.id }); toast({ title: "Added to your trip", description: d.name }); };

  const markers = dests.map((d) => ({ id: d.id, lat: d.latitude, lng: d.longitude, name: d.name, subtitle: d.city, type: "destination" }));
  const foods = useMemo(() => dests.flatMap((d) => d.foods || []).filter((v, i, a) => a.findIndex((x) => x.name === v.name) === i), [dests]);
  const crafts = useMemo(() => dests.flatMap((d) => d.crafts || []).filter((v, i, a) => a.findIndex((x) => x.name === v.name) === i), [dests]);
  const langs = useMemo(() => [...new Set(dests.flatMap((d) => d.languages || []))], [dests]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <Link to="/india" className="inline-flex items-center gap-1 text-sm text-sky-700 mb-3 hover:gap-2 transition-all"><ArrowLeft className="w-4 h-4" /> All states</Link>
      <h1 className="font-display font-bold text-4xl">{stateName}</h1>
      <p className="text-muted-foreground mt-2">{dests.length} destinations · {langs.length} languages · {foods.length} foods · {crafts.length} crafts</p>

      {dests.length > 0 && (
        <div className="grid lg:grid-cols-[1fr_400px] gap-6 mt-6">
          <div className="rounded-2xl overflow-hidden border border-border/60 h-80 lg:h-auto">
            <MapView markers={markers} height="100%" />
          </div>
          <div className="space-y-4">
            {langs.length > 0 && <div><h3 className="font-semibold mb-2">Languages</h3><div className="flex flex-wrap gap-2">{langs.map((l) => <span key={l} className="px-3 py-1 rounded-full bg-accent text-sm">{l}</span>)}</div></div>}
            {foods.length > 0 && <div><h3 className="font-semibold mb-2">Famous Foods</h3><div className="space-y-2">{foods.slice(0, 6).map((f) => <div key={f.name} className="p-3 rounded-xl border border-border/60 bg-card"><div className="font-medium text-sm">{f.name} {f.veg != null && <span className="text-xs text-emerald-600">{f.veg ? "🟢 Veg" : "🔴 Non-veg"}</span>}</div><div className="text-xs text-muted-foreground">{f.description}</div></div>)}</div></div>}
            {crafts.length > 0 && <div><h3 className="font-semibold mb-2">Crafts</h3><div className="space-y-2">{crafts.map((c) => <div key={c.name} className="p-3 rounded-xl border border-border/60 bg-card"><div className="font-medium text-sm">{c.name}</div><div className="text-xs text-muted-foreground">{c.description}</div></div>)}</div></div>}
          </div>
        </div>
      )}

      <h2 className="font-display font-semibold text-2xl mt-10 mb-4">Destinations in {stateName}</h2>
      {loading ? <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">{Array.from({ length: 4 }).map((_, i) => <div key={i} className="h-72 rounded-2xl bg-muted animate-pulse" />)}</div>
        : dests.length ? <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">{dests.map((d) => <DestinationCard key={d.id} destination={d} onAdd={onAdd} />)}</div>
        : <div className="text-muted-foreground p-8 text-center rounded-2xl border border-dashed">No destinations seeded for {stateName} yet. The architecture supports adding more — try Rajasthan, Uttar Pradesh, Kerala, Maharashtra, Delhi, Telangana or Karnataka.</div>}
    </div>
  );
}