// Lazily imports Clerk's SignInButton only when Clerk is configured; returns null otherwise.
import { useEffect, useState } from "react";
import { isClerkProviderActive } from "../lib/clerkConfig.js";

export function useClerkSignInButton(enabled = true) {
  const [SignInButton, setSignInButton] = useState(null);

  useEffect(() => {
    let isMounted = true;

    if (!enabled || !isClerkProviderActive()) {
      setSignInButton(null);
      return () => {
        isMounted = false;
      };
    }

    import("@clerk/clerk-react")
      .then((mod) => {
        if (isMounted) {
          setSignInButton(() => mod.SignInButton);
        }
      })
      .catch((err) => {
        console.error("[auth] Failed to load Clerk sign-in button:", err);
      });

    return () => {
      isMounted = false;
    };
  }, [enabled]);

  return isClerkProviderActive() ? SignInButton : null;
}
