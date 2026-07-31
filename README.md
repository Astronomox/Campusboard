# CampusBoard

Anonymous, moderated campus discussion. One post at a time. Pick your school, swipe through posts like stories, react, and drop your own take without a username attached. Every post passes through AI moderation before it hits the public feed.

Built with Next.js 15, TypeScript, Tailwind 4, Supabase, and Gemini for moderation. Fonts (Fredoka, Poppins) load from Google Fonts via a stylesheet link in the root layout.

## What is inside

- Full screen swipeable feed (touch, scroll, keyboard: arrows or j / k)
- Retro neo-brutalist UI: bright category-colored panels, thick ink borders, hard offset shadows, sticker tags, retro window dots, and a press-into-shadow interaction. Per campus chrome color, motto, and custom SVG crest
- Full set of screens: swipeable Feed and Trending, a Search screen with keyword and category filters, and a You screen with anonymous identity plus Google sign in
- Anonymous posting with rotating Anon tags, backed by real accounts so repeat abusers can be banned
- AI moderation gate on every post (safe / borderline / reject) running on Gemini flash-lite in a Supabase edge function
- Reactions with one vote per user per post
- Edge cached public feed so 1000 readers hit the database roughly once every 10 seconds, not 1000 times
- Live feed refresh: the board polls the cached feed, updates reaction counts in place, and surfaces new posts behind a tap-to-reveal pill
- Stable per-user anonymous tags (HMAC of user plus campus) so repeat posters are recognizable and bannable, backed by a `bans` table checked on every post
- Zod validation on every API route, and a database-backed search endpoint with keyword, category filter, and cursor pagination
- Async moderation: a post inserts as pending, a deterministic pre-filter catches obvious junk, then Gemini classifies after the response and flips the status. RLS lets users insert only pending posts, so nothing reaches the public feed unmoderated
- Report button on every post, per-user rate limits on posting and reporting, and a gated `/mod` review queue where admins approve, reject, or ban
- Offline demo mode so the app runs with zero backend

Custom crests are original geometric marks made for this app. They are not copies of any university's official seal.

## Quick start (demo mode, no backend)

```bash
pnpm install
pnpm dev
```

Open http://localhost:3000. With no Supabase keys set, the feed loads from mock data and posting and reactions work locally in the browser. Good for trying the UI.

## Full setup (real backend)

### 1. Create a Supabase project

Grab the project URL and the anon and service role keys from Project Settings, API.

### 2. Create the schema

Either push with the CLI:

```bash
supabase link --project-ref <your-ref>
supabase db push
```

Or open the SQL editor and paste the contents of `supabase/migrations/001_init.sql`.

This creates the `posts` and `reactions` tables, the `posts_with_reactions` view, row level security policies, and grants.

### 3. Turn on Google sign in

In Authentication, Providers, enable Google and add your client ID and secret. Then in URL Configuration add the redirect:

```
http://localhost:3000/auth/callback
https://your-domain.com/auth/callback
```

### 4. Get a Gemini API key

Free from Google AI Studio at https://aistudio.google.com. The moderation function uses `gemini-3.5-flash-lite`.

### 5. Deploy the moderation function

```bash
supabase functions deploy moderate-post
supabase secrets set GEMINI_API_KEY=your-gemini-key
```

The function returns `{ "verdict": "safe" | "borderline" | "reject", "reason": "..." }`. The app publishes safe posts, holds borderline posts as `flagged` for review, and rejects the rest. If the function is ever unreachable, posts are held as flagged rather than published unchecked, so nothing skips moderation.

### 6. Set environment variables

Copy `.env.example` to `.env.local` and fill in:

```
NEXT_PUBLIC_SUPABASE_URL=https://your-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
GEMINI_API_KEY=your-gemini-key
ANON_TAG_SECRET=any-long-random-string
ADMIN_EMAILS=you@example.com
```

`GEMINI_API_KEY` in `.env.local` is only needed for local function testing. In production it lives as a Supabase function secret from step 5.

### 7. Run it

```bash
pnpm dev
```

## Deploy to Vercel

Push to GitHub, import the repo in Vercel, and add the four environment variables in Project Settings. The feed endpoint sets `s-maxage=10, stale-while-revalidate=5`, so Vercel's edge serves cached feed responses and shields the database under load.

## Environment variables

| Variable | Where | Purpose |
| --- | --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | client + server | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | client + server | Public anon key, guarded by RLS |
| `SUPABASE_SERVICE_ROLE_KEY` | server only | Authorizes the call to the moderation function |
| `GEMINI_API_KEY` | edge function secret | Gemini access for classification |
| `ANON_TAG_SECRET` | server only | HMAC key for stable per-user anonymous tags |
| `ADMIN_EMAILS` | server only | Comma-separated emails allowed into the `/mod` dashboard |

Leave the two `NEXT_PUBLIC_` values unset to stay in demo mode.

## How it scales

The read path and write path are split. Reads go through `/api/feed`, an anonymous no cookie query wrapped in an edge cache. One query rebuilds the feed every 10 seconds per campus and every reader gets the cached copy. Writes (posts, reactions) go straight to Supabase and are always low volume next to reads. No Redis, no queue.

## Scripts

```bash
pnpm dev        # local dev
pnpm build      # production build
pnpm start      # serve the build
pnpm lint       # eslint
pnpm typecheck  # tsc, no emit
```

## Project structure

```
src/
  app/
    page.tsx                 campus picker
    [campus]/page.tsx        board (server fetch, then client)
    api/feed/route.ts        cached public feed
    api/posts/route.ts       create post, moderation gate
    api/react/route.ts       toggle reaction
    auth/callback/route.ts   oauth code exchange
  components/                UI, custom SVG icons, campus crests
  lib/                       types, campus registry, supabase clients, config
  middleware.ts              session refresh
supabase/
  migrations/001_init.sql    schema, RLS, view
  functions/moderate-post/   Gemini classifier (Deno)
```

## Adding a campus

Add an entry to `CAMPUSES` in `src/lib/campuses.ts` with a slug, name, motto, and an `accent` color, then add a matching crest branch in `src/components/CampusCrest.tsx`. That is the whole change. The route, theming, and feed pick it up automatically. Post colors come from the category, not the campus.
