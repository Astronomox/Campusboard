import { Backdrop } from "@/components/Backdrop";
import { PageShell } from "@/components/ui/PageShell";
import { isSupabaseConfigured } from "@/lib/config";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { CATEGORY_META } from "@/lib/campuses";
import type { Post } from "@/lib/types";
import { Empty } from "@/components/ui/Empty";

export const dynamic = "force-dynamic";

export default async function YourPostsPage() {
  let posts: Post[] = [];
  if (isSupabaseConfigured) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const admin = createAdminClient();
      const { data } = await admin.from("posts").select("*, reactions:reactions(emoji)")
        .eq("user_id", user.id).order("created_at", { ascending: false }).limit(50);
      posts = (data ?? []) as unknown as Post[];
    }
  }

  return (
    <>
      <Backdrop />
      <PageShell title="Your posts" back="/unilag?tab=you">
        {posts.length === 0
          ? <Empty icon="📝" title="No posts yet" body="Your anonymous posts will appear here." />
          : <div className="post-list">
              {posts.map((p: Post) => (
                <a key={p.id} href={`/post/${p.id}`} className="post-row"
                  style={{ "--c": CATEGORY_META[p.category]?.color ?? "var(--paper)" } as React.CSSProperties}>
                  <div className="pr-top">
                    <span className="sticker" style={{ background: CATEGORY_META[p.category]?.color }}>{CATEGORY_META[p.category]?.label}</span>
                    <span className="pr-foot">{p.status}</span>
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
