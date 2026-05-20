/**
 * Auth middleware wrapping @clerk/express.
 *
 * Production: Clerk JWT verification is mandatory.
 * Dev bypass: ONLY enabled when both Clerk keys are absent AND
 * ALLOW_DEV_AUTH_BYPASS=1 is explicitly set (refused outside development).
 * This prevents an accidental misconfiguration from silently opening admin
 * endpoints in production.
 */

const { HTTP_STATUS } = require("../config/constants");
const logger = require("../utils/logger");

const IS_CLERK_READY = !!(process.env.CLERK_SECRET_KEY && process.env.CLERK_PUBLISHABLE_KEY);
const NODE_ENV       = process.env.NODE_ENV || "development";
const DEV_BYPASS     = !IS_CLERK_READY
  && process.env.ALLOW_DEV_AUTH_BYPASS === "1"
  && NODE_ENV !== "production";

if (!IS_CLERK_READY) {
  if (DEV_BYPASS) {
    logger.warn("Clerk keys not set — dev bypass ENABLED (x-user-id header). Refuses to run in production.");
  } else if (NODE_ENV === "production") {
    logger.error("Clerk keys not set in production — protected routes will reject all traffic.");
  } else {
    logger.warn("Clerk keys not set — protected routes will reject all traffic. Set ALLOW_DEV_AUTH_BYPASS=1 to enable header auth in dev.");
  }
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
  res.status(HTTP_STATUS.UNAUTHORIZED).json({ success: false, message: "Unauthorized" });
const forbidden = (res) =>
  res.status(HTTP_STATUS.FORBIDDEN).json({ success: false, message: "Forbidden" });

// ── Middleware exports ─────────────────────────────────────────────────────

/**
 * Sets req.userId if a valid Clerk JWT is present; always calls next().
 * Use on routes that accept both authenticated and anonymous users.
 */
const optionalAuth = (req, res, next) => {
  if (!IS_CLERK_READY) {
    req.userId = DEV_BYPASS ? (req.headers["x-user-id"] || null) : null;
    return next();
  }
  const { userId } = _getAuth(req);
  req.userId = userId || (DEV_BYPASS ? req.headers["x-user-id"] : null) || null;
  next();
};

/**
 * Requires a valid Clerk JWT. Returns 401 if missing or invalid.
 */
const requireAuth = (req, res, next) => {
  if (!IS_CLERK_READY) {
    if (!DEV_BYPASS) return unauth(res);
    req.userId = req.headers["x-user-id"] || null;
    if (!req.userId) return unauth(res);
    return next();
  }
  const { userId } = _getAuth(req);
  req.userId = userId || (DEV_BYPASS ? req.headers["x-user-id"] : null) || null;
  if (!req.userId) return unauth(res);
  next();
};

/**
 * Requires a valid Clerk JWT AND publicMetadata.role === "admin".
 * Returns 401 for unauthenticated or 403 for non-admin users.
 *
 * Dev bypass: only when DEV_BYPASS is on (ALLOW_DEV_AUTH_BYPASS=1, no Clerk
 * keys, non-production) AND the request explicitly sets x-admin-bypass=1.
 * Never grants admin implicitly.
 */
const requireAdmin = async (req, res, next) => {
  if (!IS_CLERK_READY) {
    if (!DEV_BYPASS) return unauth(res);
    if (req.headers["x-admin-bypass"] !== "1") return forbidden(res);
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
