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
import type { LoginRequest, RegisterRequest } from "../types/api";

interface User {
  id: string; // The app assumes string, API returns number. We will cast it.
  name: string; // The swagger AuthResponse does not return `name`, but the old `user` state did. We'll fallback if needed.
  email: string;
  role?: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  error: string | null;
  login: (credentials: LoginRequest) => Promise<void>;
  register: (data: RegisterRequest) => Promise<void>;
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

  // Initialize user from localStorage on mount
  useEffect(() => {
    const initAuth = async () => {
      const token = getAuthToken();
      if (token) {
        try {
          // Verify token is still valid by fetching user data.
          // Note: Assuming /auth/me exists and returns User or AuthResponse shape.
          const response = await api.get("/auth/me");
          const userData = response.data.user || response.data;
          setUser({
            id: String(userData.id),
            name: userData.name || userData.email, // fallback if name not provided by backend
            email: userData.email,
            role: userData.role,
          });
        } catch {
          // Token invalid, clear it
          removeAuthToken();
        }
      }
      setIsInitialized(true);
    };
    initAuth();
  }, []);

  // Listen for unauthorized events from API interceptor
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
      // Swagger `AuthResponse` returns { token, id, role, email }
      const { token, id, role, email } = response.data;

      setAuthToken(token);
      setUser({
        id: String(id),
        name: email, // Since auth/login doesn't return name per swagger AuthResponse
        email,
        role,
      });
      navigate("/dashboard");
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

      // Check if API returns token (auto-login) or requires manual login
      if (response.data.token) {
        const { token, id, role, email } = response.data;
        setAuthToken(token);
        setUser({
          id: String(id),
          name: data.name, // We passed it in data, we can persist it locally
          email,
          role,
        });
        navigate("/dashboard");
      } else {
        // Redirect to login page
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

  function logout() {
    removeAuthToken();
    setUser(null);
    navigate("/login");
  }

  function clearError() {
    setError(null);
  }

  // Don't render children until auth is initialized
  if (!isInitialized) {
    return null;
  }

  return (
    <AuthContext.Provider
      value={{ user, isLoading, error, login, register, logout, clearError }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
