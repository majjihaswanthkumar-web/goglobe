import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { base44 } from "@/api/base44Client";
import DestinationCard from "@/components/DestinationCard";
import { addToDraft } from "@/lib/draftTrip";
import { useToast } from "@/components/ui/use-toast";

export default function CountryPage() {
  const { country } = useParams();
  const countryName = country.split("-").map((w) => w[0].toUpperCase() + w.slice(1)).join(" ").replace(" And ", " & ");
  const [dests, setDests] = useState([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    (async () => {
      try {
        const list = await base44.entities.Destination.filter({ country: countryName }, "-rating", 500);
        setDests(list || []);
      } catch {} finally { setLoading(false); }
    })();
  }, [countryName]);

  const onAdd = (d) => { addToDraft({ ...d, id: d.id }); toast({ title: "Added to your trip", description: d.name }); };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <Link to="/world" className="inline-flex items-center gap-1 text-sm text-sky-700 mb-3 hover:gap-2 transition-all"><ArrowLeft className="w-4 h-4" /> All countries</Link>
      <h1 className="font-display font-bold text-4xl">{countryName}</h1>
      <p className="text-muted-foreground mt-2">{dests.length} destinations</p>
      <h2 className="font-display font-semibold text-2xl mt-8 mb-4">Destinations</h2>
      {loading ? <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">{Array.from({ length: 4 }).map((_, i) => <div key={i} className="h-72 rounded-2xl bg-muted animate-pulse" />)}</div>
        : dests.length ? <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">{dests.map((d) => <DestinationCard key={d.id} destination={d} onAdd={onAdd} />)}</div>
        : <div className="text-muted-foreground p-8 text-center rounded-2xl border border-dashed">No destinations seeded for {countryName} yet.</div>}
    </div>
  );
}