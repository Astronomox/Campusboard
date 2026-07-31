import { isAdmin } from "@/lib/admin";
import { isSupabaseConfigured } from "@/lib/config";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import { AdminShell } from "@/components/ui/AdminShell";
import { ModQueue, type ReportRow } from "@/components/ModQueue";
import type { Category } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function ReportsPage() {
  if (!isSupabaseConfigured) return <div style={{padding:40}}>Not configured.</div>;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user || !isAdmin(user.email)) return <div style={{padding:40}}>Forbidden.</div>;

  const admin = createAdminClient();
  const { data: rData } = await admin.from("reports").select("id,post_id,reason,created_at")
    .eq("status", "open").order("created_at", { ascending: false }).limit(50);
  const rBase = (rData ?? []) as { id: string; post_id: string; reason: string; created_at: string }[];
  const postIds = [...new Set(rBase.map((r) => r.post_id))];
  let rPosts: { id: string; body: string; campus_slug: string; category: Category; user_id: string; status: string }[] = [];
  if (postIds.length) {
    const { data: pData } = await admin.from("posts").select("id,body,campus_slug,category,user_id,status").in("id", postIds);
    rPosts = (pData ?? []) as typeof rPosts;
  }
  const byId = new Map(rPosts.map((p) => [p.id, p]));
  const reports: ReportRow[] = rBase.map((r) => ({ ...r, post: byId.get(r.post_id) ?? null }));

  return (
    <AdminShell title="Open reports" current="/mod/reports">
      <ModQueue flagged={[]} reports={reports} adminEmail={user.email ?? ""} />
    </AdminShell>
  );
}
