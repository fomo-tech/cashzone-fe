import http from "./api";
import type { AxiosResponse } from "axios";

// Types for Referral System
export interface ReferralStats {
  totalReferrals: number;
  directReferrals: number;
  level2Referrals: number;
  level3Referrals: number;
  totalCommissions: {
    level1Total: number;
    level2Total: number;
    level3Total: number;
    totalEarned: number;
  };
  monthlyStats: {
    referrals: number;
    commissions: number;
  };
}

export interface ReferralCode {
  code: string;
  shareUrl: string;
  qrCodeUrl?: string;
  createdAt: string | Date;
}

export interface ReferralHistory {
  id: string;
  referredUser: {
    id: string;
    name: string;
    email: string;
    avatar?: string;
  };
  level: 1 | 2 | 3;
  commission: number;
  status: "pending" | "approved" | "rejected";
  createdAt: string;
  approvedAt?: string;
}

export interface ReferralListResponse {
  data: ReferralHistory[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

class ReferralService {
  /**
   * Lấy thống kê referral của user hiện tại
   */
  async getReferralStats(): Promise<ReferralStats> {
    const response: AxiosResponse<{ data: ReferralStats }> = await http.get(
      "/profile/referral/stats"
    );
    return response.data.data;
  }

  /**
   * Lấy mã giới thiệu của user
   */
  async getReferralCode(): Promise<ReferralCode> {
    const response: AxiosResponse<{ data: ReferralCode }> = await http.get(
      "/profile/referral/code"
    );
    return response.data.data;
  }

  /**
   * Tạo mã giới thiệu mới (nếu chưa có)
   */
  async generateReferralCode(): Promise<ReferralCode> {
    const response: AxiosResponse<{ data: ReferralCode }> = await http.post(
      "/profile/referral/generate-code"
    );
    return response.data.data;
  }

  /**
   * Lấy danh sách lịch sử giới thiệu
   */
  async getReferralHistory(
    params: {
      page?: number;
      limit?: number;
      level?: 1 | 2 | 3;
      status?: "pending" | "approved" | "rejected";
    } = {}
  ): Promise<ReferralListResponse> {
    const response: AxiosResponse<{ data: ReferralListResponse }> =
      await http.get("/profile/referral/history", {
        params: {
          page: params.page || 1,
          limit: params.limit || 20,
          ...(params.level && { level: params.level }),
          ...(params.status && { status: params.status }),
        },
      });
    return response.data.data;
  }

  /**
   * Lấy danh sách người được giới thiệu
   */
  async getReferredUsers(
    params: {
      page?: number;
      limit?: number;
      level?: 1 | 2 | 3;
    } = {}
  ): Promise<ReferralListResponse> {
    const response: AxiosResponse<{ data: ReferralListResponse }> =
      await http.get("/profile/referral/referred-users", {
        params: {
          page: params.page || 1,
          limit: params.limit || 20,
          ...(params.level && { level: params.level }),
        },
      });
    return response.data.data;
  }

  /**
   * Share referral link qua different platforms
   */
  shareReferralLink(
    code: string,
    platform: "copy" | "facebook" | "zalo" | "telegram" | "whatsapp" = "copy"
  ): Promise<boolean> {
    const shareUrl = `${window.location.origin}/signup?ref=${code}`;
    const shareText = `🎉 Tham gia AffiliateNet và kiếm tiền cùng tôi! 💰\n\nSử dụng mã giới thiệu: ${code}\nLink: ${shareUrl}`;

    switch (platform) {
      case "copy":
        return navigator.clipboard
          .writeText(shareUrl)
          .then(() => true)
          .catch(() => false);

      case "facebook": {
        const fbUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
          shareUrl
        )}&quote=${encodeURIComponent(shareText)}`;
        window.open(fbUrl, "_blank", "width=600,height=400");
        return Promise.resolve(true);
      }

      case "zalo": {
        const zaloUrl = `https://zalo.me/share?url=${encodeURIComponent(
          shareUrl
        )}&text=${encodeURIComponent(shareText)}`;
        window.open(zaloUrl, "_blank", "width=600,height=400");
        return Promise.resolve(true);
      }

      case "telegram": {
        const telegramUrl = `https://t.me/share/url?url=${encodeURIComponent(
          shareUrl
        )}&text=${encodeURIComponent(shareText)}`;
        window.open(telegramUrl, "_blank", "width=600,height=400");
        return Promise.resolve(true);
      }

      case "whatsapp": {
        const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(
          shareText
        )}`;
        window.open(whatsappUrl, "_blank", "width=600,height=400");
        return Promise.resolve(true);
      }

      default:
        return Promise.resolve(false);
    }
  }

  /**
   * Validate referral code
   */
  async validateReferralCode(
    code: string
  ): Promise<{ valid: boolean; message?: string }> {
    try {
      const response: AxiosResponse<{
        data: { valid: boolean; message?: string };
      }> = await http.post("/auth/validate-referral-code", { code });
      return response.data.data;
    } catch (error: any) {
      return {
        valid: false,
        message: error.response?.data?.message || "Mã giới thiệu không hợp lệ",
      };
    }
  }

  /**
   * Get referral tree structure
   */
  async getReferralTree(): Promise<{
    level1: Array<{
      id: string;
      name: string;
      email: string;
      joinDate: string;
    }>;
    level2: Array<{
      id: string;
      name: string;
      email: string;
      joinDate: string;
      parentId: string;
    }>;
    level3: Array<{
      id: string;
      name: string;
      email: string;
      joinDate: string;
      parentId: string;
    }>;
  }> {
    const response: AxiosResponse<{ data: any }> = await http.get(
      "/profile/referral/tree"
    );
    return response.data.data;
  }

  /**
   * Calculate potential earnings
   */
  calculatePotentialEarnings(orderValue: number): {
    level1: number;
    level2: number;
    level3: number;
    total: number;
  } {
    const rates = {
      level1: 0.1, // 10%
      level2: 0.05, // 5%
      level3: 0.02, // 2%
    };

    const level1 = Math.round(orderValue * rates.level1);
    const level2 = Math.round(orderValue * rates.level2);
    const level3 = Math.round(orderValue * rates.level3);

    return {
      level1,
      level2,
      level3,
      total: level1 + level2 + level3,
    };
  }
}

export default new ReferralService();
