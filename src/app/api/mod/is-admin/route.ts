import { NextResponse } from "next/server";
import { isAdmin } from "@/lib/admin";
import { isSupabaseConfigured } from "@/lib/config";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  if (!isSupabaseConfigured) return NextResponse.json({ admin: false });
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  return NextResponse.json({ admin: isAdmin(user?.email) });
}
