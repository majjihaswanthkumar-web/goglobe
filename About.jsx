import React, { useState } from "react";
import { Mail, Copy, Check, Users } from "lucide-react";
import { CONTACT_EMAIL, TEAM } from "@/data/team";
import ProjectDescription from "@/components/about/ProjectDescription";

const initials = (name) =>
  name
    .split(" ")
    .filter((w) => w.replace(/\./g, "").length > 1)
    .map((w) => w[0])
    .slice(0, 2)
    .join("");

export default function About() {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(CONTACT_EMAIL);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      /* clipboard unavailable */
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-primary via-teal-700 to-cyan-800 text-primary-foreground p-6 md:p-8">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_80%_0%,rgba(255,255,255,0.28),transparent_55%)]" />
        <div className="relative">
          <span className="inline-flex items-center gap-2 text-[10px] font-semibold uppercase tracking-wider bg-white/15 border border-white/25 rounded-full px-3 py-1">
            <Users className="w-3.5 h-3.5" /> About the project
          </span>
          <h1 className="font-display font-semibold text-3xl md:text-4xl mt-3">GoGlobe</h1>
          <p className="text-white/85 mt-2 max-w-xl text-sm md:text-base">
            A student-built travel companion for discovering destinations, understanding local culture and planning
            smarter itineraries. Reach us any time by email.
          </p>
        </div>
      </div>

      <ProjectDescription />

      <div className="grid gap-4 md:grid-cols-2 mt-6">
        <div className="rounded-3xl border border-border/70 bg-card p-6">
          <h2 className="font-display font-semibold text-xl mb-1">Contact us</h2>
          <p className="text-sm text-muted-foreground mb-4">
            Suggestions, corrections or a place we should add? Email is the fastest way to reach the team.
          </p>
          <a
            href={`mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent("GoGlobe")}`}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition"
          >
            <Mail className="w-4 h-4" /> Email us
          </a>
          <div className="mt-3 flex items-center gap-2 rounded-xl bg-secondary/60 border border-border/60 px-3 py-2">
            <span className="text-sm text-foreground break-all flex-1">{CONTACT_EMAIL}</span>
            <button
              onClick={copy}
              aria-label="Copy email address"
              className="p-1.5 rounded-lg hover:bg-accent text-muted-foreground shrink-0"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
            </button>
          </div>
        </div>

        <div className="rounded-3xl border border-border/70 bg-card p-6">
          <h2 className="font-display font-semibold text-xl mb-1">Built by</h2>
          <p className="text-sm text-muted-foreground mb-4">The team behind GoGlobe.</p>
          <ul className="space-y-2.5">
            {TEAM.map((m) => (
              <li key={m.pin} className="flex items-center gap-3 rounded-xl border border-border/60 bg-background px-3 py-2.5">
                <span className="w-9 h-9 rounded-full bg-gradient-to-br from-teal-500 to-primary text-white text-xs font-semibold flex items-center justify-center shrink-0">
                  {initials(m.name)}
                </span>
                <div className="min-w-0 flex-1">
                  <div className="text-sm font-semibold text-foreground truncate">{m.name}</div>
                  <div className="font-mono text-[11px] text-muted-foreground">{m.pin}</div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}