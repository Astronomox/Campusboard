import { isAdmin } from "@/lib/admin";
import { isSupabaseConfigured } from "@/lib/config";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import { AdminShell } from "@/components/ui/AdminShell";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function ReportDetailPage({ params }: { params: Promise<{ id: string }> }) {
  if (!isSupabaseConfigured) return <div style={{padding:40}}>Not configured.</div>;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user || !isAdmin(user.email)) return <div style={{padding:40}}>Forbidden.</div>;

  const { id } = await params;
  const admin = createAdminClient();
  const { data: report } = await admin.from("reports").select("*, post:posts(*)").eq("id", id).maybeSingle();
  if (!report) notFound();

  return (
    <AdminShell title="Report detail" current="/mod/reports">
      <div style={{ maxWidth: 560, display: "flex", flexDirection: "column", gap: 14 }}>
        <div className="astat"><div className="n" style={{ fontSize: 15 }}>{(report as {reason:string}).reason}</div><div className="l">Reason</div></div>
        <div className="astat"><div className="n" style={{ fontSize: 14 }}>{((report as {post?: {body?: string}}).post as {body?: string})?.body?.slice(0,200) ?? "Post unavailable"}</div><div className="l">Post body</div></div>
        <div style={{ display: "flex", gap: 8 }}>
          <a href={`/mod/post/${(report as {post_id: string}).post_id}`} className="post-btn press" style={{ textDecoration: "none" }}>View post →</a>
        </div>
      </div>
    </AdminShell>
  );
}
