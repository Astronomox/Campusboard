import { notFound } from "next/navigation";
import { Backdrop } from "@/components/Backdrop";
import { PageShell } from "@/components/ui/PageShell";
import { CategoryBadge } from "@/components/ui/Badge";
import { isSupabaseConfigured } from "@/lib/config";
import { createAdminClient } from "@/lib/supabase/admin";
import type { Post } from "@/lib/types";

export const dynamic = "force-dynamic";

async function getPost(id: string): Promise<Post | null> {
  if (!isSupabaseConfigured) return null;
  const admin = createAdminClient();
  const { data } = await admin.from("posts_with_reactions").select("*").eq("id", id).eq("status", "published").maybeSingle();
  return data as Post | null;
}

function timeAgo(iso: string) {
  const s = Math.floor((Date.now() - new Date(iso).getTime()) / 1000);
  if (s < 60) return "just now";
  const m = Math.floor(s / 60);
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}

export default async function PostPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const post = await getPost(id);
  if (!post && isSupabaseConfigured) notFound();

  const demoPost: Post = post ?? {
    id, campus_slug: "unilag", body: "Demo post — connect Supabase to see real content.",
    anon_tag: "Anon #DEMO", category: "info", status: "published",
    created_at: new Date().toISOString(), reactions: { fire: 0, skull: 0, laugh: 0, hundred: 0 },
  };

  return (
    <>
      <Backdrop />
      <PageShell title="Post" back="/feed">
        <div className="card grain" style={{ "--c": "var(--info)" } as React.CSSProperties}>
          <div className="winbar">
            <span className="dots"><i style={{ background: "var(--rant)" }}/><i style={{ background: "var(--callout)" }}/><i style={{ background: "var(--shoutout)" }}/></span>
            <CategoryBadge category={demoPost.category} />
          </div>
          <div className="post-panel">
            <p className="post-body">{demoPost.body}</p>
            <div className="post-meta">
              <span className="tag">{demoPost.anon_tag}</span>
              <span className="time">{timeAgo(demoPost.created_at)}</span>
            </div>
          </div>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 4 }}>
            {(["fire","skull","laugh","hundred"] as const).map((e) => (
              <div key={e} className="react" style={{ flex: "none", minWidth: 70 }}>
                <span>{demoPost.reactions[e]}</span>
              </div>
            ))}
          </div>
        </div>

        <div style={{ display: "flex", gap: 10, marginTop: 16, flexWrap: "wrap" }}>
          <a href={`/post/${id}/share`} className="pill press" style={{ background: "var(--info)", textDecoration: "none" }}>Share</a>
          <a href={`/post/${id}/report`} className="pill press" style={{ background: "var(--rant)", textDecoration: "none" }}>Report</a>
          <a href={`/post/${id}/reactions`} className="pill press" style={{ background: "var(--paper)", textDecoration: "none" }}>Reactions</a>
        </div>
      </PageShell>
    </>
  );
}
