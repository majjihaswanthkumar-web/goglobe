import React, { useEffect, useState } from "react";
import { Languages, Loader2, Volume2 } from "lucide-react";
import { base44 } from "@/api/base44Client";

const GROUPS = [
  {
    title: "Indian Languages",
    langs: [
      { code: "Hindi", native: "हिन्दी" },
      { code: "Bengali", native: "বাংলা" },
      { code: "Telugu", native: "తెలుగు" },
      { code: "Marathi", native: "मराठी" },
      { code: "Tamil", native: "தமிழ்" },
      { code: "Urdu", native: "اردو" },
      { code: "Gujarati", native: "ગુજરાતી" },
      { code: "Kannada", native: "ಕನ್ನಡ" },
      { code: "Odia", native: "ଓଡ଼ିଆ" },
      { code: "Malayalam", native: "മലയാളം" },
      { code: "Punjabi", native: "ਪੰਜਾਬੀ" },
      { code: "Assamese", native: "অসমীয়া" },
      { code: "Maithili", native: "मैथिली" },
      { code: "Nepali", native: "नेपाली" },
      { code: "Konkani", native: "कोंकणी" },
      { code: "Sanskrit", native: "संस्कृतम्" },
    ],
  },
  {
    title: "International Languages",
    langs: [
      { code: "English", native: "English" },
      { code: "Spanish", native: "Español" },
      { code: "French", native: "Français" },
      { code: "German", native: "Deutsch" },
      { code: "Italian", native: "Italiano" },
      { code: "Portuguese", native: "Português" },
      { code: "Dutch", native: "Nederlands" },
      { code: "Russian", native: "Русский" },
      { code: "Greek", native: "Ελληνικά" },
      { code: "Turkish", native: "Türkçe" },
      { code: "Arabic", native: "العربية" },
      { code: "Hebrew", native: "עברית" },
      { code: "Persian", native: "فارسی" },
      { code: "Chinese", native: "中文" },
      { code: "Japanese", native: "日本語" },
      { code: "Korean", native: "한국어" },
      { code: "Thai", native: "ไทย" },
      { code: "Vietnamese", native: "Tiếng Việt" },
      { code: "Indonesian", native: "Bahasa Indonesia" },
      { code: "Swahili", native: "Kiswahili" },
    ],
  },
];

const QUICK = ["Where is the railway station?", "How much does this cost?", "I need help.", "Where is the hotel?", "Thank you", "Hello"];

// BCP-47 codes so the voice reads the translation in the correct language.
const SPEECH = {
  Hindi: "hi-IN", Bengali: "bn-IN", Telugu: "te-IN", Marathi: "mr-IN", Tamil: "ta-IN",
  Urdu: "ur-IN", Gujarati: "gu-IN", Kannada: "kn-IN", Odia: "or-IN", Malayalam: "ml-IN",
  Punjabi: "pa-IN", Assamese: "as-IN", Maithili: "mai-IN", Nepali: "ne-NP", Konkani: "kok-IN",
  Sanskrit: "sa-IN", English: "en-US", Spanish: "es-ES", French: "fr-FR", German: "de-DE",
  Italian: "it-IT", Portuguese: "pt-PT", Dutch: "nl-NL", Russian: "ru-RU", Greek: "el-GR",
  Turkish: "tr-TR", Arabic: "ar-SA", Hebrew: "he-IL", Persian: "fa-IR", Chinese: "zh-CN",
  Japanese: "ja-JP", Korean: "ko-KR", Thai: "th-TH", Vietnamese: "vi-VN", Indonesian: "id-ID",
  Swahili: "sw-KE",
};

