"use client";
import { useEffect } from "react";
import Link from "next/link";
import { Backdrop } from "@/components/Backdrop";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[CampusBoard]", error.message);
  }, [error]);

  return (
    <>
      <Backdrop />
      <main
        style={{
          minHeight: "100dvh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: 24,
          textAlign: "center",
          position: "relative",
          zIndex: 1,
        }}
      >
        <div style={{ fontSize: 52, marginBottom: 12 }}>⚠️</div>
        <h1
          style={{
            fontFamily: "var(--disp)",
            fontSize: 26,
            fontWeight: 700,
            margin: "0 0 8px",
          }}
        >
          Something broke
        </h1>
        <p style={{ fontFamily: "var(--disp)", opacity: 0.65, marginBottom: 24, maxWidth: 300 }}>
          An error occurred on this page.
        </p>
        <div style={{ display: "flex", gap: 10 }}>
          <button type="button" className="post-btn press" onClick={reset}>
            Try again
          </button>
          <Link href="/feed" className="pill press" style={{ textDecoration: "none", background: "var(--paper)" }}>
            Back to feed
          </Link>
        </div>
      </main>
    </>
  );
}
