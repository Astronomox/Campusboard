"use client";
import { useState, useEffect } from "react";
import { Backdrop } from "@/components/Backdrop";
import { PageShell } from "@/components/ui/PageShell";

const OPTIONS = [
  { key: "show_reactions",  label: "Show my reactions",    sub: "Others can see which posts you reacted to" },
  { key: "show_on_tags",    label: "Appear on tags page",  sub: "Your anon tag shows in the all-tags list" },
] as const;
type OptionKey = (typeof OPTIONS)[number]["key"];
type Privacy = Record<OptionKey, boolean>;
const DEFAULT: Privacy = { show_reactions: false, show_on_tags: true };

export default function PrivacySettingsPage() {
  const [priv,  setPriv]  = useState<Privacy>(DEFAULT);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    try {
      const stored = JSON.parse(localStorage.getItem("cb-privacy") ?? "{}") as Partial<Privacy>;
      setPriv((p) => ({ ...p, ...stored }));
    } catch { /* ignore */ }
  }, []);

  function toggle(key: OptionKey) {
    setPriv((p) => ({ ...p, [key]: !p[key] }));
  }

  function save() {
    localStorage.setItem("cb-privacy", JSON.stringify(priv));
    setSaved(true);
    setTimeout(() => setSaved(false), 1500);
  }

  return (
    <>
      <Backdrop />
      <PageShell title="Privacy" back="/you/settings">
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {OPTIONS.map((o) => (
            <div
              key={o.key}
              className="campus-row grain"
              style={{ background: "var(--paper)", justifyContent: "space-between" }}
            >
              <div>
                <div className="cr-name">{o.label}</div>
                <div className="cr-full">{o.sub}</div>
              </div>
              <button
                type="button"
                className="pill press"
                onClick={() => toggle(o.key)}
                style={{ background: priv[o.key] ? "var(--shoutout)" : "var(--paper)" }}
              >
                {priv[o.key] ? "On" : "Off"}
              </button>
            </div>
          ))}
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
"// v1.0"  
