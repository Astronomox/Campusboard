import Link from "next/link";
import type { Metadata } from "next";
import { CampusCrest } from "@/components/CampusCrest";
import { Backdrop } from "@/components/Backdrop";

export const metadata: Metadata = {
  title: "Sign in",
};

export default function LoginPage() {
  return (
    <>
      <Backdrop />
      <div className="login-shell">

        {/* Left panel — brand */}
        <div className="login-brand grain" style={{ background: "var(--accent)" }}>
          <div className="login-brand-inner">
            <div className="login-brand-logo">
              <CampusCrest slug="unilag" size={52} />
              <h1 className="login-brand-name">CampusBoard</h1>
            </div>
            <p className="login-brand-sub">
              UNILAG&apos;s anonymous, moderated discussion board.
            </p>
            <div className="login-brand-tags">
              {["Anonymous", "Moderated", "Invite-only", "UNILAG"].map((t) => (
                <span key={t} className="sticker" style={{ background: "var(--ink)", color: "var(--paper)" }}>
                  {t}
                </span>
              ))}
            </div>
            <div className="login-brand-promise">
              <div className="login-promise-item">
                <span>🎭</span>
                <span>Your name never appears</span>
              </div>
              <div className="login-promise-item">
                <span>🤖</span>
                <span>AI screens every post</span>
              </div>
              <div className="login-promise-item">
                <span>🔒</span>
                <span>UNILAG students only</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right panel — sign in form */}
        <div className="login-form-panel">
          <div className="login-form-inner">
            <div className="login-form-head">
              <h2 className="login-form-title">Welcome back</h2>
              <p className="login-form-sub">
                Sign in with your Google account to continue.
                You&apos;ll need an invite code if this is your first time.
              </p>
            </div>

            {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
    <a href="/api/auth/google" className="google-signin-btn press">
              <GoogleMark />
              <span>Continue with Google</span>
            </a>

            <div className="login-divider">
              <span>New here?</span>
            </div>

            <div className="login-new-box grain">
              <p className="login-new-text">
                CampusBoard is invite-only. Get a code from a verified UNILAG student,
                then sign in and enter it on the You tab.
              </p>
              <Link href="/how-it-works" className="pill press" style={{ background: "var(--shoutout)", display: "block", textAlign: "center", textDecoration: "none" }}>
                How it works →
              </Link>
            </div>

            <p className="login-legal">
              By signing in you agree to the{" "}
              <Link href="/rules" style={{ color: "var(--ink)", fontWeight: 700 }}>community rules</Link>{" "}
              and{" "}
              <Link href="/terms" style={{ color: "var(--ink)", fontWeight: 700 }}>terms of service</Link>.
              Your identity stays private.
            </p>

            <div className="login-back">
              <Link href="/" style={{ color: "var(--ink)", opacity: 0.6, fontFamily: "var(--disp)", fontSize: 13 }}>
                ← Back to home
              </Link>
            </div>
          </div>
        </div>

      </div>
    </>
  );
}

function GoogleMark() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" aria-hidden="true" style={{ flexShrink: 0 }}>
      <path fill="#4285F4" d="M22.5 12.2c0-.7-.06-1.4-.18-2.06H12v3.9h5.9a5.05 5.05 0 0 1-2.19 3.31v2.75h3.54c2.07-1.9 3.25-4.7 3.25-7.9Z" />
      <path fill="#34A853" d="M12 23c2.95 0 5.43-.98 7.24-2.64l-3.54-2.75c-.98.66-2.24 1.05-3.7 1.05-2.85 0-5.26-1.92-6.12-4.5H2.22v2.84A11 11 0 0 0 12 23Z" />
      <path fill="#FBBC05" d="M5.88 14.16a6.6 6.6 0 0 1 0-4.32V7H2.22a11 11 0 0 0 0 9.84l3.66-2.68Z" />
      <path fill="#EA4335" d="M12 5.18c1.6 0 3.05.55 4.19 1.64l3.14-3.14C17.43 1.9 14.95.9 12 .9A11 11 0 0 0 2.22 7l3.66 2.84C6.74 7.1 9.15 5.18 12 5.18Z" />
    </svg>
  );
}
