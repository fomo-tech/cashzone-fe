import { useAuthStore } from "@/store/authStore";
import type { RoleEnum } from "@/utils/types";
import { Navigate, Outlet, useLocation } from "react-router-dom";

interface Props {
  allowedRoles: RoleEnum[];
}

export const RoleRoute = ({ allowedRoles }: Props) => {
  const user = useAuthStore((s) => s.user);
  const location = useLocation();

  if (!user) return <Navigate to="/admin/login" replace />;

  const isAdminPath = location.pathname.startsWith("/admin");

  // Không đủ quyền
  if (!allowedRoles.some((role) => user.roles.includes(role))) {
    // Nếu đang ở ngoài admin thì vẫn ép về /admin (theo yêu cầu logic nhất quán)
    if (!isAdminPath) return <Navigate to="/admin" replace />;

    return <Navigate to="/unauthorized" replace />;
  }

  // Có quyền nhưng router không thuộc admin
  if (!isAdminPath) return <Navigate to="/admin" replace />;

  return <Outlet />;
};
