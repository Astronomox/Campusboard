import Link from "next/link";
import { isAdmin } from "@/lib/admin";
import { isSupabaseConfigured } from "@/lib/config";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import { AdminShell } from "@/components/ui/AdminShell";

export const dynamic = "force-dynamic";

export default async function MembersPage() {
  if (!isSupabaseConfigured) return <div style={{padding:40}}>Not configured.</div>;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user || !isAdmin(user.email)) return <div style={{padding:40}}>Forbidden.</div>;

  const admin = createAdminClient();
  const { data } = await admin.from("members").select("user_id,custom_tag,post_count,invites_left,joined_at")
    .order("joined_at", { ascending: false }).limit(100);
  const members = (data ?? []) as { user_id: string; custom_tag: string | null; post_count: number; invites_left: number; joined_at: string }[];

  return (
    <AdminShell title="Members" current="/mod/members">
      <p style={{ fontFamily: "var(--disp)", opacity: 0.6, marginBottom: 16, fontSize: 13 }}>{members.length} members</p>
      <table className="atable">
        <thead><tr><th>User ID</th><th>Custom tag</th><th>Posts</th><th>Invites left</th><th>Joined</th><th></th></tr></thead>
        <tbody>
          {members.map((m) => (
            <tr key={m.user_id}>
              <td style={{ fontFamily: "monospace", fontSize: 12 }}>{m.user_id.slice(0, 8)}…</td>
              <td style={{ fontFamily: "monospace", fontWeight: 700 }}>{m.custom_tag ?? "—"}</td>
              <td>{m.post_count}</td>
              <td>{m.invites_left}</td>
              <td style={{ opacity: 0.6, fontSize: 12 }}>{new Date(m.joined_at).toLocaleDateString()}</td>
              <td><Link href={`/mod/members/${m.user_id}`} className="pill press" style={{ fontSize: 11, background: "var(--info)", textDecoration: "none" }}>View</Link></td>
            </tr>
          ))}
        </tbody>
      </table>
    </AdminShell>
  );
}
