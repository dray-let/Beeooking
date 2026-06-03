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
- Adult accounts under age 19 missing date of birth.
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
- Date of birth is required only when the adult user is under age 19.

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
- Multiple adults and dependents are supported.
- Guardian permissions are explicit.
- Dependent profiles capture date of birth for eligibility, waiver, and junior-program rules.

### Complete Waiver

Steps:

1. Club admin creates active waiver template.
2. Parent or member signs waiver.
3. Signature stores waiver version.
4. Admin can view completion report.
5. System blocks booking, registration, and participation until required waiver is complete.

Acceptance criteria:

- Waiver signature links subject user and signer.
- Signed timestamp is stored.
- Historical waiver version is preserved.
- Required waiver completion is enforced before court booking, coach booking, program registration, and session participation.
- Admins can see users blocked by incomplete required waivers.

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
- Only needs to provide date of birth if under age 19.

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

Date of birth is conditional.

Adult accounts:

- Age 19 or older: date of birth is optional.
- Under age 19: date of birth is required.

Dependent profiles:

- Date of birth should be captured because junior eligibility, waivers, and program rules often depend on age.

The admin shell should surface adult accounts under age 19 that are missing date of birth.

## Required Waiver Enforcement

Waivers are a Layer 1 access gate, not just a document record.

The admin shell must show:

- Required waiver templates.
- Users missing required waivers.
- Family groups with dependents missing required waivers.
- Activities blocked by waiver status.
- Date and signer for completed waivers.

Blocked actions:

- Court booking.
- Coach booking.
- Clinic registration.
- Camp registration.
- Course registration.
- Session participation.
