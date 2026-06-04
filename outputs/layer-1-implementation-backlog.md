# Beeooking Layer 1 Implementation Backlog

## Sprint 0: Platform Architecture & Data Model

Goal: Establish the technical foundation for a multi-club SaaS platform.

Stories:

- Define Super Admin club setup for supported activities and resource counts.
- Define approved organization email domain setup for staff-side roles.
- Define global users, club-scoped user access, and grouped member/family records.
- Define role assignments for Super Admin, Club Admin, Staff, Coach, Parent, and Member.
- Define detailed role permissions for Super Admin, Club Admin, Staff, Coach, Parent, Member, and Non Member access.
- Define member access levels: Base Member, Class Member, Rackets Member, Health Member, Parent, and Non Member.
- Define exact permission action keys for pricing, admin grants, credits, booking for others, payroll visibility, profile access, timetables, registers, and coach profile management.
- Define club, facility, bookable resource, family, waiver, membership, booking, payment, and message entities.
- Define tenant scoping rules for every club-owned object.
- Define peak/off-peak rules, booking horizons, cancellation windows, and initial booking conflict rules.
- Define membership pricing logic for active/non-active participants, member/non-member rates, add-ons, and admin approval.
- Define waiver enforcement rules and activity blocks when waiver is incomplete.
- Define audit logging requirements for privileged actions and overrides.
- Define Sprint 0 API contract for setup, families, waivers, memberships, bookings, roles, and credits.
- Create Layer 0 engineering contract with permission keys, decision orders, API payloads, error codes, RLS expectations, audit events, and test cases.
- Define Stripe object mapping for customers, subscriptions, payments, invoices, and refunds.
- Create seed data for one sample club.

Acceptance criteria:

- All operational records include `club_id`.
- Super Admin must select club activities from a scrollable menu before bookable resources are created.
- Super Admin must choose the approved organization email domain for Super Admin, Club Admin, Coach, and Staff accounts.
- Activity options include tennis, squash, padel, pickleball, table tennis, badminton, swimming, fitness, ice/rink, and multi-purpose rooms.
- Each selected activity captures a resource count and resource unit: courts, lanes, tables, studios, rinks, or rooms.
- Users can have different roles in different clubs.
- Club-scoped queries require `club_id`.
- Super Admin access is explicitly separated from club roles.
- Super Admin, Club Admin, Coach, and Staff role assignments require an email from the approved organization domain.
- Only Super Admin can grant Club Admin access.
- Only Super Admin can edit core pricing and payment structure.
- Club Admin can manage staff, coaches, members, timetables, payroll visibility, event bookings, and operational overrides.
- Staff can manage bookings, invoices, customer memberships/payments, and credits within Club Admin limits.
- Coaches can view only their own payments and cannot edit member information.
- Booking rules include role horizons, peak/off-peak rules, racket peak booking limits, waiver gating, and resource conflict checks.
- Membership pricing supports active/non-active participants, member/non-member rates, add-ons, and admin locking after approval.
- Waivers block bookings, waitlists, registrations, check-ins, and walk-ins until complete.
- Audit logs are required for Club Admin grants, pricing/payment changes, credits, overrides, on-behalf bookings, and impersonation.
- API contracts exist before Sprint 1 implementation begins.
- API contracts include request examples, response shape, and error codes for required Layer 1 foundation flows.
- Test contract covers permissions, booking, membership, waiver, and tenant isolation behavior.
- Sample seed data exists for one demo club with sports, resources, roles, family, waiver, and membership plans.
- Initial schema can support Sprint 1 without structural rework.

## Sprint 1: Foundation

Goal: Launch the identity, roles, family, profile, and waiver foundation.

Stories:

- As a user, I can create an account and log in.
- As a club admin, I can invite members, parents, coaches, staff, and admins.
- As a club admin, I can assign club-specific roles.
- As a club admin, I cannot grant Club Admin access or edit payment structure.
- As staff, I can book on behalf of customers and apply credits within my configured limit.
- As a coach, I can manage availability, registers, walk-ins, and public profile while viewing only my own payments.
- As a parent, I can add and manage dependent child profiles after my adult account exists.
- As a parent, I can sign one family waiver when the waiver states I am responsible for all listed family members.
- As a member, I can manage my own profile.
- As a club admin, I can view waiver completion status.

Acceptance criteria:

