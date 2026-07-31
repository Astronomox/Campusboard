import { NextResponse } from "next/server";
import { isSupabaseConfigured } from "@/lib/config";
import { createClient } from "@/lib/supabase/server";
import { reactSchema } from "@/lib/validation";
import { notifyReaction } from "@/lib/notifications";

export async function POST(request: Request) {
  if (!isSupabaseConfigured) {
    return NextResponse.json({ ok: true });
  }

  let raw: unknown;
  try {
    raw = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = reactSchema.safeParse(raw);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid input" }, { status: 400 });
  }
  const { post_id, emoji } = parsed.data;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data: existing } = await supabase
    .from("reactions")
    .select("id, emoji")
    .eq("post_id", post_id)
    .eq("user_id", user.id)
    .maybeSingle();

  if (existing && existing.emoji === emoji) {
    await supabase.from("reactions").delete().eq("id", existing.id);
    return NextResponse.json({ ok: true, state: "removed" });
  }
  if (existing) {
    await supabase.from("reactions").update({ emoji }).eq("id", existing.id);
    void notifyReaction(post_id, emoji, user.email ?? "anon");
    return NextResponse.json({ ok: true, state: "changed" });
  }
  await supabase.from("reactions").insert({ post_id, user_id: user.id, emoji });
  void notifyReaction(post_id, emoji, user.email ?? "anon");
  return NextResponse.json({ ok: true, state: "added" });
}
