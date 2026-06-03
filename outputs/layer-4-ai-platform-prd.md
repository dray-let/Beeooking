# Beeooking Layer 4 PRD: AI Platform

## Objective

Build Beeooking's differentiated AI layer on top of the club operating system, player-development platform, and competition platform. Layer 4 should help clubs recommend the right programs, coaches, opponents, retention actions, and development pathways using the data already captured in Layers 1, 2, and 3.

## Product Positioning

Layer 1 helps clubs operate.

Layer 2 helps clubs develop players.

Layer 3 helps clubs create competition.

Layer 4 helps clubs make better decisions.

The AI platform should not replace coaches or club admins. It should give them useful recommendations, explain why those recommendations were made, and let humans accept, reject, edit, or act on them.

## MVP Definition

Layer 4 is successful when Beeooking can:

- Generate explainable recommendations for players, parents, coaches, and club admins.
- Recommend clinics, coaches, opponents, and training plans.
- Recommend membership renewal and retention actions.
- Recommend program opportunities for a club.
- Analyze attendance, development, and match history.
- Track whether recommendations are accepted, dismissed, or acted on.
- Keep AI recommendations club-scoped and permission-aware.

## Target Users

- Club Admin: Reviews revenue, retention, program, and member engagement recommendations.
- Coach: Reviews player development insights and recommended next steps.
- Parent: Receives child program, coach, and development recommendations if enabled.
- Member/Player: Receives own clinic, coach, opponent, and training recommendations if enabled.
- Super Admin: Monitors AI product performance, safety, adoption, and support issues.

## Core Modules

### 1. AI Platform Settings

Capabilities:

- Club-level AI enablement.
- Recommendation category controls.
- Parent/player visibility controls.
- Human approval requirements.
- Data source controls.
- Feedback collection settings.

Acceptance criteria:

- A club admin can enable or disable AI features.
- A club can enable AI by category, such as coach recommendations, clinic recommendations, retention recommendations, or program opportunity recommendations.
- A club can require staff approval before recommendations are shown to members or parents.
- AI-generated recommendations are hidden when the module is disabled, but history remains available to admins.

### 2. AI Coach

Recommends:

- Clinics.
- Coaches.
- Match opponents.
- Training plans.

Capabilities:

- Player profile analysis.
- Attendance and booking pattern analysis.
- Skill and goal context.
- Match history context.
- Program eligibility matching.
- Coach fit matching.
- Opponent fit matching.

Acceptance criteria:

- A recommendation includes title, recommended action, explanation, confidence, source data summary, and expiration.
- A player only sees recommendations they are permitted to view.
- A parent only sees recommendations for children they are authorized to manage.
- A coach can review recommendations for assigned players.
- Recommendations can be accepted, dismissed, snoozed, or marked not useful.

### 3. AI Club Manager

Recommends:

- Membership renewals.
- Retention campaigns.
- Program opportunities.

Capabilities:

- Membership renewal risk analysis.
- Engagement drop-off detection.
- Underutilized court/program analysis.
- Program demand signals.
- Revenue opportunity ranking.
- Suggested outreach audiences.

Acceptance criteria:

- A club admin can view member retention recommendations.
- A club admin can view program opportunity recommendations.
- A recommendation explains which signals influenced it.
- A recommendation can create a draft communication campaign using Layer 1 communications.
- A recommendation can link to relevant members, memberships, programs, bookings, payments, or attendance records.

### 4. AI Player Development

Analyzes:

- ClubLocker data.
- Match history.
- Training attendance.
- Development goals.
- Skill assessments.
- Coach notes.

Recommends:

- Areas of improvement.
- Next programs.
- Competitive pathways.

Capabilities:

- Player development summaries.
- Progress trend analysis.
- Match outcome pattern analysis.
- Attendance and consistency analysis.
- Skill gap identification.
- Pathway recommendations.

Acceptance criteria:

- A coach can generate or view a player development insight.
- A report can summarize attendance, skill assessments, goals, and match history.
- AI output clearly separates evidence from recommendation.
- External integration data such as ClubLocker is labeled by source.
- No recommendation is shown to parents or players unless visibility rules allow it.

### 5. Recommendation Workflow

Capabilities:

- Recommendation generation.
- Human review.
- Approval/publishing.
- Action tracking.
- User feedback.
- Outcome tracking.

Acceptance criteria:

- Every recommendation stores category, audience, subject, source data, model metadata, confidence, explanation, and status.
- A human can accept, dismiss, edit, publish, or archive a recommendation.
- Recommendation actions are tracked separately from recommendation generation.
- Feedback can be collected from club admins, coaches, parents, and players.
- Beeooking can measure recommendation conversion and usefulness.

### 6. AI Safety & Governance

Capabilities:

- Prompt/version tracking.
- Source data traceability.
- Permission-aware generation.
- Sensitive-data controls.
- Audit logs.
- Human override.

Acceptance criteria:

- Recommendations are generated only from data the target audience is allowed to access.
- AI outputs include enough explanation for a human to review.
- Club admins can turn off categories that do not fit their operations.
- Super Admin can audit recommendation generation and usage.
- Health, injury, medical, or diagnosis-style recommendations are explicitly out of scope.

## Non-Goals For Layer 4

- Fully autonomous coaching.
- Medical, injury, or health diagnosis.
- Unapproved member-facing recommendations.
- Replacing coach judgment.
- Replacing club admin decisions.
- Real-time video analysis.
- Public benchmarking across clubs without explicit consent.

## Layer 4 Dependencies

Layer 4 depends on Layer 1 data:

- `clubs`
- `users`
- `families`
- `family_members`
- `memberships`
- `membership_plans`
- `bookings`
- `programs`
- `sessions`
- `program_registrations`
- `attendance_records`
- `payments`
- `messages`

Layer 4 depends on Layer 2 data:

- `player_development_profiles`
- `development_notes`
- `development_goals`
- `skill_assessments`
- `skill_assessment_scores`
- `report_cards`

Layer 4 depends on Layer 3 data:

- `matches`
- `match_participants`
- `competition_events`
- `competition_participants`
- `ladders`
- `challenges`
- `standings_rows`

Layer 4 can use future integration data:

- ClubLocker data.
- Live Sports AI data.
- External ratings and rankings.
- External tournament results.

## Product Risks

- Bad recommendations can reduce trust quickly.
- Clubs may need control over when recommendations are visible to parents or players.
- Explanations must be understandable without exposing sensitive internal data.
- Recommendations need measurable outcomes or they become novelty.
- External data can be stale, incomplete, or inconsistent.

## Recommended Layer 4 MVP Cut

Build in this order:

1. AI settings and recommendation infrastructure.
2. Club admin recommendations for retention and program opportunities.
3. Coach-facing player development insights.
4. Player/parent program and coach recommendations with human approval.
5. Opponent matching from competition history.
6. Training plan recommendations.
7. External data ingestion for ClubLocker and Live Sports AI.

