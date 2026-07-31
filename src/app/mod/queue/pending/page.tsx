import { isAdmin } from "@/lib/admin";
import { isSupabaseConfigured } from "@/lib/config";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import { AdminShell } from "@/components/ui/AdminShell";
import { CATEGORY_META } from "@/lib/campuses";
import type { Post } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function PendingQueuePage() {
  if (!isSupabaseConfigured) return <div style={{padding:40}}>Not configured.</div>;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user || !isAdmin(user.email)) return <div style={{padding:40}}>Forbidden.</div>;

  const admin = createAdminClient();
  const { data } = await admin.from("posts").select("*").eq("status", "pending")
    .order("created_at", { ascending: true }).limit(50);
  const posts = (data ?? []) as Post[];

  return (
    <AdminShell title="Pending posts" current="/mod/queue">
      <p style={{ fontFamily: "var(--disp)", opacity: 0.6, marginBottom: 16, fontSize: 13 }}>
        Posts awaiting AI classification. These are auto-resolved within seconds normally.
      </p>
      {posts.length === 0
        ? <p style={{ fontFamily: "var(--disp)" }}>Queue empty ✓</p>
        : <table className="atable">
            <thead><tr><th>Body</th><th>Category</th><th>Created</th></tr></thead>
            <tbody>
              {posts.map((p) => (
                <tr key={p.id}>
                  <td style={{ maxWidth: 340 }}>{p.body.slice(0, 100)}{p.body.length > 100 ? "…" : ""}</td>
                  <td><span className="sticker" style={{ background: CATEGORY_META[p.category]?.color }}>{p.category}</span></td>
                  <td style={{ whiteSpace: "nowrap", opacity: 0.65 }}>{new Date(p.created_at).toLocaleTimeString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
      }
    </AdminShell>
  );
}
