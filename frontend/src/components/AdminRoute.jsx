import { Navigate } from "react-router-dom";
import { useAppAuth } from "../contexts/AppAuthContext";

function AdminRoute({ children }) {
  const { isAdmin, isLoaded } = useAppAuth();

  if (!isLoaded) return null;
  if (!isAdmin) return <Navigate to="/admin/login" replace />;
  return children;
}

export default AdminRoute;
