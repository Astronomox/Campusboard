import { NextResponse } from "next/server";
import { isSupabaseConfigured } from "@/lib/config";
import { spendInviteCredit } from "@/lib/invites";
import { createClient } from "@/lib/supabase/server";

export async function POST() {
  if (!isSupabaseConfigured) {
    return NextResponse.json({ code: "DEMO0000" });
  }

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const code = await spendInviteCredit(user.id);
  if (!code) {
    return NextResponse.json(
      { error: "No invite credits. Earn one by publishing 5 more posts." },
      { status: 403 }
    );
  }

  return NextResponse.json({ code });
}
"// v1.0"  
