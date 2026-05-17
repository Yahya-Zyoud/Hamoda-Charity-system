// Route guard that redirects unauthenticated or non-admin users to the home page.
import { Navigate } from "react-router-dom";
import { useAppAuth } from "../contexts/AppAuthContext";

function AdminRoute({ children }) {
  const { isAdmin, isLoaded } = useAppAuth();

  // Wait for auth state to resolve before making a routing decision.
  if (!isLoaded) return null;
  if (!isAdmin) return <Navigate to="/" replace />;
  return children;
}

export default AdminRoute;
