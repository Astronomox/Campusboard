import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";
import { SUPABASE_ANON_KEY, SUPABASE_URL, isSupabaseConfigured } from "@/lib/config";
import { mockFeed } from "@/lib/mockData";
import type { Post } from "@/lib/types";
import { feedQuerySchema, paramsToObject } from "@/lib/validation";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const parsed = feedQuerySchema.safeParse(paramsToObject(searchParams));
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid query" }, { status: 400 });
  }
  const { campus, after, before, limit } = parsed.data;

  if (!isSupabaseConfigured) {
    return NextResponse.json({ posts: mockFeed(campus), nextCursor: null });
  }

  // Anonymous read client (no cookies) so the base feed stays edge-cacheable.
  const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
  let query = supabase
    .from("posts_with_reactions")
    .select("*")
    .eq("campus_slug", campus)
    .eq("status", "published")
    .order("created_at", { ascending: false })
    .limit(limit + 1);

  if (after) query = query.gt("created_at", after);
  if (before) query = query.lt("created_at", before);

  const { data, error } = await query;
  if (error) {
    return NextResponse.json({ posts: [], nextCursor: null }, { status: 200 });
  }

  const rows = (data ?? []) as Post[];
  const hasMore = rows.length > limit;
  const posts = hasMore ? rows.slice(0, limit) : rows;
  const nextCursor = hasMore ? posts[posts.length - 1].created_at : null;

  const res = NextResponse.json({ posts, nextCursor });
  // Only the base page (no cursor) is shared and cacheable.
  if (!after && !before) {
    res.headers.set("Cache-Control", "s-maxage=10, stale-while-revalidate=5");
  }
  return res;
}
"// v1.0"  
