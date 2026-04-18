create extension if not exists "pgcrypto";

create table if not exists public.blocks (
  id uuid primary key default gen_random_uuid(),
  page text not null check (page in ('home', 'writing', 'talks', 'now', 'connect')),
  section text not null,
  type text not null check (type in ('card', 'richtext', 'linklist', 'embed', 'form', 'timeline')),
  "order" integer not null default 0,
  is_public boolean not null default false,
  data jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.form_submissions (
  id uuid primary key default gen_random_uuid(),
  form_type text not null,
  data jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default timezone('utc', now())
);

create index if not exists blocks_page_order_idx on public.blocks (page, "order");
create index if not exists blocks_public_idx on public.blocks (page, is_public);

alter table public.blocks enable row level security;
alter table public.form_submissions enable row level security;

drop policy if exists "Public can read public blocks" on public.blocks;
create policy "Public can read public blocks"
on public.blocks
for select
using (is_public = true);

drop policy if exists "Authenticated users manage blocks" on public.blocks;
create policy "Authenticated users manage blocks"
on public.blocks
for all
using (auth.role() = 'authenticated')
with check (auth.role() = 'authenticated');

drop policy if exists "Authenticated users read submissions" on public.form_submissions;
create policy "Authenticated users read submissions"
on public.form_submissions
for select
using (auth.role() = 'authenticated');

drop policy if exists "Public can create submissions" on public.form_submissions;
create policy "Public can create submissions"
on public.form_submissions
for insert
with check (true);

drop policy if exists "Authenticated users manage submissions" on public.form_submissions;
create policy "Authenticated users manage submissions"
on public.form_submissions
for all
using (auth.role() = 'authenticated')
with check (auth.role() = 'authenticated');

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = timezone('utc', now());
  return new;
end;
$$;

drop trigger if exists blocks_set_updated_at on public.blocks;
create trigger blocks_set_updated_at
before update on public.blocks
for each row
execute function public.set_updated_at();

insert into public.blocks (page, section, type, "order", is_public, data)
values
  (
    'home',
    'bio',
    'richtext',
    1,
    true,
    jsonb_build_object(
      'title', 'Vainateya Rangaraju',
      'content', '<p>I study how machine learning systems can become more interpretable, reliable, and useful in real-world research settings.</p><p>My work sits between research practice, engineering, and thoughtful product building.</p>'
    )
  ),
  (
    'home',
    'research',
    'card',
    2,
    true,
    jsonb_build_object(
      'title', 'Interpretable Systems for Scientific Workflows',
      'institution', 'Independent + University Research',
      'description', 'Built research prototypes that make model behavior legible to practitioners working under uncertainty.',
      'year', '2025',
      'thumbnail_url', 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=900&q=80',
      'links', jsonb_build_array(
        jsonb_build_object('label', 'Paper', 'url', 'https://example.com/paper'),
        jsonb_build_object('label', 'GitHub', 'url', 'https://github.com/')
      ),
      'tags', jsonb_build_array('NeurIPS', 'Interpretability')
    )
  ),
  (
    'home',
    'industry',
    'card',
    3,
    true,
    jsonb_build_object(
      'title', 'ML Platform Prototyping',
      'institution', 'Industry Research Lab',
      'description', 'Designed internal workflows that connected modeling experiments with practical decision-making.',
      'year', '2024',
      'thumbnail_url', 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=900&q=80',
      'links', jsonb_build_array(
        jsonb_build_object('label', 'GitHub', 'url', 'https://github.com/')
      ),
      'tags', jsonb_build_array('Platform', 'Applied ML')
    )
  ),
  (
    'home',
    'building',
    'card',
    4,
    true,
    jsonb_build_object(
      'title', 'Researcher Systems Notebook',
      'institution', 'Personal Project',
      'description', 'A modular note-taking and experiment-tracking environment for long-horizon research projects.',
      'year', '2026',
      'thumbnail_url', 'https://images.unsplash.com/photo-1516321497487-e288fb19713f?auto=format&fit=crop&w=900&q=80',
      'links', jsonb_build_array(
        jsonb_build_object('label', 'Demo', 'url', 'https://example.com/demo'),
        jsonb_build_object('label', 'GitHub', 'url', 'https://github.com/')
      ),
      'tags', jsonb_build_array('Tooling', 'Research Ops')
    )
  ),
  (
    'writing',
    'essays',
    'richtext',
    1,
    true,
    jsonb_build_object(
      'title', 'Why Research Portfolios Need Working Notes',
      'slug', 'why-research-portfolios-need-working-notes',
      'date', '2026-04-01',
      'excerpt', 'A case for publishing the open questions, half-formed ideas, and process artifacts behind serious work.',
      'content', '<p>Finished projects tell only part of the story. Research often advances through working notes, contradictions, and partially resolved ideas.</p><p>A portfolio can make that process visible without becoming noisy, if it is structured around clarity instead of quantity.</p>'
    )
  ),
  (
    'writing',
    'notes',
    'richtext',
    2,
    true,
    jsonb_build_object(
      'title', 'Open Question',
      'date', '2026-04-10',
      'content', '<p>What would a genuinely useful AI research assistant optimize for beyond retrieval and summarization?</p>'
    )
  ),
  (
    'talks',
    'talks',
    'card',
    1,
    true,
    jsonb_build_object(
      'title', 'Designing Research Interfaces That Think With You',
      'institution', 'Systems & Learning Symposium',
      'description', 'A talk on building tools that help researchers sustain attention across long projects.',
      'year', '2025',
      'thumbnail_url', 'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=900&q=80',
      'links', jsonb_build_array(
        jsonb_build_object('label', 'Slides', 'url', 'https://example.com/slides'),
        jsonb_build_object('label', 'Recording', 'url', 'https://example.com/video')
      ),
      'tags', jsonb_build_array('Talk', 'Systems')
    )
  ),
  (
    'now',
    'working',
    'richtext',
    1,
    true,
    jsonb_build_object(
      'title', 'What I''m Working On',
      'content', '<p>This month I''m thinking about researcher-facing interfaces, evaluation loops for AI tools, and how to publish work in a way that invites collaboration.</p>'
    )
  ),
  (
    'now',
    'reading',
    'richtext',
    2,
    true,
    jsonb_build_object(
      'title', 'What I''m Reading',
      'content', '<p>I''m reading across human-computer interaction, lab notebooks, and reflective practice in scientific work.</p>'
    )
  ),
  (
    'now',
    'book-recommendations',
    'form',
    3,
    true,
    jsonb_build_object(
      'form_type', 'bookrec',
      'fields', jsonb_build_array(
        jsonb_build_object('name', 'name', 'type', 'text', 'placeholder', 'Your name', 'required', false),
        jsonb_build_object('name', 'book_title', 'type', 'text', 'placeholder', 'Book title', 'required', true),
        jsonb_build_object('name', 'reason', 'type', 'textarea', 'placeholder', 'Why should I read it?', 'required', true)
      )
    )
  ),
  (
    'connect',
    'links',
    'linklist',
    1,
    true,
    jsonb_build_object(
      'items', jsonb_build_array(
        jsonb_build_object('icon', 'github', 'label', 'GitHub', 'url', 'https://github.com/'),
        jsonb_build_object('icon', 'linkedin', 'label', 'LinkedIn', 'url', 'https://linkedin.com/'),
        jsonb_build_object('icon', 'mail', 'label', 'Email', 'url', 'mailto:hello@vainateyar.com')
      )
    )
  ),
  (
    'connect',
    'contact',
    'form',
    2,
    true,
    jsonb_build_object(
      'form_type', 'contact',
      'fields', jsonb_build_array(
        jsonb_build_object('name', 'name', 'type', 'text', 'placeholder', 'Your name', 'required', true),
        jsonb_build_object('name', 'email', 'type', 'email', 'placeholder', 'Your email', 'required', true),
        jsonb_build_object('name', 'message', 'type', 'textarea', 'placeholder', 'What would you like to talk about?', 'required', true)
      )
    )
  ),
  (
    'connect',
    'feedback',
    'form',
    3,
    true,
    jsonb_build_object(
      'form_type', 'feedback',
      'fields', jsonb_build_array(
        jsonb_build_object('name', 'feedback', 'type', 'textarea', 'placeholder', 'Anonymous feedback', 'required', true)
      )
    )
  )
on conflict do nothing;
