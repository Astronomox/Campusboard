import Link from "next/link";
import { Backdrop } from "@/components/Backdrop";
import { PageShell } from "@/components/ui/PageShell";
import { Empty } from "@/components/ui/Empty";
import { isSupabaseConfigured } from "@/lib/config";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

export const dynamic = "force-dynamic";

const EMOJI: Record<string, string> = {
  reaction: "🔥",
  reply:    "💬",
  system:   "📢",
  ban:      "🚫",
};

function timeAgo(iso: string) {
  const s = Math.floor((Date.now() - new Date(iso).getTime()) / 1000);
  if (s < 60)   return "now";
  const m = Math.floor(s / 60);
  if (m < 60)   return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24)   return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}

export default async function NotificationsPage() {
  type Notif = {
    id: string;
    kind: string;
    payload: Record<string, unknown>;
    read: boolean;
    created_at: string;
  };
  let notifs: Notif[] = [];
  let unread = 0;

  if (isSupabaseConfigured) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const admin = createAdminClient();
      const { data } = await admin
        .from("notifications")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(50);
      notifs = (data ?? []) as Notif[];
      unread = notifs.filter((n) => !n.read).length;
      // Mark all as read
      if (unread > 0) {
        void admin.from("notifications").update({ read: true }).eq("user_id", user.id).eq("read", false);
      }
    }
  }

  function renderPayload(kind: string, payload: Record<string, unknown>): string {
    switch (kind) {
      case "reaction":
        return `${payload.reactor ?? "Someone"} reacted ${payload.emoji ?? ""} to your post`;
      case "reply":
        return `New reply on your post`;
      case "ban":
        return `You were banned: ${payload.reason ?? "community rules violation"}`;
      case "system":
        return String(payload.message ?? "System notification");
      default:
        return "New notification";
    }
  }

  return (
    <>
      <Backdrop />
      <PageShell
        title={unread > 0 ? `Notifications (${unread})` : "Notifications"}
        back="/feed"
        actions={
          notifs.length > 0 ? (
            <div style={{ display: "flex", gap: 6 }}>
              <Link href="/notifications/reactions" className="pill press" style={{ background: "var(--rant)", textDecoration: "none", fontSize: 11 }}>🔥</Link>
              <Link href="/notifications/system" className="pill press" style={{ background: "var(--info)", textDecoration: "none", fontSize: 11 }}>📢</Link>
            </div>
          ) : null
        }
      >
        {notifs.length === 0 ? (
          <Empty icon="🔔" title="No notifications" body="Reactions and replies to your posts will appear here." />
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {notifs.map((n) => (
              <div
                key={n.id}
                className="campus-row grain"
                style={{
                  background: !n.read ? "var(--callout)" : "var(--paper)",
                  flexDirection: "column",
                  alignItems: "flex-start",
                  gap: 4,
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 8, width: "100%" }}>
                  <span style={{ fontSize: 18 }}>{EMOJI[n.kind] ?? "🔔"}</span>
                  <span style={{ fontFamily: "var(--disp)", fontWeight: 700, fontSize: 14, flex: 1 }}>
                    {renderPayload(n.kind, n.payload)}
                  </span>
                  <span style={{ fontSize: 11, opacity: 0.6, fontFamily: "var(--disp)" }}>
                    {timeAgo(n.created_at)}
                  </span>
                </div>
                {n.payload.post_preview != null && (
                  <p style={{ margin: "4px 0 0 28px", fontSize: 12, opacity: 0.7, lineHeight: 1.4 }}>
                    &ldquo;{String(n.payload.post_preview).slice(0, 80)}&rdquo;
                  </p>
                )}
                {n.payload.post_id != null && (
                  <Link
                    href={`/post/${String(n.payload.post_id)}`}
                    style={{ marginLeft: 28, fontSize: 12, fontFamily: "var(--disp)", fontWeight: 700, color: "var(--ink)" }}
                  >
                    View post →
                  </Link>
                )}
              </div>
            ))}
          </div>
        )}
      </PageShell>
    </>
  );
}
