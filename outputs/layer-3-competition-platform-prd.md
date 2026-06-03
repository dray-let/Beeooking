# Beeooking Layer 3 PRD: Competition Platform

## Objective

Build an optional competition platform that clubs can enable after the Layer 1 operating system is running. Layer 3 lets clubs organize structured match play through ladders, challenges, round robins, internal leagues, tournament registration, and match history.

## Product Positioning

Layer 1 helps clubs operate.

Layer 2 helps clubs develop players.

Layer 3 helps clubs create competition.

Competition should feel connected to the club calendar, members, programs, courts, coaches, payments, and communications. It should not require clubs to run brackets, ladders, and match records in spreadsheets.

## MVP Definition

Layer 3 is successful when a club can:

- Enable competition features at the club level.
- Create ladders for a sport, division, age group, or skill level.
- Let players challenge other eligible players.
- Record match results.
- Run round robins and internal leagues.
- Open tournament registration.
- Track player match history.
- Communicate competition updates to participants.

## Target Users

- Club Admin: Configures competition formats, eligibility, registration, schedules, and reporting.
- Staff: Helps manage registrations, results, and day-of operations.
- Coach: Views player competition activity and may submit match results when permitted.
- Parent: Registers children for eligible competitions and views child match history.
- Member/Player: Joins competitions, challenges players, submits scores, and views match history.
- Super Admin: Supports clubs and monitors module usage.

## Core Modules

### 1. Competition Settings

Capabilities:

- Club-level module enablement.
- Sport-specific rules.
- Eligibility rules.
- Result submission rules.
- Score format configuration.
- Parent registration rules.

Acceptance criteria:

- A club admin can enable or disable Layer 3 for a club.
- A club can configure supported sports and score formats.
- A club can decide who may create challenges, submit results, approve results, and edit results.
- Competition records remain stored when the module is disabled.

### 2. Ladders

Capabilities:

- Club ladders by sport, division, rating, age, or membership type.
- Player ladder entries.
- Ranking positions.
- Challenge rules.
- Promotion/relegation rules if enabled.

Acceptance criteria:

- A club admin can create and publish a ladder.
- Eligible players can join a ladder.
- Players can challenge eligible opponents according to club rules.
- Ladder positions update after approved match results.
- Historical ranking movement is preserved.

### 3. Challenges

Capabilities:

- Player-to-player challenge creation.
- Challenge acceptance/decline.
- Expiration windows.
- Suggested court booking link.
- Result submission.
- Admin dispute resolution.

Acceptance criteria:

- A player can challenge an eligible opponent.
- A parent can create or approve a challenge for a child if enabled.
- A challenge can become a scheduled match.
- Challenge status tracks requested, accepted, declined, expired, completed, and disputed.
- A completed challenge links to a match record.

### 4. Round Robins

Capabilities:

- Round robin event setup.
- Participant registration.
- Pool/group creation.
- Match generation.
- Standings.
- Result entry.

Acceptance criteria:

- A club admin can create a round robin for a sport and division.
- Participants can register if eligible.
- The system can generate required matches for each pool.
- Standings update from approved match results.
- Admins can manually adjust participants, pools, and matches.

### 5. Internal Leagues

Capabilities:

- League seasons.
- Divisions.
- Teams or individual participants.
- Scheduled rounds.
- Standings.
- Playoff-ready structure.

Acceptance criteria:

- A club admin can create a league season with divisions.
- Players or teams can register.
- League matches can be scheduled across rounds.
- Standings support wins, losses, points, sets, games, and custom tiebreakers.
- League history is preserved after a season ends.

### 6. Tournament Registration

Capabilities:

- Tournament event creation.
- Division/event registration.
- Capacity limits.
- Fees and payment links.
- Waitlists.
- Participant communication.

Acceptance criteria:

- A club admin can create a tournament with one or more events/divisions.
- Members and parents can register eligible participants.
- Registration can require payment through Layer 1 payments.
- Capacity limits and waitlists are enforced.
- Tournament registrations can feed bracket or draw generation in a later release.

### 7. Match History

Capabilities:

- Match records.
- Participants.
- Scores.
- Result approval.
- Source tracking.
- Player history views.

Acceptance criteria:

- Every completed competition match creates a match history record.
- Match records are scoped to a club.
- Scores can represent squash, tennis, pickleball, or padel formats.
- Players can view their own match history.
- Parents can view child match history when authorized.
- Coaches can view competition history for assigned players when permitted.

## Non-Goals For Layer 3

- AI opponent recommendations.
- External rating integration.
- ClubLocker ingestion.
- Live scoring.
- Video review.
- Public tournament marketplace.
- National governing body sanctioning.

## Layer 3 Dependencies

Layer 3 depends on these Layer 1 objects:

- `clubs`
- `users`
- `club_users`
- `families`
- `family_members`
- `membership_plans`
- `memberships`
- `facilities`
- `courts`
- `bookings`
- `payments`
- `waitlist_entries`
- `messages`

Layer 3 can optionally use these Layer 2 objects:

- `player_development_profiles`
- `development_goals`
- `skill_assessments`

## Product Risks

- Competition formats can get complex quickly if the MVP tries to support every bracket and scoring edge case.
- Score formats differ by sport and must be configurable without becoming chaotic.
- Ladder ranking changes need an audit trail.
- Match result disputes require clear ownership.
- Parent-child permissions must be handled carefully for junior competitions.

## Recommended Layer 3 MVP Cut

Build in this order:

1. Competition module settings.
2. Match history and score entry.
3. Ladders and challenges.
4. Round robin events.
5. Internal league seasons.
6. Tournament registration.
7. Competition dashboard and communications.

