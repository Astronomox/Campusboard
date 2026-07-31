-- CampusBoard schema
-- Run with: supabase db push   (or paste into the SQL editor)

create extension if not exists pgcrypto;

-- ---------------- Tables ----------------
create table if not exists posts (
  id          uuid primary key default gen_random_uuid(),
  campus_slug text not null,
  user_id     uuid not null references auth.users (id) on delete cascade,
  body        text not null check (char_length(body) between 1 and 280),
  anon_tag    text not null,
  category    text not null check (category in ('rant', 'shoutout', 'callout', 'info')),
  status      text not null default 'pending'
                check (status in ('pending', 'published', 'flagged', 'rejected')),
  created_at  timestamptz not null default now()
);

create table if not exists reactions (
  id         uuid primary key default gen_random_uuid(),
  post_id    uuid not null references posts (id) on delete cascade,
  user_id    uuid not null references auth.users (id) on delete cascade,
  emoji      text not null check (emoji in ('fire', 'skull', 'laugh', 'hundred')),
  created_at timestamptz not null default now(),
  unique (post_id, user_id)
);

create index if not exists posts_feed_idx
  on posts (campus_slug, status, created_at desc);
create index if not exists reactions_post_idx on reactions (post_id);
create index if not exists posts_status_idx on posts (status, created_at desc);

-- ---------------- Reactions view ----------------
create or replace view posts_with_reactions
with (security_invoker = on) as
select
  p.id,
  p.campus_slug,
  p.body,
  p.anon_tag,
  p.category,
  p.status,
  p.created_at,
  jsonb_build_object(
    'fire', coalesce(sum((r.emoji = 'fire')::int), 0),
    'skull', coalesce(sum((r.emoji = 'skull')::int), 0),
    'laugh', coalesce(sum((r.emoji = 'laugh')::int), 0),
    'hundred', coalesce(sum((r.emoji = 'hundred')::int), 0)
  ) as reactions
from posts p
left join reactions r on r.post_id = p.id
group by p.id;

-- ---------------- Row level security ----------------
alter table posts enable row level security;
alter table reactions enable row level security;

-- Anyone may read published posts.
create policy "read published posts"
  on posts for select
  using (status = 'published');

-- A signed-in user may create a post as themselves.
create policy "insert own posts"
  on posts for insert to authenticated
  with check (user_id = auth.uid() and status = 'pending');
-- Moderation (service role, bypasses RLS) is the only path that sets a post
-- to published/flagged/rejected, so nothing skips the moderation gate.

-- Reactions are publicly readable (for counts) and self-managed.
create policy "read reactions"
  on reactions for select
  using (true);

create policy "insert own reactions"
  on reactions for insert to authenticated
  with check (user_id = auth.uid());

create policy "update own reactions"
  on reactions for update to authenticated
  using (user_id = auth.uid());

create policy "delete own reactions"
  on reactions for delete to authenticated
  using (user_id = auth.uid());

-- ---------------- Grants ----------------
grant select on posts to anon, authenticated;
grant insert on posts to authenticated;
grant select, insert, update, delete on reactions to authenticated;
grant select on reactions to anon;
grant select on posts_with_reactions to anon, authenticated;

-- ---------------- Bans ----------------
-- Groundwork for moderation: stable per-user pseudonyms make bans enforceable.
-- Only the service role (which bypasses RLS) writes here, from admin tooling.
create table if not exists bans (
  user_id     uuid not null references auth.users (id) on delete cascade,
  campus_slug text not null,
  until       timestamptz,           -- null means permanent
  reason      text,
  created_at  timestamptz not null default now(),
  primary key (user_id, campus_slug)
);

alter table bans enable row level security;

-- A signed-in user may read only their own ban status.
create policy "read own ban"
  on bans for select to authenticated
  using (user_id = auth.uid());

grant select on bans to authenticated;

-- ---------------- Reports ----------------
create table if not exists reports (
  id         uuid primary key default gen_random_uuid(),
  post_id    uuid not null references posts (id) on delete cascade,
  reporter   uuid not null references auth.users (id) on delete cascade,
  reason     text not null check (char_length(reason) between 1 and 60),
  status     text not null default 'open' check (status in ('open', 'resolved')),
  created_at timestamptz not null default now(),
  unique (post_id, reporter)
);

