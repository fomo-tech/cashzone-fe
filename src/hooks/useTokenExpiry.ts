import { useEffect } from "react";
import { useAuthStore } from "@/store/authStore";
import { notification } from "@/utils/notification";

/**
 * Hook to check if access token is about to expire and show warning
 */
export const useTokenExpiryCheck = () => {
  const { accessToken, logout } = useAuthStore();

  useEffect(() => {
    if (!accessToken) return;

    try {
      // Decode JWT to get expiry time
      const payload = JSON.parse(atob(accessToken.split(".")[1]));
      const expiryTime = payload.exp * 1000; // Convert to milliseconds
      const currentTime = Date.now();
      const timeUntilExpiry = expiryTime - currentTime;

      // If token expires in less than 5 minutes, show warning
      if (timeUntilExpiry > 0 && timeUntilExpiry < 5 * 60 * 1000) {
        const warningTimer = setTimeout(() => {
          notification({
            message: "Phiên đăng nhập sắp hết hạn",
            description:
              "Phiên của bạn sẽ hết hạn trong vài phút. Vui lòng làm mới trang để tiếp tục.",
            type: "warning",
            duration: 5000,
          });
        }, Math.max(0, timeUntilExpiry - 4 * 60 * 1000)); // Show 4 minutes before expiry

        return () => clearTimeout(warningTimer);
      }

      // If token already expired, logout
      if (timeUntilExpiry <= 0) {
        logout();
        notification({
          message: "Phiên đăng nhập đã hết hạn",
          description: "Vui lòng đăng nhập lại.",
          type: "error",
        });
        window.location.href = "/login";
      }
    } catch (error) {
      console.error("Error checking token expiry:", error);
    }
  }, [accessToken, logout]);
};

/**
 * Utility to decode JWT and check if it's expired
 */
export const isTokenExpired = (token: string): boolean => {
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    const expiryTime = payload.exp * 1000;
    return Date.now() >= expiryTime;
  } catch {
    return true;
  }
};

/**
 * Get remaining time until token expires (in milliseconds)
 */
export const getTokenRemainingTime = (token: string): number => {
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    const expiryTime = payload.exp * 1000;
    return Math.max(0, expiryTime - Date.now());
  } catch {
    return 0;
  }
};
