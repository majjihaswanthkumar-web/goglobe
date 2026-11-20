export const CURRENCY_META = {
  USD: { name: "US Dollar", symbol: "$", flag: "🇺🇸" },
  EUR: { name: "Euro", symbol: "€", flag: "🇪🇺" },
  GBP: { name: "British Pound", symbol: "£", flag: "🇬🇧" },
  INR: { name: "Indian Rupee", symbol: "₹", flag: "🇮🇳" },
  JPY: { name: "Japanese Yen", symbol: "¥", flag: "🇯🇵" },
  AED: { name: "UAE Dirham", symbol: "د.إ", flag: "🇦🇪" },
  THB: { name: "Thai Baht", symbol: "฿", flag: "🇹🇭" },
  SGD: { name: "Singapore Dollar", symbol: "S$", flag: "🇸🇬" },
  AUD: { name: "Australian Dollar", symbol: "A$", flag: "🇦🇺" },
  CHF: { name: "Swiss Franc", symbol: "Fr", flag: "🇨🇭" },
  BRL: { name: "Brazilian Real", symbol: "R$", flag: "🇧🇷" },
  EGP: { name: "Egyptian Pound", symbol: "E£", flag: "🇪🇬" },
  MVR: { name: "Maldivian Rufiyaa", symbol: "Rf", flag: "🇲🇻" },
  TRY: { name: "Turkish Lira", symbol: "₺", flag: "🇹🇷" },
  KRW: { name: "South Korean Won", symbol: "₩", flag: "🇰🇷" },
  CNY: { name: "Chinese Yuan", symbol: "¥", flag: "🇨🇳" },
  CAD: { name: "Canadian Dollar", symbol: "C$", flag: "🇨🇦" },
  ZAR: { name: "South African Rand", symbol: "R", flag: "🇿🇦" },
};

export const CURRENCY_CODES = Object.keys(CURRENCY_META);

export const FLAGS = Object.fromEntries(CURRENCY_CODES.map((c) => [c, CURRENCY_META[c].flag]));

export const POPULAR_TARGETS = ["INR", "USD", "EUR", "GBP", "JPY", "AED", "THB", "AUD"];

export function formatMoney(value, code) {
  const n = Number(value);
  if (!Number.isFinite(n)) return "—";
  try {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: code,
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(n);
  } catch {
    return `${CURRENCY_META[code]?.symbol || ""}${n.toLocaleString()}`;
  }
}