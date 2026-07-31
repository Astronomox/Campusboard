import { NextResponse } from "next/server";
import { isSupabaseConfigured } from "@/lib/config";
import { withinRateLimit } from "@/lib/ratelimit";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import { reportSchema } from "@/lib/validation";

const REPORT_MAX = 10;
const REPORT_WINDOW = 300;

export async function POST(request: Request) {
  if (!isSupabaseConfigured) {
    return NextResponse.json({ ok: true });
  }

  let raw: unknown;
  try {
    raw = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = reportSchema.safeParse(raw);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid input" }, { status: 400 });
  }
  const { post_id, reason } = parsed.data;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const admin = createAdminClient();
  const allowed = await withinRateLimit(admin, "reports", "reporter", user.id, REPORT_MAX, REPORT_WINDOW);
  if (!allowed) {
    return NextResponse.json({ error: "Too many reports. Try again later." }, { status: 429 });
  }

  // One report per user per post; a duplicate is a no-op, not an error.
  const { error } = await supabase
    .from("reports")
    .insert({ post_id, reporter: user.id, reason });
  if (error && error.code !== "23505") {
    return NextResponse.json({ error: "Could not file report" }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
"// v1.0"  
