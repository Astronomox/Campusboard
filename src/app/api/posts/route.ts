import { NextResponse, after } from "next/server";
import { resolveTag } from "@/lib/anon";
import { isSupabaseConfigured } from "@/lib/config";
import { finalizeModeration, preFilter } from "@/lib/moderation";
import { isMember, maybeGrantInvite } from "@/lib/invites";
import { withinRateLimit } from "@/lib/ratelimit";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import type { Post } from "@/lib/types";
import { createPostSchema } from "@/lib/validation";

// max 5 posts per user per minute
const POST_MAX = 5;
const POST_WINDOW = 60;

export async function POST(request: Request) {
  if (!isSupabaseConfigured) {
    return NextResponse.json({ error: "Backend not configured" }, { status: 501 });
  }

  let raw: unknown;
  try {
    raw = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = createPostSchema.safeParse(raw);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid input" }, { status: 400 });
  }
  const { campus, body, category } = parsed.data;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const admin = createAdminClient();

  // Banned on this campus?
  const { data: ban } = await admin
    .from("bans")
    .select("until")
    .eq("user_id", user.id)
    .eq("campus_slug", campus)
    .maybeSingle();
  if (ban && (!ban.until || new Date(ban.until) > new Date())) {
    return NextResponse.json({ error: "You are banned from this campus" }, { status: 403 });
  }

  // Must be a verified member (invite redeemed).
  const member = await isMember(user.id);
  if (!member) {
    return NextResponse.json(
      { error: "You need a valid invite code to post. Redeem one on the You tab." },
      { status: 403 }
    );
  }

  // Fetch custom tag if member has one (e.g. ANONxGODx000 for admin).
  const { data: memberRow } = await admin
    .from("members")
    .select("custom_tag")
    .eq("user_id", user.id)
    .maybeSingle();
  const customTag = memberRow?.custom_tag ?? null;

  // Rate limit.
  const allowed = await withinRateLimit(admin, "posts", "user_id", user.id, POST_MAX, POST_WINDOW);
  if (!allowed) {
    return NextResponse.json({ error: "You're posting too fast. Try again shortly." }, { status: 429 });
  }

  // Cheap deterministic gate before anything hits the model.
  if ((await preFilter(body)) === "reject") {
    return NextResponse.json({ rejected: true, reason: "Blocked by the content filter." }, { status: 422 });
  }

  // Insert as pending; RLS only allows pending inserts, so this never skips moderation.
  const { data, error } = await supabase
    .from("posts")
    .insert({
      campus_slug: campus,
      user_id: user.id,
      body,
      anon_tag: resolveTag(user.id, campus, customTag),
      category,
      status: "pending",
    })
    .select()
    .single();

  if (error || !data) {
    return NextResponse.json({ error: "Insert failed" }, { status: 500 });
  }

  // Classify after the response is sent, then flip status.
  after(() => finalizeModeration(data.id, body));
  after(() => maybeGrantInvite(user.id, (data as { post_count?: number }).post_count ?? 0));

  const post: Post = {
    id: data.id,
    campus_slug: data.campus_slug,
    body: data.body,
    anon_tag: data.anon_tag,
    category: data.category,
    status: data.status,
    created_at: data.created_at,
    reactions: { fire: 0, skull: 0, laugh: 0, hundred: 0 },
  };

  return NextResponse.json({ post });
}
