-- Beeooking Layer 6 schema extension.
-- Adds commercialization, packaging, entitlements, sales, onboarding, support, and growth operations.

create table commercial_packages (
  id uuid primary key,
  name text not null,
  description text,
  billing_model text not null,
  base_price_cents integer not null default 0,
  currency text not null default 'usd',
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (name)
);

create table product_modules (
  id uuid primary key,
  module_key text not null unique,
  name text not null,
  layer text not null,
  status text not null default 'active',
  description text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table package_modules (
  id uuid primary key,
  commercial_package_id uuid not null references commercial_packages(id),
  product_module_id uuid not null references product_modules(id),
  included boolean not null default true,
  limits_config jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  unique (commercial_package_id, product_module_id)
);

create table club_entitlements (
  id uuid primary key,
  club_id uuid references clubs(id),
  organization_id uuid references organizations(id),
  commercial_package_id uuid references commercial_packages(id),
  product_module_id uuid references product_modules(id),
  entitlement_type text not null,
  status text not null default 'active',
  starts_at timestamptz not null default now(),
  ends_at timestamptz,
  limits_config jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table prospect_accounts (
  id uuid primary key,
  name text not null,
  primary_contact_name text,
  primary_contact_email text,
  sports text[] not null default '{}',
  club_size_estimate integer,
  status text not null default 'lead',
  source text,
  converted_club_id uuid references clubs(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table sales_opportunities (
  id uuid primary key,
  prospect_account_id uuid references prospect_accounts(id),
  club_id uuid references clubs(id),
  stage text not null default 'new',
  estimated_value_cents integer,
  currency text not null default 'usd',
  expected_close_date date,
  status text not null default 'open',
  closed_reason text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table sales_activities (
  id uuid primary key,
  sales_opportunity_id uuid not null references sales_opportunities(id),
  actor_user_id uuid references users(id),
  activity_type text not null,
  subject text,
  body text,
  next_step_at timestamptz,
  created_at timestamptz not null default now()
);

create table onboarding_plans (
  id uuid primary key,
  club_id uuid references clubs(id),
  organization_id uuid references organizations(id),
  owner_user_id uuid references users(id),
  status text not null default 'active',
  target_launch_date date,
  launched_at timestamptz,
  readiness_score numeric(5, 2),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table onboarding_tasks (
  id uuid primary key,
  onboarding_plan_id uuid not null references onboarding_plans(id),
  assigned_to_user_id uuid references users(id),
  task_type text not null,
  title text not null,
  status text not null default 'open',
  due_at timestamptz,
  completed_at timestamptz,
  dependency_config jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table customer_health_snapshots (
  id uuid primary key,
  club_id uuid references clubs(id),
  organization_id uuid references organizations(id),
  health_score numeric(5, 2) not null,
  risk_level text not null,
  signals jsonb not null default '{}'::jsonb,
  summary text,
  computed_at timestamptz not null default now()
);

create table customer_touchpoints (
  id uuid primary key,
  club_id uuid references clubs(id),
  organization_id uuid references organizations(id),
  actor_user_id uuid references users(id),
  touchpoint_type text not null,
  summary text not null,
  next_step_at timestamptz,
  created_at timestamptz not null default now()
);

create table support_tickets (
  id uuid primary key,
  club_id uuid references clubs(id),
  organization_id uuid references organizations(id),
  submitted_by_user_id uuid references users(id),
  assigned_to_user_id uuid references users(id),
  module_key text references product_modules(module_key),
  category text not null,
  priority text not null default 'normal',
  status text not null default 'open',
  subject text not null,
  description text,
  sla_due_at timestamptz,
  resolved_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table product_feedback (
  id uuid primary key,
  club_id uuid references clubs(id),
  organization_id uuid references organizations(id),
  submitted_by_user_id uuid references users(id),
  support_ticket_id uuid references support_tickets(id),
  module_key text references product_modules(module_key),
  feedback_type text not null,
  title text not null,
  body text,
  impact_score numeric(6, 2),
  status text not null default 'new',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table roadmap_items (
  id uuid primary key,
  title text not null,
  module_key text references product_modules(module_key),
  status text not null default 'candidate',
  priority text,
  evidence_summary text,
  target_release text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table roadmap_feedback_links (
  id uuid primary key,
  roadmap_item_id uuid not null references roadmap_items(id),
  product_feedback_id uuid not null references product_feedback(id),
  created_at timestamptz not null default now(),
  unique (roadmap_item_id, product_feedback_id)
);

create index package_modules_package_idx on package_modules(commercial_package_id);
create index club_entitlements_club_idx on club_entitlements(club_id, status);
create index club_entitlements_org_idx on club_entitlements(organization_id, status);
create index prospect_accounts_status_idx on prospect_accounts(status);
create index sales_opportunities_stage_idx on sales_opportunities(stage, status);
create index sales_opportunities_club_idx on sales_opportunities(club_id, status);
create index sales_activities_opportunity_idx on sales_activities(sales_opportunity_id, created_at);
create index onboarding_plans_club_idx on onboarding_plans(club_id, status);
create index onboarding_tasks_plan_idx on onboarding_tasks(onboarding_plan_id, status);
create index customer_health_club_idx on customer_health_snapshots(club_id, computed_at);
create index customer_touchpoints_club_idx on customer_touchpoints(club_id, created_at);
create index support_tickets_club_status_idx on support_tickets(club_id, status, priority);
create index support_tickets_assignee_idx on support_tickets(assigned_to_user_id, status);
create index product_feedback_module_idx on product_feedback(module_key, status);
create index roadmap_items_module_idx on roadmap_items(module_key, status);

