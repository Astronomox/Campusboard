import { NextResponse } from "next/server";
import { isAdmin } from "@/lib/admin";
import { isSupabaseConfigured } from "@/lib/config";
import { generateCode } from "@/lib/invites";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import { z } from "zod";

const schema = z.object({ count: z.coerce.number().int().min(1).max(200).default(10) });

/** GET  — list unredeemed codes (admin only). */
export async function GET() {
  if (!isSupabaseConfigured) return NextResponse.json({ codes: [] });

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user || !isAdmin(user.email)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const admin = createAdminClient();
  const { data } = await admin
    .from("invites")
    .select("code, created_at")
    .is("redeemed_by", null)
    .order("created_at", { ascending: false })
    .limit(200);

  return NextResponse.json({ codes: (data ?? []).map((r: { code: string }) => r.code) });
}

/** POST — generate N admin-seeded invite codes (admin only). */
export async function POST(request: Request) {
  if (!isSupabaseConfigured) return NextResponse.json({ error: "Not configured" }, { status: 501 });

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user || !isAdmin(user.email)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  let raw: unknown;
  try { raw = await request.json(); } catch { raw = {}; }
  const parsed = schema.safeParse(raw);
  const count = parsed.success ? parsed.data.count : 10;

  const admin  = createAdminClient();
  const codes  = Array.from({ length: count }, () => ({ code: generateCode(), created_by: null }));
  await admin.from("invites").insert(codes);

  return NextResponse.json({ codes: codes.map((c) => c.code) });
}
"// v1.0"  
