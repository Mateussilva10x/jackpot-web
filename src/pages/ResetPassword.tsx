import { useState, useEffect } from "react";
import type { FormEvent } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useAuth } from "../contexts/AuthContext";
import { useToast } from "../hooks/useToast";
import { JackpotInput } from "../components/ui/JackpotInput";
import { JackpotButton } from "../components/ui/JackpotButton";
import { JackpotCard } from "../components/ui/JackpotCard";
import { Trophy, CheckCircle } from "lucide-react";
import { LanguageSwitcher } from "../components/LanguageSwitcher";

export default function ResetPassword() {
  const { t } = useTranslation();
  const { resetPassword, isLoading } = useAuth();
  const { showToast } = useToast();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const token = searchParams.get("token");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState<{
    password?: string;
    confirmPassword?: string;
  }>({});
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    if (!token) {
      showToast(
        t("auth.invalidTokenError", "Invalid or missing reset token"),
        "error",
      );
      navigate("/login");
    }
  }, [token, navigate, showToast, t]);

  function validateForm(): boolean {
    const newErrors: { password?: string; confirmPassword?: string } = {};

    if (!password) {
      newErrors.password = t(
        "validation.passwordRequired",
        "Password is required",
      );
    } else if (password.length < 6) {
      newErrors.password = t("validation.passwordMinLength", { min: 6 });
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = t(
        "validation.confirmPasswordRequired",
        "Please confirm your password",
      );
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = t(
        "validation.passwordsNotMatch",
        "Passwords do not match",
      );
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();

    if (!validateForm() || !token) {
      return;
    }

    try {
      await resetPassword({ token, newPassword: password });
      setIsSuccess(true);
      showToast(
        t("auth.resetPasswordSuccess", "Password reset successfully"),
        "success",
      );
    } catch (error) {
      const e = error as Error;
      showToast(
        e.message || t("auth.resetPasswordError", "Error resetting password"),
        "error",
      );
    }
  }

  if (!token) return null;

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
            {t("auth.createNewPassword", "Create new password")}
          </p>
        </div>

        <JackpotCard>
          {isSuccess ? (
            <div className="text-center space-y-6 py-4">
              <div className="flex justify-center">
                <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center">
                  <CheckCircle className="w-8 h-8 text-green-500" />
                </div>
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-bold text-foreground">
                  {t("auth.passwordChanged", "Password Changed!")}
                </h3>
                <p className="text-muted-foreground text-sm">
                  {t(
                    "auth.passwordChangedDesc",
                    "Your password has been changed successfully.",
                  )}
                </p>
              </div>
              <div className="pt-4">
                <JackpotButton
                  onClick={() => navigate("/login")}
                  variant="primary"
                  className="w-full"
                >
                  {t("auth.signIn", "Sign In")}
                </JackpotButton>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-4">
                <JackpotInput
                  label={t("auth.newPassword", "New Password")}
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
                  autoComplete="new-password"
                />

                <JackpotInput
                  label={t("auth.confirmNewPassword", "Confirm New Password")}
                  type="password"
                  name="confirmPassword"
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => {
                    setConfirmPassword(e.target.value);
                    if (errors.confirmPassword)
                      setErrors({ ...errors, confirmPassword: undefined });
                  }}
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
                {isLoading
                  ? t("auth.saving", "Saving...")
                  : t("auth.resetPassword", "Reset Password")}
              </JackpotButton>
            </form>
          )}
        </JackpotCard>
      </div>
    </div>
  );
}
