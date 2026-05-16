/**
 * Unit tests for backend/middleware/auth.js
 *
 * @clerk/express is mocked so no real JWT or Clerk API calls are made.
 * Tests cover: optionalAuth, requireAuth, requireAdmin — both
 * with and without CLERK_SECRET_KEY configured.
 */

// ── Mocks must be declared before any require() of the module under test ──
jest.mock("@clerk/express", () => ({
  clerkMiddleware: jest.fn(() => (_req, _res, next) => next()),
  getAuth: jest.fn(),
}));

const mockClerkUsers = { getUser: jest.fn() };
jest.mock("@clerk/express", () => ({
  clerkMiddleware: jest.fn(() => (_req, _res, next) => next()),
  getAuth: jest.fn(),
  clerkClient: { users: mockClerkUsers },
}));

// ─────────────────────────────────────────────────────────────────────────────

const { getAuth } = require("@clerk/express");

function buildReqRes(overrides = {}) {
  const req = { headers: {}, ...overrides };
  const res = {
    _status: 200,
    _body: null,
    status(code) { this._status = code; return this; },
    json(body)   { this._body = body; return this; },
  };
  const next = jest.fn();
  return { req, res, next };
}

// ── Tests with CLERK_SECRET_KEY set ──────────────────────────────────────────

describe("auth middleware (Clerk configured)", () => {
  let optionalAuth, requireAuth, requireAdmin;

  beforeAll(() => {
    process.env.CLERK_SECRET_KEY      = "sk_test_fake";
    process.env.CLERK_PUBLISHABLE_KEY = "pk_test_fake";
    // Re-require auth to pick up the env var (module is cached per jest run,
    // so we isolate this suite with jest.isolateModules).
    jest.isolateModules(() => {
      ({ optionalAuth, requireAuth, requireAdmin } = require("../middleware/auth"));
    });
  });

  afterAll(() => {
    delete process.env.CLERK_SECRET_KEY;
    delete process.env.CLERK_PUBLISHABLE_KEY;
  });

  describe("optionalAuth", () => {
    it("sets req.userId from verified token and calls next", () => {
      getAuth.mockReturnValueOnce({ userId: "user_abc" });
      const { req, res, next } = buildReqRes();
      optionalAuth(req, res, next);
      expect(req.userId).toBe("user_abc");
      expect(next).toHaveBeenCalled();
    });

    it("sets req.userId = null when no token, still calls next", () => {
      getAuth.mockReturnValueOnce({ userId: null });
      const { req, res, next } = buildReqRes();
      optionalAuth(req, res, next);
      expect(req.userId).toBeNull();
      expect(next).toHaveBeenCalled();
    });
  });

  describe("requireAuth", () => {
    it("calls next and sets req.userId when token is valid", () => {
      getAuth.mockReturnValueOnce({ userId: "user_xyz" });
      const { req, res, next } = buildReqRes();
      requireAuth(req, res, next);
      expect(req.userId).toBe("user_xyz");
      expect(next).toHaveBeenCalled();
    });

    it("returns 401 when no token is present", () => {
      getAuth.mockReturnValueOnce({ userId: null });
      const { req, res, next } = buildReqRes();
      requireAuth(req, res, next);
      expect(res._status).toBe(401);
      expect(next).not.toHaveBeenCalled();
    });
  });

  describe("requireAdmin", () => {
    it("calls next when user has admin role", async () => {
      getAuth.mockReturnValueOnce({ userId: "admin_user" });
      mockClerkUsers.getUser.mockResolvedValueOnce({
        publicMetadata: { role: "admin" },
      });
      const { req, res, next } = buildReqRes();
      await requireAdmin(req, res, next);
      expect(req.userId).toBe("admin_user");
      expect(next).toHaveBeenCalled();
    });

    it("returns 403 when user is not admin", async () => {
      getAuth.mockReturnValueOnce({ userId: "regular_user" });
      mockClerkUsers.getUser.mockResolvedValueOnce({
        publicMetadata: { role: "donor" },
      });
      const { req, res, next } = buildReqRes();
      await requireAdmin(req, res, next);
      expect(res._status).toBe(403);
      expect(next).not.toHaveBeenCalled();
    });

    it("returns 401 when no token is present", async () => {
      getAuth.mockReturnValueOnce({ userId: null });
      const { req, res, next } = buildReqRes();
      await requireAdmin(req, res, next);
      expect(res._status).toBe(401);
      expect(next).not.toHaveBeenCalled();
    });

    it("returns 401 when Clerk API throws", async () => {
      getAuth.mockReturnValueOnce({ userId: "user_err" });
      mockClerkUsers.getUser.mockRejectedValueOnce(new Error("Clerk API down"));
      const { req, res, next } = buildReqRes();
      await requireAdmin(req, res, next);
      expect(res._status).toBe(401);
      expect(next).not.toHaveBeenCalled();
    });
  });
});

