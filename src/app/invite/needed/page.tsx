import Link from "next/link";
import { Backdrop } from "@/components/Backdrop";

export default function InviteNeededPage() {
  return (
    <>
      <Backdrop />
      <main className="picker">
        <div className="picker-head">
          <div style={{ fontSize: 52 }}>🔒</div>
          <h1 className="picker-title">Invite required</h1>
          <p className="picker-sub">You need an invite code from a UNILAG student to join CampusBoard.</p>
        </div>
        <Link href="/onboard" className="post-btn press" style={{ textDecoration: "none" }}>Enter invite code</Link>
      </main>
    </>
  );
}
