import { useEffect } from "react";
import { useUser, useClerk, useAuth } from "@clerk/clerk-react";
import { AppAuthProvider } from "../../contexts/AppAuthContext";
import { setAuthTokenGetter } from "../../services/api";

export function ClerkBridge({ children }) {
  const { user, isLoaded } = useUser();
  const { signOut } = useClerk();
  const { getToken } = useAuth();

  // Wire Clerk's getToken into the API layer so every request gets
  // Authorization: Bearer <token> without passing clerkId around manually.
  useEffect(() => {
    setAuthTokenGetter(getToken);
    return () => setAuthTokenGetter(null);
  }, [getToken]);

  const isAdmin =
    isLoaded &&
    !!user &&
    user.publicMetadata?.role === "admin";

  const value = {
    user,
    isAdmin,
    isLoaded,
    signOut: () => signOut({ redirectUrl: "/" }),
  };

  return (
    <AppAuthProvider value={value}>
      {children}
    </AppAuthProvider>
  );
}
