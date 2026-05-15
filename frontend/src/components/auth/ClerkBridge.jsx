import { useEffect } from "react";
import { useUser, useClerk, useAuth } from "@clerk/clerk-react";
import { AppAuthProvider } from "../../contexts/AppAuthContext";
import { setAuthTokenGetter, setCurrentUserId } from "../../services/api";

export function ClerkBridge({ children }) {
  const { user, isLoaded } = useUser();
  const { signOut } = useClerk();
  const { getToken } = useAuth();

  useEffect(() => {
    setAuthTokenGetter(getToken);
    setCurrentUserId(user?.id || null);
    return () => { setAuthTokenGetter(null); setCurrentUserId(null); };
  }, [getToken, user]);

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
