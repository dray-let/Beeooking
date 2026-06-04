const demoUsers = [
  { id: "user_super", name: "Super Admin", email: "super@beeooking.com", role: "super_admin" },
  { id: "user_club_admin", name: "Club Admin", email: "clubadmin@beeooking.com", role: "club_admin" },
  { id: "user_staff", name: "Front Desk", email: "staff@beeooking.com", role: "staff" },
  { id: "user_parent", name: "Demo Parent", email: "parent@example.com", role: "parent" },
  { id: "user_member", name: "Demo Member", email: "member@example.com", role: "member" }
];

const initialState = {
  clubs: [
    {
      id: "club_demo",
      name: "Beeooking Demo Club",
      slug: "beeooking-demo",
      timezone: "America/New_York",
      organizationEmailDomain: "beeooking.com",
      setupStatus: "draft",
      activities: [
        { activityType: "squash", resourceUnit: "court", resourceCount: 4 },
        { activityType: "tennis", resourceUnit: "court", resourceCount: 3 },
        { activityType: "swimming", resourceUnit: "lane", resourceCount: 6 },
        { activityType: "fitness", resourceUnit: "studio", resourceCount: 2 },
        { activityType: "health", resourceUnit: "room", resourceCount: 3 }
      ]
    }
  ],
  families: [
    {
      id: "family_demo",
      clubId: "club_demo",
      name: "Demo Family",
      primaryContactUserId: "user_parent",
      billingOwnerUserId: "user_parent",
      reviewStatus: "pending_admin_review",
      paymentStatus: "not_started",
      members: [
        {
          id: "family_member_parent",
          userId: "user_parent",
          firstName: "Demo",
          lastName: "Parent",
          dateOfBirth: "1985-05-05",
          relationship: "main_member",
          participationStatus: "non_active",
          isGuardian: true
        },
        {
          id: "family_member_child",
          userId: "user_child",
          firstName: "Demo",
          lastName: "Junior",
          dateOfBirth: "2014-06-06",
          relationship: "dependent",
          participationStatus: "active",
          isGuardian: false
        }
      ]
    }
  ],
  waivers: [
    {
      id: "waiver_family_v1",
      clubId: "club_demo",
      name: "Family Participation Waiver",
      version: "v1",
      defaultCoverageScope: "family",
      responsibilityStatement: "Signer accepts responsibility for all listed family members.",
      status: "active"
    }
  ],
  waiverSignatures: []
};

let memoryState = structuredClone(initialState);

async function loadState(env) {
  if (!env?.DB) return;
  try {
    const row = await env.DB.prepare("select value from app_state where key = ?").bind("layer1").first();
    if (row?.value) {
      memoryState = JSON.parse(row.value);
      return;
    }
    await persistState(env);
  } catch {
    // D1 binding can exist before migrations are applied; keep the app usable.
  }
}

async function persistState(env) {
  if (!env?.DB) return;
  try {
    await env.DB
      .prepare(
        "insert into app_state (key, value, updated_at) values (?, ?, current_timestamp) " +
        "on conflict(key) do update set value = excluded.value, updated_at = current_timestamp"
      )
      .bind("layer1", JSON.stringify(memoryState))
      .run();
  } catch {
    // See loadState note: missing migrations should not break the preview.
  }
}

function json(data, init = {}) {
  return new Response(JSON.stringify(data, null, 2), {
    ...init,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      ...(init.headers || {})
    }
  });
}

function readCookie(request, name) {
  const cookie = request.headers.get("Cookie") || "";
  const part = cookie.split(";").map((item) => item.trim()).find((item) => item.startsWith(`${name}=`));
  return part ? decodeURIComponent(part.slice(name.length + 1)) : "";
}

function currentUser(request) {
  const id = readCookie(request, "beeooking_user") || "user_super";
  return demoUsers.find((user) => user.id === id) || demoUsers[0];
}

function parseBody(request) {
  return request.json().catch(() => ({}));
}

