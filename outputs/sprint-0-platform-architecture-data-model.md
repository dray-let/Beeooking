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
- `created_at`

Relationships:

- Has many facilities.
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
- Has many courts.

### Court

Represents a bookable court.

Key fields:

- `id`
- `club_id`
- `facility_id`
- `name`
- `sport_type`
- `status`
- `booking_rules`

Relationships:

- Belongs to facility.
- Has many court bookings.

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
- `status`

Relationships:

- Belongs to club.
- Has many waiver signatures.

### Waiver Signature

Represents a signed waiver for a user, usually signed by an adult or guardian.

Key fields:

- `id`
- `club_id`
- `waiver_id`
- `subject_user_id`
- `signed_by_user_id`
- `signed_at`
- `status`

Relationships:

- Belongs to waiver.
- Links the player/member and signer.

### Membership Plan

Represents a sellable membership configuration.

Key fields:

- `id`
- `club_id`
- `name`
- `billing_interval`
- `price_cents`
- `currency`
- `eligibility_rules`
- `pricing_rules`
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
- `court_id`
- `starts_at`
- `ends_at`
- `capacity`

Relationships:

- Belongs to program.
- May belong to coach, facility, and court.

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

### Super Admin

Can:

- Create and manage clubs.
- View cross-club health and revenue.
- Access club settings for support.
- Manage platform-level configuration.

Cannot:

- Impersonate users without audit logging.

### Club Admin

Can:

- Manage club settings, branding, rules, facilities, courts, and pricing.
- Manage members, families, coaches, staff, memberships, bookings, programs, payments, and messages.
- View club reporting.

Cannot:

- Access other clubs.
- Change Beeooking platform configuration.

### Staff

Can:

- Manage assigned operational workflows such as check-in, bookings, registrations, and member support.

Cannot:

- Change billing configuration or role permissions unless explicitly granted.

### Coach

Can:

- View assigned programs, sessions, and participants.
- Manage availability if permitted.
- View relevant member contact and guardian information.

Cannot:

- View full club financials.
- Manage club-wide settings.

### Parent

Can:

- Manage own profile.
- Manage child profiles in their family.
- Sign waivers for children.
- Book, register, and pay for children.
- Receive child-related communications.

Cannot:

- Access unrelated child/member records.

### Member

Can:

- Manage own profile.
- Book courts and eligible programs.
- View own bookings, payments, and messages.

Cannot:

- Manage other users unless linked as guardian or billing owner.

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
