"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Backdrop } from "@/components/Backdrop";
import { PageShell } from "@/components/ui/PageShell";
import { CATEGORY_META } from "@/lib/campuses";
import { RetroDots } from "@/components/RetroDots";
import type { Category } from "@/lib/types";

interface Draft { body: string; category: Category }

export default function PreviewPage() {
  const router = useRouter();
  const [draft,      setDraft]      = useState<Draft | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error,      setError]      = useState<string | null>(null);

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem("cb-draft");
      if (raw) setDraft(JSON.parse(raw) as Draft);
    } catch { /* ignore */ }
  }, []);

  async function post() {
    if (!draft) return;
    setSubmitting(true);
    const res  = await fetch("/api/posts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ campus: "unilag", body: draft.body, category: draft.category }),
    });
    const data = await res.json() as { reason?: string; error?: string };
    setSubmitting(false);
    if (res.status === 422) {
      sessionStorage.removeItem("cb-draft");
      router.push("/post/new/rejected");
      return;
    }
    if (!res.ok) { setError(data.error ?? "Failed"); return; }
    sessionStorage.removeItem("cb-draft");
    router.push("/post/new/success");
  }

  if (!draft) {
    return (
      <>
        <Backdrop />
        <PageShell title="Preview" back="/post/new">
          <p style={{ fontFamily: "var(--disp)", opacity: 0.6 }}>No draft found. Go back and write a post.</p>
        </PageShell>
      </>
    );
  }

  const cat = CATEGORY_META[draft.category];

  return (
    <>
      <Backdrop />
      <PageShell title="Preview" back="/post/new">
        <p style={{ fontFamily: "var(--disp)", opacity: 0.6, marginBottom: 16, fontSize: 13 }}>
          This is how your post will look on the feed.
        </p>

        <article className="card grain" style={{ "--c": cat.color, marginBottom: 20 } as React.CSSProperties}>
          <div className="winbar">
            <RetroDots />
            <span className="sticker">{cat.label}</span>
          </div>
          <div className="post-panel">
            <p className="post-body">{draft.body}</p>
            <div className="post-meta">
              <span className="tag">Anon #????</span>
              <span className="time">now</span>
            </div>
          </div>
          <div className="reacts" style={{ opacity: 0.45, pointerEvents: "none" }}>
            {["🔥","💀","😊","💯"].map((e) => (
              <div key={e} className="react" style={{ flex: 1 }}>
                <span style={{ fontSize: 20 }}>{e}</span>
                <span>0</span>
              </div>
            ))}
          </div>
        </article>

        <p style={{ fontFamily: "var(--disp)", fontSize: 13, opacity: 0.65, marginBottom: 16 }}>
          Your actual anon tag will be assigned on post. The post goes through AI moderation before it appears on the feed.
        </p>

        {error && <p style={{ color: "#c0392b", fontFamily: "var(--disp)", fontWeight: 600, fontSize: 13, marginBottom: 12 }}>{error}</p>}

        <div style={{ display: "flex", gap: 10 }}>
          <button type="button" className="post-btn press" disabled={submitting} onClick={() => void post()}>
            {submitting ? "Posting…" : "Post anonymously"}
          </button>
          <button type="button" className="pill press" style={{ background: "var(--paper)" }} onClick={() => router.back()}>
            Edit
          </button>
        </div>
      </PageShell>
    </>
  );
}
"// v1.0"  
