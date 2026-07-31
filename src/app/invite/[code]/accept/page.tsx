import Link from "next/link";
import { Backdrop } from "@/components/Backdrop";

export default async function InviteAcceptPage({ params }: { params: Promise<{ code: string }> }) {
  const { code } = await params;
  return (
    <>
      <Backdrop />
      <main className="picker">
        <div className="picker-head">
          <div style={{ fontSize: 52 }}>🎉</div>
          <h1 className="picker-title">Invite accepted!</h1>
          <p className="picker-sub">Code <strong>{code}</strong> redeemed. You&apos;re in.</p>
        </div>
        <Link href="/onboard/welcome" className="post-btn press" style={{ textDecoration: "none" }}>Continue →</Link>
      </main>
    </>
  );
}
