import Link from "next/link";
import { Backdrop } from "@/components/Backdrop";

export default function PostSuccessPage() {
  return (
    <>
      <Backdrop />
      <main className="picker">
        <div className="picker-head">
          <div style={{ fontSize: 52 }}>✅</div>
          <h1 className="picker-title">Post submitted</h1>
          <p className="picker-sub">It&apos;s in the moderation queue and will appear shortly if approved.</p>
        </div>
        <Link href="/feed" className="post-btn press" style={{ textDecoration: "none" }}>Back to feed</Link>
      </main>
    </>
  );
}
"// v1.0"  
