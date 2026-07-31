import Link from "next/link";
import type { ReactNode } from "react";

const NAV = [
  { href: "/mod",                    label: "Overview" },
  { href: "/mod/queue",              label: "Queue" },
  { href: "/mod/reports",            label: "Reports" },
  { href: "/mod/bans",               label: "Bans" },
  { href: "/mod/members",            label: "Members" },
  { href: "/mod/invites",            label: "Invites" },
  { href: "/mod/announcements",      label: "Announcements" },
  { href: "/mod/content/wordlist",   label: "Wordlist" },
  { href: "/mod/stats",              label: "Stats" },
];

export function AdminShell({
  title,
  children,
  current,
}: {
  title: string;
  children: ReactNode;
  current: string;
}) {
  return (
    <div className="admin-shell">
      <aside className="admin-sidebar">
        <div className="admin-logo">
          <Link href="/feed" className="admin-back">← Board</Link>
          <span className="admin-brand">MOD</span>
        </div>
        <nav className="admin-nav">
          {NAV.map((n) => (
            <Link
              key={n.href}
              href={n.href}
              className={current === n.href ? "admin-link on" : "admin-link"}
            >
              {n.label}
            </Link>
          ))}
        </nav>
      </aside>
      <div className="admin-body">
        <header className="admin-header">
          <h1 className="admin-title">{title}</h1>
        </header>
        <main className="admin-main">{children}</main>
      </div>
    </div>
  );
}
