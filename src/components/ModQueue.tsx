"use client";

import { useState, useEffect } from "react";
import { CATEGORY_META } from "@/lib/campuses";
import type { Category } from "@/lib/types";

export interface FlaggedPost {
  id: string;
  body: string;
  campus_slug: string;
  category: Category;
  created_at: string;
  user_id: string;
}

export interface ReportRow {
  id: string;
  post_id: string;
  reason: string;
  created_at: string;
  post: {
    id: string;
    body: string;
    campus_slug: string;
    category: Category;
    user_id: string;
    status: string;
  } | null;
}

const wrap = { maxWidth: 640, margin: "0 auto", padding: "32px 20px 80px", fontFamily: "var(--body)" } as const;
const card = {
  border: "var(--bd)",
  borderRadius: 14,
  background: "var(--paper)",
  boxShadow: "var(--hard-sm)",
  padding: 16,
  marginBottom: 12,
} as const;
const btn = (bg: string) =>
  ({
    border: "var(--bd)",
    borderRadius: 10,
    background: bg,
    color: "var(--ink)",
    fontFamily: "var(--disp)",
    fontWeight: 600,
    fontSize: 13,
    padding: "7px 14px",
    cursor: "pointer",
  }) as const;

export function ModQueue({
  flagged,
  reports,
  adminEmail,
}: {
  flagged: FlaggedPost[];
  reports: ReportRow[];
  adminEmail: string;
}) {
  const [flaggedList, setFlaggedList] = useState(flagged);
  const [reportList, setReportList] = useState(reports);
  const [busy, setBusy] = useState<string | null>(null);

  async function decide(postId: string, action: "approve" | "reject") {
    setBusy(postId);
    try {
      await fetch("/api/mod/decision", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ post_id: postId, action }),
      });
      setFlaggedList((l) => l.filter((p) => p.id !== postId));
      setReportList((l) => l.filter((r) => r.post_id !== postId));
    } finally {
      setBusy(null);
    }
  }

  async function ban(userId: string, campus: string, postId: string) {
    if (!confirm(`Ban this user from ${campus}? This is permanent until lifted.`)) return;
    setBusy(postId);
    try {
      await fetch("/api/mod/ban", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id: userId, campus }),
      });
      // Also reject the offending post.
      await fetch("/api/mod/decision", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ post_id: postId, action: "reject" }),
      });
      setFlaggedList((l) => l.filter((p) => p.id !== postId));
      setReportList((l) => l.filter((r) => r.post_id !== postId));
    } finally {
      setBusy(null);
    }
  }

  return (
    <main style={wrap}>
      <h1 style={{ fontFamily: "var(--disp)", fontSize: 30, margin: "0 0 2px" }}>Moderation</h1>
      <p style={{ opacity: 0.6, margin: "0 0 24px", fontSize: 13 }}>Signed in as {adminEmail}</p>

      <h2 style={{ fontFamily: "var(--disp)", fontSize: 18 }}>
        Flagged posts ({flaggedList.length})
      </h2>
      {flaggedList.length === 0 && <p style={{ opacity: 0.6, fontSize: 14 }}>Nothing flagged. Clear.</p>}
      {flaggedList.map((p) => (
        <div key={p.id} style={card}>
          <Tag category={p.category} campus={p.campus_slug} />
          <p style={{ fontSize: 15, lineHeight: 1.4, margin: "8px 0 12px" }}>{p.body}</p>
          <Actions
            busy={busy === p.id}
            onApprove={() => decide(p.id, "approve")}
            onReject={() => decide(p.id, "reject")}
            onBan={() => ban(p.user_id, p.campus_slug, p.id)}
          />
        </div>
      ))}

      <h2 style={{ fontFamily: "var(--disp)", fontSize: 18, marginTop: 32 }}>
        Open reports ({reportList.length})
      </h2>
      {reportList.length === 0 && <p style={{ opacity: 0.6, fontSize: 14 }}>No open reports.</p>}
      {reportList.map((r) => (
        <div key={r.id} style={card}>
          <div style={{ fontSize: 12, fontWeight: 600, color: "#c0392b", marginBottom: 6 }}>
            Reported: {r.reason}
          </div>
          {r.post ? (
            <>
              <Tag category={r.post.category} campus={r.post.campus_slug} />
              <p style={{ fontSize: 15, lineHeight: 1.4, margin: "8px 0 12px" }}>{r.post.body}</p>
              <Actions
                busy={busy === r.post_id}
                onApprove={() => decide(r.post_id, "approve")}
                onReject={() => decide(r.post_id, "reject")}
                onBan={() => ban(r.post!.user_id, r.post!.campus_slug, r.post_id)}
              />
            </>
          ) : (
            <p style={{ opacity: 0.6, fontSize: 13 }}>Post was deleted.</p>
          )}
        </div>
      ))}
    </main>
  );
}

