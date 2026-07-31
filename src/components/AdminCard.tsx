"use client";

import { useEffect, useRef, useState } from "react";
import { CATEGORY_META } from "@/lib/campuses";
import type { Post, ReactionEmoji } from "@/lib/types";
import { REACTIONS } from "@/lib/types";
import { BookmarkIcon, FlagIcon, ReactionGlyph } from "./icons";
import { RetroDots } from "./RetroDots";

function timeAgo(iso: string): string {
  const s = Math.floor((Date.now() - new Date(iso).getTime()) / 1000);
  if (s < 60) return "now";
  const m = Math.floor(s / 60);
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}

/** Animated WebGL rainbow canvas background for admin posts. */
function RainbowCanvas() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const gl = canvas.getContext("webgl");
    if (!gl) return;

    const vert = `
      attribute vec2 a_pos;
      void main() { gl_Position = vec4(a_pos, 0.0, 1.0); }
    `;
    const frag = `
      precision mediump float;
      uniform float u_time;
      uniform vec2  u_res;
      void main() {
        vec2 uv = gl_FragCoord.xy / u_res;
        float t  = u_time * 0.4;
        float r  = 0.5 + 0.5 * sin(t + uv.x * 5.0 + uv.y * 3.0);
        float g  = 0.5 + 0.5 * sin(t + uv.x * 3.0 + uv.y * 5.0 + 2.094);
        float b  = 0.5 + 0.5 * sin(t + uv.x * 4.0 + uv.y * 4.0 + 4.189);
        // Brighten slightly and add shimmer
        vec3  col = vec3(r, g, b) * 0.85 + 0.1;
        gl_FragColor = vec4(col, 0.92);
      }
    `;

    function compile(type: number, src: string) {
      const s = gl!.createShader(type)!;
      gl!.shaderSource(s, src);
      gl!.compileShader(s);
      return s;
    }

    const prog = gl.createProgram()!;
    gl.attachShader(prog, compile(gl.VERTEX_SHADER, vert));
    gl.attachShader(prog, compile(gl.FRAGMENT_SHADER, frag));
    gl.linkProgram(prog);
    gl.useProgram(prog);

    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1, 1,-1, -1,1, 1,1]), gl.STATIC_DRAW);

    const pos = gl.getAttribLocation(prog, "a_pos");
    gl.enableVertexAttribArray(pos);
    gl.vertexAttribPointer(pos, 2, gl.FLOAT, false, 0, 0);

    const uTime = gl.getUniformLocation(prog, "u_time");
    const uRes  = gl.getUniformLocation(prog, "u_res");

    let raf = 0;
    const start = performance.now();

    function draw() {
      if (!gl || !canvas) return;
      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.uniform1f(uTime, (performance.now() - start) / 1000);
      gl.uniform2f(uRes, canvas.width, canvas.height);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      raf = requestAnimationFrame(draw);
    }
    draw();
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <canvas
      ref={ref}
      width={400}
      height={340}
      style={{
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
        borderRadius: "inherit",
        pointerEvents: "none",
      }}
    />
  );
}

