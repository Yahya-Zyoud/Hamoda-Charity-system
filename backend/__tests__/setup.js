// Ensure dotenv from server.js does NOT pollute test env with real keys.
// Each test suite manages its own env vars explicitly.
delete process.env.CLERK_SECRET_KEY;
delete process.env.CLERK_PUBLISHABLE_KEY;
delete process.env.MONGODB_URI;
delete process.env.ALLOW_DEV_AUTH_BYPASS;
process.env.NODE_ENV = "test";
