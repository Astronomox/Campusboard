import { Backdrop } from "@/components/Backdrop";
import { PageShell } from "@/components/ui/PageShell";
import { Empty } from "@/components/ui/Empty";
import { isSupabaseConfigured } from "@/lib/config";
import { createAdminClient } from "@/lib/supabase/admin";

export const dynamic = "force-dynamic";

export default async function GiversPage() {
  type Row = { user_id: string; anon_tag: string | null; count: number };
  let givers: Row[] = [];

  if (isSupabaseConfigured) {
    const admin = createAdminClient();
    // Count reactions given per user, join with members for tag
    const { data } = await admin
      .from("reactions")
      .select("user_id")
      .limit(1000);

    if (data?.length) {
      const counts = new Map<string, number>();
      (data as { user_id: string }[]).forEach((r) => {
        counts.set(r.user_id, (counts.get(r.user_id) ?? 0) + 1);
      });

      const sorted = [...counts.entries()]
        .sort((a, b) => b[1] - a[1])
        .slice(0, 20);

      const { data: members } = await admin
        .from("members")
        .select("user_id, custom_tag")
        .in("user_id", sorted.map(([id]) => id));

      const tagMap = new Map(
        (members ?? []).map((m: { user_id: string; custom_tag: string | null }) => [m.user_id, m.custom_tag])
      );

      givers = sorted.map(([user_id, count]) => ({
        user_id,
        anon_tag: tagMap.get(user_id) ?? null,
        count,
      }));
    }
  }

  const MEDALS = ["🥇", "🥈", "🥉"];
  const COLORS = ["var(--callout)", "var(--info)", "var(--pink)"];

  return (
    <>
      <Backdrop />
      <PageShell title="Top reactors" back="/leaderboard">
        {givers.length === 0 ? (
          <Empty icon="💯" title="No data yet" body="React to posts to appear here." />
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {givers.map((g, i) => (
              <div
                key={g.user_id}
                className="campus-row grain"
                style={{ background: COLORS[i] ?? "var(--paper)" }}
              >
                <span style={{ fontSize: 22, minWidth: 32 }}>{MEDALS[i] ?? `${i + 1}`}</span>
                <div style={{ flex: 1 }}>
                  <div className="cr-name" style={{ fontFamily: "monospace" }}>
                    {g.anon_tag ?? `Anon`}
                  </div>
                  <div className="cr-full">{g.count} reactions given</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </PageShell>
    </>
  );
}
"// v1.0"  
