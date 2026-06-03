# Beeooking Layer 6 Implementation Backlog

## Layer 6 Sprint A: Packages, Modules & Entitlements

Goal: Define what Beeooking sells and what each club can access.

Stories:

- As a Super Admin, I can create commercial packages.
- As a Super Admin, I can define product modules.
- As a Super Admin, I can map modules to packages.
- As a Super Admin, I can grant a club trial or paid entitlements.
- As a club admin, I can view enabled modules.

Acceptance criteria:

- Entitlements can be assigned to clubs or organizations.
- Entitlements can expire.
- Module access is controlled by entitlements.
- Entitlement changes are auditable through Layer 5 audit logs.

## Layer 6 Sprint B: Sales Pipeline

Goal: Track prospects and opportunities before a club goes live.

Stories:

- As a Sales/Admin user, I can create a prospect account.
- As a Sales/Admin user, I can create a sales opportunity.
- As a Sales/Admin user, I can log calls, demos, emails, and notes.
- As a Sales/Admin user, I can track stage, value, next step, and close reason.
- As a Sales/Admin user, I can convert a won prospect into a club.

Acceptance criteria:

- Prospects can exist before clubs.
- Opportunities can link to prospects and later to clubs.
- Sales activities preserve history.
- Closed-won opportunities can trigger onboarding.

## Layer 6 Sprint C: Trial & Onboarding

Goal: Make customer launch repeatable.

Stories:

- As Customer Success, I can create an onboarding plan.
- As Customer Success, I can assign onboarding tasks.
- As a club admin, I can complete assigned onboarding tasks.
- As Customer Success, I can track launch readiness.
- As Customer Success, I can mark a club launched.

Acceptance criteria:

- Onboarding tasks have owners, statuses, due dates, and completion timestamps.
- Readiness score can be updated.
- Delayed tasks are visible internally.
- Launch history is preserved.

## Layer 6 Sprint D: Customer Success & Health

Goal: Track customer adoption, health, risk, and expansion.

Stories:

- As Customer Success, I can view customer health snapshots.
- As Customer Success, I can log account touchpoints.
- As Customer Success, I can track renewal risk.
- As Customer Success, I can identify expansion opportunities.

Acceptance criteria:

- Health snapshots preserve score, risk level, signals, and timestamp.
- Touchpoints link to clubs or organizations.
- Health signals can include usage, support, payment, onboarding, and renewal data.

## Layer 6 Sprint E: Support & Training

Goal: Manage customer support and training requests.

Stories:

- As a club admin, I can submit a support ticket.
- As Support, I can assign, prioritize, resolve, and escalate tickets.
- As Support, I can link tickets to modules and product areas.
- As Support, I can track SLA due dates.

Acceptance criteria:

- Tickets link to club, submitter, assignee, module, category, and priority.
- Resolved tickets preserve resolution timestamp.
- Ticket categories can feed product feedback.

## Layer 6 Sprint F: Feedback & Roadmap Signals

Goal: Convert customer evidence into roadmap decisions.

Stories:

- As Support or Customer Success, I can create product feedback.
- As Product/Admin, I can score feedback by impact.
- As Product/Admin, I can create roadmap items.
- As Product/Admin, I can link feedback to roadmap items.
- As Customer Success, I can follow up when a requested feature ships.

Acceptance criteria:

- Feedback can link to support tickets, clubs, organizations, users, and modules.
- Roadmap items preserve evidence summaries.
- Multiple feedback records can link to one roadmap item.

## Layer 6 Sprint G: Growth Analytics

Goal: Measure commercialization performance.

Stories:

- As Founder/Admin, I can view lead-to-customer conversion.
- As Founder/Admin, I can view onboarding cycle time.
- As Founder/Admin, I can view package and module adoption.
- As Founder/Admin, I can view support volume by module.
- As Founder/Admin, I can view renewal and expansion signals.

Acceptance criteria:

- Growth analytics can reuse Layer 5 analytics definitions.
- Reports can combine sales, onboarding, entitlements, health, support, and feedback data.
- Analytics are scoped to internal Beeooking users.

## Initial Engineering Milestones

1. Add Layer 6 schema extension.
2. Seed product modules for Layers 1-6.
3. Build package and entitlement admin.
4. Build prospect and opportunity pipeline.
5. Build onboarding plans and tasks.
6. Build customer health snapshots and touchpoints.
7. Build support tickets.
8. Build product feedback and roadmap links.
9. Build growth analytics definitions.
10. Connect entitlement changes to Layer 5 audit logs.

