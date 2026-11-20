
import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, MapPin, Calendar, Users, Wallet, Sparkles, Printer } from "lucide-react";
import { base44 } from "@/api/base44Client";
import ItineraryTimeline from "@/components/ItineraryTimeline";
import MapView from "@/components/MapView";
import { formatDuration } from "@/lib/travel";

export default function TripDetail() {
  const { id } = useParams();
  const [trip, setTrip] = useState(null);
  const [loading, setLoading] = useState(true);
  const [active, setActive] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const t = await base44.entities.Trip.get(id);
        setTrip(t);
      } catch {} finally { setLoading(false); }
    })();
  }, [id]);

  if (loading) return <div className="max-w-5xl mx-auto px-4 py-20 text-center text-muted-foreground">Loading…</div>;
  if (!trip) return <div className="max-w-5xl mx-auto px-4 py-20 text-center"><p>Trip not found.</p><Link to="/my-trips" className="text-sky-700">My trips</Link></div>;

  const markers = (trip.destinations || []).map((d) => ({ id: d.destinationId, lat: d.latitude, lng: d.longitude, name: d.name, subtitle: d.city, type: "destination" }));
  const route = markers.map((m) => ({ lat: m.lat, lng: m.lng }));

  const totals = (trip.itinerary || []).reduce((acc, day) => {
    (day.items || []).forEach((it) => {
      if (it.type === "explore") acc.sightseeing += it.durationMinutes;
      else if (it.type === "travel") acc.travel += it.durationMinutes;
      else if (it.type === "meal") acc.meal += it.durationMinutes;
      else acc.rest += it.durationMinutes;
    });
    return acc;
  }, { sightseeing: 0, travel: 0, meal: 0, rest: 0 });

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-4">
        <Link to="/my-trips" className="inline-flex items-center gap-1 text-sm text-sky-700 hover:gap-2 transition-all"><ArrowLeft className="w-4 h-4" /> My trips</Link>
        <button onClick={() => window.print()} className="inline-flex items-center gap-1 text-sm px-3 py-1.5 rounded-lg border border-border hover:bg-accent"><Printer className="w-4 h-4" /> Print</button>
      </div>
      <h1 className="font-display font-bold text-3xl">{trip.name}</h1>
      <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mt-2">
        {trip.startDate && <span className="flex items-center gap-1"><Calendar className="w-4 h-4" /> {trip.startDate}</span>}
        <span className="flex items-center gap-1"><MapPin className="w-4 h-4" /> {trip.numDays} days</span>
        <span className="flex items-center gap-1"><Users className="w-4 h-4" /> {trip.numTravelers} travelers</span>
        {trip.budget && <span className="flex items-center gap-1"><Wallet className="w-4 h-4" /> ₹{trip.budget.toLocaleString()}</span>}
        <span className="px-2 py-0.5 rounded-full bg-sky-100 text-sky-700">{trip.travelStyle}</span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-5">
        <Stat label="Sightseeing" value={formatDuration(totals.sightseeing)} />
        <Stat label="Travel" value={formatDuration(totals.travel)} />
        <Stat label="Meals" value={formatDuration(totals.meal)} />
        <Stat label="Rest/Free" value={formatDuration(totals.rest)} />
      </div>

      <div className="grid lg:grid-cols-[1fr_400px] gap-4 mt-6">
        <div className="rounded-2xl border border-border/60 bg-card p-4">
          <h2 className="font-display font-semibold text-xl mb-4 flex items-center gap-2"><Sparkles className="w-5 h-5 text-sky-600" /> Itinerary</h2>
          <ItineraryTimeline days={trip.itinerary || []} onSelectItem={(it) => setActive(it.destinationId)} activeId={active} />
        </div>
        <div className="rounded-2xl overflow-hidden border border-border/60 h-80 lg:h-auto min-h-[400px] sticky top-20">
          <MapView markers={markers} route={route} height="100%" onSelect={(m) => setActive(m.id)} />
        </div>
      </div>
    </div>
  );
}

function Stat({ label, value }) {
  return <div className="p-3 rounded-xl bg-sky-50 border border-sky-200 text-center"><div className="text-lg font-bold text-sky-800">{value}</div><div className="text-xs text-sky-700">{label}</div></div>;
}