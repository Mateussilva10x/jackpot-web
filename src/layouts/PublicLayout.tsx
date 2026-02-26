import type { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export default function PublicLayout({ children }: { children: ReactNode }) {
  const { user } = useAuth();

  if (user) {
    if (user.role === "ADMIN") {
      return <Navigate to="/admin" replace />;
    }
    return <Navigate to="/dashboard" replace />;
  }

  return <div className="min-h-screen bg-background">{children}</div>;
}
