import type { ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { getAuthToken } from "../services/api";

export default function PublicLayout({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const location = useLocation();

  if (user && location.pathname !== "/reset-password") {
    if (user.isFirstLogin) {
      return <Navigate to={`/reset-password?token=${getAuthToken()}&firstLogin=true`} replace />;
    }
    if (user.role === "ADMIN") {
      return <Navigate to="/admin" replace />;
    }
    return <Navigate to="/dashboard" replace />;
  }

  return <div className="min-h-screen bg-background">{children}</div>;
}
