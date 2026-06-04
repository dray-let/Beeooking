-- Beeooking Sprint 0 sample seed data.
-- Deterministic UUIDs are used so demos and tests can reference the same records.

insert into clubs (
  id,
  name,
  slug,
  timezone,
  status,
  brand_config,
  activity_config,
  organization_email_domain,
  staff_email_domain_required
) values (
  '00000000-0000-4000-8000-000000000001',
  'Beeooking Demo Club',
  'beeooking-demo',
  'America/New_York',
  'setup',
  '{"primaryColor":"#f6c744","logoText":"Beeooking Demo Club"}',
  '{"peakWindows":[{"days":["mon","tue","wed","thu","fri"],"startsAt":"17:00","endsAt":"21:00"}],"staffAdvanceBookingDays":365}',
  'beeooking.com',
  true
);

insert into facilities (
  id,
  club_id,
  name,
  address,
  timezone
) values (
  '00000000-0000-4000-8000-000000000010',
  '00000000-0000-4000-8000-000000000001',
  'Main Facility',
  '{"line1":"1 Club Way","city":"Demo City","region":"NY","country":"US"}',
  'America/New_York'
);

insert into club_activities (
  id,
  club_id,
  name,
  activity_type,
  resource_unit,
  resource_count
) values
  ('00000000-0000-4000-8000-000000000101', '00000000-0000-4000-8000-000000000001', 'Squash', 'squash', 'court', 4),
  ('00000000-0000-4000-8000-000000000102', '00000000-0000-4000-8000-000000000001', 'Tennis', 'tennis', 'court', 3),
  ('00000000-0000-4000-8000-000000000103', '00000000-0000-4000-8000-000000000001', 'Swimming', 'swimming', 'lane', 6),
  ('00000000-0000-4000-8000-000000000104', '00000000-0000-4000-8000-000000000001', 'Fitness', 'fitness', 'studio', 2),
  ('00000000-0000-4000-8000-000000000105', '00000000-0000-4000-8000-000000000001', 'Health/Recovery', 'health', 'room', 3);

insert into bookable_resources (
  id,
  club_id,
  club_activity_id,
  facility_id,
  name,
  activity_type,
  resource_unit,
  booking_rules
) values
  ('00000000-0000-4000-8000-000000001001', '00000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000101', '00000000-0000-4000-8000-000000000010', 'Squash Court 1', 'squash', 'court', '{"peakBookingLimit":2}'),
  ('00000000-0000-4000-8000-000000001002', '00000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000101', '00000000-0000-4000-8000-000000000010', 'Squash Court 2', 'squash', 'court', '{"peakBookingLimit":2}'),
  ('00000000-0000-4000-8000-000000001003', '00000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000101', '00000000-0000-4000-8000-000000000010', 'Squash Court 3', 'squash', 'court', '{"peakBookingLimit":2}'),
  ('00000000-0000-4000-8000-000000001004', '00000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000101', '00000000-0000-4000-8000-000000000010', 'Squash Court 4', 'squash', 'court', '{"peakBookingLimit":2}'),
  ('00000000-0000-4000-8000-000000001101', '00000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000102', '00000000-0000-4000-8000-000000000010', 'Tennis Court 1', 'tennis', 'court', '{"peakBookingLimit":2}'),
  ('00000000-0000-4000-8000-000000001102', '00000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000102', '00000000-0000-4000-8000-000000000010', 'Tennis Court 2', 'tennis', 'court', '{"peakBookingLimit":2}'),
  ('00000000-0000-4000-8000-000000001103', '00000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000102', '00000000-0000-4000-8000-000000000010', 'Tennis Court 3', 'tennis', 'court', '{"peakBookingLimit":2}'),
  ('00000000-0000-4000-8000-000000001201', '00000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000103', '00000000-0000-4000-8000-000000000010', 'Swimming Lane 1', 'swimming', 'lane', '{}'),
  ('00000000-0000-4000-8000-000000001202', '00000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000103', '00000000-0000-4000-8000-000000000010', 'Swimming Lane 2', 'swimming', 'lane', '{}'),
  ('00000000-0000-4000-8000-000000001203', '00000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000103', '00000000-0000-4000-8000-000000000010', 'Swimming Lane 3', 'swimming', 'lane', '{}'),
  ('00000000-0000-4000-8000-000000001204', '00000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000103', '00000000-0000-4000-8000-000000000010', 'Swimming Lane 4', 'swimming', 'lane', '{}'),
  ('00000000-0000-4000-8000-000000001205', '00000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000103', '00000000-0000-4000-8000-000000000010', 'Swimming Lane 5', 'swimming', 'lane', '{}'),
  ('00000000-0000-4000-8000-000000001206', '00000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000103', '00000000-0000-4000-8000-000000000010', 'Swimming Lane 6', 'swimming', 'lane', '{}'),
  ('00000000-0000-4000-8000-000000001301', '00000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000104', '00000000-0000-4000-8000-000000000010', 'Fitness Studio 1', 'fitness', 'studio', '{}'),
  ('00000000-0000-4000-8000-000000001302', '00000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000104', '00000000-0000-4000-8000-000000000010', 'Fitness Studio 2', 'fitness', 'studio', '{}'),
  ('00000000-0000-4000-8000-000000001401', '00000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000105', '00000000-0000-4000-8000-000000000010', 'Recovery Room 1', 'health', 'room', '{"memberDiscountPercent":40}'),
  ('00000000-0000-4000-8000-000000001402', '00000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000105', '00000000-0000-4000-8000-000000000010', 'Recovery Room 2', 'health', 'room', '{"memberDiscountPercent":40}'),
  ('00000000-0000-4000-8000-000000001403', '00000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000105', '00000000-0000-4000-8000-000000000010', 'Recovery Room 3', 'health', 'room', '{"memberDiscountPercent":40}');

