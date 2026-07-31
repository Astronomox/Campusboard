import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";
import { SUPABASE_ANON_KEY, SUPABASE_URL, isSupabaseConfigured } from "@/lib/config";
import { mockFeed } from "@/lib/mockData";
import type { Post } from "@/lib/types";
import { paramsToObject, searchQuerySchema } from "@/lib/validation";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const parsed = searchQuerySchema.safeParse(paramsToObject(searchParams));
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid query" }, { status: 400 });
  }
  const { campus, q, category, cursor, limit } = parsed.data;

  if (!isSupabaseConfigured) {
    const ql = q.toLowerCase();
    const posts = mockFeed(campus).filter(
      (p) =>
        (!category || p.category === category) &&
        (ql === "" || p.body.toLowerCase().includes(ql))
    );
    return NextResponse.json({ posts, nextCursor: null });
  }

  const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
  let query = supabase
    .from("posts_with_reactions")
    .select("*")
    .eq("campus_slug", campus)
    .eq("status", "published");

  if (q) query = query.ilike("body", `%${q}%`);
  if (category) query = query.eq("category", category);
  if (cursor) query = query.lt("created_at", cursor);

  query = query.order("created_at", { ascending: false }).limit(limit + 1);

  const { data, error } = await query;
  if (error) {
    return NextResponse.json({ posts: [], nextCursor: null }, { status: 200 });
  }

  const rows = (data ?? []) as Post[];
  const hasMore = rows.length > limit;
  const posts = hasMore ? rows.slice(0, limit) : rows;
  const nextCursor = hasMore ? posts[posts.length - 1].created_at : null;

  return NextResponse.json({ posts, nextCursor });
}
"// v1.0"  
