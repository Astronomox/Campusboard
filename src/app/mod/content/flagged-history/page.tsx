import { isAdmin } from "@/lib/admin";
import { isSupabaseConfigured } from "@/lib/config";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import { AdminShell } from "@/components/ui/AdminShell";
import { StatusBadge } from "@/components/ui/Badge";
import type { Post } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function FlaggedHistoryPage() {
  if (!isSupabaseConfigured) return <div style={{padding:40}}>Not configured.</div>;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user || !isAdmin(user.email)) return <div style={{padding:40}}>Forbidden.</div>;

  const admin = createAdminClient();
  const { data } = await admin.from("posts").select("id,body,category,status,created_at")
    .in("status", ["flagged", "rejected", "published"]).order("created_at", { ascending: false }).limit(100);
  const posts = (data ?? []) as Pick<Post, "id" | "body" | "category" | "status" | "created_at">[];

  return (
    <AdminShell title="Flagged history" current="/mod/queue">
      <table className="atable">
        <thead><tr><th>Body</th><th>Final status</th><th>Date</th></tr></thead>
        <tbody>
          {posts.map((p) => (
            <tr key={p.id}>
              <td style={{ maxWidth: 340 }}><a href={`/mod/post/${p.id}`} style={{ color: "var(--ink)" }}>{p.body.slice(0, 80)}…</a></td>
              <td><StatusBadge status={p.status} /></td>
              <td style={{ fontSize: 12, opacity: 0.65 }}>{new Date(p.created_at).toLocaleDateString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </AdminShell>
  );
}
