import { getCampus } from "@/lib/campuses";

/**
 * Original geometric campus emblems in the retro style: accent shield with an
 * ink outline and a soft top highlight. Not reproductions of official seals.
 */
export function CampusCrest({ slug, size = 38 }: { slug: string; size?: number }) {
  const campus = getCampus(slug);
  if (!campus) return null;

  const shield = "M20 3 34 8v11c0 8-6 13-14 17-8-4-14-9-14-17V8Z";

  return (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none" aria-hidden="true">
      <defs>
        <linearGradient id={`cg-${slug}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#fff" stopOpacity="0.55" />
          <stop offset="1" stopColor="#000" stopOpacity="0.1" />
        </linearGradient>
      </defs>
      <path d={shield} fill={campus.accent} stroke="#1a1a1a" strokeWidth="2.4" />
      <path d={shield} fill={`url(#cg-${slug})`} />

      {slug === "unilag" && (
        <g>
          <path
            d="M11 15c3-1.4 6-1.4 9 0 3-1.4 6-1.4 9 0v8c-3-1.4-6-1.4-9 0-3-1.4-6-1.4-9 0Z"
            fill="#fffef9"
            stroke="#1a1a1a"
            strokeWidth="1"
          />
          <path d="M20 15v8" stroke="#1a1a1a" strokeWidth="1" />
          <path
            d="M20 6.4l1 2 2.2.3-1.6 1.5.4 2.2-2-1-2 1 .4-2.2L15 8.7l2.2-.3Z"
            fill="#fffef9"
            stroke="#1a1a1a"
            strokeWidth="0.8"
          />
        </g>
      )}

      {slug === "unilorin" && (
        <g>
          <path d="M13 24v-4a7 7 0 0 1 14 0v4Z" fill="#fffef9" stroke="#1a1a1a" strokeWidth="1" />
          <g stroke="#fffef9" strokeWidth="1.4" strokeLinecap="round">
            <path d="M20 6v3M14.5 8.5l1.4 2M25.5 8.5l-1.4 2" />
          </g>
        </g>
      )}

      {slug === "oau" && (
        <g>
          <circle cx="20" cy="13" r="3.6" fill="#fffef9" stroke="#1a1a1a" strokeWidth="1" />
          <path d="M12.5 22a7.5 7.5 0 0 1 15 0" stroke="#fffef9" strokeWidth="1.6" />
          <path d="M20 18v8" stroke="#fffef9" strokeWidth="2" strokeLinecap="round" />
        </g>
      )}
    </svg>
  );
}
