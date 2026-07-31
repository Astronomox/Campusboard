"use client";
import { useState, useEffect } from "react";
import { AdminShell } from "@/components/ui/AdminShell";

interface Word { id: string; pattern: string; created_at: string }

export default function WordlistPage() {
  const [words,   setWords]   = useState<Word[]>([]);
  const [pattern, setPattern] = useState("");
  const [busy,    setBusy]    = useState(false);

  async function load() {
    const res = await fetch("/api/mod/wordlist");
    const d   = await res.json() as { words: Word[] };
    setWords(d.words ?? []);
  }
  async function add() {
    if (!pattern.trim()) return;
    setBusy(true);
    await fetch("/api/mod/wordlist", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ pattern: pattern.trim() }) });
    setPattern("");
    setBusy(false);
    void load();
  }
  async function remove(id: string) {
    await fetch(`/api/mod/wordlist?id=${id}`, { method: "DELETE" });
    void load();
  }

  useEffect(() => { void load(); }, []);

  return (
    <AdminShell title="Pre-filter wordlist" current="/mod/content/wordlist">
      <p style={{ fontFamily: "var(--disp)", opacity: 0.6, marginBottom: 16, fontSize: 13 }}>
        Patterns here are matched before Gemini — zero cost, instant rejection.
      </p>
      <div style={{ display: "flex", gap: 10, marginBottom: 20 }}>
        <input className="ainput" style={{ flex: 1 }} value={pattern} onChange={(e) => setPattern(e.target.value)} placeholder="Regex or plain text" onKeyDown={(e) => { if (e.key === "Enter") void add(); }} />
        <button type="button" className="post-btn press" disabled={busy} onClick={() => void add()}>Add</button>
      </div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
        {words.map((w) => (
          <span key={w.id} style={{ fontFamily: "monospace", fontSize: 13, background: "var(--rant)", border: "var(--bd)", borderRadius: 8, padding: "5px 12px", display: "flex", alignItems: "center", gap: 8 }}>
            {w.pattern}
            <button type="button" onClick={() => void remove(w.id)} style={{ background: "none", border: "none", cursor: "pointer", fontWeight: 700, fontSize: 14 }}>×</button>
          </span>
        ))}
      </div>
    </AdminShell>
  );
}
