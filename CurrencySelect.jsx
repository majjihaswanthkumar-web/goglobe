import React from "react";
import { ChevronDown } from "lucide-react";
import { CURRENCY_CODES, CURRENCY_META } from "@/components/currency/currencyMeta";

export default function CurrencySelect({ value, onChange }) {
  return (
    <div className="relative inline-flex items-center shrink-0">
      <span className="pointer-events-none absolute left-2.5 text-sm leading-none">{CURRENCY_META[value]?.flag}</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        aria-label="Currency"
        className="appearance-none pl-8 pr-7 py-1.5 rounded-lg border border-border bg-card text-sm font-semibold text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
      >
        {CURRENCY_CODES.map((code) => (
          <option key={code} value={code}>
            {code} · {CURRENCY_META[code].name}
          </option>
        ))}
      </select>
      <ChevronDown className="pointer-events-none absolute right-2 w-3.5 h-3.5 text-muted-foreground" />
    </div>
  );
}