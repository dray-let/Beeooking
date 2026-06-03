# Beeooking Layer 2 Implementation Backlog

## Layer 2 Sprint A: Development Module Setup

Goal: Let a club enable and configure player-development features.

Stories:

- As a club admin, I can enable or disable the development module.
- As a club admin, I can configure parent and player access.
- As a club admin, I can set default note visibility.
- As a club admin, I can define who may publish report cards.
- As a club admin, I can create player development profiles.

Acceptance criteria:

- Development settings are scoped to one club.
- Disabling Layer 2 hides development workflows without deleting data.
- Parent and player access can be configured independently.
- Player development profiles link to existing Layer 1 users.
- Primary coach assignment uses the existing Layer 1 coaches table.

## Layer 2 Sprint B: Coach Notes & Feedback

Goal: Let coaches record useful development feedback tied to real club activity.

Stories:

- As a coach, I can write a private note about a player.
- As a coach, I can write feedback that is visible to a parent or player.
- As a coach, I can link notes to a session, booking, program, or attendance record.
- As a club admin, I can audit coach feedback activity.
- As a parent, I can view shared feedback for my child.

Acceptance criteria:

- Notes preserve author, coach, player, related object, visibility, and timestamp.
- Coaches can only create notes for players they are allowed to coach.
- Private notes are not visible to parents or players.
- Parent access checks use family relationships from Layer 1.
- Feedback can be filtered by player, coach, date, and related activity.

## Layer 2 Sprint C: Goals & Milestones

Goal: Let coaches and players track development goals over time.

Stories:

- As a coach, I can create a goal for a player.
- As a coach, I can add progress updates to a goal.
- As a coach, I can mark a goal as active, paused, achieved, or archived.
- As a parent, I can view shared child goals.
- As a player, I can view my own shared goals.

Acceptance criteria:

- Goals are club-scoped and player-specific.
- Goal updates preserve status history.
- Goal visibility follows club settings and record-level visibility.
- Goals can be included in report cards.

## Layer 2 Sprint D: Skill Assessment Templates

Goal: Let clubs create sport-specific assessment rubrics.

Stories:

- As a club admin, I can create a skill template for a sport.
- As a club admin, I can define categories and criteria.
- As a club admin, I can publish or retire a template.
- As a coach, I can choose an active template when assessing a player.

Acceptance criteria:

- Templates are versioned by club.
- Retired templates cannot be used for new assessments.
- Historical assessments keep their template snapshot.
- Skill criteria have stable ordering.

## Layer 2 Sprint E: Skill Assessments

Goal: Let coaches assess players and track progress over time.

Stories:

- As a coach, I can complete an assessment for a player.
- As a coach, I can score each criterion and add comments.
- As a coach, I can compare a player's historical assessments.
- As a parent or player, I can view shared assessment results.

Acceptance criteria:

- Assessments link to player, coach, template, and club.
- Scores are stored separately from template criteria.
- Assessment snapshots survive template changes.
- Assessment trends can be queried by player and date.

## Layer 2 Sprint F: Report Cards

Goal: Let clubs create and publish development summaries.

Stories:

- As a club admin, I can create report card templates.
- As a coach, I can draft a report card for a player.
- As a coach, I can include goals, notes, attendance, and assessment results.
- As a coach or club admin, I can publish a report card.
- As a parent or player, I can view published report cards.

Acceptance criteria:

- Draft report cards are not visible to parents or players.
- Published report cards preserve a snapshot.
- Report cards can include structured items with source references.
- Report card visibility respects club settings and family permissions.

## Layer 2 Sprint G: Progress Dashboard

Goal: Give coaches, parents, and players a clear development view.

Stories:

- As a coach, I can view a player's development dashboard.
- As a parent, I can view my child's shared development dashboard.
- As a player, I can view my own shared development dashboard.
- As a club admin, I can view development activity across players.

Acceptance criteria:

- Dashboard includes recent notes, active goals, assessment trends, attendance context, and report card history.
- Dashboard data is scoped by club.
- Parent/player dashboards only include shared records.
- Coach dashboards include private coaching context when permitted.

## Initial Engineering Milestones

1. Add Layer 2 schema extension.
2. Add development settings admin screen.
3. Add player development profile screen.
4. Add coach notes and feedback workflow.
5. Add goal tracking workflow.
6. Add skill template builder.
7. Add assessment entry workflow.
8. Add report card draft/publish workflow.
9. Add progress dashboard.
10. Add permission tests for coach, parent, player, club admin, and cross-club access.

