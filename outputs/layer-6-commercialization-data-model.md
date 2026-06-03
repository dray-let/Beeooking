# Layer 6 Commercialization & Growth Data Model

## Purpose

Layer 6 adds Beeooking-side business operations: packaging, entitlements, sales pipeline, onboarding, customer success, support, roadmap feedback, and growth analytics. The data model should support internal teams without weakening club-level tenant isolation.

## Architecture Principles

- Commercial records can reference prospects before a `club_id` exists.
- Once a customer launches, commercial records should link to `club_id` and optionally `organization_id`.
- Entitlements control module access and should be auditable.
- Onboarding work should be task-based and repeatable.
- Customer health should store snapshots, not just a current score.
- Feedback and support should connect to product areas and modules.
- Growth analytics should reuse Layer 5 analytics definitions where possible.

## Core Objects

### Commercial Package

Represents a sellable Beeooking package.

Key fields:

- `id`
- `name`
- `description`
- `billing_model`
- `base_price_cents`
- `currency`
- `status`

Relationships:

- Has many package modules.
- Can be assigned to club subscriptions.

### Product Module

Represents a sellable or enableable product module.

Key fields:

- `id`
- `module_key`
- `name`
- `layer`
- `status`
- `description`

Relationships:

- Can belong to packages.
- Can be granted through entitlements.

### Package Module

Links packages to modules.

Key fields:

- `id`
- `commercial_package_id`
- `product_module_id`
- `included`
- `limits_config`

Relationships:

- Belongs to package.
- Belongs to product module.

### Club Entitlement

Represents a club's access to a package, module, add-on, or trial.

Key fields:

- `id`
- `club_id`
- `organization_id`
- `commercial_package_id`
- `product_module_id`
- `entitlement_type`
- `status`
- `starts_at`
- `ends_at`
- `limits_config`

Relationships:

- Belongs to club or organization.
- May belong to package.
- May belong to product module.

### Prospect Account

Represents a potential customer before a club exists.

Key fields:

- `id`
- `name`
- `primary_contact_name`
- `primary_contact_email`
- `sports`
- `club_size_estimate`
- `status`
- `source`

Relationships:

- Has opportunities.
- May convert into a club.

### Sales Opportunity

Represents a sales deal.

Key fields:

- `id`
- `prospect_account_id`
- `club_id`
- `stage`
- `estimated_value_cents`
- `currency`
- `expected_close_date`
- `status`
- `closed_reason`

Relationships:

- Belongs to prospect.
- May link to club after conversion.
- Has sales activities.

### Sales Activity

Represents a demo, call, email, note, or next step.

Key fields:

- `id`
- `sales_opportunity_id`
- `actor_user_id`
- `activity_type`
- `subject`
- `body`
- `next_step_at`
- `created_at`

Relationships:

- Belongs to sales opportunity.
- May belong to internal actor user.

### Onboarding Plan

Represents a club launch plan.

Key fields:

- `id`
- `club_id`
- `organization_id`
- `owner_user_id`
- `status`
- `target_launch_date`
- `launched_at`
- `readiness_score`

Relationships:

- Belongs to club or organization.
- Has onboarding tasks.

### Onboarding Task

Represents one launch task.

Key fields:

- `id`
- `onboarding_plan_id`
- `assigned_to_user_id`
- `task_type`
- `title`
- `status`
- `due_at`
- `completed_at`
- `dependency_config`

Relationships:

- Belongs to onboarding plan.
- May be assigned to an internal user or club admin.

### Customer Health Snapshot

Represents customer health at a point in time.

Key fields:

- `id`
- `club_id`
- `organization_id`
- `health_score`
- `risk_level`
- `signals`
- `summary`
- `computed_at`

Relationships:

- Belongs to club or organization.

### Customer Touchpoint

Represents a customer success interaction.

Key fields:

- `id`
- `club_id`
- `organization_id`
- `actor_user_id`
- `touchpoint_type`
- `summary`
- `next_step_at`
- `created_at`

Relationships:

- Belongs to club or organization.
- Belongs to actor user.

### Support Ticket

Represents a customer support request.

Key fields:

- `id`
- `club_id`
- `organization_id`
- `submitted_by_user_id`
- `assigned_to_user_id`
- `module_key`
- `category`
- `priority`
- `status`
- `subject`
- `description`
- `sla_due_at`
- `resolved_at`

Relationships:

- Belongs to club or organization.
- Belongs to submitting user.
- May link to product module.

### Product Feedback

Represents a customer feature request, pain point, or roadmap signal.

Key fields:

- `id`
- `club_id`
- `organization_id`
- `submitted_by_user_id`
- `support_ticket_id`
- `module_key`
- `feedback_type`
- `title`
- `body`
- `impact_score`
- `status`

Relationships:

- May belong to club or organization.
- May link to support ticket.

### Roadmap Item

Represents an internal roadmap item tied to customer evidence.

Key fields:

- `id`
- `title`
- `module_key`
- `status`
- `priority`
- `evidence_summary`
- `target_release`

Relationships:

- Has roadmap feedback links.

### Roadmap Feedback Link

Links customer feedback to a roadmap item.

Key fields:

- `id`
- `roadmap_item_id`
- `product_feedback_id`
- `created_at`

Relationships:

- Belongs to roadmap item.
- Belongs to product feedback.

## Permission Rules

Super Admin can:

- Manage packages, modules, entitlements, prospects, opportunities, onboarding, support, feedback, and roadmap.

Sales/Admin can:

- Manage prospects, opportunities, demos, proposals, and sales activities.

Customer Success can:

- Manage onboarding plans, customer health, touchpoints, renewals, and expansion signals.

Support can:

- Manage tickets, issue categories, escalations, and training requests.

Club Admin can:

- View enabled modules.
- Complete assigned onboarding tasks.
- Submit support tickets and feedback.

## Layer Integration Points

Layer 1:

- Clubs, users, payments, communications, memberships, and core module adoption.

Layer 2:

- Development module adoption, coach usage, and parent/player engagement.

Layer 3:

- Competition module adoption and event participation.

Layer 4:

- AI recommendation adoption, feedback, and conversion.

Layer 5:

- Organizations, analytics definitions, exports, audit logs, and partner integrations.

