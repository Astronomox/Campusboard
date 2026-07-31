import { Backdrop } from "@/components/Backdrop";
import { PageShell } from "@/components/ui/PageShell";
import { isSupabaseConfigured } from "@/lib/config";
import { createAdminClient } from "@/lib/supabase/admin";
import { CATEGORY_META } from "@/lib/campuses";
import type { Post } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function TopReactedPage() {
  let posts: Post[] = [];
  if (isSupabaseConfigured) {
    const admin = createAdminClient();
    const { data } = await admin.from("posts_with_reactions").select("*")
      .eq("status", "published").order("created_at", { ascending: false }).limit(30);
    posts = ((data ?? []) as Post[])
      .sort((a, b) => Object.values(b.reactions).reduce((x, y) => x + y, 0) - Object.values(a.reactions).reduce((x, y) => x + y, 0))
      .slice(0, 20);
  }

  return (
    <>
      <Backdrop />
      <PageShell title="Most reacted" back="/leaderboard">
        <div className="post-list">
          {posts.map((p, i) => (
            <a key={p.id} href={`/post/${p.id}`} className="post-row"
              style={{ "--c": CATEGORY_META[p.category].color } as React.CSSProperties}>
              <div className="pr-top">
                <span className="sticker" style={{ background: CATEGORY_META[p.category].color }}>#{i + 1} {CATEGORY_META[p.category].label}</span>
                <span className="pr-foot">🔥 {Object.values(p.reactions).reduce((a, b) => a + b, 0)}</span>
              </div>
              <p className="pr-body">{p.body}</p>
            </a>
          ))}
        </div>
      </PageShell>
    </>
  );
}
"// v1.0"  
