# Beeooking Layer 4 Implementation Backlog

## Layer 4 Sprint A: AI Platform Infrastructure

Goal: Create the foundation for safe, explainable, permission-aware recommendations.

Stories:

- As a club admin, I can enable or disable AI features.
- As a club admin, I can choose which recommendation categories are enabled.
- As a club admin, I can require human approval before member-facing recommendations are published.
- As a system, I can track generation runs, prompt versions, source data, model metadata, and recommendation status.
- As a Super Admin, I can audit AI generation and usage.

Acceptance criteria:

- AI settings are scoped to one club.
- Recommendations store explanation, confidence, source data, status, and model metadata.
- AI output is never shown to parents or players unless visibility rules allow it.
- Recommendation history remains available when AI is disabled.
- Generation runs can be inspected for troubleshooting.

## Layer 4 Sprint B: AI Club Manager

Goal: Help club admins identify retention, renewal, and program opportunities.

Stories:

- As a club admin, I can view membership renewal risk recommendations.
- As a club admin, I can view retention campaign recommendations.
- As a club admin, I can view program opportunity recommendations.
- As a club admin, I can turn a recommendation into a draft communication campaign.
- As a club admin, I can accept, dismiss, snooze, or archive recommendations.

Acceptance criteria:

- Recommendations use Layer 1 memberships, bookings, attendance, payments, programs, and messages.
- Each recommendation explains the signals that influenced it.
- Campaign drafts use Layer 1 communications.
- Recommendation actions are tracked.
- Outcomes can link to messages, renewals, registrations, bookings, or payments.

## Layer 4 Sprint C: Coach-Facing Player Development Insights

Goal: Help coaches understand a player's progress and next development priorities.

Stories:

- As a coach, I can view AI-generated development insights for assigned players.
- As a coach, I can view evidence from goals, assessments, attendance, notes, and match history.
- As a coach, I can accept or dismiss suggested development areas.
- As a coach, I can use an insight when preparing a report card.

Acceptance criteria:

- Insights use Layer 2 development data and Layer 3 match history.
- Insights separate evidence from recommendation.
- Coaches only see players they are allowed to coach.
- Insights can link to source records.
- Coach actions and feedback are tracked.

## Layer 4 Sprint D: Program & Coach Recommendations

Goal: Recommend the right clinics, programs, and coaches to players or parents.

Stories:

- As a coach or club admin, I can generate program recommendations for a player.
- As a parent, I can view approved recommendations for my child.
- As a player, I can view approved recommendations for myself.
- As a parent or player, I can act on a recommendation by registering or booking.
- As a club admin, I can measure recommendation conversion.

Acceptance criteria:

- Recommendations use player goals, assessments, attendance, bookings, programs, and coach availability.
- Parent/player visibility follows club settings and family permissions.
- Recommendations can link to Layer 1 program registration or booking flows.
- Outcomes track whether a recommendation led to registration, booking, or payment.

## Layer 4 Sprint E: Opponent Matching

Goal: Recommend useful match opponents using competition and development context.

Stories:

- As a player, I can view approved opponent recommendations.
- As a parent, I can view approved opponent recommendations for my child.
- As a coach, I can review suggested opponents for assigned players.
- As a player, I can create a challenge from an opponent recommendation.

Acceptance criteria:

- Recommendations use match history, ladder data, standings, skill level, age eligibility, and club rules.
- Opponent recommendations avoid ineligible or blocked pairings.
- Recommendations can create Layer 3 challenges.
- Outcomes track whether a recommended match was scheduled or completed.

## Layer 4 Sprint F: Training Plans & Competitive Pathways

Goal: Recommend structured next steps for player development.

Stories:

- As a coach, I can generate a training plan recommendation for a player.
- As a coach, I can review and edit the training plan before sharing.
- As a parent or player, I can view approved training plan recommendations.
- As a coach, I can link a training plan to goals, programs, and report cards.

Acceptance criteria:

- Training plans are based on evidence from goals, assessments, attendance, coach notes, and match history.
- Training plans require coach approval before parent/player visibility.
- Recommendations link to existing goals or create draft goals.
- Outcomes track goal progress and program participation.

## Layer 4 Sprint G: External Data Signals

Goal: Ingest external player signals to improve recommendations.

Stories:

- As a club admin, I can connect or configure ClubLocker data.
- As a system, I can ingest external match, rating, ranking, or participation signals.
- As a coach, I can see when an insight uses external data.
- As a Super Admin, I can monitor data freshness and ingestion issues.

Acceptance criteria:

- External signals store source, timestamp, freshness, and raw signal data.
- Recommendations label external data sources clearly.
- Stale or missing data does not silently drive recommendations.
- Integration failures are visible to admins or support users.

## Initial Engineering Milestones

1. Add Layer 4 schema extension.
2. Add AI settings admin screen.
3. Build recommendation generation run tracking.
4. Build recommendation review, status, action, feedback, and outcome workflows.
5. Build AI Club Manager recommendations.
6. Build coach-facing player development insights.
7. Build parent/player program and coach recommendations with approval.
8. Build opponent matching recommendations.
9. Build training plan and pathway recommendations.
10. Add external signal ingestion for ClubLocker and Live Sports AI.

