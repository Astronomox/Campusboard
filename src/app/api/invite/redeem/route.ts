import { NextResponse } from "next/server";
import { isSupabaseConfigured } from "@/lib/config";
import { isMember, redeemInvite } from "@/lib/invites";
import { createClient } from "@/lib/supabase/server";
import { z } from "zod";

const schema = z.object({ code: z.string().min(1).max(16) });

export async function POST(request: Request) {
  if (!isSupabaseConfigured) {
    return NextResponse.json({ ok: true }); // demo passthrough
  }

  let raw: unknown;
  try { raw = await request.json(); }
  catch { return NextResponse.json({ error: "Invalid JSON" }, { status: 400 }); }

  const parsed = schema.safeParse(raw);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid input" }, { status: 400 });
  }

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  if (await isMember(user.id)) {
    return NextResponse.json({ ok: true, already: true });
  }

  const result = await redeemInvite(user.id, parsed.data.code);
  if (!result.ok) {
    return NextResponse.json({ error: result.error }, { status: 422 });
  }

  return NextResponse.json({ ok: true });
}
"// v1.0"  
