/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext } from "react";

const AppAuthContext = createContext(null);

export function AppAuthProvider({ children, value }) {
  return (
    <AppAuthContext.Provider value={value}>
      {children}
    </AppAuthContext.Provider>
  );
}

export function useAppAuth() {
  const ctx = useContext(AppAuthContext);
  if (!ctx) {
    return { user: null, isAdmin: false, isLoaded: true, signOut: () => {} };
  }
  return ctx;
}
