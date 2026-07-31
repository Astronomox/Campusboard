"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { AdminShell } from "@/components/ui/AdminShell";

export default function NewBanPage() {
  const router = useRouter();
  const [userId, setUserId] = useState("");
  const [reason, setReason] = useState("");
  const [days,   setDays]   = useState("");
  const [busy,   setBusy]   = useState(false);
  const [error,  setError]  = useState<string | null>(null);

  async function submit() {
    if (!userId.trim()) return;
    setBusy(true);
    const res = await fetch("/api/mod/ban", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ user_id: userId.trim(), campus: "unilag", reason, days: days ? parseInt(days) : undefined }),
    });
    setBusy(false);
    if (res.ok) { router.push("/mod/bans"); } else { setError("Failed to ban user."); }
  }

  return (
    <AdminShell title="New ban" current="/mod/bans">
      <div className="aform">
        <div className="afield"><label>User ID (UUID)</label><input className="ainput" value={userId} onChange={(e) => setUserId(e.target.value)} placeholder="xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx" /></div>
        <div className="afield"><label>Reason</label><input className="ainput" value={reason} onChange={(e) => setReason(e.target.value)} placeholder="Reason for ban" /></div>
        <div className="afield"><label>Duration in days (leave blank for permanent)</label><input className="ainput" type="number" value={days} onChange={(e) => setDays(e.target.value)} placeholder="e.g. 30" /></div>
        {error && <p style={{ color: "#c0392b", fontFamily: "var(--disp)", fontSize: 13 }}>{error}</p>}
        <button type="button" className="post-btn press" style={{ background: "var(--rant)" }} disabled={busy} onClick={submit}>{busy ? "Banning…" : "Issue ban"}</button>
      </div>
    </AdminShell>
  );
}
