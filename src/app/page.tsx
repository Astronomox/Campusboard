import Link from "next/link";
import type { Metadata } from "next";
import { Backdrop } from "@/components/Backdrop";
import { CampusCrest } from "@/components/CampusCrest";

export const metadata: Metadata = {
  title: "CampusBoard — UNILAG's anonymous board",
  description:
    "Anonymous, moderated discussion board exclusively for UNILAG students. Say what you actually think. Invite-only.",
};

export default function LandingPage() {
  return (
    <>
      <Backdrop />
      <div className="land">

        {/* ── Top bar ── */}
        <header className="land-nav grain">
          <div className="land-nav-inner">
            <div className="land-logo">
              <CampusCrest slug="unilag" size={28} />
              <span>CampusBoard</span>
            </div>
            <div className="land-nav-links">
              <Link href="/about" className="land-nav-link">About</Link>
              <Link href="/rules" className="land-nav-link">Rules</Link>
              <Link href="/auth/login" className="land-cta-sm press">Sign in</Link>
            </div>
          </div>
        </header>

        {/* ── Hero ── */}
        <section className="land-hero">
          <div className="land-hero-tag">
            <span className="sticker" style={{ background: "var(--rant)", transform: "rotate(-2deg)", display: "inline-block" }}>
              UNILAG ONLY
            </span>
          </div>
          <h1 className="land-h1">
            Say what<br />
            you actually<br />
            <span className="land-h1-accent">think.</span>
          </h1>
          <p className="land-sub">
            CampusBoard is an anonymous, moderated discussion board built
            exclusively for UNILAG students. No names. No profiles. Just the board.
          </p>
          <div className="land-hero-cta">
            <Link href="/auth/login" className="post-btn press land-btn-lg">
              Get started →
            </Link>
            <Link href="/how-it-works" className="pill press land-btn-sec">
              How it works
            </Link>
          </div>
        </section>

        {/* ── Feature cards ── */}
        <section className="land-features">
          {[
            {
              color: "var(--rant)",
              icon: "🎭",
              title: "Actually anonymous",
              body: "Your name never appears. Posts carry a rotating tag — same person, same tag on this campus — but nobody, not even the admin, sees who you are.",
              rotate: "-2deg",
            },
            {
              color: "var(--shoutout)",
              icon: "🤖",
              title: "AI moderation",
              body: "Every post passes an AI gate before it reaches the feed. Hate speech, threats, and spam get blocked automatically. Good takes get through.",
              rotate: "1.5deg",
            },
            {
              color: "var(--callout)",
              icon: "🎟️",
              title: "Invite only",
              body: "UNILAG students only. You need an invite from a verified student to join. Earn your own invites to share once you start posting.",
              rotate: "-1deg",
            },
            {
              color: "var(--info)",
              icon: "⚡",
              title: "One post at a time",
              body: "The feed is a swipeable stack — no infinite scroll, no algorithmic rabbit holes. Just the next post.",
              rotate: "2deg",
            },
          ].map((f) => (
            <div
              key={f.title}
              className="land-card grain"
              style={{ background: f.color, transform: `rotate(${f.rotate})` }}
            >
              <span className="land-card-icon">{f.icon}</span>
              <h3 className="land-card-title">{f.title}</h3>
              <p className="land-card-body">{f.body}</p>
            </div>
          ))}
        </section>

        {/* ── How it works ── */}
        <section className="land-how">
          <div className="land-section-head">
            <h2 className="land-h2">How it works</h2>
          </div>
          <div className="land-steps">
            {[
              { n: "01", color: "var(--callout)", label: "Get invited", body: "A verified UNILAG student gives you an 8-character invite code." },
              { n: "02", color: "var(--info)",    label: "Sign in",     body: "Sign in with your Google account. Your identity stays private." },
              { n: "03", color: "var(--pink)",    label: "Enter code",  body: "Enter the invite code once. You&apos;re a permanent member after that." },
              { n: "04", color: "var(--shoutout)",label: "Post freely", body: "Post anonymously. React. Report bad content. Earn invites to share." },
            ].map((s) => (
              <div key={s.n} className="land-step grain" style={{ background: s.color }}>
                <div className="land-step-n">{s.n}</div>
                <div>
                  <div className="land-step-label">{s.label}</div>
                  <div className="land-step-body">{s.body}</div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── Categories ── */}
        <section className="land-cats">
          <div className="land-section-head">
            <h2 className="land-h2">Four categories</h2>
            <p className="land-section-sub">Every post is tagged so you know what you&apos;re getting into.</p>
          </div>
          <div className="land-cat-row">
            {[
              { label: "Rant",     color: "var(--rant)",     desc: "Complaints, frustrations, things that need to be said." },
              { label: "Shoutout", color: "var(--shoutout)", desc: "Recognise someone good. Appreciate a win." },
              { label: "Callout",  color: "var(--callout)",  desc: "Hold people accountable. Name the behaviour, not the person." },
              { label: "Info",     color: "var(--info)",     desc: "News, lost and found, campus updates." },
            ].map((c) => (
              <div key={c.label} className="land-cat grain" style={{ background: c.color }}>
                <div className="sticker" style={{ background: "var(--ink)", color: "var(--paper)", marginBottom: 10 }}>{c.label}</div>
                <p className="land-cat-desc">{c.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── Anonymity deep dive ── */}
        <section className="land-anon">
          <div className="land-anon-inner grain">
            <div className="land-anon-text">
              <h2 className="land-h2">Your identity is safe.</h2>
              <p className="land-anon-body">
                Posts show a stable anonymous tag derived from a one-way cryptographic hash
                of your account ID. The same person gets the same tag on this campus every
                time — so moderators can act on repeat offenders — but nobody can reverse
                the hash to find your name. Not even us.
              </p>
              <p className="land-anon-body" style={{ marginTop: 12 }}>
                Your Google account is used solely to enforce bans and prevent duplicate
                accounts. It is never shown, stored publicly, or shared.
              </p>
              <Link href="/privacy" className="pill press" style={{ background: "var(--paper)", display: "inline-block", marginTop: 16, textDecoration: "none" }}>
                Read the privacy policy →
              </Link>
            </div>
            <div className="land-anon-visual">
              <div className="land-tag-demo">
                <div className="land-tag-row">
                  <span className="land-real">Your real name</span>
                  <span className="land-arrow">→</span>
                  <span className="land-fake sticker" style={{ background: "var(--callout)" }}>Anon #4F2A</span>
                </div>
                <div className="land-tag-caption">One-way hash. Irreversible.</div>
              </div>
            </div>
          </div>
        </section>

        {/* ── CTA banner ── */}
        <section className="land-cta-banner grain">
          <h2 className="land-h2" style={{ marginBottom: 8 }}>Ready to join?</h2>
          <p style={{ fontFamily: "var(--disp)", opacity: 0.75, marginBottom: 22 }}>
            You need an invite code from a UNILAG student to get started.
          </p>
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap", justifyContent: "center" }}>
            <Link href="/auth/login" className="post-btn press land-btn-lg">
              Sign in with Google →
            </Link>
            <Link href="/how-it-works" className="pill press" style={{ background: "var(--paper)" }}>
              Learn more
            </Link>
          </div>
        </section>

        {/* ── Footer ── */}
        <footer className="land-footer">
          <div className="land-footer-inner">
            <div className="land-footer-logo">
              <CampusCrest slug="unilag" size={22} />
              <span>CampusBoard</span>
            </div>
            <div className="land-footer-links">
              <Link href="/about">About</Link>
              <Link href="/rules">Rules</Link>
              <Link href="/privacy">Privacy</Link>
              <Link href="/terms">Terms</Link>
              <Link href="/contact">Contact</Link>
              <Link href="/faq">FAQ</Link>
            </div>
            <p className="land-footer-note">
              Student-built. UNILAG only. Not affiliated with the university.
            </p>
          </div>
        </footer>

      </div>
    </>
  );
}
