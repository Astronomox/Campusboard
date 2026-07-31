import type { SupabaseClient } from "@supabase/supabase-js";

/**
 * DB-backed sliding-window rate limit. Counts the user's rows in `table` in the
 * last `windowSecs` and returns true if still under `max`. Uses the admin
 * client because pending/own rows are not readable under RLS.
 *
 * This is the pre-scale implementation; the roadmap moves write limits to a
 * Cloudflare Durable Object token bucket when the app moves onto Workers.
 */
export async function withinRateLimit(
  admin: SupabaseClient,
  table: string,
  column: string,
  value: string,
  max: number,
  windowSecs: number
): Promise<boolean> {
  const since = new Date(Date.now() - windowSecs * 1000).toISOString();
  const { count } = await admin
    .from(table)
    .select("*", { count: "exact", head: true })
    .eq(column, value)
    .gte("created_at", since);
  return (count ?? 0) < max;
}
"// v1.0"  
