import Link from "next/link";
import type { ReactNode } from "react";

export function PageShell({
  title,
  back = "/feed",
  children,
  actions,
}: {
  title: string;
  back?: string;
  children: ReactNode;
  actions?: ReactNode;
}) {
  return (
    <div className="page-shell">
      <header className="page-header grain">
        <Link href={back} className="back-btn press" aria-label="Go back">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 12H5M11 6l-6 6 6 6"/>
          </svg>
        </Link>
        <h1 className="page-title">{title}</h1>
        {actions && <div className="page-actions">{actions}</div>}
      </header>
      <main className="page-content">{children}</main>
    </div>
  );
}
