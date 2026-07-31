import { isAdmin } from "@/lib/admin";
import { isSupabaseConfigured } from "@/lib/config";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import { AdminShell } from "@/components/ui/AdminShell";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function StatsPage() {
  if (!isSupabaseConfigured) return <div style={{padding:40}}>Not configured.</div>;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user || !isAdmin(user.email)) return <div style={{padding:40}}>Forbidden.</div>;

  const admin = createAdminClient();
  const since7d = new Date(Date.now() - 7 * 86400000).toISOString();
  const [
    { count: total },
    { count: week },
    { count: rejected },
    { count: flagged },
    { count: members },
    { count: reports },
  ] = await Promise.all([
    admin.from("posts").select("*", { count: "exact", head: true }),
    admin.from("posts").select("*", { count: "exact", head: true }).gte("created_at", since7d),
    admin.from("posts").select("*", { count: "exact", head: true }).eq("status", "rejected"),
    admin.from("posts").select("*", { count: "exact", head: true }).eq("status", "flagged"),
    admin.from("members").select("*", { count: "exact", head: true }),
    admin.from("reports").select("*", { count: "exact", head: true }),
  ]);

  const rejRate = total ? Math.round(((rejected ?? 0) / total) * 100) : 0;

  return (
    <AdminShell title="Board stats" current="/mod/stats">
      <div className="astat-row">
        <div className="astat accent"><div className="n">{total ?? 0}</div><div className="l">Total posts</div></div>
        <div className="astat"><div className="n">{week ?? 0}</div><div className="l">This week</div></div>
        <div className="astat rant"><div className="n">{rejRate}%</div><div className="l">Rejection rate</div></div>
        <div className="astat call"><div className="n">{flagged ?? 0}</div><div className="l">Flagged</div></div>
        <div className="astat"><div className="n">{members ?? 0}</div><div className="l">Members</div></div>
        <div className="astat rant"><div className="n">{reports ?? 0}</div><div className="l">Open reports</div></div>
      </div>
      <Link href="/mod/stats/export" className="pill press" style={{ textDecoration: "none", background: "var(--info)", display: "inline-flex" }}>
        Export CSV →
      </Link>
    </AdminShell>
  );
}
