# Layer 1 Admin Shell Requirements

## Purpose

Define the first usable Club Admin surface for Beeooking's Layer 1 Club Operating System. This should become the operational home for club setup, members and family groups, waivers, emergency contacts, and role management.

## First Screen: Club Admin Home

The admin home should show:

- Active club context.
- Member count.
- Member/family group count.
- Coach/staff/admin count.
- Waiver completion rate.
- Waiver-blocked users.
- Missing emergency contacts.
- Member profiles missing date of birth.
- Recent invited users.
- Setup checklist.

## Navigation

Primary navigation:

- Dashboard
- Members & Families
- Coaches & Staff
- Waivers
- Emergency Contacts
- Club Settings

Future Layer 1 navigation:

- Memberships
- Bookings
- Programs
- Payments
- Communications
- Reports

## Core Workflows

### Invite User

Steps:

1. Club admin enters email.
2. Club admin selects role.
3. Club admin optionally assigns family relationship.
4. User receives invitation.
5. User completes profile.

Acceptance criteria:

- Invitation is scoped to a club.
- Role assignment is scoped to a club.
- A user can later belong to multiple clubs.
- Date of birth is required for every member profile.

### Add Dependents To Adult Account

Steps:

1. Adult account is created during initial login, registration, or admin invitation.
2. Adult opens their member/family profile.
3. Adult or club admin adds a dependent child.
4. Adult is marked as guardian for the dependent.
5. Club admin can set primary contact and billing owner if known.

Acceptance criteria:

- Members and family members are managed in one dashboard area.
- Adding a child is a second-step workflow after adult account creation.
- Family group belongs to one club.
- Family memberships support one main member and one spousal member.
- Additional family membership members must be dependents under 18 years of age.
- Guardian permissions are explicit.
- Dependent profiles capture date of birth to verify under-18 family membership eligibility, squash protective eyewear requirements, and group age rules.

### Configure Membership Participation

Steps:

1. Member or parent chooses active or non-active status for each person during membership setup.
2. System calculates estimated pricing and privileges from participant status.
3. Club admin reviews every person attached to the membership.
4. Club admin approves or adjusts the final participant statuses and membership type.
5. System locks participant self-service changes after approval.

Acceptance criteria:

- Active/non-active status is stored per person on the membership.
- A main adult or spousal member can be non-active while a dependent child is active.
- Non-active adults can remain guardians, billing owners, waiver signers, and communication recipients.
- Active participants receive active-member pricing and privileges.
- Non-active participants do not receive active playing privileges unless club rules explicitly allow them.
- The admin shell shows the pricing impact of each participant status change before approval.
- Members and parents cannot self-change active/non-active status after the membership type is approved.
- After approval, participant status changes require contacting the club admin.

### Monthly Membership Opt-In And Opt-Out

Steps:

1. Member chooses an available monthly membership plan.
2. Member completes payment.
3. System activates the monthly membership according to club rules.
4. Member contacts the club admin when they want to opt out or cancel.

Acceptance criteria:

- Monthly membership opt-in is self-service when payment is completed.
- Monthly membership opt-out is not self-service.
- The admin shell clearly shows monthly membership opt-out requests for club admin review.
- Club admin can approve, schedule, or deny opt-out based on club policy.
- Payment status and membership status are tracked separately.

### Complete Waiver

Steps:

1. Club admin creates active waiver template.
2. Waiver states whether the signer is responsible for one person or all listed family members.
3. Parent, guardian, or member signs waiver.
4. Signature stores waiver version and coverage scope.
5. Admin can view completion report.
6. System blocks booking, registration, and participation until required waiver is complete.

Family waiver rule:

- One waiver can cover the full family when the waiver text states the signer is responsible for all listed family members.
- Family waiver completion applies to every family member covered by that waiver.
- If the waiver is not family-scoped, the system can require individual subject coverage.

Acceptance criteria:

- Waiver signature links signer and covered family or subject user.
- Coverage scope is stored as family, individual, or other club-defined scope.
- Signed timestamp is stored.
- Historical waiver version is preserved.
- Required waiver completion is enforced before court booking, coach booking, program registration, and session participation.
- Admins can see users and families blocked by incomplete required waivers.

### Add Emergency Contact

Steps:

1. Parent, member, or admin adds contact.
2. Contact is linked to the user and club.
3. Admin can mark primary contact.
4. Coach visibility follows club rules.

Acceptance criteria:

- Contacts do not leak across clubs.
- Coaches only see contacts for permitted participants.

## Data Requirements

Required tables:

- `clubs`
- `users`
- `club_users`
- `role_assignments`
- `families`
- `family_members`
- `waivers`
- `waiver_signatures`
- `emergency_contacts`

## Permission Requirements

Club Admin:

- Can manage users, families, waivers, and emergency contacts inside the active club.

Parent:

- Can manage children linked through family relationships.
- Can sign waivers for children.
- Cannot register children for club activity until required waivers are complete.

Member:

- Can manage own profile and emergency contacts.
- Must provide date of birth during profile setup.

Coach:

- Can view assigned participant details only when permitted.

Super Admin:

- Can support clubs through audited cross-club workflows.

## Build Priority

1. Active club context.
2. Member directory.
3. Role assignment.
4. Member & family detail.
5. Waiver status.
6. Emergency contact panel.
7. Setup checklist.

## Profile Field Rules

Date of birth is mandatory for all member profiles.

Rules:

- Main member: date of birth is required.
- Spousal member: date of birth is required.
- Dependent profile: date of birth is required because additional family membership members must be under 18 and group rules often depend on age.

The admin shell should surface any member profile that is missing date of birth.

## Family Membership Composition

Family memberships support:

- One main member.
- One spousal member.
- Additional members only if under 18 years of age.

The admin shell should block adding additional non-spousal adult members to a family membership.

## Required Waiver Enforcement

Waivers are a Layer 1 access gate, not just a document record.

The admin shell must show:

- Required waiver templates.
- Users missing required waivers.
- Family groups with dependents missing required waivers.
- Family waiver coverage and signer responsibility.
- Activities blocked by waiver status.
- Date and signer for completed waivers.

Blocked actions:

- Court booking.
- Coach booking.
- Clinic registration.
- Camp registration.
- Course registration.
- Session participation.
