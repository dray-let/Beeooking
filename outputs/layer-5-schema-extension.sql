-- Beeooking Layer 5 schema extension.
-- Adds integrations, partner APIs, analytics, benchmarking, organizations, and governance.

create table organizations (
  id uuid primary key,
  name text not null,
  status text not null default 'active',
  settings jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table organization_clubs (
  id uuid primary key,
  organization_id uuid not null references organizations(id),
  club_id uuid not null references clubs(id),
  status text not null default 'active',
  joined_at timestamptz not null default now(),
  unique (organization_id, club_id)
);

create table organization_role_assignments (
  id uuid primary key,
  organization_id uuid not null references organizations(id),
  user_id uuid not null references users(id),
  role text not null,
  scope_config jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  unique (organization_id, user_id, role)
);

create table integration_definitions (
  id uuid primary key,
  name text not null,
  provider text not null,
  integration_type text not null,
  status text not null default 'active',
  capabilities jsonb not null default '{}'::jsonb,
  setup_config jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (provider, name)
);

create table club_integration_connections (
  id uuid primary key,
  club_id uuid not null references clubs(id),
  integration_definition_id uuid not null references integration_definitions(id),
  status text not null default 'pending',
  credential_reference text,
  settings jsonb not null default '{}'::jsonb,
  last_synced_at timestamptz,
  freshness_status text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (club_id, integration_definition_id)
);

create table integration_sync_runs (
  id uuid primary key,
  club_id uuid not null references clubs(id),
  club_integration_connection_id uuid not null references club_integration_connections(id),
  sync_type text not null,
  status text not null default 'queued',
  started_at timestamptz,
  completed_at timestamptz,
  records_processed integer not null default 0,
  error_summary text,
  created_at timestamptz not null default now()
);

create table partner_api_clients (
  id uuid primary key,
  name text not null,
  client_type text not null,
  status text not null default 'active',
  contact_email text,
  allowed_scopes text[] not null default '{}',
  rate_limit_config jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table club_api_grants (
  id uuid primary key,
  club_id uuid not null references clubs(id),
  partner_api_client_id uuid not null references partner_api_clients(id),
  granted_by_user_id uuid not null references users(id),
  scopes text[] not null default '{}',
  status text not null default 'active',
  expires_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (club_id, partner_api_client_id)
);

create table api_usage_logs (
  id uuid primary key,
  club_id uuid references clubs(id),
  partner_api_client_id uuid not null references partner_api_clients(id),
  club_api_grant_id uuid references club_api_grants(id),
  request_method text not null,
  request_path text not null,
  status_code integer,
  latency_ms integer,
  scope_used text,
  created_at timestamptz not null default now()
);

create table webhook_subscriptions (
  id uuid primary key,
  club_id uuid not null references clubs(id),
  partner_api_client_id uuid references partner_api_clients(id),
  event_types text[] not null default '{}',
  target_url text not null,
  status text not null default 'active',
  secret_reference text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table webhook_deliveries (
  id uuid primary key,
  club_id uuid not null references clubs(id),
  webhook_subscription_id uuid not null references webhook_subscriptions(id),
  event_type text not null,
  payload_summary jsonb not null default '{}'::jsonb,
  status text not null default 'pending',
  attempted_at timestamptz not null default now(),
  response_status integer,
  error_summary text
);

create table data_export_jobs (
  id uuid primary key,
  club_id uuid not null references clubs(id),
  requested_by_user_id uuid not null references users(id),
  export_type text not null,
  object_scope jsonb not null default '{}'::jsonb,
  destination_type text not null,
  destination_config jsonb not null default '{}'::jsonb,
  status text not null default 'queued',
  file_reference text,
  created_at timestamptz not null default now(),
  completed_at timestamptz
);

create table analytics_definitions (
  id uuid primary key,
  name text not null,
  version text not null,
  analytics_type text not null,
  metric_config jsonb not null default '{}'::jsonb,
  status text not null default 'active',
  created_at timestamptz not null default now(),
  unique (name, version)
);

create table analytics_snapshots (
  id uuid primary key,
  club_id uuid references clubs(id),
  organization_id uuid references organizations(id),
  analytics_definition_id uuid not null references analytics_definitions(id),
  period_start date not null,
  period_end date not null,
  snapshot_data jsonb not null default '{}'::jsonb,
  computed_at timestamptz not null default now()
);

create table benchmark_consents (
  id uuid primary key,
  club_id uuid not null references clubs(id),
  granted_by_user_id uuid not null references users(id),
  benchmark_scope jsonb not null default '{}'::jsonb,
  status text not null default 'active',
  granted_at timestamptz not null default now(),
  revoked_at timestamptz
);

create table benchmark_peer_groups (
  id uuid primary key,
  name text not null,
  criteria jsonb not null default '{}'::jsonb,
  status text not null default 'active',
  created_at timestamptz not null default now()
);

create table benchmark_snapshots (
  id uuid primary key,
  benchmark_peer_group_id uuid not null references benchmark_peer_groups(id),
  analytics_definition_id uuid not null references analytics_definitions(id),
  period_start date not null,
  period_end date not null,
  aggregate_data jsonb not null default '{}'::jsonb,
  club_count integer not null,
  computed_at timestamptz not null default now()
);

create table platform_audit_logs (
  id uuid primary key,
  club_id uuid references clubs(id),
  organization_id uuid references organizations(id),
  actor_user_id uuid references users(id),
  actor_type text not null,
  action text not null,
  target_type text not null,
  target_id uuid,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index organization_clubs_org_idx on organization_clubs(organization_id, status);
create index organization_clubs_club_idx on organization_clubs(club_id, status);
create index organization_roles_user_idx on organization_role_assignments(user_id);
create index club_integration_connections_club_idx on club_integration_connections(club_id, status);
create index integration_sync_runs_connection_idx on integration_sync_runs(club_id, club_integration_connection_id, status);
create index club_api_grants_club_idx on club_api_grants(club_id, status);
create index api_usage_logs_client_idx on api_usage_logs(partner_api_client_id, created_at);
create index api_usage_logs_club_idx on api_usage_logs(club_id, created_at);
create index webhook_subscriptions_club_idx on webhook_subscriptions(club_id, status);
create index webhook_deliveries_subscription_idx on webhook_deliveries(club_id, webhook_subscription_id, status);
create index data_export_jobs_club_idx on data_export_jobs(club_id, status);
create index analytics_snapshots_club_idx on analytics_snapshots(club_id, analytics_definition_id, period_start, period_end);
create index analytics_snapshots_org_idx on analytics_snapshots(organization_id, analytics_definition_id, period_start, period_end);
create index benchmark_consents_club_idx on benchmark_consents(club_id, status);
create index benchmark_snapshots_peer_idx on benchmark_snapshots(benchmark_peer_group_id, analytics_definition_id, period_start, period_end);
create index platform_audit_logs_club_idx on platform_audit_logs(club_id, created_at);
create index platform_audit_logs_org_idx on platform_audit_logs(organization_id, created_at);
create index platform_audit_logs_actor_idx on platform_audit_logs(actor_user_id, created_at);
