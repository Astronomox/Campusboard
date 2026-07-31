import { createAdminClient } from "@/lib/supabase/admin";

const CODE_CHARS = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // no O/0/I/1 ambiguity
const CODE_LEN   = 8;

/** Generate a cryptographically random invite code. */
export function generateCode(): string {
  const bytes  = new Uint8Array(CODE_LEN);
  crypto.getRandomValues(bytes);
  return Array.from(bytes).map((b) => CODE_CHARS[b % CODE_CHARS.length]).join("");
}

/**
 * Check whether a user is a verified member of the campus.
 * Uses the admin client so it bypasses RLS (server-only).
 */
export async function isMember(userId: string): Promise<boolean> {
  const admin = createAdminClient();
  const { data } = await admin
    .from("members")
    .select("user_id")
    .eq("user_id", userId)
    .maybeSingle();
  return data !== null;
}

/**
 * Redeem an invite code for a user. Returns the code row on success or an
 * error string on failure. Admin-client only — server-side.
 */
export async function redeemInvite(
  userId: string,
  code: string
): Promise<{ ok: true } | { ok: false; error: string }> {
  const admin = createAdminClient();
  const upper = code.trim().toUpperCase();

  const { data: invite } = await admin
    .from("invites")
    .select("code, redeemed_by")
    .eq("code", upper)
    .maybeSingle();

  if (!invite)              return { ok: false, error: "Invalid invite code." };
  if (invite.redeemed_by)  return { ok: false, error: "That code has already been used." };

  // Mark as redeemed.
  await admin
    .from("invites")
    .update({ redeemed_by: userId, redeemed_at: new Date().toISOString() })
    .eq("code", upper);

  // Add to members.
  await admin
    .from("members")
    .upsert({ user_id: userId, invite_code: upper }, { onConflict: "user_id" });

  return { ok: true };
}

/**
 * Grant an invite credit to a user (called when they hit the post threshold).
 * Idempotent: never grants more than MAX_CREDITS at once.
 */
const MAX_CREDITS = 3;

export async function maybeGrantInvite(userId: string, postCount: number): Promise<void> {
  const GRANT_EVERY = 5; // one invite credit per 5 published posts
  if (postCount % GRANT_EVERY !== 0) return;

  const admin = createAdminClient();
  await admin
    .from("members")
    .update({ invites_left: MAX_CREDITS })
    .eq("user_id", userId)
    .lt("invites_left", MAX_CREDITS);
}

/**
 * Use one invite credit and return a fresh code, or null if none left.
 */
export async function spendInviteCredit(
  userId: string
): Promise<string | null> {
  const admin = createAdminClient();

  const { data: member } = await admin
    .from("members")
    .select("invites_left")
    .eq("user_id", userId)
    .maybeSingle();

  if (!member || member.invites_left < 1) return null;

  const code = generateCode();
  await admin.from("invites").insert({ code, created_by: userId });
  await admin
    .from("members")
    .update({ invites_left: member.invites_left - 1 })
    .eq("user_id", userId);

  return code;
}
