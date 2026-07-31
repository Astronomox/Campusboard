"use client";
import { useState, use } from "react";
import { useRouter } from "next/navigation";
import { Backdrop } from "@/components/Backdrop";
import { PageShell } from "@/components/ui/PageShell";

const REASONS = [
  "Spam",
  "Harassment",
  "Hate speech",
  "Misinformation",
  "Threatens someone",
  "Other",
];

export default function ReportPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router  = useRouter();
  const [reason, setReason] = useState(REASONS[0]);
  const [busy,   setBusy]   = useState(false);
  const [done,   setDone]   = useState(false);

  async function submit() {
    setBusy(true);
    await fetch("/api/report", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ post_id: id, reason }),
    });
    setDone(true);
    setBusy(false);
    setTimeout(() => router.back(), 1400);
  }

  return (
    <>
      <Backdrop />
      <PageShell title="Report post" back={`/post/${id}`}>
        {done ? (
          <div className="empty">
            <div className="box grain" style={{ fontSize: 24 }}>✓</div>
            <h3>Reported</h3>
            <p>Thanks. Moderators will review this post.</p>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <p style={{ fontFamily: "var(--disp)", fontSize: 15, margin: 0 }}>
              Why are you reporting this?
            </p>
            <div className="pills">
              {REASONS.map((r) => (
                <button
                  key={r}
                  type="button"
                  className="pill press"
                  onClick={() => setReason(r)}
                  style={{
                    background: reason === r ? "var(--rant)" : "var(--paper)",
                    boxShadow: reason === r ? "var(--hard)" : "var(--hard-sm)",
                  }}
                >
                  {r}
                </button>
              ))}
            </div>
            <button
              type="button"
              className="post-btn press"
              disabled={busy}
              onClick={() => void submit()}
            >
              {busy ? "Sending…" : "Submit report"}
            </button>
          </div>
        )}
      </PageShell>
    </>
  );
}
