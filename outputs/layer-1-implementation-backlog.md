# Beeooking Layer 1 Implementation Backlog

## Sprint 0: Platform Architecture & Data Model

Goal: Establish the technical foundation for a multi-club SaaS platform.

Stories:

- Define global users, club-scoped user access, and grouped member/family records.
- Define role assignments for Super Admin, Club Admin, Staff, Coach, Parent, and Member.
- Define club, facility, court, family, waiver, membership, booking, payment, and message entities.
- Define tenant scoping rules for every club-owned object.
- Define initial booking conflict rules.
- Define Stripe object mapping for customers, subscriptions, payments, invoices, and refunds.
- Create seed data for one sample club.

Acceptance criteria:

- All operational records include `club_id`.
- Users can have different roles in different clubs.
- Club-scoped queries require `club_id`.
- Super Admin access is explicitly separated from club roles.
- Initial schema can support Sprint 1 without structural rework.

## Sprint 1: Foundation

Goal: Launch the identity, roles, family, profile, and waiver foundation.

Stories:

- As a user, I can create an account and log in.
- As a club admin, I can invite members, parents, coaches, staff, and admins.
- As a club admin, I can assign club-specific roles.
- As a parent, I can add and manage dependent child profiles after my adult account exists.
- As a parent, I can sign waivers for my children.
- As a member, I can manage my own profile.
- As a club admin, I can view waiver completion status.

Acceptance criteria:

- Authentication works for all user types.
- A user can belong to multiple clubs.
- Members and family members are managed together in one dashboard area.
- Family groups support adults, dependent children, guardians, and billing owner.
- Waivers are versioned and linked to signer and subject.
- Club admins cannot access records from another club.

## Sprint 2: Membership System

Goal: Let clubs configure and sell memberships.

Stories:

- As a club admin, I can create monthly, annual, junior, and family membership plans.
- As a club admin, I can define membership privileges.
- As a parent or member, I can purchase a membership.
- As a club admin, I can view active, expired, canceled, and past-due memberships.
- As a system, I can handle renewals and membership status updates.

Acceptance criteria:

- Membership plans support pricing, billing interval, eligibility, and privileges.
- Memberships can be owned by a user or family.
- Membership status is updated from payment/subscription events.
- Members with inactive memberships are restricted according to club rules.

## Sprint 3: Booking Engine

Goal: Let members reserve courts and book coaches, clinics, and waitlists.

Stories:

- As a club admin, I can configure facilities, courts, and booking rules.
- As a member, I can reserve an available court.
- As a member, I can book an available coach.
- As a member or parent, I can register for a clinic.
- As a member or parent, I can join a waitlist when capacity is full.
- As a club admin, I can view and manage bookings.

Acceptance criteria:

- Courts and coaches cannot be double-booked.
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
- Sessions can be attached to courts and coaches.
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
- As a club admin, I can view booking volume and court utilization.
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
6. Build admin CRUD for clubs, facilities, courts, users, families, and waivers.
7. Build membership plan and membership flows.
8. Build booking availability and conflict prevention.
9. Connect Stripe.
10. Build communications and dashboard.