export function AdminCard({
  post,
  userReaction,
  onReact,
  onReport,
  onBookmark,
  onDelete,
  onEditSave,
  bookmarked = false,
  isAdmin = false,
}: {
  post: Post;
  userReaction: ReactionEmoji | null;
  onReact: (postId: string, emoji: ReactionEmoji) => void;
  onReport?: (postId: string) => void;
  onBookmark?: (postId: string) => void;
  onDelete?: (postId: string) => void;
  onEditSave?: (postId: string, body: string) => void;
  bookmarked?: boolean;
  isAdmin?: boolean;
}) {
  const cat = CATEGORY_META[post.category];
  const [editing, setEditing]   = useState(false);
  const [editText, setEditText] = useState(post.body);
  const [saving, setSaving]     = useState(false);
  const [err, setErr]           = useState<string | null>(null);

  async function saveEdit() {
    if (!editText.trim() || !onEditSave) return;
    setSaving(true);
    setErr(null);
    try {
      const res  = await fetch("/api/posts/edit", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ post_id: post.id, body: editText.trim() }),
      });
      const data = await res.json() as { ok?: boolean; error?: string; body?: string };
      if (!res.ok) { setErr(data.error ?? "Failed"); return; }
      onEditSave(post.id, data.body ?? editText.trim());
      setEditing(false);
    } finally {
      setSaving(false);
    }
  }

  async function confirmDelete() {
    if (!onDelete) return;
    if (!confirm("Delete this post permanently? This cannot be undone.")) return;
    const res = await fetch("/api/mod/delete-post", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ post_id: post.id }),
    });
    if (res.ok) onDelete(post.id);
    else alert("Delete failed");
  }

  return (
    <article
      className="card admin-card"
      style={{
        position: "relative",
        overflow: "hidden",
        border: "3px solid #1a1a1a",
        borderRadius: 20,
        boxShadow: "7px 8px 0 #1a1a1a",
        padding: 14,
        background: "rgba(255,255,255,0.12)",
      }}
    >
      {/* WebGL rainbow background */}
      <RainbowCanvas />

      {/* Content sits above canvas */}
      <div style={{ position: "relative", zIndex: 1 }}>
        <div className="winbar">
          <RetroDots />
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span className="sticker" style={{ background: cat.color }}>{cat.label}</span>
            <span
              className="sticker"
              style={{ background: "#1a1a1a", color: "#fff", fontSize: 10, letterSpacing: "0.06em" }}
            >
              ANONxGODx000
            </span>
          </div>
        </div>

        <div
          className="post-panel"
          style={{ background: "rgba(255,255,255,0.82)", backdropFilter: "blur(6px)", marginBottom: 10 }}
        >
          {editing ? (
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              <textarea
                className="composer"
                value={editText}
                onChange={(e) => setEditText(e.target.value.slice(0, 280))}
                rows={4}
                autoFocus
                style={{ minHeight: 80 }}
              />
              {err && <p style={{ color: "#c0392b", fontSize: 12, margin: 0 }}>{err}</p>}
              <div style={{ display: "flex", gap: 8 }}>
                <button
                  type="button"
                  className="post-btn press"
                  disabled={saving}
                  onClick={() => void saveEdit()}
                  style={{ fontSize: 13, padding: "8px 16px" }}
                >
                  {saving ? "Saving…" : "Save"}
                </button>
                <button
                  type="button"
                  className="pill press"
                  onClick={() => { setEditing(false); setEditText(post.body); }}
                  style={{ background: "var(--paper)", fontSize: 13 }}
                >
                  Cancel
                </button>
                <span style={{ fontFamily: "var(--disp)", fontSize: 11, opacity: 0.55, alignSelf: "center" }}>
                  {editText.length}/280
                </span>
              </div>
            </div>
          ) : (
            <p className="post-body">{post.body}</p>
          )}

          <div className="post-meta" style={{ borderTop: "2px dashed rgba(26,26,26,.2)", paddingTop: 12 }}>
            <span className="tag">{post.anon_tag}</span>
            <span style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
              <span className="time">{timeAgo(post.created_at)}</span>
              {onBookmark && (
                <button type="button" className="report-btn" onClick={() => onBookmark(post.id)}
                  style={{ background: bookmarked ? "var(--callout)" : "rgba(255,255,255,0.7)" }}>
                  <BookmarkIcon size={15} />
                </button>
              )}
              {onReport && (
                <button type="button" className="report-btn" onClick={() => onReport(post.id)}
                  style={{ background: "rgba(255,255,255,0.7)" }}>
                  <FlagIcon size={15} />
                </button>
              )}
            </span>
          </div>

          {/* Admin-only actions */}
          {isAdmin && (
            <div style={{ display: "flex", gap: 8, marginTop: 10, flexWrap: "wrap" }}>
              {!editing && (
                <button
                  type="button"
                  className="pill press"
                  onClick={() => setEditing(true)}
                  style={{ background: "var(--callout)", fontSize: 12, padding: "5px 12px" }}
                >
                  Edit post
                </button>
              )}
              <button
                type="button"
                className="pill press"
                onClick={() => void confirmDelete()}
                style={{ background: "var(--rant)", fontSize: 12, padding: "5px 12px" }}
              >
                Delete post
              </button>
            </div>
          )}
        </div>

        <div className="reacts">
          {REACTIONS.map((emoji) => {
            const active = userReaction === emoji;
            const count  = post.reactions[emoji] + (active ? 1 : 0);
            return (
              <button
                key={emoji}
                type="button"
                className={active ? "react press on" : "react press"}
                style={{ background: active ? "var(--pink)" : "rgba(255,255,255,0.75)" }}
                onClick={() => onReact(post.id, emoji)}
                aria-pressed={active}
              >
                <ReactionGlyph kind={emoji} />
                <span>{count}</span>
              </button>
            );
          })}
        </div>
      </div>
    </article>
  );
}
