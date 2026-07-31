import type { Post } from "./types";

function minutesAgo(mins: number): string {
  return new Date(Date.now() - mins * 60_000).toISOString();
}

const BASE: Omit<Post, "campus_slug">[] = [
  {
    id: "m1",
    body: "The wifi in DLI has been down for three days straight. Are we paying service charge for vibes?",
    anon_tag: "Anon #4F2A",
    category: "rant",
    status: "published",
    created_at: minutesAgo(2),
    reactions: { fire: 34, skull: 12, laugh: 45, hundred: 8 },
  },
  {
    id: "m2",
    body: "Shoutout to that one lecturer in Mass Comm who actually marks scripts on time. You are a real one.",
    anon_tag: "Anon #9B1C",
    category: "shoutout",
    status: "published",
    created_at: minutesAgo(8),
    reactions: { fire: 5, skull: 0, laugh: 2, hundred: 67 },
  },
  {
    id: "m3",
    body: "If you parked your Corolla behind Faculty of Science blocking everyone in, we need to talk.",
    anon_tag: "Anon #E7D3",
    category: "callout",
    status: "published",
    created_at: minutesAgo(15),
    reactions: { fire: 8, skull: 41, laugh: 29, hundred: 3 },
  },
  {
    id: "m4",
    body: "Someone left their earbuds in LT1 after the 2pm ECO lecture. Message the department page to claim.",
    anon_tag: "Anon #2A8F",
    category: "info",
    status: "published",
    created_at: minutesAgo(22),
    reactions: { fire: 2, skull: 0, laugh: 0, hundred: 38 },
  },
  {
    id: "m5",
    body: "The way they increased suya price at night market without warning. Inflation is real on this campus.",
    anon_tag: "Anon #CC41",
    category: "rant",
    status: "published",
    created_at: minutesAgo(31),
    reactions: { fire: 52, skull: 18, laugh: 33, hundred: 11 },
  },
];

export function mockFeed(campusSlug: string): Post[] {
  return BASE.map((p) => ({ ...p, campus_slug: campusSlug }));
}
"// v1.0"  
