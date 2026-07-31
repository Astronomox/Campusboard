"use client";

import { useState } from "react";
import { CATEGORY_LIST, CATEGORY_META } from "@/lib/campuses";
import type { Category } from "@/lib/types";
import { CloseIcon, SendIcon } from "./icons";
import { RetroDots } from "./RetroDots";

const MAX_LEN = 280;

export function ComposeSheet({
  submitting,
  error,
  onClose,
  onPost,
}: {
  submitting: boolean;
  error: string | null;
  onClose: () => void;
  onPost: (body: string, category: Category) => void;
}) {
  const [text, setText] = useState("");
  const [category, setCategory] = useState<Category>("rant");
  const canPost = text.trim().length > 0 && !submitting;

  return (
    <>
      <div className="scrim" onClick={onClose} />
      <div className="sheet" role="dialog" aria-modal="true" aria-label="Create post">
        <div className="sheet-head">
          <div className="t">
            <RetroDots />
            <h3>New post</h3>
          </div>
          <button type="button" className="x press" onClick={onClose} aria-label="Close">
            <CloseIcon size={18} />
          </button>
        </div>

        <div className="pills">
          {CATEGORY_LIST.map((key) => {
            const meta = CATEGORY_META[key];
            const on = category === key;
            return (
              <button
                key={key}
                type="button"
                className="pill press"
                onClick={() => setCategory(key)}
                style={{ background: meta.color, boxShadow: on ? "var(--hard)" : "var(--hard-sm)" }}
              >
                {meta.label}
              </button>
            );
          })}
        </div>

        <textarea
          className="composer"
          value={text}
          onChange={(e) => setText(e.target.value.slice(0, MAX_LEN))}
          placeholder="What's happening on campus?"
          autoFocus
        />

        {error && <p className="sheet-error">{error}</p>}

        <div className="sheet-foot">
          <span className="count" style={text.length > MAX_LEN - 20 ? { color: "#c0392b" } : undefined}>
            {text.length}/{MAX_LEN}
          </span>
          <button
            type="button"
            className="post-btn press"
            disabled={!canPost}
            onClick={() => onPost(text.trim(), category)}
          >
            <SendIcon size={16} />
            {submitting ? "Posting…" : "Post"}
          </button>
        </div>
      </div>
    </>
  );
}
