import React, { useState, useRef, useEffect } from "react";
import { Sparkles, Send, Loader2 } from "lucide-react";
import { base44 } from "@/api/base44Client";

const SUGGESTIONS = [
  "What can I visit in Kerala in 5 days?",
  "Plan a 7-day Rajasthan trip.",
  "What food should I try in Hyderabad?",
  "How do I say thank you in Japanese?",
  "What is the currency of Thailand?",
  "What can I visit near the Taj Mahal?",
];

export default function Assistant() {
  const [messages, setMessages] = useState([{ role: "assistant", text: "Ask me anything about travel — destinations, food, culture, itineraries, or translations." }]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const ref = useRef(null);

  useEffect(() => { ref.current?.scrollTo({ top: ref.current.scrollHeight, behavior: "smooth" }); }, [messages, loading]);

  const send = async (t) => {
    const text = (t ?? input).trim();
    if (!text || loading) return;
    setInput("");
    setMessages((m) => [...m, { role: "user", text }]);
    setLoading(true);
    try {
      const res = await base44.functions.invoke("ai-assistant", { message: text });
      setMessages((m) => [...m, { role: "assistant", text: res.data.reply || "Sorry, I couldn't process that." }]);
    } catch {
      setMessages((m) => [...m, { role: "assistant", text: "Assistant unavailable right now." }]);
    } finally { setLoading(false); }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="font-display font-bold text-3xl mb-1 flex items-center gap-2"><Sparkles className="w-7 h-7 text-sky-600" /> AI Travel Assistant</h1>
      <p className="text-muted-foreground mb-6">Your personal travel expert, grounded in real destination data.</p>
      <div ref={ref} className="h-[55vh] overflow-y-auto p-4 rounded-2xl border border-border/60 bg-card space-y-3 mb-4">
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
            <div className={`max-w-[85%] px-3 py-2 rounded-2xl text-sm ${m.role === "user" ? "bg-sky-600 text-white rounded-br-sm" : "bg-accent text-foreground rounded-bl-sm"}`}>{m.text}</div>
          </div>
        ))}
        {loading && <div className="flex justify-start"><div className="bg-accent px-3 py-2 rounded-2xl rounded-bl-sm"><Loader2 className="w-4 h-4 animate-spin" /></div></div>}
      </div>
      <div className="flex flex-wrap gap-2 mb-3">
        {SUGGESTIONS.map((s) => <button key={s} onClick={() => send(s)} className="px-3 py-1.5 rounded-full text-xs bg-accent border border-border/60 hover:bg-sky-100">{s}</button>)}
      </div>
      <div className="flex gap-2">
        <input value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key === "Enter" && send()} placeholder="Ask a travel question…" className="flex-1 px-3 py-2.5 rounded-lg border border-border bg-card text-sm" />
        <button onClick={() => send()} disabled={loading} className="px-4 py-2.5 rounded-lg bg-sky-600 text-white hover:bg-sky-700 disabled:opacity-50"><Send className="w-4 h-4" /></button>
      </div>
    </div>
  );
}