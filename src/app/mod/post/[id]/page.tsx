import { isAdmin } from "@/lib/admin";
import { isSupabaseConfigured } from "@/lib/config";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import { AdminShell } from "@/components/ui/AdminShell";
import { StatusBadge, CategoryBadge } from "@/components/ui/Badge";
import { notFound } from "next/navigation";
import type { Post } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function ModPostDetailPage({ params }: { params: Promise<{ id: string }> }) {
  if (!isSupabaseConfigured) return <div style={{padding:40}}>Not configured.</div>;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user || !isAdmin(user.email)) return <div style={{padding:40}}>Forbidden.</div>;

  const { id } = await params;
  const admin = createAdminClient();
  const { data } = await admin.from("posts").select("*").eq("id", id).maybeSingle();
  if (!data) notFound();
  const post = data as Post & { user_id: string };

  return (
    <AdminShell title="Post detail" current="/mod/queue">
      <div style={{ maxWidth: 600, display: "flex", flexDirection: "column", gap: 16 }}>
        <div className="astat-row">
          <div className="astat"><CategoryBadge category={post.category} /><div className="l">Category</div></div>
          <div className="astat"><StatusBadge status={post.status} /><div className="l">Status</div></div>
          <div className="astat"><div className="n" style={{ fontSize: 13 }}>{new Date(post.created_at).toLocaleString()}</div><div className="l">Created</div></div>
        </div>
        <div className="astat" style={{ background: "var(--paper)" }}>
          <p style={{ margin: 0, fontSize: 16, lineHeight: 1.5 }}>{post.body}</p>
        </div>
        <div className="astat">
          <div className="n" style={{ fontFamily: "monospace", fontSize: 12 }}>{post.user_id}</div>
          <div className="l">User ID</div>
        </div>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          <a href={`/mod/members/${post.user_id}`} className="pill press" style={{ background: "var(--info)", textDecoration: "none" }}>View user</a>
          <a href={`/mod/bans/new?userId=${post.user_id}`} className="pill press" style={{ background: "var(--rant)", textDecoration: "none" }}>Ban user</a>
        </div>
      </div>
    </AdminShell>
  );
}
