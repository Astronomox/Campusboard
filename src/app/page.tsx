import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "CampusBoard — UNILAG's anonymous board",
  description:
    "Anonymous, moderated discussion board exclusively for UNILAG students. Say what you actually think. Invite-only.",
};

export default function LandingPage() {
  return (
    <div className="land">

      {/* ── Nav ── */}
      <header className="land-nav">
        <div className="land-nav-inner">
          <div className="land-logo">
            <LogoMark />
            <span>CampusBoard</span>
          </div>
          <nav className="land-nav-links">
            <Link href="/about" className="land-nav-link">About</Link>
            <Link href="/rules" className="land-nav-link">Rules</Link>
            <Link href="/auth/login" className="land-cta-sm press">Sign in</Link>
          </nav>
        </div>
      </header>

      {/* ── Hero ── */}
      <section className="land-hero">
        <div className="land-hero-content">
          <div className="land-hero-kicker">
            <span className="land-kicker-dot" />
            UNILAG only · Invite-only · Anonymous
          </div>
          <h1 className="land-h1">
            Say what you<br />
            <span className="land-h1-stroke">actually think.</span>
          </h1>
          <p className="land-sub">
            CampusBoard is an anonymous, AI-moderated discussion board built
            exclusively for UNILAG students. No names. No profiles. Just the board.
          </p>
          <div className="land-hero-cta">
            <Link href="/auth/login" className="land-btn-primary press">
              Get started
              <ArrowRight />
            </Link>
            <Link href="/how-it-works" className="land-btn-ghost press">
              How it works
            </Link>
          </div>
          <div className="land-hero-stats">
            <div className="land-stat-item">
              <span className="land-stat-n">4</span>
              <span className="land-stat-l">Post categories</span>
            </div>
            <div className="land-stat-div" />
            <div className="land-stat-item">
              <span className="land-stat-n">AI</span>
              <span className="land-stat-l">Moderated</span>
            </div>
            <div className="land-stat-div" />
            <div className="land-stat-item">
              <span className="land-stat-n">0</span>
              <span className="land-stat-l">Names shown</span>
            </div>
          </div>
        </div>
        <div className="land-hero-visual">
          <PhoneMockup />
        </div>
      </section>

      {/* ── Features ── */}
      <section className="land-features">
        <div className="land-features-inner">
          <div className="land-section-head">
            <h2 className="land-h2">Built different.</h2>
            <p className="land-section-sub">
              Not another anonymous chaos app. CampusBoard has real guardrails.
            </p>
          </div>
          <div className="land-feat-grid">
            {FEATURES.map((f) => (
              <div key={f.title} className="land-feat-card grain">
                <div className="land-feat-icon" style={{ background: f.color }}>
                  {f.icon}
                </div>
                <h3 className="land-feat-title">{f.title}</h3>
                <p className="land-feat-body">{f.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── How it works ── */}
      <section className="land-how">
        <div className="land-how-inner">
          <div className="land-section-head">
            <h2 className="land-h2">From invite to board in minutes.</h2>
          </div>
          <div className="land-steps">
            {STEPS.map((s, i) => (
              <div key={s.label} className="land-step">
                <div className="land-step-num" style={{ background: s.color }}>
                  {String(i + 1).padStart(2, "0")}
                </div>
                <div className="land-step-icon">{s.icon}</div>
                <div>
                  <div className="land-step-label">{s.label}</div>
                  <div className="land-step-body">{s.body}</div>
                </div>
                {i < STEPS.length - 1 && <div className="land-step-line" />}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Anonymity ── */}
      <section className="land-anon">
        <div className="land-anon-inner">
          <div className="land-anon-text">
            <div className="land-anon-badge grain">
              <ShieldCheckIcon />
              Privacy model
            </div>
            <h2 className="land-h2" style={{ marginTop: 16 }}>
              Your identity is protected by math.
            </h2>
            <p className="land-anon-body">
              Posts show a stable anonymous tag derived from a one-way cryptographic
              hash of your account ID. The same person always gets the same tag on
              this campus — so moderators can act on repeat offenders — but the hash
              is irreversible. Nobody, including the admin, can find your name from it.
            </p>
            <p className="land-anon-body">
              Your Google account is used solely to enforce bans and prevent duplicate
              accounts. It is never shown publicly or shared with anyone.
            </p>
            <Link href="/privacy" className="land-link">
              Read the privacy policy →
            </Link>
          </div>
          <div className="land-anon-demo">
            <div className="land-hash-box grain">
              <div className="land-hash-label">Your Google account</div>
              <div className="land-hash-input">
                <PersonIcon />
                <span>adeola.ibrahim@gmail.com</span>
              </div>
              <div className="land-hash-arrow">
                <HashIcon />
                <span>One-way hash (irreversible)</span>
              </div>
              <div className="land-hash-output">
                <div className="land-hash-tag sticker" style={{ background: "var(--callout)", fontSize: 18, padding: "8px 18px" }}>
                  Anon #4F2A
                </div>
              </div>
              <div className="land-hash-note">
                Same tag every time on this campus. Unresolvable.
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Categories ── */}
      <section className="land-cats-section">
        <div className="land-cats-inner">
          <div className="land-section-head">
            <h2 className="land-h2">Four categories. One board.</h2>
            <p className="land-section-sub">Every post is tagged so you know what you&apos;re reading.</p>
          </div>
          <div className="land-cat-grid">
            {CATEGORIES.map((c) => (
              <div key={c.label} className="land-cat-card" style={{ background: c.color, borderColor: c.color }}>
                <div className="land-cat-icon">{c.icon}</div>
                <div className="land-cat-sticker sticker">{c.label}</div>
                <p className="land-cat-body">{c.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="land-cta-section">
        <div className="land-cta-inner grain">
          <h2 className="land-cta-h">Ready to join?</h2>
          <p className="land-cta-sub">
            Get an invite code from a verified UNILAG student, then sign in and enter it.
          </p>
          <div className="land-cta-btns">
            <Link href="/auth/login" className="land-btn-primary press">
              Sign in with Google
              <ArrowRight />
            </Link>
            <Link href="/faq" className="land-btn-ghost press">FAQ</Link>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="land-footer">
        <div className="land-footer-inner">
          <div className="land-footer-left">
            <div className="land-logo">
              <LogoMark size={20} />
              <span>CampusBoard</span>
            </div>
            <p className="land-footer-note">Student-built. UNILAG only. Not affiliated with the university.</p>
          </div>
          <div className="land-footer-links">
            {[
              ["About", "/about"], ["Rules", "/rules"], ["Privacy", "/privacy"],
              ["Terms", "/terms"], ["Contact", "/contact"], ["FAQ", "/faq"],
              ["Transparency", "/transparency"],
            ].map(([label, href]) => (
              <Link key={href} href={href} className="land-footer-link">{label}</Link>
            ))}
          </div>
        </div>
      </footer>

    </div>
  );
}

/* ── Data ── */
const FEATURES = [
  {
    color: "var(--rant)",
    icon: <ShieldIcon />,
    title: "Actually anonymous",
    body: "Posts carry a cryptographic tag — same person, same tag, but nobody can reverse it to find your name. Not even the admin.",
  },
  {
    color: "var(--shoutout)",
    icon: <SparkleIcon />,
    title: "AI moderation",
    body: "Every post passes an AI gate before it reaches the feed. Hate speech, threats, and spam are blocked automatically.",
  },
  {
    color: "var(--callout)",
    icon: <TicketIcon />,
    title: "Invite only",
    body: "UNILAG students only. You need an invite from a verified student to join. Earn invites to share once you start posting.",
  },
  {
    color: "var(--info)",
    icon: <StackIcon />,
    title: "One post at a time",
    body: "The feed is a swipeable stack — no infinite scroll, no algorithmic rabbit holes. Just the next post.",
  },
];

const STEPS = [
  {
    color: "var(--callout)",
    icon: <TicketIcon />,
    label: "Get invited",
    body: "A verified UNILAG student gives you an 8-character invite code.",
  },
  {
    color: "var(--info)",
    icon: <GoogleIcon />,
    label: "Sign in",
    body: "Sign in with your Google account. Your identity stays private.",
  },
  {
    color: "var(--pink)",
    icon: <KeyIcon />,
    label: "Enter your code",
    body: "Enter the invite code once. You are a permanent member after that.",
  },
  {
    color: "var(--shoutout)",
    icon: <PenIcon />,
    label: "Post freely",
    body: "Post anonymously. React. Report. Earn invites to share with other UNILAG students.",
  },
];

const CATEGORIES = [
  { label: "Rant",     color: "var(--rant)",     icon: <MegaphoneIcon />, desc: "Complaints, frustrations, things that need to be said." },
  { label: "Shoutout", color: "var(--shoutout)", icon: <StarIcon />,      desc: "Recognise someone good. Appreciate a win." },
  { label: "Callout",  color: "var(--callout)",  icon: <FlagIcon />,      desc: "Hold people accountable. Name the behaviour, not the person." },
  { label: "Info",     color: "var(--info)",      icon: <InfoIcon />,      desc: "News, lost items, campus updates, announcements." },
];

/* ── SVG Icons ── */
function LogoMark({ size = 28 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none">
      <rect width="40" height="40" rx="10" fill="var(--accent)" stroke="var(--ink)" strokeWidth="2.5"/>
      <path d="M10 14h20M10 20h14M10 26h17" stroke="var(--ink)" strokeWidth="2.8" strokeLinecap="round"/>
    </svg>
  );
}
function ArrowRight() {
  return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg>;
}
function ShieldIcon() {
  return <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2L4 6v6c0 5 3.5 9.7 8 11 4.5-1.3 8-6 8-11V6L12 2Z"/></svg>;
}
function ShieldCheckIcon() {
  return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2L4 6v6c0 5 3.5 9.7 8 11 4.5-1.3 8-6 8-11V6L12 2Z"/><path d="m9 12 2 2 4-4"/></svg>;
}
function SparkleIcon() {
  return <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/></svg>;
}
function TicketIcon() {
  return <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v2Z"/></svg>;
}
function StackIcon() {
  return <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2 2 7l10 5 10-5-10-5Z"/><path d="m2 17 10 5 10-5"/><path d="m2 12 10 5 10-5"/></svg>;
}
function GoogleIcon() {
  return <svg width="22" height="22" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.5 12.2c0-.7-.06-1.4-.18-2.06H12v3.9h5.9a5.05 5.05 0 0 1-2.19 3.31v2.75h3.54c2.07-1.9 3.25-4.7 3.25-7.9Z"/><path fill="#34A853" d="M12 23c2.95 0 5.43-.98 7.24-2.64l-3.54-2.75c-.98.66-2.24 1.05-3.7 1.05-2.85 0-5.26-1.92-6.12-4.5H2.22v2.84A11 11 0 0 0 12 23Z"/><path fill="#FBBC05" d="M5.88 14.16a6.6 6.6 0 0 1 0-4.32V7H2.22a11 11 0 0 0 0 9.84l3.66-2.68Z"/><path fill="#EA4335" d="M12 5.18c1.6 0 3.05.55 4.19 1.64l3.14-3.14C17.43 1.9 14.95.9 12 .9A11 11 0 0 0 2.22 7l3.66 2.84C6.74 7.1 9.15 5.18 12 5.18Z"/></svg>;
}
function KeyIcon() {
  return <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="7.5" cy="15.5" r="5.5"/><path d="m21 2-9.6 9.6M15.5 7.5l3 3"/></svg>;
}
function PenIcon() {
  return <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/></svg>;
}
function MegaphoneIcon() {
  return <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 11v2a7 7 0 0 0 7 7h.5"/><path d="M21 5v14l-7-4V9l7-4Z"/><path d="M14 9H7a4 4 0 0 0 0 8h7"/></svg>;
}
function StarIcon() {
  return <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>;
}
function FlagIcon() {
  return <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 21V4"/><path d="M5 5h12l-2.5 3.5L17 12H5"/></svg>;
}
function InfoIcon() {
  return <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/></svg>;
}
function PersonIcon() {
  return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="8" r="4"/><path d="M5 20a7 7 0 0 1 14 0"/></svg>;
}
function HashIcon() {
  return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="4" y1="9" x2="20" y2="9"/><line x1="4" y1="15" x2="20" y2="15"/><line x1="10" y1="3" x2="8" y2="21"/><line x1="16" y1="3" x2="14" y2="21"/></svg>;
}

/* ── Phone mockup ── */
function PhoneMockup() {
  return (
    <div className="phone-wrap">
      <div className="phone-frame">
        <div className="phone-screen">
          <div className="phone-topbar">
            <span className="phone-dots"><i/><i/><i/></span>
            <span className="phone-tag sticker" style={{ background: "var(--rant)", fontSize: 10, padding: "2px 8px" }}>Rant</span>
          </div>
          <div className="phone-post">
            <p className="phone-body">
              &ldquo;The wifi in DLI has been down for three days straight. Are we paying service charge for vibes?&rdquo;
            </p>
            <div className="phone-meta">
              <span style={{ fontFamily: "monospace", fontSize: 10, fontWeight: 700 }}>Anon #4F2A</span>
              <span style={{ opacity: 0.55, fontSize: 10 }}>2m ago</span>
            </div>
          </div>
          <div className="phone-reacts">
            {["🔥 34","💀 12","😊 45","💯 8"].map((r) => (
              <div key={r} className="phone-react">{r}</div>
            ))}
          </div>
          <div className="phone-post" style={{ background: "var(--shoutout)" }}>
            <div className="phone-topbar" style={{ paddingBottom: 6 }}>
              <span className="phone-tag sticker" style={{ background: "var(--ink)", color: "var(--paper)", fontSize: 10, padding: "2px 8px" }}>Shoutout</span>
            </div>
            <p className="phone-body" style={{ fontSize: 12 }}>
              &ldquo;Shoutout to the Mass Comm lecturer who actually marks scripts on time.&rdquo;
            </p>
            <div className="phone-meta">
              <span style={{ fontFamily: "monospace", fontSize: 10, fontWeight: 700 }}>Anon #9B1C</span>
              <span style={{ opacity: 0.55, fontSize: 10 }}>8m ago</span>
            </div>
          </div>
        </div>
      </div>
      <div className="phone-glow" />
    </div>
  );
}
"// v1.0"  
