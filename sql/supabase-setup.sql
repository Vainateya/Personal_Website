-- ============================================================
-- Personal Website — Full Schema v2
-- Run this in Supabase SQL Editor to migrate from v1 schema.
-- ============================================================

-- Drop old schema (cascade removes dependent objects)
drop table if exists public.form_submissions cascade;
drop table if exists public.blocks cascade;
drop table if exists public.pages cascade;

-- Utility function
create extension if not exists "pgcrypto";

create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = timezone('utc', now());
  return new;
end;
$$;

-- ============================================================
-- PAGES
-- ============================================================
create table public.pages (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  slug        text unique not null,
  nav_order   integer not null default 0,
  created_at  timestamptz not null default timezone('utc', now()),
  updated_at  timestamptz not null default timezone('utc', now())
);

create index pages_nav_order_idx on public.pages (nav_order);

create trigger pages_set_updated_at
before update on public.pages
for each row execute function public.set_updated_at();

alter table public.pages enable row level security;

create policy "pages_public_read"   on public.pages for select using (true);
create policy "pages_auth_insert"   on public.pages for insert with check (auth.role() = 'authenticated');
create policy "pages_auth_update"   on public.pages for update using (auth.role() = 'authenticated');
create policy "pages_auth_delete"   on public.pages for delete using (auth.role() = 'authenticated');

-- ============================================================
-- BLOCKS
-- ============================================================
create table public.blocks (
  id          uuid primary key default gen_random_uuid(),
  page_id     uuid not null references public.pages(id) on delete cascade,
  type        text not null check (type in ('card_list','richtext','linklist','media','embed','form','timeline')),
  x           integer not null default 0 check (x >= 0 and x <= 11),
  y           integer not null default 0 check (y >= 0),
  w           integer not null default 6 check (w >= 1 and w <= 12),
  h           integer not null default 4 check (h >= 1),
  data        jsonb not null default '{}'::jsonb,
  created_at  timestamptz not null default timezone('utc', now()),
  updated_at  timestamptz not null default timezone('utc', now())
);

create index blocks_page_id_idx on public.blocks (page_id, y, x);

create trigger blocks_set_updated_at
before update on public.blocks
for each row execute function public.set_updated_at();

alter table public.blocks enable row level security;

create policy "blocks_public_read"  on public.blocks for select using (true);
create policy "blocks_auth_insert"  on public.blocks for insert with check (auth.role() = 'authenticated');
create policy "blocks_auth_update"  on public.blocks for update using (auth.role() = 'authenticated');
create policy "blocks_auth_delete"  on public.blocks for delete using (auth.role() = 'authenticated');

-- ============================================================
-- FORM SUBMISSIONS
-- ============================================================
create table public.form_submissions (
  id          uuid primary key default gen_random_uuid(),
  block_id    uuid not null references public.blocks(id) on delete cascade,
  data        jsonb not null default '{}'::jsonb,
  created_at  timestamptz not null default timezone('utc', now())
);

alter table public.form_submissions enable row level security;

create policy "form_submissions_public_insert" on public.form_submissions
  for insert with check (true);
create policy "form_submissions_auth_read" on public.form_submissions
  for select using (auth.role() = 'authenticated');

-- ============================================================
-- SEED DATA
-- ============================================================

insert into public.pages (name, slug, nav_order) values
  ('Work',    'home',    1),
  ('Writing', 'writing', 2),
  ('Talks',   'talks',   3),
  ('Now',     'now',     4),
  ('Connect', 'connect', 5);

-- Home page
with p as (select id from public.pages where slug = 'home')
insert into public.blocks (page_id, type, x, y, w, h, data)
select p.id, 'richtext', 0, 0, 7, 4,
  jsonb_build_object(
    'content', '<p>I study how machine learning systems can become more interpretable, reliable, and useful in real-world research settings. My work sits between research practice, engineering, and thoughtful product building.</p>'
  ) from p
union all
select p.id, 'linklist', 7, 0, 5, 4,
  jsonb_build_object('items', jsonb_build_array(
    jsonb_build_object('icon','github',   'label','GitHub',   'url','https://github.com/'),
    jsonb_build_object('icon','linkedin', 'label','LinkedIn', 'url','https://linkedin.com/'),
    jsonb_build_object('icon','mail',     'label','Email',    'url','mailto:hello@vainateyar.com'),
    jsonb_build_object('icon','file',     'label','CV',       'url','/cv.pdf')
  )) from p
