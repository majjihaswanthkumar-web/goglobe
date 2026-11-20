import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Search, Globe, MapPin, Compass, Sparkles, ArrowRight, Plane } from "lucide-react";
import { base44 } from "@/api/base44Client";
import DestinationCard from "@/components/DestinationCard";
import { addToDraft } from "@/lib/draftTrip";
import { useToast } from "@/components/ui/use-toast";

const HERO = "https://media.base44.com/images/public/6ab9fb29c8b90ea4ac3622c2/c24ce93f0_generated_image.png";

const CATEGORIES = ["Historical", "Beaches", "Mountains", "Wildlife", "Religious", "Architecture", "Nature", "Food", "Adventure", "Romantic", "UNESCO", "Luxury"];

export default function Home() {
  const [q, setQ] = useState("");
  const [featured, setFeatured] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    (async () => {
      try {
        const list = await base44.entities.Destination.list("-rating", 8);
        setFeatured(list || []);
      } catch {} finally { setLoading(false); }
    })();
  }, []);

  const search = (e) => {
    e?.preventDefault();
    navigate(`/explore${q ? `?q=${encodeURIComponent(q)}` : ""}`);
  };

  const onAdd = (d) => {
    addToDraft({ ...d, id: d.id });
    toast({ title: "Added to your trip", description: d.name });
  };

  return (
    <div>
      {/* Hero */}
      <section className="relative h-[70vh] min-h-[480px] flex items-center justify-center overflow-hidden">
        <img src={HERO} alt="World travel" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950/70 via-slate-900/35 to-slate-950/85" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_70%_15%,rgba(20,184,166,0.35),transparent_60%)]" />
        <div className="relative z-10 text-center px-4 max-w-3xl">
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 text-white/90 text-xs font-medium backdrop-blur border border-white/25 mb-5">
            <Sparkles className="w-3.5 h-3.5" /> Curated destinations across 6 continents
          </span>
          <h1 className="font-display font-semibold text-white text-4xl md:text-6xl leading-[1.08] drop-shadow-lg">
            Explore the World.<br /><span className="text-amber-300">Plan Smarter.</span> Travel Better.
          </h1>
          <p className="text-white/85 mt-4 text-base md:text-lg max-w-2xl mx-auto leading-relaxed">
            Discover destinations, build efficient itineraries, explore local culture, find food and stays, and plan your perfect journey.
          </p>
          <form onSubmit={search} className="mt-7 flex max-w-xl mx-auto bg-white rounded-full p-1.5 shadow-2xl shadow-black/25 ring-1 ring-black/5">
            <Search className="w-5 h-5 text-muted-foreground self-center ml-3" />
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search countries, cities, monuments, food…" className="flex-1 px-3 py-2 bg-transparent text-foreground outline-none text-sm" />
            <button type="submit" className="px-5 py-2 rounded-full bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition-colors">Search</button>
          </form>
          <div className="mt-5 flex flex-wrap gap-2 justify-center">
            <Link to="/plan-trip" className="px-5 py-2.5 rounded-full bg-white text-slate-900 font-semibold text-sm hover:bg-amber-50 flex items-center gap-2 shadow-lg shadow-black/10"><Sparkles className="w-4 h-4 text-primary" /> Plan My Trip</Link>
            <Link to="/india" className="px-5 py-2.5 rounded-full bg-amber-500 text-slate-950 font-semibold text-sm hover:bg-amber-400 flex items-center gap-2"><MapPin className="w-4 h-4" /> Explore India</Link>
            <Link to="/world" className="px-5 py-2.5 rounded-full bg-primary text-primary-foreground font-semibold text-sm hover:bg-primary/90 flex items-center gap-2"><Globe className="w-4 h-4" /> Explore World</Link>
            <Link to="/explore" className="px-5 py-2.5 rounded-full bg-white/15 text-white font-semibold text-sm hover:bg-white/25 border border-white/30 backdrop-blur flex items-center gap-2"><Compass className="w-4 h-4" /> Explore Nearby</Link>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="max-w-7xl mx-auto px-4 py-10">
        <h2 className="font-display font-semibold text-2xl mb-1">Browse by category</h2>
        <p className="text-sm text-muted-foreground mb-5">Pick a mood and discover the places that match it.</p>
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map((c) => (
            <Link key={c} to={c === "Food" ? "/food" : `/explore?category=${encodeURIComponent(c)}`} className="px-4 py-2 rounded-full bg-card border border-border text-sm font-medium text-foreground hover:border-primary/40 hover:bg-primary hover:text-primary-foreground transition-colors">{c}</Link>
          ))}
        </div>
      </section>

      {/* Featured */}
      <section className="max-w-7xl mx-auto px-4 pb-16">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display font-semibold text-2xl">Featured destinations</h2>
          <Link to="/explore" className="text-sm text-primary font-semibold flex items-center gap-1 hover:gap-2 transition-all">View all <ArrowRight className="w-4 h-4" /></Link>
        </div>
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {Array.from({ length: 8 }).map((_, i) => <div key={i} className="h-72 rounded-2xl bg-muted animate-pulse" />)}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {featured.map((d) => <DestinationCard key={d.id} destination={d} onAdd={onAdd} />)}
          </div>
        )}
      </section>

      {/* CTAs */}
      <section className="max-w-7xl mx-auto px-4 pb-16 grid md:grid-cols-2 gap-5">
        <Link to="/india" className="group relative h-56 rounded-3xl overflow-hidden bg-gradient-to-br from-amber-500 via-orange-500 to-rose-600 p-8 flex flex-col justify-end text-white shadow-lg shadow-orange-900/10">
          <Plane className="w-8 h-8 mb-2 opacity-80" />
          <h3 className="font-display font-bold text-2xl">Explore India</h3>
          <p className="text-white/80 text-sm">Every state & union territory, with real destinations.</p>
          <span className="mt-3 text-sm font-medium flex items-center gap-1 group-hover:gap-2 transition-all">Start exploring <ArrowRight className="w-4 h-4" /></span>
        </Link>
        <Link to="/world" className="group relative h-56 rounded-3xl overflow-hidden bg-gradient-to-br from-teal-600 via-cyan-700 to-primary p-8 flex flex-col justify-end text-white shadow-lg shadow-teal-900/10">
          <Globe className="w-8 h-8 mb-2 opacity-80" />
          <h3 className="font-display font-bold text-2xl">Explore the World</h3>
          <p className="text-white/80 text-sm">Iconic destinations across every continent.</p>
          <span className="mt-3 text-sm font-medium flex items-center gap-1 group-hover:gap-2 transition-all">Start exploring <ArrowRight className="w-4 h-4" /></span>
        </Link>
      </section>
    </div>
  );
}