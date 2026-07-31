import { Backdrop } from "@/components/Backdrop";
import { PageShell } from "@/components/ui/PageShell";

export const metadata = { title: "FAQ" };


const FAQS = [
  { q: "Is my identity really hidden?", a: "Yes. Posts show a stable anonymous tag — the same one every time on this campus — but it's derived from a one-way hash. Nobody can reverse it to find your name." },
  { q: "Why was my post rejected?", a: "AI moderation rejected it before it reached the feed. Common reasons: spam, slurs, threats, or too many external links. Check the community rules." },
  { q: "How do I earn invites?", a: "Publish 5 posts and you earn one invite credit, up to a maximum of 3 at a time. Use them on the You tab." },
  { q: "Can I delete a post?", a: "Not directly — reach out through the contact page and a moderator can remove it." },
  { q: "What happens if I'm banned?", a: "You can still browse the feed but you can't post or react. Bans can be permanent or temporary." },
  { q: "Is this affiliated with UNILAG?", a: "No. CampusBoard is student-built and student-run. It is not an official UNILAG platform." },
];

export default function FAQPage() {
  return (
    <>
      <Backdrop />
      <PageShell title="FAQ" back="/about">
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {FAQS.map((f) => (
            <div key={f.q} className="campus-row grain" style={{ background: "var(--paper)", flexDirection: "column", alignItems: "flex-start", gap: 6 }}>
              <strong style={{ fontFamily: "var(--disp)", fontSize: 14 }}>{f.q}</strong>
              <p style={{ margin: 0, fontSize: 13, opacity: 0.75, lineHeight: 1.55 }}>{f.a}</p>
            </div>
          ))}
        </div>
      </PageShell>
    </>
  );
}
