import { Backdrop } from "@/components/Backdrop";
import { PageShell } from "@/components/ui/PageShell";
import { isSupabaseConfigured } from "@/lib/config";
import { createAdminClient } from "@/lib/supabase/admin";

export const metadata = { title: "All tags" };


export const dynamic = "force-dynamic";

export default async function TagsPage() {
  let tags: string[] = [];
  if (isSupabaseConfigured) {
    const admin = createAdminClient();
    const { data } = await admin.from("posts").select("anon_tag")
      .eq("status", "published").order("created_at", { ascending: false }).limit(500);
    const seen = new Set<string>();
    (data ?? []).forEach((r: { anon_tag: string }) => seen.add(r.anon_tag));
    tags = [...seen].slice(0, 100);
  }

  return (
    <>
      <Backdrop />
      <PageShell title="All tags" back="/feed">
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
          {tags.length === 0
            ? <p style={{ fontFamily: "var(--disp)", opacity: 0.6 }}>No tags yet.</p>
            : tags.map((t) => (
                <a key={t} href={`/search/tag/${encodeURIComponent(t)}`}
                  style={{ fontFamily: "monospace", fontWeight: 700, fontSize: 14, letterSpacing: "0.06em", background: "var(--paper)", border: "var(--bd)", borderRadius: 10, padding: "6px 13px", boxShadow: "var(--hard-sm)", textDecoration: "none", color: "var(--ink)" }}>
                  {t}
                </a>
              ))
          }
        </div>
      </PageShell>
    </>
  );
}
