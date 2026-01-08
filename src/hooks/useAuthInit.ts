import authService from "@/services/authService";
import { useAuthStore } from "@/store/authStore";
import { useEffect } from "react";
import { useHandleSubmit } from "./useHandleSubmit";

export const useAuthInit = () => {
  const { init, setUser, accessToken, refreshToken } = useAuthStore();
  const { handleSubmit } = useHandleSubmit();
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  useEffect(() => {
    init();
  }, []);

  useEffect(() => {
    const getProfile = async () => {
      const res = await handleSubmit(
        () => authService.fetchUserProfile(),
        (err: any) => {
          console.log("Lỗi khi lấy profile:", err);
        }
      );

      if (res) {
        setUser(res);
      }
    };
    if (isAuthenticated && accessToken && refreshToken) {
      getProfile();
    }
  }, [isAuthenticated, accessToken, refreshToken]);
};
