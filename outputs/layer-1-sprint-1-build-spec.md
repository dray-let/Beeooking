# Layer 1 Sprint 1 Build Spec: Foundation

## Goal

Build the operational foundation for Beeooking's Club Operating System. Sprint 1 should establish authentication, club-scoped roles, user profiles, family accounts, waivers, and emergency contacts.

## Scope

Sprint 1 includes:

- Authentication readiness.
- Club context.
- Role assignment.
- Member, parent, coach, staff, and admin profiles.
- Mandatory date-of-birth collection for every member profile.
- Member/family group management.
- Family membership composition rules.
- Dependent creation as a second-step adult workflow after initial login or invitation.
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
- As a club admin, I require date of birth for every member profile.
- As a club admin, I can manage members and family groups in one area.
- As a club admin, I can add a dependent to an existing adult account.
- As a club admin, I can enforce family membership composition: one main member, one spousal member, and additional members only if under 18.
- As a club admin, I can view waiver completion status.
- As a club admin, I can see which users are blocked because required waivers are incomplete.
- As a club admin, I can view emergency contact information.

### Parent

- As a parent, I can manage my own profile.
- As a parent, I enter date of birth for myself and each dependent child profile.
- As a parent, I can add dependent child profiles after my adult account is created.
- As a parent, I can manage child profiles in my family group.
- As a parent, I can sign one family waiver when the waiver states I am responsible for all listed family members.
- As a parent, I cannot register a child for club activity until required waivers are complete.
- As a parent, I can add emergency contacts.

### Member

- As a member, I can manage my own profile.
- As a member, I enter date of birth during profile setup.
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
- Members and family members are grouped together in one dashboard area.
- A dependent child is created after an adult account exists.
- A family membership can include one main member and one spousal member.
- Additional members on a family membership must be dependents under 18 years of age.
- A guardian can sign one waiver for a family when the waiver states the signer is responsible for all listed family members.
- Waiver signatures store waiver version, covered family or subject user, signer, timestamp, coverage scope, and status.
- Required waivers block court booking, coach booking, clinic/camp/course registration, and session participation until completed.
- Emergency contacts are linked to a user and club.
- The UI makes the active club context clear.
- Date of birth is required for every main member, spousal member, and dependent profile.
- Date of birth supports squash protective eyewear requirements, group age restrictions, and under-18 dependent validation.

## Suggested Screens

- Club admin member directory.
- User profile detail.
- Member & family detail.
- Add dependent flow.
- Waiver template list.
- Waiver completion report.
- Waiver-blocked users report.
- Emergency contact panel.
- Role assignment panel.
- Required date-of-birth field.

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
- Whether parent-created dependent profiles require admin approval.
- Whether coaches can view emergency contacts by default or only for assigned sessions.
- Whether family billing owner is required in Sprint 1 or Sprint 2.

## Mandatory Date-of-Birth Rule

Date of birth is required for every member profile.

Rules:

- Main member: date of birth is required.
- Spousal member: date of birth is required.
- Dependent profile: date of birth is required to verify under-18 family membership eligibility and group age rules.

The profile UI should explain that date of birth is used for squash protective eyewear requirements, group age restrictions, and family membership eligibility.

## Family Membership Composition Rule

Family memberships support:

- One main member.
- One spousal member.
- Additional members only if they are dependents under 18 years of age.

The system should block adding an additional non-spousal adult to a family membership.

## Recommended Next Build Step

Create a minimal admin shell with:

1. Active club context.
2. Member directory.
3. Role assignment.
4. Member & family detail.
5. Waiver status.
6. Emergency contacts.

## Mandatory Waiver Rule

Required waivers must be completed before a member, parent-managed child, or participant can:

- Book a court.
- Book a coach.
- Register for a clinic, camp, course, or program.
- Attend a scheduled session.

Family waivers can satisfy this gate for every listed family member when the waiver text states the signer is responsible for all covered members.

The system should preserve the reason a user or family is blocked, expose the missing waiver to the user or parent, and give club admins a report of incomplete required waivers.
