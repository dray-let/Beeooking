-- Beeooking Layer 2 schema extension.
-- Extends Layer 1 with optional player-development records.

create table development_settings (
  id uuid primary key,
  club_id uuid not null references clubs(id),
  enabled boolean not null default false,
  default_note_visibility text not null default 'private_coach',
  parent_access_enabled boolean not null default true,
  player_access_enabled boolean not null default true,
  assessment_scale_config jsonb not null default '{}'::jsonb,
  report_card_publish_roles text[] not null default '{club_admin,coach}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (club_id)
);

create table player_development_profiles (
  id uuid primary key,
  club_id uuid not null references clubs(id),
  player_user_id uuid not null references users(id),
  primary_coach_id uuid references coaches(id),
  development_stage text,
  sport_focus text[] not null default '{}',
  visibility_status text not null default 'active',
  profile_notes jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (club_id, player_user_id)
);

create table development_notes (
  id uuid primary key,
  club_id uuid not null references clubs(id),
  player_user_id uuid not null references users(id),
  coach_id uuid references coaches(id),
  note_type text not null,
  title text,
  body text not null,
  visibility text not null default 'private_coach',
  related_type text,
  related_id uuid,
  created_by_user_id uuid not null references users(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table development_goals (
  id uuid primary key,
  club_id uuid not null references clubs(id),
  player_user_id uuid not null references users(id),
  created_by_user_id uuid not null references users(id),
  title text not null,
  description text,
  category text,
  status text not null default 'active',
  target_date date,
  visibility text not null default 'parent_player',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table development_goal_updates (
  id uuid primary key,
  club_id uuid not null references clubs(id),
  goal_id uuid not null references development_goals(id),
  created_by_user_id uuid not null references users(id),
  status text,
  body text not null,
  created_at timestamptz not null default now()
);

create table skill_templates (
  id uuid primary key,
  club_id uuid not null references clubs(id),
  name text not null,
  sport_type text not null,
  version text not null,
  status text not null default 'draft',
  scale_config jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (club_id, name, version)
);

create table skill_categories (
  id uuid primary key,
  club_id uuid not null references clubs(id),
  skill_template_id uuid not null references skill_templates(id),
  name text not null,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

create table skill_criteria (
  id uuid primary key,
  club_id uuid not null references clubs(id),
  skill_category_id uuid not null references skill_categories(id),
  name text not null,
  description text,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

create table skill_assessments (
  id uuid primary key,
  club_id uuid not null references clubs(id),
  player_user_id uuid not null references users(id),
  coach_id uuid references coaches(id),
  skill_template_id uuid not null references skill_templates(id),
  template_snapshot jsonb not null default '{}'::jsonb,
  summary text,
  visibility text not null default 'parent_player',
  assessed_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);

create table skill_assessment_scores (
  id uuid primary key,
  club_id uuid not null references clubs(id),
  skill_assessment_id uuid not null references skill_assessments(id),
  skill_criterion_id uuid references skill_criteria(id),
  score numeric(6, 2),
  comment text,
  created_at timestamptz not null default now()
);

create table report_card_templates (
  id uuid primary key,
  club_id uuid not null references clubs(id),
  name text not null,
  sport_type text not null,
  version text not null,
  status text not null default 'draft',
  template_config jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (club_id, name, version)
);

create table report_cards (
  id uuid primary key,
  club_id uuid not null references clubs(id),
  player_user_id uuid not null references users(id),
  coach_id uuid references coaches(id),
  report_card_template_id uuid references report_card_templates(id),
  status text not null default 'draft',
  period_start date,
  period_end date,
  summary text,
  snapshot jsonb not null default '{}'::jsonb,
  published_at timestamptz,
  created_by_user_id uuid not null references users(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table report_card_items (
  id uuid primary key,
  club_id uuid not null references clubs(id),
  report_card_id uuid not null references report_cards(id),
  item_type text not null,
  title text,
  body text,
  source_type text,
  source_id uuid,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

create index player_development_profiles_club_player_idx on player_development_profiles(club_id, player_user_id);
create index development_notes_club_player_idx on development_notes(club_id, player_user_id);
create index development_notes_related_idx on development_notes(club_id, related_type, related_id);
create index development_goals_club_player_status_idx on development_goals(club_id, player_user_id, status);
create index development_goal_updates_goal_idx on development_goal_updates(club_id, goal_id);
create index skill_templates_club_sport_idx on skill_templates(club_id, sport_type, status);
create index skill_assessments_club_player_idx on skill_assessments(club_id, player_user_id, assessed_at);
create index skill_assessment_scores_assessment_idx on skill_assessment_scores(club_id, skill_assessment_id);
create index report_cards_club_player_status_idx on report_cards(club_id, player_user_id, status);
create index report_card_items_card_idx on report_card_items(club_id, report_card_id);
