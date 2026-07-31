import { z } from "zod";

export const CATEGORY = z.enum(["rant", "shoutout", "callout", "info"]);
export const EMOJI = z.enum(["fire", "skull", "laugh", "hundred"]);

/** POST /api/posts body */
export const createPostSchema = z.object({
  campus: z.string().min(1).max(40),
  body: z.string().trim().min(1).max(280),
  category: CATEGORY,
});

/** POST /api/react body */
export const reactSchema = z.object({
  post_id: z.string().min(1).max(64),
  emoji: EMOJI,
});

/** POST /api/report body */
export const reportSchema = z.object({
  post_id: z.string().min(1).max(64),
  reason: z.string().trim().min(1).max(60),
});

/** POST /api/mod/decision body */
export const modDecisionSchema = z.object({
  post_id: z.string().min(1).max(64),
  action: z.enum(["approve", "reject"]),
});

/** POST /api/mod/ban body */
export const modBanSchema = z.object({
  user_id: z.string().min(1).max(64),
  campus: z.string().min(1).max(40),
  reason: z.string().trim().max(120).optional().default(""),
  days: z.coerce.number().int().min(1).max(3650).optional(),
});

/** GET /api/feed query */
export const feedQuerySchema = z.object({
  campus: z.string().min(1).max(40),
  after: z.string().min(1).max(40).optional(),
  before: z.string().min(1).max(40).optional(),
  limit: z.coerce.number().int().min(1).max(50).default(30),
});

/** GET /api/search query */
export const searchQuerySchema = z.object({
  campus: z.string().min(1).max(40),
  q: z.string().trim().max(100).optional().default(""),
  category: CATEGORY.optional(),
  cursor: z.string().min(1).max(40).optional(),
  limit: z.coerce.number().int().min(1).max(30).default(20),
});

/** Parse URLSearchParams into a plain object for schema parsing. */
export function paramsToObject(sp: URLSearchParams): Record<string, string> {
  const out: Record<string, string> = {};
  sp.forEach((value, key) => {
    out[key] = value;
  });
  return out;
}
"// v1.0"  
