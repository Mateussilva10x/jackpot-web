import { useState } from "react";
import type { FormEvent } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useAuth } from "../contexts/AuthContext";
import { useToast } from "../hooks/useToast";
import { JackpotInput } from "../components/ui/JackpotInput";
import { JackpotButton } from "../components/ui/JackpotButton";
import { JackpotCard } from "../components/ui/JackpotCard";
import { LanguageSwitcher } from "../components/LanguageSwitcher";

export default function Login() {
  const { t } = useTranslation();
  const { login, isLoading } = useAuth();
  const { showToast } = useToast();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<{ email?: string; password?: string }>(
    {},
  );

  function validateForm(): boolean {
    const newErrors: { email?: string; password?: string } = {};

    if (!email.trim()) {
      newErrors.email = t("validation.emailRequired");
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = t("validation.emailInvalid");
    }

    if (!password) {
      newErrors.password = t("validation.passwordRequired");
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      await login({ email, password });
    } catch (error) {
      const e = error as Error;
      showToast(e.message || t("auth.invalidCredentials"), "error");
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 stadium-pattern">
      {/* Language Switcher - Top Right */}
      <div className="fixed top-4 right-4 z-10">
        <LanguageSwitcher />
      </div>

      <div className="w-full max-w-md">
        {/* Logo/Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/20 mb-4 glow-primary">
            <span className="text-4xl leading-none">⚽</span>
          </div>
          <h1 className="text-3xl font-bold text-gradient-primary mb-2">
            {t("common.appName")}
          </h1>
          <p className="text-muted-foreground">{t("auth.loginTitle")}</p>
        </div>

        {/* Login Card */}
        <JackpotCard>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <JackpotInput
                label={t("auth.email")}
                type="email"
                name="email"
                placeholder="seu@email.com"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (errors.email) setErrors({ ...errors, email: undefined });
                }}
                errorMessage={errors.email}
                disabled={isLoading}
                autoComplete="email"
              />

              <JackpotInput
                label={t("auth.password")}
                type="password"
                name="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (errors.password)
                    setErrors({ ...errors, password: undefined });
                }}
                errorMessage={errors.password}
                disabled={isLoading}
                autoComplete="current-password"
              />
            </div>

            <div className="flex items-center justify-end">
              <Link
                to="/forgot-password"
                className="text-sm text-primary hover:text-primary/80 transition-colors"
              >
                {t("auth.forgotPassword")}
              </Link>
            </div>

            <JackpotButton
              type="submit"
              variant="primary"
              className="w-full"
              isLoading={isLoading}
              disabled={isLoading}
            >
              {isLoading ? t("auth.loggingIn") : t("auth.signIn")}
            </JackpotButton>
          </form>
        </JackpotCard>

        {/* Footer */}
        <p className="text-center text-xs text-muted-foreground mt-8">
          {t("auth.termsAndPrivacy", { action: t("auth.termsActionLogin") })}
        </p>
      </div>
    </div>
  );
}
