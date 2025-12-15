import { Navigate, useLocation } from "react-router-dom";
import { useAuthStore } from "../store/authStore";

interface GuestRouteProps {
  children: React.ReactNode;
}

export const GuestRoute: React.FC<GuestRouteProps> = ({ children }) => {
  const { loading, user, isAuthenticated } = useAuthStore();
  const { pathname } = useLocation();

  if (loading) return <div>Loading...</div>;

  // ===== ADMIN LOGGED IN =====
  if (isAuthenticated && user?.roles?.includes("admin")) {
    // Nếu không phải route /admin thì ép về admin
    if (!pathname.startsWith("/admin")) {
      return <Navigate to="/admin/dashboard" replace />;
    }

    // Nếu vào /admin/login thì đá về dashboard
    if (pathname === "/admin/login") {
      return <Navigate to="/admin/dashboard" replace />;
    }
  }

  // ===== USER LOGGED IN =====
  if (isAuthenticated && user?.roles?.includes("user")) {
    if (pathname === "/login" || pathname === "/register") {
      return <Navigate to="/dashboard" replace />;
    }
  }

  return <>{children}</>;
};
