import Link from "next/link";
import { Backdrop } from "@/components/Backdrop";

export default function PostRejectedPage() {
  return (
    <>
      <Backdrop />
      <main className="picker">
        <div className="picker-head">
          <div style={{ fontSize: 52 }}>🚫</div>
          <h1 className="picker-title">Post rejected</h1>
          <p className="picker-sub">Your post didn&apos;t pass moderation.</p>
          <p style={{ fontFamily: "var(--disp)", fontSize: 13, opacity: 0.65, marginTop: 8 }}>
            Check the community rules and try again.
          </p>
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          <Link href="/post/new" className="post-btn press" style={{ textDecoration: "none" }}>Edit and retry</Link>
          <Link href="/rules" className="pill press" style={{ textDecoration: "none", background: "var(--paper)" }}>View rules</Link>
        </div>
      </main>
    </>
  );
}
"// v1.0"  
