import type { ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export default function PublicLayout({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const location = useLocation();

  if (user && location.pathname !== "/reset-password") {
    if (user.role === "ADMIN") {
      return <Navigate to="/admin" replace />;
    }
    return <Navigate to="/dashboard" replace />;
  }

  return <div className="min-h-screen bg-background">{children}</div>;
}
