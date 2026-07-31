"use client";

import { useState } from "react";
import { CATEGORY_META } from "@/lib/campuses";
import type { Post, ReactionEmoji } from "@/lib/types";
import { REACTIONS } from "@/lib/types";
import { BookmarkIcon, FlagIcon, ReactionGlyph } from "./icons";
import { RetroDots } from "./RetroDots";

function timeAgo(iso: string): string {
  const secs = Math.floor((Date.now() - new Date(iso).getTime()) / 1000);
  if (secs < 60) return "now";
  const mins = Math.floor(secs / 60);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

function canEdit(createdAt: string): boolean {
  return Date.now() - new Date(createdAt).getTime() < 15 * 60 * 1000;
}

export function PostCard({
  post,
  userReaction,
  onReact,
  onReport,
  onBookmark,
  onEditSave,
  bookmarked = false,
  isOwner = false,
}: {
  post: Post;
  userReaction: ReactionEmoji | null;
  onReact: (postId: string, emoji: ReactionEmoji) => void;
  onReport?: (postId: string) => void;
  onBookmark?: (postId: string) => void;
  onEditSave?: (postId: string, body: string) => void;
  bookmarked?: boolean;
  isOwner?: boolean;
}) {
  const cat = CATEGORY_META[post.category];
  const [editing,  setEditing]  = useState(false);
  const [editText, setEditText] = useState(post.body);
  const [saving,   setSaving]   = useState(false);
  const [err,      setErr]      = useState<string | null>(null);

  const editable = isOwner && canEdit(post.created_at) && onEditSave;

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

  return (
    <article className="card grain" style={{ "--c": cat.color } as React.CSSProperties}>
      <div className="winbar">
        <RetroDots />
        <span className="sticker">{cat.label}</span>
      </div>

      <div className="post-panel">
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
              <button type="button" className="post-btn press" disabled={saving}
                onClick={() => void saveEdit()}
                style={{ fontSize: 13, padding: "8px 16px" }}>
                {saving ? "Saving…" : "Save"}
              </button>
              <button type="button" className="pill press"
                onClick={() => { setEditing(false); setEditText(post.body); }}
                style={{ background: "var(--paper)", fontSize: 13 }}>
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

        <div className="post-meta">
          <span className="tag">{post.anon_tag}</span>
          <span style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
            <span className="time">{timeAgo(post.created_at)}</span>
            {editable && !editing && (
              <button type="button" className="report-btn" onClick={() => setEditing(true)}
                aria-label="Edit post" style={{ fontSize: 11, width: "auto", padding: "3px 8px", fontFamily: "var(--disp)", fontWeight: 700 }}>
                Edit
              </button>
            )}
            {onBookmark && (
              <button type="button" className="report-btn"
                onClick={() => onBookmark(post.id)}
                aria-label={bookmarked ? "Remove bookmark" : "Save post"}
                style={{ background: bookmarked ? "var(--callout)" : "var(--paper)" }}>
                <BookmarkIcon size={15} />
              </button>
            )}
            {onReport && (
              <button type="button" className="report-btn"
                onClick={() => onReport(post.id)}
                aria-label="Report post">
                <FlagIcon size={15} />
              </button>
            )}
          </span>
        </div>
      </div>

      <div className="reacts">
        {REACTIONS.map((emoji) => {
          const active = userReaction === emoji;
          const count  = post.reactions[emoji] + (active ? 1 : 0);
          return (
            <button key={emoji} type="button"
              className={active ? "react press on" : "react press"}
              onClick={() => onReact(post.id, emoji)}
              aria-pressed={active}>
              <ReactionGlyph kind={emoji} />
              <span>{count}</span>
            </button>
          );
        })}
      </div>
    </article>
  );
}