alter table reports enable row level security;

-- A signed-in user may file a report as themselves. They cannot read the
-- reports table; only the service role (admin tooling) reads it.
create policy "insert own report"
  on reports for insert to authenticated
  with check (reporter = auth.uid());

grant insert on reports to authenticated;

create index if not exists reports_open_idx on reports (status, created_at desc);

-- ---------------- Invite-only access ----------------
-- Every new user must redeem a valid invite code before they can post.
-- Codes are single-use. Admins generate the seed batch; verified members
-- earn one invite per N posts (configurable, enforced in the API).

create table if not exists invites (
  code        text primary key,                            -- 8-char uppercase token
  created_by  uuid references auth.users (id),             -- null = admin-generated
  redeemed_by uuid references auth.users (id),
  redeemed_at timestamptz,
  created_at  timestamptz not null default now()
);

alter table invites enable row level security;

-- Anyone signed in may try to redeem a code (checked in the API, not here).
-- Only service role writes/reads the table otherwise.
create policy "redeem own invite"
  on invites for update to authenticated
  using     (redeemed_by is null)
  with check(redeemed_by = auth.uid());

grant update (redeemed_by, redeemed_at) on invites to authenticated;

-- Track whether a user has completed invite verification.
-- Stored in a separate table so it survives auth.users metadata quirks.
create table if not exists members (
  user_id       uuid primary key references auth.users (id) on delete cascade,
  campus_slug   text not null default 'unilag',
  invite_code   text references invites (code),
  post_count    int  not null default 0,
  invites_left  int  not null default 0,   -- earned invite credits
  joined_at     timestamptz not null default now()
);

alter table members enable row level security;

create policy "read own membership"
  on members for select to authenticated
  using (user_id = auth.uid());

grant select on members to authenticated;

-- Auto-increment post_count when a post is published (service role trigger).
create or replace function increment_post_count()
returns trigger language plpgsql security definer as $$
begin
  if NEW.status = 'published' and (OLD.status is null or OLD.status <> 'published') then
    update members set post_count = post_count + 1 where user_id = NEW.user_id;
  end if;
  return NEW;
end;
$$;

drop trigger if exists trg_post_count on posts;
create trigger trg_post_count
  after insert or update of status on posts
  for each row execute function increment_post_count();

create index if not exists invites_code_idx    on invites (code);
create index if not exists invites_created_idx on invites (created_by);

-- Custom anon tag override (admin privilege)
alter table members add column if not exists custom_tag text unique;

-- Wordlist for deterministic pre-filter (editable from /mod/content/wordlist)
create table if not exists wordlist (
  id      uuid primary key default gen_random_uuid(),
  pattern text not null unique,
  added_by uuid references auth.users(id),
  created_at timestamptz not null default now()
);
alter table wordlist enable row level security;
grant select on wordlist to authenticated;

-- Announcements pinned to top of feed
create table if not exists announcements (
  id         uuid primary key default gen_random_uuid(),
  body       text not null check(char_length(body) between 1 and 500),
  created_by uuid references auth.users(id),
  active     boolean not null default true,
  created_at timestamptz not null default now()
);
alter table announcements enable row level security;
create policy "read active announcements"
  on announcements for select to authenticated
  using (active = true);
grant select on announcements to authenticated;

-- Bookmarks (saved posts)
create table if not exists bookmarks (
  user_id  uuid not null references auth.users(id) on delete cascade,
  post_id  uuid not null references posts(id) on delete cascade,
  saved_at timestamptz not null default now(),
  primary key (user_id, post_id)
);
alter table bookmarks enable row level security;
create policy "manage own bookmarks"
  on bookmarks for all to authenticated
  using (user_id = auth.uid())
  with check (user_id = auth.uid());
grant all on bookmarks to authenticated;

-- Notification records
create table if not exists notifications (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid not null references auth.users(id) on delete cascade,
  kind       text not null check(kind in ('reaction','reply','system','ban')),
  payload    jsonb not null default '{}',
  read       boolean not null default false,
  created_at timestamptz not null default now()
);
alter table notifications enable row level security;
create policy "read own notifications"
  on notifications for all to authenticated
  using (user_id = auth.uid());
grant all on notifications to authenticated;
create index if not exists notif_user_idx on notifications(user_id, created_at desc);
"// v1.0"  
