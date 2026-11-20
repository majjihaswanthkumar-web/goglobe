import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Plus, MapPin, Calendar, Users } from "lucide-react";
import { base44 } from "@/api/base44Client";
import { getDraft } from "@/lib/draftTrip";

export default function MyTrips() {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const draft = getDraft();

  useEffect(() => {
    (async () => {
      try {
        const list = await base44.entities.Trip.list("-created_date", 50);
        setTrips(list || []);
      } catch {} finally { setLoading(false); }
    })();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-display font-bold text-3xl">My Trips</h1>
        <Link to="/plan-trip" className="inline-flex items-center gap-1 px-4 py-2 rounded-lg bg-sky-600 text-white text-sm font-medium hover:bg-sky-700"><Plus className="w-4 h-4" /> New Trip</Link>
      </div>

      {draft.destinations.length > 0 && (
        <div className="mb-6 p-4 rounded-2xl border border-amber-200 bg-amber-50">
          <div className="font-medium text-amber-900">You have a draft trip with {draft.destinations.length} places.</div>
          <Link to="/plan-trip" className="text-sm text-amber-700 underline">Continue planning →</Link>
        </div>
      )}

      {loading ? <div className="text-muted-foreground">Loading…</div>
        : trips.length === 0 ? <div className="p-8 rounded-2xl border border-dashed text-center text-muted-foreground">No saved trips yet. <Link to="/plan-trip" className="text-sky-700 underline">Plan one now</Link>.</div>
        : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {trips.map((t) => (
              <Link key={t.id} to={`/trip/${t.id}`} className="group rounded-2xl border border-border/60 bg-card p-5 hover:shadow-lg transition">
                <h3 className="font-display font-semibold text-lg group-hover:text-sky-700">{t.name}</h3>
                <div className="flex flex-wrap gap-3 text-xs text-muted-foreground mt-2">
                  {t.startDate && <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {t.startDate}</span>}
                  <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {t.numDays} days</span>
                  <span className="flex items-center gap-1"><Users className="w-3 h-3" /> {t.numTravelers}</span>
                </div>
                <div className="mt-3 text-sm text-muted-foreground">{(t.destinations || []).length} destinations · {t.travelStyle}</div>
              </Link>
            ))}
          </div>
        )}
    </div>
  );
}