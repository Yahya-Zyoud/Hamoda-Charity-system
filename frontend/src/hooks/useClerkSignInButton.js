import { useEffect, useState } from "react";
import { isClerkConfigured } from "../lib/clerkConfig";

export function useClerkSignInButton(enabled = true) {
  const [SignInButton, setSignInButton] = useState(null);

  useEffect(() => {
    let isMounted = true;

    if (!enabled || !isClerkConfigured) {
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

  return SignInButton;
}
