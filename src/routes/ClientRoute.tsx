import { Navigate, useLocation } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import MainLayout from "@/components/layout/MainLayout";

export const ClientRoute = () => {
  const { isAuthenticated, user } = useAuthStore();
  const { pathname } = useLocation();

  // Nếu là admin mà truy cập route client => đá về admin
  if (isAuthenticated && user?.roles?.includes("admin")) {
    if (!pathname.startsWith("/admin")) {
      return <Navigate to="/admin/dashboard" replace />;
    }
  }

  return <MainLayout />;
};
