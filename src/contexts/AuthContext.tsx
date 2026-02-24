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

interface User {
  id: string;
  name: string;
  email: string;
}

interface LoginCredentials {
  email: string;
  password: string;
}

interface RegisterData {
  name: string;
  email: string;
  password: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  error: string | null;
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
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
          // Verify token is still valid by fetching user data
          const response = await api.get("/auth/me");
          setUser(response.data.user || response.data);
        } catch (err) {
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

  async function login(credentials: LoginCredentials) {
    setIsLoading(true);
    setError(null);
    try {
      const response = await api.post("/auth/login", credentials);
      const { token, user: userData } = response.data;

      setAuthToken(token);
      setUser(userData);
      navigate("/dashboard");
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message || i18n.t("auth.invalidCredentials");
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }

  async function register(data: RegisterData) {
    setIsLoading(true);
    setError(null);
    try {
      const response = await api.post("/auth/register", data);

      // Check if API returns token (auto-login) or requires manual login
      if (response.data.token) {
        const { token, user: userData } = response.data;
        setAuthToken(token);
        setUser(userData);
        navigate("/dashboard");
      } else {
        // Redirect to login page
        navigate("/login");
      }
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message || i18n.t("auth.registerError");
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

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
