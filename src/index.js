const artifacts = [
  ["Layer 1", "Club Operating System", "User management, memberships, bookings, payments, communications, and multi-club architecture."],
  ["Layer 2", "Player Development Platform", "Coach feedback, session notes, goals, skill assessments, report cards, and progress dashboards."],
  ["Layer 3", "Competition Platform", "Ladders, challenges, round robins, leagues, tournament registration, and match history."],
  ["Layer 4", "AI Platform", "AI Coach, AI Club Manager, AI Player Development, recommendations, insights, and outcomes."],
  ["Layer 5", "Ecosystem & Scale Platform", "Integrations, partner APIs, analytics, benchmarking, organizations, exports, and governance."]
];

function renderPage() {
  const cards = artifacts
    .map(([layer, title, body]) => `
      <article class="card">
        <p class="eyebrow">${layer}</p>
        <h2>${title}</h2>
        <p>${body}</p>
      </article>
    `)
    .join("");

  return `<!doctype html>
  <html lang="en">
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1">
      <title>Beeooking Product Strategy</title>
      <style>
        :root {
          color-scheme: light;
          --ink: #18202a;
          --muted: #5f6f7e;
          --line: #d9e0e7;
          --surface: #f7f9fb;
          --accent: #0f766e;
          --accent-soft: #d9f5ef;
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
          width: min(1120px, calc(100% - 32px));
          margin: 0 auto;
          padding: 56px 0;
        }

        header {
          display: grid;
          gap: 16px;
          padding-bottom: 36px;
          border-bottom: 1px solid var(--line);
        }

        h1 {
          max-width: 760px;
          margin: 0;
          font-size: clamp(36px, 5vw, 64px);
          line-height: 1.02;
          letter-spacing: 0;
        }

        .lede {
          max-width: 740px;
          margin: 0;
          color: var(--muted);
          font-size: 18px;
          line-height: 1.65;
        }

        .grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
          gap: 16px;
          margin-top: 32px;
        }

        .card {
          min-height: 220px;
          padding: 22px;
          border: 1px solid var(--line);
          border-radius: 8px;
          background: var(--surface);
        }

        .eyebrow {
          display: inline-flex;
          margin: 0 0 18px;
          padding: 5px 9px;
          border-radius: 999px;
          background: var(--accent-soft);
          color: var(--accent);
          font-size: 12px;
          font-weight: 700;
          letter-spacing: 0;
          text-transform: uppercase;
        }

        h2 {
          margin: 0 0 12px;
          font-size: 22px;
          line-height: 1.2;
          letter-spacing: 0;
        }

        .card p:last-child {
          margin: 0;
          color: var(--muted);
          line-height: 1.55;
        }

        footer {
          margin-top: 36px;
          padding-top: 24px;
          border-top: 1px solid var(--line);
          color: var(--muted);
          font-size: 14px;
        }
      </style>
    </head>
    <body>
      <main>
        <header>
          <h1>Beeooking layered product strategy</h1>
          <p class="lede">A practical build sequence for a club operating system that expands into player development, competition, AI recommendations, and platform-scale integrations.</p>
        </header>
        <section class="grid" aria-label="Beeooking strategy layers">
          ${cards}
        </section>
        <footer>
          Strategy artifacts live in the repository outputs folder.
        </footer>
      </main>
    </body>
  </html>`;
}

export default {
  async fetch() {
    return new Response(renderPage(), {
      headers: {
        "Content-Type": "text/html; charset=utf-8"
      }
    });
  }
};
