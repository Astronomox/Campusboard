import { Backdrop } from "@/components/Backdrop";
import { PageShell } from "@/components/ui/PageShell";

export const metadata = { title: "Terms" };


export default function TermsPage() {
  return (
    <>
      <Backdrop />
      <PageShell title="Terms of service" back="/about">
        <div style={{ fontFamily: "var(--disp)", display: "flex", flexDirection: "column", gap: 14 }}>
          {[
            ["Use", "By using CampusBoard you agree to the community rules. Violations may result in a permanent ban."],
            ["Content", "You retain ownership of your posts. By posting, you grant CampusBoard a license to display the content on the platform."],
            ["Availability", "CampusBoard is provided as-is. We make no guarantees about uptime or data preservation."],
            ["Changes", "These terms may change at any time. Continued use means acceptance of the current terms."],
          ].map(([title, body]) => (
            <div key={title} className="campus-row grain" style={{ background: "var(--paper)", flexDirection: "column", alignItems: "flex-start", gap: 6 }}>
              <strong style={{ fontSize: 15 }}>{title}</strong>
              <p style={{ margin: 0, fontSize: 13, opacity: 0.78, lineHeight: 1.6 }}>{body}</p>
            </div>
          ))}
        </div>
      </PageShell>
    </>
  );
}
