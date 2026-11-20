import React from "react";
import { TEAM } from "@/data/team";

export default function TeamCredits() {
  return (
    <div>
      <h3 className="font-display font-semibold text-foreground text-xs uppercase tracking-wider mb-3">Built by</h3>
      <ul className="space-y-2">
        {TEAM.map((m) => (
          <li key={m.pin} className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1 text-sm">
            <span className="text-foreground font-medium">{m.name}</span>
            <span className="font-mono text-[11px] px-2 py-0.5 rounded-md bg-card border border-border/70 text-muted-foreground">
              {m.pin}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}