import { Backdrop } from "@/components/Backdrop";
import { PageShell } from "@/components/ui/PageShell";
import { Empty } from "@/components/ui/Empty";
import { isSupabaseConfigured } from "@/lib/config";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { CATEGORY_META } from "@/lib/campuses";
import type { Post } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function SavedPage() {
  let posts: Post[] = [];

  if (isSupabaseConfigured) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const { data: bookmarks } = await supabase
        .from("bookmarks")
        .select("post_id")
        .eq("user_id", user.id)
        .order("saved_at", { ascending: false })
        .limit(50);

      if (bookmarks?.length) {
        const admin = createAdminClient();
        const { data } = await admin
          .from("posts_with_reactions")
          .select("*")
          .in("id", bookmarks.map((b: { post_id: string }) => b.post_id));
        posts = (data ?? []) as Post[];
      }
    }
  }

  return (
    <>
      <Backdrop />
      <PageShell title="Saved posts" back="/unilag?tab=you">
        {posts.length === 0 ? (
          <Empty icon="🔖" title="Nothing saved yet" body="Tap the bookmark icon on any post to save it here." />
        ) : (
          <div className="post-list">
            {posts.map((p) => (
              <a
                key={p.id}
                href={`/post/${p.id}`}
                className="post-row"
                style={{ "--c": CATEGORY_META[p.category].color } as React.CSSProperties}
              >
                <div className="pr-top">
                  <span className="sticker" style={{ background: CATEGORY_META[p.category].color }}>
                    {CATEGORY_META[p.category].label}
                  </span>
                  <span className="pr-foot">{Object.values(p.reactions).reduce((a, b) => a + b, 0)} reactions</span>
                </div>
                <p className="pr-body">{p.body}</p>
                <div className="pr-foot">{p.anon_tag}</div>
              </a>
            ))}
          </div>
        )}
      </PageShell>
    </>
  );
}
"// v1.0"  
