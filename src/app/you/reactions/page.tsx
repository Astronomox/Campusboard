import { Backdrop } from "@/components/Backdrop";
import { PageShell } from "@/components/ui/PageShell";
import { Empty } from "@/components/ui/Empty";
import { isSupabaseConfigured } from "@/lib/config";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { CATEGORY_META } from "@/lib/campuses";
import type { Post } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function YourReactionsPage() {
  let posts: (Post & { my_emoji: string })[] = [];

  if (isSupabaseConfigured) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (user) {
      const admin = createAdminClient();
      // Get posts the user reacted to, with which emoji
      const { data: reacts } = await admin
        .from("reactions")
        .select("post_id, emoji")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(50);

      if (reacts?.length) {
        const postIds = reacts.map((r: { post_id: string; emoji: string }) => r.post_id);
        const { data: postData } = await admin
          .from("posts_with_reactions")
          .select("*")
          .in("id", postIds)
          .eq("status", "published");

        const emojiMap = new Map(
          reacts.map((r: { post_id: string; emoji: string }) => [r.post_id, r.emoji])
        );
        posts = ((postData ?? []) as Post[]).map((p) => ({
          ...p,
          my_emoji: emojiMap.get(p.id) ?? "",
        }));
      }
    }
  }

  const GLYPHS: Record<string, string> = {
    fire: "🔥", skull: "💀", laugh: "😊", hundred: "💯",
  };

  return (
    <>
      <Backdrop />
      <PageShell title="Your reactions" back="/unilag?tab=you">
        {posts.length === 0 ? (
          <Empty icon="🔥" title="No reactions yet" body="Posts you react to will appear here." />
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
                  <span style={{ fontSize: 18 }}>{GLYPHS[p.my_emoji] ?? p.my_emoji}</span>
                </div>
                <p className="pr-body">{p.body}</p>
                <div className="pr-foot">
                  <span>{p.anon_tag}</span>
                  <span>{Object.values(p.reactions).reduce((a, b) => a + b, 0)} reactions</span>
                </div>
              </a>
            ))}
          </div>
        )}
      </PageShell>
    </>
  );
}
