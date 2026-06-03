# Beeooking Layer 1 PRD: Club Operating System

## Objective

Build the foundational operating system every club needs before sport-specific development, competition, integrations, or AI modules. Layer 1 should let a club manage members, families, memberships, bookings, payments, communications, and club-specific operating rules from one multi-tenant platform.

## MVP Definition

Layer 1 is successful when a club can:

- Invite and manage members, parents, coaches, staff, and admins.
- Group members and family members together, with dependents added after an adult account exists.
- Collect waivers, emergency contacts, and profile details.
- Require date of birth for every member profile.
- Support family membership composition of one main member, one spousal member, and dependents under 18.
- Let members choose active or non-active participants during membership setup, with club admin review before approval.
- Require members to contact the club admin to change active/non-active participation after membership type is approved.
- Require completed waivers before bookings, registrations, or participation.
- Sell and renew memberships.
- Configure membership privileges and booking rules.
- Manage facilities, courts, coaches, clinics, camps, and waitlists.
- Accept payments and issue refunds.
- Send club announcements and targeted messages.
- Operate with club-specific branding, pricing, rules, and staff.

## Target Users

- Super Admin: Beeooking internal operator who manages all clubs.
- Club Admin: Club operator who manages setup, members, programs, billing, and reporting.
- Staff: Front desk or operations user with delegated permissions.
- Coach: Coach who manages availability, sessions, attendance, and assigned programs.
- Parent: Adult account holder who manages children, waivers, bookings, and payments.
- Member: Player or participant who books courts, registers for programs, and receives communications.

## Core Modules

### 1. User Management

Capabilities:

- Authentication and login.
- Role-based permissions.
- Club-scoped user access.
- Members & families grouped together.
- Adult accounts first.
- Dependent profiles added after adult login or invitation.
- Parent-child/guardian relationships.
- Member profiles.
- Emergency contacts.
- Digital waivers.
- Staff and coach management.

Acceptance criteria:

- A user can belong to one or more clubs.
- Members and family members are managed in one grouped area, not separate dashboards.
- Date of birth is required for every main member, spousal member, and dependent profile.
- Date of birth supports squash protective eyewear requirements, group age restrictions, and family membership eligibility.
- A dependent child profile is created only after an adult account exists.
- A family membership can include one main member and one spousal member.
- Additional family membership members must be dependents under 18.
- A parent can manage child profiles, waivers, bookings, and payments.
- A club admin can assign roles within their club only.
- A coach can only see club data they are permitted to access.
- Every waiver stores status, signer, signed timestamp, and version.
- Required waivers block court booking, coach booking, program registration, and session participation until completed.

### 2. Membership Management

Capabilities:

- Monthly memberships.
- Annual memberships.
- Junior memberships.
- Family memberships.
- Active and non-active member pricing.
- Membership privileges.
- Renewal status.
- Member standing.

Acceptance criteria:

- A club admin can create membership plans with price, billing interval, and eligibility rules.
- A member or family can hold an active membership.
- A family membership enforces one main member, one spousal member, and additional members only under age 18.
- A family membership can contain active and non-active participants.
- Pricing is calculated by participant status, so an adult can be non-active while a child on the same family membership is active.
- Non-active members can remain account holders, guardians, billing owners, waiver signers, and communication recipients without active playing privileges.
- Members or parents can choose active/non-active status for each participant during membership setup.
- Club admins review participant status, pricing, and membership type before final approval.
- Once the membership type is approved, participants cannot self-change active/non-active status and must contact the club admin.
- Membership privileges can control booking limits, court access, pricing, and registration eligibility.
- The system can identify active, past due, canceled, and expired memberships.

### 3. Booking Engine

Capabilities:

- Court reservations.
- Coach bookings.
- Clinic bookings.
- Camp registration.
- Waitlists.
- Rule-based availability.

Acceptance criteria:

- A club admin can configure facilities, courts, operating hours, and booking rules.
- A member can book an available court if their membership privileges allow it.
- A member can only book after all required waivers are complete.
- A member can book a coach session when the coach is available.
- A member can register for clinics and camps with capacity limits.
- A parent can only register a child for clinics and camps after required child waivers are complete.
- A member can join a waitlist when a court, clinic, or camp is full.
- The system prevents double-booking for courts, coaches, and program sessions.

### 4. Payments

Capabilities:

- Membership billing.
- Packages.
- Clinics.
- Camps.
- Private lessons.
- Refunds.
- Stripe integration.

Acceptance criteria:

- A club can connect Stripe or use a Beeooking-managed billing setup.
- A member can pay for memberships, bookings, clinics, camps, and private lessons.
- Payment records link to the object being purchased.
- Refund records link to the original payment.
- The system tracks invoice/payment status separately from membership status.

### 5. Communications

Capabilities:

- Email.
- SMS.
- Push notifications.
- Club announcements.
- Groups.

Acceptance criteria:

- A club admin can send announcements to all members or selected groups.
- A coach can message assigned program participants if permitted.
- Parents receive communications for child participants.
- Messages track channel, recipient, delivery status, and related club.
- Users can have communication preferences.

### 6. Multi-Club Architecture

Capabilities:

- Club-specific branding.
- Club-specific pricing.
- Club-specific rules.
- Club-specific coaches.
- Multi-tenant data partitioning.

Acceptance criteria:

- Every operational record belongs to a club.
- Club admins cannot access another club's data.
- Super admins can access cross-club data.
- Pricing, rules, branding, facilities, programs, and coaches are club-specific.
- Shared user identities can have different roles at different clubs.

## Non-Goals For Layer 1

- AI recommendations.
- ClubLocker analytics.
- Player development dashboards.
- Ladders, challenges, and tournaments.
- Advanced coach report cards.
- Public marketplace for clubs.

## Key Product Risks

- Family permissions can become complicated if not modeled clearly.
- Membership privileges must be flexible without becoming an unmaintainable rules engine.
- Booking rules need to cover real club operations without delaying the MVP.
- Stripe integration should not be tightly coupled to only one future billing model.
- Multi-tenant isolation must be designed before any feature work.

## Recommended Layer 1 MVP Cut

Build in this order:

1. Multi-tenant architecture and roles.
2. Club, facility, court, user, family, waiver, and profile foundations.
3. Membership plans and active memberships.
4. Booking engine for courts and programs.
5. Stripe payments and refunds.
6. Communications and admin reporting.