function isAdult(dateOfBirth) {
  if (!dateOfBirth) return false;
  const birth = new Date(`${dateOfBirth}T00:00:00Z`);
  const now = new Date();
  let age = now.getUTCFullYear() - birth.getUTCFullYear();
  const monthDelta = now.getUTCMonth() - birth.getUTCMonth();
  if (monthDelta < 0 || (monthDelta === 0 && now.getUTCDate() < birth.getUTCDate())) age -= 1;
  return age >= 18;
}

function canManageClubSetup(user) {
  return user.role === "super_admin";
}

function canManageFamilies(user) {
  return ["super_admin", "club_admin", "staff", "parent"].includes(user.role);
}

function canSignFamilyWaiver(user, family) {
  if (["super_admin", "club_admin"].includes(user.role)) return true;
  return family.members.some((member) => member.userId === user.id && member.isGuardian && isAdult(member.dateOfBirth));
}

function canReviewMembership(user) {
  return ["super_admin", "club_admin"].includes(user.role);
}

function activeWaiverForClub(clubId) {
  return memoryState.waivers.find((waiver) => waiver.clubId === clubId && waiver.status === "active");
}

function familyWaiverSignature(familyId, waiverId) {
  return memoryState.waiverSignatures.find(
    (signature) => signature.coveredFamilyId === familyId && signature.waiverId === waiverId && signature.status === "signed"
  );
}

function familyWaiverStatus(family) {
  const waiver = activeWaiverForClub(family.clubId);
  if (!waiver) return { status: "not_required", label: "No active waiver" };
  const signature = familyWaiverSignature(family.id, waiver.id);
  if (signature) return { status: "complete", label: `Signed ${waiver.version}` };
  return { status: "blocked", label: "Family waiver required" };
}

function bookingGateForFamily(family) {
  const waiver = familyWaiverStatus(family);
  if (waiver.status === "blocked") {
    return {
      allowed: false,
      code: "waiver_required",
      message: "Required family waiver must be signed before booking."
    };
  }
  return {
    allowed: true,
    code: "booking_allowed",
    message: "Waiver is complete. Booking can continue to access, pricing, and conflict checks."
  };
}

function withDerivedState() {
  return {
    ...memoryState,
    families: memoryState.families.map((family) => ({
      ...family,
      waiverStatus: familyWaiverStatus(family),
      bookingGate: bookingGateForFamily(family)
    }))
  };
}

function routeParts(pathname) {
  return pathname.split("/").filter(Boolean);
}

