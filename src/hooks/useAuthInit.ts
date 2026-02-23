import authService from "@/services/authService";
import { useAuthStore } from "@/store/authStore";
import { useEffect, useRef } from "react";
import { useHandleSubmit } from "./useHandleSubmit";

export const useAuthInit = () => {
  const { init, setUser, accessToken, refreshToken } = useAuthStore();
  const { handleSubmit } = useHandleSubmit();
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const hasInitialized = useRef(false);
  const hasLoadedProfile = useRef(false);

  // Initialize auth state from localStorage (chỉ chạy 1 lần)
  useEffect(() => {
    if (!hasInitialized.current) {
      init();
      hasInitialized.current = true;
    }
  }, [init]);

  // Load user profile (chỉ khi authenticated và chưa load)
  useEffect(() => {
    const getProfile = async () => {
      if (hasLoadedProfile.current) return;
      hasLoadedProfile.current = true;

      const res = await handleSubmit(
        () => authService.fetchUserProfile(),
        (err: any) => {
          console.log("Lỗi khi lấy profile:", err);
          hasLoadedProfile.current = false; // Reset để thử lại nếu lỗi
        }
      );

      if (res) {
        setUser(res);
      }
    };

    if (isAuthenticated && accessToken && refreshToken && !hasLoadedProfile.current) {
      getProfile();
    }

    // Reset flag khi logout
    if (!isAuthenticated) {
      hasLoadedProfile.current = false;
    }
  }, [isAuthenticated, accessToken, refreshToken, handleSubmit, setUser]);
};
