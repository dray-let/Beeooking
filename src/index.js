const layerOne = {
  name: "Layer 1: Club Operating System",
  objective:
    "Give every club the operational foundation to manage users, memberships, bookings, payments, communications, and club-specific rules.",
  modules: [
    {
      name: "User Management",
      status: "Sprint 1",
      capabilities: ["Members & families", "Adult accounts", "Dependents after login", "Coaches", "Staff", "Admins", "Waivers", "Emergency contacts"]
    },
    {
      name: "Membership Management",
      status: "Sprint 2",
      capabilities: ["Monthly plans", "Annual plans", "Junior plans", "Family plans", "Active/non-active pricing", "Privileges", "Renewals"]
    },
    {
      name: "Booking Engine",
      status: "Sprint 3",
      capabilities: ["Court reservations", "Coach bookings", "Clinic bookings", "Camp registration", "Waitlists"]
    },
    {
      name: "Payments",
      status: "Sprint 2-4",
      capabilities: ["Membership billing", "Packages", "Clinics", "Camps", "Private lessons", "Refunds"]
    },
    {
      name: "Communications",
      status: "Sprint 5",
      capabilities: ["Email", "SMS", "Push notifications", "Club announcements", "Groups"]
    },
    {
      name: "Multi-Club Architecture",
      status: "Sprint 0",
      capabilities: ["Club branding", "Club pricing", "Club rules", "Club coaches", "Tenant isolation"]
    }
  ],
  coreObjects: [
    "Club",
    "Facility",
    "Court",
    "User",
    "Family",
    "Membership",
    "Coach",
    "Program",
    "Session",
    "Booking",
    "Payment",
    "Message"
  ],
  roles: ["Super Admin", "Club Admin", "Staff", "Coach", "Parent", "Member"],
  sprintOneReadiness: [
    ["Tenant model", "Ready to specify", "Every operational record needs club_id, and every request resolves active club context."],
    ["Roles", "Ready to specify", "Super Admin, Club Admin, Staff, Coach, Parent, and Member need explicit access boundaries."],
    ["Members & families", "Grouped workflow", "Adults are created first, then dependents are added inside the same member/family area after initial login."],
    ["Waivers", "Required access gate", "Required waivers must be completed before booking, program registration, or participation."],
    ["Emergency contacts", "Ready to specify", "Contacts attach to a user inside a club and need controlled coach/admin visibility."]
  ],
  layerOneRules: [
    "Required waivers must be completed before a member can book a court.",
    "Required waivers must be completed before a parent can register a child for clinics, camps, courses, or sessions.",
    "Required waivers must be completed before a participant can attend a club program.",
    "Admins can see waiver completion status and resolve exceptions inside their club.",
    "Waiver requirements are club-scoped and preserve waiver version history.",
    "Family memberships support one main member, one spousal member, and additional members only when they are under 18.",
    "Date of birth is mandatory for every member profile so eligibility, protective eyewear, group age restrictions, and family membership rules can be enforced.",
    "Members choose active or non-active participants during membership setup, then club admins review and approve the final membership type.",
    "After membership type is approved, active/non-active changes require contacting the club admin.",
    "Members can opt into monthly membership on their own once payment is completed, but monthly membership opt-out requires contacting the club admin."
  ],
  profileRules: [
    ["Main member", "DOB required", "Every primary adult member must enter date of birth during profile setup."],
    ["Spousal member", "DOB required", "The optional spousal member must enter date of birth for eligibility and club rules."],
    ["Dependent", "DOB required", "Dependent profiles need date of birth to verify under-18 family membership eligibility and age-restricted groups."]
  ],
  familyMembershipRules: [
    ["Main member", "Required", "The primary adult or account holder for the family membership."],
    ["Spousal member", "Optional, max 1", "One spouse/partner may be attached as the second adult member."],
    ["Other members", "Under 18 only", "Any additional family members must be dependents under 18 years of age."]
  ],
  membershipPricingRules: [
    ["Setup", "Member selects", "The member or parent chooses which people are active or non-active before submitting the membership."],
    ["Admin review", "Club approves", "Club admin reviews the selected participants, pricing impact, and final membership type before approval."],
    ["Monthly opt-in", "Self-service payment", "Members can start a monthly membership on their own when they complete payment."],
    ["Monthly opt-out", "Contact admin", "Members must contact the club admin to opt out of or cancel monthly membership."],
    ["After approval", "Admin change only", "A family can include a non-active adult and active child, but changes after approval require contacting the club admin."]
  ],
  workflowPrototype: {
    setupSteps: [
      ["1", "Adult profile", "Main adult creates the account, enters DOB, contact details, and emergency contact."],
      ["2", "Add family", "Adult adds spouse or dependent profiles after initial login. DOB is required for every person."],
      ["3", "Choose participation", "Family chooses who is active or non-active and submits the membership for admin review."],
      ["4", "Complete waivers", "Required waivers must be signed before bookings, programs, or participation unlock."]
    ],
    families: [
      {
        id: "letourneau",
        name: "Letourneau Family",
        membership: "Family Monthly",
        reviewStatus: "Pending admin review",
        waiverStatus: "2 of 3 complete",
        paymentStatus: "Payment ready",
        monthlyAction: "Can opt in after payment",
        members: [
          ["Danielle Letourneau", "Main member", "Non-active", "DOB complete", "Signed"],
          ["Avery Letourneau", "Dependent", "Active", "DOB complete", "Missing"],
          ["Maya Letourneau", "Dependent", "Active", "DOB complete", "Signed"]
        ]
      },
      {
        id: "chen",
        name: "Chen Family",
        membership: "Family Annual",
        reviewStatus: "Approved and locked",
        waiverStatus: "All complete",
        paymentStatus: "Paid",
        monthlyAction: "Contact admin to change",
        members: [
          ["Grace Chen", "Main member", "Active", "DOB complete", "Signed"],
          ["Leo Chen", "Spousal member", "Non-active", "DOB complete", "Signed"],
          ["Nina Chen", "Dependent", "Active", "DOB complete", "Signed"]
        ]
      },
      {
        id: "rivera",
        name: "Rivera Member",
        membership: "Monthly Adult",
        reviewStatus: "Draft setup",
        waiverStatus: "Missing waiver",
        paymentStatus: "Awaiting payment",
        monthlyAction: "Self-service opt-in",
        members: [
          ["Sam Rivera", "Main member", "Active", "DOB complete", "Missing"]
        ]
      }
    ],
    reviewQueue: [
      ["Letourneau Family", "Review active children with non-active adult", "Approve membership type"],
      ["Rivera Member", "Payment required before monthly opt-in", "Await payment"],
      ["Monthly opt-out request", "Member must contact admin to cancel", "Admin review"]
    ]
  },
  firstAdminScreens: [
    "Club context switcher",
    "Member directory",
    "User profile detail",
    "Member & family detail",
    "Add dependent flow",
    "Role assignment panel",
    "Waiver completion report",
    "Emergency contact panel"
  ],
  sprints: [
    ["Sprint 0", "Platform Architecture & Data Model", "Define tenancy, core objects, permissions, and seed data."],
    ["Sprint 1", "Foundation", "Authentication, roles, family accounts, profiles, waivers, and emergency contacts."],
    ["Sprint 2", "Membership System", "Plans, privileges, billing, Stripe mapping, and renewal states."],
    ["Sprint 3", "Booking Engine", "Courts, coaches, clinics, availability, conflict prevention, and waitlists."],
    ["Sprint 4", "Program Management", "Camps, clinics, courses, sessions, registrations, and attendance."],
    ["Sprint 5", "Communications", "Announcements, targeted messaging, notifications, and delivery tracking."],
    ["Sprint 6", "Club Admin Dashboard", "Member management, operating reports, utilization, and revenue visibility."]
  ]
};

