import { SUPABASE_URL } from "@/lib/config";
import { createAdminClient } from "@/lib/supabase/admin";
import type { ModerationResult, PostStatus } from "@/lib/types";

const MAX_LINKS = 3;

/** Fetch active blocklist patterns from the DB (cached in module scope per cold start). */
let _cachedPatterns: RegExp[] | null = null;
let _cacheTime = 0;
const CACHE_TTL = 5 * 60_000; // 5 min

async function getBlockedPatterns(): Promise<RegExp[]> {
  const now = Date.now();
  if (_cachedPatterns && now - _cacheTime < CACHE_TTL) return _cachedPatterns;
  try {
    const admin = createAdminClient();
    const { data } = await admin.from("wordlist").select("pattern");
    _cachedPatterns = (data ?? []).map((r: { pattern: string }) => {
      try { return new RegExp(r.pattern, "i"); } catch { return null; }
    }).filter(Boolean) as RegExp[];
    _cacheTime = now;
    return _cachedPatterns;
  } catch {
    return _cachedPatterns ?? [];
  }
}

/** Cheap deterministic gate — runs before the model. */
export async function preFilter(text: string): Promise<"reject" | "ok"> {
  const linkCount = (text.match(/https?:\/\//gi) ?? []).length;
  if (linkCount > MAX_LINKS) return "reject";
  const patterns = await getBlockedPatterns();
  for (const re of patterns) {
    if (re.test(text)) return "reject";
  }
  return "ok";
}

async function classify(text: string): Promise<ModerationResult> {
  try {
    const res = await fetch(`${SUPABASE_URL}/functions/v1/moderate-post`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY ?? ""}`,
      },
      body: JSON.stringify({ text }),
    });
    if (!res.ok) return { verdict: "borderline", reason: "moderation unavailable" };
    return (await res.json()) as ModerationResult;
  } catch {
    return { verdict: "borderline", reason: "moderation error" };
  }
}

/**
 * Runs after the response via `next/server` `after()`.
 * Classifies the post and flips its status in the DB.
 * Fail-safe: anything other than clean "safe" stays out of the public feed.
 */
export async function finalizeModeration(postId: string, text: string): Promise<void> {
  const verdict = await classify(text);
  const status: PostStatus =
    verdict.verdict === "reject" ? "rejected"
    : verdict.verdict === "safe" ? "published"
    : "flagged";
  const admin = createAdminClient();
  await admin.from("posts").update({ status }).eq("id", postId);
}
"// v1.0"  
