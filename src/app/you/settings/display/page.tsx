"use client";
import { useState, useEffect } from "react";
import { Backdrop } from "@/components/Backdrop";
import { PageShell } from "@/components/ui/PageShell";

type TextSize = "sm" | "md" | "lg";
const TEXT_SIZES: { key: TextSize; label: string; px: string }[] = [
  { key: "sm", label: "Small",  px: "14px" },
  { key: "md", label: "Medium", px: "16px" },
  { key: "lg", label: "Large",  px: "19px" },
];

export default function DisplaySettingsPage() {
  const [size,    setSize]    = useState<TextSize>("md");
  const [motion,  setMotion]  = useState(true);
  const [saved,   setSaved]   = useState(false);

  useEffect(() => {
    try {
      const stored = JSON.parse(localStorage.getItem("cb-display") ?? "{}") as {
        size?: TextSize;
        motion?: boolean;
      };
      if (stored.size)            setSize(stored.size);
      if (stored.motion != null)  setMotion(stored.motion);
    } catch { /* ignore */ }
  }, []);

  function save() {
    localStorage.setItem("cb-display", JSON.stringify({ size, motion }));
    // Apply immediately
    document.documentElement.style.setProperty(
      "--base-font-size",
      TEXT_SIZES.find((t) => t.key === size)?.px ?? "16px"
    );
    setSaved(true);
    setTimeout(() => setSaved(false), 1500);
  }

  return (
    <>
      <Backdrop />
      <PageShell title="Display" back="/you/settings">
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div
            className="campus-row grain"
            style={{ background: "var(--paper)", flexDirection: "column", alignItems: "flex-start", gap: 10 }}
          >
            <strong style={{ fontFamily: "var(--disp)" }}>Text size</strong>
            <div style={{ display: "flex", gap: 8 }}>
              {TEXT_SIZES.map((t) => (
                <button
                  key={t.key}
                  type="button"
                  className="pill press"
                  onClick={() => setSize(t.key)}
                  style={{
                    background:  size === t.key ? "var(--accent)" : "var(--paper)",
                    boxShadow:   size === t.key ? "var(--hard)" : "var(--hard-sm)",
                    fontSize:    t.px,
                  }}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          <div
            className="campus-row grain"
            style={{ background: "var(--paper)", justifyContent: "space-between" }}
          >
            <div>
              <div className="cr-name">Reduce motion</div>
              <div className="cr-full">Disable swipe animations</div>
            </div>
            <button
              type="button"
              className="pill press"
              onClick={() => setMotion((m) => !m)}
              style={{ background: motion ? "var(--shoutout)" : "var(--paper)" }}
            >
              {motion ? "On" : "Off"}
            </button>
          </div>

          <button
            type="button"
            className="post-btn press"
            onClick={save}
            style={{ background: saved ? "var(--shoutout)" : "var(--accent)" }}
          >
            {saved ? "Saved ✓" : "Save preferences"}
          </button>
        </div>
      </PageShell>
    </>
  );
}
