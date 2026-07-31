import { Backdrop } from "@/components/Backdrop";
import { PageShell } from "@/components/ui/PageShell";
import { isSupabaseConfigured } from "@/lib/config";
import { createAdminClient } from "@/lib/supabase/admin";
import Link from "next/link";

export const metadata = { title: "Leaderboard" };


export const dynamic = "force-dynamic";

export default async function LeaderboardPage() {
  let rows: { anon_tag: string; post_count: number }[] = [];
  if (isSupabaseConfigured) {
    const admin = createAdminClient();
    const { data } = await admin.from("members").select("custom_tag, post_count")
      .order("post_count", { ascending: false }).limit(20);
    rows = (data ?? []).map((r: { custom_tag: string | null; post_count: number }) => ({
      anon_tag: r.custom_tag ?? "Anon",
      post_count: r.post_count,
    }));
  }

  return (
    <>
      <Backdrop />
      <PageShell title="Leaderboard" back="/feed"
        actions={
          <div style={{ display: "flex", gap: 6 }}>
            <Link href="/leaderboard/reactions" className="pill press" style={{ background: "var(--rant)", textDecoration: "none", fontSize: 11 }}>🔥 Top</Link>
            <Link href="/leaderboard/givers" className="pill press" style={{ background: "var(--info)", textDecoration: "none", fontSize: 11 }}>💯 Givers</Link>
          </div>
        }>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {rows.length === 0
            ? <p style={{ fontFamily: "var(--disp)", opacity: 0.6 }}>No data yet. Post something!</p>
            : rows.map((r, i) => (
                <div key={r.anon_tag} className="campus-row grain" style={{ background: i === 0 ? "var(--callout)" : i === 1 ? "var(--info)" : i === 2 ? "var(--pink)" : "var(--paper)" }}>
                  <span style={{ fontFamily: "var(--disp)", fontWeight: 700, fontSize: 20, minWidth: 32 }}>{i + 1}</span>
                  <div style={{ flex: 1 }}>
                    <div className="cr-name" style={{ fontFamily: "monospace" }}>{r.anon_tag}</div>
                    <div className="cr-full">{r.post_count} posts</div>
                  </div>
                </div>
              ))
          }
        </div>
      </PageShell>
    </>
  );
}
"// v1.0"  
