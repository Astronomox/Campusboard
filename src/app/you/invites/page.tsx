import { Backdrop } from "@/components/Backdrop";
import { PageShell } from "@/components/ui/PageShell";
import { isSupabaseConfigured } from "@/lib/config";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

export const dynamic = "force-dynamic";

export default async function InvitesPage() {
  let invitesLeft = 0;
  let given: { code: string; created_at: string; redeemed_by: string | null }[] = [];

  if (isSupabaseConfigured) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const admin = createAdminClient();
      const [{ data: m }, { data: inv }] = await Promise.all([
        admin.from("members").select("invites_left").eq("user_id", user.id).maybeSingle(),
        admin.from("invites").select("code, created_at, redeemed_by").eq("created_by", user.id).order("created_at", { ascending: false }),
      ]);
      invitesLeft = m?.invites_left ?? 0;
      given = (inv ?? []) as typeof given;
    }
  }

  return (
    <>
      <Backdrop />
      <PageShell title="Your invites" back="/unilag?tab=you">
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div className="stat grain" style={{ background: "var(--shoutout)", textAlign: "center" }}>
            <div className="num">{invitesLeft}</div>
            <div className="lbl">Invite credits available</div>
          </div>
          <p style={{ fontFamily: "var(--disp)", fontSize: 13, opacity: 0.65 }}>
            You earn 1 invite credit every 5 published posts. Use them on the You tab.
          </p>
          {given.length > 0 && (
            <div>
              <h3 style={{ fontFamily: "var(--disp)", fontSize: 16, margin: "0 0 10px" }}>Codes you&apos;ve given ({given.length})</h3>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {given.map((inv) => (
                  <div key={inv.code} className="campus-row grain" style={{ background: inv.redeemed_by ? "var(--shoutout)" : "var(--paper)", fontFamily: "monospace", fontSize: 16, letterSpacing: "0.1em", fontWeight: 700 }}>
                    {inv.code}
                    <span style={{ fontFamily: "var(--disp)", fontSize: 11, fontWeight: 600, opacity: 0.6, letterSpacing: 0, marginLeft: "auto" }}>
                      {inv.redeemed_by ? "Used ✓" : "Unused"}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </PageShell>
    </>
  );
}
