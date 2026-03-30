import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { adminService } from "../../services/adminService";
import { JackpotInput } from "../ui/JackpotInput";
import { JackpotButton } from "../ui/JackpotButton";
import { useToast } from "../../hooks/useToast";
import { UserPlus } from "lucide-react";

export const AdminUserRegistration: React.FC = () => {
  const { t } = useTranslation();
  const { showToast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.password) {
      showToast(
        t("validation.nameRequired") + " / " + t("validation.emailRequired"),
        "error",
      );
      return;
    }

    setIsLoading(true);
    try {
      await adminService.registerUser({
        name: formData.name,
        email: formData.email,
        password: formData.password,
      });
      showToast(t("admin.userCreatedSuccess"), "success");
      setFormData({ name: "", email: "", password: "" });
    } catch (error) {
      console.error("Failed to register user", error);
      showToast(t("admin.userCreatedError"), "error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-card border border-border rounded-xl p-6 mb-8 shadow-sm">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 bg-primary/10 rounded-lg text-primary">
          <UserPlus className="w-6 h-6" />
        </div>
        <div>
          <h2 className="text-xl font-bold">{t("admin.createUser")}</h2>
          <p className="text-sm text-muted-foreground">
            {t("admin.createUserSubtitle")}
          </p>
        </div>
      </div>

      <form onSubmit={handleRegister} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <JackpotInput
            label={t("auth.name")}
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder={t("admin.userNamePlaceholder")}
            disabled={isLoading}
          />
          <JackpotInput
            label={t("auth.email")}
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder={t("admin.userEmailPlaceholder")}
            disabled={isLoading}
          />
          <JackpotInput
            label={t("auth.password")}
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder={t("admin.userPasswordPlaceholder")}
            disabled={isLoading}
          />
        </div>
        <div className="flex justify-end pt-2">
          <JackpotButton
            type="submit"
            variant="primary"
            isLoading={isLoading}
            disabled={isLoading}
          >
            {t("admin.createUserButton")}
          </JackpotButton>
        </div>
      </form>
    </div>
  );
};
