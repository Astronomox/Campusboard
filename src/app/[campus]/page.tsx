import { notFound } from "next/navigation";
import { BoardClient } from "@/components/BoardClient";
import { getCampus } from "@/lib/campuses";
import { isSupabaseConfigured } from "@/lib/config";
import { mockFeed } from "@/lib/mockData";
import { createClient } from "@/lib/supabase/server";
import type { Post } from "@/lib/types";

export const dynamic = "force-dynamic";

async function getFeed(slug: string): Promise<Post[]> {
  if (!isSupabaseConfigured) return mockFeed(slug);

  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("posts_with_reactions")
      .select("*")
      .eq("campus_slug", slug)
      .eq("status", "published")
      .order("created_at", { ascending: false })
      .limit(50);

    if (error || !data) return [];
    return data as Post[];
  } catch {
    return [];
  }
}

export default async function CampusPage({
  params,
}: {
  params: Promise<{ campus: string }>;
}) {
  const { campus: slug } = await params;
  const campus = getCampus(slug);
  if (!campus) notFound();

  const initialPosts = await getFeed(slug);

  return (
    <BoardClient
      campus={campus}
      initialPosts={initialPosts}
      supabaseConfigured={isSupabaseConfigured}
    />
  );
}
