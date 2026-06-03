# Layer 5 Ecosystem & Scale Data Model

## Purpose

Layer 5 extends Beeooking with integrations, partner APIs, advanced analytics, multi-club organizations, benchmarking, and governance. The data model should preserve tenant isolation while supporting controlled cross-club workflows.

## Architecture Principles

- Club-owned records continue to include `club_id`.
- Organization-level records may span multiple clubs through explicit organization membership.
- Partner access requires club consent and scoped permissions.
- Integration syncs must track status, freshness, and errors.
- Exports and API access must be auditable.
- Benchmarking requires opt-in consent and anonymized aggregate outputs.
- Analytics definitions should be versioned.

## Core Objects

### Organization

Represents a multi-club company, ownership group, or operating group.

Key fields:

- `id`
- `name`
- `status`
- `settings`

Relationships:

- Has many organization clubs.
- Has many organization role assignments.

### Organization Club

Links a club to an organization.

Key fields:

- `id`
- `organization_id`
- `club_id`
- `status`
- `joined_at`

Relationships:

- Belongs to organization.
- Belongs to club.

### Organization Role Assignment

Represents a user's role across an organization.

Key fields:

- `id`
- `organization_id`
- `user_id`
- `role`
- `scope_config`

Relationships:

- Belongs to organization.
- Belongs to user.

### Integration Definition

Represents an integration available in the Beeooking integration catalog.

Key fields:

- `id`
- `name`
- `provider`
- `integration_type`
- `status`
- `capabilities`
- `setup_config`

Relationships:

- Has many club integration connections.

### Club Integration Connection

Represents a club's connected instance of an integration.

Key fields:

- `id`
- `club_id`
- `integration_definition_id`
- `status`
- `credential_reference`
- `settings`
- `last_synced_at`
- `freshness_status`

Relationships:

- Belongs to club.
- Belongs to integration definition.
- Has sync runs.

### Integration Sync Run

Represents one integration sync attempt.

Key fields:

- `id`
- `club_id`
- `club_integration_connection_id`
- `sync_type`
- `status`
- `started_at`
- `completed_at`
- `records_processed`
- `error_summary`

Relationships:

- Belongs to club integration connection.

### Partner API Client

Represents an approved partner or internal API client.

Key fields:

- `id`
- `name`
- `client_type`
- `status`
- `contact_email`
- `allowed_scopes`
- `rate_limit_config`

Relationships:

- Has club API grants.
- Has API usage logs.

### Club API Grant

Represents a club's consent for a partner API client.

Key fields:

- `id`
- `club_id`
- `partner_api_client_id`
- `granted_by_user_id`
- `scopes`
- `status`
- `expires_at`

Relationships:

- Belongs to club.
- Belongs to partner API client.
- Has consent record.

### API Usage Log

Represents one API request for audit, monitoring, billing, and rate-limit analysis.

Key fields:

- `id`
- `club_id`
- `partner_api_client_id`
- `club_api_grant_id`
- `request_method`
- `request_path`
- `status_code`
- `latency_ms`
- `scope_used`

Relationships:

- Belongs to partner API client.
- May belong to club.
- May belong to club API grant.

### Webhook Subscription

Represents an outbound webhook subscription for a partner or club.

Key fields:

- `id`
- `club_id`
- `partner_api_client_id`
- `event_types`
- `target_url`
- `status`
- `secret_reference`

Relationships:

- Belongs to club.
- May belong to partner API client.
- Has webhook delivery attempts.

### Webhook Delivery

Represents one webhook delivery attempt.

Key fields:

- `id`
- `club_id`
- `webhook_subscription_id`
- `event_type`
- `payload_summary`
- `status`
- `attempted_at`
- `response_status`

Relationships:

- Belongs to webhook subscription.

### Data Export Job

Represents a manual or scheduled export.

Key fields:

- `id`
- `club_id`
- `requested_by_user_id`
- `export_type`
- `object_scope`
- `destination_type`
- `destination_config`
- `status`
- `file_reference`

Relationships:

- Belongs to club.
- Belongs to requesting user.

### Analytics Definition

Represents a versioned metric, report, or KPI definition.

Key fields:

- `id`
- `name`
- `version`
- `analytics_type`
- `metric_config`
- `status`

Relationships:

- Can be used by analytics snapshots.

### Analytics Snapshot

Represents a computed metric or dashboard snapshot.

Key fields:

- `id`
- `club_id`
- `organization_id`
- `analytics_definition_id`
- `period_start`
- `period_end`
- `snapshot_data`
- `computed_at`

Relationships:

- May belong to club.
- May belong to organization.
- Belongs to analytics definition.

### Benchmark Consent

Represents a club's consent to contribute anonymized data to benchmarks.

Key fields:

- `id`
- `club_id`
- `granted_by_user_id`
- `benchmark_scope`
- `status`
- `granted_at`
- `revoked_at`

Relationships:

- Belongs to club.
- Belongs to granting user.

### Benchmark Peer Group

Represents a group used for anonymized comparisons.

Key fields:

- `id`
- `name`
- `criteria`
- `status`

Relationships:

- Has benchmark snapshots.

### Benchmark Snapshot

Represents anonymized aggregate benchmark data.

Key fields:

- `id`
- `benchmark_peer_group_id`
- `analytics_definition_id`
- `period_start`
- `period_end`
- `aggregate_data`
- `club_count`
- `computed_at`

Relationships:

- Belongs to peer group.
- Belongs to analytics definition.

### Platform Audit Log

Represents sensitive platform, support, export, API, or governance activity.

Key fields:

- `id`
- `club_id`
- `organization_id`
- `actor_user_id`
- `actor_type`
- `action`
- `target_type`
- `target_id`
- `metadata`
- `created_at`

Relationships:

- May belong to club.
- May belong to organization.
- Belongs to actor user when available.

## Permission Rules

Super Admin can:

- Manage integration definitions.
- Manage partner API clients.
- View platform health and audit logs.
- Support clubs through audited workflows.

Organization Admin can:

- View and manage assigned organization clubs.
- View cross-club analytics for owned clubs.
- Manage organization-level templates and settings if enabled.

Club Admin can:

- Connect integrations.
- Approve partner API grants.
- Configure webhooks.
- Run exports.
- Opt into or out of benchmarking.
- View club analytics.

Partner Developer can:

- Access only approved API scopes.
- Receive webhook events only for clubs that granted access.

## Layer Integration Points

Layer 1:

- Exports and analytics for members, memberships, bookings, programs, payments, and communications.

Layer 2:

- Development analytics for goals, assessments, notes, and report cards.

Layer 3:

- Competition analytics for matches, ladders, leagues, tournaments, and standings.

Layer 4:

- Recommendation outcome analytics and AI quality monitoring.
