"use client";
import { Backdrop } from "@/components/Backdrop";
import { InviteGate } from "@/components/InviteGate";

export default function OnboardPage() {
  return (
    <>
      <Backdrop />
      <main className="picker">
        <div className="picker-head">
          <div style={{ fontSize: 48, marginBottom: 8 }}>🎟️</div>
          <h1 className="picker-title">You need an invite</h1>
          <p className="picker-sub">CampusBoard is invite-only for UNILAG students.</p>
        </div>
        <div style={{ width: "100%", maxWidth: 380 }}>
          <InviteGate onVerified={() => { window.location.href = "/onboard/welcome"; }} />
        </div>
      </main>
    </>
  );
}
