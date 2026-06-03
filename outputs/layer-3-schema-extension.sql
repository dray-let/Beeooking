-- Beeooking Layer 3 schema extension.
-- Extends Layer 1 with optional competition records.

create table competition_settings (
  id uuid primary key,
  club_id uuid not null references clubs(id),
  enabled boolean not null default false,
  supported_sports text[] not null default '{}',
  score_formats jsonb not null default '{}'::jsonb,
  challenge_rules jsonb not null default '{}'::jsonb,
  result_approval_rules jsonb not null default '{}'::jsonb,
  parent_registration_enabled boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (club_id)
);

create table competition_events (
  id uuid primary key,
  club_id uuid not null references clubs(id),
  name text not null,
  competition_type text not null,
  sport_type text not null,
  status text not null default 'draft',
  starts_at timestamptz,
  ends_at timestamptz,
  rules_config jsonb not null default '{}'::jsonb,
  registration_config jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table competition_divisions (
  id uuid primary key,
  club_id uuid not null references clubs(id),
  competition_event_id uuid not null references competition_events(id),
  name text not null,
  division_type text,
  capacity integer,
  eligibility_rules jsonb not null default '{}'::jsonb,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

create table competition_teams (
  id uuid primary key,
  club_id uuid not null references clubs(id),
  competition_event_id uuid not null references competition_events(id),
  name text not null,
  captain_user_id uuid references users(id),
  status text not null default 'active',
  created_at timestamptz not null default now()
);

create table competition_team_members (
  id uuid primary key,
  club_id uuid not null references clubs(id),
  competition_team_id uuid not null references competition_teams(id),
  user_id uuid not null references users(id),
  role text,
  status text not null default 'active',
  created_at timestamptz not null default now(),
  unique (club_id, competition_team_id, user_id)
);

create table competition_participants (
  id uuid primary key,
  club_id uuid not null references clubs(id),
  competition_event_id uuid not null references competition_events(id),
  competition_division_id uuid references competition_divisions(id),
  participant_type text not null default 'user',
  user_id uuid references users(id),
  team_id uuid references competition_teams(id),
  registered_by_user_id uuid references users(id),
  status text not null default 'registered',
  seed integer,
  created_at timestamptz not null default now()
);

create table competition_registration_payments (
  id uuid primary key,
  club_id uuid not null references clubs(id),
  competition_participant_id uuid not null references competition_participants(id),
  payment_id uuid not null references payments(id),
  created_at timestamptz not null default now(),
  unique (club_id, competition_participant_id, payment_id)
);

create table matches (
  id uuid primary key,
  club_id uuid not null references clubs(id),
  competition_event_id uuid references competition_events(id),
  competition_division_id uuid references competition_divisions(id),
  match_type text not null,
  sport_type text not null,
  status text not null default 'scheduled',
  scheduled_booking_id uuid references bookings(id),
  court_id uuid references courts(id),
  starts_at timestamptz,
  completed_at timestamptz,
  score_format text,
  score_data jsonb not null default '{}'::jsonb,
  winner_participant_id uuid,
  result_status text not null default 'pending',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table match_participants (
  id uuid primary key,
  club_id uuid not null references clubs(id),
  match_id uuid not null references matches(id),
  participant_type text not null default 'user',
  user_id uuid references users(id),
  team_id uuid references competition_teams(id),
  side text not null,
  result text,
  created_at timestamptz not null default now()
);

create table match_result_submissions (
  id uuid primary key,
  club_id uuid not null references clubs(id),
  match_id uuid not null references matches(id),
  submitted_by_user_id uuid not null references users(id),
  score_data jsonb not null default '{}'::jsonb,
  status text not null default 'submitted',
  submitted_at timestamptz not null default now(),
  reviewed_by_user_id uuid references users(id),
  reviewed_at timestamptz
);

create table ladders (
  id uuid primary key,
  club_id uuid not null references clubs(id),
  name text not null,
  sport_type text not null,
  status text not null default 'draft',
  eligibility_rules jsonb not null default '{}'::jsonb,
  challenge_rules jsonb not null default '{}'::jsonb,
  ranking_rules jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table ladder_entries (
  id uuid primary key,
  club_id uuid not null references clubs(id),
  ladder_id uuid not null references ladders(id),
  user_id uuid not null references users(id),
  rank integer,
  status text not null default 'active',
  joined_at timestamptz not null default now(),
  unique (club_id, ladder_id, user_id),
  unique (club_id, ladder_id, rank)
);

create table ladder_ranking_history (
  id uuid primary key,
  club_id uuid not null references clubs(id),
  ladder_id uuid not null references ladders(id),
  user_id uuid not null references users(id),
  previous_rank integer,
  new_rank integer,
  reason text not null,
  match_id uuid references matches(id),
  created_at timestamptz not null default now()
);

create table challenges (
  id uuid primary key,
  club_id uuid not null references clubs(id),
  ladder_id uuid references ladders(id),
  challenger_user_id uuid not null references users(id),
  opponent_user_id uuid not null references users(id),
  status text not null default 'requested',
  expires_at timestamptz,
  match_id uuid references matches(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table standings_rows (
  id uuid primary key,
  club_id uuid not null references clubs(id),
  competition_event_id uuid not null references competition_events(id),
  competition_division_id uuid references competition_divisions(id),
  participant_id uuid not null references competition_participants(id),
  played integer not null default 0,
  wins integer not null default 0,
  losses integer not null default 0,
  draws integer not null default 0,
  points numeric(8, 2) not null default 0,
  tiebreaker_data jsonb not null default '{}'::jsonb,
  rank integer,
  updated_at timestamptz not null default now(),
  unique (club_id, competition_event_id, competition_division_id, participant_id)
);

create index competition_events_club_type_idx on competition_events(club_id, competition_type, status);
create index competition_divisions_event_idx on competition_divisions(club_id, competition_event_id);
create index competition_participants_event_idx on competition_participants(club_id, competition_event_id, status);
create index competition_registration_payments_participant_idx on competition_registration_payments(club_id, competition_participant_id);
create index competition_team_members_team_idx on competition_team_members(club_id, competition_team_id);
create index matches_club_event_idx on matches(club_id, competition_event_id, status);
create index matches_club_time_idx on matches(club_id, starts_at);
create index match_participants_match_idx on match_participants(club_id, match_id);
create index match_participants_user_idx on match_participants(club_id, user_id);
create index match_result_submissions_match_idx on match_result_submissions(club_id, match_id, status);
create index ladders_club_sport_idx on ladders(club_id, sport_type, status);
create index ladder_entries_ladder_rank_idx on ladder_entries(club_id, ladder_id, rank);
create index ladder_ranking_history_user_idx on ladder_ranking_history(club_id, user_id, created_at);
create index challenges_club_status_idx on challenges(club_id, status);
create index standings_rows_event_rank_idx on standings_rows(club_id, competition_event_id, competition_division_id, rank);