// ── Tests WITHOUT CLERK_SECRET_KEY (dev-bypass mode) ─────────────────────────

describe("auth middleware (dev-bypass mode — ALLOW_DEV_AUTH_BYPASS=1, no Clerk keys)", () => {
  let optionalAuth, requireAuth, requireAdmin;

  beforeAll(() => {
    delete process.env.CLERK_SECRET_KEY;
    delete process.env.CLERK_PUBLISHABLE_KEY;
    process.env.ALLOW_DEV_AUTH_BYPASS = "1";
    process.env.NODE_ENV = "development";
    jest.isolateModules(() => {
      ({ optionalAuth, requireAuth, requireAdmin } = require("../middleware/auth"));
    });
  });

  afterAll(() => {
    delete process.env.ALLOW_DEV_AUTH_BYPASS;
  });

  it("optionalAuth: uses x-user-id header and calls next", () => {
    const { req, res, next } = buildReqRes({ headers: { "x-user-id": "local_user" } });
    optionalAuth(req, res, next);
    expect(req.userId).toBe("local_user");
    expect(next).toHaveBeenCalled();
  });

  it("requireAuth: passes with x-user-id header", () => {
    const { req, res, next } = buildReqRes({ headers: { "x-user-id": "local_user" } });
    requireAuth(req, res, next);
    expect(next).toHaveBeenCalled();
  });

  it("requireAuth: returns 401 when x-user-id is absent", () => {
    const { req, res, next } = buildReqRes();
    requireAuth(req, res, next);
    expect(res._status).toBe(401);
    expect(next).not.toHaveBeenCalled();
  });

  it("requireAdmin: 403 without explicit x-admin-bypass header", async () => {
    const { req, res, next } = buildReqRes({ headers: { "x-user-id": "local_user" } });
    await requireAdmin(req, res, next);
    expect(res._status).toBe(403);
    expect(next).not.toHaveBeenCalled();
  });

  it("requireAdmin: passes with x-admin-bypass=1", async () => {
    const { req, res, next } = buildReqRes({
      headers: { "x-user-id": "local_user", "x-admin-bypass": "1" },
    });
    await requireAdmin(req, res, next);
    expect(next).toHaveBeenCalled();
  });
});

describe("auth middleware (no Clerk keys, bypass NOT enabled)", () => {
  let optionalAuth, requireAuth, requireAdmin;

  beforeAll(() => {
    delete process.env.CLERK_SECRET_KEY;
    delete process.env.CLERK_PUBLISHABLE_KEY;
    delete process.env.ALLOW_DEV_AUTH_BYPASS;
    process.env.NODE_ENV = "development";
    jest.isolateModules(() => {
      ({ optionalAuth, requireAuth, requireAdmin } = require("../middleware/auth"));
    });
  });

  it("requireAuth: returns 401 even with x-user-id header", () => {
    const { req, res, next } = buildReqRes({ headers: { "x-user-id": "anyone" } });
    requireAuth(req, res, next);
    expect(res._status).toBe(401);
    expect(next).not.toHaveBeenCalled();
  });

  it("requireAdmin: returns 401 with no header", async () => {
    const { req, res, next } = buildReqRes();
    await requireAdmin(req, res, next);
    expect(res._status).toBe(401);
    expect(next).not.toHaveBeenCalled();
  });

  it("requireAdmin: still 401 even with x-admin-bypass header (bypass disabled)", async () => {
    const { req, res, next } = buildReqRes({
      headers: { "x-user-id": "anyone", "x-admin-bypass": "1" },
    });
    await requireAdmin(req, res, next);
    expect(res._status).toBe(401);
    expect(next).not.toHaveBeenCalled();
  });
});
