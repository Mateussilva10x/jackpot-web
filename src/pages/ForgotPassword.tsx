import { useState } from "react";
import type { FormEvent } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useAuth } from "../contexts/AuthContext";
import { useToast } from "../hooks/useToast";
import { JackpotInput } from "../components/ui/JackpotInput";
import { JackpotButton } from "../components/ui/JackpotButton";
import { JackpotCard } from "../components/ui/JackpotCard";
import { Trophy, Mail } from "lucide-react";
import { LanguageSwitcher } from "../components/LanguageSwitcher";

export default function ForgotPassword() {
  const { t } = useTranslation();
  const { forgotPassword, isLoading } = useAuth();
  const { showToast } = useToast();
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | undefined>();
  const [isSuccess, setIsSuccess] = useState(false);

  function validateForm(): boolean {
    if (!email.trim()) {
      setError(t("validation.emailRequired", "Email is required"));
      return false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError(t("validation.emailInvalid", "Invalid email address"));
      return false;
    }

    setError(undefined);
    return true;
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      await forgotPassword(email);
      setIsSuccess(true);
      showToast(
        t("auth.forgotPasswordSuccess", "Recovery email sent"),
        "success",
      );
    } catch (error) {
      const e = error as Error;
      showToast(
        e.message || t("auth.forgotPasswordError", "Error sending email"),
        "error",
      );
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 stadium-pattern">
      <div className="fixed top-4 right-4 z-10">
        <LanguageSwitcher />
      </div>

      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/20 mb-4 glow-primary">
            <Trophy className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-3xl font-bold text-gradient-primary mb-2">
            {t("common.appName")}
          </h1>
          <p className="text-muted-foreground">
            {t("auth.forgotPasswordTitle", "Reset your password")}
          </p>
        </div>

        <JackpotCard>
          {isSuccess ? (
            <div className="text-center space-y-6 py-4">
              <div className="flex justify-center">
                <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center">
                  <Mail className="w-8 h-8 text-green-500" />
                </div>
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-bold text-foreground">
                  {t("auth.checkEmailTitle", "Check your email")}
                </h3>
                <p className="text-muted-foreground text-sm">
                  {t(
                    "auth.checkEmailText",
                    "We have sent a password reset link to",
                  )}{" "}
                  <br />
                  <span className="font-bold text-foreground">{email}</span>
                </p>
              </div>
              <div className="pt-4">
                <Link
                  to="/login"
                  className="text-primary hover:text-primary/80 font-medium transition-colors"
                >
                  {t("auth.backToLogin", "Return to Login")}
                </Link>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <p className="text-sm text-muted-foreground mb-6">
                {t(
                  "auth.forgotPasswordDesc",
                  "Enter your email address and we will send you a link to reset your password.",
                )}
              </p>

              <JackpotInput
                label={t("auth.email")}
                type="email"
                name="email"
                placeholder="seu@email.com"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (error) setError(undefined);
                }}
                errorMessage={error}
                disabled={isLoading}
                autoComplete="email"
              />

              <JackpotButton
                type="submit"
                variant="primary"
                className="w-full"
                isLoading={isLoading}
                disabled={isLoading}
              >
                {isLoading
                  ? t("auth.sending", "Sending...")
                  : t("auth.sendResetLink", "Send Reset Link")}
              </JackpotButton>

              <div className="text-center pt-2">
                <Link
                  to="/login"
                  className="text-sm text-muted-foreground hover:text-foreground font-medium transition-colors"
                >
                  {t("auth.backToLogin", "Return to Login")}
                </Link>
              </div>
            </form>
          )}
        </JackpotCard>
      </div>
    </div>
  );
}