function listItems(items) {
  return items.map((item) => `<li>${item}</li>`).join("");
}

function renderModuleCards() {
  return layerOne.modules
    .map(
      (module) => `
        <article class="module-card">
          <div class="card-header">
            <h2>${module.name}</h2>
            <span>${module.status}</span>
          </div>
          <ul>${listItems(module.capabilities)}</ul>
        </article>
      `
    )
    .join("");
}

function renderSprintRows() {
  return layerOne.sprints
    .map(
      ([sprint, title, body]) => `
        <li class="timeline-row">
          <strong>${sprint}</strong>
          <div>
            <h3>${title}</h3>
            <p>${body}</p>
          </div>
        </li>
      `
    )
    .join("");
}

function renderReadinessRows() {
  return layerOne.sprintOneReadiness
    .map(
      ([area, status, body]) => `
        <tr>
          <th scope="row">${area}</th>
          <td><span class="status-chip">${status}</span></td>
          <td>${body}</td>
        </tr>
      `
    )
    .join("");
}

function renderProfileRows() {
  return layerOne.profileRules
    .map(
      ([profile, requirement, body]) => `
        <tr>
          <th scope="row">${profile}</th>
          <td><span class="status-chip">${requirement}</span></td>
          <td>${body}</td>
        </tr>
      `
    )
    .join("");
}

