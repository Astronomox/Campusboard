import { Backdrop } from "@/components/Backdrop";
import { PageShell } from "@/components/ui/PageShell";

export const metadata = { title: "Contact" };


export default function ContactPage() {
  return (
    <>
      <Backdrop />
      <PageShell title="Contact" back="/about">
        <div style={{ fontFamily: "var(--disp)", display: "flex", flexDirection: "column", gap: 14 }}>
          <div className="campus-row grain" style={{ background: "var(--info)", flexDirection: "column", alignItems: "flex-start", gap: 6 }}>
            <strong>Critical issues</strong>
            <p style={{ margin: 0, fontSize: 13, opacity: 0.85, lineHeight: 1.5 }}>For urgent safety issues (threats, doxxing, abuse), reach the admin directly through a trusted UNILAG channel. Response within 24 hours.</p>
          </div>
          <div className="campus-row grain" style={{ background: "var(--paper)", flexDirection: "column", alignItems: "flex-start", gap: 6 }}>
            <strong>Moderation appeals</strong>
            <p style={{ margin: 0, fontSize: 13, opacity: 0.75, lineHeight: 1.5 }}>If you believe your post was incorrectly rejected, reach out through your invite contact. Include your anon tag and the post content.</p>
          </div>
        </div>
      </PageShell>
    </>
  );
}
