import { isAdmin } from "@/lib/admin";
import { isSupabaseConfigured } from "@/lib/config";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import { AdminShell } from "@/components/ui/AdminShell";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function BanDetailPage({ params }: { params: Promise<{ userId: string }> }) {
  if (!isSupabaseConfigured) return <div style={{padding:40}}>Not configured.</div>;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user || !isAdmin(user.email)) return <div style={{padding:40}}>Forbidden.</div>;

  const { userId } = await params;
  const admin = createAdminClient();
  const { data: ban } = await admin.from("bans").select("*").eq("user_id", userId).maybeSingle();
  if (!ban) notFound();

  const b = ban as { user_id: string; reason: string | null; until: string | null; created_at: string };

  return (
    <AdminShell title="Ban detail" current="/mod/bans">
      <div className="astat-row">
        <div className="astat"><div className="n" style={{ fontSize: 13 }}>{b.user_id.slice(0,8)}…</div><div className="l">User ID</div></div>
        <div className="astat"><div className="n" style={{ fontSize: 14 }}>{b.reason ?? "No reason"}</div><div className="l">Reason</div></div>
        <div className="astat"><div className="n" style={{ fontSize: 14 }}>{b.until ? new Date(b.until).toLocaleDateString() : "Permanent"}</div><div className="l">Expires</div></div>
      </div>
      <form action={`/api/mod/ban`} method="post">
        <button type="button" className="post-btn press" style={{ background: "var(--shoutout)" }}
          onClick={async () => {
            await fetch("/api/mod/ban", {
              method: "DELETE",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ user_id: userId }),
            });
            window.location.href = "/mod/bans";
          }}>
          Lift ban
        </button>
      </form>
    </AdminShell>
  );
}
