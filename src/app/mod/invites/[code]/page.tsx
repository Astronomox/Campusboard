import { isAdmin } from "@/lib/admin";
import { isSupabaseConfigured } from "@/lib/config";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import { AdminShell } from "@/components/ui/AdminShell";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function InviteDetailPage({ params }: { params: Promise<{ code: string }> }) {
  if (!isSupabaseConfigured) return <div style={{padding:40}}>Not configured.</div>;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user || !isAdmin(user.email)) return <div style={{padding:40}}>Forbidden.</div>;

  const { code } = await params;
  const admin = createAdminClient();
  const { data: inv } = await admin.from("invites").select("*").eq("code", code.toUpperCase()).maybeSingle();
  if (!inv) notFound();

  const i = inv as { code: string; created_by: string | null; redeemed_by: string | null; redeemed_at: string | null; created_at: string };
  return (
    <AdminShell title={`Invite: ${i.code}`} current="/mod/invites">
      <div className="astat-row">
        <div className="astat"><div className="n" style={{ fontFamily: "monospace", fontSize: 20 }}>{i.code}</div><div className="l">Code</div></div>
        <div className="astat"><div className="n" style={{ fontSize: 13 }}>{i.redeemed_by ? "Used ✓" : "Available"}</div><div className="l">Status</div></div>
        <div className="astat"><div className="n" style={{ fontSize: 13 }}>{i.redeemed_at ? new Date(i.redeemed_at).toLocaleDateString() : "—"}</div><div className="l">Redeemed at</div></div>
      </div>
    </AdminShell>
  );
}
