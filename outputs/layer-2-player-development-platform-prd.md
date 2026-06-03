# Beeooking Layer 2 PRD: Player Development Platform

## Objective

Build the optional player-development layer that clubs can enable after the Layer 1 operating system is in place. Layer 2 helps coaches, players, and parents understand player goals, session feedback, skill progress, and recommended next steps.

## Product Positioning

Layer 1 helps clubs operate.

Layer 2 helps clubs develop players.

This layer should feel like a natural extension of bookings, programs, coaches, attendance, and family access. It should not require clubs to run a separate coaching system.

## MVP Definition

Layer 2 is successful when a club can:

- Enable player development features at the club level.
- Let coaches write private or shareable session notes.
- Track goals for players.
- Assess skills using club-defined templates.
- Generate report cards for players and parents.
- Show player progress over time.
- Give parents controlled visibility into junior development.
- Connect development records back to sessions, bookings, programs, and coaches.

## Target Users

- Club Admin: Configures development module, templates, permissions, and reporting.
- Coach: Records notes, assessments, goals, and report card input.
- Parent: Views child progress, coach feedback, goals, and report cards when shared.
- Member/Player: Views own goals, feedback, progress, and recommendations.
- Super Admin: Supports module configuration across clubs.

## Core Modules

### 1. Development Module Settings

Capabilities:

- Club-level enablement.
- Sport-specific development templates.
- Coach visibility rules.
- Parent/player sharing rules.
- Assessment scale configuration.
- Report card publishing rules.

Acceptance criteria:

- A club admin can enable or disable Layer 2 for a club.
- A club can configure different assessment templates by sport or program type.
- A club can decide whether notes are private, coach-team visible, parent visible, or player visible.
- A club can define who can publish report cards.

### 2. Coach Feedback

Capabilities:

- Session-linked feedback.
- Booking-linked feedback.
- Program-linked feedback.
- Private coach notes.
- Shared parent/player feedback.
- Action items.

Acceptance criteria:

- A coach can create feedback for a player after a session, booking, or program.
- Feedback can be marked private or shared.
- Parents can only see shared feedback for children they are authorized to manage.
- Players can only see their own shared feedback.
- Club admins can audit feedback activity within their club.

### 3. Session Notes

Capabilities:

- Coach session notes.
- Player-specific notes.
- Group session summaries.
- Attendance-aware note creation.
- Follow-up recommendations.

Acceptance criteria:

- A coach can add notes to a session they are assigned to.
- A coach can add individual notes for each participant.
- Notes can reference Layer 1 sessions, bookings, and program registrations.
- Notes preserve author, visibility, timestamp, and related player.

### 4. Goal Tracking

Capabilities:

- Player goals.
- Coach-created goals.
- Player/parent-created goals if enabled.
- Milestones.
- Target dates.
- Status updates.

Acceptance criteria:

- A coach can create goals for a player.
- A player can view active and completed goals.
- A parent can view child goals when shared.
- Goals can be linked to skills, programs, sessions, or report cards.
- Goal history is preserved when a goal changes status.

### 5. Skill Assessments

Capabilities:

- Club-defined skill templates.
- Sport-specific skills.
- Rating scales.
- Assessment snapshots.
- Coach comments.
- Historical comparisons.

Acceptance criteria:

- A club admin can create skill categories and criteria.
- A coach can assess a player using an active template.
- Assessments capture a snapshot of scores and comments at the time of assessment.
- Progress dashboards can compare assessment results over time.
- Clubs can disable old templates without deleting historical assessments.

### 6. Report Cards

Capabilities:

- Report card templates.
- Coach-written summaries.
- Skill assessment inclusion.
- Goal progress inclusion.
- Publish workflow.
- Parent/player access.

Acceptance criteria:

- A coach can draft a report card for a player.
- A report card can include goals, skill scores, attendance, and session notes.
- A report card is not visible to parents or players until published.
- Published report cards preserve their content as a snapshot.
- Club admins can view report card status across players.

### 7. Progress Dashboards

Capabilities:

- Player profile development summary.
- Goal status summary.
- Skill trend charts.
- Attendance context.
- Recent coach feedback.
- Report card timeline.

Acceptance criteria:

- Coaches can view development dashboards for players they are allowed to coach.
- Parents can view dashboards for their children if the club enables parent access.
- Players can view their own dashboard if the club enables player access.
- Dashboards are scoped by club and never mix records from different clubs.

## Non-Goals For Layer 2

- AI-generated coaching recommendations.
- Match/opponent recommendations.
- Tournament ladders and competition management.
- ClubLocker analytics ingestion.
- Automatic video analysis.
- Medical, injury, or health diagnosis.

## Layer 2 Dependencies

Layer 2 depends on these Layer 1 objects:

- `clubs`
- `users`
- `club_users`
- `families`
- `family_members`
- `coaches`
- `programs`
- `sessions`
- `bookings`
- `program_registrations`
- `attendance_records`

## Product Risks

- Parents may expect full transparency, while coaches may need private working notes.
- Skill templates can become too complex if every club wants a bespoke rubric.
- Report cards need snapshot behavior so historical reports do not change when templates are edited.
- Coaches need fast workflows; note-taking cannot feel like admin overhead.
- Player development data is sensitive and must respect club, family, and role permissions.

## Recommended Layer 2 MVP Cut

Build in this order:

1. Club development module settings.
2. Player development profiles.
3. Coach notes and feedback linked to Layer 1 sessions/bookings.
4. Goals and milestones.
5. Skill assessment templates and assessments.
6. Report card drafts and publishing.
7. Progress dashboard.

