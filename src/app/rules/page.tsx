import { Backdrop } from "@/components/Backdrop";
import { PageShell } from "@/components/ui/PageShell";

export const metadata = { title: "Rules" };


const RULES = [
  { n: "1", title: "No hate speech", body: "No content targeting people based on ethnicity, gender, religion, or sexuality." },
  { n: "2", title: "No spam", body: "Repeated identical posts will be removed and your account flagged." },
  { n: "3", title: "No doxxing", body: "Never post personal information about real people without their consent." },
  { n: "4", title: "No threats", body: "Any direct or implied threat of violence results in a permanent ban." },
  { n: "5", title: "UNILAG only", body: "Keep posts relevant to UNILAG campus life." },
  { n: "6", title: "Guard your invite", body: "You are accountable for who you invite. Invites can be revoked." },
];

export default function RulesPage() {
  return (
    <>
      <Backdrop />
      <PageShell title="Community rules" back="/about">
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {RULES.map((r) => (
            <div key={r.n} className="campus-row grain" style={{ background: "var(--paper)", alignItems: "flex-start", flexDirection: "column", gap: 4 }}>
              <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                <span className="sticker">{r.n}</span>
                <strong style={{ fontFamily: "var(--disp)", fontSize: 15 }}>{r.title}</strong>
              </div>
              <p style={{ margin: "4px 0 0", fontSize: 13, opacity: 0.75, lineHeight: 1.5 }}>{r.body}</p>
            </div>
          ))}
        </div>
      </PageShell>
    </>
  );
}