insert into users (
  id,
  email,
  first_name,
  last_name,
  date_of_birth
) values
  ('00000000-0000-4000-8000-000000010001', 'super@beeooking.com', 'Super', 'Admin', '1980-01-01'),
  ('00000000-0000-4000-8000-000000010002', 'clubadmin@beeooking.com', 'Club', 'Admin', '1982-02-02'),
  ('00000000-0000-4000-8000-000000010003', 'staff@beeooking.com', 'Front', 'Desk', '1990-03-03'),
  ('00000000-0000-4000-8000-000000010004', 'coach@beeooking.com', 'Demo', 'Coach', '1988-04-04'),
  ('00000000-0000-4000-8000-000000010005', 'parent@example.com', 'Demo', 'Parent', '1985-05-05'),
  ('00000000-0000-4000-8000-000000010006', 'junior@example.com', 'Demo', 'Junior', '2014-06-06'),
  ('00000000-0000-4000-8000-000000010007', 'nonmember@example.com', 'Demo', 'Guest', '1995-07-07');

insert into club_users (
  id,
  club_id,
  user_id,
  member_number,
  status
) values
  ('00000000-0000-4000-8000-000000020001', '00000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000010001', 'SA-001', 'active'),
  ('00000000-0000-4000-8000-000000020002', '00000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000010002', 'CA-001', 'active'),
  ('00000000-0000-4000-8000-000000020003', '00000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000010003', 'ST-001', 'active'),
  ('00000000-0000-4000-8000-000000020004', '00000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000010004', 'CO-001', 'active'),
  ('00000000-0000-4000-8000-000000020005', '00000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000010005', 'PA-001', 'active'),
  ('00000000-0000-4000-8000-000000020006', '00000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000010006', 'JM-001', 'active'),
  ('00000000-0000-4000-8000-000000020007', '00000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000010007', 'NM-001', 'active');

