import { NextResponse } from "next/server";
import { isSupabaseConfigured } from "@/lib/config";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  if (!isSupabaseConfigured) {
    return NextResponse.json({ member: true, invitesLeft: 0 });
  }

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ member: false, invitesLeft: 0 });

  const admin = createAdminClient();
  const { data } = await admin
    .from("members")
    .select("invites_left")
    .eq("user_id", user.id)
    .maybeSingle();

  return NextResponse.json({
    member:      data !== null,
    invitesLeft: data?.invites_left ?? 0,
  });
}
