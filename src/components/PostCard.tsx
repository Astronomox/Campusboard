"use client";

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

export function PostCard({
  post,
  userReaction,
  onReact,
  onReport,
  onBookmark,
  bookmarked = false,
}: {
  post: Post;
  userReaction: ReactionEmoji | null;
  onReact: (postId: string, emoji: ReactionEmoji) => void;
  onReport?: (postId: string) => void;
  onBookmark?: (postId: string) => void;
  bookmarked?: boolean;
}) {
  const cat = CATEGORY_META[post.category];

  return (
    <article className="card grain" style={{ "--c": cat.color } as React.CSSProperties}>
      <div className="winbar">
        <RetroDots />
        <span className="sticker">{cat.label}</span>
      </div>

      <div className="post-panel">
        <p className="post-body">{post.body}</p>
        <div className="post-meta">
          <span className="tag">{post.anon_tag}</span>
          <span style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
            <span className="time">{timeAgo(post.created_at)}</span>
            {onBookmark && (
              <button
                type="button"
                className="report-btn"
                onClick={() => onBookmark(post.id)}
                aria-label={bookmarked ? "Remove bookmark" : "Save post"}
                style={{ background: bookmarked ? "var(--callout)" : "var(--paper)" }}
              >
                <BookmarkIcon size={15} />
              </button>
            )}
            {onReport && (
              <button
                type="button"
                className="report-btn"
                onClick={() => onReport(post.id)}
                aria-label="Report post"
              >
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
            <button
              key={emoji}
              type="button"
              className={active ? "react press on" : "react press"}
              onClick={() => onReact(post.id, emoji)}
              aria-pressed={active}
            >
              <ReactionGlyph kind={emoji} />
              <span>{count}</span>
            </button>
          );
        })}
      </div>
    </article>
  );
}
