import React, { useMemo } from "react";

// Google Maps embed (iframe) — no API key required.
// Shows a single pinned location; multi-marker/route features are not supported by the free embed.
export default function MapView({ markers = [], route = [], height = "100%", onSelect, className }) {
  const info = useMemo(() => {
    const valid = markers.filter(
      (m) => m.lat != null && m.lng != null && !Number.isNaN(+m.lat) && !Number.isNaN(+m.lng)
    );
    if (!valid.length) return null;
    const first = valid[0];
    const zoom = valid.length === 1 ? 14 : valid.length <= 5 ? 11 : 7;
    return { lat: first.lat, lng: first.lng, name: first.name, zoom };
  }, [markers]);

  if (!info) {
    return (
      <div
        className={`bg-muted flex items-center justify-center text-sm text-muted-foreground ${className || ""}`}
        style={{ height }}
      >
        No map data
      </div>
    );
  }

  const src = `https://maps.google.com/maps?q=${encodeURIComponent(`${info.lat},${info.lng}`)}&z=${info.zoom}&output=embed`;

  return (
    <iframe
      title={info.name || "Map"}
      src={src}
      loading="lazy"
      referrerPolicy="no-referrer-when-downgrade"
      style={{ height, width: "100%", border: 0, borderRadius: "inherit" }}
      className={className}
      allowFullScreen
    />
  );
}