import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { MapPin } from "lucide-react";
import { base44 } from "@/api/base44Client";
import { slugify } from "@/lib/travel";

export const INDIAN_STATES = [
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh", "Goa", "Gujarat", "Haryana",
  "Himachal Pradesh", "Jharkhand", "Karnataka", "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur",
  "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu",
  "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal", "Jammu & Kashmir", "Ladakh",
  "Andaman & Nicobar Islands", "Chandigarh", "Dadra & Nagar Haveli and Daman & Diu", "Delhi", "Lakshadweep", "Puducherry",
];

export default function IndiaExplorer() {
  const [counts, setCounts] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const list = await base44.entities.Destination.filter({ country: "India" }, "-rating", 1000);
        const c = {};
        (list || []).forEach((d) => { if (d.state) c[d.state] = (c[d.state] || 0) + 1; });
        setCounts(c);
      } catch {} finally { setLoading(false); }
    })();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="rounded-3xl bg-gradient-to-br from-orange-500 via-rose-600 to-amber-700 p-8 text-white mb-8">
        <h1 className="font-display font-bold text-4xl">Explore India</h1>
        <p className="text-white/85 mt-2 max-w-2xl">Every state and union territory, with genuine destinations, history, food, crafts and culture.</p>
      </div>
      <h2 className="font-display font-semibold text-2xl mb-4">States & Union Territories</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
        {INDIAN_STATES.map((s) => (
          <Link key={s} to={`/india/${slugify(s)}`} className="group flex items-center justify-between p-4 rounded-2xl border border-border/60 bg-card hover:shadow-md hover:border-sky-300 transition">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-orange-600" />
              <span className="font-medium text-sm group-hover:text-sky-700">{s}</span>
            </div>
            <span className="text-xs text-muted-foreground">{counts[s] || 0}</span>
          </Link>
        ))}
      </div>
      {loading && <div className="text-sm text-muted-foreground mt-4">Counting destinations…</div>}
    </div>
  );
}