function renderFamilyMembershipRows() {
  return layerOne.familyMembershipRules
    .map(
      ([memberType, rule, body]) => `
        <tr>
          <th scope="row">${memberType}</th>
          <td><span class="status-chip">${rule}</span></td>
          <td>${body}</td>
        </tr>
      `
    )
    .join("");
}

function renderMembershipPricingRows() {
  return layerOne.membershipPricingRules
    .map(
      ([memberStatus, pricingRule, body]) => `
        <tr>
          <th scope="row">${memberStatus}</th>
          <td><span class="status-chip">${pricingRule}</span></td>
          <td>${body}</td>
        </tr>
      `
    )
    .join("");
}

function renderSetupSteps() {
  return layerOne.workflowPrototype.setupSteps
    .map(
      ([step, title, body]) => `
        <li class="setup-step">
          <span>${step}</span>
          <div>
            <h4>${title}</h4>
            <p>${body}</p>
          </div>
        </li>
      `
    )
    .join("");
}

function renderFamilySelector() {
  return layerOne.workflowPrototype.families
    .map(
      (family, index) => `
        <button class="family-row${index === 0 ? " is-selected" : ""}" type="button" data-family-trigger="${family.id}">
          <span>
            <strong>${family.name}</strong>
            <small>${family.membership}</small>
          </span>
          <em>${family.reviewStatus}</em>
        </button>
      `
    )
    .join("");
}

function renderParticipantRows(family) {
  return family.members
    .map(
      ([name, role, participation, dob, waiver]) => `
        <tr>
          <th scope="row">${name}<small>${role}</small></th>
          <td>
            <button class="status-toggle" type="button" data-current-status="${participation}">${participation}</button>
          </td>
          <td>${dob}</td>
          <td><span class="status-chip ${waiver === "Missing" ? "is-warning" : ""}">${waiver}</span></td>
        </tr>
      `
    )
    .join("");
}

function renderFamilyDetails() {
  return layerOne.workflowPrototype.families
    .map(
      (family, index) => `
        <article class="family-detail${index === 0 ? " is-active" : ""}" data-family-panel="${family.id}">
          <div class="detail-header">
            <div>
              <h3>${family.name}</h3>
              <p>${family.membership}</p>
            </div>
            <span class="status-chip">${family.reviewStatus}</span>
          </div>
          <div class="metric-row">
            <span><strong>${family.waiverStatus}</strong><small>Waiver status</small></span>
            <span><strong>${family.paymentStatus}</strong><small>Payment</small></span>
            <span><strong>${family.monthlyAction}</strong><small>Monthly membership</small></span>
          </div>
          <div class="table-wrap is-embedded">
            <table>
              <tbody>${renderParticipantRows(family)}</tbody>
            </table>
          </div>
          <div class="action-row">
            <button type="button">Approve membership type</button>
            <button type="button" class="secondary-action">Request changes</button>
          </div>
        </article>
      `
    )
    .join("");
}

