import { NextResponse } from "next/server";
import { isAdmin } from "@/lib/admin";
import { isSupabaseConfigured } from "@/lib/config";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import { modBanSchema } from "@/lib/validation";
import { notifyBan } from "@/lib/notifications";

export async function POST(request: Request) {
  if (!isSupabaseConfigured) {
    return NextResponse.json({ error: "Backend not configured" }, { status: 501 });
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user || !isAdmin(user.email)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  let raw: unknown;
  try {
    raw = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }
  const parsed = modBanSchema.safeParse(raw);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid input" }, { status: 400 });
  }
  const { user_id, campus, reason, days } = parsed.data;

  const until = days ? new Date(Date.now() + days * 86_400_000).toISOString() : null;

  const admin = createAdminClient();
  await admin
    .from("bans")
    .upsert(
      { user_id, campus_slug: campus, until, reason: reason || null },
      { onConflict: "user_id,campus_slug" }
    );

  void notifyBan(user_id, reason ?? null, until);
  return NextResponse.json({ ok: true });
}

export async function DELETE(request: Request) {
  if (!isSupabaseConfigured) return NextResponse.json({ error: "Not configured" }, { status: 501 });
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user || !isAdmin(user.email)) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const { user_id } = await request.json() as { user_id: string };
  if (!user_id) return NextResponse.json({ error: "Missing user_id" }, { status: 400 });
  const admin = createAdminClient();
  await admin.from("bans").delete().eq("user_id", user_id);
  return NextResponse.json({ ok: true });
}
"// v1.0"  
