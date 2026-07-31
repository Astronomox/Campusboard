import Link from "next/link";
import { isAdmin } from "@/lib/admin";
import { isSupabaseConfigured } from "@/lib/config";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import { AdminShell } from "@/components/ui/AdminShell";

export const dynamic = "force-dynamic";

export default async function BansPage() {
  if (!isSupabaseConfigured) return <div style={{padding:40}}>Not configured.</div>;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user || !isAdmin(user.email)) return <div style={{padding:40}}>Forbidden.</div>;

  const admin = createAdminClient();
  const { data } = await admin.from("bans").select("user_id,campus_slug,until,reason,created_at")
    .order("created_at", { ascending: false }).limit(100);
  const bans = (data ?? []) as { user_id: string; campus_slug: string; until: string | null; reason: string | null; created_at: string }[];

  return (
    <AdminShell title="Active bans" current="/mod/bans">
      <div style={{ marginBottom: 16 }}>
        <Link href="/mod/bans/new" className="post-btn press" style={{ textDecoration: "none" }}>+ New ban</Link>
      </div>
      {bans.length === 0
        ? <p style={{ fontFamily: "var(--disp)" }}>No active bans.</p>
        : <table className="atable">
            <thead><tr><th>User</th><th>Reason</th><th>Until</th><th>Actions</th></tr></thead>
            <tbody>
              {bans.map((b) => (
                <tr key={b.user_id}>
                  <td style={{ fontFamily: "monospace", fontSize: 12 }}>{b.user_id.slice(0, 8)}…</td>
                  <td>{b.reason ?? "—"}</td>
                  <td>{b.until ? new Date(b.until).toLocaleDateString() : "Permanent"}</td>
                  <td><Link href={`/mod/bans/${b.user_id}`} className="pill press" style={{ fontSize: 11, background: "var(--info)", textDecoration: "none" }}>View</Link></td>
                </tr>
              ))}
            </tbody>
          </table>
      }
    </AdminShell>
  );
}
