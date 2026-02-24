import type { RoleEnum } from "@/utils/types";
import http from "./api";

export interface BankingInfo {
  bankName?: string;
  accountNumber?: string;
  accountName?: string;
  branch?: string;
}

export interface BEP20Info {
  walletAddress?: string;
  network?: string;
}

export interface PaymentInfo {
  bankInfo?: BankingInfo;
  momoInfo?: {
    phoneNumber?: string;
    accountName?: string;
  };
  bep20Info?: BEP20Info;
}

export interface UserProfile {
  _id: string;
  phone: string;
  password?: string;
  name?: string;
  email: string;
  avatar?: string;
  roles: RoleEnum[];
  wallet: {
    available: number;
    pending: number;
  };
  paymentInfo?: {
    bankInfo?: {
      bankName: string;
      accountNumber: string;
      accountName: string;
      branch?: string;
    };
    momoInfo?: {
      phoneNumber: string;
      accountName: string;
    };
    bep20Info?: {
      walletAddress: string;
      network: string;
    };
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

const profileService = {
  /**
   * Get current user profile
   */
  getProfile: async (): Promise<UserProfile> => {
    const response = await http.get("/profile/me");
    return response.data.data;
  },

  /**
   * Update user profile (name, phone)
   */
  updateProfile: async (data: {
    name?: string;
    phone?: string;
  }): Promise<UserProfile> => {
    const response = await http.put("/profile/update", data);
    return response.data.data;
  },

  /**
   * Update banking information
   */
  updateBankingInfo: async (data: {
    bankName: string;
    accountNumber: string;
    accountName: string;
  }): Promise<UserProfile> => {
    const response = await http.put("/profile/banking", data);
    return response.data.data;
  },

  /**
   * Update BEP20 address
   */
  updateBEP20Address: async (bep20Address: string): Promise<UserProfile> => {
    const response = await http.put("/profile/bep20", { bep20Address });
    return response.data.data;
  },

  /**
   * Update Momo information
   */
  updateMomoInfo: async (data: {
    phoneNumber: string;
    accountName: string;
  }): Promise<UserProfile> => {
    const response = await http.put("/profile/momo", data);
    return response.data.data;
  },

  /**
   * Get user balance
   */
  getBalance: async () => {
    const response = await http.get("/profile/balance");
    return response.data.data;
  },

  /**
   * Get user statistics
   */
  getStats: async () => {
    const response = await http.get("/profile/stats");
    return response.data.data;
  },
};

export default profileService;
