"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { AdminShell } from "@/components/ui/AdminShell";

export default function NewAnnouncementPage() {
  const router = useRouter();
  const [body, setBody]   = useState("");
  const [busy, setBusy]   = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submit() {
    if (!body.trim()) return;
    setBusy(true);
    const res = await fetch("/api/mod/announcement", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ body: body.trim() }),
    });
    setBusy(false);
    if (res.ok) { router.push("/mod/announcements"); } else { setError("Failed."); }
  }

  return (
    <AdminShell title="New announcement" current="/mod/announcements">
      <div className="aform">
        <div className="afield">
          <label>Message (shown at the top of the feed)</label>
          <textarea className="atextarea" value={body} onChange={(e) => setBody(e.target.value.slice(0, 500))} placeholder="Type your announcement…" rows={4} />
          <span style={{ fontFamily: "var(--disp)", fontSize: 12, opacity: 0.6 }}>{body.length}/500</span>
        </div>
        {error && <p style={{ color: "#c0392b", fontSize: 13 }}>{error}</p>}
        <button type="button" className="post-btn press" disabled={busy || !body.trim()} onClick={submit}>
          {busy ? "Publishing…" : "Publish announcement"}
        </button>
      </div>
    </AdminShell>
  );
}