function renderReviewQueueRows() {
  return layerOne.workflowPrototype.reviewQueue
    .map(
      ([item, reason, action]) => `
        <tr>
          <th scope="row">${item}</th>
          <td>${reason}</td>
          <td><span class="status-chip">${action}</span></td>
        </tr>
      `
    )
    .join("");
}

function renderPage() {
  return `<!doctype html>
  <html lang="en">
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1">
      <title>Beeooking Layer 1</title>
      <style>
        :root {
          color-scheme: light;
          --ink: #18202a;
          --muted: #5f6f7e;
          --line: #d9e0e7;
          --surface: #f7f9fb;
          --surface-strong: #eef4f7;
          --accent: #0f766e;
          --accent-strong: #0a5c55;
          --warning: #9a5b12;
          --warning-soft: #fff1d8;
        }

        * {
          box-sizing: border-box;
        }

        body {
          margin: 0;
          font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
          color: var(--ink);
          background: #ffffff;
        }

        main {
          width: min(1180px, calc(100% - 32px));
          margin: 0 auto;
          padding: 42px 0 56px;
        }

        header {
          display: grid;
          grid-template-columns: minmax(0, 1.6fr) minmax(280px, 0.8fr);
          gap: 28px;
          align-items: end;
          padding-bottom: 32px;
          border-bottom: 1px solid var(--line);
        }

        h1 {
          max-width: 760px;
          margin: 0;
          font-size: clamp(34px, 5vw, 62px);
          line-height: 1.02;
          letter-spacing: 0;
        }

        .lede {
          max-width: 760px;
          margin: 16px 0 0;
          color: var(--muted);
          font-size: 18px;
          line-height: 1.62;
        }

        .status-panel {
          border: 1px solid var(--line);
          border-radius: 8px;
          padding: 20px;
          background: var(--surface);
        }

        .status-panel p {
          margin: 0;
          color: var(--muted);
          line-height: 1.5;
        }

        .label {
          display: inline-flex;
          margin-bottom: 12px;
          padding: 5px 9px;
          border-radius: 999px;
          background: var(--warning-soft);
          color: var(--warning);
          font-size: 12px;
          font-weight: 800;
          letter-spacing: 0;
          text-transform: uppercase;
        }

        section {
          margin-top: 34px;
        }

        .section-heading {
          display: flex;
          align-items: baseline;
          justify-content: space-between;
          gap: 16px;
          margin-bottom: 16px;
        }

        .section-heading h2 {
          margin: 0;
          font-size: 26px;
          letter-spacing: 0;
        }

        .section-heading p {
          max-width: 520px;
          margin: 0;
          color: var(--muted);
          line-height: 1.5;
        }

        .module-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
          gap: 14px;
        }

        .module-card {
          min-height: 230px;
          padding: 20px;
          border: 1px solid var(--line);
          border-radius: 8px;
          background: var(--surface);
        }

        .card-header {
          display: flex;
          justify-content: space-between;
          gap: 16px;
          align-items: start;
          margin-bottom: 16px;
        }

        .card-header h2 {
          margin: 0;
          font-size: 21px;
          line-height: 1.25;
          letter-spacing: 0;
        }

        .card-header span {
          flex: none;
          padding: 5px 8px;
          border-radius: 999px;
          color: var(--accent-strong);
          background: #dff6f1;
          font-size: 12px;
          font-weight: 700;
        }

        ul {
          margin: 0;
          padding-left: 18px;
          color: var(--muted);
          line-height: 1.55;
        }

        .object-strip,
        .role-strip {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          padding: 18px;
          border: 1px solid var(--line);
          border-radius: 8px;
          background: var(--surface);
        }

        .pill {
          padding: 8px 10px;
          border: 1px solid var(--line);
          border-radius: 999px;
          background: #ffffff;
          color: var(--ink);
          font-size: 14px;
          font-weight: 650;
        }

        .timeline {
          display: grid;
          gap: 10px;
          margin: 0;
          padding: 0;
          list-style: none;
        }

        .timeline-row {
          display: grid;
          grid-template-columns: 104px minmax(0, 1fr);
          gap: 18px;
          padding: 18px;
          border: 1px solid var(--line);
          border-radius: 8px;
          background: var(--surface);
        }

        .timeline-row strong {
          color: var(--accent-strong);
        }

        .timeline-row h3 {
          margin: 0 0 4px;
          font-size: 18px;
          letter-spacing: 0;
        }

        .timeline-row p {
          margin: 0;
          color: var(--muted);
          line-height: 1.5;
        }

        .split-grid {
          display: grid;
          grid-template-columns: minmax(0, 1.1fr) minmax(280px, 0.9fr);
          gap: 14px;
        }

        .table-wrap,
        .screen-list {
          border: 1px solid var(--line);
          border-radius: 8px;
          background: var(--surface);
          overflow: hidden;
        }

        table {
          width: 100%;
          border-collapse: collapse;
          font-size: 14px;
        }

        th,
        td {
          padding: 14px 16px;
          border-bottom: 1px solid var(--line);
          text-align: left;
          vertical-align: top;
        }

        tr:last-child th,
        tr:last-child td {
          border-bottom: 0;
        }

        th {
          width: 150px;
          color: var(--ink);
          font-weight: 750;
        }

        td {
          color: var(--muted);
          line-height: 1.45;
        }

        .status-chip {
          display: inline-flex;
          padding: 5px 8px;
          border-radius: 999px;
          background: #ffffff;
          border: 1px solid var(--line);
          color: var(--accent-strong);
          font-size: 12px;
          font-weight: 750;
          white-space: nowrap;
        }

        .screen-list {
          padding: 18px;
        }

        .screen-list h3 {
          margin: 0 0 12px;
          font-size: 18px;
          letter-spacing: 0;
        }

        .rule-band {
          display: grid;
          grid-template-columns: minmax(0, 0.55fr) minmax(0, 1fr);
          gap: 18px;
          padding: 20px;
          border: 1px solid #f2c879;
          border-radius: 8px;
          background: #fff8ea;
        }

        .rule-band h2 {
          margin: 0;
          font-size: 24px;
          letter-spacing: 0;
        }

        .rule-band p {
          margin: 8px 0 0;
          color: var(--muted);
          line-height: 1.5;
        }

        .rule-band ul {
          color: #5f471f;
        }

        .prototype-shell {
          border: 1px solid var(--line);
          border-radius: 8px;
          background: var(--surface);
          overflow: hidden;
        }

        .prototype-tabs {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          padding: 12px;
          border-bottom: 1px solid var(--line);
          background: #ffffff;
        }

        .prototype-tabs button,
        .action-row button,
        .family-row,
        .status-toggle {
          min-height: 38px;
          border: 1px solid var(--line);
          border-radius: 8px;
          background: #ffffff;
          color: var(--ink);
          font: inherit;
          font-size: 14px;
          font-weight: 750;
          cursor: pointer;
        }

        .prototype-tabs button {
          padding: 8px 12px;
        }

        .prototype-tabs button.is-active,
        .family-row.is-selected,
        .action-row button {
          border-color: var(--accent);
          background: #dff6f1;
          color: var(--accent-strong);
        }

        .prototype-panel {
          display: none;
          padding: 18px;
        }

        .prototype-panel.is-active {
          display: block;
        }

        .setup-list {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
          gap: 12px;
          margin: 0;
          padding: 0;
          list-style: none;
        }

        .setup-step {
          min-height: 138px;
          padding: 16px;
          border: 1px solid var(--line);
          border-radius: 8px;
          background: #ffffff;
        }

        .setup-step span {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 28px;
          height: 28px;
          margin-bottom: 12px;
          border-radius: 999px;
          background: var(--accent);
          color: #ffffff;
          font-weight: 800;
        }

        .setup-step h4,
        .family-detail h3 {
          margin: 0 0 6px;
          letter-spacing: 0;
        }

        .setup-step p,
        .family-detail p {
          margin: 0;
          color: var(--muted);
          line-height: 1.5;
        }

        .member-workspace {
          display: grid;
          grid-template-columns: minmax(240px, 0.42fr) minmax(0, 1fr);
          gap: 14px;
        }

        .family-list {
          display: grid;
          gap: 8px;
        }

        .family-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          width: 100%;
          padding: 12px;
          text-align: left;
        }

        .family-row small,
        .family-row em,
        th small,
        .metric-row small {
          display: block;
          margin-top: 3px;
          color: var(--muted);
          font-size: 12px;
          font-style: normal;
          font-weight: 650;
        }

        .family-detail {
          display: none;
          border: 1px solid var(--line);
          border-radius: 8px;
          background: #ffffff;
          overflow: hidden;
        }

        .family-detail.is-active {
          display: block;
        }

        .detail-header {
          display: flex;
          align-items: start;
          justify-content: space-between;
          gap: 12px;
          padding: 16px;
          border-bottom: 1px solid var(--line);
        }

        .metric-row {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 1px;
          background: var(--line);
        }

        .metric-row span {
          min-height: 74px;
          padding: 14px 16px;
          background: #ffffff;
        }

        .metric-row strong {
          display: block;
          font-size: 15px;
        }

        .table-wrap.is-embedded {
          border-right: 0;
          border-left: 0;
          border-radius: 0;
          background: #ffffff;
        }

        .status-toggle {
          min-width: 96px;
          padding: 7px 10px;
        }

        .status-toggle[data-current-status="Active"] {
          border-color: var(--accent);
          color: var(--accent-strong);
          background: #dff6f1;
        }

        .status-chip.is-warning {
          color: var(--warning);
          background: var(--warning-soft);
          border-color: #f2c879;
        }

        .action-row {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
          padding: 16px;
          border-top: 1px solid var(--line);
        }

        .action-row button {
          padding: 8px 12px;
        }

        .action-row .secondary-action {
          border-color: var(--line);
          background: #ffffff;
          color: var(--ink);
        }

        footer {
          margin-top: 36px;
          padding-top: 24px;
          border-top: 1px solid var(--line);
          color: var(--muted);
          font-size: 14px;
        }

        @media (max-width: 760px) {
          header,
          .timeline-row,
          .split-grid,
          .rule-band,
          .member-workspace,
          .metric-row {
            grid-template-columns: 1fr;
          }

          .section-heading {
            display: block;
          }

          .section-heading p {
            margin-top: 8px;
          }
        }
      </style>
    </head>
    <body>
      <main>
        <header>
          <div>
            <h1>${layerOne.name}</h1>
            <p class="lede">${layerOne.objective}</p>
          </div>
          <aside class="status-panel" aria-label="Current build focus">
            <span class="label">Build Focus</span>
            <p>Sprint 0 and Sprint 1: tenant model, club objects, roles, profiles, family accounts, waivers, and emergency contacts.</p>
          </aside>
        </header>

        <section aria-labelledby="prototype-title">
          <div class="section-heading">
            <h2 id="prototype-title">Sprint 1 Workflow Prototype</h2>
            <p>Start with the Members & Families surface: setup, participant status, admin review, waivers, and monthly membership rules.</p>
          </div>
          <div class="prototype-shell">
            <div class="prototype-tabs" role="tablist" aria-label="Sprint 1 workflow">
              <button class="is-active" type="button" data-prototype-tab="setup">Member setup</button>
              <button type="button" data-prototype-tab="families">Members & families</button>
              <button type="button" data-prototype-tab="review">Admin review</button>
              <button type="button" data-prototype-tab="monthly">Monthly rules</button>
            </div>
            <div class="prototype-panel is-active" data-prototype-panel="setup">
              <ol class="setup-list">${renderSetupSteps()}</ol>
            </div>
            <div class="prototype-panel" data-prototype-panel="families">
              <div class="member-workspace">
                <div class="family-list">${renderFamilySelector()}</div>
                <div>${renderFamilyDetails()}</div>
              </div>
            </div>
            <div class="prototype-panel" data-prototype-panel="review">
              <div class="table-wrap">
                <table>
                  <tbody>${renderReviewQueueRows()}</tbody>
                </table>
              </div>
            </div>
            <div class="prototype-panel" data-prototype-panel="monthly">
              <div class="rule-band">
                <div>
                  <span class="label">Monthly</span>
                  <h2>Opt In Is Self-Service. Opt Out Is Admin Reviewed.</h2>
                  <p>Members can start monthly membership by paying. Canceling or opting out routes through the club admin.</p>
                </div>
                <ul>
                  <li>Self-service monthly opt-in after completed payment.</li>
                  <li>Admin contact required for monthly opt-out or cancellation.</li>
                  <li>Payment status and membership status stay separate.</li>
                  <li>Approved membership type locks active/non-active self-service changes.</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        <section aria-labelledby="modules-title">
          <div class="section-heading">
            <h2 id="modules-title">Core Modules</h2>
            <p>The Layer 1 MVP is the club operations backbone every sport-specific module depends on.</p>
          </div>
          <div class="module-grid">${renderModuleCards()}</div>
        </section>

        <section class="rule-band" aria-labelledby="rules-title">
          <div>
            <span class="label">Required</span>
            <h2 id="rules-title">Waiver Completion Gate</h2>
            <p>Layer 1 must block operational activity until required waivers are complete.</p>
          </div>
          <ul>${listItems(layerOne.layerOneRules)}</ul>
        </section>

        <section aria-labelledby="objects-title">
          <div class="section-heading">
            <h2 id="objects-title">Core Objects</h2>
            <p>Every operational record is scoped by club, with shared users gaining club-specific roles and permissions.</p>
          </div>
          <div class="object-strip">${layerOne.coreObjects.map((item) => `<span class="pill">${item}</span>`).join("")}</div>
        </section>

        <section aria-labelledby="roles-title">
          <div class="section-heading">
            <h2 id="roles-title">Permissions</h2>
            <p>Access starts with the active club context, then role, then object ownership.</p>
          </div>
          <div class="role-strip">${layerOne.roles.map((item) => `<span class="pill">${item}</span>`).join("")}</div>
        </section>

        <section aria-labelledby="sprint-one-title">
          <div class="section-heading">
            <h2 id="sprint-one-title">Sprint 1 Foundation Readiness</h2>
            <p>The immediate work is an admin shell for profiles, roles, families, waivers, and emergency contacts.</p>
          </div>
          <div class="split-grid">
            <div class="table-wrap">
              <table>
                <tbody>${renderReadinessRows()}</tbody>
              </table>
            </div>
            <aside class="screen-list">
              <h3>First Admin Screens</h3>
              <ul>${listItems(layerOne.firstAdminScreens)}</ul>
            </aside>
          </div>
        </section>

        <section aria-labelledby="profile-rules-title">
          <div class="section-heading">
            <h2 id="profile-rules-title">Profile Field Rules</h2>
            <p>Date of birth is required for every member profile so family, waiver, and age-based rules can be enforced.</p>
          </div>
          <div class="table-wrap">
            <table>
              <tbody>${renderProfileRows()}</tbody>
            </table>
          </div>
        </section>

        <section aria-labelledby="family-membership-title">
          <div class="section-heading">
            <h2 id="family-membership-title">Family Membership Composition</h2>
            <p>Family memberships have one primary adult, at most one spousal member, and under-18 dependents only.</p>
          </div>
          <div class="table-wrap">
            <table>
              <tbody>${renderFamilyMembershipRows()}</tbody>
            </table>
          </div>
        </section>

        <section aria-labelledby="membership-pricing-title">
          <div class="section-heading">
            <h2 id="membership-pricing-title">Membership Pricing Rules</h2>
            <p>People choose active or non-active status during setup; after admin approval, changes go through the club.</p>
          </div>
          <div class="table-wrap">
            <table>
              <tbody>${renderMembershipPricingRows()}</tbody>
            </table>
          </div>
        </section>

        <section aria-labelledby="timeline-title">
          <div class="section-heading">
            <h2 id="timeline-title">Layer 1 Build Sequence</h2>
            <p>Keep the first release focused on reliable operations before player development, competition, AI, or ecosystem features.</p>
          </div>
          <ol class="timeline">${renderSprintRows()}</ol>
        </section>

        <footer>
          JSON data is available at <code>/api/layer-1</code>. Planning artifacts are in the repository outputs folder.
        </footer>
      </main>
      <script>
        const tabButtons = document.querySelectorAll("[data-prototype-tab]");
        const tabPanels = document.querySelectorAll("[data-prototype-panel]");
        tabButtons.forEach((button) => {
          button.addEventListener("click", () => {
            const tab = button.dataset.prototypeTab;
            tabButtons.forEach((item) => item.classList.toggle("is-active", item === button));
            tabPanels.forEach((panel) => panel.classList.toggle("is-active", panel.dataset.prototypePanel === tab));
          });
        });

        const familyButtons = document.querySelectorAll("[data-family-trigger]");
        const familyPanels = document.querySelectorAll("[data-family-panel]");
        familyButtons.forEach((button) => {
          button.addEventListener("click", () => {
            const familyId = button.dataset.familyTrigger;
            familyButtons.forEach((item) => item.classList.toggle("is-selected", item === button));
            familyPanels.forEach((panel) => panel.classList.toggle("is-active", panel.dataset.familyPanel === familyId));
          });
        });

        document.querySelectorAll("[data-current-status]").forEach((button) => {
          button.addEventListener("click", () => {
            const nextStatus = button.dataset.currentStatus === "Active" ? "Non-active" : "Active";
            button.dataset.currentStatus = nextStatus;
            button.textContent = nextStatus;
          });
        });
      </script>
    </body>
  </html>`;
}

export default {
  async fetch(request) {
    const url = new URL(request.url);

    if (url.pathname === "/api/layer-1") {
      return new Response(JSON.stringify(layerOne, null, 2), {
        headers: {
          "Content-Type": "application/json; charset=utf-8"
        }
      });
    }

        if (url.pathname === "/api/layer-1/sprint-1") {
      return new Response(JSON.stringify({
        readiness: layerOne.sprintOneReadiness,
        rules: layerOne.layerOneRules,
        profileRules: layerOne.profileRules,
        familyMembershipRules: layerOne.familyMembershipRules,
        membershipPricingRules: layerOne.membershipPricingRules,
        workflowPrototype: layerOne.workflowPrototype,
        firstAdminScreens: layerOne.firstAdminScreens
      }, null, 2), {
        headers: {
          "Content-Type": "application/json; charset=utf-8"
        }
      });
    }

    return new Response(renderPage(), {
      headers: {
        "Content-Type": "text/html; charset=utf-8"
      }
    });
  }
};
