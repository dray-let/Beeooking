# Sprint 0: Platform Architecture & Data Model

## Purpose

Sprint 0 defines the technical foundation for Beeooking before product features are built. The goal is to prevent rework by establishing multi-tenancy, core objects, permission boundaries, and data relationships up front.

## Architecture Principles

- Every operational record is scoped to a `club_id`.
- Users have one global identity and club-specific memberships/roles.
- Authorization is evaluated through club membership, role, and object ownership.
- Family relationships are first-class because parents often manage junior players.
- Membership privileges should be configurable data, not hardcoded logic.
- Payments should use internal records plus external provider references.
- Booking conflicts should be prevented at the database and service layer.

## Core Objects

### Club

Represents a customer club using Beeooking.

Key fields:

- `id`
- `name`
- `slug`
- `timezone`
- `status`
- `brand_config`
- `activity_config`
- `organization_email_domain`
- `staff_email_domain_required`
- `created_at`

Relationships:

- Has many facilities.
- Has many club activities.
- Has many users through club memberships.
- Has many membership plans.
- Has many programs, bookings, payments, and messages.

### Facility

Represents a physical club location or venue.

Key fields:

- `id`
- `club_id`
- `name`
- `address`
- `timezone`

Relationships:

- Belongs to club.
- Has many bookable resources.

### Club Activity

Represents an activity selected during Super Admin club setup.

Key fields:

- `id`
- `club_id`
- `name`
- `activity_type`
- `resource_unit`
- `resource_count`
- `status`

Rules:

- Super Admin selects activities from a scrollable menu before resources are created.
- Super Admin chooses the approved organization email domain during club setup.
- Super Admin, Club Admin, Staff, and Coach roles require an email from the approved organization domain.
- Parent and Member roles may use personal email addresses unless the club config requires otherwise.
- Activity options include tennis, squash, padel, pickleball, table tennis, badminton, swimming, fitness, ice/rink, and multi-purpose rooms.
- Resource units include court, lane, studio, rink, table, and room.

### Bookable Resource

Represents a bookable court, lane, studio, rink, table, or room.

Key fields:

- `id`
- `club_id`
- `facility_id`
- `club_activity_id`
- `name`
- `activity_type`
- `resource_unit`
- `status`
- `booking_rules`

Relationships:

- Belongs to facility.
- Has many resource bookings.

### User

Represents a global login identity.

Key fields:

- `id`
- `email`
- `phone`
- `first_name`
- `last_name`
- `date_of_birth`
- `auth_provider_id`
- `created_at`

Relationships:

- Has many club user records.
- May belong to one or more families.
- May be a parent, member, coach, staff member, or admin depending on club context.

Profile rule:

- `date_of_birth` is required for all member profiles.
- `date_of_birth` supports squash protective eyewear requirements, group age restrictions, and dependent under-18 family membership validation.

### Club User

Joins a global user to a specific club with status and profile context.

Key fields:

- `id`
- `club_id`
- `user_id`
- `member_number`
- `status`
- `profile_data`

Relationships:

- Belongs to club.
- Belongs to user.
- Has many role assignments.

### Role Assignment

Represents a user's role inside a club.

Key fields:

- `id`
- `club_id`
- `user_id`
- `role`
- `permissions`
- `validation_metadata`

Rules:

- Super Admin, Club Admin, Staff, and Coach role assignments require an email from the club's approved organization domain.
- Permissions should store role-specific operational limits, such as staff credit limits or booking authority.
- Validation metadata should record whether the organization domain check passed and which domain was used.

### Family

Represents a household or billing group.

Key fields:

- `id`
- `club_id`
- `name`
- `primary_contact_user_id`
- `billing_owner_user_id`

Relationships:

- Belongs to club.
- Has many family members.
- Can hold family memberships.

Composition rule:

- A family membership can include one main member.
- A family membership can include one spousal member.
- Additional family membership members must be dependents under 18 years of age.

### Family Member

Represents a user's relationship to a family.

Key fields:

- `id`
- `club_id`
- `family_id`
- `user_id`
- `relationship`
- `is_guardian`

Relationships:

- Belongs to family.
- Belongs to user.

### Waiver

Represents a club-specific legal document template.

Key fields:

- `id`
- `club_id`
- `name`
- `version`
- `body`
- `default_coverage_scope`
- `responsibility_statement`
- `status`

