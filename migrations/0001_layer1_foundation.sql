-- Beeooking Layer 1 foundation schema for Cloudflare D1.
-- Apply after creating a D1 database and adding a DB binding in wrangler.toml.

create table if not exists clubs (
  id text primary key,
  name text not null,
  slug text not null unique,
  timezone text not null default 'America/New_York',
  organization_email_domain text,
  setup_status text not null default 'draft',
  created_at text not null default current_timestamp,
  updated_at text not null default current_timestamp
);

create table if not exists club_activities (
  id text primary key,
  club_id text not null references clubs(id),
  activity_type text not null,
  resource_unit text not null,
  resource_count integer not null default 0,
  status text not null default 'active',
  created_at text not null default current_timestamp,
  updated_at text not null default current_timestamp,
  unique (club_id, activity_type)
);

create table if not exists users (
  id text primary key,
  email text unique,
  first_name text not null,
  last_name text not null,
  date_of_birth text not null,
  created_at text not null default current_timestamp,
  updated_at text not null default current_timestamp
);

create table if not exists club_users (
  id text primary key,
  club_id text not null references clubs(id),
  user_id text not null references users(id),
  member_number text,
  status text not null default 'active',
  profile_data text not null default '{}',
  created_at text not null default current_timestamp,
  updated_at text not null default current_timestamp,
  unique (club_id, user_id),
  unique (club_id, member_number)
);

create table if not exists role_assignments (
  id text primary key,
  club_id text references clubs(id),
  user_id text not null references users(id),
  role text not null,
  permissions text not null default '{}',
  validation_metadata text not null default '{}',
  created_at text not null default current_timestamp,
  unique (club_id, user_id, role)
);

create table if not exists user_sessions (
  id text primary key,
  user_id text not null references users(id),
  created_at text not null default current_timestamp,
  expires_at text not null
);

create table if not exists families (
  id text primary key,
  club_id text not null references clubs(id),
  name text not null,
  primary_contact_user_id text references users(id),
  billing_owner_user_id text references users(id),
  review_status text not null default 'draft',
  payment_status text not null default 'not_started',
  status text not null default 'active',
  created_at text not null default current_timestamp,
  updated_at text not null default current_timestamp
);

create table if not exists family_members (
  id text primary key,
  club_id text not null references clubs(id),
  family_id text not null references families(id),
  user_id text not null references users(id),
  first_name text not null,
  last_name text not null,
  date_of_birth text not null,
  relationship text not null,
  participation_status text not null default 'active',
  is_guardian integer not null default 0,
  created_at text not null default current_timestamp,
  updated_at text not null default current_timestamp,
  unique (club_id, family_id, user_id)
);

create table if not exists emergency_contacts (
  id text primary key,
  club_id text not null references clubs(id),
  user_id text not null references users(id),
  name text not null,
  relationship text,
  phone text not null,
  email text,
  is_primary integer not null default 0,
  created_at text not null default current_timestamp
);

create table if not exists waivers (
  id text primary key,
  club_id text not null references clubs(id),
  name text not null,
  version text not null,
  body text not null,
  default_coverage_scope text not null default 'family',
  responsibility_statement text,
  status text not null default 'active',
  created_at text not null default current_timestamp,
  unique (club_id, name, version)
);

create table if not exists waiver_signatures (
  id text primary key,
  club_id text not null references clubs(id),
  waiver_id text not null references waivers(id),
  subject_user_id text references users(id),
  covered_family_id text references families(id),
  coverage_scope text not null default 'family',
  signed_by_user_id text not null references users(id),
  status text not null default 'signed',
  signed_at text not null default current_timestamp,
  signature_metadata text not null default '{}',
  check (
    (subject_user_id is not null and covered_family_id is null)
    or (subject_user_id is null and covered_family_id is not null)
  )
);

create table if not exists audit_logs (
  id text primary key,
  club_id text references clubs(id),
  actor_user_id text references users(id),
  subject_user_id text references users(id),
  action text not null,
  target_type text not null,
  target_id text,
  before_data text,
  after_data text,
  metadata text not null default '{}',
  created_at text not null default current_timestamp
);

create index if not exists club_activities_club_idx on club_activities(club_id);
create index if not exists club_users_club_idx on club_users(club_id);
create index if not exists club_users_user_idx on club_users(user_id);
create index if not exists role_assignments_club_user_role_idx on role_assignments(club_id, user_id, role);
create index if not exists user_sessions_user_idx on user_sessions(user_id, expires_at);
create index if not exists families_club_idx on families(club_id);
create index if not exists family_members_club_family_idx on family_members(club_id, family_id);
create index if not exists waiver_signatures_family_idx on waiver_signatures(club_id, waiver_id, covered_family_id);
create index if not exists waiver_signatures_subject_idx on waiver_signatures(club_id, waiver_id, subject_user_id);
create index if not exists audit_logs_club_action_idx on audit_logs(club_id, action, created_at);
