# Beeooking Layer 6 PRD: Commercialization & Growth Platform

## Objective

Build the commercialization layer that helps Beeooking package, sell, onboard, support, retain, and expand club customers. Layers 1-5 define the product and platform; Layer 6 defines the systems Beeooking needs to turn that platform into a repeatable business.

## Product Positioning

Layer 1 helps clubs operate.

Layer 2 helps clubs develop players.

Layer 3 helps clubs create competition.

Layer 4 helps clubs make better decisions.

Layer 5 helps Beeooking scale as a platform.

Layer 6 helps Beeooking grow as a business.

This layer should support the customer lifecycle from lead to launch to renewal, while giving Beeooking internal teams the tools to manage packaging, trials, onboarding, customer health, support, and expansion.

## MVP Definition

Layer 6 is successful when Beeooking can:

- Define packages, plans, modules, and add-ons.
- Track prospects, demos, trials, onboarding, launch, renewal, and expansion.
- Configure club entitlements by package.
- Run repeatable onboarding playbooks.
- Track customer health and support risk.
- Manage feature requests and roadmap signals.
- Measure sales, activation, retention, and expansion metrics.

## Target Users

- Founder/Admin: Defines pricing, packaging, strategy, and customer lifecycle workflows.
- Sales/Admin: Tracks prospects, demos, trials, proposals, and closed customers.
- Customer Success: Manages onboarding, launch, health, renewals, and expansion.
- Support: Handles tickets, issues, training requests, and escalation.
- Club Admin: Completes onboarding tasks, requests help, and reviews enabled modules.
- Super Admin: Manages entitlements, customer state, and internal operations.

## Core Modules

### 1. Product Packaging & Entitlements

Capabilities:

- Packages.
- Modules.
- Add-ons.
- Entitlements.
- Trial access.
- Usage limits.
- Internal plan notes.

Acceptance criteria:

- A Super Admin can define commercial packages.
- A package can include Layer 1, 2, 3, 4, 5, or future modules.
- A club's enabled modules are controlled by entitlements.
- Trials can expire without deleting club data.
- Entitlements are auditable.

### 2. Sales Pipeline

Capabilities:

- Lead tracking.
- Club prospect profiles.
- Demo scheduling.
- Opportunity stages.
- Proposal tracking.
- Sales notes.
- Close/lost reasons.

Acceptance criteria:

- A prospect can be tracked before a club account exists.
- A prospect can convert into a club.
- Sales stages are configurable.
- Sales notes and next steps are stored.
- Closed-won opportunities can trigger onboarding.

### 3. Trial & Onboarding

Capabilities:

- Trial setup.
- Onboarding playbooks.
- Launch checklist.
- Data import checklist.
- Staff training checklist.
- Go-live readiness.

Acceptance criteria:

- A club can have an onboarding plan.
- Onboarding tasks have owners, due dates, status, and dependencies.
- Customer Success can track launch readiness.
- Club admins can complete assigned onboarding tasks.
- Delayed onboarding can raise internal alerts.

### 4. Customer Success & Health

Capabilities:

- Customer health score.
- Usage signals.
- Adoption milestones.
- Renewal risk.
- Expansion opportunities.
- Account notes.

Acceptance criteria:

- Beeooking can track customer health by club and organization.
- Health scores can include usage, support, payment, onboarding, and renewal signals.
- Customer Success can log touchpoints.
- Risk and expansion signals are visible internally.
- Health history is preserved.

### 5. Support & Training

Capabilities:

- Support tickets.
- Issue categories.
- Priority and SLA tracking.
- Training requests.
- Knowledge base references.
- Escalation tracking.

Acceptance criteria:

- Club admins can submit support requests.
- Support users can triage, assign, resolve, and escalate tickets.
- Tickets can link to clubs, users, modules, and product areas.
- SLA timestamps are tracked.
- Support themes can feed roadmap insights.

### 6. Feedback & Roadmap Signals

Capabilities:

- Feature requests.
- Customer feedback.
- Roadmap tagging.
- Impact scoring.
- Module-level signal tracking.
- Closed-loop follow-up.

Acceptance criteria:

- Feedback can be linked to a club, user, module, and support ticket.
- Feature requests can be grouped by product area.
- Beeooking can score requests by revenue, frequency, strategic value, and urgency.
- Roadmap decisions can reference customer evidence.
- Customers can be notified when requested features ship.

### 7. Growth Analytics

Capabilities:

- Funnel analytics.
- Activation metrics.
- Onboarding cycle time.
- Module adoption.
- Customer health trends.
- Retention and expansion reporting.

Acceptance criteria:

- Beeooking can measure lead-to-customer conversion.
- Beeooking can measure time from contract to launch.
- Beeooking can measure package and module adoption.
- Beeooking can identify renewal risk and expansion opportunities.
- Growth analytics can connect to Layer 5 analytics definitions.

## Non-Goals For Layer 6

- Full replacement for a mature CRM.
- Full replacement for a support desk.
- Automated legal contracting.
- Complex revenue recognition.
- Public app marketplace checkout.
- Automated pricing optimization.

## Layer 6 Dependencies

Layer 6 depends on earlier layers:

- Layer 1 clubs, users, memberships, programs, bookings, payments, and communications.
- Layer 2 module adoption and development workflows.
- Layer 3 competition module adoption and activity.
- Layer 4 AI recommendation usage and outcomes.
- Layer 5 organizations, analytics, integrations, and audit logs.

## Product Risks

- Internal operations tools can become too broad if they try to replace every sales/support system.
- Entitlement mistakes can expose paid features or block customer access.
- Onboarding workflows must be lightweight enough for early-stage sales.
- Health scores can mislead if based on weak signals.
- Feedback collection needs prioritization discipline.

## Recommended Layer 6 MVP Cut

Build in this order:

1. Packages, modules, and entitlements.
2. Sales prospect and opportunity tracking.
3. Trial and onboarding playbooks.
4. Customer health and account notes.
5. Support tickets and training requests.
6. Feedback and roadmap signal tracking.
7. Growth analytics.

