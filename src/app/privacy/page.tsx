import { Backdrop } from "@/components/Backdrop";
import { PageShell } from "@/components/ui/PageShell";

export const metadata = { title: "Privacy" };


export default function PrivacyPage() {
  return (
    <>
      <Backdrop />
      <PageShell title="Privacy policy" back="/about">
        <div style={{ fontFamily: "var(--disp)", display: "flex", flexDirection: "column", gap: 16 }}>
          {[
            ["What we collect", "Your Google account email (to verify your account and enforce bans), and the posts you submit. We never store your name or profile picture."],
            ["Anonymity model", "Posts display a stable anonymous tag derived from a one-way hash of your account ID. No one — including the admin — can reverse this to find your identity from the tag alone."],
            ["Data retention", "Posts are stored indefinitely unless deleted by a moderator. You can request deletion of your account and posts at any time via the settings page."],
            ["NDPR compliance", "This service complies with Nigeria's National Data Protection Regulation. You have the right to access, correct, and delete your personal data."],
            ["Third parties", "We use Supabase for database and auth, and Google for sign-in. No other personal data is shared with third parties."],
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