export async function handleAppApi(request, env = {}) {
  await loadState(env);
  const url = new URL(request.url);
  const parts = routeParts(url.pathname);
  const user = currentUser(request);

  async function saved(data, init) {
    await persistState(env);
    return json(data, init);
  }

  if (url.pathname === "/api/app/session") {
    return json({ data: { user, demoUsers, state: withDerivedState() } });
  }

  if (url.pathname === "/api/auth/demo-login" && request.method === "POST") {
    const body = await parseBody(request);
    const selected = demoUsers.find((item) => item.id === body.userId) || demoUsers[0];
    return json(
      { data: { user: selected } },
      {
        headers: {
          "Set-Cookie": `beeooking_user=${encodeURIComponent(selected.id)}; Path=/; SameSite=Lax; Max-Age=2592000`
        }
      }
    );
  }

  if (url.pathname === "/api/clubs" && request.method === "GET") {
    return json({ data: memoryState.clubs });
  }

  if (url.pathname === "/api/clubs" && request.method === "POST") {
    if (!canManageClubSetup(user)) {
      return json({ error: { code: "permission_denied", message: "Only Super Admin can create clubs." } }, { status: 403 });
    }
    const body = await parseBody(request);
    const club = {
      id: `club_${Date.now()}`,
      name: body.name || "New Club",
      slug: body.slug || `club-${Date.now()}`,
      timezone: body.timezone || "America/New_York",
      organizationEmailDomain: body.organizationEmailDomain || "",
      setupStatus: "draft",
      activities: []
    };
    memoryState.clubs.push(club);
    return saved({ data: club }, { status: 201 });
  }

  if (parts[0] === "api" && parts[1] === "clubs" && parts[3] === "setup" && request.method === "PUT") {
    if (!canManageClubSetup(user)) {
      return json({ error: { code: "permission_denied", message: "Only Super Admin can update club setup." } }, { status: 403 });
    }
    const club = memoryState.clubs.find((item) => item.id === parts[2]);
    if (!club) return json({ error: { code: "not_found", message: "Club not found." } }, { status: 404 });
    const body = await parseBody(request);
    club.name = body.name || club.name;
    club.timezone = body.timezone || club.timezone;
    club.organizationEmailDomain = body.organizationEmailDomain || club.organizationEmailDomain;
    club.activities = Array.isArray(body.activities) ? body.activities : club.activities;
    club.setupStatus = body.setupStatus || "ready_for_admin";
    return saved({ data: club });
  }

  if (parts.length === 4 && parts[0] === "api" && parts[1] === "clubs" && parts[3] === "families" && request.method === "GET") {
    const families = withDerivedState().families.filter((family) => family.clubId === parts[2]);
    return json({ data: families });
  }

  if (parts.length === 4 && parts[0] === "api" && parts[1] === "clubs" && parts[3] === "families" && request.method === "POST") {
    if (!canManageFamilies(user)) {
      return json({ error: { code: "permission_denied", message: "You cannot create family records." } }, { status: 403 });
    }
    const body = await parseBody(request);
    if (!body.name || !body.mainMember?.dateOfBirth) {
      return json({ error: { code: "missing_required_fields", message: "Family name and main member date of birth are required." } }, { status: 400 });
    }
    const familyId = `family_${Date.now()}`;
    const mainMember = {
      id: `family_member_${Date.now()}`,
      userId: user.role === "parent" ? user.id : `user_${Date.now()}`,
      firstName: body.mainMember.firstName || "Main",
      lastName: body.mainMember.lastName || "Member",
      dateOfBirth: body.mainMember.dateOfBirth,
      relationship: "main_member",
      participationStatus: body.mainMember.participationStatus || "active",
      isGuardian: true
    };
    const family = {
      id: familyId,
      clubId: parts[2],
      name: body.name,
      primaryContactUserId: mainMember.userId,
      billingOwnerUserId: mainMember.userId,
      reviewStatus: "draft",
      paymentStatus: "not_started",
      members: [mainMember]
    };
    memoryState.families.push(family);
    return saved({ data: { ...family, waiverStatus: familyWaiverStatus(family), bookingGate: bookingGateForFamily(family) } }, { status: 201 });
  }

  if (parts[0] === "api" && parts[1] === "clubs" && parts[3] === "families" && parts[5] === "members" && request.method === "POST") {
    if (!canManageFamilies(user)) {
      return json({ error: { code: "permission_denied", message: "You cannot add family members." } }, { status: 403 });
    }
    const family = memoryState.families.find((item) => item.clubId === parts[2] && item.id === parts[4]);
    if (!family) return json({ error: { code: "not_found", message: "Family not found." } }, { status: 404 });
    const body = await parseBody(request);
    if (!body.dateOfBirth) {
      return json({ error: { code: "date_of_birth_required", message: "Date of birth is required for every member." } }, { status: 400 });
    }
    const relationship = body.relationship || "dependent";
    if (relationship === "spousal_member" && family.members.some((member) => member.relationship === "spousal_member")) {
      return json({ error: { code: "spouse_limit_reached", message: "Only one spousal member is allowed." } }, { status: 409 });
    }
    if (relationship === "dependent" && isAdult(body.dateOfBirth)) {
      return json({ error: { code: "dependent_must_be_under_18", message: "Additional dependent family members must be under 18." } }, { status: 409 });
    }
    const member = {
      id: `family_member_${Date.now()}`,
      userId: `user_${Date.now()}`,
      firstName: body.firstName || "New",
      lastName: body.lastName || "Member",
      dateOfBirth: body.dateOfBirth,
      relationship,
      participationStatus: body.participationStatus || "active",
      isGuardian: relationship === "spousal_member"
    };
    family.members.push(member);
    family.reviewStatus = "pending_admin_review";
    return saved({ data: { ...family, waiverStatus: familyWaiverStatus(family), bookingGate: bookingGateForFamily(family) } }, { status: 201 });
  }

  if (parts[0] === "api" && parts[1] === "clubs" && parts[3] === "families" && parts[5] === "review" && request.method === "POST") {
    if (!canReviewMembership(user)) {
      return json({ error: { code: "permission_denied", message: "Only Club Admin or Super Admin can review memberships." } }, { status: 403 });
    }
    const family = memoryState.families.find((item) => item.clubId === parts[2] && item.id === parts[4]);
    if (!family) return json({ error: { code: "not_found", message: "Family not found." } }, { status: 404 });
    const body = await parseBody(request);
    family.reviewStatus = body.reviewStatus || "approved_and_locked";
    return saved({ data: { ...family, waiverStatus: familyWaiverStatus(family), bookingGate: bookingGateForFamily(family) } });
  }

  if (parts[0] === "api" && parts[1] === "clubs" && parts[3] === "waiver-signatures" && request.method === "POST") {
    const body = await parseBody(request);
    const family = memoryState.families.find((item) => item.clubId === parts[2] && item.id === body.coveredFamilyId);
    if (!family) return json({ error: { code: "not_found", message: "Family not found." } }, { status: 404 });
    if (!canSignFamilyWaiver(user, family)) {
      return json({ error: { code: "permission_denied", message: "Only an adult guardian, Club Admin, or Super Admin can sign this waiver." } }, { status: 403 });
    }
    const waiver = activeWaiverForClub(parts[2]);
    if (!waiver) return json({ error: { code: "not_found", message: "No active waiver is configured." } }, { status: 404 });
    const existing = familyWaiverSignature(family.id, waiver.id);
    if (existing) return json({ data: existing });
    const signature = {
      id: `waiver_signature_${Date.now()}`,
      clubId: parts[2],
      waiverId: waiver.id,
      coveredFamilyId: family.id,
      coverageScope: "family",
      signedByUserId: user.id,
      status: "signed",
      signedAt: new Date().toISOString()
    };
    memoryState.waiverSignatures.push(signature);
    return saved({ data: signature }, { status: 201 });
  }

  if (parts[0] === "api" && parts[1] === "clubs" && parts[3] === "booking-gate" && request.method === "POST") {
    const body = await parseBody(request);
    const family = memoryState.families.find((item) => item.clubId === parts[2] && item.id === body.familyId);
    if (!family) return json({ error: { code: "not_found", message: "Family not found." } }, { status: 404 });
    return json({ data: bookingGateForFamily(family) });
  }

  return json({ error: { code: "not_found", message: "API route not found." } }, { status: 404 });
}

