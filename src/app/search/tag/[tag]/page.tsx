import { Backdrop } from "@/components/Backdrop";
import { PageShell } from "@/components/ui/PageShell";
import { isSupabaseConfigured } from "@/lib/config";
import { createAdminClient } from "@/lib/supabase/admin";
import type { Post } from "@/lib/types";
import { CATEGORY_META } from "@/lib/campuses";

export const dynamic = "force-dynamic";

export default async function TagPage({ params }: { params: Promise<{ tag: string }> }) {
  const { tag } = await params;
  const decoded = decodeURIComponent(tag);
  let posts: Post[] = [];
  if (isSupabaseConfigured) {
    const admin = createAdminClient();
    const { data } = await admin.from("posts_with_reactions").select("*")
      .eq("anon_tag", decoded).eq("status", "published")
      .order("created_at", { ascending: false }).limit(30);
    posts = (data ?? []) as Post[];
  }

  return (
    <>
      <Backdrop />
      <PageShell title={decoded} back="/tags">
        {posts.length === 0
          ? <p style={{ fontFamily: "var(--disp)", opacity: 0.6 }}>No public posts from this tag.</p>
          : <div className="post-list">
              {posts.map((p) => (
                <a key={p.id} href={`/post/${p.id}`} className="post-row"
                  style={{ "--c": CATEGORY_META[p.category].color } as React.CSSProperties}>
                  <div className="pr-top">
                    <span className="sticker" style={{ background: CATEGORY_META[p.category].color }}>{CATEGORY_META[p.category].label}</span>
                    <span className="pr-foot">{Object.values(p.reactions).reduce((a, b) => a + b, 0)} reactions</span>
                  </div>
                  <p className="pr-body">{p.body}</p>
                </a>
              ))}
            </div>
        }
      </PageShell>
    </>
  );
}
"// v1.0"  
