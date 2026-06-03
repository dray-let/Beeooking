# Layer 1 Sprint 1 Build Spec: Foundation

## Goal

Build the operational foundation for Beeooking's Club Operating System. Sprint 1 should establish authentication, club-scoped roles, user profiles, family accounts, waivers, and emergency contacts.

## Scope

Sprint 1 includes:

- Authentication readiness.
- Club context.
- Role assignment.
- Member, parent, coach, staff, and admin profiles.
- Family account creation.
- Parent-child relationships.
- Emergency contacts.
- Waiver templates and signatures.
- Required waiver enforcement before bookings, program registrations, and participation.

Sprint 1 excludes:

- Membership billing.
- Stripe payment flows.
- Court booking rules.
- Program registration.
- Communications delivery.
- Player development, competition, AI, and integrations.

## Primary User Stories

### Club Admin

- As a club admin, I can invite a user to my club.
- As a club admin, I can assign a role to a user within my club.
- As a club admin, I can create and edit member profiles.
- As a club admin, I can create family accounts.
- As a club admin, I can view waiver completion status.
- As a club admin, I can see which users are blocked because required waivers are incomplete.
- As a club admin, I can view emergency contact information.

### Parent

- As a parent, I can manage my own profile.
- As a parent, I can create or manage child profiles in my family.
- As a parent, I can sign waivers for my children.
- As a parent, I cannot register a child for club activity until required waivers are complete.
- As a parent, I can add emergency contacts.

### Member

- As a member, I can manage my own profile.
- As a member, I can view my waiver status.
- As a member, I cannot book or participate until required waivers are complete.
- As a member, I can add emergency contacts.

### Coach

- As a coach, I can manage my own profile.
- As a coach, I can view permitted participant profile and emergency information.

## Data Objects In Scope

- `clubs`
- `users`
- `club_users`
- `role_assignments`
- `families`
- `family_members`
- `emergency_contacts`
- `waivers`
- `waiver_signatures`

## Permission Rules

- Every operational record must be scoped by `club_id`.
- Club admins can manage users only within their club.
- Parents can manage only children linked through `family_members`.
- Coaches can view participant details only when permitted by club rules.
- Super admins can access cross-club records only through audited support workflows.

## Acceptance Criteria

- A user can belong to more than one club.
- A user can have different roles in different clubs.
- A club admin cannot access another club's users, families, waivers, or emergency contacts.
- A family can include multiple adults and children.
- A guardian can sign a waiver for a child.
- Waiver signatures store waiver version, subject user, signer, timestamp, and status.
- Required waivers block court booking, coach booking, clinic/camp/course registration, and session participation until completed.
- Emergency contacts are linked to a user and club.
- The UI makes the active club context clear.

## Suggested Screens

- Club admin member directory.
- User profile detail.
- Family account detail.
- Waiver template list.
- Waiver completion report.
- Waiver-blocked users report.
- Emergency contact panel.
- Role assignment panel.

## Suggested API Endpoints

- `GET /api/layer-1`
- `GET /api/clubs/:clubId/users`
- `POST /api/clubs/:clubId/invitations`
- `PATCH /api/clubs/:clubId/users/:userId/roles`
- `GET /api/clubs/:clubId/families`
- `POST /api/clubs/:clubId/families`
- `POST /api/clubs/:clubId/waiver-signatures`
- `POST /api/clubs/:clubId/emergency-contacts`

## Open Decisions

- Authentication provider: Clerk, Supabase Auth, Auth0, or custom.
- Whether parent-created child profiles require admin approval.
- Whether coaches can view emergency contacts by default or only for assigned sessions.
- Whether family billing owner is required in Sprint 1 or Sprint 2.

## Recommended Next Build Step

Create a minimal admin shell with:

1. Active club context.
2. Member directory.
3. Role assignment.
4. Family detail.
5. Waiver status.
6. Emergency contacts.

## Mandatory Waiver Rule

Required waivers must be completed before a member, parent-managed child, or participant can:

- Book a court.
- Book a coach.
- Register for a clinic, camp, course, or program.
- Attend a scheduled session.

The system should preserve the reason a user is blocked, expose the missing waiver to the user or parent, and give club admins a report of incomplete required waivers.
