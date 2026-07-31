import { createHmac } from "node:crypto";

const SECRET = process.env.ANON_TAG_SECRET ?? "dev-insecure-anon-secret-change-me";

/** Stable deterministic anon tag. Same user always gets the same tag on this campus. */
export function stableAnonTag(userId: string, campusSlug: string): string {
  const digest = createHmac("sha256", SECRET)
    .update(`${userId}:${campusSlug}`)
    .digest("hex");
  return `Anon #${digest.slice(0, 4).toUpperCase()}`;
}

/** Returns custom_tag if set (e.g. ANONxGODx000 for admin), else the HMAC tag. */
export function resolveTag(userId: string, campusSlug: string, customTag?: string | null): string {
  return customTag ?? stableAnonTag(userId, campusSlug);
}

/** Client-side random tag for demo mode only. */
export function anonTag(): string {
  return `Anon #${Math.floor(Math.random() * 0xffff).toString(16).toUpperCase().padStart(4, "0")}`;
}
