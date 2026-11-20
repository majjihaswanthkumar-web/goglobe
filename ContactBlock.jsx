import React, { useState } from "react";
import { Mail, Check, Copy } from "lucide-react";
import { CONTACT_EMAIL } from "@/data/team";

export default function ContactBlock() {
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
    <div>
      <h3 className="font-display font-semibold text-foreground text-xs uppercase tracking-wider mb-3">Contact us</h3>
      <p className="text-sm text-muted-foreground mb-3">
        Questions, corrections or a destination we should add? Write to us by email.
      </p>
      <a
        href={`mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent("GoGlobe")}`}
        className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition"
      >
        <Mail className="w-4 h-4" /> Email us
      </a>
      <div className="mt-2 flex items-center gap-1.5">
        <span className="text-xs text-muted-foreground break-all">{CONTACT_EMAIL}</span>
        <button onClick={copy} aria-label="Copy email address" className="p-1 rounded hover:bg-accent text-muted-foreground shrink-0">
          {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
        </button>
      </div>
    </div>
  );
}