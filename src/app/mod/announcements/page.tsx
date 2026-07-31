import Link from "next/link";
import { isAdmin } from "@/lib/admin";
import { isSupabaseConfigured } from "@/lib/config";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import { AdminShell } from "@/components/ui/AdminShell";

export const dynamic = "force-dynamic";

export default async function AnnouncementsPage() {
  if (!isSupabaseConfigured) return <div style={{padding:40}}>Not configured.</div>;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user || !isAdmin(user.email)) return <div style={{padding:40}}>Forbidden.</div>;

  const admin = createAdminClient();
  const { data } = await admin.from("announcements").select("*").order("created_at", { ascending: false }).limit(20);
  const items = (data ?? []) as { id: string; body: string; active: boolean; created_at: string }[];

  return (
    <AdminShell title="Announcements" current="/mod/announcements">
      <div style={{ marginBottom: 16 }}>
        <Link href="/mod/announcements/new" className="post-btn press" style={{ textDecoration: "none" }}>+ New announcement</Link>
      </div>
      {items.length === 0
        ? <p style={{ fontFamily: "var(--disp)" }}>No announcements yet.</p>
        : <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {items.map((a) => (
              <div key={a.id} className="astat" style={{ background: a.active ? "var(--shoutout)" : "var(--paper)" }}>
                <p style={{ margin: 0, fontSize: 15 }}>{a.body}</p>
                <div className="l" style={{ marginTop: 8 }}>{a.active ? "Active" : "Inactive"} · {new Date(a.created_at).toLocaleDateString()}</div>
              </div>
            ))}
          </div>
      }
    </AdminShell>
  );
}
