-- Beeooking Layer 1 initial schema draft.
-- Intended for Postgres/Supabase-style relational implementation.

create table clubs (
  id uuid primary key,
  name text not null,
  slug text not null unique,
  timezone text not null default 'America/New_York',
  status text not null default 'active',
  brand_config jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table facilities (
  id uuid primary key,
  club_id uuid not null references clubs(id),
  name text not null,
  address jsonb not null default '{}'::jsonb,
  timezone text not null,
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table courts (
  id uuid primary key,
  club_id uuid not null references clubs(id),
  facility_id uuid not null references facilities(id),
  name text not null,
  sport_type text not null,
  status text not null default 'active',
  booking_rules jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table users (
  id uuid primary key,
  email text unique,
  phone text,
  first_name text not null,
  last_name text not null,
  -- Required for every member profile to enforce age-based club rules.
  date_of_birth date not null,
  auth_provider_id text unique,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table club_users (
  id uuid primary key,
  club_id uuid not null references clubs(id),
  user_id uuid not null references users(id),
  member_number text,
  status text not null default 'active',
  profile_data jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (club_id, user_id),
  unique (club_id, member_number)
);

create table role_assignments (
  id uuid primary key,
  club_id uuid references clubs(id),
  user_id uuid not null references users(id),
  role text not null,
  created_at timestamptz not null default now(),
  unique (club_id, user_id, role)
);

create table families (
  id uuid primary key,
  club_id uuid not null references clubs(id),
  name text not null,
  primary_contact_user_id uuid references users(id),
  billing_owner_user_id uuid references users(id),
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table family_members (
  id uuid primary key,
  club_id uuid not null references clubs(id),
  family_id uuid not null references families(id),
  user_id uuid not null references users(id),
  relationship text not null,
  is_guardian boolean not null default false,
  created_at timestamptz not null default now(),
  unique (club_id, family_id, user_id)
);

create table emergency_contacts (
  id uuid primary key,
  club_id uuid not null references clubs(id),
  user_id uuid not null references users(id),
  name text not null,
  relationship text,
  phone text not null,
  email text,
  is_primary boolean not null default false,
  created_at timestamptz not null default now()
);

create table waivers (
  id uuid primary key,
  club_id uuid not null references clubs(id),
  name text not null,
  version text not null,
  body text not null,
  status text not null default 'active',
  created_at timestamptz not null default now(),
  unique (club_id, name, version)
);

create table waiver_signatures (
  id uuid primary key,
  club_id uuid not null references clubs(id),
  waiver_id uuid not null references waivers(id),
  subject_user_id uuid not null references users(id),
  signed_by_user_id uuid not null references users(id),
  status text not null default 'signed',
  signed_at timestamptz not null default now(),
  signature_metadata jsonb not null default '{}'::jsonb,
  unique (club_id, waiver_id, subject_user_id)
);

create table membership_plans (
  id uuid primary key,
  club_id uuid not null references clubs(id),
  name text not null,
  billing_interval text not null,
  price_cents integer not null default 0,
  currency text not null default 'usd',
  eligibility_rules jsonb not null default '{}'::jsonb,
  pricing_rules jsonb not null default '{}'::jsonb,
  privileges jsonb not null default '{}'::jsonb,
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table memberships (
  id uuid primary key,
  club_id uuid not null references clubs(id),
  membership_plan_id uuid not null references membership_plans(id),
  owner_type text not null,
  owner_id uuid not null,
  status text not null default 'active',
  starts_at timestamptz not null,
  ends_at timestamptz,
  renews_at timestamptz,
  stripe_subscription_id text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table membership_participants (
  id uuid primary key,
  club_id uuid not null references clubs(id),
  membership_id uuid not null references memberships(id),
  user_id uuid not null references users(id),
  family_member_id uuid references family_members(id),
  participation_status text not null default 'active',
  pricing_role text not null default 'active_member',
  price_cents integer not null default 0,
  privileges jsonb not null default '{}'::jsonb,
  starts_at timestamptz not null,
  ends_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (club_id, membership_id, user_id)
);

create table billing_customers (
  id uuid primary key,
  club_id uuid not null references clubs(id),
  owner_type text not null,
  owner_id uuid not null,
  provider text not null default 'stripe',
  provider_customer_id text not null,
  created_at timestamptz not null default now(),
  unique (club_id, provider, provider_customer_id)
);

create table coaches (
  id uuid primary key,
  club_id uuid not null references clubs(id),
  user_id uuid not null references users(id),
  bio text,
  sports text[] not null default '{}',
  hourly_rate_cents integer,
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (club_id, user_id)
);

create table coach_availability (
  id uuid primary key,
  club_id uuid not null references clubs(id),
  coach_id uuid not null references coaches(id),
  weekday integer,
  starts_at time,
  ends_at time,
  effective_from date,
  effective_until date,
  status text not null default 'active'
);

create table programs (
  id uuid primary key,
  club_id uuid not null references clubs(id),
  name text not null,
  program_type text not null,
  sport_type text not null,
  capacity integer,
  price_cents integer not null default 0,
  currency text not null default 'usd',
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table sessions (
  id uuid primary key,
  club_id uuid not null references clubs(id),
  program_id uuid references programs(id),
  coach_id uuid references coaches(id),
  facility_id uuid references facilities(id),
  court_id uuid references courts(id),
  starts_at timestamptz not null,
  ends_at timestamptz not null,
  capacity integer,
  status text not null default 'scheduled',
  created_at timestamptz not null default now()
);

create table program_registrations (
  id uuid primary key,
  club_id uuid not null references clubs(id),
  program_id uuid not null references programs(id),
  participant_user_id uuid not null references users(id),
  registered_by_user_id uuid not null references users(id),
  status text not null default 'registered',
  price_cents integer not null default 0,
  currency text not null default 'usd',
  created_at timestamptz not null default now(),
  unique (club_id, program_id, participant_user_id)
);

create table attendance_records (
  id uuid primary key,
  club_id uuid not null references clubs(id),
  session_id uuid not null references sessions(id),
  participant_user_id uuid not null references users(id),
  status text not null,
  recorded_by_user_id uuid references users(id),
  recorded_at timestamptz not null default now(),
  unique (club_id, session_id, participant_user_id)
);

create table bookings (
  id uuid primary key,
  club_id uuid not null references clubs(id),
  booking_type text not null,
  booked_by_user_id uuid not null references users(id),
  participant_user_id uuid not null references users(id),
  resource_type text not null,
  resource_id uuid not null,
  starts_at timestamptz not null,
  ends_at timestamptz not null,
  status text not null default 'confirmed',
  price_cents integer not null default 0,
  currency text not null default 'usd',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table waitlist_entries (
  id uuid primary key,
  club_id uuid not null references clubs(id),
  user_id uuid not null references users(id),
  target_type text not null,
  target_id uuid not null,
  status text not null default 'waiting',
  position integer,
  created_at timestamptz not null default now()
);

create table payments (
  id uuid primary key,
  club_id uuid not null references clubs(id),
  payer_user_id uuid not null references users(id),
  amount_cents integer not null,
  currency text not null default 'usd',
  status text not null,
  provider text not null default 'stripe',
  provider_payment_id text,
  payable_type text not null,
  payable_id uuid not null,
  created_at timestamptz not null default now()
);

create table invoices (
  id uuid primary key,
  club_id uuid not null references clubs(id),
  payer_user_id uuid references users(id),
  billing_customer_id uuid references billing_customers(id),
  amount_due_cents integer not null,
  amount_paid_cents integer not null default 0,
  currency text not null default 'usd',
  status text not null,
  provider text not null default 'stripe',
  provider_invoice_id text,
  due_at timestamptz,
  paid_at timestamptz,
  created_at timestamptz not null default now()
);

create table refunds (
  id uuid primary key,
  club_id uuid not null references clubs(id),
  payment_id uuid not null references payments(id),
  amount_cents integer not null,
  status text not null,
  provider_refund_id text,
  reason text,
  created_at timestamptz not null default now()
);

create table messages (
  id uuid primary key,
  club_id uuid not null references clubs(id),
  sender_user_id uuid references users(id),
  subject text,
  body text not null,
  channel text not null,
  audience_type text not null,
  status text not null default 'draft',
  created_at timestamptz not null default now(),
  sent_at timestamptz
);

create table message_recipients (
  id uuid primary key,
  club_id uuid not null references clubs(id),
  message_id uuid not null references messages(id),
  recipient_user_id uuid not null references users(id),
  delivery_status text not null default 'pending',
  delivered_at timestamptz,
  read_at timestamptz,
  unique (club_id, message_id, recipient_user_id)
);

create index facilities_club_id_idx on facilities(club_id);
create index courts_club_id_idx on courts(club_id);
create index club_users_club_id_idx on club_users(club_id);
create index club_users_user_id_idx on club_users(user_id);
create index family_members_club_family_idx on family_members(club_id, family_id);
create index memberships_club_owner_idx on memberships(club_id, owner_type, owner_id);
create index membership_participants_membership_idx on membership_participants(club_id, membership_id);
create index membership_participants_user_idx on membership_participants(club_id, user_id, participation_status);
create index billing_customers_club_owner_idx on billing_customers(club_id, owner_type, owner_id);
create index sessions_club_time_idx on sessions(club_id, starts_at, ends_at);
create index program_registrations_club_program_idx on program_registrations(club_id, program_id);
create index attendance_records_club_session_idx on attendance_records(club_id, session_id);
create index bookings_club_resource_time_idx on bookings(club_id, resource_type, resource_id, starts_at, ends_at);
create index bookings_participant_idx on bookings(club_id, participant_user_id);
create index invoices_club_status_idx on invoices(club_id, status);
create index payments_club_payer_idx on payments(club_id, payer_user_id);
create index messages_club_status_idx on messages(club_id, status);
