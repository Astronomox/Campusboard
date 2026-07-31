import { isAdmin } from "@/lib/admin";
import { isSupabaseConfigured } from "@/lib/config";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import { AdminShell } from "@/components/ui/AdminShell";
import { CATEGORY_META } from "@/lib/campuses";
import type { Post } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function RejectedContentPage() {
  if (!isSupabaseConfigured) return <div style={{padding:40}}>Not configured.</div>;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user || !isAdmin(user.email)) return <div style={{padding:40}}>Forbidden.</div>;

  const admin = createAdminClient();
  const { data } = await admin.from("posts").select("id,body,category,created_at").eq("status", "rejected")
    .order("created_at", { ascending: false }).limit(100);
  const posts = (data ?? []) as Pick<Post, "id" | "body" | "category" | "created_at">[];

  return (
    <AdminShell title="Rejected posts" current="/mod/queue">
      <p style={{ fontFamily: "var(--disp)", opacity: 0.6, marginBottom: 16, fontSize: 13 }}>Audit log — {posts.length} rejected posts.</p>
      <table className="atable">
        <thead><tr><th>Body</th><th>Category</th><th>Date</th></tr></thead>
        <tbody>
          {posts.map((p) => (
            <tr key={p.id}>
              <td style={{ maxWidth: 360 }}>{p.body.slice(0, 100)}{p.body.length > 100 ? "…" : ""}</td>
              <td><span className="sticker" style={{ background: CATEGORY_META[p.category]?.color }}>{p.category}</span></td>
              <td style={{ fontSize: 12, opacity: 0.65 }}>{new Date(p.created_at).toLocaleDateString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </AdminShell>
  );
}
