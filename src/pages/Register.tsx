import { useState } from "react";
import type { FormEvent } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useAuth } from "../contexts/AuthContext";
import { useToast } from "../hooks/useToast";
import { JackpotInput } from "../components/ui/JackpotInput";
import { JackpotButton } from "../components/ui/JackpotButton";
import { JackpotCard } from "../components/ui/JackpotCard";
import { Trophy } from "lucide-react";
import { LanguageSwitcher } from "../components/LanguageSwitcher";

export default function Register() {
  const { t } = useTranslation();
  const { register, isLoading } = useAuth();
  const { showToast } = useToast();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState<{
    name?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
  }>({});

  function validateForm(): boolean {
    const newErrors: typeof errors = {};

    if (!formData.name.trim()) {
      newErrors.name = t("validation.nameRequired");
    } else if (formData.name.trim().length < 3) {
      newErrors.name = t("validation.nameMinLength", { min: 3 });
    }

    if (!formData.email.trim()) {
      newErrors.email = t("validation.emailRequired");
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = t("validation.emailInvalid");
    }

    if (!formData.password) {
      newErrors.password = t("validation.passwordRequired");
    } else if (formData.password.length < 6) {
      newErrors.password = t("validation.passwordMinLength", { min: 6 });
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = t("validation.confirmPasswordRequired");
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = t("validation.passwordsNotMatch");
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
      await register({
        name: formData.name,
        email: formData.email,
        password: formData.password,
      });
      showToast(t("auth.registerSuccess"), "success");
    } catch (error) {
      const e = error as Error;
      showToast(e.message || t("auth.registerError"), "error");
    }
  }

  function handleChange(field: keyof typeof formData, value: string) {
    setFormData({ ...formData, [field]: value });
    if (errors[field]) {
      setErrors({ ...errors, [field]: undefined });
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
            <Trophy className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-3xl font-bold text-gradient-primary mb-2">
            {t("auth.createAccount")}
          </h1>
          <p className="text-muted-foreground">{t("auth.registerTitle")}</p>
        </div>

        {/* Register Card */}
        <JackpotCard>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <JackpotInput
                label={t("auth.fullName")}
                type="text"
                name="name"
                placeholder="João Silva"
                value={formData.name}
                onChange={(e) => handleChange("name", e.target.value)}
                errorMessage={errors.name}
                disabled={isLoading}
                autoComplete="name"
              />

              <JackpotInput
                label={t("auth.email")}
                type="email"
                name="email"
                placeholder="seu@email.com"
                value={formData.email}
                onChange={(e) => handleChange("email", e.target.value)}
                errorMessage={errors.email}
                disabled={isLoading}
                autoComplete="email"
              />

              <JackpotInput
                label={t("auth.password")}
                type="password"
                name="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={(e) => handleChange("password", e.target.value)}
                errorMessage={errors.password}
                disabled={isLoading}
                autoComplete="new-password"
              />

              <JackpotInput
                label={t("auth.confirmPassword")}
                type="password"
                name="confirmPassword"
                placeholder="••••••••"
                value={formData.confirmPassword}
                onChange={(e) =>
                  handleChange("confirmPassword", e.target.value)
                }
                errorMessage={errors.confirmPassword}
                disabled={isLoading}
                autoComplete="new-password"
              />
            </div>

            <JackpotButton
              type="submit"
              variant="primary"
              className="w-full"
              isLoading={isLoading}
              disabled={isLoading}
            >
              {isLoading ? t("auth.creatingAccount") : t("auth.createAccount")}
            </JackpotButton>

            <div className="text-center text-sm text-muted-foreground">
              {t("auth.hasAccount")}{" "}
              <Link
                to="/login"
                className="text-primary hover:text-primary/80 font-medium transition-colors"
              >
                {t("auth.signIn")}
              </Link>
            </div>
          </form>
        </JackpotCard>

        {/* Footer */}
        <p className="text-center text-xs text-muted-foreground mt-8">
          {t("auth.termsAndPrivacy", { action: t("auth.termsActionRegister") })}
        </p>
      </div>
    </div>
  );
}
