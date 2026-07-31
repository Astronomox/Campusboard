"use client";
import { useState } from "react";
import { Backdrop } from "@/components/Backdrop";
import { PageShell } from "@/components/ui/PageShell";

export default function AccountSettingsPage() {
  const [confirm, setConfirm] = useState(false);
  return (
    <>
      <Backdrop />
      <PageShell title="Account" back="/you/settings">
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <div className="campus-row grain" style={{ background: "var(--paper)", flexDirection: "column", alignItems: "flex-start", gap: 10 }}>
            <strong style={{ fontFamily: "var(--disp)" }}>Export your data</strong>
            <p style={{ margin: 0, fontSize: 13, opacity: 0.7 }}>Download a copy of your posts and reactions.</p>
            <button type="button" className="pill press" style={{ background: "var(--info)" }}>Request export</button>
          </div>
          <div className="campus-row grain" style={{ background: "var(--rant)", flexDirection: "column", alignItems: "flex-start", gap: 10 }}>
            <strong style={{ fontFamily: "var(--disp)" }}>Delete account</strong>
            <p style={{ margin: 0, fontSize: 13, opacity: 0.8 }}>This permanently deletes your account and all your posts. This action cannot be undone.</p>
            {!confirm
              ? <button type="button" className="pill press" style={{ background: "var(--paper)" }} onClick={() => setConfirm(true)}>Delete my account</button>
              : <button type="button" className="post-btn press" style={{ background: "#c0392b", border: "var(--bd)" }}>Confirm delete</button>
            }
          </div>
        </div>
      </PageShell>
    </>
  );
}
