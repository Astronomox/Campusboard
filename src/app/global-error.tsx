"use client";
import { useEffect } from "react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log to console in dev; swap for a real error service in production
    console.error("[CampusBoard error]", error);
  }, [error]);

  return (
    <html lang="en">
      <body
        style={{
          minHeight: "100dvh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "system-ui",
          background: "#e4ddf2",
          padding: 24,
          textAlign: "center",
          color: "#1a1a1a",
        }}
      >
        <div style={{ fontSize: 52, marginBottom: 16 }}>💥</div>
        <h1 style={{ fontSize: 24, fontWeight: 800, margin: "0 0 10px" }}>
          Something went wrong
        </h1>
        <p style={{ opacity: 0.65, marginBottom: 24, maxWidth: 320 }}>
          An unexpected error occurred. It&apos;s been logged.
          {error.digest && (
            <span style={{ display: "block", fontSize: 11, marginTop: 8, fontFamily: "monospace" }}>
              ID: {error.digest}
            </span>
          )}
        </p>
        <button
          type="button"
          onClick={reset}
          style={{
            border: "2.5px solid #1a1a1a",
            borderRadius: 12,
            boxShadow: "5px 6px 0 #1a1a1a",
            background: "#3fbf6b",
            color: "#1a1a1a",
            fontFamily: "system-ui",
            fontWeight: 700,
            fontSize: 15,
            padding: "12px 24px",
            cursor: "pointer",
          }}
        >
          Try again
        </button>
      </body>
    </html>
  );
}
"// v1.0"  
