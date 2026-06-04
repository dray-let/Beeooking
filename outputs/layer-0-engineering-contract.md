# Layer 0 Engineering Contract

## Purpose

This contract turns Sprint 0 into buildable rules for engineering, QA, and future product decisions. If implementation behavior conflicts with this contract, the contract wins unless Super Admin requirements are intentionally changed.

## Contract Status

- Scope: Layer 0 platform foundation for Beeooking.
- Applies to: Multi-tenant data model, permissions, onboarding, booking, pricing, waivers, audit logs, API behavior, seed data, and tests.
- Primary tenant key: `club_id`.
- Shared identity table: `users`.
- Club-specific access tables: `club_users`, `role_assignments`.

## Permission Contract

### Permission Keys

| Key | Meaning | Required guard |
| --- | --- | --- |
| `access_all_club_records` | Cross-club and full club record access. | Super Admin only for cross-club access. |
| `grant_club_admin` | Grant Club Admin role. | Super Admin only. |
| `manage_role_permissions` | Manage access levels for staff, coaches, and members. | Super Admin or Club Admin, but Club Admin cannot grant Club Admin. |
| `manage_staff_onboarding` | Invite, activate, suspend, or update staff accounts. | Organization email domain required. |
| `manage_coach_onboarding` | Invite, activate, suspend, or update coach accounts. | Organization email domain required. |
| `view_member_profile` | View member profile records. | Club-scoped, family-scoped, or own account scoped. |
| `edit_member_profile` | Edit member profile records. | Coach is explicitly excluded. |
| `edit_payment_structure` | Change payment processor settings, billing behavior, or payment configuration. | Super Admin only. |
| `edit_core_pricing` | Change base rates, member discounts, add-on prices, or non-member rates. | Super Admin only. |
| `view_staff_coach_payroll` | View payroll/payment visibility for all staff and coaches. | Super Admin and Club Admin only. |
| `view_own_payments` | View payments owed to the signed-in coach/staff user. | Filter by signed-in user. |
| `book_for_others` | Book on behalf of another member or non-member. | Super Admin, Club Admin, Staff. |
| `book_12_months_ahead` | Book up to 365 days ahead. | Super Admin, Club Admin, Staff. |
| `reserve_event_space` | Reserve spaces for events or under another user's name. | Super Admin, Club Admin. |
| `send_invoice` | Send or resend an invoice to a customer. | Super Admin, Club Admin, Staff. |
| `manage_customer_membership` | Update customer membership/admin-assisted membership state. | Super Admin, Club Admin, Staff. |
| `apply_credit` | Apply a customer credit. | Super Admin, Club Admin, Staff within `credit_limit_cents`. |
| `manage_timetables` | Manage coaching timetables. | Super Admin, Club Admin, coach own availability only. |
| `manage_registers` | Review and update attendance/registers. | Super Admin, Club Admin, Staff, coach own sessions only. |
| `add_walk_in_with_payment` | Add a walk-in to a lesson/clinic and charge saved details where available. | Super Admin, Club Admin, Staff, coach own sessions only. |
| `manage_public_coach_profile` | Update public coach profile. | Super Admin, Club Admin, coach own profile only. |
| `sign_family_waiver` | Sign waiver for linked family. | Adult guardian or billing owner only. |

### Permission Evaluation Order

1. Authenticate `user_id`.
2. Resolve active `club_id`.
3. Load `club_users` record for `club_id` and `user_id`.
4. Load all `role_assignments` for `club_id` plus global Super Admin assignment when present.
5. Reject if role email-domain validation is required and failed.
6. Check permission key.
7. Check object ownership or family relationship.
8. Check role-specific limit such as `credit_limit_cents` or own-session scope.
9. Log privileged action when required.

### Required Denials

- Club Admin trying to grant Club Admin: deny.
- Club Admin trying to edit core pricing/payment structure: deny.
- Staff applying credit above `credit_limit_cents`: deny.
- Coach editing member profile: deny.
- Coach viewing another coach/staff payment: deny.
- Parent accessing unrelated child: deny.
- Member editing another member outside family/guardian ownership: deny.