export default function TranslationAssistant() {
  const [lang, setLang] = useState("Hindi");
  const [text, setText] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [voices, setVoices] = useState([]);

  useEffect(() => {
    const loadVoices = () => setVoices(window.speechSynthesis?.getVoices?.() || []);
    loadVoices();
    window.speechSynthesis?.addEventListener?.("voiceschanged", loadVoices);
    return () => window.speechSynthesis?.removeEventListener?.("voiceschanged", loadVoices);
  }, []);

  const translate = async (t) => {
    const phrase = t ?? text;
    if (!phrase.trim()) return;
    if (t) setText(t);
    setLoading(true);
    setResult(null);
    try {
      const res = await base44.functions.invoke("ai-assistant", {
        message: `Translate the following English sentence into ${lang}. Reply ONLY with JSON: {"translation": "...", "pronunciation": "romanized pronunciation", "english_meaning": "..."}. Sentence: "${phrase}"`,
      });
      let parsed;
      try { parsed = JSON.parse(res.data.reply); } catch { parsed = { translation: res.data.reply }; }
      setResult({ ...parsed, phrase });
      if (parsed?.translation) speak(parsed.translation);
    } catch (e) {
      setResult({ translation: "Translation unavailable", phrase });
    } finally {
      setLoading(false);
    }
  };

  const speak = (t) => {
    try {
      if (!t || !("speechSynthesis" in window)) return;
      window.speechSynthesis.cancel();
      const code = SPEECH[lang] || "en-US";
      const u = new SpeechSynthesisUtterance(t);
      u.lang = code;
      const base = code.split("-")[0].toLowerCase();
      const voice =
        voices.find((v) => v.lang?.toLowerCase() === code.toLowerCase()) ||
        voices.find((v) => v.lang?.toLowerCase().startsWith(base));
      if (voice) u.voice = voice;
      u.rate = 0.9;
      window.speechSynthesis.speak(u);
    } catch {}
  };

  return (
    <div className="space-y-4">
      <div className="space-y-3">
        {GROUPS.map((g) => (
          <div key={g.title}>
            <div className="text-xs font-medium text-muted-foreground mb-1.5">{g.title} · {g.langs.length}</div>
            <div className="flex flex-wrap gap-2 max-h-28 overflow-y-auto pr-1">
              {g.langs.map((l) => (
                <button key={l.code} onClick={() => setLang(l.code)} className={`px-3 py-1.5 rounded-full text-sm border transition ${lang === l.code ? "bg-sky-600 text-white border-sky-600" : "bg-card border-border hover:bg-accent"}`}>
                  {l.native} <span className="text-xs opacity-70">{l.code}</span>
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
      <div className="flex gap-2">
        <input value={text} onChange={(e) => setText(e.target.value)} onKeyDown={(e) => e.key === "Enter" && translate()} placeholder="Type a phrase to translate…" className="flex-1 px-3 py-2.5 rounded-lg border border-border bg-background text-sm" />
        <button onClick={() => translate()} disabled={loading} className="px-4 py-2.5 rounded-lg bg-sky-600 text-white font-medium hover:bg-sky-700 disabled:opacity-50 flex items-center gap-2">
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Languages className="w-4 h-4" />} Translate
        </button>
      </div>
      <div className="flex flex-wrap gap-2">
        {QUICK.map((q) => (
          <button key={q} onClick={() => translate(q)} className="px-3 py-1.5 rounded-full text-xs bg-accent hover:bg-sky-100 text-foreground border border-border/60">{q}</button>
        ))}
      </div>
      {result && (
        <div className="rounded-2xl border border-sky-200 bg-sky-50 p-4">
          <div className="text-xs text-muted-foreground">{result.phrase} → {lang}</div>
          <div className="text-2xl font-display font-semibold mt-1 flex items-center gap-2">
            {result.translation}
            <button onClick={() => speak(result.translation)} title={`Listen in ${lang}`} aria-label={`Listen in ${lang}`} className="text-sky-700 hover:text-sky-900"><Volume2 className="w-5 h-5" /></button>
          </div>
          {result.pronunciation && <div className="text-sm text-muted-foreground mt-1">Pronunciation: {result.pronunciation}</div>}
          {result.english_meaning && <div className="text-sm text-muted-foreground">Meaning: {result.english_meaning}</div>}
        </div>
      )}
    </div>
  );
}