Relationships:

- Belongs to club.
- Has many waiver signatures.

### Waiver Signature

Represents a signed waiver for a family or user, usually signed by an adult or guardian.

Key fields:

- `id`
- `club_id`
- `waiver_id`
- `subject_user_id`
- `covered_family_id`
- `coverage_scope`
- `signed_by_user_id`
- `signed_at`
- `status`

Relationships:

- Belongs to waiver.
- Links the covered family or player/member and signer.

Rules:

- One family waiver can cover every listed family member when the waiver text states the signer is responsible for all covered members.
- Individual waiver coverage is still supported when a waiver is not family-scoped.
- Coverage scope and historical waiver version must be preserved.

### Membership Plan

Represents a sellable membership configuration.

Key fields:

- `id`
- `club_id`
- `name`
- `access_level`
- `billing_interval`
- `price_cents`
- `currency`
- `eligibility_rules`
- `pricing_rules`
- `access_rules`
- `rate_modifiers`
- `self_service_opt_in`
- `admin_required_for_opt_out`
- `privileges`
- `status`

Relationships:

- Belongs to club.
- Has many memberships.

Rules:

- Monthly membership plans can allow self-service opt-in after payment.
- Monthly membership opt-out requires club admin contact and review.
- Base Member, Class Member, Rackets Member, Health Member, Parent, and Non Member access levels are represented by `access_level`.
- Rackets access rules can store peak booking limits such as 2 max peak-time bookings and unlimited off-peak bookings.
- Health access rules can store recovery suite inclusion and admin-controlled massage or health pricing reductions.
- Non Member rules can allow visibility of all bookable spaces while requiring non-member rates.

### Membership

Represents an active or historical membership held by a user or family.

Key fields:

- `id`
- `club_id`
- `membership_plan_id`
- `owner_type`
- `owner_id`
- `status`
- `starts_at`
- `ends_at`
- `renews_at`
- `stripe_subscription_id`

Relationships:

- Belongs to club.
- Belongs to membership plan.
- Owner is either user or family.
- Has many membership participants.

### Membership Participant

Represents one person attached to a membership for pricing and privileges.

Key fields:

- `id`
- `club_id`
- `membership_id`
- `user_id`
- `family_member_id`
- `participation_status`
- `pricing_role`
- `price_cents`
- `privileges`
- `review_status`
- `selected_by_user_id`
- `approved_by_user_id`
- `approved_at`
- `locked_at`
- `starts_at`
- `ends_at`

Rules:

- `participation_status` supports active and non-active values.
- Pricing is calculated at the participant level, not only at the family level.
- A family membership can include a non-active adult account holder and an active child member.
- Non-active adults can remain guardians, billing owners, waiver signers, and communication recipients without active playing privileges.
- Members or parents can select active/non-active status during membership setup.
- Club admins review and approve participant status before the membership type is finalized.
- Once approved, participant status is locked for self-service and changes require club admin support.

### Coach

Represents a coach profile for a club user.

Key fields:

- `id`
- `club_id`
- `user_id`
- `bio`
- `sports`
- `hourly_rate_cents`
- `status`

Relationships:

- Belongs to club.
- Belongs to user.
- Has coach availability.
- Has coach bookings.

### Program

Represents a clinic, camp, course, or recurring class.

Key fields:

- `id`
- `club_id`
- `name`
- `program_type`
- `sport_type`
- `capacity`
- `price_cents`
- `status`

Relationships:

- Belongs to club.
- Has many sessions.
- Has many registrations.

### Session

Represents a scheduled instance of a program or lesson.

Key fields:

- `id`
- `club_id`
- `program_id`
- `coach_id`
- `facility_id`
- `bookable_resource_id`
- `starts_at`
- `ends_at`
- `capacity`

Relationships:

- Belongs to program.
- May belong to coach, facility, and bookable resource.

### Program Registration

Represents a user's enrollment in a clinic, camp, course, or recurring class.

Key fields:

- `id`
- `club_id`
- `program_id`
- `participant_user_id`
- `registered_by_user_id`
- `status`
- `price_cents`

Relationships:

- Belongs to club.
- Belongs to program.
- Links participant and registering user, usually a parent or member.

### Attendance Record

Represents attendance for one participant in one scheduled session.

