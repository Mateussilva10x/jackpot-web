import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { ToastProvider } from "./hooks/useToast";
import { ToastContainer } from "./components/ui/Toast";
import PublicLayout from "./layouts/PublicLayout";
import PrivateLayout from "./layouts/PrivateLayout";
import Login from "./pages/Login";
import Admin from "./pages/Admin";
import AppBets from "./pages/app/Bets";
import AppRanking from "./pages/app/Ranking";
import UserProfile from "./pages/app/UserProfile";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import Register from "./pages/Register";
import { DesignSystemPage } from "./pages/DesignSystemPage";
import "./styles/App.css";
import Dashboard from "./pages/Dashboard";

function App() {
  return (
    <BrowserRouter>
      <ToastProvider>
        <AuthProvider>
          <ToastContainer />
          <Routes>
            <Route
              path="/login"
              element={
                <PublicLayout>
                  <Login />
                </PublicLayout>
              }
            />
            <Route
              path="/register"
              element={
                <PublicLayout>
                  <Register />
                </PublicLayout>
              }
            />
            <Route
              path="/forgot-password"
              element={
                <PublicLayout>
                  <ForgotPassword />
                </PublicLayout>
              }
            />
            <Route
              path="/reset-password"
              element={
                <PublicLayout>
                  <ResetPassword />
                </PublicLayout>
              }
            />

            <Route
              path="/dashboard"
              element={
                <PrivateLayout>
                  <Dashboard />
                </PrivateLayout>
              }
            />
            <Route
              path="/app/bets"
              element={
                <PrivateLayout>
                  <AppBets />
                </PrivateLayout>
              }
            />
            <Route
              path="/app/ranking"
              element={
                <PrivateLayout>
                  <AppRanking />
                </PrivateLayout>
              }
            />
            <Route
              path="/app/profile"
              element={
                <PrivateLayout>
                  <UserProfile />
                </PrivateLayout>
              }
            />
            <Route
              path="/profile/:id"
              element={
                <PrivateLayout>
                  <UserProfile />
                </PrivateLayout>
              }
            />
            <Route
              path="/admin"
              element={
                <PrivateLayout>
                  <Admin />
                </PrivateLayout>
              }
            />

            <Route
              path="/design-system"
              element={
                <PublicLayout>
                  <DesignSystemPage />
                </PublicLayout>
              }
            />

            <Route path="/" element={<Navigate to="/login" replace />} />
          </Routes>
        </AuthProvider>
      </ToastProvider>
    </BrowserRouter>
  );
}

export default App;
