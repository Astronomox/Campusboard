import Link from "next/link";
import { Backdrop } from "@/components/Backdrop";

export default function InviteExpiredPage() {
  return (
    <>
      <Backdrop />
      <main className="picker">
        <div className="picker-head">
          <div style={{ fontSize: 52 }}>❌</div>
          <h1 className="picker-title">Code invalid</h1>
          <p className="picker-sub">This invite code has already been used or doesn&apos;t exist.</p>
        </div>
        <Link href="/onboard" className="post-btn press" style={{ textDecoration: "none" }}>Try another code</Link>
      </main>
    </>
  );
}
