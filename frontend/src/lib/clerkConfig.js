export const clerkPublishableKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;
export const isClerkConfigured =
  typeof clerkPublishableKey === "string" && clerkPublishableKey.startsWith("pk_");

let _clerkProviderFailed = false;
export function markClerkProviderFailed() { _clerkProviderFailed = true; }
export function isClerkProviderActive() { return isClerkConfigured && !_clerkProviderFailed; }
