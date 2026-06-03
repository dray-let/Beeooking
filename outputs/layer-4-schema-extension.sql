-- Beeooking Layer 4 schema extension.
-- Extends Layers 1-3 with AI insights, recommendations, actions, feedback, and outcomes.

create table ai_settings (
  id uuid primary key,
  club_id uuid not null references clubs(id),
  enabled boolean not null default false,
  enabled_categories text[] not null default '{}',
  parent_player_visibility jsonb not null default '{}'::jsonb,
  human_approval_required boolean not null default true,
  data_source_config jsonb not null default '{}'::jsonb,
  feedback_enabled boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (club_id)
);

create table ai_data_sources (
  id uuid primary key,
  club_id uuid not null references clubs(id),
  source_type text not null,
  source_name text not null,
  status text not null default 'active',
  last_synced_at timestamptz,
  freshness_status text,
  config jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (club_id, source_type, source_name)
);

create table ai_prompt_versions (
  id uuid primary key,
  name text not null,
  version text not null,
  workflow_type text not null,
  prompt_summary text not null,
  status text not null default 'active',
  created_at timestamptz not null default now(),
  unique (name, version)
);

create table ai_generation_runs (
  id uuid primary key,
  club_id uuid not null references clubs(id),
  run_type text not null,
  status text not null default 'queued',
  trigger_type text not null,
  started_at timestamptz,
  completed_at timestamptz,
  model_metadata jsonb not null default '{}'::jsonb,
  input_summary jsonb not null default '{}'::jsonb,
  output_summary jsonb not null default '{}'::jsonb,
  error_summary text,
  created_at timestamptz not null default now()
);

create table ai_insights (
  id uuid primary key,
  club_id uuid not null references clubs(id),
  ai_generation_run_id uuid references ai_generation_runs(id),
  insight_type text not null,
  subject_type text not null,
  subject_id uuid,
  audience_type text not null,
  title text not null,
  summary text not null,
  evidence_summary text,
  source_data jsonb not null default '{}'::jsonb,
  confidence numeric(5, 4),
  status text not null default 'generated',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table ai_recommendations (
  id uuid primary key,
  club_id uuid not null references clubs(id),
  ai_generation_run_id uuid references ai_generation_runs(id),
  ai_insight_id uuid references ai_insights(id),
  recommendation_type text not null,
  category text not null,
  audience_type text not null,
  subject_type text not null,
  subject_id uuid,
  target_user_id uuid references users(id),
  title text not null,
  recommendation text not null,
  explanation text not null,
  confidence numeric(5, 4),
  source_data jsonb not null default '{}'::jsonb,
  model_metadata jsonb not null default '{}'::jsonb,
  status text not null default 'draft',
  expires_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table recommendation_actions (
  id uuid primary key,
  club_id uuid not null references clubs(id),
  ai_recommendation_id uuid not null references ai_recommendations(id),
  actor_user_id uuid references users(id),
  action_type text not null,
  action_metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table recommendation_feedback (
  id uuid primary key,
  club_id uuid not null references clubs(id),
  ai_recommendation_id uuid not null references ai_recommendations(id),
  user_id uuid not null references users(id),
  rating integer,
  feedback_text text,
  created_at timestamptz not null default now()
);

create table recommendation_outcomes (
  id uuid primary key,
  club_id uuid not null references clubs(id),
  ai_recommendation_id uuid not null references ai_recommendations(id),
  outcome_type text not null,
  outcome_value jsonb not null default '{}'::jsonb,
  related_type text,
  related_id uuid,
  measured_at timestamptz not null default now()
);

create table external_player_signals (
  id uuid primary key,
  club_id uuid not null references clubs(id),
  player_user_id uuid not null references users(id),
  ai_data_source_id uuid not null references ai_data_sources(id),
  signal_type text not null,
  signal_data jsonb not null default '{}'::jsonb,
  observed_at timestamptz,
  ingested_at timestamptz not null default now()
);

create index ai_data_sources_club_status_idx on ai_data_sources(club_id, status);
create index ai_generation_runs_club_type_idx on ai_generation_runs(club_id, run_type, status);
create index ai_insights_club_subject_idx on ai_insights(club_id, subject_type, subject_id);
create index ai_insights_run_idx on ai_insights(club_id, ai_generation_run_id);
create index ai_recommendations_club_category_idx on ai_recommendations(club_id, category, status);
create index ai_recommendations_subject_idx on ai_recommendations(club_id, subject_type, subject_id);
create index ai_recommendations_target_user_idx on ai_recommendations(club_id, target_user_id, status);
create index recommendation_actions_recommendation_idx on recommendation_actions(club_id, ai_recommendation_id);
create index recommendation_feedback_recommendation_idx on recommendation_feedback(club_id, ai_recommendation_id);
create index recommendation_outcomes_recommendation_idx on recommendation_outcomes(club_id, ai_recommendation_id);
create index external_player_signals_player_idx on external_player_signals(club_id, player_user_id, signal_type);

