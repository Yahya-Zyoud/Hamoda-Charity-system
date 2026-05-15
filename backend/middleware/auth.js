/**
 * Auth middleware wrapping @clerk/express.
 *
 * Graceful degradation: when CLERK_SECRET_KEY is absent the app still boots
 * and serves public routes normally. Protected routes fall back to the
 * x-user-id header (dev convenience only — never ship without Clerk in prod).
 */

const { HTTP_STATUS } = require("../config/constants");
const logger = require("../utils/logger");

const IS_CLERK_READY = !!process.env.CLERK_SECRET_KEY;

if (!IS_CLERK_READY) {
  logger.warn("CLERK_SECRET_KEY not set — auth middleware running in dev-bypass mode");
}

// Lazy-load Clerk so the app boots even when the package is absent in tests.
let _getAuth = null;
let _clerkMiddleware = null;
let _clerkClient = null;

if (IS_CLERK_READY) {
  const clerk = require("@clerk/express");
  _getAuth = clerk.getAuth;
  _clerkMiddleware = clerk.clerkMiddleware;

  // clerkClient is exported from @clerk/express v2 as a pre-configured singleton.
  _clerkClient = clerk.clerkClient;
}

// ── Simple in-memory admin-role cache (5-min TTL) ──────────────────────────
const _adminCache = new Map();

async function _isAdminUser(userId) {
  const hit = _adminCache.get(userId);
  if (hit && hit.exp > Date.now()) return hit.admin;

  const user = await _clerkClient.users.getUser(userId);
  const admin = user.publicMetadata?.role === "admin";
  _adminCache.set(userId, { admin, exp: Date.now() + 5 * 60 * 1000 });
  return admin;
}

// ── Response helpers ───────────────────────────────────────────────────────
const unauth = (res) =>
  res.status(HTTP_STATUS.UNAUTHORIZED).json({ success: false, message: "غير مصرح" });
const forbidden = (res) =>
  res.status(HTTP_STATUS.FORBIDDEN).json({ success: false, message: "ممنوع" });

// ── Middleware exports ─────────────────────────────────────────────────────

/**
 * Sets req.userId if a valid Clerk JWT is present; always calls next().
 * Use on routes that accept both authenticated and anonymous users.
 */
const optionalAuth = (req, res, next) => {
  if (!IS_CLERK_READY) {
    req.userId = req.headers["x-user-id"] || null;
    return next();
  }
  const { userId } = _getAuth(req);
  req.userId = userId || null;
  next();
};

/**
 * Requires a valid Clerk JWT. Returns 401 if missing or invalid.
 */
const requireAuth = (req, res, next) => {
  if (!IS_CLERK_READY) {
    req.userId = req.headers["x-user-id"] || null;
    if (!req.userId) return unauth(res);
    return next();
  }
  const { userId } = _getAuth(req);
  if (!userId) return unauth(res);
  req.userId = userId;
  next();
};

/**
 * Requires a valid Clerk JWT AND publicMetadata.role === "admin".
 * Returns 401 for unauthenticated or 403 for non-admin users.
 */
const requireAdmin = async (req, res, next) => {
  if (!IS_CLERK_READY) {
    // Dev bypass: any request with x-user-id is treated as admin.
    req.userId = req.headers["x-user-id"] || "dev-admin";
    return next();
  }

  const { userId } = _getAuth(req);
  if (!userId) return unauth(res);

  try {
    const isAdmin = await _isAdminUser(userId);
    if (!isAdmin) return forbidden(res);
    req.userId = userId;
    next();
  } catch (err) {
    logger.error("Admin role check failed", { userId, error: err.message });
    return unauth(res);
  }
};

/**
 * Returns the Clerk global middleware (or null when Clerk is not configured).
 * Mount this app-wide BEFORE any route handlers so getAuth(req) works.
 */
const clerkSetup = () => (_clerkMiddleware ? _clerkMiddleware() : null);

module.exports = { optionalAuth, requireAuth, requireAdmin, clerkSetup };
