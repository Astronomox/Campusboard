import { Backdrop } from "@/components/Backdrop";
import { PageShell } from "@/components/ui/PageShell";
import { isSupabaseConfigured } from "@/lib/config";
import { createAdminClient } from "@/lib/supabase/admin";
import { CATEGORY_META } from "@/lib/campuses";
import type { Post } from "@/lib/types";

export const metadata = { title: "Discover" };


export const dynamic = "force-dynamic";

export default async function DiscoverPage() {
  let posts: Post[] = [];
  if (isSupabaseConfigured) {
    const admin = createAdminClient();
    const { data } = await admin.from("posts_with_reactions").select("*")
      .eq("status", "published").order("created_at", { ascending: false }).limit(10);
    posts = (data ?? []) as Post[];
  }

  return (
    <>
      <Backdrop />
      <PageShell title="Discover" back="/feed">
        <p style={{ fontFamily: "var(--disp)", fontSize: 13, opacity: 0.6, marginBottom: 14 }}>Editor-curated posts from across the board.</p>
        <div className="post-list">
          {posts.map((p) => (
            <a key={p.id} href={`/post/${p.id}`} className="post-row"
              style={{ "--c": CATEGORY_META[p.category].color } as React.CSSProperties}>
              <div className="pr-top">
                <span className="sticker" style={{ background: CATEGORY_META[p.category].color }}>{CATEGORY_META[p.category].label}</span>
                <span className="pr-foot">{Object.values(p.reactions).reduce((a, b) => a + b, 0)} reactions</span>
              </div>
              <p className="pr-body">{p.body}</p>
              <div className="pr-foot">{p.anon_tag}</div>
            </a>
          ))}
        </div>
      </PageShell>
    </>
  );
}
