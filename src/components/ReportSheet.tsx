"use client";

import { useState } from "react";
import { CloseIcon } from "./icons";

const REASONS = ["Spam", "Harassment", "Hate speech", "Misinformation", "Other"];

export function ReportSheet({
  submitting,
  onClose,
  onSubmit,
}: {
  submitting: boolean;
  onClose: () => void;
  onSubmit: (reason: string) => void;
}) {
  const [reason, setReason] = useState(REASONS[0]);

  return (
    <>
      <div className="scrim" onClick={onClose} />
      <div className="sheet" role="dialog" aria-modal="true" aria-label="Report post">
        <div className="sheet-head">
          <div className="t">
            <h3>Report post</h3>
          </div>
          <button type="button" className="x press" onClick={onClose} aria-label="Close">
            <CloseIcon size={18} />
          </button>
        </div>

        <p style={{ fontSize: 13, opacity: 0.65, margin: "0 0 12px" }}>
          Why are you reporting this?
        </p>

        <div className="pills">
          {REASONS.map((r) => {
            const on = reason === r;
            return (
              <button
                key={r}
                type="button"
                className="pill press"
                onClick={() => setReason(r)}
                style={{
                  background: on ? "var(--accent)" : "var(--paper)",
                  boxShadow: on ? "var(--hard)" : "var(--hard-sm)",
                }}
              >
                {r}
              </button>
            );
          })}
        </div>

        <div className="sheet-foot">
          <span className="count">Sent to moderators</span>
          <button
            type="button"
            className="post-btn press"
            disabled={submitting}
            onClick={() => onSubmit(reason)}
          >
            {submitting ? "Sending…" : "Submit report"}
          </button>
        </div>
      </div>
    </>
  );
}
"// v1.0"  