## Booking Rule Engine Contract

### Booking Decision Order

Every booking request must evaluate in this exact order:

1. Resolve club, booker, participant, resource, booking type, and time range.
2. Confirm `ends_at > starts_at`.
3. Confirm booker can act for participant.
4. Confirm participant can see the requested resource.
5. Confirm required waiver is complete for participant or family.
6. Confirm membership/access level permits the requested booking type.
7. Determine member, add-on, or non-member rate.
8. Check role/access booking horizon.
9. Check peak/off-peak rules.
10. Check active peak booking limit.
11. Check resource conflicts.
12. Check coach conflicts when coach-bound.
13. Check participant conflicts.
14. Create payment intent or invoice when payment is required.
15. Confirm booking only after payment succeeds or no payment is required.
16. Audit if the booking was made by staff/admin on behalf of another user.

### Booking Outcomes

| Failure | Required response code | Required error code |
| --- | --- | --- |
| Missing/invalid auth | `401` | `auth_required` |
| Wrong club or no club access | `403` | `club_access_denied` |
| Missing waiver | `409` | `waiver_required` |
| Not allowed for participant | `403` | `participant_access_denied` |
| Booking horizon exceeded | `409` | `booking_horizon_exceeded` |
| Peak booking limit exceeded | `409` | `peak_booking_limit_exceeded` |
| Resource conflict | `409` | `resource_unavailable` |
| Coach conflict | `409` | `coach_unavailable` |
| Payment required | `402` | `payment_required` |
| Payment failed | `402` | `payment_failed` |

### Booking Rule Examples

- Rackets Member with 2 active peak court bookings tries a third peak court booking: deny with `peak_booking_limit_exceeded`.
- Same Rackets Member books off-peak: allow if resource is available.
- Base Member books racket court: allow visibility and charge member rate unless plan grants included court access.
- Class Member books included class: allow without per-class payment when class access is included.
- Non Member books court: allow visibility, require non-member rate payment before confirmation.
- Staff books for a non-member 10 months ahead: allow when `book_12_months_ahead` is present.
- Parent books for linked child without family waiver: deny with `waiver_required`.
- Coach books a court under another coach's name: deny with `participant_access_denied`.

## Membership Pricing Contract

### Pricing Decision Order

1. Resolve participant and club.
2. Resolve active membership and membership plan.
3. Resolve participant `participation_status`.
4. Resolve plan `access_level`.
5. Apply participant pricing role.
6. Apply access-level inclusion rules.
7. Apply member or non-member rate modifiers.
8. Apply admin-approved overrides only when audit logged.
9. Return final price and explanation.

### Required Pricing Examples

| Scenario | Expected result |
| --- | --- |
| Non-active adult + active child on family membership | Adult charged non-active price; child charged active price; adult can remain guardian/billing owner. |
| Base Member court booking | Member can see court and pays member rate unless court access is included by add-on. |
| Class Member class booking | Class is included with no per-class payment. |
| Class Member racket booking | Member can see racket booking and pays member rate. |
| Rackets Member peak court booking | Included until active peak booking count reaches club limit, default 2. |
| Rackets Member off-peak booking | Included unless club sets an off-peak cap. |
| Health Member recovery suite booking | Included when plan access rule includes recovery suite. |
| Health Member massage booking | Apply admin-controlled health/massage discount. |
| Non Member booking | Can see all spaces and pays non-member rate. |

### Membership Locking Rules

- Before admin review: member/parent can select active and non-active participants.
- During admin review: Club Admin can approve/reject participant statuses and membership type.
- After approval: participant active/non-active status and membership type are locked for self-service.
- Monthly opt-in: allowed self-service after payment succeeds.
- Monthly opt-out: requires admin contact/review.

## Waiver Contract

### Waiver Completion Check

A participant is waiver-complete when one of these is true:

- The participant has a signed active waiver for the current waiver version.
- The participant belongs to a family with a signed active family waiver for the current waiver version, and the waiver states signer responsibility for all listed family members.

### Required Blocks

Until waiver-complete, block:

- Court, lane, studio, table, rink, room, health, and recovery bookings.
- Clinic, camp, course, class, lesson, and event registration.
- Waitlist entry.
- Session check-in.
- Coach/staff walk-in addition.

Allowed before waiver:

- Account creation.
- Family setup.
- Dependent creation.
- Membership selection.
- Viewing and signing waiver.
- Payment setup when club permits payment before activity.

## Data Security And RLS Contract

### Baseline RLS Rules

- Global `users`: user can read own identity; staff-side roles can read users only through club-scoped joins and permissions.
- Club-scoped tables: every query must filter by active `club_id`.
- Super Admin: can read across clubs only through audited Super Admin flows.
- Club Admin: can read/write club records except payment structure/core pricing.
- Staff: can read/write operational records inside club for permitted workflows.
- Coach: can read member profiles and own sessions/payments, but cannot edit member profiles or see other payroll.
- Parent: can read/write own profile and linked family/dependent records.
- Member: can read/write own profile, bookings, payments, and messages.
- Non Member: can read/write own profile, own bookings, own payments, and visible bookable inventory.

### Forbidden Data Access

- A club user must never read another club's records unless Super Admin.
- A coach must never read all payroll/payment records.
- A parent must never access unrelated child records.
- Staff credit application must never exceed stored permission limit.
- A role assignment must never bypass organization email-domain validation for staff-side roles.

## Audit Contract

### Required Audit Events

| Event | Action key |
| --- | --- |
| Grant Club Admin | `role.grant_club_admin` |
| Remove Club Admin | `role.remove_club_admin` |
| Change role permissions | `role.permissions_changed` |
| Change payment structure | `billing.payment_structure_changed` |
| Change core pricing | `pricing.core_changed` |
| Change membership type after approval | `membership.type_changed_after_lock` |
| Change active/non-active after approval | `membership.participant_status_changed_after_lock` |
| Apply customer credit | `billing.credit_applied` |
| Staff/admin booking on behalf | `booking.created_on_behalf` |
| Override staff account | `staff.account_overridden` |
| Override coach account | `coach.account_overridden` |
| User impersonation | `security.user_impersonated` |

Audit records must include `club_id` where applicable, actor, target, before/after data when possible, metadata, and timestamp.

## API Contract

### Standard Response Shape

Success:

```json
{
  "data": {},
  "meta": {
    "clubId": "00000000-0000-4000-8000-000000000001"
  }
}
```

Error:

```json
{
  "error": {
    "code": "waiver_required",
    "message": "Required waiver must be completed before booking.",
    "details": {}
  }
}
```

### Create Club

`POST /api/clubs`

Required permission: `access_all_club_records`.

```json
{
  "name": "Beeooking Demo Club",
  "slug": "beeooking-demo",
  "timezone": "America/New_York",
  "brandConfig": {
    "primaryColor": "#f6c744"
  }
}
```

### Save Activities And Resources

`PUT /api/clubs/:clubId/setup/activities`

Required permission: Super Admin setup.

```json
{
  "activities": [
    { "activityType": "squash", "resourceUnit": "court", "resourceCount": 4 },
    { "activityType": "swimming", "resourceUnit": "lane", "resourceCount": 6 },
    { "activityType": "fitness", "resourceUnit": "studio", "resourceCount": 2 }
  ]
}
```

### Save Organization Email Domain

`PUT /api/clubs/:clubId/setup/email-domain`

Required permission: Super Admin setup.

```json
{
  "organizationEmailDomain": "beeooking.com",
  "staffEmailDomainRequired": true
}
```

### Assign Role

`POST /api/clubs/:clubId/roles`

Required permission: `manage_role_permissions`; Club Admin assignment also requires `grant_club_admin`.

```json
{
  "userId": "00000000-0000-4000-8000-000000010003",
  "role": "staff",
  "permissions": {
    "book_for_others": true,
    "book_12_months_ahead": true,
    "apply_credit": true,
    "credit_limit_cents": 5000
  }
}
```

### Add Dependent

`POST /api/clubs/:clubId/families/:familyId/dependents`

Required permission: own family or `edit_member_profile`.

```json
{
  "firstName": "Demo",
  "lastName": "Junior",
  "dateOfBirth": "2014-06-06",
  "relationship": "child"
}
```

