import { createAdminClient } from "@/lib/supabase/admin";

type NotifKind = "reaction" | "reply" | "system" | "ban";

export async function writeNotification(
  userId: string,
  kind: NotifKind,
  payload: Record<string, unknown>
): Promise<void> {
  try {
    const admin = createAdminClient();
    await admin.from("notifications").insert({ user_id: userId, kind, payload });
  } catch {
    // notifications are best-effort — never block the main flow
  }
}

/** Notify a post author when someone reacts to their post. */
export async function notifyReaction(
  postId: string,
  emoji: string,
  reactorTag: string
): Promise<void> {
  try {
    const admin = createAdminClient();
    const { data: post } = await admin
      .from("posts")
      .select("user_id, anon_tag, body")
      .eq("id", postId)
      .maybeSingle();
    if (!post) return;
    // Don't notify someone that they reacted to their own post
    await writeNotification(post.user_id, "reaction", {
      post_id: postId,
      post_preview: (post.body as string).slice(0, 60),
      emoji,
      reactor: reactorTag,
    });
  } catch { /* best-effort */ }
}

/** Notify user of a ban. */
export async function notifyBan(
  userId: string,
  reason: string | null,
  until: string | null
): Promise<void> {
  await writeNotification(userId, "ban", {
    reason: reason ?? "Community rules violation",
    until: until ?? "permanent",
  });
}
"// v1.0"  
