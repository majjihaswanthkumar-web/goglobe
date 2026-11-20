// Travel math + itinerary generation utilities (client-side)

export function haversineKm(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const toRad = (d) => (d * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(a));
}

// Estimate driving time from straight-line distance.
// Uses a road-network detour factor and an average mixed speed.
export function estimateTravel(lat1, lon1, lat2, lon2) {
  const straight = haversineKm(lat1, lon1, lat2, lon2);
  const roadDistance = straight * 1.3; // approximate road detour
  const avgSpeedKmh = 45; // mixed urban + highway
  const minutes = (roadDistance / avgSpeedKmh) * 60;
  return {
    distanceKm: Math.round(roadDistance),
    minutes: Math.max(5, Math.round(minutes)),
  };
}

export function formatDuration(minutes) {
  if (minutes < 60) return `${minutes} min`;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return m ? `${h}h ${m}m` : `${h}h`;
}

export function formatTime(totalMinutes) {
  const h = Math.floor(totalMinutes / 60) % 24;
  const m = totalMinutes % 60;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
}

const STYLE_FACTOR = {
  Relaxed: 0.75,
  Balanced: 1,
  "Fast-paced": 1.25,
  Adventure: 1.1,
  Family: 0.9,
  Couple: 0.9,
  Solo: 1.05,
  Luxury: 0.85,
  Budget: 1,
  Cultural: 1,
  Historical: 1,
  Nature: 0.95,
  Spiritual: 0.9,
  "Food-focused": 1,
};

// Greedy nearest-neighbor ordering from a start point.
export function optimizeOrder(dests, startLat, startLng) {
  if (!dests.length) return [];
  const remaining = [...dests];
  const ordered = [];
  let curLat = startLat ?? remaining[0].latitude;
  let curLng = startLng ?? remaining[0].longitude;
  while (remaining.length) {
    let bestIdx = 0;
    let bestDist = Infinity;
    for (let i = 0; i < remaining.length; i++) {
      const d = haversineKm(curLat, curLng, remaining[i].latitude, remaining[i].longitude);
      if (d < bestDist) {
        bestDist = d;
        bestIdx = i;
      }
    }
    const next = remaining.splice(bestIdx, 1)[0];
    ordered.push(next);
    curLat = next.latitude;
    curLng = next.longitude;
  }
  return ordered;
}

// Build a day-by-day itinerary from an ordered destination list.
export function generateItinerary(dests, { numDays, hoursPerDay, travelStyle, startLat, startLng }) {
  if (!dests.length || !numDays) return { days: [], totals: { sightseeing: 0, travel: 0, meal: 0, rest: 0, free: 0 } };

  const factor = STYLE_FACTOR[travelStyle] ?? 1;
  const dayBudgetMin = Math.round((hoursPerDay || 8) * 60 * factor);
  const ordered = optimizeOrder(dests, startLat, startLng);

  const days = [];
  let idx = 0;
  for (let day = 0; day < numDays && idx < ordered.length; day++) {
    const items = [];
    let clock = 8 * 60; // start 08:00
    let used = 0;

    // Breakfast
    items.push({ time: formatTime(clock), type: "meal", label: "Breakfast", durationMinutes: 30 });
    clock += 30;
    used += 30;

    let prevLat = startLat ?? ordered[idx].latitude;
    let prevLng = startLng ?? ordered[idx].longitude;
    let lunchPlaced = false;

    while (idx < ordered.length && used < dayBudgetMin) {
      const d = ordered[idx];
      const explore = d.recommendedDurationMinutes || 120;

      // travel segment
      const travel = estimateTravel(prevLat, prevLng, d.latitude, d.longitude);
      if (used + travel.minutes >= dayBudgetMin) break;

      items.push({
        time: formatTime(clock),
        type: "travel",
        label: `Travel to ${d.name}`,
        durationMinutes: travel.minutes,
        distanceKm: travel.distanceKm,
        from: prevLat === startLat ? "Start" : undefined,
      });
      clock += travel.minutes;
      used += travel.minutes;

      // lunch around 13:00
      if (!lunchPlaced && clock >= 12 * 60 + 30) {
        items.push({ time: formatTime(clock), type: "meal", label: "Lunch", durationMinutes: 60 });
        clock += 60;
        used += 60;
        lunchPlaced = true;
      }

      const exploreMin = Math.min(explore, dayBudgetMin - used);
      items.push({
        time: formatTime(clock),
        endTime: formatTime(clock + exploreMin),
        type: "explore",
        label: d.name,
        durationMinutes: exploreMin,
        destinationId: d.destinationId || d.id,
        latitude: d.latitude,
        longitude: d.longitude,
        city: d.city,
      });
      clock += exploreMin;
      used += exploreMin;
      prevLat = d.latitude;
      prevLng = d.longitude;
      idx++;

      if (used >= dayBudgetMin) break;
    }

    // evening return / hotel
    if (clock < 20 * 60) {
      items.push({ time: formatTime(clock), type: "rest", label: "Return to hotel / free time", durationMinutes: Math.max(30, 20 * 60 - clock) });
      clock = 20 * 60;
    }

    days.push({ day: day + 1, items });
  }

  const totals = { sightseeing: 0, travel: 0, meal: 0, rest: 0, free: 0 };
  days.forEach((d) =>
    d.items.forEach((it) => {
      if (it.type === "explore") totals.sightseeing += it.durationMinutes;
      else if (it.type === "travel") totals.travel += it.durationMinutes;
      else if (it.type === "meal") totals.meal += it.durationMinutes;
      else totals.rest += it.durationMinutes;
    })
  );

  return { days, totals, ordered };
}

export function slugify(s) {
  return String(s || "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}