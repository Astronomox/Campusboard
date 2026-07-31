import { NextResponse, after } from "next/server";
import { resolveTag } from "@/lib/anon";
import { censorNames } from "@/lib/censor";
import { isSupabaseConfigured } from "@/lib/config";
import { finalizeModeration, preFilter } from "@/lib/moderation";
import { isMember, maybeGrantInvite } from "@/lib/invites";
import { withinRateLimit } from "@/lib/ratelimit";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import type { Post } from "@/lib/types";
import { createPostSchema } from "@/lib/validation";

const POST_MAX    = 5;
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
    return NextResponse.json({ error: "Invalid input", details: parsed.error.flatten() }, { status: 400 });
  }

  const { campus, category } = parsed.data;
  const body = censorNames(parsed.data.body);

  const supabase = await createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const admin = createAdminClient();

  // Ban check
  const { data: ban } = await admin
    .from("bans")
    .select("until")
    .eq("user_id", user.id)
    .eq("campus_slug", campus)
    .maybeSingle();
  if (ban && (!ban.until || new Date(ban.until) > new Date())) {
    return NextResponse.json({ error: "You are banned from this campus" }, { status: 403 });
  }

  // Membership check
  const member = await isMember(user.id);
  if (!member) {
    return NextResponse.json(
      { error: "You need a valid invite code to post. Redeem one on the You tab." },
      { status: 403 }
    );
  }

  // Rate limit
  const allowed = await withinRateLimit(admin, "posts", "user_id", user.id, POST_MAX, POST_WINDOW);
  if (!allowed) {
    return NextResponse.json({ error: "You're posting too fast. Try again shortly." }, { status: 429 });
  }

  // Pre-filter (cheap, no model)
  if ((await preFilter(body)) === "reject") {
    return NextResponse.json({ rejected: true, reason: "Blocked by the content filter." }, { status: 422 });
  }

  // Resolve anon tag (custom or HMAC)
  const { data: memberRow } = await admin
    .from("members")
    .select("custom_tag")
    .eq("user_id", user.id)
    .maybeSingle();
  const customTag = memberRow?.custom_tag ?? null;

  // Insert as pending — RLS only allows pending inserts
  const { data, error: insertError } = await supabase
    .from("posts")
    .insert({
      campus_slug: campus,
      user_id:     user.id,
      body,
      anon_tag:    resolveTag(user.id, campus, customTag),
      category,
      status:      "pending",
    })
    .select("id, campus_slug, body, anon_tag, category, status, created_at")
    .single();

  if (insertError || !data) {
    console.error("[posts] insert error:", insertError);
    return NextResponse.json({ error: "Insert failed", detail: insertError?.message }, { status: 500 });
  }

  // Async: classify post, then flip status; also check invite credit grant
  after(() => finalizeModeration(data.id, body));
  after(async () => {
    // Re-query post_count since insert doesn't return it
    const { data: m } = await admin
      .from("members")
      .select("post_count")
      .eq("user_id", user.id)
      .maybeSingle();
    if (m) await maybeGrantInvite(user.id, m.post_count ?? 0);
  });

  const post: Post = {
    id:          data.id,
    campus_slug: data.campus_slug,
    body:        data.body,
    anon_tag:    data.anon_tag,
    category:    data.category,
    status:      data.status,
    created_at:  data.created_at,
    reactions:   { fire: 0, skull: 0, laugh: 0, hundred: 0 },
  };

  return NextResponse.json({ post });
}
"// v1.0"  