### Sign Family Waiver

`POST /api/clubs/:clubId/waivers/:waiverId/signatures`

Required permission: adult guardian or billing owner.

```json
{
  "coveredFamilyId": "00000000-0000-4000-8000-000000040001",
  "coverageScope": "family",
  "acceptedResponsibilityStatement": true
}
```

### Submit Membership

`POST /api/clubs/:clubId/memberships`

Required permission: own account/family or staff support.

```json
{
  "membershipPlanId": "00000000-0000-4000-8000-000000060001",
  "ownerType": "family",
  "ownerId": "00000000-0000-4000-8000-000000040001",
  "participants": [
    { "userId": "00000000-0000-4000-8000-000000010005", "participationStatus": "non_active", "pricingRole": "non_active_member" },
    { "userId": "00000000-0000-4000-8000-000000010006", "participationStatus": "active", "pricingRole": "junior" }
  ]
}
```

### Review Membership

`POST /api/clubs/:clubId/memberships/:membershipId/review`

Required permission: Club Admin.

```json
{
  "reviewStatus": "approved",
  "lockParticipantStatuses": true,
  "notes": "Approved active junior with non-active guardian."
}
```

### Create Booking

`POST /api/clubs/:clubId/bookings`

Required permission: booking permission by role/access.

```json
{
  "bookingType": "court",
  "bookedByUserId": "00000000-0000-4000-8000-000000010005",
  "participantUserId": "00000000-0000-4000-8000-000000010006",
  "resourceType": "bookable_resource",
  "resourceId": "00000000-0000-4000-8000-000000001001",
  "startsAt": "2026-06-10T22:00:00Z",
  "endsAt": "2026-06-10T23:00:00Z"
}
```

### Apply Credit

`POST /api/clubs/:clubId/credits`

Required permission: `apply_credit`; staff requires amount at or below `credit_limit_cents`.

```json
{
  "customerUserId": "00000000-0000-4000-8000-000000010007",
  "amountCents": 2500,
  "reason": "Front desk service recovery for duplicate charge."
}
```

## Test Contract

### Permission Tests

- Super Admin can grant Club Admin.
- Club Admin cannot grant Club Admin.
- Club Admin cannot edit payment structure or core pricing.
- Staff can apply credit at or below limit.
- Staff cannot apply credit above limit.
- Coach can view member profile.
- Coach cannot edit member profile.
- Coach can view own coaching payments.
- Coach cannot view another coach's payments.
- Parent can access linked child.
- Parent cannot access unrelated child.

### Booking Tests

- Booking fails when waiver is missing.
- Booking succeeds after valid family waiver.
- Rackets Member can hold 2 active peak bookings.
- Third active peak booking fails.
- Off-peak racket booking succeeds when available.
- Non Member booking requires payment.
- Resource cannot be double-booked.
- Staff can book on behalf within 365-day horizon.
- Member cannot book beyond configured horizon.

### Membership Tests

- Family membership allows non-active adult plus active child.
- Additional family member over 18 cannot be added as dependent.
- More than one spousal member is rejected.
- Active/non-active participant status locks after approval.
- Member can self-opt into monthly membership after payment.
- Monthly opt-out requires admin workflow.

### Waiver Tests

- Family waiver covers all listed family members when responsibility statement is accepted.
- New waiver version requires a new signature.
- Individual waiver covers only the subject user.
- Walk-in addition is blocked when waiver is missing.

### Tenant Isolation Tests

- Club Admin cannot read another club's members.
- Staff cannot read another club's bookings.
- Coach cannot see another club's sessions unless assigned there.
- Parent cannot see child records outside linked family.
- Super Admin cross-club access creates audit log.

## Definition Of Done For Layer 0

Layer 0 is implementation-ready when:

- This contract and the architecture document agree.
- Schema supports all required objects, indexes, audit logs, and seed data.
- API payload examples exist for core setup and operating flows.
- Permission, booking, membership, waiver, and tenant isolation tests are represented in the backlog.
- Sprint 1 implementation can begin without inventing new foundational rules.
