# CampusBoard

Anonymous, AI-moderated discussion board for UNILAG students. Invite-only. One post at a time.

## What it is

CampusBoard is a full-stack web app where UNILAG students post anonymously under stable cryptographic pseudonyms. Every post passes an AI moderation gate before reaching the public feed. Access is invite-only: a verified student gives you a code, you sign in with Google, enter the code, and you're in. The board is a swipeable one-post-at-a-time feed in a retro neo-brutalist UI.

## Architecture

```
Browser
  ↓
Next.js 15 (App Router, Server Components, Middleware)
  ├─ Middleware: session refresh, route protection, maintenance mode
  ├─ API routes: posts, reactions, reports, search, invites, moderation, admin
  ├─ Server pages: feed (SSR), mod dashboard, leaderboard, notifications
  └─ Client components: swipeable feed, compose sheet, invite gate
  ↓
Supabase
  ├─ Postgres: posts, reactions, reports, bans, invites, members,
  │            bookmarks, notifications, wordlist, announcements
  ├─ Auth: Google OAuth with session cookies via @supabase/ssr
  ├─ RLS: row-level security on every table; users can only insert
  │       pending posts (never set published directly)
  └─ Edge Function: Gemini-powered post classifier (Deno)
```

## Tech stack

| Layer | Tool |
|-------|------|
| Framework | Next.js 15.5, React 19, TypeScript (strict) |
| Styling | Tailwind CSS 4 (CSS-first), hand-written globals.css |
| Database | Supabase Postgres with RLS |
| Auth | Supabase Auth (Google OAuth) via @supabase/ssr |
| AI moderation | Google Gemini gemini-3.5-flash-lite (Supabase Edge Function) |
| Validation | Zod on every API route |
| Fonts | Fredoka (display), Poppins (body) via Google Fonts |
| Package manager | pnpm |

## Features

### Identity and access
- Invite-only: every new user needs a valid 8-character code to join
- Stable anonymous tags: HMAC(secret, user_id + campus) produces a deterministic Anon #XXXX that never changes for the same user on the same campus
- Custom admin tags: admin can assign custom tags like ANONxGODx000 via /mod/members
- Google OAuth sign-in with proper callback handling and ?next= redirect
- Route protection via middleware: unauthenticated users are redirected to /auth/login
- Post-OAuth member check: new users who haven't redeemed an invite land on /onboard

### Content and moderation
- Async moderation: posts insert as pending, pre-filter runs first (zero-cost regex), then Gemini classifies after the response is sent via next/server after()
- Fail-safe: anything other than a clean "safe" verdict stays out of the public feed
- Name censoring: real names are automatically masked before storage (Mr Victory becomes Mr V******, Adeola Ibrahim becomes A***** I******)
- Deterministic pre-filter: admin-editable wordlist in the DB, fetched and cached at runtime
- Prompt injection hardening: post body is wrapped in XML tags with explicit instructions to treat it as untrusted content
- Report flow: flag button on every post, reason picker, rate-limited to 10 reports per 5 minutes
- Moderation dashboard at /mod with approve/reject/ban actions

### Feed
- Swipeable one-post-at-a-time feed with touch, wheel, and keyboard (arrows/j/k) navigation
- Live feed refresh: polls the cached feed endpoint every 15 seconds, updates reaction counts in place, surfaces new posts behind a tap-to-reveal pill
- Infinite scroll: loads older posts automatically as you near the end
- Trending sort: sorts by total reaction count
- Four categories: Rant (red), Shoutout (green), Callout (yellow), Info (blue)
- Four reactions: fire, skull, laugh, hundred

### Security
- RLS on every table: users can only read their own bans, bookmarks, notifications
- Posts insert policy enforces status=pending: no client can skip moderation
- Rate limiting: 5 posts per minute, 10 reports per 5 minutes (DB-backed sliding window)
- Ban check on every post attempt
- Membership check on every post attempt (invite must be redeemed)
- Middleware blocks all protected routes for unauthenticated users
- Maintenance mode: set MAINTENANCE=1 to redirect everything to /maintenance

### Pages (84 files, 69 compiled routes)

**Public:** Landing, about, how it works, rules, privacy (NDPR), terms, contact, FAQ, transparency report

**Auth:** Login (two-panel design), Google OAuth redirect, callback with member check, error page

**Onboarding:** Invite code entry, welcome, community rules acceptance, display setup, banned notice

**Board:** Swipeable feed, trending, search with keyword/category/tag, post detail with permalink, share, report, reactions, compose with preview, success/rejected states

**Profile:** Your posts, your reactions, saved posts (bookmarks), your invites with credit tracking and code generation, settings (display/notifications/privacy/account with delete)

**Discovery:** Discover (editor-curated), leaderboard (by posts, by reactions, top givers), trending topics (keyword extraction from last 48h), all tags

**Notifications:** Full notification feed with read/unread, reaction notifications, system notifications, mark-all-read on visit

**Admin (/mod):** Dashboard with live counts, flagged queue, pending queue, open reports with detail view, active bans with lift action, new ban form, member list with detail view and custom tag setter, invite management with bulk generation, announcements with create, stats with CSV export, rejected posts audit log, flagged history, editable wordlist

**Error/System:** 404, route-level error boundary, global error boundary, loading spinners, maintenance page

**Future (placeholders):** Events, polls, confessions, housing, marketplace, clubs, threaded replies

## Database schema

