import React, { useEffect, useRef, useState } from "react";
import { ArrowDownUp, Loader2, RefreshCw, TrendingUp } from "lucide-react";
import { base44 } from "@/api/base44Client";
import CurrencySelect from "@/components/currency/CurrencySelect";
import RateGrid from "@/components/currency/RateGrid";
import { POPULAR_TARGETS, formatMoney } from "@/components/currency/currencyMeta";

const QUICK = [10, 50, 100, 500, 1000];

export default function CurrencyConverter({
  initialFrom = "USD",
  initialTo = "INR",
  initialAmount = 100,
  variant = "full",
}) {
  const compact = variant === "compact";
  const [from, setFrom] = useState(initialFrom);
  const [to, setTo] = useState(initialTo);
  const [amount, setAmount] = useState(String(initialAmount));
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState(null);
  const latest = useRef(0);

  const targets = POPULAR_TARGETS.filter((c) => c !== to && c !== from).slice(0, 6);

  const convert = async () => {
    const id = ++latest.current;
    setLoading(true);
    setErr(null);
    try {
      const res = await base44.functions.invoke("currency-convert", {
        from,
        to,
        amount: Number(amount) || 0,
        targets: compact ? [] : targets,
      });
      if (id === latest.current) setData(res.data);
    } catch (e) {
      if (id === latest.current) {
        setErr(e.response?.data?.error || "Couldn't reach the rate service. Try again in a moment.");
      }
    } finally {
      if (id === latest.current) setLoading(false);
    }
  };

  useEffect(() => {
    const t = setTimeout(convert, 300);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [from, to, amount]);

  const swap = () => {
    setFrom(to);
    setTo(from);
  };

  const value = data?.converted;

  return (
    <div
      className={`rounded-3xl border border-border/70 bg-card overflow-hidden ${
        compact ? "" : "shadow-[0_24px_60px_-30px_rgba(15,42,48,0.45)]"
      }`}
    >
      {!compact && (
        <div className="flex items-center justify-between px-5 py-3.5 bg-gradient-to-r from-primary via-teal-700 to-cyan-800 text-primary-foreground">
          <span className="flex items-center gap-2 text-sm font-semibold">
            <TrendingUp className="w-4 h-4" /> Live mid-market rates
          </span>
          <button
            onClick={convert}
            title="Refresh rates"
            className="p-1.5 rounded-full bg-white/15 hover:bg-white/25 transition-colors"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          </button>
        </div>
      )}

      <div className={compact ? "p-4" : "p-5"}>
        <div className="grid gap-3 sm:grid-cols-[1fr_auto_1fr] sm:items-center">
          <div className="rounded-2xl border border-border bg-background p-4">
            <div className="flex items-center justify-between gap-2">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Amount</span>
              <CurrencySelect value={from} onChange={setFrom} />
            </div>
            <input
              type="number"
              inputMode="decimal"
              min="0"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0"
              className={`mt-2 w-full bg-transparent outline-none font-display font-semibold text-foreground [appearance:textfield] ${
                compact ? "text-2xl" : "text-3xl"
              }`}
            />
          </div>

          <button
            onClick={swap}
            aria-label="Swap currencies"
            className="mx-auto p-2.5 rounded-full bg-primary text-primary-foreground hover:opacity-90 transition shadow-sm"
          >
            <ArrowDownUp className="w-4 h-4" />
          </button>

          <div className="rounded-2xl border border-primary/20 bg-primary/5 p-4">
            <div className="flex items-center justify-between gap-2">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-primary/80">Converted to</span>
              <CurrencySelect value={to} onChange={setTo} />
            </div>
            <div className="mt-2 min-h-[40px] flex items-center overflow-hidden">
              {loading && value == null ? (
                <Loader2 className="w-6 h-6 animate-spin text-primary" />
              ) : (
                <span className={`font-display font-semibold text-primary truncate ${compact ? "text-2xl" : "text-3xl"}`}>
                  {value != null ? formatMoney(value, to) : "—"}
                </span>
              )}
            </div>
          </div>
        </div>

        {!compact && (
          <div className="flex flex-wrap gap-2 mt-4">
            {QUICK.map((q) => (
              <button
                key={q}
                onClick={() => setAmount(String(q))}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-colors ${
                  Number(amount) === q
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-card border-border text-muted-foreground hover:border-primary/40 hover:text-foreground"
                }`}
              >
                {formatMoney(q, from)}
              </button>
            ))}
          </div>
        )}

        {data && (
          <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
            <span className="font-semibold text-foreground">
              1 {from} = {data.rate} {to}
            </span>
            <span>
              1 {to} = {(1 / data.rate).toFixed(4)} {from}
            </span>
            <span className="sm:ml-auto">
              Updated{" "}
              {new Date(data.updated).toLocaleDateString(undefined, { day: "numeric", month: "short" })}
            </span>
          </div>
        )}

        {err && (
          <div className="mt-3 rounded-xl border border-destructive/20 bg-destructive/10 px-3 py-2 text-xs text-destructive">
            {err}
          </div>
        )}
      </div>

      {!compact && data?.rates && (
        <div className="px-5 pb-5">
          <RateGrid base={from} amount={Number(amount) || 0} rates={data.rates} onPick={setTo} />
        </div>
      )}
    </div>
  );
}