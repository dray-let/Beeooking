# Layer 2 Development Data Model

## Purpose

Layer 2 extends the Layer 1 operating system with player-development records. It should reuse Layer 1 users, coaches, sessions, bookings, attendance, programs, and family permissions rather than duplicating those concepts.

## Architecture Principles

- Every development record includes `club_id`.
- Development records are attached to a player, represented by `player_user_id`.
- Coaches are represented by the existing Layer 1 `coaches` table.
- Development activity can optionally link to Layer 1 sessions, bookings, programs, or attendance.
- Parent/player visibility is controlled per record and by club-level settings.
- Report cards and assessments preserve historical snapshots.
- Templates can be versioned and retired without corrupting historical records.

## Core Objects

### Development Settings

Represents club-level configuration for the Layer 2 module.

Key fields:

- `id`
- `club_id`
- `enabled`
- `default_note_visibility`
- `parent_access_enabled`
- `player_access_enabled`
- `assessment_scale_config`
- `report_card_publish_roles`

Relationships:

- Belongs to club.

### Player Development Profile

Represents development-specific metadata for a player at a club.

Key fields:

- `id`
- `club_id`
- `player_user_id`
- `primary_coach_id`
- `development_stage`
- `sport_focus`
- `visibility_status`

Relationships:

- Belongs to club.
- Belongs to user.
- May reference a primary coach.
- Has many goals, notes, assessments, and report cards.

### Development Note

Represents a coach note, session note, or player feedback record.

Key fields:

- `id`
- `club_id`
- `player_user_id`
- `coach_id`
- `note_type`
- `title`
- `body`
- `visibility`
- `related_type`
- `related_id`
- `created_at`

Relationships:

- Belongs to club.
- Belongs to player user.
- May belong to coach.
- May link to a session, booking, program, or attendance record.

### Development Goal

Represents a player development goal.

Key fields:

- `id`
- `club_id`
- `player_user_id`
- `created_by_user_id`
- `title`
- `description`
- `category`
- `status`
- `target_date`
- `visibility`

Relationships:

- Belongs to club.
- Belongs to player user.
- Has many goal updates.
- May link to assessment items or report cards.

### Goal Update

Represents progress history for a goal.

Key fields:

- `id`
- `club_id`
- `goal_id`
- `created_by_user_id`
- `status`
- `body`
- `created_at`

Relationships:

- Belongs to goal.
- Belongs to author user.

### Skill Template

Represents a club-defined assessment template.

Key fields:

- `id`
- `club_id`
- `name`
- `sport_type`
- `version`
- `status`
- `scale_config`

Relationships:

- Belongs to club.
- Has many skill categories.
- Has many assessments.

### Skill Category

Represents a section in an assessment template.

Key fields:

- `id`
- `club_id`
- `skill_template_id`
- `name`
- `sort_order`

Relationships:

- Belongs to skill template.
- Has many skill criteria.

### Skill Criterion

Represents one measurable skill or behavior.

Key fields:

- `id`
- `club_id`
- `skill_category_id`
- `name`
- `description`
- `sort_order`

Relationships:

- Belongs to skill category.
- Appears in assessment scores.

### Skill Assessment

Represents one completed assessment for a player.

Key fields:

- `id`
- `club_id`
- `player_user_id`
- `coach_id`
- `skill_template_id`
- `template_snapshot`
- `summary`
- `assessed_at`
- `visibility`

Relationships:

- Belongs to club.
- Belongs to player.
- Belongs to coach.
- Belongs to skill template.
- Has many assessment scores.

### Skill Assessment Score

Represents a score and comment for one criterion in one assessment.

Key fields:

- `id`
- `club_id`
- `skill_assessment_id`
- `skill_criterion_id`
- `score`
- `comment`

Relationships:

- Belongs to skill assessment.
- References skill criterion.

### Report Card Template

Represents a club-defined report card format.

Key fields:

- `id`
- `club_id`
- `name`
- `sport_type`
- `version`
- `status`
- `template_config`

Relationships:

- Belongs to club.
- Has many report cards.

### Report Card

Represents a draft or published development report.

Key fields:

- `id`
- `club_id`
- `player_user_id`
- `coach_id`
- `report_card_template_id`
- `status`
- `period_start`
- `period_end`
- `summary`
- `snapshot`
- `published_at`

Relationships:

- Belongs to club.
- Belongs to player.
- Belongs to coach.
- May include assessment, goal, attendance, and note snapshots.

## Visibility Model

Development records should support these visibility values:

- `private_coach`: visible to author, permitted coaches, and club admins.
- `coach_team`: visible to coaches assigned to the player and club admins.
- `parent_player`: visible to permitted coaches, club admins, parents, and player.
- `parent_only`: visible to permitted coaches, club admins, and guardians.
- `player_only`: visible to permitted coaches, club admins, and player.

## Permission Rules

Club Admin can:

- Configure Layer 2.
- Manage templates.
- View development records within the club.
- Publish or unpublish report cards if granted.

Coach can:

- Create notes, goals, assessments, and report cards for assigned players.
- View records for assigned players according to visibility.

Parent can:

- View shared development records for children in their family.
- Comment or acknowledge records only if enabled by the club.

Player can:

- View shared development records for self.
- Update self-owned goals only if enabled by the club.

Super Admin can:

- Support club configuration.
- Access development data only through audited support workflows.

## Layer 1 Integration Points

- Use `sessions` to connect notes to clinics, camps, courses, and lessons.
- Use `bookings` to connect feedback to private lessons or court bookings.
- Use `program_registrations` to show development context by program.
- Use `attendance_records` to include attendance in report cards.
- Use `family_members` to authorize parent access.
- Use `role_assignments` and `coaches` to authorize coach access.

