import Link from "next/link";
import { Backdrop } from "@/components/Backdrop";

export default function WelcomePage() {
  return (
    <>
      <Backdrop />
      <main className="picker">
        <div className="picker-head" style={{ textAlign: "center" }}>
          <div style={{ fontSize: 56, marginBottom: 12 }}>🎉</div>
          <h1 className="picker-title">You&apos;re in!</h1>
          <p className="picker-sub">Welcome to CampusBoard, UNILAG&apos;s anonymous board.</p>
        </div>
        <div style={{ width: "100%", maxWidth: 380, display: "flex", flexDirection: "column", gap: 12 }}>
          <Link href="/onboard/rules" className="post-btn press" style={{ justifyContent: "center", textDecoration: "none", padding: "14px" }}>
            Read the community rules →
          </Link>
          <Link href="/feed" className="pill press" style={{ textDecoration: "none", textAlign: "center", padding: "12px", background: "var(--paper)" }}>
            Skip to the board
          </Link>
        </div>
      </main>
    </>
  );
}
"// v1.0"  