insert into role_assignments (
  id,
  club_id,
  user_id,
  role,
  permissions,
  validation_metadata
) values
  ('00000000-0000-4000-8000-000000030001', null, '00000000-0000-4000-8000-000000010001', 'super_admin', '{"grant_club_admin":true,"edit_core_pricing":true,"edit_payment_structure":true}', '{"domain":"beeooking.com","passed":true}'),
  ('00000000-0000-4000-8000-000000030002', '00000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000010002', 'club_admin', '{"manage_staff_onboarding":true,"manage_timetables":true,"view_staff_coach_payroll":true}', '{"domain":"beeooking.com","passed":true}'),
  ('00000000-0000-4000-8000-000000030003', '00000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000010003', 'staff', '{"book_for_others":true,"book_12_months_ahead":true,"apply_credit":true,"credit_limit_cents":5000}', '{"domain":"beeooking.com","passed":true}'),
  ('00000000-0000-4000-8000-000000030004', '00000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000010004', 'coach', '{"view_own_payments":true,"manage_registers":"own_sessions","manage_public_coach_profile":"own"}', '{"domain":"beeooking.com","passed":true}'),
  ('00000000-0000-4000-8000-000000030005', '00000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000010005', 'parent', '{"sign_family_waiver":true}', '{"domain":"personal","passed":true}'),
  ('00000000-0000-4000-8000-000000030006', '00000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000010006', 'member', '{"book_own":true}', '{"domain":"personal","passed":true}'),
  ('00000000-0000-4000-8000-000000030007', '00000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000010007', 'non_member', '{"book_at_non_member_rate":true}', '{"domain":"personal","passed":true}');

insert into families (
  id,
  club_id,
  name,
  primary_contact_user_id,
  billing_owner_user_id
) values (
  '00000000-0000-4000-8000-000000040001',
  '00000000-0000-4000-8000-000000000001',
  'Demo Family',
  '00000000-0000-4000-8000-000000010005',
  '00000000-0000-4000-8000-000000010005'
);

insert into family_members (
  id,
  club_id,
  family_id,
  user_id,
  relationship,
  is_guardian
) values
  ('00000000-0000-4000-8000-000000040101', '00000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000040001', '00000000-0000-4000-8000-000000010005', 'parent', true),
  ('00000000-0000-4000-8000-000000040102', '00000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000040001', '00000000-0000-4000-8000-000000010006', 'child', false);

insert into waivers (
  id,
  club_id,
  name,
  version,
  body,
  default_coverage_scope,
  responsibility_statement
) values (
  '00000000-0000-4000-8000-000000050001',
  '00000000-0000-4000-8000-000000000001',
  'Family Participation Waiver',
  'v1',
  'The signer accepts responsibility for all listed family members participating in club activity.',
  'family',
  'Signer is responsible for all covered family members.'
);

insert into membership_plans (
  id,
  club_id,
  name,
  access_level,
  billing_interval,
  price_cents,
  eligibility_rules,
  pricing_rules,
  access_rules,
  rate_modifiers,
  privileges
) values
  ('00000000-0000-4000-8000-000000060001', '00000000-0000-4000-8000-000000000001', 'Base Member', 'base_member', 'monthly', 10000, '{}', '{"activeMemberCents":10000,"nonActiveMemberCents":2500}', '{"gymBarrierAccess":true}', '{"memberDiscountPercent":20}', '{"canSeeAllBookables":true}'),
  ('00000000-0000-4000-8000-000000060002', '00000000-0000-4000-8000-000000000001', 'Class Member', 'class_member', 'monthly', 14000, '{}', '{"activeMemberCents":14000}', '{"classesIncluded":true}', '{"memberDiscountPercent":20}', '{"canSeeRacketBookings":true}'),
  ('00000000-0000-4000-8000-000000060003', '00000000-0000-4000-8000-000000000001', 'Rackets Member', 'rackets_member', 'monthly', 16000, '{}', '{"activeMemberCents":16000}', '{"peakBookingLimit":2,"offPeakBookingLimit":null}', '{"memberDiscountPercent":20}', '{"courtAccessIncluded":true}'),
  ('00000000-0000-4000-8000-000000060004', '00000000-0000-4000-8000-000000000001', 'Health Member', 'health_member', 'monthly', 15000, '{}', '{"activeMemberCents":15000}', '{"recoverySuiteIncluded":true}', '{"massageDiscountPercent":40}', '{"healthBookingAccess":true}'),
  ('00000000-0000-4000-8000-000000060005', '00000000-0000-4000-8000-000000000001', 'Non Member Rate Card', 'non_member', 'none', 0, '{}', '{"rateType":"non_member"}', '{"canSeeAllBookables":true}', '{}', '{"requiresPaymentForBooking":true}');
