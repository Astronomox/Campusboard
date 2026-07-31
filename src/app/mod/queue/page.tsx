import { isAdmin } from "@/lib/admin";
import { isSupabaseConfigured } from "@/lib/config";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import { AdminShell } from "@/components/ui/AdminShell";
import { ModQueue } from "@/components/ModQueue";
import type { FlaggedPost } from "@/components/ModQueue";

export const dynamic = "force-dynamic";

export default async function QueuePage() {
  if (!isSupabaseConfigured) return <div style={{padding:40}}>Not configured.</div>;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user || !isAdmin(user.email)) return <div style={{padding:40}}>Forbidden.</div>;

  const admin = createAdminClient();
  const { data } = await admin.from("posts").select("id,body,campus_slug,category,created_at,user_id")
    .eq("status", "flagged").order("created_at", { ascending: false }).limit(50);
  const flagged = (data ?? []) as FlaggedPost[];

  return (
    <AdminShell title="Flagged queue" current="/mod/queue">
      <ModQueue flagged={flagged} reports={[]} adminEmail={user.email ?? ""} />
    </AdminShell>
  );
}
