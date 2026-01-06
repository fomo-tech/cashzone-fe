import type { UserProfile } from "@/services/profileService";

export const RoleEnum = {
  GUEST: "guest",
  USER: "user",
  CREATOR: "creator",
  ADMIN: "admin",
} as const;

export type RoleEnum = (typeof RoleEnum)[keyof typeof RoleEnum];

export interface User {
  _id: string;
  phone: string;
  password?: string;
  email: string;
  name?: string;
  roles: RoleEnum[];
  avatar?: string;
  wallet: {
    available: number;
    pending: number;
  };
  affiliate: {
    code?: string;
    referredBy?: string;
    referralLevel?: number; // Cấp độ trong chuỗi giới thiệu (1, 2, 3)
    totalReferrals?: number; // Tổng số người giới thiệu
    directReferrals?: number; // Số người giới thiệu trực tiếp (cấp 1)
    level2Referrals?: number; // Số người cấp 2
    level3Referrals?: number; // Số người cấp 3
    referralTree?: {
      level1: string[]; // Danh sách ID người giới thiệu cấp 1
      level2: string[]; // Danh sách ID người giới thiệu cấp 2
      level3: string[]; // Danh sách ID người giới thiệu cấp 3
    };
    commissions?: {
      level1Total: number; // Tổng hoa hồng từ cấp 1
      level2Total: number; // Tổng hoa hồng từ cấp 2
      level3Total: number; // Tổng hoa hồng từ cấp 3
      totalEarned: number; // Tổng hoa hồng kiếm được
    };
  };
  status: boolean;
  deviceFingerprint?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface AuthState {
  user: UserProfile | null;
  accessToken: string | null;
  handleToggleAuthModal: (payload?: {
    isOpen?: boolean;
    mode?: "signin" | "signup";
  }) => void;
  refreshToken: string | null;
  tokens: string | null;
  loading: boolean;
  isAuthenticated: boolean;
  setUser: (user: UserProfile | null) => void;
  isAuthModalOpen: {
    isOpen: boolean;
    mode: "signin" | "signup";
  };
  init: () => void;
  login: (data: {
    user: UserProfile;
    tokens: {
      accessToken: string;
      refreshToken: string;
    };
  }) => void;
  logout: () => void;
}

export interface AppState {
  loading: {
    [key: string]: boolean;
  };
  toast: {
    title: string;
    type: "success" | "error";
    isVisible: boolean;
    timer: number;
  } | null;
  setToast: (toast: AppState["toast"]) => void;
  setLoading: (key: string, value: boolean) => void;
}
