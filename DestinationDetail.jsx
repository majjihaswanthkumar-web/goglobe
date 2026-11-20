import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Clock, Calendar, Ticket, MapPin, Plus, ArrowLeft, Star, Shield, Utensils, Sparkles, Languages as LangIcon } from "lucide-react";
import { base44 } from "@/api/base44Client";
import DestinationImage from "@/components/DestinationImage";
import DestinationCard from "@/components/DestinationCard";
import MapView from "@/components/MapView";
import WeatherWidget from "@/components/WeatherWidget";
import CurrencyConverter from "@/components/CurrencyConverter";
import TranslationAssistant from "@/components/TranslationAssistant";
import { addToDraft } from "@/lib/draftTrip";
import { useToast } from "@/components/ui/use-toast";
import { formatDuration, haversineKm } from "@/lib/travel";

export default function DestinationDetail() {
  const { slug } = useParams();
  const [dest, setDest] = useState(null);
  const [nearby, setNearby] = useState([]);
  const [all, setAll] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState("overview");
  const { toast } = useToast();

  useEffect(() => {
    (async () => {
      try {
        const list = await base44.entities.Destination.list("-rating", 1000);
        const d = (list || []).find((x) => x.slug === slug);
        setDest(d || null);
        setAll(list || []);
        if (d) {
          const nb = (list || [])
            .filter((x) => x.id !== d.id && x.latitude && d.latitude)
            .map((x) => ({ ...x, dist: haversineKm(d.latitude, d.longitude, x.latitude, x.longitude) }))
            .sort((a, b) => a.dist - b.dist)
            .slice(0, 6);
          setNearby(nb);
        }
      } catch {} finally { setLoading(false); }
    })();
  }, [slug]);

  if (loading) return <div className="max-w-7xl mx-auto px-4 py-20 text-center text-muted-foreground">Loading…</div>;
  if (!dest) return <div className="max-w-7xl mx-auto px-4 py-20 text-center"><p>Destination not found.</p><Link to="/explore" className="text-sky-700">Browse all</Link></div>;

  const onAdd = (d) => { addToDraft({ ...d, id: d.id }); toast({ title: "Added to your trip", description: d.name }); };
  const addThis = () => { addToDraft({ ...dest, id: dest.id }); toast({ title: "Added to your trip", description: dest.name }); };

  const markers = [{ id: dest.id, lat: dest.latitude, lng: dest.longitude, name: dest.name, subtitle: dest.city, type: "destination" }, ...nearby.map((n) => ({ id: n.id, lat: n.latitude, lng: n.longitude, name: n.name, subtitle: `${Math.round(n.dist)} km`, type: "destination" }))];

  const TABS = [
    { id: "overview", label: "Overview" },
    { id: "history", label: "History & Culture" },
    { id: "food", label: "Food & Crafts" },
    { id: "language", label: "Language" },
    { id: "nearby", label: "Nearby" },
  ];

  return (
    <div>
      <div className="relative h-[42vh] min-h-[280px]">
        <DestinationImage destination={dest} className="w-full h-full" large />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
        <Link to="/explore" className="absolute top-4 left-4 inline-flex items-center gap-1 text-sm text-white bg-black/40 backdrop-blur px-3 py-1.5 rounded-full hover:bg-black/60"><ArrowLeft className="w-4 h-4" /> Back</Link>
        <div className="absolute bottom-0 left-0 right-0 p-6 max-w-7xl mx-auto text-white">
          <div className="flex flex-wrap gap-2 mb-2">{(dest.categories || []).map((c) => <span key={c} className="px-2.5 py-1 rounded-full text-xs bg-white/20 backdrop-blur">{c}</span>)}</div>
          <h1 className="font-display font-bold text-4xl md:text-5xl drop-shadow">{dest.name}</h1>
          <p className="text-white/85 mt-1 flex items-center gap-1"><MapPin className="w-4 h-4" /> {[dest.city, dest.state, dest.country].filter(Boolean).join(", ")}</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6 grid lg:grid-cols-[1fr_360px] gap-6">
        <div>
          <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mb-4">
            {dest.recommendedDurationMinutes ? <span className="flex items-center gap-1"><Clock className="w-4 h-4" /> {formatDuration(dest.recommendedDurationMinutes)}</span> : null}
            {dest.bestSeason ? <span className="flex items-center gap-1"><Calendar className="w-4 h-4" /> {dest.bestSeason}</span> : null}
            {dest.entryFee ? <span className="flex items-center gap-1"><Ticket className="w-4 h-4" /> {dest.entryFee}</span> : null}
            {dest.rating ? <span className="flex items-center gap-1"><Star className="w-4 h-4 fill-amber-400 text-amber-400" /> {dest.rating}</span> : null}
          </div>

          <div className="flex gap-1 border-b border-border mb-4 overflow-x-auto">
            {TABS.map((t) => <button key={t.id} onClick={() => setTab(t.id)} className={`px-4 py-2 text-sm font-medium whitespace-nowrap border-b-2 transition ${tab === t.id ? "border-sky-600 text-sky-700" : "border-transparent text-muted-foreground hover:text-foreground"}`}>{t.label}</button>)}
          </div>

          {tab === "overview" && (
            <div className="space-y-4">
              <div className="rounded-2xl border border-border/70 bg-card p-5">
                <h3 className="text-sm font-semibold uppercase tracking-wider text-primary mb-2">About {dest.name}</h3>
                <p className="text-[15px] leading-7 text-foreground/85">{dest.description}</p>
              </div>
              {dest.architecture && <div><h3 className="font-semibold mb-1">Architecture</h3><p className="text-muted-foreground">{dest.architecture}</p></div>}
              {dest.openingHours && <div><h3 className="font-semibold mb-1">Opening Hours</h3><p className="text-muted-foreground">{dest.openingHours}</p></div>}
              {dest.travelTips && <div><h3 className="font-semibold mb-1">Travel Tips</h3><p className="text-muted-foreground">{dest.travelTips}</p></div>}
              {dest.safetyInfo && <div className="flex gap-2 p-3 rounded-xl bg-amber-50 border border-amber-200"><Shield className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" /><p className="text-sm text-amber-900">{dest.safetyInfo}</p></div>}
              <button onClick={addThis} className="w-full py-3 rounded-xl bg-sky-600 text-white font-medium hover:bg-sky-700 flex items-center justify-center gap-2"><Plus className="w-5 h-5" /> Add to My Trip</button>
            </div>
          )}
          {tab === "history" && (
            <div className="space-y-4">
              {dest.history ? <div><h3 className="font-semibold mb-1">History</h3><p className="text-muted-foreground leading-relaxed">{dest.history}</p></div> : <p className="text-muted-foreground">No historical information available.</p>}
              {dest.culturalImportance && <div><h3 className="font-semibold mb-1">Cultural Importance</h3><p className="text-muted-foreground">{dest.culturalImportance}</p></div>}
              {dest.festivals?.length > 0 && <div><h3 className="font-semibold mb-2">Festivals</h3><div className="space-y-2">{dest.festivals.map((f) => <div key={f.name} className="p-3 rounded-xl border border-border/60 bg-card"><div className="font-medium text-sm">{f.name} <span className="text-xs text-muted-foreground">· {f.month}</span></div><div className="text-xs text-muted-foreground">{f.description}</div></div>)}</div></div>}
            </div>
          )}
          {tab === "food" && (
            <div className="space-y-4">
              {dest.foods?.length ? <div><h3 className="font-semibold mb-2 flex items-center gap-1"><Utensils className="w-4 h-4" /> Famous Foods</h3><div className="grid sm:grid-cols-2 gap-3">{dest.foods.map((f) => <div key={f.name} className="p-3 rounded-xl border border-border/60 bg-card"><div className="font-medium text-sm flex items-center justify-between">{f.name} {f.veg != null && <span className="text-xs">{f.veg ? "🟢 Veg" : "🔴 Non-veg"}</span>}</div><div className="text-xs text-muted-foreground mt-1">{f.description}</div>{f.ingredients && <div className="text-xs text-muted-foreground mt-1">Ingredients: {f.ingredients}</div>}</div>)}</div></div> : <p className="text-muted-foreground">No food data.</p>}
              {dest.crafts?.length ? <div><h3 className="font-semibold mb-2">Local Crafts & Shopping</h3><div className="space-y-2">{dest.crafts.map((c) => <div key={c.name} className="p-3 rounded-xl border border-border/60 bg-card"><div className="font-medium text-sm">{c.name}</div><div className="text-xs text-muted-foreground">{c.description}</div></div>)}</div></div> : null}
            </div>
          )}
          {tab === "language" && (
            <div className="space-y-4">
              {dest.languages?.length ? <div><h3 className="font-semibold mb-2 flex items-center gap-1"><LangIcon className="w-4 h-4" /> Languages Spoken</h3><div className="flex flex-wrap gap-2">{dest.languages.map((l) => <span key={l} className="px-3 py-1 rounded-full bg-accent text-sm">{l}</span>)}</div></div> : null}
              {dest.phrases?.length ? <div><h3 className="font-semibold mb-2">Useful Phrases</h3><div className="space-y-2">{dest.phrases.map((p, i) => <div key={i} className="p-3 rounded-xl border border-border/60 bg-card"><div className="text-sm font-medium">{p.english}</div><div className="text-lg">{p.local}</div><div className="text-xs text-muted-foreground">{p.pronunciation}</div></div>)}</div></div> : null}
              <div><h3 className="font-semibold mb-2 flex items-center gap-1"><Sparkles className="w-4 h-4" /> AI Translation</h3><TranslationAssistant /></div>
            </div>
          )}
          {tab === "nearby" && (
            <div>
              <h3 className="font-semibold mb-3">Places to Visit Nearby</h3>
              {nearby.length ? <div className="grid sm:grid-cols-2 gap-4">{nearby.map((n) => <DestinationCard key={n.id} destination={n} onAdd={onAdd} compact />)}</div> : <p className="text-muted-foreground">No nearby places found.</p>}
            </div>
          )}
        </div>

        <aside className="space-y-4">
          <div className="rounded-2xl overflow-hidden border border-border/60 h-64"><MapView markers={markers} height="100%" /></div>
          {dest.latitude && <WeatherWidget lat={dest.latitude} lng={dest.longitude} name={dest.name} />}
          <CurrencyConverter initialFrom="USD" initialTo={dest.country === "India" ? "INR" : "USD"} initialAmount={100} variant="compact" />
          <div className="text-xs text-muted-foreground p-3 rounded-xl bg-accent">Source: {dest.source || "—"} · Updated {dest.lastUpdated || "—"}</div>
        </aside>
      </div>
    </div>
  );
}