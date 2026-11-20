import React from "react";
import TranslationAssistant from "@/components/TranslationAssistant";

export default function Translate() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="font-display font-bold text-3xl mb-1">Translation Assistant</h1>
      <p className="text-muted-foreground mb-6">Translate common travel phrases into local languages with pronunciation and audio.</p>
      <TranslationAssistant />
    </div>
  );
}