Key fields:

- `id`
- `club_id`
- `session_id`
- `participant_user_id`
- `status`
- `recorded_by_user_id`
- `recorded_at`

Relationships:

- Belongs to club.
- Belongs to session.
- Links participant and recording coach/staff user.

### Booking

Represents a reservation or registration.

Key fields:

- `id`
- `club_id`
- `booking_type`
- `booked_by_user_id`
- `participant_user_id`
- `resource_type`
- `resource_id`
- `starts_at`
- `ends_at`
- `status`
- `price_cents`

Relationships:

- Belongs to club.
- Links booker, participant, and resource.

### Payment

Represents a payment transaction.

Key fields:

- `id`
- `club_id`
- `payer_user_id`
- `amount_cents`
- `currency`
- `status`
- `provider`
- `provider_payment_id`
- `payable_type`
- `payable_id`

Relationships:

- Belongs to club.
- Links to the purchased object.

### Invoice

Represents an invoice or bill generated by the payment provider or Beeooking billing logic.

Key fields:

- `id`
- `club_id`
- `payer_user_id`
- `billing_customer_id`
- `amount_due_cents`
- `amount_paid_cents`
- `status`
- `provider_invoice_id`

Relationships:

- Belongs to club.
- May link to a billing customer.
- May be paid by one or more payments depending on provider behavior.

### Message

Represents a communication sent through Beeooking.

Key fields:

- `id`
- `club_id`
- `sender_user_id`
- `subject`
- `body`
- `channel`
- `status`
- `audience_type`

Relationships:

- Belongs to club.
- Has many message recipients.

## Permissions

Layer 0 stores permission decisions as named actions. Roles grant default actions, and club-specific overrides can add limits such as maximum credit amount or booking horizon.

### Permission Action Matrix

| Permission key | Super Admin | Club Admin | Staff | Coach | Parent | Member |
| --- | --- | --- | --- | --- | --- | --- |
| `access_all_club_records` | Yes | Club only | No | No | No | No |
| `grant_club_admin` | Yes | No | No | No | No | No |
| `manage_role_permissions` | Yes | Staff, coach, member levels only | No | No | No | No |
| `manage_staff_onboarding` | Yes | Yes | No | No | No | No |
| `manage_coach_onboarding` | Yes | Yes | No | No | No | No |
| `edit_member_profile` | Yes | Yes | Yes | No | Own family only | Own only |
| `view_member_profile` | Yes | Yes | Yes | Yes | Own family only | Own only |
| `edit_payment_structure` | Yes | No | No | No | No | No |
| `edit_core_pricing` | Yes | No | No | No | No | No |
| `view_staff_coach_payroll` | Yes | Yes | No | Own payments only | No | No |
| `book_for_others` | Yes | Yes | Yes | Own sessions only | Own family only | Own only |
| `book_12_months_ahead` | Yes | Yes | Yes | No | No | No |
| `reserve_event_space` | Yes | Yes | No | No | No | No |
| `send_invoice` | Yes | Yes | Yes | No | No | No |
| `manage_customer_membership` | Yes | Yes | Yes | No | Own family only | Own only |
| `apply_credit` | Yes | Yes | Limited by `credit_limit_cents` | No | No | No |
| `manage_timetables` | Yes | Yes | No | Own availability only | No | No |
| `manage_registers` | Yes | Yes | Yes | Own sessions only | No | No |
| `add_walk_in_with_payment` | Yes | Yes | Yes | Own sessions only | No | No |
| `manage_public_coach_profile` | Yes | Yes | No | Own profile only | No | No |
| `sign_family_waiver` | No | No | No | No | Own family only | No |

Permission implementation rules:

- `grant_club_admin` is never grantable by Club Admin, Staff, Coach, Parent, Member, or Non Member.
- `edit_payment_structure` and `edit_core_pricing` are Super Admin-only.
- Staff credit authority is stored in role permissions as `credit_limit_cents`.
- Coach payment access is always filtered to the coach's own payable records.
- Parent access is always filtered to linked family members and never unrelated children.
- Member and Non Member booking access is controlled by membership plan access rules and rate rules.

### Super Admin

Can:

