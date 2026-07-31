export type Category = "rant" | "shoutout" | "callout" | "info";

export type PostStatus = "pending" | "published" | "flagged" | "rejected";

export type ReactionEmoji = "fire" | "skull" | "laugh" | "hundred";

export const REACTIONS: ReactionEmoji[] = ["fire", "skull", "laugh", "hundred"];

export interface Post {
  id: string;
  campus_slug: string;
  body: string;
  anon_tag: string;
  category: Category;
  status: PostStatus;
  created_at: string;
  reactions: Record<ReactionEmoji, number>;
}

export interface Campus {
  slug: string;
  name: string;
  full: string;
  motto: string;
  /** chrome color for this campus: FAB, switch, active nav, crest */
  accent: string;
}

export type ModerationVerdict = "safe" | "borderline" | "reject";

export interface ModerationResult {
  verdict: ModerationVerdict;
  reason: string;
}
"// v1.0"  
