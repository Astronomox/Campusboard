/** Scattered memphis-style shapes behind the app. Purely decorative. */
const SHAPES = [
  { x: "6%", y: "16%", s: 34, r: -12, path: <polygon points="20,2 38,36 2,36" fill="var(--callout)" stroke="#1a1a1a" strokeWidth="2.5" /> },
  { x: "88%", y: "10%", s: 30, r: 8, path: <polygon points="20,2 38,15 31,37 9,37 2,15" fill="var(--pink)" stroke="#1a1a1a" strokeWidth="2.5" /> },
  { x: "90%", y: "78%", s: 36, r: 0, path: <path d="M2 20a18 18 0 0 1 36 0Z" fill="var(--purple)" stroke="#1a1a1a" strokeWidth="2.5" /> },
  { x: "4%", y: "72%", s: 26, r: 0, path: <circle cx="20" cy="20" r="17" fill="var(--info)" stroke="#1a1a1a" strokeWidth="2.5" /> },
  { x: "10%", y: "44%", s: 24, r: 0, path: <path d="M20 4v32M4 20h32" stroke="#1a1a1a" strokeWidth="4" strokeLinecap="round" /> },
];

export function Backdrop() {
  return (
    <div className="stage" aria-hidden="true">
      {SHAPES.map((sh, i) => (
        <div
          key={i}
          className="shape"
          style={{ left: sh.x, top: sh.y, width: sh.s, height: sh.s, transform: `rotate(${sh.r}deg)` }}
        >
          <svg width={sh.s} height={sh.s} viewBox="0 0 40 40">
            {sh.path}
          </svg>
        </div>
      ))}
    </div>
  );
}
