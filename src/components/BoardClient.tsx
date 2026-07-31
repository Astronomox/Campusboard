"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { CATEGORY_LIST, CATEGORY_META } from "@/lib/campuses";
import { censorNames } from "@/lib/censor";
import { anonTag } from "@/lib/config";
import { createClient } from "@/lib/supabase/client";
import type { Campus, Category, Post, ReactionEmoji } from "@/lib/types";
import { Backdrop } from "./Backdrop";
import { BottomNav, type Tab } from "./BottomNav";
import { CampusCrest } from "./CampusCrest";
import { ComposeSheet } from "./ComposeSheet";
import { PostCard } from "./PostCard";
import { ReportSheet } from "./ReportSheet";
import { InviteGate, InviteShare } from "./InviteGate";
import { RetroDots } from "./RetroDots";
import { SearchIcon, UserIcon } from "./icons";

const POLL_MS = 15_000;

function totalReactions(p: Post) {
  return Object.values(p.reactions).reduce((a, b) => a + b, 0);
}

export function BoardClient({
  campus,
  initialPosts,
  supabaseConfigured,
}: {
  campus: Campus;
  initialPosts: Post[];
  supabaseConfigured: boolean;
}) {
  const [posts, setPosts]               = useState<Post[]>(initialPosts);
  const [pendingNew, setPendingNew]     = useState<Post[]>([]);
  const [index, setIndex]               = useState(0);
  const [tab, setTab]                   = useState<Tab>("feed");
  const [composeOpen, setComposeOpen]   = useState(false);
  const [submitting, setSubmitting]     = useState(false);
  const [postError, setPostError]       = useState<string | null>(null);
  const [reactions, setReactions]       = useState<Record<string, ReactionEmoji | null>>({});
  const [reportTarget,  setReportTarget]  = useState<string | null>(null);
  const [bookmarks,      setBookmarks]      = useState<Set<string>>(new Set());
  const [reportSubmitting, setReportSubmitting] = useState(false);
  const [toast, setToast]               = useState<string | null>(null);

  const touchStartY  = useRef<number | null>(null);
  const wheelLock    = useRef(false);
  const postsRef     = useRef(posts);
  const pendingRef   = useRef(pendingNew);
  const loadingOlder = useRef(false);
  const toastTimer   = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useEffect(() => { postsRef.current  = posts;      }, [posts]);
  useEffect(() => { pendingRef.current = pendingNew; }, [pendingNew]);

  const isFeedTab = tab === "feed" || tab === "trending";

  const visiblePosts = useMemo(() => {
    if (tab === "trending")
      return [...posts].sort((a, b) => totalReactions(b) - totalReactions(a));
    return posts;
  }, [posts, tab]);

  const bounded = Math.min(index, Math.max(visiblePosts.length - 1, 0));

  const navigate = useCallback(
    (dir: "up" | "down") => {
      setIndex((prev) => {
        const max = visiblePosts.length - 1;
        return dir === "up" ? Math.max(prev - 1, 0) : Math.min(prev + 1, max);
      });
    },
    [visiblePosts.length]
  );

  // Keyboard nav
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (composeOpen || !isFeedTab) return;
      if (e.key === "ArrowDown" || e.key === "j") navigate("down");
      if (e.key === "ArrowUp"   || e.key === "k") navigate("up");
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [navigate, composeOpen, isFeedTab]);

  // Live poll
  useEffect(() => {
    if (!supabaseConfigured) return;
    const tick = async () => {
      try {
        const res  = await fetch(`/api/feed?campus=${campus.slug}`);
        if (!res.ok) return;
        const data = await res.json() as { posts: Post[] };
        const fetched = data.posts ?? [];
        if (!fetched.length) return;
        const byId = new Map(fetched.map((p) => [p.id, p]));
        setPosts((prev) =>
          prev.map((p) => { const f = byId.get(p.id); return f ? { ...p, reactions: f.reactions } : p; })
        );
        const currentIds = new Set(postsRef.current.map((p) => p.id));
        const pendingIds = new Set(pendingRef.current.map((p) => p.id));
        const fresh = fetched.filter((p) => !currentIds.has(p.id) && !pendingIds.has(p.id));
        if (fresh.length) setPendingNew((prev) => [...fresh, ...prev]);
      } catch { /* ignore */ }
    };
    const id = window.setInterval(tick, POLL_MS);
    return () => window.clearInterval(id);
  }, [supabaseConfigured, campus.slug]);

  // Load older posts when near the end
  useEffect(() => {
    if (!supabaseConfigured || tab !== "feed") return;
    if (bounded < posts.length - 3 || loadingOlder.current) return;
    const oldest = posts[posts.length - 1]?.created_at;
    if (!oldest) return;
    loadingOlder.current = true;
    fetch(`/api/feed?campus=${campus.slug}&before=${encodeURIComponent(oldest)}&limit=20`)
      .then((r) => r.json())
      .then((data: { posts: Post[] }) => {
        const older = data.posts ?? [];
        if (older.length) {
          setPosts((prev) => {
            const ids = new Set(prev.map((p) => p.id));
            return [...prev, ...older.filter((p) => !ids.has(p.id))];
          });
        }
      })
      .catch(() => undefined)
      .finally(() => { loadingOlder.current = false; });
  }, [bounded, posts, supabaseConfigured, tab, campus.slug]);

  function revealNew() {
    setPosts((prev) => [...pendingNew, ...prev]);
    setPendingNew([]);
    setTab("feed");
    setIndex(0);
  }

  function onTouchStart(e: React.TouchEvent) { touchStartY.current = e.touches[0].clientY; }
  function onTouchEnd(e: React.TouchEvent) {
    if (touchStartY.current === null) return;
    const diff = touchStartY.current - e.changedTouches[0].clientY;
    if (Math.abs(diff) > 45) navigate(diff > 0 ? "down" : "up");
    touchStartY.current = null;
  }
  function onWheel(e: React.WheelEvent) {
    if (wheelLock.current || Math.abs(e.deltaY) < 20) return;
    wheelLock.current = true;
    navigate(e.deltaY > 0 ? "down" : "up");
    window.setTimeout(() => { wheelLock.current = false; }, 460);
  }

  const showToast = useCallback((msg: string) => {
    setToast(msg);
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(null), 2200);
  }, []);

  const handleReact = useCallback(
    (postId: string, emoji: ReactionEmoji) => {
      setReactions((prev) => ({ ...prev, [postId]: prev[postId] === emoji ? null : emoji }));
      if (supabaseConfigured) {
        void fetch("/api/react", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ post_id: postId, emoji }),
        }).catch(() => undefined);
      }
    },
    [supabaseConfigured]
  );

  const handlePost = useCallback(
    async (body: string, category: Category) => {
      setSubmitting(true);
      setPostError(null);

      if (!supabaseConfigured) {
        await new Promise((r) => setTimeout(r, 450));
        const local: Post = {
          id: `local-${Date.now()}`,
          campus_slug: campus.slug,
          body: censorNames(body),
          anon_tag: anonTag(),
          category,
          status: "published",
          created_at: new Date().toISOString(),
          reactions: { fire: 0, skull: 0, laugh: 0, hundred: 0 },
        };
        setPosts((p) => [local, ...p]);
        setTab("feed");
        setIndex(0);
        setComposeOpen(false);
        setSubmitting(false);
        return;
      }

      try {
        const res  = await fetch("/api/posts", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ campus: campus.slug, body, category }),
        });
        const data = await res.json() as { post?: Post; reason?: string; error?: string };
        if (res.status === 401) { setPostError("Sign in on the You tab to post."); return; }
        if (res.status === 403) { setPostError("You are banned from this campus."); return; }
        if (res.status === 422) { setPostError(data.reason ?? "Post held by moderation."); return; }
        if (res.status === 429) { setPostError("You're posting too fast. Slow down."); return; }
        if (!res.ok)            { setPostError("Could not post right now. Try again."); return; }
        setPosts((p) => [data.post as Post, ...p]);
        setTab("feed");
        setIndex(0);
        setComposeOpen(false);
      } catch { setPostError("Network error. Try again."); }
      finally  { setSubmitting(false); }
    },
    [campus.slug, supabaseConfigured]
  );

  const handleBookmark = useCallback(
    async (postId: string) => {
      const newBookmarks = new Set(bookmarks);
      const action = newBookmarks.has(postId) ? "unsave" : "save";
      if (action === "save") newBookmarks.add(postId); else newBookmarks.delete(postId);
      setBookmarks(newBookmarks);
      showToast(action === "save" ? "Saved 🔖" : "Removed");
      if (supabaseConfigured) {
        void fetch("/api/bookmarks", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ post_id: postId, action }),
        }).catch(() => undefined);
      }
    },
    [bookmarks, supabaseConfigured, showToast]
  );

  const handleReport = useCallback(
    async (reason: string) => {
      if (!reportTarget) return;
      setReportSubmitting(true);
      if (!supabaseConfigured) {
        await new Promise((r) => setTimeout(r, 300));
        setReportSubmitting(false);
        setReportTarget(null);
        showToast("Reported (demo)");
        return;
      }
      try {
        const res = await fetch("/api/report", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ post_id: reportTarget, reason }),
        });
        if      (res.status === 401) showToast("Sign in to report");
        else if (res.status === 429) showToast("Too many reports");
        else if (res.ok)             showToast("Reported. Thanks.");
        else                         showToast("Could not report");
      } catch { showToast("Network error"); }
      finally {
        setReportSubmitting(false);
        setReportTarget(null);
      }
    },
    [reportTarget, supabaseConfigured, showToast]
  );

  const reactionsGiven = Object.values(reactions).filter(Boolean).length;

  return (
    <div className="board" style={{ "--accent": campus.accent } as React.CSSProperties}>
      <Backdrop />

      {/* Top bar — no Switch button, UNILAG only */}
      <header className="topbar grain">
        <div className="crest-slot">
          <CampusCrest slug={campus.slug} size={38} />
        </div>
        <div className="cid">
          <div className="cname">{campus.name}</div>
          <div className="cmotto">{campus.motto}</div>
        </div>
      </header>

      {/* New-posts pill */}
      {isFeedTab && pendingNew.length > 0 && (
        <button type="button" className="newpill press" onClick={revealNew}>
          ↑ {pendingNew.length} new {pendingNew.length === 1 ? "post" : "posts"}
        </button>
      )}

      {/* Feed */}
      {isFeedTab && visiblePosts.length === 0 && (
        <div className="feed-empty">
          <div className="feed-empty-inner">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.35 }}>
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
            </svg>
            <h3 className="feed-empty-h">No posts yet</h3>
            <p className="feed-empty-p">Be the first to post something on the board.</p>
            <button
              type="button"
              className="post-btn press"
              onClick={() => { setPostError(null); setComposeOpen(true); }}
            >
              Post something →
            </button>
          </div>
        </div>
      )}

      {isFeedTab && visiblePosts.length > 0 && (
        <>
          <div className="rail">
            {visiblePosts.map((p, i) => (
              <button
                key={p.id}
                type="button"
                aria-label={`Go to post ${i + 1}`}
                className={bounded === i ? "pip on" : "pip"}
                onClick={() => setIndex(i)}
              />
            ))}
          </div>

          <div
            className="feed"
            onTouchStart={onTouchStart}
            onTouchEnd={onTouchEnd}
            onWheel={onWheel}
          >
            {/* track is just a container; each slide translates independently */}
            <div className="feed-track">
              {visiblePosts.map((post, i) => (
                <div
                  key={post.id}
                  className="feed-slide"
                  style={{ transform: `translateY(${(i - bounded) * 100}%)` }}
                >
                  <PostCard
                    post={post}
                    userReaction={reactions[post.id] ?? null}
                    onReact={handleReact}
                    onReport={setReportTarget}
                    onBookmark={handleBookmark}
                    bookmarked={bookmarks.has(post.id)}
                  />
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {tab === "search" && (
        <SearchScreen posts={posts} supabaseConfigured={supabaseConfigured} campusSlug={campus.slug} />
      )}

      {tab === "you" && (
        <YouScreen
          supabaseConfigured={supabaseConfigured}
          postCount={posts.length}
          reactionsGiven={reactionsGiven}
        />
      )}

      <BottomNav
        active={tab}
        onSelect={(t) => { setTab(t); if (t === "feed" || t === "trending") setIndex(0); }}
        onCompose={() => { setPostError(null); setComposeOpen(true); }}
      />

      {composeOpen && (
        <ComposeSheet
          submitting={submitting}
          error={postError}
          onClose={() => setComposeOpen(false)}
          onPost={handlePost}
        />
      )}

      {reportTarget && (
        <ReportSheet
          submitting={reportSubmitting}
          onClose={() => setReportTarget(null)}
          onSubmit={handleReport}
        />
      )}

      {toast && <div className="toast">{toast}</div>}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Search screen                                                       */
/* ------------------------------------------------------------------ */
function SearchScreen({
  posts,
  supabaseConfigured,
  campusSlug,
}: {
  posts: Post[];
  supabaseConfigured: boolean;
  campusSlug: string;
}) {
  const [query,   setQuery]   = useState("");
  const [filter,  setFilter]  = useState<Category | "all">("all");
  const [results, setResults] = useState<Post[]>([]);
  const [cursor,  setCursor]  = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const q       = query.trim();
  const browsing = q === "" && filter === "all";

  function buildParams(extra?: Record<string, string>) {
    const p = new URLSearchParams({ campus: campusSlug, limit: "20", ...extra });
    if (q)              p.set("q", q);
    if (filter !== "all") p.set("category", filter);
    return p;
  }

  // Demo mode: filter in memory
  useEffect(() => {
    if (supabaseConfigured) return;
    const ql = q.toLowerCase();
    setResults(
      posts.filter(
        (p) => (filter === "all" || p.category === filter) &&
               (ql === "" || p.body.toLowerCase().includes(ql))
      )
    );
    setCursor(null);
  }, [supabaseConfigured, posts, q, filter]);

  // Live mode: query the DB, debounced
  useEffect(() => {
    if (!supabaseConfigured) return;
    if (browsing) { setResults([]); setCursor(null); return; }
    setLoading(true);
    const t = setTimeout(async () => {
      try {
        const res  = await fetch(`/api/search?${buildParams()}`);
        const data = await res.json() as { posts: Post[]; nextCursor: string | null };
        setResults(data.posts ?? []);
        setCursor(data.nextCursor ?? null);
      } catch { setResults([]); setCursor(null); }
      finally   { setLoading(false); }
    }, 300);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [supabaseConfigured, browsing, q, filter, campusSlug]);

  async function loadMore() {
    if (!cursor) return;
    try {
      const res  = await fetch(`/api/search?${buildParams({ cursor })}`);
      const data = await res.json() as { posts: Post[]; nextCursor: string | null };
      setResults((prev) => [...prev, ...(data.posts ?? [])]);
      setCursor(data.nextCursor ?? null);
    } catch { /* ignore */ }
  }

  return (
    <div className="screen">
      <h1 className="screen-h1">Search</h1>
      <p className="screen-sub">Find posts across the board</p>

      <div className="searchbar grain">
        <SearchIcon size={20} />
        <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search posts" autoFocus />
      </div>

      <div className="filters">
        <button type="button" className="pill press"
          onClick={() => setFilter("all")}
          style={{ background: "var(--paper)", boxShadow: filter === "all" ? "var(--hard)" : "var(--hard-sm)" }}>
          All
        </button>
        {CATEGORY_LIST.map((key) => (
          <button key={key} type="button" className="pill press"
            onClick={() => setFilter(key)}
            style={{ background: CATEGORY_META[key].color, boxShadow: filter === key ? "var(--hard)" : "var(--hard-sm)" }}>
            {CATEGORY_META[key].label}
          </button>
        ))}
      </div>

      {browsing
        ? <EmptyState title="Search the board" body="Type a keyword or tap a category to filter posts." />
        : loading && results.length === 0
          ? <EmptyState title="Searching…" body="Looking through the board." />
          : results.length === 0
            ? <EmptyState title="No matches" body="Nothing here for that search. Try different words." />
            : <>
                <div className="results">
                  {results.map((p) => (
                    <div key={p.id} className="mini grain"
                      style={{ "--c": CATEGORY_META[p.category].color } as React.CSSProperties}>
                      <div className="row">
                        <span className="sticker">{CATEGORY_META[p.category].label}</span>
                        <span className="mfoot">{p.anon_tag}</span>
                      </div>
                      <div className="mpanel">
                        <p className="mbody">{p.body}</p>
                        <div className="mfoot">{totalReactions(p)} reactions</div>
                      </div>
                    </div>
                  ))}
                </div>
                {cursor && (
                  <button type="button" className="loadmore press" onClick={loadMore}>Load more</button>
                )}
              </>
      }
    </div>
  );
}

function EmptyState({ title, body }: { title: string; body: string }) {
  return (
    <div className="empty">
      <div className="box grain"><SearchIcon size={30} /></div>
      <h3>{title}</h3>
      <p>{body}</p>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  You screen                                                          */
/* ------------------------------------------------------------------ */
function YouScreen({
  supabaseConfigured,
  postCount,
  reactionsGiven,
}: {
  supabaseConfigured: boolean;
  postCount: number;
  reactionsGiven: number;
}) {
  const [email,        setEmail]        = useState<string | null>(null);
  const [member,       setMember]       = useState<boolean | null>(null); // null = loading
  const [invitesLeft,  setInvitesLeft]  = useState(0);
  const [tag]                           = useState(() => anonTag());

  const fetchProfile = useCallback(async () => {
    if (!supabaseConfigured) { setMember(true); return; }
    const sb = createClient();
    const { data: { user } } = await sb.auth.getUser();
    if (!user) { setMember(false); setEmail(null); return; }
    setEmail(user.email ?? null);

    // Check membership + invite credits via admin-readable members table.
    const res = await fetch("/api/invite/status");
    if (res.ok) {
      const d = await res.json() as { member: boolean; invitesLeft: number };
      setMember(d.member);
      setInvitesLeft(d.invitesLeft);
    } else {
      setMember(false);
    }
  }, [supabaseConfigured]);

  useEffect(() => { void fetchProfile(); }, [fetchProfile]);

  function signIn() {
    const sb = createClient();
    void sb.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${window.location.origin}/auth/callback` },
    });
  }
  async function signOut() {
    const sb = createClient();
    await sb.auth.signOut();
    setEmail(null);
    setMember(false);
  }

  return (
    <div className="screen">
      <h1 className="screen-h1">You</h1>
      <p className="screen-sub">Anonymous, but accountable</p>

      {/* Not signed in */}
      {!email && (
        <div className="identity grain">
          <div className="winbar"><RetroDots symbols /><span className="sticker">Profile</span></div>
          <div className="ipanel">
            <div className="avatar"><UserIcon size={32} /></div>
            <h2>Sign in first</h2>
            <p>Use your Google account to sign in, then enter your invite code to join the board.</p>
            {!supabaseConfigured
              ? <p style={{ opacity: 0.55, marginBottom: 0 }}>Demo mode. Connect Supabase to enable accounts.</p>
              : <button type="button" className="gbtn press" onClick={signIn}><GoogleMark />Continue with Google</button>
            }
          </div>
        </div>
      )}

      {/* Signed in, not yet a member → show invite gate */}
      {email && member === false && (
        <InviteGate onVerified={() => { setMember(true); setInvitesLeft(0); }} />
      )}

      {/* Signed in + member → full profile */}
      {email && member === true && (
        <>
          <div className="identity grain">
            <div className="winbar"><RetroDots symbols /><span className="sticker">Profile</span></div>
            <div className="ipanel">
              <div className="avatar"><UserIcon size={32} /></div>
              <h2>{tag}</h2>
              <p>
                Your posts carry a stable anonymous tag — same every time on this board,
                so mods can act on bad actors without ever exposing your name.
              </p>
              <button type="button" className="signout press" onClick={signOut}>
                {email} · Sign out
              </button>
            </div>
          </div>

          {invitesLeft > 0 && <InviteShare creditsLeft={invitesLeft} />}

          <div className="stats" style={{ marginTop: 16 }}>
            <div className="stat grain" style={{ background: "var(--pink)" }}>
              <div className="num">{postCount}</div>
              <div className="lbl">Posts on board</div>
            </div>
            <div className="stat grain" style={{ background: "var(--purple)" }}>
              <div className="num">{reactionsGiven}</div>
              <div className="lbl">Reactions given</div>
            </div>
          </div>
        </>
      )}

      {/* Loading state */}
      {email && member === null && (
        <p style={{ opacity: 0.55, fontFamily: "var(--disp)", padding: "20px 0" }}>Loading…</p>
      )}
    </div>
  );
}

function GoogleMark() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
      <path fill="#4285F4" d="M22.5 12.2c0-.7-.06-1.4-.18-2.06H12v3.9h5.9a5.05 5.05 0 0 1-2.19 3.31v2.75h3.54c2.07-1.9 3.25-4.7 3.25-7.9Z"/>
      <path fill="#34A853" d="M12 23c2.95 0 5.43-.98 7.24-2.64l-3.54-2.75c-.98.66-2.24 1.05-3.7 1.05-2.85 0-5.26-1.92-6.12-4.5H2.22v2.84A11 11 0 0 0 12 23Z"/>
      <path fill="#FBBC05" d="M5.88 14.16a6.6 6.6 0 0 1 0-4.32V7H2.22a11 11 0 0 0 0 9.84l3.66-2.68Z"/>
      <path fill="#EA4335" d="M12 5.18c1.6 0 3.05.55 4.19 1.64l3.14-3.14C17.43 1.9 14.95.9 12 .9A11 11 0 0 0 2.22 7l3.66 2.84C6.74 7.1 9.15 5.18 12 5.18Z"/>
    </svg>
  );
}
"// v1.0"  
