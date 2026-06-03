# Beeooking Layer 3 Implementation Backlog

## Layer 3 Sprint A: Competition Module Setup

Goal: Let a club enable competition features and define basic competition rules.

Stories:

- As a club admin, I can enable or disable Layer 3.
- As a club admin, I can configure supported sports.
- As a club admin, I can configure score formats.
- As a club admin, I can configure result submission and approval rules.
- As a club admin, I can configure parent registration for junior competitions.

Acceptance criteria:

- Competition settings are scoped to one club.
- Disabling Layer 3 hides competition workflows without deleting competition history.
- Score formats can support squash, tennis, pickleball, and padel.
- Result approval rules determine whether scores auto-approve or require admin review.

## Layer 3 Sprint B: Match History

Goal: Create the canonical competition match record.

Stories:

- As a club admin, I can create a match manually.
- As a player, I can view my match history.
- As a parent, I can view child match history.
- As a coach, I can view match history for assigned players.
- As a permitted user, I can submit a match result.
- As a club admin, I can approve, reject, or edit a result.

Acceptance criteria:

- Matches are club-scoped.
- Matches support individual and team participants.
- Match scores are stored as structured data.
- Result submissions preserve submitter and reviewer history.
- Approved results update match status and winner.

## Layer 3 Sprint C: Ladders & Challenges

Goal: Let clubs run ranked ladders and player challenges.

Stories:

- As a club admin, I can create a ladder.
- As a player, I can join an eligible ladder.
- As a player, I can challenge an eligible opponent.
- As an opponent, I can accept or decline a challenge.
- As a player, I can submit the result of a challenge match.
- As a club admin, I can resolve disputed challenge results.

Acceptance criteria:

- Ladder entries preserve rank and status.
- Challenge rules restrict who can challenge whom.
- Challenge status supports requested, accepted, declined, expired, completed, and disputed.
- Completed challenge matches create or link to a match record.
- Approved ladder match results create ranking history.

## Layer 3 Sprint D: Round Robins

Goal: Let clubs run round robin events with generated matches and standings.

Stories:

- As a club admin, I can create a round robin event.
- As a club admin, I can create divisions or pools.
- As a player or parent, I can register an eligible participant.
- As a club admin, I can generate round robin matches.
- As a club admin, I can view standings.

Acceptance criteria:

- Round robin events use competition events with type `round_robin`.
- Participants can be grouped into divisions or pools.
- The system can generate every required matchup in a pool.
- Approved match results update standings rows.
- Admins can manually edit pools, participants, matches, and standings.

## Layer 3 Sprint E: Internal Leagues

Goal: Let clubs run seasonal internal leagues.

Stories:

- As a club admin, I can create a league season.
- As a club admin, I can create divisions.
- As a player or team captain, I can register participants.
- As a club admin, I can schedule league rounds.
- As a club admin, I can view league standings.

Acceptance criteria:

- League events use competition events with type `league`.
- League divisions support individual or team participants.
- Matches can be scheduled over multiple rounds.
- Standings support wins, losses, draws, points, rank, and tiebreaker data.
- Completed seasons remain available historically.

## Layer 3 Sprint F: Tournament Registration

Goal: Let clubs create tournaments and accept participant registration.

Stories:

- As a club admin, I can create a tournament.
- As a club admin, I can create events/divisions inside a tournament.
- As a player or parent, I can register an eligible participant.
- As a player or parent, I can pay a tournament registration fee.
- As a club admin, I can manage registration capacity and waitlists.
- As a club admin, I can message tournament participants.

Acceptance criteria:

- Tournament events use competition events with type `tournament`.
- Registration rules support eligibility, capacity, fee, and deadline.
- Paid registrations link to Layer 1 payments.
- Full divisions can use Layer 1 waitlists.
- Participant messages use Layer 1 communications.

## Layer 3 Sprint G: Competition Dashboard

Goal: Give clubs and players visibility into competition activity.

Stories:

- As a club admin, I can view active competitions.
- As a club admin, I can view registrations, matches, and disputed results.
- As a player, I can view my challenges, matches, standings, and registrations.
- As a parent, I can view child competition activity.
- As a coach, I can view assigned player competition history.

Acceptance criteria:

- Dashboard data is scoped by club.
- Parent dashboards only show authorized children.
- Coach dashboards respect coach/player permissions.
- Admin dashboards show operational alerts for pending results, disputes, and upcoming matches.

## Initial Engineering Milestones

1. Add Layer 3 schema extension.
2. Add competition settings admin screen.
3. Build match history and result submission workflow.
4. Build ladder setup, ladder entries, and ranking history.
5. Build challenge creation, acceptance, scheduling, and result flow.
6. Build round robin event setup and match generation.
7. Build league season setup and standings.
8. Build tournament registration with payment and waitlist hooks.
9. Build competition dashboards.
10. Add permission tests for player, parent, coach, staff, club admin, and cross-club access.

