import { NextResponse } from "next/server";
import { isAdmin } from "@/lib/admin";
import { isSupabaseConfigured } from "@/lib/config";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  if (!isSupabaseConfigured) return NextResponse.json({ error: "Not configured" }, { status: 501 });
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user || !isAdmin(user.email)) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const admin = createAdminClient();
  const [{ count: total }, { count: published }, { count: rejected }, { count: members }] = await Promise.all([
    admin.from("posts").select("*", { count: "exact", head: true }),
    admin.from("posts").select("*", { count: "exact", head: true }).eq("status", "published"),
    admin.from("posts").select("*", { count: "exact", head: true }).eq("status", "rejected"),
    admin.from("members").select("*", { count: "exact", head: true }),
  ]);
  const csv = [
    "metric,value",
    `total_posts,${total ?? 0}`,
    `published,${published ?? 0}`,
    `rejected,${rejected ?? 0}`,
    `members,${members ?? 0}`,
    `exported_at,${new Date().toISOString()}`,
  ].join("\n");
  return new NextResponse(csv, { headers: { "Content-Type": "text/csv", "Content-Disposition": 'attachment; filename="stats.csv"' } });
}
"// v1.0"  
