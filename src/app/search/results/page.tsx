import { Backdrop } from "@/components/Backdrop";
import { PageShell } from "@/components/ui/PageShell";

export default async function SearchResultsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; category?: string }>;
}) {
  const p = await searchParams;
  return (
    <>
      <Backdrop />
      <PageShell title={`Results: ${p.q ?? ""}`} back="/search">
        <p style={{ fontFamily: "var(--disp)", opacity: 0.6 }}>Full results page — connect Supabase to see live results.</p>
      </PageShell>
    </>
  );
}
