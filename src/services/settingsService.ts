import http from "@/services/api";

export interface AppSettings {
  // Cấu hình chung
  appName: string;
  appDescription: string;
  appVersion: string;
  appLogo: string;
  supportEmail: string;
  supportPhone: string;
  termsOfServiceUrl: string;
  privacyPolicyUrl: string;

  // Social Media
  facebookUrl: string;
  twitterUrl: string;
  instagramUrl: string;
  linkedinUrl: string;

  // Cấu hình tài chính
  minWithdrawalAmount: number;
  maxWithdrawalAmount: number;
  withdrawalFee: number;
  withdrawalFeeType: "fixed" | "percentage";
  withdrawalProcessingTime: number;

  // Payment Methods
  enableBankTransfer: boolean;
  enableMomo: boolean;
  enableZaloPay: boolean;
  enableViettelPay: boolean;

  // Cấu hình hoa hồng
  defaultCommissionRate: number;
  referralCommissionRate: number;
  tierCommissionRates: { tier: number; rate: number }[];

  // Cấu hình người dùng
  minRegistrationAge: number;
  requireEmailVerification: boolean;
  requirePhoneVerification: boolean;
  allowGuestCheckout: boolean;
  autoApproveNewUsers: boolean;

  // Cấu hình bảo mật
  sessionTimeout: number;
  maxLoginAttempts: number;
  passwordMinLength: number;
  requireStrongPassword: boolean;
  enable2FA: boolean;

  // Cấu hình thông báo
  enableEmailNotifications: boolean;
  enablePushNotifications: boolean;
  enableSMSNotifications: boolean;

  // API Configuration
  apiRateLimit: number;
  enableApiCache: boolean;
  apiCacheDuration: number;

  // Advanced
  enableDebugMode: boolean;
  enableAnalytics: boolean;
  maxUploadFileSize: number;
  allowedFileTypes: string[];

  // Bảo trì
  maintenanceMode: boolean;
  maintenanceMessage: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

const settingsService = {
  // Lấy tất cả settings
  getSettings: async (): Promise<ApiResponse<AppSettings>> => {
    const response = await http.get(`/settings`);
    return response.data;
  },

  // Cập nhật settings
  updateSettings: async (
    settings: Partial<AppSettings>
  ): Promise<ApiResponse<AppSettings>> => {
    const response = await http.put(`/settings`, settings);
    return response.data;
  },

  // Reset về mặc định
  resetToDefaults: async (): Promise<ApiResponse<AppSettings>> => {
    const response = await http.post(`/settings/reset`);
    return response.data;
  },

  // Lấy public settings (không cần auth)
  getPublicSettings: async (): Promise<ApiResponse<Partial<AppSettings>>> => {
    const response = await http.get(`/settings/public`);
    return response.data;
  },
};

export default settingsService;
