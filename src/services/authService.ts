import type { User } from "../utils/types";
import { useAuthStore } from "@/store/authStore";
import http from "./api";

export interface LoginRequest {
  email: string;
  password: string;
}

export interface SignupRequest {
  email: string;
  password: string;
  name?: string;
  phone?: string;
  referralCode?: string;
}

export interface AuthResponse {
  user: User;
  tokens: {
    accessToken: string;
    refreshToken: string;
  };
}

const authService = {
  /**
   * Login with email and password
   */
  login: async (data: LoginRequest): Promise<AuthResponse> => {
    const response = await http.post("/auth/signin", data);
    return response.data.data;
  },

  /**
   * Sign up new account
   */
  signup: async (data: SignupRequest): Promise<AuthResponse> => {
    const response = await http.post("/auth/signup", data);
    return response.data.data;
  },

  /**
   * Get current user profile
   */
  fetchUserProfile: async () => {
    const response = await http.get("/profile/me");
    return response.data.data;
  },

  /**
   * Logout
   */
  logout: async () => {
    try {
      // Optionally call backend to invalidate tokens
      // await http.post("/auth/logout");
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      // Always clear local storage
      localStorage.removeItem("user");
      localStorage.removeItem("token");
      localStorage.removeItem("refreshToken");
    }
  },

  /**
   * Refresh access token
   */
  refreshToken: async (refreshToken: string) => {
    const response = await http.post("/auth/refresh", { refreshToken });
    return response.data.data;
  },

  //**handle logout
  handleLogout: () => {
    useAuthStore.getState().logout();
  },
};
export default authService;
