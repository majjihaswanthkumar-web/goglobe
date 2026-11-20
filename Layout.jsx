import React, { useState } from "react";
import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import { Globe, Map, Compass, CalendarPlus, Sparkles, Menu, X, Plane, Wallet, Languages, Info, Utensils } from "lucide-react";
import AIAssistant from "@/components/AIAssistant";
import ContactBlock from "@/components/footer/ContactBlock";
import TeamCredits from "@/components/footer/TeamCredits";

const NAV = [
  { label: "Home", path: "/", icon: Globe },
  { label: "Explore", path: "/explore", icon: Compass },
  { label: "Food", path: "/food", icon: Utensils },
  { label: "Plan Trip", path: "/plan-trip", icon: CalendarPlus },
  { label: "Map", path: "/map", icon: Map },
  { label: "My Trips", path: "/my-trips", icon: Plane },
  { label: "Currency", path: "/currency", icon: Wallet },
  { label: "Translate", path: "/translate", icon: Languages },
  { label: "About", path: "/about", icon: Info },
];

export default function Layout() {
  const [open, setOpen] = useState(false);
  const [aiOpen, setAiOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const isActive = (p) => (p === "/" ? location.pathname === "/" : location.pathname.startsWith(p));

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <header className="sticky top-0 z-40 bg-background/85 backdrop-blur-md border-b border-border/60">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 font-display font-bold text-lg">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-teal-500 to-primary flex items-center justify-center text-white shadow-sm shadow-primary/30">
              <Globe className="w-5 h-5" />
            </div>
            <span className="text-foreground">GoGlobe</span>
          </Link>
          <nav className="hidden md:flex items-center gap-1">
            {NAV.map((n) => (
              <Link
                key={n.path}
                to={n.path}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${isActive(n.path) ? "text-primary bg-primary/10" : "text-muted-foreground hover:text-foreground hover:bg-accent"}`}
              >
                {n.label}
              </Link>
            ))}
          </nav>
          <div className="flex items-center gap-2">
            <button onClick={() => setAiOpen(true)} className="hidden sm:flex items-center gap-1.5 px-3 py-2 rounded-lg bg-gradient-to-r from-teal-600 to-primary text-white text-sm font-medium hover:opacity-90 transition">
              <Sparkles className="w-4 h-4" /> AI Assistant
            </button>
            <button onClick={() => setOpen(!open)} className="md:hidden p-2 rounded-lg hover:bg-accent">
              {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
        {open && (
          <div className="md:hidden border-t border-border/60 bg-white px-4 py-2 space-y-1">
            {NAV.map((n) => (
              <Link key={n.path} to={n.path} onClick={() => setOpen(false)} className={`flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm ${isActive(n.path) ? "text-primary bg-primary/10" : "text-foreground"}`}>
                <n.icon className="w-4 h-4" /> {n.label}
              </Link>
            ))}
          </div>
        )}
      </header>

      <main className="flex-1">
        <Outlet context={{ openAI: () => setAiOpen(true) }} />
      </main>

      <footer className="border-t border-border/60 bg-secondary/40 mt-12">
        <div className="max-w-7xl mx-auto px-4 py-10">
          <div className="grid gap-8 md:grid-cols-3">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-teal-500 to-primary flex items-center justify-center text-white">
                  <Globe className="w-4 h-4" />
                </div>
                <span className="font-display font-semibold text-foreground">GoGlobe</span>
              </div>
              <p className="text-sm text-muted-foreground">Explore the world. Plan smarter. Travel better.</p>
            </div>
            <ContactBlock />
            <TeamCredits />
          </div>
          <p className="mt-8 pt-6 border-t border-border/60 text-xs text-muted-foreground">
            Travel times are estimates based on straight-line distance. Weather &amp; currency via free public APIs. Always verify live details before traveling.
          </p>
        </div>
      </footer>

      <button onClick={() => setAiOpen(true)} className="sm:hidden fixed bottom-5 right-5 z-40 w-14 h-14 rounded-full bg-gradient-to-br from-sky-500 to-blue-700 text-white shadow-xl flex items-center justify-center">
        <Sparkles className="w-6 h-6" />
      </button>

      <AIAssistant open={aiOpen} onClose={() => setAiOpen(false)} />
    </div>
  );
}