- Create and manage clubs.
- View cross-club health and revenue.
- Access all club areas, contacts, profiles, accounts, pricing, timings, payments, and edits.
- Set all pricing, payment structures, booking timings, resource rules, and membership privileges.
- Grant Club Admin access. No other role can grant Club Admin.
- Control access rights for all other users.
- Control onboarding for staff and coach accounts.
- Manage platform-level and club-level configuration.

Cannot:

- Impersonate users without audit logging.

### Club Admin

Can:

- Manage club settings, branding, rules, facilities, and bookable resources within Super Admin pricing/payment boundaries.
- Manage staff, coaches, and all member levels.
- Edit member accounts.
- Reserve spaces for events or under other users' names.
- Manage payroll and view payments for all staff and coaches.
- Manage coaching staff timetables.
- Override coach and staff accounts.
- Manage members, families, coaches, staff, memberships, bookings, programs, payments, and messages.
- View club reporting.

Cannot:

- Access other clubs.
- Change Beeooking platform configuration.
- Edit payment structure or core pricing. Only Super Admin can do that.

### Staff

Can:

- Make bookings on behalf of members and non-members.
- Book coaching on behalf of customers.
- Edit club member accounts.
- Book ahead up to 12 months when front desk access allows it.
- Review and send invoices for customers and payments.
- Upgrade and manage payment and membership on behalf of customers.
- Apply credits up to a Club Admin-defined limit when resolving customer issues.
- Manage assigned operational workflows such as check-in, bookings, registrations, and member support.

Cannot:

- Change billing configuration or role permissions unless explicitly granted.

### Coach

Can:

- View only payments owed to them for lessons, clinics, and related work.
- Book their own lessons, clinics, and courts under their name.
- View all member accounts without editing member information.
- Review registers and add walk-ins to clinics or lessons, triggering payment from saved customer details where available.
- Edit availability and connect diary/calendar integration.
- Modify their public front-end coach profile.
- View assigned programs, sessions, and participants.

Cannot:

- View full club financials.
- View other staff or coach payments.
- Edit member account information.
- Manage club-wide settings.

### Parent

Can:

- Manage own non-member profile.
- Manage child profiles in their family.
- Act on behalf of child accounts.
- Receive all child notifications.
- See child payment information.
- Switch back to their own non-member account for personal bookings.
- Sign family waivers.
- Book, register, and pay for children.
- Receive child-related communications.

Cannot:

- Access unrelated child/member records.

### Member

Can:

- Manage own profile.
- See all bookable areas.
- Pay member rates, slated around 20% off.
- Access gym barrier entry when included by membership.
- Book courts, classes, health suite, and eligible programs when access rules and payment requirements are satisfied.
- View own bookings, payments, and messages.

Cannot:

- Manage other users unless linked as guardian or billing owner.

### Class Member

Can:

- Access all classes without per-class payment when added on top of base membership.
- See racket bookings and pay member rates.

### Rackets Member

Can:

- Access courts subject to club-set restrictions.
- Hold up to 2 peak-time bookings when configured.
- Book unlimited off-peak sessions when configured.
- See other bookable spaces and pay member rates.

### Health Member

Can:

- Access the recovery suite when included.
- Receive heavily reduced massage pricing controlled by admin.
- Book health and recovery services when available.

### Non Member

Can:

- Manage account details.
- See all bookable spaces.
- Book and pay non-member rates.

## Booking Rules

Layer 0 booking rules are data-driven so each club can tune restrictions without code changes.

### Default Booking Concepts

- `peak_window`: Club-defined time ranges that count as peak bookings.
- `off_peak_window`: All bookable time outside peak windows unless explicitly closed.
- `advance_booking_days`: Number of days ahead a role or access level may book.
- `cancellation_cutoff_hours`: Minimum notice needed to cancel without penalty.
- `resource_conflict_rule`: One confirmed booking can occupy a bookable resource for the same time range.
- `coach_conflict_rule`: One confirmed coaching booking can occupy a coach for the same time range.
- `participant_conflict_rule`: A participant cannot hold overlapping confirmed bookings unless the booking type allows it.

### Role Booking Rules

- Super Admin and Club Admin can reserve spaces for events, maintenance, and bookings under other users' names.
- Staff can book on behalf of members and non-members and can book up to 12 months ahead when their permission grants it.
- Coach can book only their own lessons, clinics, and courts under their name.
- Parent can book for children linked to their family and can book personally as a non-member.
- Member can book according to membership access level and club rules.
- Non Member can see all bookable spaces and book when payment at non-member rate is required.

