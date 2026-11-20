import React from "react";
import { FLAGS, formatMoney } from "@/components/currency/currencyMeta";

export default function RateGrid({ base, amount, rates, onPick }) {
  const entries = Object.entries(rates || {});
  if (!entries.length) return null;

  return (
    <div>
      <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-2">
        {formatMoney(amount, base)} in other currencies
      </p>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
        {entries.map(([code, value]) => (
          <button
            key={code}
            type="button"
            onClick={() => onPick(code)}
            className="text-left rounded-xl border border-border/70 bg-background px-3 py-2 hover:border-primary/40 hover:bg-primary/5 transition-colors"
          >
            <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
              <span>{FLAGS[code]}</span>
              <span className="font-semibold">{code}</span>
            </div>
            <div className="font-semibold text-sm text-foreground mt-0.5 truncate">{formatMoney(value, code)}</div>
          </button>
        ))}
      </div>
    </div>
  );
}