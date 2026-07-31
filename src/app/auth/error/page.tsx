import Link from "next/link";
import { Backdrop } from "@/components/Backdrop";

export default function AuthErrorPage() {
  return (
    <>
      <Backdrop />
      <main className="picker">
        <div className="picker-head" style={{ textAlign: "center" }}>
          <div style={{ fontSize: 52, marginBottom: 16 }}>⚠️</div>
          <h1 className="picker-title">Auth failed</h1>
          <p className="picker-sub">Something went wrong during sign in.</p>
        </div>
        <Link href="/auth/login" className="post-btn press" style={{ textDecoration: "none" }}>
          Try again
        </Link>
      </main>
    </>
  );
}
