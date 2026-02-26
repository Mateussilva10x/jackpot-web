import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useTranslation } from "react-i18next";
import { Home, Trophy, LogOut, User } from "lucide-react";

export default function Header() {
  const { user, logout } = useAuth();
  const { t } = useTranslation();
  const location = useLocation();

  const isMyBetsActive = location.pathname === "/dashboard";
  const isRankingActive = location.pathname === "/app/ranking";

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between max-w-7xl">
        {/* Left Section: Logo */}
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
            <Trophy className="w-5 h-5 text-primary-foreground" />
          </div>
          <Link
            to="/dashboard"
            className="text-lg font-bold text-foreground hover:opacity-80 transition-opacity"
          >
            Bolão 2026
          </Link>
        </div>

        {/* Middle Section: Navigation */}
        <nav className="hidden md:flex items-center gap-2 bg-secondary/50 p-1 rounded-full border border-border">
          <Link
            to="/dashboard"
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all ${
              isMyBetsActive
                ? "bg-secondary text-primary shadow-sm"
                : "text-muted-foreground hover:text-foreground hover:bg-secondary/80"
            }`}
          >
            <Home className="w-4 h-4" />
            {t("header.myBets", "My Bets")}
          </Link>
          <Link
            to="/app/ranking"
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all ${
              isRankingActive
                ? "bg-secondary text-primary shadow-sm"
                : "text-muted-foreground hover:text-foreground hover:bg-secondary/80"
            }`}
          >
            <Trophy className="w-4 h-4" />
            {t("header.ranking", "Ranking")}
          </Link>
          {user?.role === "ADMIN" && (
            <Link
              to="/admin"
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                location.pathname === "/admin"
                  ? "bg-secondary text-primary shadow-sm"
                  : "text-muted-foreground hover:text-foreground hover:bg-secondary/80"
              }`}
            >
              <Trophy className="w-4 h-4" />
              Admin
            </Link>
          )}
        </nav>

        {/* Right Section: User Profile */}
        <div className="flex items-center gap-4">
          {user ? (
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-secondary border border-border flex items-center justify-center overflow-hidden">
                  <User className="w-4 h-4 text-muted-foreground" />
                </div>
                <span className="text-sm font-medium text-foreground hidden sm:inline-block">
                  {user.name}
                </span>
              </div>
              <button
                onClick={logout}
                className="text-muted-foreground hover:text-destructive transition-colors p-2 rounded-full hover:bg-secondary/80"
                title={t("header.logout", "Logout")}
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <Link
              to="/login"
              className="bg-primary text-primary-foreground px-4 py-2 rounded-lg text-sm font-bold hover:bg-primary/90 transition-colors"
            >
              {t("header.login", "Entrar")}
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
