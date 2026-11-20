import React from "react";
import { Globe2, Lightbulb } from "lucide-react";
import CurrencyConverter from "@/components/CurrencyConverter";

const PAIRS = [
  { from: "USD", to: "INR", amount: 100 },
  { from: "EUR", to: "INR", amount: 50 },
  { from: "USD", to: "JPY", amount: 100 },
  { from: "GBP", to: "THB", amount: 100 },
];

export default function Currency() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-primary via-teal-700 to-cyan-800 text-primary-foreground p-6 md:p-8 mb-6">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_80%_0%,rgba(255,255,255,0.28),transparent_55%)]" />
        <div className="relative">
          <span className="inline-flex items-center gap-2 text-[10px] font-semibold uppercase tracking-wider bg-white/15 border border-white/25 rounded-full px-3 py-1">
            <Globe2 className="w-3.5 h-3.5" /> Live exchange rates
          </span>
          <h1 className="font-display font-semibold text-3xl md:text-4xl mt-3">Currency Converter</h1>
          <p className="text-white/85 mt-2 max-w-lg text-sm md:text-base">
            Convert between 18 travel currencies and see your amount at a glance across the world's most-used currencies.
          </p>
        </div>
      </div>

      <CurrencyConverter initialFrom="USD" initialTo="INR" initialAmount={100} />

      <div className="flex items-center justify-between mt-10 mb-4">
        <h2 className="font-display font-semibold text-2xl">Popular conversions</h2>
        <span className="text-xs text-muted-foreground hidden sm:block">Tap "Converted to" to change the target</span>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        {PAIRS.map((p) => (
          <CurrencyConverter
            key={`${p.from}-${p.to}`}
            initialFrom={p.from}
            initialTo={p.to}
            initialAmount={p.amount}
            variant="compact"
          />
        ))}
      </div>

      <div className="mt-8 flex gap-3 rounded-2xl border border-border/70 bg-card p-4">
        <Lightbulb className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
        <p className="text-sm text-muted-foreground">
          Rates are indicative mid-market values refreshed by a free public API. Card networks, banks and money changers usually add a margin, so
          always confirm the final rate before a transaction.
        </p>
      </div>
    </div>
  );
}