"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Backdrop } from "@/components/Backdrop";
import { PageShell } from "@/components/ui/PageShell";
import { CATEGORY_LIST, CATEGORY_META } from "@/lib/campuses";
import type { Category } from "@/lib/types";

export default function NewPostPage() {
  const router  = useRouter();
  const [text,  setText]  = useState("");
  const [cat,   setCat]   = useState<Category>("rant");
  const [error, setError] = useState<string | null>(null);

  function preview() {
    if (!text.trim()) { setError("Write something first."); return; }
    try {
      sessionStorage.setItem("cb-draft", JSON.stringify({ body: text.trim(), category: cat }));
    } catch { /* ignore */ }
    router.push("/post/new/preview");
  }

  return (
    <>
      <Backdrop />
      <PageShell title="New post" back="/unilag">
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <div className="pills">
            {CATEGORY_LIST.map((k) => (
              <button key={k} type="button" className="pill press"
                onClick={() => setCat(k)}
                style={{ background: CATEGORY_META[k].color, boxShadow: cat === k ? "var(--hard)" : "var(--hard-sm)" }}>
                {CATEGORY_META[k].label}
              </button>
            ))}
          </div>

          <textarea
            className="composer"
            value={text}
            onChange={(e) => setText(e.target.value.slice(0, 280))}
            placeholder="What's happening on campus?"
            rows={6}
            autoFocus
          />

          {error && <p style={{ color: "#c0392b", fontSize: 13, fontWeight: 600, margin: 0 }}>{error}</p>}

          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontFamily: "var(--disp)", opacity: 0.6, fontSize: 13 }}>{text.length}/280</span>
            <div style={{ display: "flex", gap: 10 }}>
              <button type="button" className="pill press" style={{ background: "var(--paper)" }} onClick={preview}>
                Preview
              </button>
              <button type="button" className="post-btn press"
                disabled={!text.trim()}
                onClick={() => {
                  if (!text.trim()) { setError("Write something first."); return; }
                  void fetch("/api/posts", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ campus: "unilag", body: text.trim(), category: cat }),
                  }).then(async (res) => {
                    if (res.status === 422) { router.push("/post/new/rejected"); return; }
                    if (!res.ok) { const d = await res.json() as { error?: string }; setError(d.error ?? "Failed"); return; }
                    router.push("/post/new/success");
                  }).catch(() => setError("Network error"));
                }}>
                Post
              </button>
            </div>
          </div>
        </div>
      </PageShell>
    </>
  );
}
"// v1.0"  
