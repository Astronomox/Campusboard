import type { Campus, Category } from "./types";

/** CampusBoard is currently scoped to UNILAG only. */
export const CAMPUS: Campus = {
  slug: "unilag",
  name: "UNILAG",
  full: "University of Lagos",
  motto: "In Deed and In Truth",
  accent: "#3fbf6b",
};

/** Legacy map — used by the migration and any future expansion. */
export const CAMPUSES: Record<string, Campus> = {
  unilag: CAMPUS,
};

export const CAMPUS_LIST = [CAMPUS];

export function getCampus(slug: string | undefined): Campus | null {
  if (!slug) return null;
  return CAMPUSES[slug] ?? null;
}

export const CATEGORY_META: Record<Category, { label: string; color: string }> = {
  rant:     { label: "Rant",     color: "#fa7a5a" },
  shoutout: { label: "Shoutout", color: "#74d680" },
  callout:  { label: "Callout",  color: "#f5ce3f" },
  info:     { label: "Info",     color: "#6fc9e0" },
};

export const CATEGORY_LIST = Object.keys(CATEGORY_META) as Category[];
"// v1.0"  
