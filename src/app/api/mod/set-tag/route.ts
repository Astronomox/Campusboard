import { NextResponse } from "next/server";
import { isAdmin } from "@/lib/admin";
import { isSupabaseConfigured } from "@/lib/config";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import { z } from "zod";

const schema = z.object({
  user_id:    z.string().min(1),
  custom_tag: z.string().max(30).nullable(),
});

export async function POST(request: Request) {
  if (!isSupabaseConfigured) return NextResponse.json({ error: "Not configured" }, { status: 501 });
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user || !isAdmin(user.email)) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  let raw: unknown;
  try { raw = await request.json(); } catch { return NextResponse.json({ error: "Invalid JSON" }, { status: 400 }); }
  const parsed = schema.safeParse(raw);
  if (!parsed.success) return NextResponse.json({ error: "Invalid" }, { status: 400 });
  const admin = createAdminClient();
  await admin.from("members").update({ custom_tag: parsed.data.custom_tag }).eq("user_id", parsed.data.user_id);
  return NextResponse.json({ ok: true });
}