- Authentication works for all user types.
- Staff-side role invites validate against the approved organization email domain.
- A user can belong to multiple clubs.
- Members and family members are managed together in one dashboard area.
- All member profiles require date of birth.
- Family memberships support one main member, one spousal member, dependent children under 18, guardians, and billing owner.
- One family waiver can cover every listed family member when the waiver text states signer responsibility for the full family.
- Waivers are versioned and linked to signer plus covered family or individual subject.
- Club admins cannot access records from another club.

## Sprint 2: Membership System

Goal: Let clubs configure and sell memberships.

Stories:

- As a club admin, I can create monthly, annual, junior, and family membership plans.
- As a club admin, I can define membership privileges.
- As a parent or member, I can choose who is active or non-active during membership setup.
- As a parent or member, I can purchase a membership.
- As a member, I can opt into monthly membership on my own by completing payment.
- As a member, I can request monthly membership opt-out by contacting the club admin.
- As a club admin, I can mark each person on a membership as active or non-active for pricing and privileges.
- As a club admin, I can review and approve the final membership type.
- As a club admin, I can view active, expired, canceled, and past-due memberships.
- As a system, I can handle renewals and membership status updates.

Acceptance criteria:

- Membership plans support pricing, billing interval, eligibility, and privileges.
- Membership plans support Base, Class, Rackets, Health, Parent-linked, and Non Member rate/access rules.
- Memberships can be owned by a user or family.
- Family memberships enforce one main member, one spousal member, and additional members only when under 18.
- Membership pricing is based on each participant's active or non-active status.
- A family membership can include a non-active adult and an active child.
- Club admin review is required before the membership type is finalized.
- Once finalized, active/non-active participant changes require club admin support.
- Monthly membership opt-in is self-service after payment.
- Monthly membership opt-out requires club admin review.
- Membership status is updated from payment/subscription events.
- Members with inactive memberships are restricted according to club rules.

## Sprint 3: Booking Engine

Goal: Let members reserve courts and book coaches, clinics, and waitlists.

Stories:

- As a club admin, I can configure facilities, bookable resources, and booking rules.
- As a club admin, I can configure bookable courts, lanes, tables, studios, rinks, and rooms created from selected activity types.
- As a member, I can reserve an available court.
- As a member, I can book an available coach.
- As a member or parent, I can register for a clinic.
- As a member or parent, I can join a waitlist when capacity is full.
- As a club admin, I can view and manage bookings.

Acceptance criteria:

- Courts, lanes, tables, studios, rinks, rooms, and coaches cannot be double-booked.
- Bookings respect club rules and membership privileges.
- Clinics enforce capacity.
- Waitlists track order and status.
- Parents can book for children in their family.

## Sprint 4: Program Management

Goal: Let clubs manage camps, clinics, courses, and attendance.

Stories:

- As a club admin, I can create clinics, camps, and courses.
- As a club admin, I can schedule sessions for programs.
- As a coach, I can view assigned program sessions.
- As a coach or staff member, I can record attendance.
- As a parent, I can register a child for eligible programs.

Acceptance criteria:

- Programs support type, sport, capacity, pricing, schedule, coach, and facility.
- Sessions can be attached to bookable resources and coaches.
- Attendance can be recorded per participant per session.
- Program registrations can connect to payments.

## Sprint 5: Communications

Goal: Let clubs communicate with targeted groups.

Stories:

- As a club admin, I can send announcements to all members.
- As a club admin, I can send targeted messages by role, membership, program, or family.
- As a coach, I can message assigned participants and parents.
- As a member or parent, I can manage communication preferences.

Acceptance criteria:

- Messages support email, SMS, and push-ready channels.
- Messages track recipients and delivery status.
- Parents receive child-related communications.
- Communication permissions are role-based.

## Sprint 6: Club Admin Dashboard

Goal: Give club operators visibility into operations and revenue.

Stories:

- As a club admin, I can view member counts and membership status.
- As a club admin, I can view booking volume and resource utilization.
- As a club admin, I can view program registrations.
- As a club admin, I can view revenue by product type.
- As a club admin, I can search and manage members.

Acceptance criteria:

- Dashboard is scoped to a single club.
- Revenue reporting separates memberships, bookings, clinics, camps, and lessons.
- Admins can navigate from reports to underlying records.
- Super Admin can view cross-club summary reporting.

## Initial Engineering Milestones

1. Create repository and application scaffold.
2. Add database schema and migrations.
3. Implement authentication provider.
4. Implement club context selector and tenant guard.
5. Implement role/permission checks.
6. Build admin CRUD for clubs, facilities, bookable resources, users, families, and waivers.
7. Build membership plan and membership flows.
8. Build booking availability and conflict prevention.
9. Connect Stripe.
10. Build communications and dashboard.
