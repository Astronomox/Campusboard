import { Backdrop } from "@/components/Backdrop";
import { PageShell } from "@/components/ui/PageShell";

export const metadata = { title: "How it works" };


const STEPS = [
  { n: "1", label: "Get invited", body: "A verified UNILAG student gives you an invite code.", color: "var(--callout)" },
  { n: "2", label: "Sign in", body: "Sign in with your Google account. Your identity stays private.", color: "var(--info)" },
  { n: "3", label: "Enter your code", body: "Enter the invite code once. After that, you're a permanent member.", color: "var(--shoutout)" },
  { n: "4", label: "Post anonymously", body: "Every post goes through AI moderation before it appears. Your name never shows.", color: "var(--pink)" },
  { n: "5", label: "Earn invites", body: "Publish 5 posts and you earn an invite to share with another UNILAG student.", color: "var(--purple)" },
];

export default function HowItWorksPage() {
  return (
    <>
      <Backdrop />
      <PageShell title="How it works" back="/about">
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {STEPS.map((s) => (
            <div key={s.n} className="campus-row grain" style={{ background: s.color, alignItems: "flex-start", flexDirection: "column", gap: 4 }}>
              <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                <span className="sticker">{s.n}</span>
                <strong style={{ fontFamily: "var(--disp)", fontSize: 15 }}>{s.label}</strong>
              </div>
              <p style={{ margin: "4px 0 0", fontSize: 13, opacity: 0.8, lineHeight: 1.5 }}>{s.body}</p>
            </div>
          ))}
        </div>
      </PageShell>
    </>
  );
}
