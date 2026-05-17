// Reads the Clerk publishable key from env and tracks whether the ClerkProvider initialised successfully.
export const clerkPublishableKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;
// A valid key always starts with "pk_" — anything else means Clerk is not configured.
export const isClerkConfigured =
  typeof clerkPublishableKey === "string" && clerkPublishableKey.startsWith("pk_");

// Module-level flag flipped by the error boundary in main.jsx if ClerkProvider throws on mount.
let _clerkProviderFailed = false;
export function markClerkProviderFailed() { _clerkProviderFailed = true; }
export function isClerkProviderActive() { return isClerkConfigured && !_clerkProviderFailed; }
