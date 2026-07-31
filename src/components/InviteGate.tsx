"use client";

import { useState } from "react";

/**
 * Shown on the You tab when the user is signed in but not yet a member.
 * They enter their invite code here to gain access.
 */
export function InviteGate({ onVerified }: { onVerified: () => void }) {
  const [code, setCode]       = useState("");
  const [busy, setBusy]       = useState(false);
  const [error, setError]     = useState<string | null>(null);

  async function redeem() {
    const trimmed = code.trim().toUpperCase();
    if (!trimmed) return;
    setBusy(true);
    setError(null);
    try {
      const res  = await fetch("/api/invite/redeem", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: trimmed }),
      });
      const data = await res.json() as { ok?: boolean; error?: string; already?: boolean };
      if (data.ok) { onVerified(); return; }
      setError(data.error ?? "Invalid code.");
    } catch {
      setError("Network error. Try again.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="glass-gate grain">
      <div className="gate-icon">🎟️</div>
      <h2 className="gate-h">You need an invite</h2>
      <p className="gate-p">
        CampusBoard is invite-only. Get a code from a verified UNILAG student and
        enter it below to join the board.
      </p>

      <div className="gate-row">
        <input
          className="gate-input"
          value={code}
          onChange={(e) => setCode(e.target.value.toUpperCase())}
          placeholder="XXXXXXXX"
          maxLength={8}
          spellCheck={false}
          onKeyDown={(e) => { if (e.key === "Enter") void redeem(); }}
        />
        <button
          type="button"
          className="post-btn press"
          disabled={busy || code.trim().length < 6}
          onClick={() => void redeem()}
        >
          {busy ? "Checking…" : "Join"}
        </button>
      </div>

      {error && <p className="gate-err">{error}</p>}
    </div>
  );
}

/**
 * Shown when the user has invite credits to spend.
 */
export function InviteShare({ creditsLeft }: { creditsLeft: number }) {
  const [code, setCode]   = useState<string | null>(null);
  const [busy, setBusy]   = useState(false);
  const [copied, setCopied] = useState(false);

  async function generate() {
    setBusy(true);
    try {
      const res  = await fetch("/api/invite/generate", { method: "POST" });
      const data = await res.json() as { code?: string; error?: string };
      if (data.code) setCode(data.code);
    } finally { setBusy(false); }
  }

  async function copy() {
    if (!code) return;
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  }

  return (
    <div className="invite-share grain">
      <p className="invite-label">
        You have <strong>{creditsLeft}</strong> invite{creditsLeft !== 1 ? "s" : ""} to give out.
      </p>
      {!code ? (
        <button type="button" className="post-btn press" disabled={busy} onClick={() => void generate()}>
          {busy ? "Generating…" : "Generate invite code"}
        </button>
      ) : (
        <div className="code-row">
          <span className="code-display">{code}</span>
          <button type="button" className="post-btn press" onClick={() => void copy()}>
            {copied ? "Copied!" : "Copy"}
          </button>
        </div>
      )}
    </div>
  );
}
"// v1.0"  
