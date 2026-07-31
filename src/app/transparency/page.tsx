import { Backdrop } from "@/components/Backdrop";
import { PageShell } from "@/components/ui/PageShell";
import { isSupabaseConfigured } from "@/lib/config";
import { createAdminClient } from "@/lib/supabase/admin";

export const metadata = { title: "Transparency" };


export const dynamic = "force-dynamic";

export default async function TransparencyPage() {
  let stats = { total: 0, published: 0, rejected: 0, members: 0 };
  if (isSupabaseConfigured) {
    const admin = createAdminClient();
    const [{ count: t }, { count: p }, { count: r }, { count: m }] = await Promise.all([
      admin.from("posts").select("*", { count: "exact", head: true }),
      admin.from("posts").select("*", { count: "exact", head: true }).eq("status", "published"),
      admin.from("posts").select("*", { count: "exact", head: true }).eq("status", "rejected"),
      admin.from("members").select("*", { count: "exact", head: true }),
    ]);
    stats = { total: t ?? 0, published: p ?? 0, rejected: r ?? 0, members: m ?? 0 };
  }

  return (
    <>
      <Backdrop />
      <PageShell title="Transparency report" back="/about">
        <p style={{ fontFamily: "var(--disp)", fontSize: 13, opacity: 0.65, marginBottom: 16 }}>Live moderation stats.</p>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 16 }}>
          {[
            { n: stats.members, l: "Members", c: "var(--shoutout)" },
            { n: stats.published, l: "Published posts", c: "var(--info)" },
            { n: stats.rejected, l: "Rejected posts", c: "var(--rant)" },
            { n: Math.round(stats.total ? (stats.rejected / stats.total) * 100 : 0), l: "Rejection rate %", c: "var(--callout)" },
          ].map(({ n, l, c }) => (
            <div key={l} className="stat grain" style={{ background: c }}>
              <div className="num">{n}</div>
              <div className="lbl">{l}</div>
            </div>
          ))}
        </div>
      </PageShell>
    </>
  );
}
"// v1.0"  