union all
select p.id, 'card_list', 0, 4, 12, 10,
  jsonb_build_object('cards', jsonb_build_array(
    jsonb_build_object('id',gen_random_uuid()::text,'thumbnail_url','https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=900&q=80','title','Interpretable Systems for Scientific Workflows','institution','Independent + University Research','description','Built research prototypes that make model behavior legible to practitioners working under uncertainty.','year','2025','tags',jsonb_build_array('NeurIPS','Interpretability'),'links',jsonb_build_array(jsonb_build_object('label','Paper','url','https://example.com'),jsonb_build_object('label','GitHub','url','https://github.com/'))),
    jsonb_build_object('id',gen_random_uuid()::text,'thumbnail_url','https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=900&q=80','title','ML Platform Prototyping','institution','Industry Research Lab','description','Designed internal workflows that connected modeling experiments with practical decision-making.','year','2024','tags',jsonb_build_array('Applied ML'),'links',jsonb_build_array(jsonb_build_object('label','GitHub','url','https://github.com/'))),
    jsonb_build_object('id',gen_random_uuid()::text,'thumbnail_url','https://images.unsplash.com/photo-1516321497487-e288fb19713f?auto=format&fit=crop&w=900&q=80','title','Researcher Systems Notebook','institution','Personal Project','description','A modular note-taking and experiment-tracking environment for long-horizon research projects.','year','2026','tags',jsonb_build_array('Tooling'),'links',jsonb_build_array(jsonb_build_object('label','Demo','url','https://example.com'),jsonb_build_object('label','GitHub','url','https://github.com/')))
  )) from p;

-- Writing page
with p as (select id from public.pages where slug = 'writing')
insert into public.blocks (page_id, type, x, y, w, h, data)
select p.id, 'card_list', 0, 0, 12, 8,
  jsonb_build_object('cards', jsonb_build_array(
    jsonb_build_object('id',gen_random_uuid()::text,'thumbnail_url','','title','Why Research Portfolios Need Working Notes','institution','','description','A case for publishing the open questions, half-formed ideas, and process artifacts behind serious work.','year','2026','tags',jsonb_build_array('Essay'),'links','[]'::jsonb),
    jsonb_build_object('id',gen_random_uuid()::text,'thumbnail_url','','title','What would a genuinely useful AI research assistant look like?','institution','','description','Beyond retrieval and summarization — what would it actually mean to build a tool that thinks with you?','year','2026','tags',jsonb_build_array('Note'),'links','[]'::jsonb)
  )) from p
union all
select p.id, 'richtext', 0, 8, 12, 4,
  jsonb_build_object('content', '<h2>On Process</h2><p>Research often advances through working notes, contradictions, and partially resolved ideas.</p>') from p;

-- Talks page
with p as (select id from public.pages where slug = 'talks')
insert into public.blocks (page_id, type, x, y, w, h, data)
select p.id, 'card_list', 0, 0, 12, 6,
  jsonb_build_object('cards', jsonb_build_array(
    jsonb_build_object('id',gen_random_uuid()::text,'thumbnail_url','https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=900&q=80','title','Designing Research Interfaces That Think With You','institution','Systems & Learning Symposium','description','A talk on building tools that help researchers sustain attention across long projects.','year','2025','tags',jsonb_build_array('Talk','Systems'),'links',jsonb_build_array(jsonb_build_object('label','Slides','url','https://example.com'),jsonb_build_object('label','Recording','url','https://example.com')))
  )) from p;

-- Now page
with p as (select id from public.pages where slug = 'now')
insert into public.blocks (page_id, type, x, y, w, h, data)
select p.id, 'richtext', 0, 0, 8, 5,
  jsonb_build_object('content', '<h2>What I''m Working On</h2><p>This month I''m thinking about researcher-facing interfaces, evaluation loops for AI tools, and how to publish work in a way that invites collaboration.</p><h2>What I''m Reading</h2><p>I''m reading across human-computer interaction, lab notebooks, and reflective practice in scientific work.</p>') from p
union all
select p.id, 'form', 8, 0, 4, 5,
  jsonb_build_object('form_type','bookrec','fields',jsonb_build_array(
    jsonb_build_object('name','name',       'type','text',     'placeholder','Your name',            'required',false),
    jsonb_build_object('name','book_title', 'type','text',     'placeholder','Book title',            'required',true),
    jsonb_build_object('name','reason',     'type','textarea', 'placeholder','Why should I read it?', 'required',true)
  )) from p;

-- Connect page
with p as (select id from public.pages where slug = 'connect')
insert into public.blocks (page_id, type, x, y, w, h, data)
select p.id, 'linklist', 0, 0, 4, 5,
  jsonb_build_object('items', jsonb_build_array(
    jsonb_build_object('icon','github',   'label','GitHub',   'url','https://github.com/'),
    jsonb_build_object('icon','linkedin', 'label','LinkedIn', 'url','https://linkedin.com/'),
    jsonb_build_object('icon','mail',     'label','Email',    'url','mailto:hello@vainateyar.com'),
    jsonb_build_object('icon','file',     'label','CV',       'url','/cv.pdf')
  )) from p
union all
select p.id, 'form', 4, 0, 8, 5,
  jsonb_build_object('form_type','contact','fields',jsonb_build_array(
    jsonb_build_object('name','name',    'type','text',     'placeholder','Your name',                         'required',true),
    jsonb_build_object('name','email',   'type','email',    'placeholder','Your email',                        'required',true),
    jsonb_build_object('name','message', 'type','textarea', 'placeholder','What would you like to talk about?','required',true)
  )) from p;