### Rackets Booking Rules

- Rackets Member access may include up to 2 active peak-time court bookings.
- Rackets Member access may include unlimited off-peak court bookings unless the club sets a different limit.
- Base Member and Class Member can see racket bookings and pay member rates unless a rackets add-on includes the court booking.
- Non Member can see racket bookings and pay non-member rates.

### Conflict Strategy

- The database stores every booking with `club_id`, `resource_type`, `resource_id`, `starts_at`, `ends_at`, and `status`.
- Confirmed resource bookings must not overlap for the same club, resource type, and resource id.
- Confirmed coach/session bookings must not overlap for the same coach unless the session capacity and program rules allow multiple participants.
- Service code must re-check availability immediately before payment confirmation.
- Waitlist entries are created when capacity is full or the selected time/resource is unavailable.

## Membership Pricing Logic

Pricing is calculated from the membership plan, participant status, add-ons, and booking target.

### Rate Inputs

- `access_level`: Base Member, Class Member, Rackets Member, Health Member, Parent, or Non Member.
- `participation_status`: Active or non-active.
- `pricing_role`: Active member, non-active member, spouse, junior, guest, or non-member.
- `rate_modifiers`: Member discount, class inclusion, racket inclusion, health discount, or admin override.
- `review_status`: Pending admin review, approved, rejected, or locked.

### Rules

- A family membership can have a non-active adult and an active child.
- Active/non-active choices are selected by the member or parent during setup.
- Club Admin reviews the selected participants and final membership type.
- Once approved, membership type and participant active status are locked for self-service changes.
- Monthly opt-in is self-service when payment succeeds.
- Monthly opt-out requires contacting admin.
- Member rates are planned around 20% off, but the exact percentage is club-controlled.
- Class Member includes classes without per-class payment.
- Rackets Member includes court access within club-set peak/off-peak limits.
- Health Member includes recovery suite access and admin-controlled reduced massage/health pricing.
- Non Member sees all bookable spaces and pays non-member rates.

## Waiver Enforcement

Waiver completion is a hard prerequisite for club activity.

### Rules

- One family waiver can cover every listed family member when the waiver text states the signer is responsible for all covered members.
- The signer must be an adult guardian or billing owner linked to the family.
- The signed waiver stores the waiver version and coverage scope.
- If a new waiver version is issued, the family must sign the new version before restricted activity continues.
- Individual waiver support remains available for clubs that choose individual coverage.

### Blocked Until Waiver Complete

- Booking courts, lanes, studios, rinks, tables, rooms, or health spaces.
- Registering for clinics, camps, courses, classes, lessons, or events.
- Joining waitlists.
- Checking in for sessions.
- Coach or staff adding a walk-in participant.

### Allowed Before Waiver Complete

- Account creation.
- Family setup.
- Dependent child creation.
- Membership selection.
- Payment setup when the club allows payment before activity.
- Viewing waiver requirements and signing the waiver.

## Seed Data

Sprint 0 includes one sample club so the Layer 1 preview can be tested with realistic data.

Sample club:

- Club: Beeooking Demo Club.
- Organization email domain: `beeooking.com`.
- Activities: Squash, Tennis, Swimming, Fitness, Health/Recovery.
- Resources: 4 squash courts, 3 tennis courts, 6 swimming lanes, 2 fitness studios, 3 recovery rooms.
- Roles: One Super Admin, one Club Admin, one Staff user, one Coach, one Parent, one junior Member, one Non Member.
- Membership plans: Base Member, Class Member, Rackets Member, Health Member, Non Member rate card.
- Waiver: Family responsibility waiver covering all listed family members.
- Booking rules: 2 active peak racket bookings for rackets members and staff booking horizon of 365 days.

## Database Guardrails

Layer 0 must include guardrails before product work accelerates.

### Required Constraints

- Every operational table includes `club_id`.
- Family membership composition enforces one main member and one spousal member through service checks and database-supported participant metadata.
- Additional family membership participants must be under 18 at approval time.
- Waiver signatures must point to either one subject user or one covered family, never both.
- Membership participant status locks after admin approval.
- Booking `ends_at` must be after `starts_at`.
- Payment and invoice provider ids are unique per club/provider where available.

