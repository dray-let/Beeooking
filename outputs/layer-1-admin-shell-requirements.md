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
- Super Admin, Club Admin, Staff, and Coach invitations must use the approved organization email domain.
- Parent and Member invitations may use personal email addresses unless the club config says otherwise.
- The invite flow blocks staff-side role assignment when the email domain does not match the approved organization domain.

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
- Can control staff, coach, and member access levels.
- Can edit member accounts.
- Can reserve spaces for event bookings or under other users' names.
- Can manage payroll and see payments for all staff and coaches.
- Can manage timetables for coaching staff.
- Can override coach accounts and staff accounts.
- Cannot edit payment structure or core pricing; only Super Admin can do that.

Staff:

- Can make bookings on behalf of members and non-members.
- Can book coaching on behalf of customers.
- Can edit club member accounts.
- Can book ahead up to 12 months when front desk access allows it.
- Can review and send customer invoices and payment records.
- Can upgrade and manage payment and membership on behalf of the customer.
- Can apply credits up to a Club Admin-defined limit to resolve customer issues.

Parent:

- Can manage children linked through family relationships.
- Can act on behalf of child accounts and receive all child notifications.
- Can see child payment information.
- Can switch back to their own non-member account for personal bookings.
- Can sign family waivers.
- Cannot register children for club activity until required waivers are complete.

Member:

- Can manage own profile and emergency contacts.
- Must provide date of birth during profile setup.
- Can see all bookable areas and pay member rates.

Coach:

- Can view assigned participant details and all member accounts but cannot edit member information.
- Can only see payments owed to them for lessons, clinics, and related coaching work.
- Cannot see other staff or coach payments.
- Can book their own lessons, clinics, and courts under their name.
- Can review registers and add walk-ins to clinics or lessons, triggering payment from customer details where available.
- Can edit availability and diary/calendar integration.
- Can modify their public coach profile.

Super Admin:

- Can support clubs through audited cross-club workflows.
- Can access all areas, contacts, profiles, accounts, pricing, timings, payments, and edits.
- Is the only role that can grant Club Admin access.
- Controls access rights for all other users.
- Controls onboarding for staff and coach accounts.
- Can set all pricing and payment structures.
- Must choose supported club activities as the first setup step.
- Must choose the approved organization email domain during club setup.
- Can enable racket sports: tennis, squash, padel, pickleball, table tennis, and badminton.
- Can optionally enable swimming, fitness, ice/rink, and multi-purpose room booking.
- Must use a scrollable activity menu to choose relevant activities.
- Must define how many courts, lanes, studios, rinks, tables, or rooms exist under each selected activity.

## Super Admin Club Setup

First setup step:

1. Open a scrollable activity menu with all supported sports and facility uses.
2. Click each relevant activity.
3. Enter resource counts for each selected activity.
4. Create the bookable resources generated from those counts.
5. Enter the approved organization email domain for Super Admin, Club Admin, Coach, and Staff accounts.
6. Hand off resource naming, schedules, and booking rules to club admin setup.

Activity options:

- Tennis: courts.
- Squash: courts.
- Padel: courts.
- Pickleball: courts.
- Table tennis: courts or tables.
- Badminton: courts.
- Swimming: lanes.
- Fitness: studios.
- Ice hockey or skating: rinks.
- Multi-purpose: rooms.

Organization email rule:

- Super Admin chooses one approved organization email domain during club setup.
- Super Admin, Club Admin, Coach, and Staff accounts must use that organization domain.
- Parents and members can use personal emails unless the club config requires otherwise.
- Staff-side role invites are blocked when the invited email does not match the approved domain.

## Build Priority

1. Super Admin activity and resource setup.
2. Active club context.
3. Member directory.
4. Role assignment.
5. Member & family detail.
6. Waiver status.
7. Emergency contact panel.
8. Setup checklist.

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
