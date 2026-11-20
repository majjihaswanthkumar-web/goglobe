import React, { useState, useRef, useEffect } from "react";
import { Sparkles, Send, X, Loader2 } from "lucide-react";
import { base44 } from "@/api/base44Client";

export default function AIAssistant({ open, onClose, context }) {
  const [messages, setMessages] = useState([
    { role: "assistant", text: "Hi! I'm your GoGlobe assistant. Ask me about destinations, food, culture, or modifying your trip." },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, loading]);

  const send = async () => {
    if (!input.trim() || loading) return;
    const text = input.trim();
    setMessages((m) => [...m, { role: "user", text }]);
    setInput("");
    setLoading(true);
    try {
      const res = await base44.functions.invoke("ai-assistant", { message: text, context });
      setMessages((m) => [...m, { role: "assistant", text: res.data.reply || "Sorry, I couldn't process that." }]);
    } catch (e) {
      setMessages((m) => [...m, { role: "assistant", text: "Sorry, the assistant is unavailable right now." }]);
    } finally {
      setLoading(false);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative w-full max-w-md h-full bg-card shadow-2xl flex flex-col animate-in slide-in-from-right">
        <div className="flex items-center justify-between p-4 border-b bg-gradient-to-r from-sky-600 to-blue-700 text-white">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5" />
            <span className="font-display font-semibold">AI Travel Assistant</span>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-white/20 rounded-lg"><X className="w-5 h-5" /></button>
        </div>
        <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-3">
          {messages.map((m, i) => (
            <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
              <div className={`max-w-[85%] px-3 py-2 rounded-2xl text-sm ${m.role === "user" ? "bg-sky-600 text-white rounded-br-sm" : "bg-accent text-foreground rounded-bl-sm"}`}>
                {m.text}
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex justify-start"><div className="bg-accent px-3 py-2 rounded-2xl rounded-bl-sm"><Loader2 className="w-4 h-4 animate-spin" /></div></div>
          )}
        </div>
        <div className="p-3 border-t flex gap-2">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && send()}
            placeholder="Ask about destinations, food, culture..."
            className="flex-1 px-3 py-2 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
          />
          <button onClick={send} disabled={loading} className="px-3 py-2 rounded-lg bg-sky-600 text-white hover:bg-sky-700 disabled:opacity-50">
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}