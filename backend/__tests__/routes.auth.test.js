/**
 * Integration tests: verify that protected routes enforce auth correctly.
 *
 * Strategy: set CLERK_SECRET_KEY so the middleware runs in "real" mode,
 * then mock getAuth so we can control who is "logged in".
 * MongoDB is NOT required — controllers degrade gracefully when DB is absent.
 */

const mockGetAuth = jest.fn();
const mockGetUser = jest.fn();

jest.mock("@clerk/express", () => ({
  clerkMiddleware: jest.fn(() => (_req, _res, next) => next()),
  getAuth: mockGetAuth,
  clerkClient: { users: { getUser: mockGetUser } },
}));

process.env.CLERK_SECRET_KEY = "sk_test_fake_for_tests";
process.env.MONGO_URI = ""; // keep DB disconnected — no real DB needed

const request = require("supertest");

// Load the app after env vars and mocks are in place
let app;
beforeAll(() => {
  app = require("../server");
});

// ── Helpers ─────────────────────────────────────────────────────────────────
const asGuest   = () => mockGetAuth.mockReturnValue({ userId: null });
const asUser    = () => mockGetAuth.mockReturnValue({ userId: "user_123" });
const asAdmin   = () => {
  mockGetAuth.mockReturnValue({ userId: "admin_456" });
  mockGetUser.mockResolvedValue({ publicMetadata: { role: "admin" } });
};
const asNonAdmin = () => {
  mockGetAuth.mockReturnValue({ userId: "user_789" });
  mockGetUser.mockResolvedValue({ publicMetadata: { role: "donor" } });
};

// ── Public routes ─────────────────────────────────────────────────────────────
describe("Public routes (no auth required)", () => {
  it("GET /api/projects → 200", async () => {
    asGuest();
    const res = await request(app).get("/api/projects");
    expect(res.status).toBe(200);
  });

  it("GET /api/stats → 200", async () => {
    asGuest();
    const res = await request(app).get("/api/stats");
    expect(res.status).toBe(200);
  });

  it("GET /api/partners → 200", async () => {
    asGuest();
    const res = await request(app).get("/api/partners");
    expect(res.status).toBe(200);
  });

  it("GET /api/team → 200", async () => {
    asGuest();
    const res = await request(app).get("/api/team");
    expect(res.status).toBe(200);
  });

  it("GET /health → 200", async () => {
    const res = await request(app).get("/health");
    expect(res.status).toBe(200);
  });
});

// ── requireAuth routes ────────────────────────────────────────────────────────
describe("requireAuth routes", () => {
  it("GET /api/user/profile → 401 for guest", async () => {
    asGuest();
    const res = await request(app).get("/api/user/profile");
    expect(res.status).toBe(401);
  });

  it("GET /api/user/profile → 200 for authenticated user", async () => {
    asUser();
    const res = await request(app).get("/api/user/profile");
    expect(res.status).toBe(200);
  });

  it("GET /api/user/activity → 401 for guest", async () => {
    asGuest();
    const res = await request(app).get("/api/user/activity");
    expect(res.status).toBe(401);
  });
});

// ── requireAdmin routes ───────────────────────────────────────────────────────
describe("requireAdmin routes", () => {
  it("GET /api/admin/stats → 401 for guest", async () => {
    asGuest();
    const res = await request(app).get("/api/admin/stats");
    expect(res.status).toBe(401);
  });

  it("GET /api/admin/stats → 403 for non-admin user", async () => {
    asNonAdmin();
    const res = await request(app).get("/api/admin/stats");
    expect(res.status).toBe(403);
  });

  it("GET /api/admin/stats → 200 for admin user", async () => {
    asAdmin();
    const res = await request(app).get("/api/admin/stats");
    expect(res.status).toBe(200);
  });

  it("GET /api/user (list all) → 401 for guest", async () => {
    asGuest();
    const res = await request(app).get("/api/user");
    expect(res.status).toBe(401);
  });

  it("GET /api/help-requests → 401 for guest", async () => {
    asGuest();
    const res = await request(app).get("/api/help-requests");
    expect(res.status).toBe(401);
  });

  it("GET /api/help-requests → 403 for regular user", async () => {
    asNonAdmin();
    const res = await request(app).get("/api/help-requests");
    expect(res.status).toBe(403);
  });

  it("GET /api/donations → 401 for guest", async () => {
    asGuest();
    const res = await request(app).get("/api/donations");
    expect(res.status).toBe(401);
  });

  it("DELETE /api/projects/:id → 401 for guest", async () => {
    asGuest();
    const res = await request(app).delete("/api/projects/000000000000000000000001");
    expect(res.status).toBe(401);
  });

  it("POST /api/team → 403 for non-admin", async () => {
    asNonAdmin();
    const res = await request(app).post("/api/team").send({ name: "Test" });
    expect(res.status).toBe(403);
  });
});

// ── optionalAuth routes ───────────────────────────────────────────────────────
describe("optionalAuth routes (anonymous allowed)", () => {
  it("POST /api/help-requests → not 401 for guest (form validation errors expected)", async () => {
    asGuest();
    const res = await request(app).post("/api/help-requests");
    // 400 (validation) is fine — proves we didn't get blocked by auth (401)
    expect(res.status).not.toBe(401);
  });
});
