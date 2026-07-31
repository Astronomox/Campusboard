"use client";
import { useState, use } from "react";
import { Backdrop } from "@/components/Backdrop";
import { PageShell } from "@/components/ui/PageShell";

export default function SharePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const url = typeof window !== "undefined" ? `${window.location.origin}/post/${id}` : `/post/${id}`;
  const [copied, setCopied] = useState(false);

  function copy() {
    void navigator.clipboard.writeText(url).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    });
  }

  return (
    <>
      <Backdrop />
      <PageShell title="Share post" back={`/post/${id}`}>
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div className="code-row" style={{ marginTop: 8 }}>
            <span className="code-display" style={{ fontSize: 13, letterSpacing: 0, textAlign: "left", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{url}</span>
            <button type="button" className="post-btn press" onClick={copy}>{copied ? "Copied!" : "Copy"}</button>
          </div>
          <p style={{ fontFamily: "var(--disp)", fontSize: 13, opacity: 0.6 }}>
            Anyone with this link can read the post. They need an account and invite to react or post.
          </p>
        </div>
      </PageShell>
    </>
  );
}
