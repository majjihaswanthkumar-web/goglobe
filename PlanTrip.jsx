import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { Sparkles, Trash2, GripVertical, Wand2, Save, Plus, X } from "lucide-react";
import { base44 } from "@/api/base44Client";
import { getDraft, reorderDraft, removeFromDraft, setPriority, clearDraft } from "@/lib/draftTrip";
import { generateItinerary, formatDuration } from "@/lib/travel";
import DestinationImage from "@/components/DestinationImage";
import ItineraryTimeline from "@/components/ItineraryTimeline";
import MapView from "@/components/MapView";
import { useToast } from "@/components/ui/use-toast";

const STYLES = ["Relaxed", "Balanced", "Fast-paced", "Adventure", "Family", "Couple", "Solo", "Luxury", "Budget", "Cultural", "Historical", "Nature", "Spiritual", "Food-focused"];
const TRANSPORT = ["Car", "Train", "Flight", "Bus", "Mixed"];

export default function PlanTrip() {
  const [draft, setDraft] = useState({ destinations: [] });
  const [name, setName] = useState("My Trip");
  const [numDays, setNumDays] = useState(5);
  const [hoursPerDay, setHoursPerDay] = useState(8);
  const [travelStyle, setTravelStyle] = useState("Balanced");
  const [transport, setTransport] = useState("Mixed");
  const [numTravelers, setNumTravelers] = useState(2);
  const [budget, setBudget] = useState(50000);
  const [startDate, setStartDate] = useState("");
  const [itinerary, setItinerary] = useState(null);
  const [saving, setSaving] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const refresh = () => setDraft(getDraft());
  useEffect(() => {
    refresh();
    const handler = () => refresh();
    window.addEventListener("wtg-draft-change", handler);
    return () => window.removeEventListener("wtg-draft-change", handler);
  }, []);

  const onDragEnd = (r) => {
    if (!r.destination) return;
    const next = Array.from(draft.destinations);
    const [m] = next.splice(r.source.index, 1);
    next.splice(r.destination.index, 0, m);
    reorderDraft(next);
    setItinerary(null);
  };

  const generate = () => {
    if (!draft.destinations.length) { toast({ title: "Add some destinations first", variant: "destructive" }); return; }
    const res = generateItinerary(draft.destinations, { numDays, hoursPerDay, travelStyle });
    setItinerary(res);
  };

  const save = async () => {
    if (!itinerary) { toast({ title: "Generate an itinerary first", variant: "destructive" }); return; }
    setSaving(true);
    try {
      const trip = await base44.entities.Trip.create({
        name, startDate, endDate: startDate, numDays, numTravelers, budget, travelStyle, transportation: transport, hoursPerDay,
        destinations: draft.destinations, itinerary: itinerary.days,
      });
      clearDraft();
      toast({ title: "Trip saved!", description: name });
      navigate(`/trip/${trip.id}`);
    } catch (e) {
      toast({ title: "Could not save trip", description: "You may need to be logged in to save.", variant: "destructive" });
    } finally { setSaving(false); }
  };

  const markers = itinerary?.ordered?.map((d) => ({ id: d.destinationId || d.id, lat: d.latitude, lng: d.longitude, name: d.name, subtitle: d.city, type: "destination" })) || [];
  const route = markers.map((m) => ({ lat: m.lat, lng: m.lng }));

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="font-display font-bold text-3xl mb-1">Plan Your Trip</h1>
      <p className="text-muted-foreground mb-6">Choose places, set your preferences, and generate an optimized itinerary.</p>

      <div className="grid lg:grid-cols-[360px_1fr] gap-6">
        {/* Selected destinations */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-display font-semibold text-xl">My Places ({draft.destinations.length})</h2>
            {draft.destinations.length > 0 && <button onClick={() => { clearDraft(); setItinerary(null); }} className="text-xs text-red-600 hover:underline">Clear all</button>}
          </div>
          {draft.destinations.length === 0 ? (
            <div className="p-6 rounded-2xl border border-dashed border-border text-center text-sm text-muted-foreground">
              No places selected. <a href="/explore" className="text-sky-700 underline">Explore destinations</a> and tap "Add".
            </div>
          ) : (
            <DragDropContext onDragEnd={onDragEnd}>
              <Droppable droppableId="list">
                {(prov) => (
                  <div ref={prov.innerRef} {...prov.droppableProps} className="space-y-2">
                    {draft.destinations.map((d, i) => (
                      <Draggable key={d.destinationId} draggableId={d.destinationId} index={i}>
                        {(p) => (
                          <div ref={p.innerRef} {...p.draggableProps} className="flex items-center gap-2 p-2 rounded-xl border border-border/60 bg-card">
                            <span {...p.dragHandleProps} className="cursor-grab text-muted-foreground"><GripVertical className="w-4 h-4" /></span>
                            <div className="w-12 h-12 rounded-lg overflow-hidden shrink-0"><DestinationImage destination={d} className="w-full h-full" /></div>
                            <div className="flex-1 min-w-0">
                              <div className="font-medium text-sm truncate">{d.name}</div>
                              <div className="text-xs text-muted-foreground truncate">{d.city}, {d.country}</div>
                              <select value={d.priority} onChange={(e) => setPriority(d.destinationId, e.target.value)} className="text-xs mt-0.5 px-1.5 py-0.5 rounded border border-border bg-background">
                                <option>Must Visit</option><option>Optional</option>
                              </select>
                            </div>
                            <button onClick={() => { removeFromDraft(d.destinationId); setItinerary(null); }} className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg"><Trash2 className="w-4 h-4" /></button>
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {prov.placeholder}
                  </div>
                )}
              </Droppable>
            </DragDropContext>
          )}
          <a href="/explore" className="mt-3 inline-flex items-center gap-1 text-sm text-sky-700 hover:underline"><Plus className="w-4 h-4" /> Add more places</a>
        </div>

        {/* Preferences */}
        <div className="space-y-4">
          <div className="rounded-2xl border border-border/60 bg-card p-5">
            <h2 className="font-display font-semibold text-lg mb-3">Trip Preferences</h2>
            <div className="grid sm:grid-cols-2 gap-3">
              <Field label="Trip name"><input value={name} onChange={(e) => setName(e.target.value)} className="input" /></Field>
              <Field label="Start date"><input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="input" /></Field>
              <Field label="Days"><input type="number" min={1} max={30} value={numDays} onChange={(e) => setNumDays(+e.target.value)} className="input" /></Field>
              <Field label="Hours per day"><input type="number" min={2} max={14} value={hoursPerDay} onChange={(e) => setHoursPerDay(+e.target.value)} className="input" /></Field>
              <Field label="Travelers"><input type="number" min={1} value={numTravelers} onChange={(e) => setNumTravelers(+e.target.value)} className="input" /></Field>
              <Field label="Budget (₹)"><input type="number" value={budget} onChange={(e) => setBudget(+e.target.value)} className="input" /></Field>
              <Field label="Travel style"><select value={travelStyle} onChange={(e) => setTravelStyle(e.target.value)} className="input">{STYLES.map((s) => <option key={s}>{s}</option>)}</select></Field>
              <Field label="Transport"><select value={transport} onChange={(e) => setTransport(e.target.value)} className="input">{TRANSPORT.map((s) => <option key={s}>{s}</option>)}</select></Field>
            </div>
            <button onClick={generate} className="mt-4 w-full py-3 rounded-xl bg-gradient-to-r from-sky-600 to-blue-700 text-white font-semibold flex items-center justify-center gap-2 hover:opacity-90"><Wand2 className="w-5 h-5" /> Generate My Trip</button>
          </div>

          {itinerary && (
            <>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <Stat label="Sightseeing" value={formatDuration(itinerary.totals.sightseeing)} />
                <Stat label="Travel" value={formatDuration(itinerary.totals.travel)} />
                <Stat label="Meals" value={formatDuration(itinerary.totals.meal)} />
                <Stat label="Rest/Free" value={formatDuration(itinerary.totals.rest)} />
              </div>
              <div className="grid lg:grid-cols-[1fr_400px] gap-4">
                <div className="rounded-2xl border border-border/60 bg-card p-4"><ItineraryTimeline days={itinerary.days} /></div>
                <div className="rounded-2xl overflow-hidden border border-border/60 h-80 lg:h-auto min-h-[400px]"><MapView markers={markers} route={route} height="100%" /></div>
              </div>
              <button onClick={save} disabled={saving} className="w-full py-3 rounded-xl bg-emerald-600 text-white font-semibold flex items-center justify-center gap-2 hover:bg-emerald-700 disabled:opacity-50"><Save className="w-5 h-5" /> {saving ? "Saving…" : "Save This Trip"}</button>
            </>
          )}
        </div>
      </div>
      <style>{`.input{width:100%;padding:0.5rem 0.75rem;border:1px solid hsl(var(--border));border-radius:0.5rem;background:hsl(var(--background));font-size:0.875rem}`}</style>
    </div>
  );
}

function Field({ label, children }) {
  return <div><label className="text-xs text-muted-foreground">{label}</label><div className="mt-1">{children}</div></div>;
}
function Stat({ label, value }) {
  return <div className="p-3 rounded-xl bg-sky-50 border border-sky-200 text-center"><div className="text-lg font-bold text-sky-800">{value}</div><div className="text-xs text-sky-700">{label}</div></div>;
}