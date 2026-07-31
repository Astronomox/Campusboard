import { NextResponse } from "next/server";
import { censorNames } from "@/lib/censor";
import { isSupabaseConfigured } from "@/lib/config";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import { z } from "zod";

const schema = z.object({
  post_id: z.string().min(1).max(64),
  body:    z.string().trim().min(1).max(280),
});

const EDIT_WINDOW_MS = 15 * 60 * 1000; // 15 minutes

export async function PATCH(request: Request) {
  if (!isSupabaseConfigured) return NextResponse.json({ error: "Not configured" }, { status: 501 });

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const parsed = schema.safeParse(await request.json().catch(() => ({})));
  if (!parsed.success) return NextResponse.json({ error: "Invalid" }, { status: 400 });

  const { post_id, body } = parsed.data;
  const admin = createAdminClient();

  // Verify ownership and time window
  const { data: post } = await admin
    .from("posts")
    .select("user_id, created_at, status")
    .eq("id", post_id)
    .maybeSingle();

  if (!post) return NextResponse.json({ error: "Post not found" }, { status: 404 });
  if (post.user_id !== user.id) return NextResponse.json({ error: "Not your post" }, { status: 403 });

  const age = Date.now() - new Date(post.created_at).getTime();
  if (age > EDIT_WINDOW_MS) {
    return NextResponse.json({ error: "Edit window expired. Posts can only be edited within 15 minutes." }, { status: 403 });
  }

  const censored = censorNames(body);
  const { error } = await admin.from("posts").update({ body: censored, status: "pending" }).eq("id", post_id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ ok: true, body: censored });
}
