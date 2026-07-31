import { Backdrop } from "@/components/Backdrop";

export default function BannedPage() {
  return (
    <>
      <Backdrop />
      <main className="picker">
        <div className="picker-head" style={{ textAlign: "center" }}>
          <div style={{ fontSize: 52, marginBottom: 12 }}>🚫</div>
          <h1 className="picker-title">You&apos;re banned</h1>
          <p className="picker-sub">Your account has been banned from CampusBoard.</p>
          <p style={{ fontSize: 13, opacity: 0.6, marginTop: 8 }}>
            If you believe this is a mistake, contact the admin through another channel.
          </p>
        </div>
      </main>
    </>
  );
}
