import { Backdrop } from "@/components/Backdrop";
import { PageShell } from "@/components/ui/PageShell";

export default async function ReactionsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return (
    <>
      <Backdrop />
      <PageShell title="Reactions" back={`/post/${id}`}>
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
          {[{ e: "🔥", label: "Fire" }, { e: "💀", label: "Skull" }, { e: "😊", label: "Laugh" }, { e: "💯", label: "Hundred" }].map((r) => (
            <div key={r.label} className="stat grain" style={{ background: "var(--paper)", flex: "1 1 120px" }}>
              <div className="num">{r.e}</div>
              <div className="lbl">{r.label}</div>
            </div>
          ))}
        </div>
      </PageShell>
    </>
  );
}
