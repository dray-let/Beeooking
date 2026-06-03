const layerOne = {
  name: "Layer 1: Club Operating System",
  objective:
    "Give every club the operational foundation to manage users, memberships, bookings, payments, communications, and club-specific rules.",
  modules: [
    {
      name: "User Management",
      status: "Sprint 1",
      capabilities: ["Members", "Parents", "Coaches", "Staff", "Admins", "Family accounts", "Waivers", "Emergency contacts"]
    },
    {
      name: "Membership Management",
      status: "Sprint 2",
      capabilities: ["Monthly plans", "Annual plans", "Junior plans", "Family plans", "Privileges", "Renewals"]
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

        footer {
          margin-top: 36px;
          padding-top: 24px;
          border-top: 1px solid var(--line);
          color: var(--muted);
          font-size: 14px;
        }

        @media (max-width: 760px) {
          header,
          .timeline-row {
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

        <section aria-labelledby="modules-title">
          <div class="section-heading">
            <h2 id="modules-title">Core Modules</h2>
            <p>The Layer 1 MVP is the club operations backbone every sport-specific module depends on.</p>
          </div>
          <div class="module-grid">${renderModuleCards()}</div>
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

    return new Response(renderPage(), {
      headers: {
        "Content-Type": "text/html; charset=utf-8"
      }
    });
  }
};
