import { NextResponse } from "next/server";
import { isAdmin } from "@/lib/admin";
import { isSupabaseConfigured } from "@/lib/config";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import { z } from "zod";

export async function GET(request: Request) {
  if (!isSupabaseConfigured) return NextResponse.json({ error: "Not configured" }, { status: 501 });
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user || !isAdmin(user.email)) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { searchParams } = new URL(request.url);
  const parsed = z.string().min(1).safeParse(searchParams.get("userId"));
  if (!parsed.success) return NextResponse.json({ error: "Invalid" }, { status: 400 });

  const admin = createAdminClient();
  const [{ data: member }, { data: posts }] = await Promise.all([
    admin.from("members").select("*").eq("user_id", parsed.data).maybeSingle(),
    admin.from("posts").select("id,body,category,status,created_at").eq("user_id", parsed.data)
      .order("created_at", { ascending: false }).limit(50),
  ]);
  return NextResponse.json({ member, posts: posts ?? [] });
}
"// v1.0"  
