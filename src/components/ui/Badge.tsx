import type { Category } from "@/lib/types";
import { CATEGORY_META } from "@/lib/campuses";

export function CategoryBadge({ category }: { category: Category }) {
  const cat = CATEGORY_META[category];
  return (
    <span className="sticker" style={{ background: cat.color }}>{cat.label}</span>
  );
}

export function StatusBadge({ status }: { status: string }) {
  const colors: Record<string, string> = {
    published: "var(--shoutout)",
    pending: "var(--callout)",
    flagged: "var(--rant)",
    rejected: "#ccc",
  };
  return (
    <span className="sticker" style={{ background: colors[status] ?? "#eee" }}>{status}</span>
  );
}
"// v1.0"  
