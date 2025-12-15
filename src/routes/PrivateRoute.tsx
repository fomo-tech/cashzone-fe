import { Navigate, useLocation } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import MainLayout from "@/components/layout/MainLayout";

export const PrivateRoute = () => {
  const loading = useAuthStore((s) => s.loading);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const location = useLocation();
  if (loading) return <div>Loading...</div>;

  if (!isAuthenticated) {
    if (location.pathname.startsWith("/admin")) {
      return <Navigate to="/admin/login" replace />;
    }
    return <Navigate to="/login" replace />;
  }

  // Bọc layout ở đây
  return <MainLayout />;
};
