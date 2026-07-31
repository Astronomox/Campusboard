import Link from "next/link";
import { Backdrop } from "@/components/Backdrop";

export default function NotFound() {
  return (
    <>
      <Backdrop />
      <main className="picker">
        <div className="picker-head" style={{ textAlign: "center" }}>
          <div style={{ fontSize: 64, marginBottom: 12, fontFamily: "var(--disp)", fontWeight: 800 }}>404</div>
          <h1 className="picker-title">Page not found</h1>
          <p className="picker-sub">This page doesn&apos;t exist or was removed.</p>
        </div>
        <Link href="/feed" className="post-btn press" style={{ textDecoration: "none" }}>Back to feed</Link>
      </main>
    </>
  );
}
"// v1.0"  
