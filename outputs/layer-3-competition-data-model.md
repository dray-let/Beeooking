# Layer 3 Competition Data Model

## Purpose

Layer 3 extends Beeooking with structured competition management. It should reuse Layer 1 users, families, courts, bookings, payments, waitlists, and communications. Competition formats should all converge on a shared match history model.

## Architecture Principles

- Every competition record includes `club_id`.
- Players are represented by existing Layer 1 `users`.
- Parents use existing Layer 1 family permissions to manage junior competition activity.
- A match is the canonical record for competition outcomes.
- Ladders, challenges, round robins, leagues, and tournaments may all create or reference matches.
- Scores are stored as structured JSON so Beeooking can support squash, tennis, pickleball, and padel formats.
- Ranking and standings changes should preserve history.

## Core Objects

### Competition Settings

Represents club-level configuration for the Layer 3 module.

Key fields:

- `id`
- `club_id`
- `enabled`
- `supported_sports`
- `score_formats`
- `challenge_rules`
- `result_approval_rules`
- `parent_registration_enabled`

Relationships:

- Belongs to club.

### Competition Event

Represents a general competition container such as a round robin, league, tournament, ladder season, or internal event.

Key fields:

- `id`
- `club_id`
- `name`
- `competition_type`
- `sport_type`
- `status`
- `starts_at`
- `ends_at`
- `rules_config`
- `registration_config`

Relationships:

- Belongs to club.
- Has many participants.
- Has many divisions.
- Has many matches.

### Competition Division

Represents an event division, pool, age group, skill group, or draw section.

Key fields:

- `id`
- `club_id`
- `competition_event_id`
- `name`
- `division_type`
- `capacity`
- `eligibility_rules`
- `sort_order`

Relationships:

- Belongs to competition event.
- Has many participants and matches.

### Competition Participant

Represents a player or team participating in a competition.

Key fields:

- `id`
- `club_id`
- `competition_event_id`
- `competition_division_id`
- `participant_type`
- `user_id`
- `team_id`
- `registered_by_user_id`
- `status`
- `seed`

Relationships:

- Belongs to competition event.
- May belong to division.
- Belongs to user for individual events.
- May belong to team for team events.

### Competition Team

Represents a team for league, doubles, or team-based competitions.

Key fields:

- `id`
- `club_id`
- `competition_event_id`
- `name`
- `captain_user_id`
- `status`

Relationships:

- Belongs to competition event.
- Has many team members.

### Competition Team Member

Represents a user on a competition team.

Key fields:

- `id`
- `club_id`
- `competition_team_id`
- `user_id`
- `role`
- `status`

Relationships:

- Belongs to team.
- Belongs to user.

### Match

Represents one competition match and its result.

Key fields:

- `id`
- `club_id`
- `competition_event_id`
- `competition_division_id`
- `match_type`
- `sport_type`
- `status`
- `scheduled_booking_id`
- `court_id`
- `starts_at`
- `completed_at`
- `score_format`
- `score_data`
- `winner_participant_id`
- `result_status`

Relationships:

- Belongs to club.
- May belong to competition event and division.
- May link to a Layer 1 booking and court.
- Has many match participants.
- May be created by a challenge, ladder, round robin, league, or tournament.

### Match Participant

Represents a player or team in a match.

Key fields:

- `id`
- `club_id`
- `match_id`
- `participant_type`
- `user_id`
- `team_id`
- `side`
- `result`

Relationships:

- Belongs to match.
- References user or team.

### Match Result Submission

Represents a submitted score awaiting approval, dispute resolution, or audit.

Key fields:

- `id`
- `club_id`
- `match_id`
- `submitted_by_user_id`
- `score_data`
- `status`
- `submitted_at`
- `reviewed_by_user_id`
- `reviewed_at`

Relationships:

- Belongs to match.
- Belongs to submitting user.
- May be reviewed by staff, coach, or club admin.

### Ladder

Represents a ranked competition ladder.

Key fields:

- `id`
- `club_id`
- `name`
- `sport_type`
- `status`
- `eligibility_rules`
- `challenge_rules`
- `ranking_rules`

Relationships:

- Belongs to club.
- Has many ladder entries.
- Has many challenges.

### Ladder Entry

Represents a player's ladder participation and rank.

Key fields:

- `id`
- `club_id`
- `ladder_id`
- `user_id`
- `rank`
- `status`
- `joined_at`

Relationships:

- Belongs to ladder.
- Belongs to user.
- Has ranking history.

### Ladder Ranking History

Represents rank movement over time.

Key fields:

- `id`
- `club_id`
- `ladder_id`
- `user_id`
- `previous_rank`
- `new_rank`
- `reason`
- `match_id`
- `created_at`

Relationships:

- Belongs to ladder.
- May link to match.

### Challenge

Represents a player challenge.

Key fields:

- `id`
- `club_id`
- `ladder_id`
- `challenger_user_id`
- `opponent_user_id`
- `status`
- `expires_at`
- `match_id`

Relationships:

- Belongs to club.
- May belong to ladder.
- Links challenger and opponent users.
- May create a match.

### Standings Row

Represents standings for a round robin, league, or event division.

Key fields:

- `id`
- `club_id`
- `competition_event_id`
- `competition_division_id`
- `participant_id`
- `played`
- `wins`
- `losses`
- `draws`
- `points`
- `tiebreaker_data`
- `rank`

Relationships:

- Belongs to competition event.
- May belong to division.
- Belongs to competition participant.

## Permission Rules

Club Admin can:

- Configure competition settings.
- Create and manage events, ladders, leagues, round robins, and tournaments.
- Approve, edit, dispute, or delete match results.
- View all competition history within the club.

Staff can:

- Manage registrations, check-in, scheduling, and results if granted.

Coach can:

- View assigned player match history.
- Submit or approve results if granted by club settings.

Parent can:

- Register children for eligible competitions if enabled.
- View child match history and competition schedule.
- Submit child match results only if enabled.

Player can:

- Join eligible competitions.
- Create eligible challenges.
- Submit match results.
- View own match history and standings.

Super Admin can:

- Support configuration through audited support workflows.

## Layer 1 Integration Points

- Use `bookings` to reserve courts for scheduled matches.
- Use `courts` and `facilities` to place matches.
- Use `payments` for paid tournament or league registration.
- Use `waitlist_entries` for full competitions or divisions.
- Use `messages` for participant updates.
- Use `family_members` to authorize parent registration and child match access.

## Layer 2 Integration Points

- Use match history as development context for player dashboards.
- Let coaches reference competition history in report cards.
- Feed future AI recommendations with match outcomes and participation history.

