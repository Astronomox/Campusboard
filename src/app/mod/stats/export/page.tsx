"use client";
import { AdminShell } from "@/components/ui/AdminShell";

export default function ExportPage() {
  async function download() {
    const res = await fetch("/api/mod/stats-export");
    const text = await res.text();
    const blob = new Blob([text], { type: "text/csv" });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement("a");
    a.href = url; a.download = "campusboard-stats.csv"; a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <AdminShell title="Export stats" current="/mod/stats">
      <p style={{ fontFamily: "var(--disp)", marginBottom: 16 }}>Download a CSV snapshot of board metrics.</p>
      <button type="button" className="post-btn press" onClick={() => void download()}>Download CSV</button>
    </AdminShell>
  );
}