export function renderAppShell() {
  const club = initialState.clubs[0];
  return `<!doctype html>
  <html lang="en">
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1">
      <title>Beeooking App Foundation</title>
      <style>
        :root {
          --ink: #17212b;
          --muted: #64717f;
          --line: #d9e1e8;
          --surface: #f6f8fa;
          --accent: #0f766e;
          --accent-soft: #ddf5f1;
          --warn: #94590d;
          --warn-soft: #fff0d6;
        }

        * { box-sizing: border-box; }

        body {
          margin: 0;
          color: var(--ink);
          background: #fff;
          font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
        }

        main {
          width: min(1180px, calc(100% - 28px));
          margin: 0 auto;
          padding: 28px 0 48px;
        }

        header {
          display: grid;
          grid-template-columns: minmax(0, 1fr) 260px;
          gap: 18px;
          align-items: end;
          padding-bottom: 22px;
          border-bottom: 1px solid var(--line);
        }

        h1, h2, h3 { margin: 0; letter-spacing: 0; }
        h1 { font-size: 38px; line-height: 1.05; }
        p { color: var(--muted); line-height: 1.5; }

        .session-card,
        .panel,
        .stat,
        .family-card,
        .resource-card {
          border: 1px solid var(--line);
          border-radius: 8px;
          background: var(--surface);
        }

        .session-card { padding: 16px; }
        .session-card strong, .session-card span { display: block; }
        .session-card span { margin-top: 4px; color: var(--muted); }

        .role-buttons,
        .tabs,
        .actions {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
        }

        button, input, select {
          min-height: 38px;
          border: 1px solid var(--line);
          border-radius: 8px;
          font: inherit;
        }

        button {
          padding: 8px 11px;
          background: #fff;
          color: var(--ink);
          font-weight: 760;
          cursor: pointer;
        }

        button.primary,
        button.is-active {
          border-color: var(--accent);
          background: var(--accent-soft);
          color: #075c55;
        }

        input, select {
          width: 100%;
          padding: 7px 9px;
          background: #fff;
        }

        label {
          display: grid;
          gap: 6px;
          color: var(--muted);
          font-size: 13px;
          font-weight: 750;
        }

        section { margin-top: 20px; }

        .tabs {
          position: sticky;
          top: 0;
          z-index: 2;
          padding: 10px 0;
          background: #fff;
        }

        .view { display: none; }
        .view.is-active { display: block; }

        .panel {
          padding: 16px;
        }

        .grid-2 {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 12px;
        }

        .grid-3 {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 12px;
        }

        .stat {
          min-height: 104px;
          padding: 14px;
          background: #fff;
        }

        .stat span, .stat small { color: var(--muted); font-weight: 720; }
        .stat strong { display: block; margin: 7px 0 4px; font-size: 28px; }

        .form-grid {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 10px;
          margin-top: 12px;
        }

        .families {
          display: grid;
          gap: 12px;
          margin-top: 12px;
        }

        .family-card {
          padding: 0;
          background: #fff;
          overflow: hidden;
        }

        .family-head,
        .family-body,
        .family-actions {
          padding: 14px;
        }

        .family-head {
          display: flex;
          justify-content: space-between;
          gap: 12px;
          border-bottom: 1px solid var(--line);
        }

        .badge {
          display: inline-flex;
          align-items: center;
          min-height: 28px;
          padding: 4px 8px;
          border: 1px solid var(--line);
          border-radius: 999px;
          background: #fff;
          color: var(--accent);
          font-size: 12px;
          font-weight: 820;
          white-space: nowrap;
        }

        .badge.warn {
          color: var(--warn);
          border-color: #e8bd72;
          background: var(--warn-soft);
        }

        table {
          width: 100%;
          border-collapse: collapse;
          margin-top: 10px;
          font-size: 14px;
        }

        th, td {
          padding: 10px;
          border-bottom: 1px solid var(--line);
          text-align: left;
          vertical-align: top;
        }

        th small {
          display: block;
          margin-top: 3px;
          color: var(--muted);
          font-weight: 650;
        }

        .resource-card {
          padding: 14px;
          background: #fff;
        }

        .notice {
          margin-top: 12px;
          padding: 12px;
          border: 1px solid var(--line);
          border-radius: 8px;
          background: #fff;
          color: var(--muted);
        }

        .notice.warn {
          border-color: #e8bd72;
          background: var(--warn-soft);
          color: #5d3b0a;
        }

        @media (max-width: 780px) {
          header,
          .grid-2,
          .grid-3,
          .form-grid {
            grid-template-columns: 1fr;
          }
        }
      </style>
    </head>
    <body>
      <main>
        <header>
          <div>
            <h1>Beeooking App Foundation</h1>
            <p>Real Layer 1 structure for auth, club setup, families, saved state, and waiver gating. This runs as a Cloudflare Worker with a D1-ready schema.</p>
          </div>
          <aside class="session-card">
            <strong data-user-name>Loading</strong>
            <span data-user-role>Checking session</span>
          </aside>
        </header>

        <section class="panel">
          <h2>Demo Authentication</h2>
          <p>Switch roles to test what each user can do. The selection is saved in a cookie.</p>
          <div class="role-buttons" data-role-buttons></div>
        </section>

        <nav class="tabs" aria-label="App foundation views">
          <button class="is-active" data-app-tab="setup" type="button">Club Setup</button>
          <button data-app-tab="families" type="button">Members & Families</button>
          <button data-app-tab="waivers" type="button">Waiver Gate</button>
          <button data-app-tab="resources" type="button">Resources</button>
        </nav>

        <section class="view is-active" data-app-panel="setup">
          <div class="panel">
            <h2>Club Setup Flow</h2>
            <p>Super Admin can update the club name, organization email domain, and activity/resource counts.</p>
            <form class="form-grid" data-club-setup-form>
              <label>Club name<input name="name" value="${club.name}" required></label>
              <label>Organization email domain<input name="organizationEmailDomain" value="${club.organizationEmailDomain}" required></label>
              <label>Timezone<input name="timezone" value="${club.timezone}" required></label>
              <label>Squash courts<input name="squash" type="number" min="0" value="4"></label>
              <label>Tennis courts<input name="tennis" type="number" min="0" value="3"></label>
              <label>Swimming lanes<input name="swimming" type="number" min="0" value="6"></label>
              <div class="actions">
                <button class="primary" type="submit">Save club setup</button>
              </div>
            </form>
            <div class="notice" data-setup-result>Setup changes will appear here.</div>
          </div>
        </section>

        <section class="view" data-app-panel="families">
          <div class="grid-3" data-family-stats></div>
          <div class="panel">
            <h2>Create Family</h2>
            <p>Create an adult account first, then add spouse or dependent records after that.</p>
            <form class="form-grid" data-family-form>
              <label>Family name<input name="name" value="New Demo Family" required></label>
              <label>Main first name<input name="firstName" value="New" required></label>
              <label>Main last name<input name="lastName" value="Parent" required></label>
              <label>Main DOB<input name="dateOfBirth" type="date" value="1987-01-01" required></label>
              <label>Status<select name="participationStatus"><option value="active">Active</option><option value="non_active">Non-active</option></select></label>
              <div class="actions"><button class="primary" type="submit">Create family</button></div>
            </form>
          </div>
          <div class="families" data-families-list></div>
        </section>

        <section class="view" data-app-panel="waivers">
          <div class="panel">
            <h2>Waiver Signing Gate</h2>
            <p>Required family waivers block booking until signed by an adult guardian, Club Admin, or Super Admin.</p>
            <div class="families" data-waiver-list></div>
          </div>
        </section>

        <section class="view" data-app-panel="resources">
          <div class="panel">
            <h2>Bookable Resources</h2>
            <p>These are generated from the club setup activity/resource counts.</p>
            <div class="grid-3" data-resource-list></div>
          </div>
        </section>
      </main>
      <script>
        const state = { clubId: "club_demo", session: null };

        async function api(path, options = {}) {
          const response = await fetch(path, {
            ...options,
            headers: {
              "Content-Type": "application/json",
              ...(options.headers || {})
            }
          });
          const body = await response.json();
          if (!response.ok) throw new Error(body.error?.message || "Request failed");
          return body.data;
        }

        function escapeHtml(value) {
          return String(value ?? "").replace(/[&<>"']/g, (char) => ({
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            '"': "&quot;",
            "'": "&#039;"
          }[char]));
        }

        function roleLabel(role) {
          return role.split("_").map((part) => part.charAt(0).toUpperCase() + part.slice(1)).join(" ");
        }

        function renderSession() {
          document.querySelector("[data-user-name]").textContent = state.session.user.name;
          document.querySelector("[data-user-role]").textContent = roleLabel(state.session.user.role);
          document.querySelector("[data-role-buttons]").innerHTML = state.session.demoUsers.map((user) =>
            "<button type='button' class='" + (user.id === state.session.user.id ? "is-active" : "") + "' data-login-user='" + user.id + "'>" +
            escapeHtml(user.name) + "<br><small>" + escapeHtml(roleLabel(user.role)) + "</small></button>"
          ).join("");
          document.querySelectorAll("[data-login-user]").forEach((button) => {
            button.addEventListener("click", async () => {
              await api("/api/auth/demo-login", { method: "POST", body: JSON.stringify({ userId: button.dataset.loginUser }) });
              await load();
            });
          });
        }

        function renderStats(families) {
          const blocked = families.filter((family) => family.waiverStatus.status === "blocked").length;
          const pending = families.filter((family) => family.reviewStatus.includes("pending") || family.reviewStatus === "draft").length;
          const activeMembers = families.flatMap((family) => family.members).filter((member) => member.participationStatus === "active").length;
          document.querySelector("[data-family-stats]").innerHTML = [
            ["Families", families.length, "Saved family records"],
            ["Active members", activeMembers, "Participant-level status"],
            ["Waiver blocked", blocked, "Cannot book yet"],
            ["Review needed", pending, "Admin approval queue"]
          ].map(([label, value, detail]) =>
            "<article class='stat'><span>" + label + "</span><strong>" + value + "</strong><small>" + detail + "</small></article>"
          ).join("");
        }

        function renderFamilies() {
          const families = state.session.state.families;
          renderStats(families);
          document.querySelector("[data-families-list]").innerHTML = families.map((family) => familyCard(family, true)).join("");
          document.querySelector("[data-waiver-list]").innerHTML = families.map((family) => familyCard(family, false)).join("");
          bindFamilyActions();
        }

        function familyCard(family, includeMemberForm) {
          const waiverClass = family.waiverStatus.status === "blocked" ? "warn" : "";
          const members = family.members.map((member) =>
            "<tr><th>" + escapeHtml(member.firstName + " " + member.lastName) + "<small>" + escapeHtml(member.relationship) + "</small></th>" +
            "<td>" + escapeHtml(member.dateOfBirth) + "</td><td>" + escapeHtml(member.participationStatus) + "</td></tr>"
          ).join("");
          const addMember = includeMemberForm ? 
            "<form class='form-grid' data-add-member-form='" + family.id + "'>" +
            "<label>First name<input name='firstName' value='New' required></label>" +
            "<label>Last name<input name='lastName' value='Junior' required></label>" +
            "<label>DOB<input name='dateOfBirth' type='date' value='2015-01-01' required></label>" +
            "<label>Relationship<select name='relationship'><option value='dependent'>Dependent</option><option value='spousal_member'>Spousal member</option></select></label>" +
            "<label>Status<select name='participationStatus'><option value='active'>Active</option><option value='non_active'>Non-active</option></select></label>" +
            "<div class='actions'><button type='submit'>Add member</button></div></form>" : "";
          return "<article class='family-card'><div class='family-head'><div><h3>" + escapeHtml(family.name) + "</h3><p>" + escapeHtml(family.reviewStatus) + "</p></div>" +
            "<span class='badge " + waiverClass + "'>" + escapeHtml(family.waiverStatus.label) + "</span></div>" +
            "<div class='family-body'><table><tbody>" + members + "</tbody></table>" + addMember + "</div>" +
            "<div class='family-actions actions'><button type='button' data-sign-waiver='" + family.id + "'>Sign family waiver</button>" +
            "<button type='button' data-booking-gate='" + family.id + "'>Test booking gate</button>" +
            "<button type='button' data-review-family='" + family.id + "'>Approve membership</button></div>" +
            "<div class='notice " + (family.bookingGate.allowed ? "" : "warn") + "' data-family-result='" + family.id + "'>" + escapeHtml(family.bookingGate.message) + "</div></article>";
        }

        function renderResources() {
          const club = state.session.state.clubs.find((item) => item.id === state.clubId);
          document.querySelector("[data-resource-list]").innerHTML = club.activities.map((activity) =>
            "<article class='resource-card'><h3>" + escapeHtml(activity.activityType) + "</h3>" +
            "<p><strong>" + escapeHtml(activity.resourceCount) + "</strong> " + escapeHtml(activity.resourceUnit) + "s</p></article>"
          ).join("");
        }

        function bindFamilyActions() {
          document.querySelectorAll("[data-add-member-form]").forEach((form) => {
            form.addEventListener("submit", async (event) => {
              event.preventDefault();
              const body = Object.fromEntries(new FormData(form).entries());
              try {
                await api("/api/clubs/" + state.clubId + "/families/" + form.dataset.addMemberForm + "/members", { method: "POST", body: JSON.stringify(body) });
                await load();
              } catch (error) {
                alert(error.message);
              }
            });
          });
          document.querySelectorAll("[data-sign-waiver]").forEach((button) => {
            button.addEventListener("click", async () => {
              try {
                await api("/api/clubs/" + state.clubId + "/waiver-signatures", { method: "POST", body: JSON.stringify({ coveredFamilyId: button.dataset.signWaiver }) });
                await load();
              } catch (error) {
                alert(error.message);
              }
            });
          });
          document.querySelectorAll("[data-booking-gate]").forEach((button) => {
            button.addEventListener("click", async () => {
              const result = await api("/api/clubs/" + state.clubId + "/booking-gate", { method: "POST", body: JSON.stringify({ familyId: button.dataset.bookingGate }) });
              const target = document.querySelector("[data-family-result='" + button.dataset.bookingGate + "']");
              target.classList.toggle("warn", !result.allowed);
              target.textContent = result.message;
            });
          });
          document.querySelectorAll("[data-review-family]").forEach((button) => {
            button.addEventListener("click", async () => {
              try {
                await api("/api/clubs/" + state.clubId + "/families/" + button.dataset.reviewFamily + "/review", { method: "POST", body: JSON.stringify({ reviewStatus: "approved_and_locked" }) });
                await load();
              } catch (error) {
                alert(error.message);
              }
            });
          });
        }

        document.querySelectorAll("[data-app-tab]").forEach((button) => {
          button.addEventListener("click", () => {
            const tab = button.dataset.appTab;
            document.querySelectorAll("[data-app-tab]").forEach((item) => item.classList.toggle("is-active", item === button));
            document.querySelectorAll("[data-app-panel]").forEach((panel) => panel.classList.toggle("is-active", panel.dataset.appPanel === tab));
          });
        });

        document.querySelector("[data-club-setup-form]").addEventListener("submit", async (event) => {
          event.preventDefault();
          const form = event.currentTarget;
          const fields = Object.fromEntries(new FormData(form).entries());
          const activities = [
            { activityType: "squash", resourceUnit: "court", resourceCount: Number(fields.squash || 0) },
            { activityType: "tennis", resourceUnit: "court", resourceCount: Number(fields.tennis || 0) },
            { activityType: "swimming", resourceUnit: "lane", resourceCount: Number(fields.swimming || 0) }
          ];
          try {
            const club = await api("/api/clubs/" + state.clubId + "/setup", {
              method: "PUT",
              body: JSON.stringify({ ...fields, activities, setupStatus: "ready_for_admin" })
            });
            document.querySelector("[data-setup-result]").textContent = "Saved setup for " + club.name + ".";
            await load();
          } catch (error) {
            document.querySelector("[data-setup-result]").textContent = error.message;
          }
        });

        document.querySelector("[data-family-form]").addEventListener("submit", async (event) => {
          event.preventDefault();
          const fields = Object.fromEntries(new FormData(event.currentTarget).entries());
          try {
            await api("/api/clubs/" + state.clubId + "/families", {
              method: "POST",
              body: JSON.stringify({
                name: fields.name,
                mainMember: {
                  firstName: fields.firstName,
                  lastName: fields.lastName,
                  dateOfBirth: fields.dateOfBirth,
                  participationStatus: fields.participationStatus
                }
              })
            });
            await load();
          } catch (error) {
            alert(error.message);
          }
        });

        async function load() {
          state.session = await api("/api/app/session");
          renderSession();
          renderFamilies();
          renderResources();
        }

        load();
      </script>
    </body>
  </html>`;
}
