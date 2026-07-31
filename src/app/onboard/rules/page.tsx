import Link from "next/link";
import { Backdrop } from "@/components/Backdrop";

const RULES = [
  { n: "1", title: "No hate speech", body: "No content targeting people based on ethnicity, gender, religion, or sexuality." },
  { n: "2", title: "No spam", body: "One post per topic. Repeated identical posts will be removed and your account flagged." },
  { n: "3", title: "No doxxing", body: "Never post personal information about real people without their consent." },
  { n: "4", title: "No threats", body: "Any direct or implied threat of violence results in a permanent ban." },
  { n: "5", title: "UNILAG only", body: "Keep posts relevant to UNILAG campus life. Off-topic posts will be removed." },
  { n: "6", title: "Guard your invite", body: "Only invite people you trust. You are accountable for who you bring in." },
];

export default function RulesPage() {
  return (
    <>
      <Backdrop />
      <main className="picker" style={{ justifyContent: "flex-start", paddingTop: 48 }}>
        <div className="picker-head">
          <h1 className="picker-title">Community Rules</h1>
          <p className="picker-sub">Read these before posting.</p>
        </div>
        <div style={{ width: "100%", maxWidth: 420, display: "flex", flexDirection: "column", gap: 10 }}>
          {RULES.map((r) => (
            <div key={r.n} className="campus-row grain" style={{ background: "var(--paper)", alignItems: "flex-start", flexDirection: "column", gap: 4 }}>
              <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                <span className="sticker">{r.n}</span>
                <strong style={{ fontFamily: "var(--disp)", fontSize: 15 }}>{r.title}</strong>
              </div>
              <p style={{ margin: "4px 0 0", fontSize: 13, opacity: 0.75, lineHeight: 1.5 }}>{r.body}</p>
            </div>
          ))}
          <Link href="/onboard/setup" className="post-btn press" style={{ justifyContent: "center", textDecoration: "none", padding: "14px", marginTop: 8 }}>
            I agree — set up my account →
          </Link>
        </div>
      </main>
    </>
  );
}
