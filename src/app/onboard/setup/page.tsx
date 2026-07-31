"use client";
import Link from "next/link";
import { useState } from "react";
import { Backdrop } from "@/components/Backdrop";

export default function SetupPage() {
  const [size, setSize] = useState("md");
  return (
    <>
      <Backdrop />
      <main className="picker" style={{ justifyContent: "flex-start", paddingTop: 48 }}>
        <div className="picker-head">
          <h1 className="picker-title">Display setup</h1>
          <p className="picker-sub">Adjust how the board looks for you.</p>
        </div>
        <div style={{ width: "100%", maxWidth: 380, display: "flex", flexDirection: "column", gap: 16 }}>
          <div className="campus-row grain" style={{ background: "var(--paper)", flexDirection: "column", alignItems: "flex-start", gap: 10 }}>
            <strong style={{ fontFamily: "var(--disp)" }}>Text size</strong>
            <div style={{ display: "flex", gap: 8 }}>
              {["sm","md","lg"].map((s) => (
                <button key={s} type="button" className="pill press"
                  onClick={() => setSize(s)}
                  style={{ background: size === s ? "var(--accent)" : "var(--paper)", boxShadow: size === s ? "var(--hard)" : "var(--hard-sm)", textTransform: "uppercase" }}>
                  {s}
                </button>
              ))}
            </div>
          </div>
          <Link href="/feed" className="post-btn press" style={{ justifyContent: "center", textDecoration: "none", padding: "14px" }}>
            Go to the board →
          </Link>
        </div>
      </main>
    </>
  );
}
"// v1.0"  
