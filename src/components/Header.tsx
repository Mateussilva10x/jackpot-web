import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useTranslation } from "react-i18next";
import { Home, Trophy, LogOut, User, Globe, Menu, X } from "lucide-react";
import { getAvatarById } from "../utils/avatar";

export default function Header() {
  const { user, logout } = useAuth();
  const { t, i18n } = useTranslation();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLanguageToggle = () => {
    const newLang = i18n.language === "en" ? "pt-BR" : "en";
    i18n.changeLanguage(newLang);
  };

  const isMyBetsActive = location.pathname === "/dashboard";
  const isRankingActive = location.pathname === "/app/ranking";

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between max-w-7xl">
          {/* Left Section: Logo */}
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center glow-primary">
              <span className="text-xl leading-none">⚽</span>
            </div>
            <Link
              to={user?.role === "ADMIN" ? "/admin" : "/dashboard"}
              className="text-lg font-bold text-foreground hover:opacity-80 transition-opacity"
            >
              {t("common.appName", "Bolão do Hexa")}
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-2 bg-secondary/50 p-1 rounded-full border border-border">
            {user?.role !== "ADMIN" && (
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
            )}
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

          {/* Right Section: Actions & Mobile Toggle */}
          <div className="flex items-center gap-2 sm:gap-4">
            <button
              onClick={handleLanguageToggle}
              className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors p-2 rounded-full hover:bg-secondary/80 text-sm font-medium"
              title={t("header.toggleLanguage", "Trocar Idioma")}
            >
              <Globe className="w-4 h-4" />
              <span className="hidden sm:inline-block uppercase">
                {i18n.language === "en" ? "EN" : "PT"}
              </span>
            </button>

            {user ? (
              <div className="hidden md:flex items-center gap-4">
                <Link
                  to="/app/profile"
                  className="flex items-center gap-2 hover:opacity-80 transition-opacity"
                  title={t("header.profile", "Meu Perfil")}
                >
                  <div className="w-8 h-8 rounded-full bg-secondary border border-border flex items-center justify-center overflow-hidden">
                    {user.avatar ? (
                      <span className="text-xl">
                        {getAvatarById(user.avatar) || "⚽"}
                      </span>
                    ) : (
                      <User className="w-4 h-4 text-muted-foreground" />
                    )}
                  </div>
                  <span className="text-sm font-medium text-foreground">
                    {user.name}
                  </span>
                </Link>
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
                className="hidden md:flex bg-primary text-primary-foreground px-4 py-2 rounded-lg text-sm font-bold hover:bg-primary/90 transition-colors"
              >
                {t("header.login", "Entrar")}
              </Link>
            )}

            {/* Mobile Menu Toggle */}
            <button
              onClick={toggleMenu}
              className="md:hidden p-2 text-foreground hover:bg-secondary/80 rounded-full transition-colors"
            >
              {isMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {isMenuOpen && (
          <div className="md:hidden absolute top-16 left-0 right-0 bg-background border-b border-border shadow-lg p-4 flex flex-col gap-4 animate-in slide-in-from-top-2">
            {user?.role !== "ADMIN" && (
              <Link
                to="/dashboard"
                onClick={toggleMenu}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-bold ${
                  isMyBetsActive
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:bg-secondary"
                }`}
              >
                <Home className="w-5 h-5" />
                {t("header.myBets", "My Bets")}
              </Link>
            )}
            <Link
              to="/app/ranking"
              onClick={toggleMenu}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-bold ${
                isRankingActive
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:bg-secondary"
              }`}
            >
              <Trophy className="w-5 h-5" />
              {t("header.ranking", "Ranking")}
            </Link>
            {user?.role === "ADMIN" && (
              <Link
                to="/admin"
                onClick={toggleMenu}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-bold ${
                  location.pathname === "/admin"
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:bg-secondary"
                }`}
              >
                <Trophy className="w-5 h-5" />
                Admin
              </Link>
            )}

            {user ? (
              <>
                <div className="h-px bg-border my-2" />
                <Link
                  to="/app/profile"
                  onClick={toggleMenu}
                  className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-bold text-foreground hover:bg-secondary"
                >
                  <User className="w-5 h-5" />
                  {t("header.profile", "Meu Perfil")}
                </Link>
                <button
                  onClick={() => {
                    logout();
                    toggleMenu();
                  }}
                  className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-bold text-destructive hover:bg-destructive/10 w-full text-left"
                >
                  <LogOut className="w-5 h-5" />
                  {t("header.logout", "Logout")}
                </button>
              </>
            ) : (
              <Link
                to="/login"
                onClick={toggleMenu}
                className="mt-2 bg-primary text-primary-foreground px-4 py-3 rounded-lg text-sm font-bold text-center"
              >
                {t("header.login", "Entrar")}
              </Link>
            )}
          </div>
        )}
      </header>
    </>
  );
}
