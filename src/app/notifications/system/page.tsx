import { Backdrop } from "@/components/Backdrop";
import { PageShell } from "@/components/ui/PageShell";
import { Empty } from "@/components/ui/Empty";
import { isSupabaseConfigured } from "@/lib/config";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

export const dynamic = "force-dynamic";

export default async function SystemNotifsPage() {
  type Notif = { id: string; kind: string; payload: Record<string,unknown>; created_at: string };
  let notifs: Notif[] = [];

  if (isSupabaseConfigured) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const admin = createAdminClient();
      const { data } = await admin.from("notifications").select("*")
        .eq("user_id", user.id).in("kind", ["system", "ban"])
        .order("created_at", { ascending: false }).limit(50);
      notifs = (data ?? []) as Notif[];
    }
  }

  return (
    <>
      <Backdrop />
      <PageShell title="System notifications" back="/notifications">
        {notifs.length === 0
          ? <Empty icon="⚙️" title="No system notifications" body="Mod actions and announcements will appear here." />
          : <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {notifs.map((n) => (
                <div key={n.id} className="campus-row grain" style={{ background: n.kind === "ban" ? "var(--rant)" : "var(--info)", flexDirection: "column", alignItems: "flex-start", gap: 4 }}>
                  <strong style={{ fontFamily: "var(--disp)", fontSize: 14 }}>{n.kind === "ban" ? "🚫 Banned" : "📢 System"}</strong>
                  <p style={{ margin: 0, fontSize: 13, opacity: 0.85 }}>{String(n.payload.reason ?? n.payload.message ?? "")}</p>
                </div>
              ))}
            </div>
        }
      </PageShell>
    </>
  );
}
