import { isAdmin } from "@/lib/admin";
import { isSupabaseConfigured } from "@/lib/config";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import { AdminShell } from "@/components/ui/AdminShell";
import { InviteManager } from "@/components/ModQueue";

export const dynamic = "force-dynamic";

export default async function ModInvitesPage() {
  if (!isSupabaseConfigured) return <div style={{padding:40}}>Not configured.</div>;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user || !isAdmin(user.email)) return <div style={{padding:40}}>Forbidden.</div>;

  const admin = createAdminClient();
  const { data } = await admin.from("invites").select("code,redeemed_by,created_at")
    .order("created_at", { ascending: false }).limit(200);
  const total = (data ?? []).length;
  const redeemed = (data ?? []).filter((r: { redeemed_by: string | null }) => r.redeemed_by).length;

  return (
    <AdminShell title="Invites" current="/mod/invites">
      <div className="astat-row">
        <div className="astat accent"><div className="n">{total}</div><div className="l">Total codes</div></div>
        <div className="astat"><div className="n">{redeemed}</div><div className="l">Redeemed</div></div>
        <div className="astat"><div className="n">{total - redeemed}</div><div className="l">Available</div></div>
      </div>
      <InviteManager />
    </AdminShell>
  );
}
