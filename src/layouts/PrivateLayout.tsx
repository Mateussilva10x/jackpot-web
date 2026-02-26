import type { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import Header from "../components/Header";
import { useAuth } from "../contexts/AuthContext";

export default function PrivateLayout({ children }: { children: ReactNode }) {
  const { user } = useAuth();

  if (!user) return <Navigate to="/login" replace />;

  return (
    <div className="min-h-screen bg-background flex flex-col md:pb-0 pb-16">
      <Header />
      <main className="flex-1">{children}</main>
    </div>
  );
}
