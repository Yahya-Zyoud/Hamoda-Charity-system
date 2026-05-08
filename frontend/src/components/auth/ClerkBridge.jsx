import { useUser, useClerk } from "@clerk/clerk-react";
import { AppAuthProvider } from "../../contexts/AppAuthContext";

export function ClerkBridge({ children }) {
  const { user, isLoaded } = useUser();
  const { signOut } = useClerk();

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
