import { isAdmin } from "@/lib/admin";
import { isSupabaseConfigured } from "@/lib/config";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import { AdminShell } from "@/components/ui/AdminShell";

export const metadata = { title: "Mod dashboard" };


export const dynamic = "force-dynamic";

function Denied({ msg }: { msg: string }) {
  return <div style={{ padding: 40, fontFamily: "system-ui" }}><h2>Access denied</h2><p>{msg}</p></div>;
}

export default async function ModDashboard() {
  if (!isSupabaseConfigured) return <Denied msg="Backend not configured." />;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user || !isAdmin(user.email)) return <Denied msg="Not authorized." />;

  const admin = createAdminClient();
  const [
    { count: pending },
    { count: flagged },
    { count: reports },
    { count: members },
    { count: totalPosts },
  ] = await Promise.all([
    admin.from("posts").select("*", { count: "exact", head: true }).eq("status", "pending"),
    admin.from("posts").select("*", { count: "exact", head: true }).eq("status", "flagged"),
    admin.from("reports").select("*", { count: "exact", head: true }).eq("status", "open"),
    admin.from("members").select("*", { count: "exact", head: true }),
    admin.from("posts").select("*", { count: "exact", head: true }).eq("status", "published"),
  ]);

  return (
    <AdminShell title="Dashboard" current="/mod">
      <div className="astat-row">
        <div className="astat rant"><div className="n">{flagged ?? 0}</div><div className="l">Flagged</div></div>
        <div className="astat call"><div className="n">{pending ?? 0}</div><div className="l">Pending</div></div>
        <div className="astat rant"><div className="n">{reports ?? 0}</div><div className="l">Reports</div></div>
        <div className="astat"><div className="n">{members ?? 0}</div><div className="l">Members</div></div>
        <div className="astat accent"><div className="n">{totalPosts ?? 0}</div><div className="l">Published</div></div>
      </div>
      <p style={{ fontFamily: "var(--disp)", opacity: 0.6, fontSize: 13 }}>
        Signed in as {user.email}
      </p>
    </AdminShell>
  );
}
"// v1.0"  
