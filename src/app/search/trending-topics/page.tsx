import Link from "next/link";
import { Backdrop } from "@/components/Backdrop";
import { PageShell } from "@/components/ui/PageShell";
import { Empty } from "@/components/ui/Empty";
import { isSupabaseConfigured } from "@/lib/config";
import { createAdminClient } from "@/lib/supabase/admin";

export const dynamic = "force-dynamic";

export const metadata = { title: "Trending topics" };

async function getTrendingKeywords(): Promise<{ word: string; count: number }[]> {
  if (!isSupabaseConfigured) return [];
  const admin = createAdminClient();
  const since = new Date(Date.now() - 48 * 3600000).toISOString();
  const { data } = await admin
    .from("posts")
    .select("body")
    .eq("status", "published")
    .gte("created_at", since)
    .limit(200);
  if (!data?.length) return [];

  // Extract words, strip short/stop words, count frequencies
  const STOP = new Set([
    "the","a","an","and","or","but","in","on","at","to","for","of","with","is",
    "was","are","were","be","been","have","has","had","do","does","did","will",
    "would","could","should","may","might","this","that","these","those","it",
    "its","my","your","our","their","his","her","i","we","you","they","he","she",
    "not","no","so","if","as","by","from","up","out","about","just","can","get",
    "all","there","what","when","who","how","very","more","too","also","than",
    "then","now","any","some","like","even","one","two","three","na","de","ni",
  ]);

  const counts = new Map<string, number>();
  (data as { body: string }[]).forEach((row) => {
    row.body.toLowerCase()
      .replace(/[^a-z0-9\s]/g, " ")
      .split(/\s+/)
      .filter((w) => w.length > 3 && !STOP.has(w))
      .forEach((w) => counts.set(w, (counts.get(w) ?? 0) + 1));
  });

  return [...counts.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 30)
    .map(([word, count]) => ({ word, count }));
}

export default async function TrendingTopicsPage() {
  const topics = await getTrendingKeywords();

  const maxCount = topics[0]?.count ?? 1;

  return (
    <>
      <Backdrop />
      <PageShell title="Trending topics" back="/search">
        <p style={{ fontFamily: "var(--disp)", fontSize: 13, opacity: 0.6, marginBottom: 20 }}>
          Keywords appearing most in posts from the last 48 hours.
        </p>

        {topics.length === 0 ? (
          <Empty icon="📈" title="Not enough data yet" body="Trending keywords appear once the board has enough recent posts." />
        ) : (
          <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
            {topics.map((t, i) => {
              const size = 12 + Math.round((t.count / maxCount) * 12);
              const COLORS = ["var(--rant)","var(--shoutout)","var(--callout)","var(--info)","var(--pink)","var(--purple)"];
              return (
                <Link
                  key={t.word}
                  href={`/search?q=${encodeURIComponent(t.word)}`}
                  style={{
                    fontFamily: "var(--disp)",
                    fontWeight: 700,
                    fontSize: size,
                    background: COLORS[i % COLORS.length],
                    border: "var(--bd)",
                    borderRadius: 10,
                    padding: "6px 13px",
                    boxShadow: "var(--hard-sm)",
                    textDecoration: "none",
                    color: "var(--ink)",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 6,
                  }}
                >
                  {t.word}
                  <span style={{ fontSize: 11, opacity: 0.6 }}>{t.count}</span>
                </Link>
              );
            })}
          </div>
        )}
      </PageShell>
    </>
  );
}
