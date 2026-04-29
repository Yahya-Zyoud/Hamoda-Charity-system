import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAppAuth } from "../contexts/AppAuthContext";

export function useRequireAuth() {
  const { isAdmin, isLoaded } = useAppAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isLoaded && !isAdmin) {
      navigate("/", { replace: true });
    }
  }, [isAdmin, isLoaded, navigate]);

  return { isAdmin, isLoaded };
}
