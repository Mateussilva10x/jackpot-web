/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useEffect } from "react";
import type { ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import i18n from "../i18n/i18n";
import {
  api,
  setAuthToken,
  removeAuthToken,
  getAuthToken,
} from "../services/api";
import type {
  LoginRequest,
  RegisterRequest,
  ForgotPasswordRequest,
  ResetPasswordRequest,
} from "../types/api";

interface User {
  id: string;
  name: string;
  email: string;
  role?: string;
  avatar?: number;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  error: string | null;
  login: (credentials: LoginRequest) => Promise<void>;
  register: (data: RegisterRequest) => Promise<void>;
  forgotPassword: (email: string) => Promise<void>;
  resetPassword: (data: ResetPasswordRequest) => Promise<void>;
  logout: () => void;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const initAuth = async () => {
      const token = getAuthToken();
      if (token) {
        try {
          const response = await api.get("/auth/me");
          const userData = response.data.user || response.data;
          setUser({
            id: String(userData.id),
            name: userData.name || userData.email,
            email: userData.email,
            role: userData.role,
            avatar:
              userData.avatarId != null
                ? Number(userData.avatarId)
                : userData.avatar != null
                  ? Number(userData.avatar)
                  : undefined,
          });
        } catch {
          removeAuthToken();
        }
      }
      setIsInitialized(true);
    };
    initAuth();
  }, []);

  useEffect(() => {
    const handleUnauthorized = () => {
      setUser(null);
      navigate("/login");
    };
    window.addEventListener("auth:unauthorized", handleUnauthorized);
    return () =>
      window.removeEventListener("auth:unauthorized", handleUnauthorized);
  }, [navigate]);

  async function login(credentials: LoginRequest) {
    setIsLoading(true);
    setError(null);
    try {
      const response = await api.post("/auth/login", credentials);

      const { token, id, role, email, avatar, avatarId } = response.data;

      setAuthToken(token);
      setUser({
        id: String(id),
        name: email,
        email,
        role,
        avatar:
          avatarId != null
            ? Number(avatarId)
            : avatar != null
              ? Number(avatar)
              : undefined,
      });
      if (role === "ADMIN") {
        navigate("/admin");
      } else {
        navigate("/dashboard");
      }
    } catch (err) {
      const error = err as { response?: { data?: { message?: string } } };
      const errorMessage =
        error.response?.data?.message || i18n.t("auth.invalidCredentials");
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }

  async function register(data: RegisterRequest) {
    setIsLoading(true);
    setError(null);
    try {
      const response = await api.post("/auth/register", data);

      if (response.data.token) {
        const { token, id, role, email, avatar, avatarId } = response.data;
        setAuthToken(token);
        setUser({
          id: String(id),
          name: data.name,
          email,
          role,
          avatar:
            avatarId != null
              ? Number(avatarId)
              : avatar != null
                ? Number(avatar)
                : undefined,
        });
        if (role === "ADMIN") {
          navigate("/admin");
        } else {
          navigate("/dashboard");
        }
      } else {
        navigate("/login");
      }
    } catch (err) {
      const error = err as { response?: { data?: { message?: string } } };
      const errorMessage =
        error.response?.data?.message || i18n.t("auth.registerError");
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }

  async function forgotPassword(email: string) {
    setIsLoading(true);
    setError(null);
    try {
      await api.post("/auth/forgot-password", {
        email,
      } as ForgotPasswordRequest);
    } catch (err) {
      const error = err as { response?: { data?: { message?: string } } };
      const errorMessage =
        error.response?.data?.message ||
        i18n.t("auth.forgotPasswordError", "Error processing request");
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }

  async function resetPassword(data: ResetPasswordRequest) {
    setIsLoading(true);
    setError(null);
    try {
      await api.post("/auth/reset-password", data);
    } catch (err) {
      const error = err as { response?: { data?: { message?: string } } };
      const errorMessage =
        error.response?.data?.message ||
        i18n.t("auth.resetPasswordError", "Error resetting password");
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }

  function logout() {
    removeAuthToken();
    setUser(null);
    navigate("/login");
  }

  function clearError() {
    setError(null);
  }

  if (!isInitialized) {
    return null;
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        error,
        login,
        register,
        forgotPassword,
        resetPassword,
        logout,
        clearError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
