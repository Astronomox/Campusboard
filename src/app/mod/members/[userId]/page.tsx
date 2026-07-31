"use client";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { AdminShell } from "@/components/ui/AdminShell";

interface Member { user_id: string; custom_tag: string | null; post_count: number; invites_left: number; joined_at: string }
interface Post { id: string; body: string; category: string; status: string; created_at: string }

export default function MemberDetailPage() {
  const { userId } = useParams<{ userId: string }>();
  const [member,     setMember]     = useState<Member | null>(null);
  const [posts,      setPosts]      = useState<Post[]>([]);
  const [customTag,  setCustomTag]  = useState("");
  const [saving,     setSaving]     = useState(false);
  const [toast,      setToast]      = useState<string | null>(null);

  useEffect(() => {
    fetch(`/api/mod/member-detail?userId=${userId}`)
      .then((r) => r.json())
      .then((d: { member: Member; posts: Post[] }) => {
        setMember(d.member);
        setPosts(d.posts ?? []);
        setCustomTag(d.member?.custom_tag ?? "");
      })
      .catch(() => undefined);
  }, [userId]);

  async function saveTag() {
    setSaving(true);
    await fetch("/api/mod/set-tag", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ user_id: userId, custom_tag: customTag || null }),
    });
    setSaving(false);
    setToast("Saved");
    setTimeout(() => setToast(null), 1800);
  }

  return (
    <AdminShell title="Member detail" current="/mod/members">
      {!member
        ? <p style={{ fontFamily: "var(--disp)" }}>Loading…</p>
        : <>
            <div className="astat-row">
              <div className="astat"><div className="n" style={{ fontSize: 13 }}>{member.user_id.slice(0, 8)}…</div><div className="l">User ID</div></div>
              <div className="astat accent"><div className="n">{member.post_count}</div><div className="l">Posts</div></div>
              <div className="astat"><div className="n">{member.invites_left}</div><div className="l">Invite credits</div></div>
            </div>

            <div className="aform" style={{ marginBottom: 24 }}>
              <div className="afield">
                <label>Custom anon tag (leave blank to use default HMAC tag)</label>
                <div style={{ display: "flex", gap: 10 }}>
                  <input className="ainput" style={{ flex: 1 }} value={customTag} onChange={(e) => setCustomTag(e.target.value)} placeholder="e.g. ANONxGODx000" maxLength={30} />
                  <button type="button" className="post-btn press" disabled={saving} onClick={saveTag}>{saving ? "Saving…" : "Save"}</button>
                </div>
              </div>
            </div>

            {toast && <div className="toast" style={{ position: "static", transform: "none", marginBottom: 16 }}>{toast}</div>}

            <h3 style={{ fontFamily: "var(--disp)", fontSize: 16, margin: "0 0 10px" }}>Posts ({posts.length})</h3>
            <table className="atable">
              <thead><tr><th>Body</th><th>Category</th><th>Status</th><th>Date</th></tr></thead>
              <tbody>
                {posts.map((p) => (
                  <tr key={p.id}>
                    <td><a href={`/mod/post/${p.id}`} style={{ color: "var(--ink)" }}>{p.body.slice(0, 80)}…</a></td>
                    <td>{p.category}</td>
                    <td>{p.status}</td>
                    <td style={{ fontSize: 12, opacity: 0.65 }}>{new Date(p.created_at).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </>
      }
    </AdminShell>
  );
}
