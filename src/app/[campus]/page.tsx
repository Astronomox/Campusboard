import { notFound } from "next/navigation";
import { createClient } from "@supabase/supabase-js";
import { BoardClient } from "@/components/BoardClient";
import { SUPABASE_ANON_KEY, SUPABASE_URL, isSupabaseConfigured } from "@/lib/config";
import { getCampus } from "@/lib/campuses";
import { mockFeed } from "@/lib/mockData";
import type { Post } from "@/lib/types";

export const dynamic = "force-dynamic";

async function getFeed(campus: string): Promise<Post[]> {
  if (!isSupabaseConfigured) return mockFeed(campus);
  try {
    const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    const { data, error } = await supabase
      .from("posts_with_reactions")
      .select("*")
      .eq("campus_slug", campus)
      .eq("status", "published")
      .order("created_at", { ascending: false })
      .limit(30);
    if (error) {
      console.error("[campus page] feed error:", error);
      return [];
    }
    return (data ?? []) as Post[];
  } catch (e) {
    console.error("[campus page] feed fetch error:", e);
    return [];
  }
}

export default async function CampusPage({
  params,
}: {
  params: Promise<{ campus: string }>;
}) {
  const { campus } = await params;
  const campusData = getCampus(campus);
  if (!campusData) notFound();

  const posts = await getFeed(campus);

  return (
    <BoardClient
      campus={campusData}
      initialPosts={posts}
      supabaseConfigured={isSupabaseConfigured}
    />
  );
}
"// v1.0"  
