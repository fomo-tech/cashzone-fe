import http from "@/services/api";

export interface CommissionSettings {
  level1Rate: number;
  level2Rate: number;
  level3Rate: number;
  enabled: boolean;
  maxLevels: number;
}

export interface ReferralMilestone {
  referrals: number;
  reward: number;
  title: string;
}

export interface PublicAppSettings {
  commission: CommissionSettings;
  referralMilestones: ReferralMilestone[];
  defaultCashbackRate: number;
  systemName: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

const appSettingsService = {
  /**
   * Get public app settings (no auth required)
   * Includes: commission rates, referral milestones, default cashback rate
   */
  getPublicSettings: async (): Promise<PublicAppSettings> => {
    const response = await http.get<ApiResponse<PublicAppSettings>>(
      "/app-settings/public",
    );
    return response.data.data;
  },

  /**
   * Get all app settings (admin only)
   */
  getAllSettings: async (): Promise<any> => {
    const response = await http.get("/app-settings");
    return response.data.data;
  },

  /**
   * Update app settings (admin only)
   */
  updateSettings: async (updates: any): Promise<any> => {
    const response = await http.put("/app-settings", updates);
    return response.data.data;
  },
};

export default appSettingsService;
