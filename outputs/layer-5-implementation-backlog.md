# Beeooking Layer 5 Implementation Backlog

## Layer 5 Sprint A: Multi-Club Organizations

Goal: Support organization-level ownership, roles, and reporting across multiple clubs.

Stories:

- As a Super Admin, I can create an organization.
- As a Super Admin, I can attach clubs to an organization.
- As an organization admin, I can view assigned clubs.
- As an organization admin, I can access cross-club reporting for owned clubs.
- As a club admin, I can retain local club configuration.

Acceptance criteria:

- Organization records do not replace club scoping.
- Organization admins only access clubs linked to their organization.
- Organization role assignments are separate from club roles.
- Cross-club analytics only include organization-owned clubs.

## Layer 5 Sprint B: Integration Hub

Goal: Let clubs connect and monitor approved external integrations.

Stories:

- As a Super Admin, I can define an integration.
- As a club admin, I can connect an available integration.
- As a club admin, I can view sync status and freshness.
- As a support user, I can troubleshoot failed syncs.

Acceptance criteria:

- Integration definitions are platform-level.
- Club connections are club-scoped.
- Sync runs track status, timing, processed records, and errors.
- Credentials are referenced securely and not stored as plaintext.

## Layer 5 Sprint C: Data Export & Warehouse Sync

Goal: Let clubs export their own Beeooking data safely.

Stories:

- As a club admin, I can run a manual data export.
- As a club admin, I can choose object scope.
- As an enterprise club admin, I can schedule recurring exports.
- As a support user, I can inspect failed export jobs.

Acceptance criteria:

- Export jobs track requester, scope, destination, status, and file reference.
- Exports are club-scoped.
- Export actions create audit logs.
- Failed exports show error status.

## Layer 5 Sprint D: Partner API Platform

Goal: Support controlled partner and internal API access.

Stories:

- As a Super Admin, I can create a partner API client.
- As a club admin, I can grant a partner access to specific scopes.
- As a club admin, I can revoke partner access.
- As a platform operator, I can view API usage.

Acceptance criteria:

- Partner access requires an active club API grant.
- API scopes are explicit.
- Revoked access blocks future API calls.
- API access creates audit and usage records.

## Layer 5 Sprint E: Webhooks

Goal: Let partners and enterprise clubs receive event notifications.

Stories:

- As a club admin, I can create a webhook subscription.
- As a partner, I can receive approved event types.
- As a support user, I can inspect delivery failures.
- As a club admin, I can pause or delete a webhook.

Acceptance criteria:

- Webhooks are club-scoped.
- Event types are restricted by partner grant scopes.
- Delivery attempts track status and response.
- Failed deliveries are visible and retryable.

## Layer 5 Sprint F: Advanced Analytics

Goal: Provide versioned, multi-module analytics.

Stories:

- As a Super Admin, I can define analytics metrics.
- As a club admin, I can view club analytics.
- As an organization admin, I can view cross-club analytics.
- As a platform operator, I can monitor AI recommendation outcomes.

Acceptance criteria:

- Analytics definitions are versioned.
- Analytics snapshots can be club-level or organization-level.
- Reports can combine Layer 1, 2, 3, and 4 data.
- KPI definition changes are auditable.

## Layer 5 Sprint G: Benchmarking & Governance

Goal: Support opt-in benchmarking and enterprise governance.

Stories:

- As a club admin, I can opt into benchmarking.
- As a club admin, I can revoke benchmarking consent.
- As a Super Admin, I can define benchmark peer groups.
- As a club admin, I can view anonymized benchmark dashboards.
- As a Super Admin, I can audit sensitive platform actions.

Acceptance criteria:

- Benchmarking requires active consent.
- Benchmark snapshots are aggregate and anonymized.
- Benchmark peer groups do not expose identifiable club data.
- Consent and revocation are logged.
- Sensitive support, export, API, and admin actions create audit logs.

## Initial Engineering Milestones

1. Add Layer 5 schema extension.
2. Build organization accounts and roles.
3. Build integration catalog and club connection workflow.
4. Build sync status and error monitoring.
5. Build data export jobs.
6. Build partner API clients and club API grants.
7. Build webhook subscriptions and delivery logs.
8. Build analytics definitions and snapshots.
9. Build benchmark consent, peer groups, and dashboards.
10. Build platform audit log views and governance controls.

