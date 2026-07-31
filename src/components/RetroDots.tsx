/** Retro window control dots. Purely decorative chrome. */
export function RetroDots({ symbols = false }: { symbols?: boolean }) {
  return (
    <span className="dots" aria-hidden="true">
      <i style={{ background: "var(--rant)" }}>
        {symbols && (
          <svg viewBox="0 0 24 24" stroke="#1a1a1a" strokeWidth="3" strokeLinecap="round">
            <path d="M6 6l12 12M18 6 6 18" />
          </svg>
        )}
      </i>
      <i style={{ background: "var(--callout)" }}>
        {symbols && (
          <svg viewBox="0 0 24 24" fill="none" stroke="#1a1a1a" strokeWidth="3">
            <rect x="5" y="5" width="14" height="14" />
          </svg>
        )}
      </i>
      <i style={{ background: "var(--shoutout)" }}>
        {symbols && (
          <svg viewBox="0 0 24 24" stroke="#1a1a1a" strokeWidth="3" strokeLinecap="round">
            <path d="M5 12h14" />
          </svg>
        )}
      </i>
    </span>
  );
}
"// v1.0"  
