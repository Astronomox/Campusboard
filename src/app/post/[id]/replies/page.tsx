import Link from "next/link";
import { Backdrop } from "@/components/Backdrop";
import { PageShell } from "@/components/ui/PageShell";

export default async function RepliesPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return (
    <>
      <Backdrop />
      <PageShell title="Replies" back={`/post/${id}`}>
        <div style={{ textAlign: "center", padding: "40px 20px" }}>
          <div style={{ fontSize: 52, marginBottom: 16 }}>💬</div>
          <h3 style={{ fontFamily: "var(--disp)", fontSize: 22, fontWeight: 700, margin: "0 0 10px" }}>
            Replies are coming
          </h3>
          <p style={{ fontFamily: "var(--disp)", fontSize: 14, opacity: 0.65, maxWidth: 280, margin: "0 auto 24px", lineHeight: 1.5 }}>
            Threaded replies are planned for the next major update. For now, head back to the board and post a response.
          </p>
          <Link
            href="/post/new"
            className="post-btn press"
            style={{ textDecoration: "none", display: "inline-flex" }}
          >
            Post a response →
          </Link>
        </div>
      </PageShell>
    </>
  );
}
"// v1.0"  
