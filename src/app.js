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
  emergencyContacts: [
    {
      id: "emergency_contact_demo",
      clubId: "club_demo",
      userId: "user_child",
      name: "Demo Parent",
      relationship: "Parent",
      phone: "555-0100",
      email: "parent@example.com",
      isPrimary: true
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
const memorySessions = new Map();

function hasD1(env) {
  return Boolean(env?.DB);
}

function newId(prefix) {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

function userNameParts(user) {
  const parts = user.name.split(" ");
  return {
    firstName: parts[0] || "Demo",
    lastName: parts.slice(1).join(" ") || "User"
  };
}

function mapClub(row, activities) {
  return {
    id: row.id,
    name: row.name,
    slug: row.slug,
    timezone: row.timezone,
    organizationEmailDomain: row.organization_email_domain || "",
    setupStatus: row.setup_status,
    activities
  };
}

function mapFamily(row, members) {
  return {
    id: row.id,
    clubId: row.club_id,
    name: row.name,
    primaryContactUserId: row.primary_contact_user_id,
    billingOwnerUserId: row.billing_owner_user_id,
    reviewStatus: row.review_status,
    paymentStatus: row.payment_status,
    members
  };
}

function mapFamilyMember(row) {
  return {
    id: row.id,
    userId: row.user_id,
    firstName: row.first_name,
    lastName: row.last_name,
    dateOfBirth: row.date_of_birth,
    relationship: row.relationship,
    participationStatus: row.participation_status,
    isGuardian: Boolean(row.is_guardian)
  };
}

function mapEmergencyContact(row) {
  return {
    id: row.id,
    clubId: row.club_id,
    userId: row.user_id,
    name: row.name,
    relationship: row.relationship || "",
    phone: row.phone,
    email: row.email || "",
    isPrimary: Boolean(row.is_primary)
  };
}

function mapWaiver(row) {
  return {
    id: row.id,
    clubId: row.club_id,
    name: row.name,
    version: row.version,
    defaultCoverageScope: row.default_coverage_scope,
    responsibilityStatement: row.responsibility_statement,
    status: row.status
  };
}

function mapSignature(row) {
  return {
    id: row.id,
    clubId: row.club_id,
    waiverId: row.waiver_id,
    subjectUserId: row.subject_user_id,
    coveredFamilyId: row.covered_family_id,
    coverageScope: row.coverage_scope,
    signedByUserId: row.signed_by_user_id,
    status: row.status,
    signedAt: row.signed_at
  };
}

function mapUserSession(row) {
  return {
    id: row.id,
    name: `${row.first_name} ${row.last_name}`,
    email: row.email,
    role: row.role || "member"
  };
}

async function all(db, sql, ...bindings) {
  const result = await db.prepare(sql).bind(...bindings).all();
  return result.results || [];
}

async function first(db, sql, ...bindings) {
  return db.prepare(sql).bind(...bindings).first();
}

async function loadState(env) {
  if (!hasD1(env)) return;
  try {
    await seedD1IfEmpty(env.DB);
    memoryState = await readD1State(env.DB);
  } catch {
    // D1 binding can exist before migrations are applied; keep the app usable.
  }
}

async function persistState(env) {
  if (!hasD1(env)) return;
  try {
    await writeD1State(env.DB, memoryState);
  } catch {
    // See loadState note: missing migrations should not break the preview.
  }
}

async function seedD1IfEmpty(db) {
  const existing = await first(db, "select id from clubs limit 1");
  if (existing) return;
  await writeD1State(db, structuredClone(initialState));
}

async function readD1State(db) {
  const clubRows = await all(db, "select * from clubs order by created_at, name");
  const activityRows = await all(db, "select * from club_activities order by created_at, activity_type");
  const familyRows = await all(db, "select * from families order by created_at, name");
  const familyMemberRows = await all(db, "select * from family_members order by created_at, relationship");
  const emergencyContactRows = await all(db, "select * from emergency_contacts order by created_at, name");
  const waiverRows = await all(db, "select * from waivers order by created_at, name");
  const signatureRows = await all(db, "select * from waiver_signatures order by signed_at");

  return {
    clubs: clubRows.map((club) =>
      mapClub(
        club,
        activityRows
          .filter((activity) => activity.club_id === club.id)
          .map((activity) => ({
            activityType: activity.activity_type,
            resourceUnit: activity.resource_unit,
            resourceCount: activity.resource_count
          }))
      )
    ),
    families: familyRows.map((family) =>
      mapFamily(
        family,
        familyMemberRows.filter((member) => member.family_id === family.id).map(mapFamilyMember)
      )
    ),
    emergencyContacts: emergencyContactRows.map(mapEmergencyContact),
    waivers: waiverRows.map(mapWaiver),
    waiverSignatures: signatureRows.map(mapSignature)
  };
}

async function writeD1State(db, state) {
  for (const user of demoUsers) {
    const { firstName, lastName } = userNameParts(user);
    await db
      .prepare(
        "insert into users (id, email, first_name, last_name, date_of_birth, updated_at) values (?, ?, ?, ?, ?, current_timestamp) " +
        "on conflict(id) do update set email = excluded.email, first_name = excluded.first_name, last_name = excluded.last_name, updated_at = current_timestamp"
      )
      .bind(user.id, user.email, firstName, lastName, user.id === "user_member" ? "1995-01-01" : "1985-01-01")
      .run();
    await db
      .prepare(
        "insert into role_assignments (id, club_id, user_id, role, permissions, validation_metadata) values (?, ?, ?, ?, ?, ?) " +
          "on conflict(club_id, user_id, role) do update set permissions = excluded.permissions, validation_metadata = excluded.validation_metadata"
      )
      .bind(
        `role_${user.id}_${user.role}`,
        user.role === "super_admin" ? null : "club_demo",
        user.id,
        user.role,
        JSON.stringify({ demo: true }),
        JSON.stringify({ seeded: true })
      )
      .run();
  }

  for (const club of state.clubs) {
    await db
      .prepare(
        "insert into clubs (id, name, slug, timezone, organization_email_domain, setup_status, updated_at) values (?, ?, ?, ?, ?, ?, current_timestamp) " +
        "on conflict(id) do update set name = excluded.name, slug = excluded.slug, timezone = excluded.timezone, organization_email_domain = excluded.organization_email_domain, setup_status = excluded.setup_status, updated_at = current_timestamp"
      )
      .bind(club.id, club.name, club.slug, club.timezone, club.organizationEmailDomain, club.setupStatus)
      .run();

    await db.prepare("delete from club_activities where club_id = ?").bind(club.id).run();
    for (const activity of club.activities) {
      await db
        .prepare(
          "insert into club_activities (id, club_id, activity_type, resource_unit, resource_count, updated_at) values (?, ?, ?, ?, ?, current_timestamp)"
        )
        .bind(
          `activity_${club.id}_${activity.activityType}`,
          club.id,
          activity.activityType,
          activity.resourceUnit,
          Number(activity.resourceCount || 0)
        )
        .run();
    }
  }

  for (const family of state.families) {
    for (const member of family.members) {
      await db
        .prepare(
          "insert into users (id, email, first_name, last_name, date_of_birth, updated_at) values (?, ?, ?, ?, ?, current_timestamp) " +
          "on conflict(id) do update set first_name = excluded.first_name, last_name = excluded.last_name, date_of_birth = excluded.date_of_birth, updated_at = current_timestamp"
        )
        .bind(
          member.userId,
          `${member.userId}@example.local`,
          member.firstName,
          member.lastName,
          member.dateOfBirth
        )
        .run();
    }

    await db
      .prepare(
        "insert into families (id, club_id, name, primary_contact_user_id, billing_owner_user_id, review_status, payment_status, updated_at) values (?, ?, ?, ?, ?, ?, ?, current_timestamp) " +
        "on conflict(id) do update set name = excluded.name, primary_contact_user_id = excluded.primary_contact_user_id, billing_owner_user_id = excluded.billing_owner_user_id, review_status = excluded.review_status, payment_status = excluded.payment_status, updated_at = current_timestamp"
      )
      .bind(
        family.id,
        family.clubId,
        family.name,
        family.primaryContactUserId,
        family.billingOwnerUserId,
        family.reviewStatus,
        family.paymentStatus
      )
      .run();

    await db.prepare("delete from family_members where family_id = ?").bind(family.id).run();
    for (const member of family.members) {
      await db
        .prepare(
          "insert into family_members (id, club_id, family_id, user_id, first_name, last_name, date_of_birth, relationship, participation_status, is_guardian, updated_at) values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, current_timestamp)"
        )
        .bind(
          member.id,
          family.clubId,
          family.id,
          member.userId,
          member.firstName,
          member.lastName,
          member.dateOfBirth,
          member.relationship,
          member.participationStatus,
          member.isGuardian ? 1 : 0
        )
        .run();
    }
  }

  for (const club of state.clubs) {
    await db.prepare("delete from emergency_contacts where club_id = ?").bind(club.id).run();
  }
  for (const contact of state.emergencyContacts || []) {
    await db
      .prepare(
        "insert into emergency_contacts (id, club_id, user_id, name, relationship, phone, email, is_primary) values (?, ?, ?, ?, ?, ?, ?, ?)"
      )
      .bind(
        contact.id,
        contact.clubId,
        contact.userId,
        contact.name,
        contact.relationship || null,
        contact.phone,
        contact.email || null,
        contact.isPrimary ? 1 : 0
      )
      .run();
  }

  for (const waiver of state.waivers) {
    await db
      .prepare(
        "insert into waivers (id, club_id, name, version, body, default_coverage_scope, responsibility_statement, status) values (?, ?, ?, ?, ?, ?, ?, ?) " +
        "on conflict(id) do update set name = excluded.name, version = excluded.version, default_coverage_scope = excluded.default_coverage_scope, responsibility_statement = excluded.responsibility_statement, status = excluded.status"
      )
      .bind(
        waiver.id,
        waiver.clubId,
        waiver.name,
        waiver.version,
        waiver.responsibilityStatement || waiver.name,
        waiver.defaultCoverageScope,
        waiver.responsibilityStatement,
        waiver.status
      )
      .run();
  }

  for (const signature of state.waiverSignatures) {
    await db
      .prepare(
        "insert into waiver_signatures (id, club_id, waiver_id, subject_user_id, covered_family_id, coverage_scope, signed_by_user_id, status, signed_at) values (?, ?, ?, ?, ?, ?, ?, ?, ?) " +
        "on conflict(id) do update set status = excluded.status, signed_at = excluded.signed_at"
      )
      .bind(
        signature.id,
        signature.clubId,
        signature.waiverId,
        signature.subjectUserId || null,
        signature.coveredFamilyId || null,
        signature.coverageScope,
        signature.signedByUserId,
        signature.status,
        signature.signedAt
      )
      .run();
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

async function currentUser(request, env) {
  const sessionId = readCookie(request, "beeooking_session");
  if (sessionId && memorySessions.has(sessionId)) {
    return memorySessions.get(sessionId);
  }
  if (sessionId && hasD1(env)) {
    try {
      const row = await first(
        env.DB,
        "select u.id, u.email, u.first_name, u.last_name, coalesce(ra.role, 'member') as role " +
          "from user_sessions s " +
          "join users u on u.id = s.user_id " +
          "left join role_assignments ra on ra.user_id = u.id and (ra.club_id = ? or ra.club_id is null) " +
          "where s.id = ? and s.expires_at > current_timestamp " +
          "order by case ra.role when 'super_admin' then 1 when 'club_admin' then 2 when 'staff' then 3 when 'coach' then 4 when 'parent' then 5 else 6 end " +
          "limit 1",
        "club_demo",
        sessionId
      );
      if (row) return mapUserSession(row);
    } catch {
      // Fall through to demo cookie fallback.
    }
  }
  const id = readCookie(request, "beeooking_user") || "user_super";
  return demoUsers.find((user) => user.id === id) || demoUsers[0];
}

async function createSession(user, env) {
  const sessionId = newId("session");
  const expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24 * 30).toISOString();
  memorySessions.set(sessionId, user);
  if (hasD1(env)) {
    try {
      await env.DB
        .prepare("insert into user_sessions (id, user_id, expires_at) values (?, ?, ?)")
        .bind(sessionId, user.id, expiresAt)
        .run();
    } catch {
      // Missing migrations should not block local/fallback auth.
    }
  }
  return {
    sessionId,
    cookie: `beeooking_session=${encodeURIComponent(sessionId)}; Path=/; SameSite=Lax; Max-Age=2592000`
  };
}

async function findOrCreateLoginUser(email, env) {
  const normalizedEmail = String(email || "").trim().toLowerCase();
  const demoUser = demoUsers.find((user) => user.email.toLowerCase() === normalizedEmail);
  if (demoUser) return demoUser;
  if (hasD1(env)) {
    const existing = await first(env.DB, "select id, email, first_name, last_name from users where lower(email) = ? limit 1", normalizedEmail);
    if (existing) {
      return {
        id: existing.id,
        name: `${existing.first_name} ${existing.last_name}`,
        email: existing.email,
        role: "member"
      };
    }
    const user = {
      id: newId("user"),
      name: normalizedEmail.split("@")[0] || "New Member",
      email: normalizedEmail,
      role: "member"
    };
    const { firstName, lastName } = userNameParts(user);
    await env.DB
      .prepare("insert into users (id, email, first_name, last_name, date_of_birth) values (?, ?, ?, ?, ?)")
      .bind(user.id, user.email, firstName, lastName, "1990-01-01")
      .run();
    await env.DB
      .prepare("insert into role_assignments (id, club_id, user_id, role, validation_metadata) values (?, ?, ?, ?, ?)")
      .bind(newId("role"), "club_demo", user.id, "member", JSON.stringify({ source: "email_login" }))
      .run();
    return user;
  }
  return {
    id: newId("user"),
    name: normalizedEmail.split("@")[0] || "New Member",
    email: normalizedEmail,
    role: "member"
  };
}

async function createInvitedUser(email, role, env) {
  const normalizedEmail = String(email || "").trim().toLowerCase();
  const demoUser = demoUsers.find((user) => user.email.toLowerCase() === normalizedEmail);
  if (demoUser) return { ...demoUser, role };
  const user = {
    id: newId("user"),
    name: normalizedEmail.split("@")[0] || "Invited User",
    email: normalizedEmail,
    role
  };
  if (hasD1(env)) {
    const existing = await first(env.DB, "select id, email, first_name, last_name from users where lower(email) = ? limit 1", normalizedEmail);
    if (existing) {
      return { id: existing.id, name: `${existing.first_name} ${existing.last_name}`, email: existing.email, role };
    }
    const { firstName, lastName } = userNameParts(user);
    await env.DB
      .prepare("insert into users (id, email, first_name, last_name, date_of_birth) values (?, ?, ?, ?, ?)")
      .bind(user.id, user.email, firstName, lastName, "1990-01-01")
      .run();
  }
  return user;
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

function canInviteRole(user, role) {
  if (role === "club_admin") return user.role === "super_admin";
  return ["super_admin", "club_admin"].includes(user.role);
}

function roleRequiresOrgEmail(role) {
  return ["super_admin", "club_admin", "staff", "coach"].includes(role);
}

function emailMatchesDomain(email, domain) {
  return Boolean(email && domain && email.toLowerCase().endsWith(`@${domain.toLowerCase()}`));
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
  const emergencyContacts = memoryState.emergencyContacts || [];
  return {
    ...memoryState,
    families: memoryState.families.map((family) => ({
      ...family,
      members: family.members.map((member) => ({
        ...member,
        emergencyContacts: emergencyContacts.filter((contact) => contact.userId === member.userId)
      })),
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
  const user = await currentUser(request, env);

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
    const session = await createSession(selected, env);
    return json(
      { data: { user: selected } },
      {
        headers: {
          "Set-Cookie": session.cookie
        }
      }
    );
  }

  if (url.pathname === "/api/auth/login" && request.method === "POST") {
    const body = await parseBody(request);
    if (!body.email) {
      return json({ error: { code: "email_required", message: "Email is required." } }, { status: 400 });
    }
    const selected = await findOrCreateLoginUser(body.email, env);
    const session = await createSession(selected, env);
    return json(
      { data: { user: selected } },
      {
        headers: {
          "Set-Cookie": session.cookie
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

  if (parts[0] === "api" && parts[1] === "clubs" && parts[3] === "invites" && request.method === "POST") {
    const club = memoryState.clubs.find((item) => item.id === parts[2]);
    if (!club) return json({ error: { code: "not_found", message: "Club not found." } }, { status: 404 });
    const body = await parseBody(request);
    const role = body.role || "member";
    if (!canInviteRole(user, role)) {
      return json({ error: { code: "permission_denied", message: "You cannot invite this role." } }, { status: 403 });
    }
    if (roleRequiresOrgEmail(role) && !emailMatchesDomain(body.email, club.organizationEmailDomain)) {
      return json(
        {
          error: {
            code: "organization_email_required",
            message: `The ${role} role requires an email ending in @${club.organizationEmailDomain}.`
          }
        },
        { status: 409 }
      );
    }
    const invitedUser = await createInvitedUser(body.email, role, env);
    if (hasD1(env)) {
      await env.DB
        .prepare("insert into role_assignments (id, club_id, user_id, role, validation_metadata) values (?, ?, ?, ?, ?)")
        .bind(
          newId("role"),
          role === "super_admin" ? null : club.id,
          invitedUser.id,
          role,
          JSON.stringify({ invitedBy: user.id, domain: club.organizationEmailDomain, passed: true })
        )
        .run();
    }
    return json({
      data: {
        user: invitedUser,
        role,
        status: "invited",
        message: `${invitedUser.email} can now sign in as ${role.replace("_", " ")}.`
      }
    }, { status: 201 });
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

  if (parts[0] === "api" && parts[1] === "clubs" && parts[3] === "families" && parts[5] === "emergency-contacts" && request.method === "POST") {
    if (!canManageFamilies(user)) {
      return json({ error: { code: "permission_denied", message: "You cannot add emergency contacts." } }, { status: 403 });
    }
    const family = memoryState.families.find((item) => item.clubId === parts[2] && item.id === parts[4]);
    if (!family) return json({ error: { code: "not_found", message: "Family not found." } }, { status: 404 });
    const body = await parseBody(request);
    const member = family.members.find((item) => item.id === body.memberId);
    if (!member) return json({ error: { code: "member_not_found", message: "Family member not found." } }, { status: 404 });
    if (!body.name || !body.phone) {
      return json({ error: { code: "missing_required_fields", message: "Emergency contact name and phone are required." } }, { status: 400 });
    }
    const contact = {
      id: newId("emergency_contact"),
      clubId: parts[2],
      userId: member.userId,
      name: body.name,
      relationship: body.relationship || "",
      phone: body.phone,
      email: body.email || "",
      isPrimary: body.isPrimary === true || body.isPrimary === "true"
    };
    memoryState.emergencyContacts = memoryState.emergencyContacts || [];
    memoryState.emergencyContacts.push(contact);
    family.reviewStatus = "pending_admin_review";
    return saved({ data: contact }, { status: 201 });
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

export function renderLoginPage() {
  return `<!doctype html>
  <html lang="en">
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1">
      <title>CourtHubs Login</title>
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
          min-height: 100vh;
          margin: 0;
          color: var(--ink);
          background:
            linear-gradient(180deg, rgba(246, 248, 250, 0.92), rgba(255, 255, 255, 0.96)),
            url("https://images.unsplash.com/photo-1554068865-24cecd4e34b8?auto=format&fit=crop&w=1800&q=80") center / cover;
          font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
        }

        main {
          display: grid;
          min-height: 100vh;
          grid-template-columns: minmax(360px, 520px) minmax(280px, 1fr);
          gap: 28px;
          align-items: start;
          width: min(1120px, calc(100% - 28px));
          margin: 0 auto;
          padding: 34px 0;
        }

        h1, h2 { margin: 0; letter-spacing: 0; }
        h1 { font-size: 30px; line-height: 1.12; }
        h2 { font-size: 24px; }
        p { color: var(--muted); line-height: 1.5; }

        .sidebar {
          position: sticky;
          top: 24px;
          padding: 18px;
          border: 1px solid var(--line);
          border-radius: 8px;
          background: rgba(255, 255, 255, 0.9);
        }

        .brand {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 18px;
          color: #075c55;
          font-weight: 850;
        }

        .mark {
          display: grid;
          width: 38px;
          height: 38px;
          place-items: center;
          border-radius: 8px;
          background: var(--accent);
          color: #fff;
          font-weight: 900;
        }

        .login-card,
        .feature {
          border: 1px solid var(--line);
          border-radius: 8px;
          background: rgba(255, 255, 255, 0.94);
          box-shadow: 0 18px 52px rgba(23, 33, 43, 0.12);
        }

        .login-card { padding: 24px; }

        form {
          display: grid;
          gap: 12px;
          margin-top: 18px;
        }

        label {
          display: grid;
          gap: 6px;
          color: var(--muted);
          font-size: 13px;
          font-weight: 750;
        }

        input, button {
          min-height: 42px;
          border: 1px solid var(--line);
          border-radius: 8px;
          font: inherit;
        }

        input {
          width: 100%;
          padding: 8px 10px;
          background: #fff;
        }

        button {
          padding: 9px 12px;
          background: #fff;
          color: var(--ink);
          font-weight: 780;
          cursor: pointer;
        }

        button.primary {
          border-color: var(--accent);
          background: var(--accent);
          color: #fff;
        }

        .demo-grid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 8px;
          margin-top: 14px;
        }

        .notice {
          margin-top: 14px;
          padding: 12px;
          border: 1px solid var(--line);
          border-radius: 8px;
          background: var(--surface);
          color: var(--muted);
        }

        .notice.warn {
          border-color: #e8bd72;
          background: var(--warn-soft);
          color: var(--warn);
        }

        .feature-list {
          display: grid;
          grid-template-columns: 1fr;
          gap: 10px;
          margin-top: 18px;
        }

        .feature {
          min-height: 112px;
          padding: 14px;
          box-shadow: none;
        }

        .feature strong { display: block; margin-bottom: 6px; }
        .feature span { color: var(--muted); font-size: 14px; line-height: 1.35; }

        @media (max-width: 880px) {
          main {
            grid-template-columns: 1fr;
            align-items: start;
          }

          .sidebar {
            position: static;
          }
        }

        @media (max-width: 520px) {
          .demo-grid { grid-template-columns: 1fr; }
        }
      </style>
    </head>
    <body>
      <main>
        <section class="login-card" aria-label="Sign in">
          <h2>Sign in</h2>
          <p>Use an email account or choose a demo role to test permissions.</p>
          <form data-login-form>
            <label>Email<input name="email" type="email" value="clubadmin@beeooking.com" autocomplete="email" required></label>
            <button class="primary" type="submit">Continue to dashboard</button>
          </form>
          <div class="demo-grid" data-demo-logins></div>
          <div class="notice" data-login-result>After sign in, you will be sent to the app dashboard.</div>
        </section>

        <aside class="sidebar" aria-label="CourtHubs overview">
          <div class="brand"><span class="mark">C</span><span>CourtHubs</span></div>
          <h1>Run club operations from one secure workspace.</h1>
          <p>Sign in to manage club setup, members and families, waivers, admin review, and bookable resources for the Layer 1 operating system.</p>
          <div class="feature-list" aria-label="Layer 1 login features">
            <article class="feature"><strong>Family records</strong><span>Grouped members, dependents, active status, and emergency contacts.</span></article>
            <article class="feature"><strong>Waiver gate</strong><span>One family waiver controls booking access before participation.</span></article>
            <article class="feature"><strong>Admin review</strong><span>Approve membership setup before access rules are locked.</span></article>
          </div>
        </aside>
      </main>
      <script>
        const demoUsers = ${JSON.stringify(demoUsers)};

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

        function roleLabel(role) {
          return role.split("_").map((part) => part.charAt(0).toUpperCase() + part.slice(1)).join(" ");
        }

        function setResult(message, isWarning = false) {
          const target = document.querySelector("[data-login-result]");
          target.textContent = message;
          target.classList.toggle("warn", isWarning);
        }

        document.querySelector("[data-demo-logins]").innerHTML = demoUsers.map((user) =>
          "<button type='button' data-demo-user='" + user.id + "'>" + user.name + "<br><small>" + roleLabel(user.role) + "</small></button>"
        ).join("");

        document.querySelector("[data-login-form]").addEventListener("submit", async (event) => {
          event.preventDefault();
          const fields = Object.fromEntries(new FormData(event.currentTarget).entries());
          try {
            setResult("Signing in...");
            await api("/api/auth/login", {
              method: "POST",
              body: JSON.stringify({ email: fields.email })
            });
            window.location.href = "/app";
          } catch (error) {
            setResult(error.message, true);
          }
        });

        document.querySelectorAll("[data-demo-user]").forEach((button) => {
          button.addEventListener("click", async () => {
            try {
              setResult("Switching demo role...");
              await api("/api/auth/demo-login", {
                method: "POST",
                body: JSON.stringify({ userId: button.dataset.demoUser })
              });
              window.location.href = "/app";
            } catch (error) {
              setResult(error.message, true);
            }
          });
        });
      </script>
    </body>
  </html>`;
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

        .contact-line {
          display: block;
          margin-top: 6px;
          color: var(--muted);
          font-size: 12px;
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
          <h2>Authentication</h2>
          <p>Sign in by email to create a session cookie, or switch demo roles to test permissions.</p>
          <form class="form-grid" data-login-form>
            <label>Email<input name="email" type="email" value="clubadmin@beeooking.com" required></label>
            <div class="actions"><button class="primary" type="submit">Sign in</button></div>
          </form>
          <div class="role-buttons" data-role-buttons></div>
        </section>

        <nav class="tabs" aria-label="App foundation views">
          <button class="is-active" data-app-tab="setup" type="button">Club Setup</button>
          <button data-app-tab="families" type="button">Members & Families</button>
          <button data-app-tab="review" type="button">Admin Review</button>
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
            <form class="form-grid" data-invite-form>
              <label>Invite email<input name="email" type="email" value="newadmin@beeooking.com" required></label>
              <label>Role<select name="role"><option value="club_admin">Club Admin</option><option value="staff">Staff</option><option value="coach">Coach</option><option value="member">Member</option></select></label>
              <div class="actions">
                <button type="submit">Invite user</button>
              </div>
            </form>
            <div class="notice" data-invite-result>Invite results will appear here.</div>
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

        <section class="view" data-app-panel="review">
          <div class="panel">
            <h2>Admin Review Queue</h2>
            <p>Club Admin and Super Admin approve family membership status after active and non-active members are chosen.</p>
            <div class="families" data-review-list></div>
          </div>
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
          const emergencyContacts = families.flatMap((family) => family.members).flatMap((member) => member.emergencyContacts || []).length;
          document.querySelector("[data-family-stats]").innerHTML = [
            ["Families", families.length, "Saved family records"],
            ["Active members", activeMembers, "Participant-level status"],
            ["Waiver blocked", blocked, "Cannot book yet"],
            ["Review needed", pending, "Admin approval queue"],
            ["Emergency contacts", emergencyContacts, "Saved per participant"]
          ].map(([label, value, detail]) =>
            "<article class='stat'><span>" + label + "</span><strong>" + value + "</strong><small>" + detail + "</small></article>"
          ).join("");
        }

        function renderFamilies() {
          const families = state.session.state.families;
          renderStats(families);
          document.querySelector("[data-families-list]").innerHTML = families.map((family) => familyCard(family, true)).join("");
          document.querySelector("[data-waiver-list]").innerHTML = families.map((family) => familyCard(family, false)).join("");
          renderReviewQueue(families);
          bindFamilyActions();
        }

        function renderReviewQueue(families) {
          const reviewFamilies = families.filter((family) => family.reviewStatus.includes("pending") || family.reviewStatus === "draft");
          document.querySelector("[data-review-list]").innerHTML = reviewFamilies.length ? reviewFamilies.map(reviewCard).join("") :
            "<div class='notice'>No family records need admin review.</div>";
        }

        function reviewCard(family) {
          const active = family.members.filter((member) => member.participationStatus === "active").length;
          const inactive = family.members.filter((member) => member.participationStatus === "non_active").length;
          const rows = family.members.map((member) =>
            "<tr><th>" + escapeHtml(member.firstName + " " + member.lastName) + "<small>" + escapeHtml(member.relationship) + "</small></th>" +
            "<td>" + escapeHtml(member.dateOfBirth) + "</td><td>" + escapeHtml(member.participationStatus) + "</td></tr>"
          ).join("");
          return "<article class='family-card'><div class='family-head'><div><h3>" + escapeHtml(family.name) + "</h3>" +
            "<p>" + active + " active - " + inactive + " non-active - " + escapeHtml(family.paymentStatus) + "</p></div>" +
            "<span class='badge " + (family.waiverStatus.status === "blocked" ? "warn" : "") + "'>" + escapeHtml(family.reviewStatus) + "</span></div>" +
            "<div class='family-body'><table><tbody>" + rows + "</tbody></table></div>" +
            "<div class='family-actions actions'><button type='button' class='primary' data-review-family='" + family.id + "'>Approve and lock</button>" +
            "<button type='button' data-return-family='" + family.id + "'>Return for changes</button></div>" +
            "<div class='notice " + (family.waiverStatus.status === "blocked" ? "warn" : "") + "'>" + escapeHtml(family.waiverStatus.label) + "</div></article>";
        }

        function familyCard(family, includeMemberForm) {
          const waiverClass = family.waiverStatus.status === "blocked" ? "warn" : "";
          const members = family.members.map((member) =>
            "<tr><th>" + escapeHtml(member.firstName + " " + member.lastName) + "<small>" + escapeHtml(member.relationship) + "</small>" +
            (member.emergencyContacts || []).map((contact) =>
              "<span class='contact-line'>" + escapeHtml(contact.name) + " - " + escapeHtml(contact.phone) + "</span>"
            ).join("") + "</th>" +
            "<td>" + escapeHtml(member.dateOfBirth) + "</td><td>" + escapeHtml(member.participationStatus) + "</td></tr>"
          ).join("");
          const memberOptions = family.members.map((member) =>
            "<option value='" + escapeHtml(member.id) + "'>" + escapeHtml(member.firstName + " " + member.lastName) + "</option>"
          ).join("");
          const addMember = includeMemberForm ? 
            "<form class='form-grid' data-add-member-form='" + family.id + "'>" +
            "<label>First name<input name='firstName' value='New' required></label>" +
            "<label>Last name<input name='lastName' value='Junior' required></label>" +
            "<label>DOB<input name='dateOfBirth' type='date' value='2015-01-01' required></label>" +
            "<label>Relationship<select name='relationship'><option value='dependent'>Dependent</option><option value='spousal_member'>Spousal member</option></select></label>" +
            "<label>Status<select name='participationStatus'><option value='active'>Active</option><option value='non_active'>Non-active</option></select></label>" +
            "<div class='actions'><button type='submit'>Add member</button></div></form>" +
            "<form class='form-grid' data-add-contact-form='" + family.id + "'>" +
            "<label>Member<select name='memberId'>" + memberOptions + "</select></label>" +
            "<label>Contact name<input name='name' value='Emergency Contact' required></label>" +
            "<label>Relationship<input name='relationship' value='Parent'></label>" +
            "<label>Phone<input name='phone' value='555-0101' required></label>" +
            "<label>Email<input name='email' type='email' value=''></label>" +
            "<div class='actions'><button type='submit'>Add emergency contact</button></div></form>" : "";
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
          document.querySelectorAll("[data-add-contact-form]").forEach((form) => {
            form.addEventListener("submit", async (event) => {
              event.preventDefault();
              const body = Object.fromEntries(new FormData(form).entries());
              try {
                await api("/api/clubs/" + state.clubId + "/families/" + form.dataset.addContactForm + "/emergency-contacts", { method: "POST", body: JSON.stringify(body) });
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
          document.querySelectorAll("[data-return-family]").forEach((button) => {
            button.addEventListener("click", async () => {
              try {
                await api("/api/clubs/" + state.clubId + "/families/" + button.dataset.returnFamily + "/review", { method: "POST", body: JSON.stringify({ reviewStatus: "changes_requested" }) });
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

        document.querySelector("[data-login-form]").addEventListener("submit", async (event) => {
          event.preventDefault();
          const fields = Object.fromEntries(new FormData(event.currentTarget).entries());
          try {
            await api("/api/auth/login", {
              method: "POST",
              body: JSON.stringify({ email: fields.email })
            });
            await load();
          } catch (error) {
            alert(error.message);
          }
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

        document.querySelector("[data-invite-form]").addEventListener("submit", async (event) => {
          event.preventDefault();
          const fields = Object.fromEntries(new FormData(event.currentTarget).entries());
          const result = document.querySelector("[data-invite-result]");
          try {
            const invite = await api("/api/clubs/" + state.clubId + "/invites", {
              method: "POST",
              body: JSON.stringify(fields)
            });
            result.classList.remove("warn");
            result.textContent = invite.message;
          } catch (error) {
            result.classList.add("warn");
            result.textContent = error.message;
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