function Tag({ category, campus }: { category: Category; campus: string }) {
  const cat = CATEGORY_META[category];
  return (
    <span style={{ display: "inline-flex", gap: 8, alignItems: "center", fontSize: 11, fontWeight: 700 }}>
      <span
        style={{
          background: cat.color,
          border: "2px solid var(--ink)",
          borderRadius: 6,
          padding: "2px 8px",
        }}
      >
        {cat.label}
      </span>
      <span style={{ opacity: 0.5, textTransform: "uppercase", letterSpacing: "0.04em" }}>{campus}</span>
    </span>
  );
}

function Actions({
  busy,
  onApprove,
  onReject,
  onBan,
}: {
  busy: boolean;
  onApprove: () => void;
  onReject: () => void;
  onBan: () => void;
}) {
  return (
    <div style={{ display: "flex", gap: 8, opacity: busy ? 0.5 : 1, pointerEvents: busy ? "none" : "auto" }}>
      <button type="button" style={btn("var(--shoutout)")} onClick={onApprove}>
        Approve
      </button>
      <button type="button" style={btn("var(--callout)")} onClick={onReject}>
        Reject
      </button>
      <button type="button" style={btn("var(--rant)")} onClick={onBan}>
        Ban user
      </button>
    </div>
  );
}

export function InviteManager() {
  const [codes,  setCodes]  = useState<string[]>([]);
  const [count,  setCount]  = useState(10);
  const [busy,   setBusy]   = useState(false);
  const [copied, setCopied] = useState<string | null>(null);

  async function load() {
    const res = await fetch("/api/mod/invites");
    const d   = await res.json() as { codes: string[] };
    setCodes(d.codes);
  }

  async function generate() {
    setBusy(true);
    const res  = await fetch("/api/mod/invites", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ count }),
    });
    const d = await res.json() as { codes: string[] };
    setCodes((prev) => [...d.codes, ...prev]);
    setBusy(false);
  }

  async function copyAll() {
    await navigator.clipboard.writeText(codes.join("\n"));
    setCopied("all");
    setTimeout(() => setCopied(null), 1800);
  }

  useEffect(() => { void load(); }, []);

  return (
    <div style={{ marginTop: 40 }}>
      <h2 style={{ fontFamily: "var(--disp)", fontSize: 18 }}>
        Invite codes ({codes.length} unredeemed)
      </h2>
      <div style={{ display: "flex", gap: 10, alignItems: "center", marginBottom: 16, flexWrap: "wrap" }}>
        <input
          type="number"
          value={count}
          min={1}
          max={200}
          onChange={(e) => setCount(+e.target.value)}
          style={{ width: 70, border: "var(--bd)", borderRadius: 8, padding: "7px 10px", fontFamily: "var(--disp)", fontSize: 14 }}
        />
        <button type="button" style={btn("var(--shoutout)")} disabled={busy} onClick={() => void generate()}>
          {busy ? "Generating…" : "Generate codes"}
        </button>
        {codes.length > 0 && (
          <button type="button" style={btn("var(--info)")} onClick={() => void copyAll()}>
            {copied === "all" ? "Copied!" : "Copy all"}
          </button>
        )}
      </div>
      {codes.length > 0 && (
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
          {codes.map((c) => (
            <span key={c} style={{ fontFamily: "monospace", fontWeight: 700, fontSize: 15, letterSpacing: "0.1em", background: "var(--callout)", border: "var(--bd)", borderRadius: 8, padding: "4px 10px", cursor: "pointer" }}
              onClick={() => { void navigator.clipboard.writeText(c); setCopied(c); setTimeout(() => setCopied(null), 1200); }}>
              {c}{copied === c ? " ✓" : ""}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
