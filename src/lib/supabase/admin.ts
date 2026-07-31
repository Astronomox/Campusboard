import { createClient } from "@supabase/supabase-js";
import { SUPABASE_URL } from "@/lib/config";

/**
 * Service-role Supabase client. Bypasses RLS, so it is the only thing allowed
 * to set post status (moderation), write bans, and read the reports/queue.
 * Server-only: never import into a client component.
 */
export function createAdminClient() {
  return createClient(SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY ?? "", {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
"// v1.0"  