```
posts          — id, campus_slug, user_id, body, anon_tag, category, status, created_at
reactions      — id, post_id, user_id, emoji, created_at (unique per user per post)
reports        — id, post_id, reporter, reason, status, created_at (unique per user per post)
bans           — user_id, campus_slug, until, reason, created_at (PK: user_id + campus_slug)
members        — user_id (PK), campus_slug, invite_code, post_count, invites_left, custom_tag, joined_at
invites        — code (PK), created_by, redeemed_by, redeemed_at, created_at
bookmarks      — user_id, post_id, saved_at (PK: user_id + post_id)
notifications  — id, user_id, kind, payload (jsonb), read, created_at
announcements  — id, body, created_by, active, created_at
wordlist       — id, pattern, added_by, created_at
posts_with_reactions — view that joins posts with aggregated reaction counts
```

RLS is enabled on every table. A trigger auto-increments members.post_count when a post is published.

## Setup

### Prerequisites
- Node.js 18+
- pnpm 8+ (install: `npm install -g pnpm`)
- A Supabase project
- A Google Cloud project with OAuth credentials
- A Gemini API key

### 1. Install

```bash
git clone https://github.com/Astronomox/Campusboard.git
cd Campusboard
pnpm install
```

### 2. Environment

Copy `.env.example` to `.env.local` and fill in:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
ANON_TAG_SECRET=any-long-random-string-set-once
ADMIN_EMAILS=your@email.com
```

### 3. Database

Run `supabase/migrations/001_init.sql` in your Supabase SQL editor. This creates all tables, views, RLS policies, triggers, and indexes.

### 4. Auth

In Supabase dashboard:
1. Authentication > Providers > Google: enable, paste your Google client ID and secret
2. Authentication > URL Configuration > Site URL: `http://localhost:3000`
3. Authentication > URL Configuration > Redirect URLs: add `http://localhost:3000/auth/callback`

### 5. Edge function

```bash
supabase functions deploy moderate-post
supabase secrets set GEMINI_API_KEY=your-gemini-key
```

### 6. Run

```bash
pnpm dev
```

Open `http://localhost:3000`. You'll see the landing page.

### 7. First admin setup

1. Sign in at `/auth/login`
2. In Supabase SQL editor, manually insert yourself as a member:
   ```sql
   INSERT INTO members (user_id, custom_tag)
   SELECT id, 'ANONxGODx000' FROM auth.users WHERE email = 'your@email.com';
   ```
3. Go to `/mod` — you should see the admin dashboard
4. Go to `/mod/invites` and generate your first batch of seed codes
5. Distribute codes to your first UNILAG users

## Deployment

### Vercel (recommended)

1. Import the GitHub repo at vercel.com
2. Set all env vars from `.env.example`
3. Deploy
4. Update Supabase URL Configuration:
   - Site URL: `https://your-app.vercel.app`
   - Redirect URLs: add `https://your-app.vercel.app/auth/callback`

### Cloudflare Workers (scaling path)

The roadmap includes moving to Cloudflare Workers via OpenNext for edge-cached feeds (KV), rate limiting (Durable Objects), and media storage (R2). See the scaling architecture section below.

## Scaling architecture (planned)

```
Client -> Cloudflare Workers (Next.js via OpenNext)
             ├─ Feed reads -> KV cache -> (miss) -> Postgres
             ├─ Writes -> Durable Object (rate limit) -> Postgres
             ├─ Moderation -> Queue -> Gemini -> Postgres
             └─ Media (future) -> R2
```

- KV-cached feeds: one DB query per campus per ~10s, all readers get the cached copy
- Durable Object rate limiter: per-user token bucket, sharded per campus
- Hyperdrive: connection pooling for Postgres from Workers
- R2: zero-egress media storage when image posts are added

## Roadmap

### Shipped
- **M1 — Functional core:** stable pseudonyms, validation, real search, live feed
- **M2 — Trust and safety:** async moderation, reports, rate limiting, mod dashboard
- **M3 — Invite-only access:** invite system, custom tags, full page build (84 pages)

### Next
- **M4 — Engagement:** threaded replies, push notifications, reply mentions
- **M5 — Launch readiness:** analytics, error monitoring (Sentry), load testing, NDPR audit
- **M6 — Pilot:** seed UNILAG, tune moderation on real traffic
- **M7 — Scale:** Cloudflare edge layer, multi-campus expansion
- **M8 — Verticals:** events, polls, confessions, housing, marketplace

## Name censoring

Posts are automatically scanned for real names before storage. The censor runs synchronously with zero external calls:

- Title + name: `Mr Victory` → `Mr V******`, `Prof Adeyemi` → `Prof A******`
- Firstname Lastname: `Adeola Ibrahim` → `A***** I******`
- Nigerian titles: Alhaji, Chief, Engr, Barr, Hon, Pastor, etc.
- False positive protection: common words like University, Lagos, Monday, WhatsApp are not censored

The AI moderation layer catches what the regex misses contextually. The censor is defense in depth, not the only barrier.

## Adding a campus

1. Add an entry to `CAMPUSES` in `src/lib/campuses.ts` with a slug, name, motto, and accent color
2. Add a matching crest branch in `src/components/CampusCrest.tsx`
3. The route, theming, and feed pick it up automatically
4. Post colors come from the category, not the campus

Currently hardcoded to UNILAG only. Multi-campus support is M7.

## License

All rights reserved. This is a proprietary student project.
