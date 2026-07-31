import Link from "next/link";
import { Backdrop } from "@/components/Backdrop";
import { PageShell } from "@/components/ui/PageShell";

export const metadata = { title: "About" };


export default function AboutPage() {
  return (
    <>
      <Backdrop />
      <PageShell title="About CampusBoard" back="/feed">
        <div style={{ display: "flex", flexDirection: "column", gap: 14, fontFamily: "var(--disp)" }}>
          <div className="campus-row grain" style={{ background: "var(--paper)", flexDirection: "column", alignItems: "flex-start", gap: 8 }}>
            <strong style={{ fontSize: 17 }}>What is CampusBoard?</strong>
            <p style={{ margin: 0, fontSize: 14, opacity: 0.8, lineHeight: 1.6 }}>CampusBoard is an anonymous discussion board for UNILAG students. Every post is moderated before it appears. Real identities are never shown.</p>
          </div>
          <div className="campus-row grain" style={{ background: "var(--info)", flexDirection: "column", alignItems: "flex-start", gap: 8 }}>
            <strong style={{ fontSize: 17 }}>Who runs it?</strong>
            <p style={{ margin: 0, fontSize: 14, opacity: 0.85, lineHeight: 1.6 }}>Built and maintained by UNILAG students for UNILAG students. Contact via the <Link href="/contact" style={{ color: "var(--ink)", fontWeight: 700 }}>contact page</Link>.</p>
          </div>
          <div className="campus-row grain" style={{ background: "var(--shoutout)", flexDirection: "column", alignItems: "flex-start", gap: 8 }}>
            <strong style={{ fontSize: 17 }}>Invite-only</strong>
            <p style={{ margin: 0, fontSize: 14, opacity: 0.85, lineHeight: 1.6 }}>You need an invite from a verified UNILAG student to join. This keeps the board for the campus community only.</p>
          </div>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            <Link href="/how-it-works" className="pill press" style={{ textDecoration: "none", background: "var(--paper)" }}>How it works →</Link>
            <Link href="/rules" className="pill press" style={{ textDecoration: "none", background: "var(--callout)" }}>Community rules →</Link>
          </div>
        </div>
      </PageShell>
    </>
  );
}
