import Link from "next/link";
import { Backdrop } from "@/components/Backdrop";
import { PageShell } from "@/components/ui/PageShell";

export const metadata = { title: "Settings" };


const SETTINGS = [
  { href: "/you/settings/display",       label: "Display",       sub: "Text size, theme, motion" },
  { href: "/you/settings/notifications", label: "Notifications", sub: "Push notification prefs" },
  { href: "/you/settings/privacy",       label: "Privacy",       sub: "Who sees your activity" },
  { href: "/you/settings/account",       label: "Account",       sub: "Delete account, export data" },
];

export default function SettingsPage() {
  return (
    <>
      <Backdrop />
      <PageShell title="Settings" back="/unilag?tab=you">
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {SETTINGS.map((s) => (
            <Link key={s.href} href={s.href} className="campus-row grain press"
              style={{ background: "var(--paper)", textDecoration: "none" }}>
              <div style={{ flex: 1 }}>
                <div className="cr-name">{s.label}</div>
                <div className="cr-full">{s.sub}</div>
              </div>
              <span className="cr-arrow" style={{ background: "var(--paper)" }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#1a1a1a" strokeWidth="2.5" strokeLinecap="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg>
              </span>
            </Link>
          ))}
        </div>
      </PageShell>
    </>
  );
}
