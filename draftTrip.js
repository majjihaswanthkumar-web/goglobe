// Lightweight localStorage-based draft trip builder (no auth required)
const KEY = "wtg_draft_trip";

export function getDraft() {
  try {
    return JSON.parse(localStorage.getItem(KEY)) || { destinations: [] };
  } catch {
    return { destinations: [] };
  }
}

export function saveDraft(draft) {
  localStorage.setItem(KEY, JSON.stringify(draft));
  window.dispatchEvent(new CustomEvent("wtg-draft-change"));
}

export function addToDraft(destination) {
  const d = getDraft();
  if (d.destinations.find((x) => x.destinationId === destination.id)) return false;
  d.destinations.push({
    destinationId: destination.id,
    name: destination.name,
    slug: destination.slug,
    priority: "Must Visit",
    order: d.destinations.length,
    latitude: destination.latitude,
    longitude: destination.longitude,
    recommendedDurationMinutes: destination.recommendedDurationMinutes || 120,
    categories: destination.categories,
    city: destination.city,
    state: destination.state,
    country: destination.country,
  });
  saveDraft(d);
  return true;
}

export function removeFromDraft(id) {
  const d = getDraft();
  d.destinations = d.destinations.filter((x) => x.destinationId !== id).map((x, i) => ({ ...x, order: i }));
  saveDraft(d);
}

export function reorderDraft(destinations) {
  saveDraft({ destinations: destinations.map((x, i) => ({ ...x, order: i })) });
}

export function setPriority(id, priority) {
  const d = getDraft();
  const it = d.destinations.find((x) => x.destinationId === id);
  if (it) { it.priority = priority; saveDraft(d); }
}

export function clearDraft() {
  saveDraft({ destinations: [] });
}