import { NextResponse } from "next/server";
import { isAdmin } from "@/lib/admin";
import { isSupabaseConfigured } from "@/lib/config";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import { modDecisionSchema } from "@/lib/validation";

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
  const parsed = modDecisionSchema.safeParse(raw);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid input" }, { status: 400 });
  }
  const { post_id, action } = parsed.data;

  const admin = createAdminClient();
  const status = action === "approve" ? "published" : "rejected";
  await admin.from("posts").update({ status }).eq("id", post_id);
  // Resolve any open reports on this post.
  await admin.from("reports").update({ status: "resolved" }).eq("post_id", post_id).eq("status", "open");

  return NextResponse.json({ ok: true, status });
}
"// v1.0"  
