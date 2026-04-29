export const clerkPublishableKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;
export const isClerkConfigured =
  typeof clerkPublishableKey === "string" && clerkPublishableKey.startsWith("pk_");
