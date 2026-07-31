import { NextResponse } from "next/server";
import { isSupabaseConfigured } from "@/lib/config";
import { createClient } from "@/lib/supabase/server";
import { z } from "zod";

const schema = z.object({
  post_id: z.string().min(1).max(64),
  action:  z.enum(["save", "unsave"]),
});

export async function POST(request: Request) {
  if (!isSupabaseConfigured) return NextResponse.json({ ok: true });
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const parsed = schema.safeParse(await request.json().catch(() => ({})));
  if (!parsed.success) return NextResponse.json({ error: "Invalid" }, { status: 400 });

  const { post_id, action } = parsed.data;
  if (action === "save") {
    await supabase.from("bookmarks").upsert({ user_id: user.id, post_id }, { onConflict: "user_id,post_id" });
  } else {
    await supabase.from("bookmarks").delete().eq("user_id", user.id).eq("post_id", post_id);
  }
  return NextResponse.json({ ok: true });
}

export async function GET() {
  if (!isSupabaseConfigured) return NextResponse.json({ post_ids: [] });
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { data } = await supabase.from("bookmarks").select("post_id").eq("user_id", user.id);
  return NextResponse.json({ post_ids: (data ?? []).map((r: { post_id: string }) => r.post_id) });
}
"// v1.0"  
