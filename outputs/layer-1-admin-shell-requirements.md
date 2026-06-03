# Layer 1 Admin Shell Requirements

## Purpose

Define the first usable Club Admin surface for Beeooking's Layer 1 Club Operating System. This should become the operational home for club setup, users, family accounts, waivers, emergency contacts, and role management.

## First Screen: Club Admin Home

The admin home should show:

- Active club context.
- Member count.
- Family count.
- Coach/staff/admin count.
- Waiver completion rate.
- Missing emergency contacts.
- Recent invited users.
- Setup checklist.

## Navigation

Primary navigation:

- Dashboard
- Members
- Families
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

### Create Family

Steps:

1. Club admin creates family record.
2. Club admin adds adult guardian.
3. Club admin adds child member.
4. Club admin sets primary contact.
5. Club admin sets billing owner if known.

Acceptance criteria:

- Family belongs to one club.
- Multiple adults and children are supported.
- Guardian permissions are explicit.

### Complete Waiver

Steps:

1. Club admin creates active waiver template.
2. Parent or member signs waiver.
3. Signature stores waiver version.
4. Admin can view completion report.

Acceptance criteria:

- Waiver signature links subject user and signer.
- Signed timestamp is stored.
- Historical waiver version is preserved.

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

Member:

- Can manage own profile and emergency contacts.

Coach:

- Can view assigned participant details only when permitted.

Super Admin:

- Can support clubs through audited cross-club workflows.

## Build Priority

1. Active club context.
2. Member directory.
3. Role assignment.
4. Family detail.
5. Waiver status.
6. Emergency contact panel.
7. Setup checklist.

