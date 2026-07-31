import { NextResponse } from "next/server";
import { isAdmin } from "@/lib/admin";
import { isSupabaseConfigured } from "@/lib/config";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import { z } from "zod";

const schema = z.object({ post_id: z.string().min(1).max(64) });

export async function DELETE(request: Request) {
  if (!isSupabaseConfigured) return NextResponse.json({ error: "Not configured" }, { status: 501 });

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user || !isAdmin(user.email)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const parsed = schema.safeParse(await request.json().catch(() => ({})));
  if (!parsed.success) return NextResponse.json({ error: "Invalid" }, { status: 400 });

  const admin = createAdminClient();
  const { error } = await admin.from("posts").delete().eq("id", parsed.data.post_id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ ok: true });
}