### Required Indexes

- `club_id` indexes on every operational table.
- Composite booking availability index on `club_id`, `resource_type`, `resource_id`, `starts_at`, `ends_at`.
- Composite role lookup index on `club_id`, `user_id`, `role`.
- Composite membership participant lookup on `club_id`, `membership_id`, `user_id`.
- Waiver completion lookup on `club_id`, `waiver_id`, `covered_family_id` and `club_id`, `waiver_id`, `subject_user_id`.

### Audit Logging

Audit logs are required for:

- Granting or removing Club Admin access.
- Changing payment structure or core pricing.
- Changing membership access level or participant active/non-active status after approval.
- Applying credits.
- Staff or Club Admin booking on behalf of another user.
- Super Admin or Club Admin overriding staff or coach accounts.
- User impersonation.

## API Contract

Layer 0 defines the first API routes before implementation.

| Route | Method | Purpose | Required permission |
| --- | --- | --- | --- |
| `/api/clubs` | `POST` | Create a club. | `access_all_club_records` |
| `/api/clubs/:clubId/setup/activities` | `PUT` | Save selected sports/resources. | Super Admin setup |
| `/api/clubs/:clubId/setup/email-domain` | `PUT` | Save approved organization email domain. | Super Admin setup |
| `/api/clubs/:clubId/invites` | `POST` | Invite staff, coach, admin, member, or parent. | Role-specific invite permission |
| `/api/clubs/:clubId/roles` | `POST` | Assign a club role. | `manage_role_permissions`; `grant_club_admin` for Club Admin |
| `/api/clubs/:clubId/families` | `POST` | Create a family group. | `edit_member_profile` or own family |
| `/api/clubs/:clubId/families/:familyId/dependents` | `POST` | Add dependent child after adult account exists. | Own family or `edit_member_profile` |
| `/api/clubs/:clubId/waivers/:waiverId/signatures` | `POST` | Sign individual or family waiver. | Own family signer |
| `/api/clubs/:clubId/membership-plans` | `POST` | Create pricing/access plan. | `edit_core_pricing` |
| `/api/clubs/:clubId/memberships` | `POST` | Start membership setup or self-service opt-in. | Own account/family or staff support |
| `/api/clubs/:clubId/memberships/:membershipId/review` | `POST` | Admin approval of membership type and active/non-active statuses. | Club Admin |
| `/api/clubs/:clubId/bookings` | `POST` | Create booking after waiver, access, pricing, and conflict checks. | Booking permission by role/access |
| `/api/clubs/:clubId/credits` | `POST` | Apply customer credit. | `apply_credit` with limit |

## Admin Onboarding Flow

Super Admin setup happens before ordinary club operations.

1. Create club profile: name, slug, timezone, brand settings.
2. Choose supported activities from the sport/resource menu.
3. Enter resource count for each selected activity.
4. Create bookable resources from the selected activities.
5. Choose the approved organization email domain.
6. Configure first facility and operating timezone.
7. Create first Club Admin using an email from the approved organization domain.
8. Configure base booking rules: peak windows, advance booking windows, cancellation windows, and conflict settings.
9. Configure membership plans and access levels.
10. Publish required family waiver.
11. Invite staff and coaches.
12. Move club status from setup to active.

## Multi-Tenant Design

### Club Scoping

Every operational table must include `club_id`, including:

- Facilities
- Courts
- Club users
- Families
- Family members
- Waivers
- Membership plans
- Memberships
- Coaches
- Programs
- Sessions
- Program registrations
- Attendance records
- Bookings
- Invoices
- Payments
- Messages

### Shared Identity

The `users` table is global and does not require a single club. Club-specific access lives in `club_users` and `role_assignments`.

### Authorization Pattern

Every request should resolve:

1. Authenticated `user_id`.
2. Active `club_id`.
3. User's roles for that club.
4. Requested object's `club_id`.
5. Permission for the requested action.

### Data Isolation Rule

For club-scoped queries, always filter by `club_id`. Cross-club queries should only be available to Super Admin flows.

## Sprint 0 Deliverables

- Final core entity model.
- Initial database schema.
- Role and permission matrix.
- Tenant scoping rules.
- Booking conflict strategy.
- Stripe object mapping.
- Seed data for one sample club.
- Engineering backlog for Sprint 1.
