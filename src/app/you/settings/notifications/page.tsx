"use client";
import { useState, useEffect } from "react";
import { Backdrop } from "@/components/Backdrop";
import { PageShell } from "@/components/ui/PageShell";

const PREFS = [
  { key: "reactions",    label: "Reactions",     sub: "When someone reacts to your post" },
  { key: "replies",      label: "Replies",        sub: "When someone replies to your post" },
  { key: "system",       label: "System notices", sub: "Mod actions, announcements" },
] as const;
type PrefKey = (typeof PREFS)[number]["key"];

type Prefs = Record<PrefKey, boolean>;

const DEFAULT: Prefs = { reactions: true, replies: true, system: true };

export default function NotificationSettingsPage() {
  const [prefs, setPrefs] = useState<Prefs>(DEFAULT);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    try {
      const stored = JSON.parse(localStorage.getItem("cb-notif") ?? "{}") as Partial<Prefs>;
      setPrefs((p) => ({ ...p, ...stored }));
    } catch { /* ignore */ }
  }, []);

  function toggle(key: PrefKey) {
    setPrefs((p) => ({ ...p, [key]: !p[key] }));
  }

  function save() {
    localStorage.setItem("cb-notif", JSON.stringify(prefs));
    setSaved(true);
    setTimeout(() => setSaved(false), 1500);
  }

  return (
    <>
      <Backdrop />
      <PageShell title="Notifications" back="/you/settings">
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {PREFS.map((p) => (
            <div
              key={p.key}
              className="campus-row grain"
              style={{ background: "var(--paper)", justifyContent: "space-between" }}
            >
              <div>
                <div className="cr-name">{p.label}</div>
                <div className="cr-full">{p.sub}</div>
              </div>
              <button
                type="button"
                className="pill press"
                onClick={() => toggle(p.key)}
                style={{ background: prefs[p.key] ? "var(--shoutout)" : "var(--paper)" }}
              >
                {prefs[p.key] ? "On" : "Off"}
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
