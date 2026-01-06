import React, { useState, useEffect } from "react";
import {
  Settings,
  Save,
  RefreshCw,
  Loader2,
  DollarSign,
  Percent,
  Users,
  Mail,
  Globe,
  Shield,
  Bell,
  Database,
  Download,
  Upload,
  Phone,
  Smartphone,
  Lightbulb,
  BarChart3,
  AlertTriangle,
  Key,
  CheckSquare,
  Target,
} from "lucide-react";
import { notification } from "../../utils/notification";
import settingsService from "../../services/settingsService";
import type { AppSettings } from "../../services/settingsService";

// Interface cho app settings
interface AppSettingsData {
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
  withdrawalProcessingTime: number; // giờ

  // Payment Methods
  enableBankTransfer: boolean;
  enableMomo: boolean;
  enableZaloPay: boolean;
  enableViettelPay: boolean;

  // Cấu hình hoa hồng
  defaultCommissionRate: number;
  referralCommissionRate: number;
  tierCommissionRates: { tier: number; rate: number }[];

  // Commission system (detailed)
  commission?: {
    level1Rate: number;
    level2Rate: number;
    level3Rate: number;
    enabled: boolean;
    maxLevels: number;
  };

  // Cấu hình người dùng
  minRegistrationAge: number;
  requireEmailVerification: boolean;
  requirePhoneVerification: boolean;
  allowGuestCheckout: boolean;
  autoApproveNewUsers: boolean;

  // Cấu hình bảo mật
  sessionTimeout: number; // phút
  maxLoginAttempts: number;
  passwordMinLength: number;
  requireStrongPassword: boolean;
  enable2FA: boolean;

  // Cấu hình thông báo
  enableEmailNotifications: boolean;
  enablePushNotifications: boolean;
  enableSMSNotifications: boolean;

  // API Configuration
  apiRateLimit: number; // requests per minute
  enableApiCache: boolean;
  apiCacheDuration: number; // seconds

  // Advanced
  enableDebugMode: boolean;
  enableAnalytics: boolean;
  maxUploadFileSize: number; // MB
  allowedFileTypes: string[];

  // Bảo trì
  maintenanceMode: boolean;
  maintenanceMessage: string;
}

const AppSettings: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<
    | "general"
    | "financial"
    | "payment"
    | "security"
    | "notifications"
    | "advanced"
  >("general");

  const [settings, setSettings] = useState<AppSettingsData>({
    // Giá trị mặc định
    appName: "Affiliate Network App",
    appDescription: "Nền tảng tiếp thị liên kết và kiếm tiền online",
    appVersion: "1.0.0",
    appLogo: "/logo.png",
    supportEmail: "support@affiliate.com",
    supportPhone: "0123456789",
    termsOfServiceUrl: "/terms",
    privacyPolicyUrl: "/privacy",

    facebookUrl: "https://facebook.com/yourpage",
    twitterUrl: "https://twitter.com/yourpage",
    instagramUrl: "https://instagram.com/yourpage",
    linkedinUrl: "https://linkedin.com/company/yourpage",

    minWithdrawalAmount: 100000,
    maxWithdrawalAmount: 10000000,
    withdrawalFee: 5000,
    withdrawalFeeType: "fixed",
    withdrawalProcessingTime: 24,

    enableBankTransfer: true,
    enableMomo: true,
    enableZaloPay: true,
    enableViettelPay: false,

    defaultCommissionRate: 10,
    referralCommissionRate: 5,
    tierCommissionRates: [
      { tier: 1, rate: 10 },
      { tier: 2, rate: 12 },
      { tier: 3, rate: 15 },
    ],

    minRegistrationAge: 18,
    requireEmailVerification: true,
    requirePhoneVerification: false,
    allowGuestCheckout: false,
    autoApproveNewUsers: true,

    sessionTimeout: 30,
    maxLoginAttempts: 5,
    passwordMinLength: 8,
    requireStrongPassword: true,
    enable2FA: false,

    enableEmailNotifications: true,
    enablePushNotifications: true,
    enableSMSNotifications: false,

    apiRateLimit: 100,
    enableApiCache: true,
    apiCacheDuration: 300,

    enableDebugMode: false,
    enableAnalytics: true,
    maxUploadFileSize: 5,
    allowedFileTypes: ["jpg", "jpeg", "png", "pdf"],

    maintenanceMode: false,
    maintenanceMessage: "Hệ thống đang bảo trì, vui lòng quay lại sau.",
  });

  // Load settings from API
  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    setLoading(true);
    try {
      const response = await settingsService.getSettings();
      if (response.success) {
        setSettings(response.data as AppSettingsData);
      }
    } catch (error) {
      notification({
        message: "Không thể tải cấu hình",
        type: "error",
      });
      console.error("Error fetching settings:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const response = await settingsService.updateSettings(
        settings as Partial<AppSettings>
      );
      if (response.success) {
        setSettings(response.data as AppSettingsData);
        notification({
          message: "Lưu cấu hình thành công!",
          type: "success",
        });
      }
    } catch (error) {
      notification({
        message: "Lưu cấu hình thất bại",
        type: "error",
      });
      console.error("Error saving settings:", error);
    } finally {
      setSaving(false);
    }
  };

  const handleExportConfig = () => {
    const dataStr = JSON.stringify(settings, null, 2);
    const dataBlob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `app-settings-${new Date().getTime()}.json`;
    link.click();
    URL.revokeObjectURL(url);
    notification({
      message: "Xuất cấu hình thành công!",
      type: "success",
    });
  };

  const handleImportConfig = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const imported = JSON.parse(e.target?.result as string);
        setSettings(imported);
        notification({
          message: "Nhập cấu hình thành công!",
          type: "success",
        });
      } catch (error) {
        notification({
          message: "File cấu hình không hợp lệ",
          type: "error",
        });
      }
    };
    reader.readAsText(file);
  };

  const handleResetToDefaults = async () => {
    if (
      !confirm(
        "Bạn có chắc muốn khôi phục cấu hình mặc định? Mọi thay đổi sẽ bị mất!"
      )
    )
      return;

    setSaving(true);
    try {
      const response = await settingsService.resetToDefaults();
      if (response.success) {
        setSettings(response.data as AppSettingsData);
        notification({
          message: "Đã khôi phục cấu hình mặc định",
          type: "success",
        });
      }
    } catch (error) {
      notification({
        message: "Không thể khôi phục cấu hình mặc định",
        type: "error",
      });
      console.error("Error resetting settings:", error);
    } finally {
      setSaving(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  const tabs = [
    { id: "general", name: "Chung", icon: <Globe size={18} /> },
    { id: "financial", name: "Tài chính", icon: <DollarSign size={18} /> },
    { id: "payment", name: "Thanh toán", icon: <Database size={18} /> },
    { id: "security", name: "Bảo mật", icon: <Shield size={18} /> },
    { id: "notifications", name: "Thông báo", icon: <Bell size={18} /> },
    { id: "advanced", name: "Nâng cao", icon: <Settings size={18} /> },
  ];

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 to-orange-1000 p-4 sm:p-6">
      {/* Header */}
      <div className="bg-linear-to-r from-orange-400 via-orange-450 to-orange-1000 rounded-2xl shadow-xl p-6 sm:p-8 mb-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight mb-2 flex items-center gap-3">
              <Settings size={40} />
              <Settings className="w-6 h-6 text-orange-500 mr-3" />
              Cấu Hình Ứng Dụng
            </h1>
            <p className="text-orange-500 text-base">
              Quản lý các thiết lập và cấu hình hệ thống
            </p>
          </div>
          <div className="flex gap-3 flex-wrap">
            <button
              onClick={handleResetToDefaults}
              className="flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm text-white rounded-lg hover:bg-white/20 font-medium transition-all border border-white/30 text-sm"
            >
              🔄 Reset
            </button>
            <button
              onClick={handleExportConfig}
              className="flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm text-white rounded-lg hover:bg-white/20 font-medium transition-all border border-white/30 text-sm"
            >
              <Download className="w-4 h-4 mr-2" />
              Export
            </button>
            <label className="flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm text-white rounded-lg hover:bg-white/20 font-medium transition-all border border-white/30 cursor-pointer text-sm">
              <Upload className="w-4 h-4 mr-2" />
              Import
              <input
                type="file"
                accept=".json"
                onChange={handleImportConfig}
                className="hidden"
              />
            </label>
            <button
              onClick={fetchSettings}
              disabled={loading}
              className="flex items-center gap-2 px-5 py-3 bg-white/20 backdrop-blur-sm text-white rounded-xl hover:bg-white/30 font-semibold transition-all border-2 border-white/30"
            >
              <RefreshCw size={18} className={loading ? "animate-spin" : ""} />
              Làm mới
            </button>
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-orange-400 to-orange-1000 text-white rounded-xl hover:from-orange-500 hover:to-orange-600 font-bold shadow-lg hover:shadow-xl transition-all transform hover:scale-105"
            >
              {saving ? (
                <>
                  <Loader2 size={20} className="animate-spin" />
                  Đang lưu...
                </>
              ) : (
                <>
                  <Save size={20} />
                  Lưu thay đổi
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-2xl shadow-lg mb-6 p-2 border border-orange-500">
        <div className="flex gap-2 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-5 py-3 rounded-xl font-semibold transition-all whitespace-nowrap ${
                activeTab === tab.id
                  ? "bg-linear-to-r from-orange-400 to-orange-1000 text-white shadow-lg"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              {tab.icon}
              {tab.name}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl shadow-lg">
          <Loader2 className="w-12 h-12 animate-spin text-orange-500 mb-4" />
          <p className="text-gray-600 font-semibold">Đang tải cấu hình...</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8 border border-orange-500">
          {/* General Settings */}
          {activeTab === "general" && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2 pb-4 border-b-2 border-orange-500">
                <Globe className="text-orange-500" size={28} />
                Cấu hình chung
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-gray-800 mb-2">
                    🏷️ Tên ứng dụng
                  </label>
                  <input
                    type="text"
                    value={settings.appName}
                    onChange={(e) =>
                      setSettings({ ...settings, appName: e.target.value })
                    }
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-800 mb-2">
                    � Phiên bản
                  </label>
                  <input
                    type="text"
                    value={settings.appVersion}
                    onChange={(e) =>
                      setSettings({ ...settings, appVersion: e.target.value })
                    }
                    placeholder="1.0.0"
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-800 mb-2">
                    <Mail className="w-5 h-5 text-orange-500 mr-3" />
                    Email hỗ trợ
                  </label>
                  <input
                    type="email"
                    value={settings.supportEmail}
                    onChange={(e) =>
                      setSettings({ ...settings, supportEmail: e.target.value })
                    }
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-800 mb-2">
                    <Phone className="w-5 h-5 text-orange-500 mr-3" />
                    Số điện thoại hỗ trợ
                  </label>
                  <input
                    type="tel"
                    value={settings.supportPhone}
                    onChange={(e) =>
                      setSettings({ ...settings, supportPhone: e.target.value })
                    }
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-800 mb-2">
                    📜 Terms of Service URL
                  </label>
                  <input
                    type="url"
                    value={settings.termsOfServiceUrl}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        termsOfServiceUrl: e.target.value,
                      })
                    }
                    placeholder="/terms"
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-800 mb-2">
                    🔒 Privacy Policy URL
                  </label>
                  <input
                    type="url"
                    value={settings.privacyPolicyUrl}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        privacyPolicyUrl: e.target.value,
                      })
                    }
                    placeholder="/privacy"
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all"
                  />
                </div>
              </div>

              <div className="bg-linear-to-br from-orange-400 to-orange-1000 p-6 rounded-xl border-2 border-orange-500 shadow-sm">
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                  🌐 Social Media Links
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Facebook
                    </label>
                    <input
                      type="url"
                      value={settings.facebookUrl}
                      onChange={(e) =>
                        setSettings({
                          ...settings,
                          facebookUrl: e.target.value,
                        })
                      }
                      placeholder="https://facebook.com/..."
                      className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Twitter
                    </label>
                    <input
                      type="url"
                      value={settings.twitterUrl}
                      onChange={(e) =>
                        setSettings({ ...settings, twitterUrl: e.target.value })
                      }
                      placeholder="https://twitter.com/..."
                      className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Instagram
                    </label>
                    <input
                      type="url"
                      value={settings.instagramUrl}
                      onChange={(e) =>
                        setSettings({
                          ...settings,
                          instagramUrl: e.target.value,
                        })
                      }
                      placeholder="https://instagram.com/..."
                      className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      LinkedIn
                    </label>
                    <input
                      type="url"
                      value={settings.linkedinUrl}
                      onChange={(e) =>
                        setSettings({
                          ...settings,
                          linkedinUrl: e.target.value,
                        })
                      }
                      placeholder="https://linkedin.com/..."
                      className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="flex items-center gap-2 text-sm font-bold text-gray-800 mb-2">
                  <FileText className="text-gray-600" size={16} />
                  Mô tả ứng dụng
                </label>
                <textarea
                  value={settings.appDescription}
                  onChange={(e) =>
                    setSettings({ ...settings, appDescription: e.target.value })
                  }
                  rows={3}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all"
                />
              </div>

              <div className="bg-linear-to-br from-yellow-50 to-orange-100 border-2 border-yellow-300 rounded-xl p-5 shadow-sm">
                <div className="flex items-start gap-3">
                  <Database
                    className="text-yellow-600 shrink-0 mt-1"
                    size={24}
                  />
                  <div className="flex-1">
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={settings.maintenanceMode}
                        onChange={(e) =>
                          setSettings({
                            ...settings,
                            maintenanceMode: e.target.checked,
                          })
                        }
                        className="w-5 h-5 text-orange-500 rounded focus:ring-2 focus:ring-orange-500"
                      />
                      <span className="font-bold text-gray-900">
                        🔧 Chế độ bảo trì
                      </span>
                    </label>
                    <p className="text-sm text-gray-600 mt-2 mb-3">
                      Kích hoạt chế độ này sẽ tạm khóa ứng dụng cho người dùng
                    </p>
                    {settings.maintenanceMode && (
                      <textarea
                        value={settings.maintenanceMessage}
                        onChange={(e) =>
                          setSettings({
                            ...settings,
                            maintenanceMessage: e.target.value,
                          })
                        }
                        rows={2}
                        placeholder="Thông báo bảo trì..."
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all"
                      />
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Payment Methods Tab */}
          {activeTab === "payment" && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2 pb-4 border-b-2 border-orange-500">
                <Database className="text-orange-500" size={28} />
                Phương thức thanh toán
              </h2>

              <div className="space-y-4">
                <label className="flex items-center gap-3 cursor-pointer p-4 bg-linear-to-r from-orange-400 to-orange-1000 rounded-xl border-2 border-orange-500 hover:border-orange-500 transition-all">
                  <input
                    type="checkbox"
                    checked={settings.enableBankTransfer}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        enableBankTransfer: e.target.checked,
                      })
                    }
                    className="w-6 h-6 text-orange-500 rounded focus:ring-2 focus:ring-orange-500"
                  />
                  <span className="text-3xl">🏦</span>
                  <div className="flex-1">
                    <span className="font-bold text-gray-900 text-lg">
                      Chuyển khoản ngân hàng
                    </span>
                    <p className="text-sm text-gray-600 mt-1">
                      Cho phép người dùng rút tiền qua chuyển khoản ngân hàng
                    </p>
                  </div>
                </label>

                <label className="flex items-center gap-3 cursor-pointer p-4 bg-linear-to-r from-orange-50 to-red-50 rounded-xl border-2 border-orange-200 hover:border-orange-400 transition-all">
                  <input
                    type="checkbox"
                    checked={settings.enableMomo}
                    onChange={(e) =>
                      setSettings({ ...settings, enableMomo: e.target.checked })
                    }
                    className="w-6 h-6 text-orange-500 rounded focus:ring-2 focus:ring-orange-500"
                  />
                  <span className="text-3xl">💳</span>
                  <div className="flex-1">
                    <span className="font-bold text-gray-900 text-lg">
                      MoMo
                    </span>
                    <p className="text-sm text-gray-600 mt-1">
                      Tích hợp ví điện tử MoMo
                    </p>
                  </div>
                </label>

                <label className="flex items-center gap-3 cursor-pointer p-4 bg-linear-to-r from-orange-400 to-orange-1000 rounded-xl border-2 border-orange-500 hover:border-orange-500 transition-all shadow-sm">
                  <input
                    type="checkbox"
                    checked={settings.enableZaloPay}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        enableZaloPay: e.target.checked,
                      })
                    }
                    className="w-6 h-6 text-orange-500 rounded focus:ring-2 focus:ring-orange-500"
                  />
                  <DollarSign className="text-3xl text-orange-500" />
                  <div className="flex-1">
                    <span className="font-bold text-gray-900 text-lg">
                      ZaloPay
                    </span>
                    <p className="text-sm text-gray-600 mt-1">
                      Tích hợp ví điện tử ZaloPay
                    </p>
                  </div>
                </label>

                <label className="flex items-center gap-3 cursor-pointer p-4 bg-linear-to-r from-orange-400 to-orange-1000 rounded-xl border-2 border-orange-500 hover:border-orange-500 transition-all shadow-sm">
                  <input
                    type="checkbox"
                    checked={settings.enableViettelPay}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        enableViettelPay: e.target.checked,
                      })
                    }
                    className="w-6 h-6 text-orange-500 rounded focus:ring-2 focus:ring-orange-500"
                  />
                  <Smartphone className="text-3xl text-orange-500" />
                  <div className="flex-1">
                    <span className="font-bold text-gray-900 text-lg">
                      ViettelPay
                    </span>
                    <p className="text-sm text-gray-600 mt-1">
                      Tích hợp ví điện tử ViettelPay
                    </p>
                  </div>
                </label>
              </div>

              <div className="bg-linear-to-br from-orange-400 to-orange-1000 border-2 border-orange-500 rounded-xl p-6 shadow-sm">
                <div className="flex items-start gap-3">
                  <Lightbulb className="text-3xl text-yellow-500 shrink-0" />
                  <div>
                    <h3 className="font-bold text-gray-900 text-lg mb-2">
                      Lưu ý về phương thức thanh toán
                    </h3>
                    <ul className="text-sm text-gray-700 space-y-1 list-disc list-inside">
                      <li>Cần có API key và cấu hình từ các nhà cung cấp</li>
                      <li>Phải tuân thủ quy định về thanh toán điện tử</li>
                      <li>Kiểm tra phí giao dịch từng phương thức</li>
                      <li>Test kỹ trước khi áp dụng cho production</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Advanced Settings Tab */}
          {activeTab === "advanced" && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2 pb-4 border-b-2 border-orange-500">
                <Settings className="text-orange-500" size={28} />
                Cấu hình nâng cao
              </h2>

              <div className="bg-linear-to-br from-orange-400 to-orange-1000 p-6 rounded-xl border-2 border-orange-500 shadow-sm">
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                  🔌 API Configuration
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-bold text-gray-800 mb-2">
                      Rate Limit (requests/minute)
                    </label>
                    <input
                      type="number"
                      value={settings.apiRateLimit}
                      onChange={(e) =>
                        setSettings({
                          ...settings,
                          apiRateLimit: Number(e.target.value),
                        })
                      }
                      min="10"
                      max="1000"
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-800 mb-2">
                      Cache Duration (seconds)
                    </label>
                    <input
                      type="number"
                      value={settings.apiCacheDuration}
                      onChange={(e) =>
                        setSettings({
                          ...settings,
                          apiCacheDuration: Number(e.target.value),
                        })
                      }
                      min="0"
                      max="3600"
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all"
                    />
                  </div>
                </div>

                <div className="mt-4">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.enableApiCache}
                      onChange={(e) =>
                        setSettings({
                          ...settings,
                          enableApiCache: e.target.checked,
                        })
                      }
                      className="w-5 h-5 text-orange-500 rounded focus:ring-2 focus:ring-orange-500"
                    />
                    <span className="font-semibold text-gray-900">
                      Bật API Cache
                    </span>
                  </label>
                </div>
              </div>

              <div className="bg-linear-to-br from-orange-400 to-orange-1000 p-6 rounded-xl border-2 border-orange-500 shadow-sm">
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Upload className="w-4 h-4 mr-2" />
                  Upload Configuration
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-bold text-gray-800 mb-2">
                      Max File Size (MB)
                    </label>
                    <input
                      type="number"
                      value={settings.maxUploadFileSize}
                      onChange={(e) =>
                        setSettings({
                          ...settings,
                          maxUploadFileSize: Number(e.target.value),
                        })
                      }
                      min="1"
                      max="100"
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-800 mb-2">
                      Allowed File Types
                    </label>
                    <input
                      type="text"
                      value={settings.allowedFileTypes.join(", ")}
                      onChange={(e) =>
                        setSettings({
                          ...settings,
                          allowedFileTypes: e.target.value
                            .split(",")
                            .map((t) => t.trim()),
                        })
                      }
                      placeholder="jpg, png, pdf"
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all"
                    />
                    <p className="text-xs text-gray-600 mt-1">
                      Phân cách bằng dấu phẩy
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <label className="flex items-center gap-3 cursor-pointer p-4 bg-gray-50 rounded-xl border-2 border-gray-200 hover:border-gray-400 transition-all">
                  <input
                    type="checkbox"
                    checked={settings.enableDebugMode}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        enableDebugMode: e.target.checked,
                      })
                    }
                    className="w-6 h-6 text-orange-500 rounded focus:ring-2 focus:ring-orange-500"
                  />
                  <span className="text-2xl">🐛</span>
                  <div className="flex-1">
                    <span className="font-bold text-gray-900 text-lg">
                      Debug Mode
                    </span>
                    <p className="text-sm text-gray-600 mt-1">
                      Hiển thị thông tin debug chi tiết (không dùng trên
                      production)
                    </p>
                  </div>
                </label>

                <label className="flex items-center gap-3 cursor-pointer p-4 bg-orange-500 rounded-xl border-2 border-orange-500 hover:border-orange-500 transition-all">
                  <input
                    type="checkbox"
                    checked={settings.enableAnalytics}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        enableAnalytics: e.target.checked,
                      })
                    }
                    className="w-6 h-6 text-orange-500 rounded focus:ring-2 focus:ring-orange-500"
                  />
                  <BarChart3 className="text-2xl text-orange-500" />
                  <div className="flex-1">
                    <span className="font-bold text-gray-900 text-lg">
                      Analytics
                    </span>
                    <p className="text-sm text-gray-600 mt-1">
                      Thu thập dữ liệu phân tích người dùng (Google Analytics,
                      etc.)
                    </p>
                  </div>
                </label>
              </div>

              <div className="bg-red-50 border-2 border-red-300 rounded-xl p-6">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="text-red-500 shrink-0" size={28} />
                  <div>
                    <h3 className="font-bold text-red-900 text-lg mb-2">
                      Cảnh báo
                    </h3>
                    <ul className="text-sm text-red-700 space-y-1 list-disc list-inside">
                      <li>
                        Debug Mode chỉ nên bật trong môi trường development
                      </li>
                      <li>
                        Rate limit thấp có thể ảnh hưởng đến trải nghiệm người
                        dùng
                      </li>
                      <li>
                        Cache duration cao có thể làm dữ liệu không real-time
                      </li>
                      <li>
                        Kiểm tra cẩn thận trước khi thay đổi các cấu hình này
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Financial Settings */}
          {activeTab === "financial" && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2 pb-4 border-b-2 border-orange-500">
                <DollarSign className="text-orange-500" size={28} />
                Cấu hình tài chính
              </h2>

              <div className="bg-gradient-to-r from-orange-50 to-orange-100 p-6 rounded-xl border-2 border-orange-200">
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <DollarSign className="w-4 h-4 mr-2" />
                  Rút tiền
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-bold text-gray-800 mb-2">
                      Số tiền rút tối thiểu
                    </label>
                    <input
                      type="number"
                      value={settings.minWithdrawalAmount}
                      onChange={(e) =>
                        setSettings({
                          ...settings,
                          minWithdrawalAmount: Number(e.target.value),
                        })
                      }
                      min="0"
                      step="10000"
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all"
                    />
                    <p className="text-sm text-gray-600 mt-1">
                      = {formatCurrency(settings.minWithdrawalAmount)}
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-800 mb-2">
                      Số tiền rút tối đa
                    </label>
                    <input
                      type="number"
                      value={settings.maxWithdrawalAmount}
                      onChange={(e) =>
                        setSettings({
                          ...settings,
                          maxWithdrawalAmount: Number(e.target.value),
                        })
                      }
                      min="0"
                      step="100000"
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all"
                    />
                    <p className="text-sm text-gray-600 mt-1">
                      = {formatCurrency(settings.maxWithdrawalAmount)}
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-800 mb-2">
                      Loại phí rút tiền
                    </label>
                    <select
                      value={settings.withdrawalFeeType}
                      onChange={(e) =>
                        setSettings({
                          ...settings,
                          withdrawalFeeType: e.target.value as any,
                        })
                      }
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all"
                    >
                      <option value="fixed">Cố định (VND)</option>
                      <option value="percentage">Phần trăm (%)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-800 mb-2">
                      Phí rút tiền
                    </label>
                    <input
                      type="number"
                      value={settings.withdrawalFee}
                      onChange={(e) =>
                        setSettings({
                          ...settings,
                          withdrawalFee: Number(e.target.value),
                        })
                      }
                      min="0"
                      step={
                        settings.withdrawalFeeType === "fixed" ? "1000" : "0.1"
                      }
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all"
                    />
                    <p className="text-sm text-gray-600 mt-1">
                      {settings.withdrawalFeeType === "fixed"
                        ? `= ${formatCurrency(settings.withdrawalFee)}`
                        : `= ${settings.withdrawalFee}%`}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-linear-to-br from-orange-400 to-orange-1000 p-6 rounded-xl border-2 border-orange-500 shadow-sm">
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Percent size={22} className="text-orange-500" />
                  Hoa hồng
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-bold text-gray-800 mb-2">
                      Tỷ lệ hoa hồng mặc định (%)
                    </label>
                    <input
                      type="number"
                      value={settings.defaultCommissionRate}
                      onChange={(e) =>
                        setSettings({
                          ...settings,
                          defaultCommissionRate: Number(e.target.value),
                        })
                      }
                      min="0"
                      max="100"
                      step="0.1"
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-800 mb-2">
                      Tỷ lệ hoa hồng giới thiệu (%)
                    </label>
                    <input
                      type="number"
                      value={settings.referralCommissionRate}
                      onChange={(e) =>
                        setSettings({
                          ...settings,
                          referralCommissionRate: Number(e.target.value),
                        })
                      }
                      min="0"
                      max="100"
                      step="0.1"
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all"
                    />
                  </div>
                </div>

                {/* Detailed Commission System */}
                <div className="bg-gradient-to-r from-orange-50 to-red-50 p-6 rounded-xl border-2 border-orange-200">
                  <div className="flex items-center gap-3 mb-4">
                    <Target className="w-6 h-6 text-orange-600" />
                    <h3 className="text-lg font-bold text-gray-900">
                      Hệ thống hoa hồng chi tiết
                    </h3>
                    <label className="flex items-center gap-2 ml-auto">
                      <input
                        type="checkbox"
                        checked={settings.commission?.enabled !== false}
                        onChange={(e) =>
                          setSettings({
                            ...settings,
                            commission: {
                              ...settings.commission,
                              enabled: e.target.checked,
                              level1Rate: settings.commission?.level1Rate || 10,
                              level2Rate: settings.commission?.level2Rate || 5,
                              level3Rate: settings.commission?.level3Rate || 2,
                              maxLevels: settings.commission?.maxLevels || 3,
                            },
                          })
                        }
                        className="w-5 h-5 text-orange-500 rounded focus:ring-2 focus:ring-orange-500"
                      />
                      <span className="text-sm font-semibold">Kích hoạt</span>
                    </label>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-bold text-gray-800 mb-2">
                        🥇 Cấp 1 - Trực tiếp (%)
                      </label>
                      <input
                        type="number"
                        value={settings.commission?.level1Rate || 10}
                        onChange={(e) =>
                          setSettings({
                            ...settings,
                            commission: {
                              ...settings.commission,
                              level1Rate: Number(e.target.value),
                              enabled: settings.commission?.enabled !== false,
                              level2Rate: settings.commission?.level2Rate || 5,
                              level3Rate: settings.commission?.level3Rate || 2,
                              maxLevels: settings.commission?.maxLevels || 3,
                            },
                          })
                        }
                        min="0"
                        max="100"
                        step="0.1"
                        disabled={settings.commission?.enabled === false}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-orange-600 transition-all disabled:bg-gray-100"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-gray-800 mb-2">
                        🥈 Cấp 2 - Gián tiếp (%)
                      </label>
                      <input
                        type="number"
                        value={settings.commission?.level2Rate || 5}
                        onChange={(e) =>
                          setSettings({
                            ...settings,
                            commission: {
                              ...settings.commission,
                              level2Rate: Number(e.target.value),
                              enabled: settings.commission?.enabled !== false,
                              level1Rate: settings.commission?.level1Rate || 10,
                              level3Rate: settings.commission?.level3Rate || 2,
                              maxLevels: settings.commission?.maxLevels || 3,
                            },
                          })
                        }
                        min="0"
                        max="100"
                        step="0.1"
                        disabled={settings.commission?.enabled === false}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-orange-600 transition-all disabled:bg-gray-100"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-gray-800 mb-2">
                        🥉 Cấp 3 - Xa nhất (%)
                      </label>
                      <input
                        type="number"
                        value={settings.commission?.level3Rate || 2}
                        onChange={(e) =>
                          setSettings({
                            ...settings,
                            commission: {
                              ...settings.commission,
                              level3Rate: Number(e.target.value),
                              enabled: settings.commission?.enabled !== false,
                              level1Rate: settings.commission?.level1Rate || 10,
                              level2Rate: settings.commission?.level2Rate || 5,
                              maxLevels: settings.commission?.maxLevels || 3,
                            },
                          })
                        }
                        min="0"
                        max="100"
                        step="0.1"
                        disabled={settings.commission?.enabled === false}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-orange-600 transition-all disabled:bg-gray-100"
                      />
                    </div>
                  </div>

                  <div className="mt-4 p-4 bg-white rounded-lg border border-gray-200">
                    <h4 className="font-semibold text-gray-800 mb-2">
                      💡 Ví dụ:
                    </h4>
                    <p className="text-sm text-gray-600">
                      Khi A giới thiệu B (cấp 1:{" "}
                      {settings.commission?.level1Rate || 10}%), B giới thiệu C
                      (cấp 2: {settings.commission?.level2Rate || 5}%), C giới
                      thiệu D (cấp 3: {settings.commission?.level3Rate || 2}%).
                      <br />A sẽ nhận hoa hồng từ cả B, C và D theo tỷ lệ tương
                      ứng.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Security Settings */}
          {activeTab === "security" && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2 pb-4 border-b-2 border-orange-500">
                <Shield className="text-orange-500" size={28} />
                Cấu hình bảo mật
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-gray-800 mb-2">
                    ⏱️ Thời gian hết phiên (phút)
                  </label>
                  <input
                    type="number"
                    value={settings.sessionTimeout}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        sessionTimeout: Number(e.target.value),
                      })
                    }
                    min="5"
                    max="1440"
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all"
                  />
                  <p className="text-sm text-gray-600 mt-1">
                    Người dùng sẽ tự động đăng xuất sau{" "}
                    {settings.sessionTimeout} phút không hoạt động
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-800 mb-2">
                    🔒 Số lần đăng nhập sai tối đa
                  </label>
                  <input
                    type="number"
                    value={settings.maxLoginAttempts}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        maxLoginAttempts: Number(e.target.value),
                      })
                    }
                    min="3"
                    max="10"
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all"
                  />
                  <p className="text-sm text-gray-600 mt-1">
                    Tài khoản sẽ bị khóa tạm thời sau{" "}
                    {settings.maxLoginAttempts} lần đăng nhập sai
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-800 mb-2">
                    <Key className="w-5 h-5 text-orange-500 mr-3" />
                    Độ dài mật khẩu tối thiểu
                  </label>
                  <input
                    type="number"
                    value={settings.passwordMinLength}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        passwordMinLength: Number(e.target.value),
                      })
                    }
                    min="6"
                    max="32"
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all"
                  />
                  <p className="text-sm text-gray-600 mt-1">
                    Mật khẩu phải có ít nhất {settings.passwordMinLength} ký tự
                  </p>
                </div>
              </div>

              <div className="bg-linear-to-br from-orange-400 to-orange-1000 p-6 rounded-xl border-2 border-orange-500 shadow-sm">
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Users size={22} className="text-orange-500" />
                  Xác thực người dùng
                </h3>
                <div className="space-y-4">
                  <label className="flex items-center gap-3 cursor-pointer p-3 bg-white rounded-lg border-2 border-gray-200 hover:border-orange-500 transition-all">
                    <input
                      type="checkbox"
                      checked={settings.requireEmailVerification}
                      onChange={(e) =>
                        setSettings({
                          ...settings,
                          requireEmailVerification: e.target.checked,
                        })
                      }
                      className="w-5 h-5 text-orange-500 rounded focus:ring-2 focus:ring-orange-500"
                    />
                    <div>
                      <span className="font-bold text-gray-900">
                        <Mail className="w-5 h-5 text-orange-500 mr-3" />
                        Yêu cầu xác thực email
                      </span>
                      <p className="text-sm text-gray-600">
                        Người dùng phải xác thực email trước khi sử dụng
                      </p>
                    </div>
                  </label>

                  <label className="flex items-center gap-3 cursor-pointer p-3 bg-white rounded-lg border-2 border-gray-200 hover:border-orange-500 transition-all">
                    <input
                      type="checkbox"
                      checked={settings.requirePhoneVerification}
                      onChange={(e) =>
                        setSettings({
                          ...settings,
                          requirePhoneVerification: e.target.checked,
                        })
                      }
                      className="w-5 h-5 text-orange-500 rounded focus:ring-2 focus:ring-orange-500"
                    />
                    <div>
                      <span className="font-bold text-gray-900">
                        <Smartphone className="w-5 h-5 text-orange-500 mr-3" />
                        Yêu cầu xác thực số điện thoại
                      </span>
                      <p className="text-sm text-gray-600">
                        Người dùng phải xác thực SĐT trước khi rút tiền
                      </p>
                    </div>
                  </label>
                </div>
              </div>
            </div>
          )}

          {/* Notifications Settings */}
          {activeTab === "notifications" && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2 pb-4 border-b-2 border-orange-500">
                <Bell className="text-orange-500" size={28} />
                Cấu hình thông báo
              </h2>

              <div className="space-y-4">
                <label className="flex items-center gap-3 cursor-pointer p-4 bg-linear-to-r from-orange-400 to-orange-1000 rounded-xl border-2 border-orange-500 hover:border-orange-500 transition-all shadow-sm">
                  <input
                    type="checkbox"
                    checked={settings.enableEmailNotifications}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        enableEmailNotifications: e.target.checked,
                      })
                    }
                    className="w-6 h-6 text-orange-500 rounded focus:ring-2 focus:ring-orange-500"
                  />
                  <Mail className="text-orange-500 shrink-0" size={28} />
                  <div className="flex-1">
                    <span className="font-bold text-gray-900 text-lg">
                      <Mail className="w-5 h-5 text-orange-500 mr-3" />
                      Thông báo qua Email
                    </span>
                    <p className="text-sm text-gray-600 mt-1">
                      Gửi thông báo quan trọng đến email người dùng (đăng ký,
                      rút tiền, v.v.)
                    </p>
                  </div>
                </label>

                <label className="flex items-center gap-3 cursor-pointer p-4 bg-linear-to-r from-orange-400 to-orange-1000 rounded-xl border-2 border-orange-500 hover:border-orange-500 transition-all shadow-sm">
                  <input
                    type="checkbox"
                    checked={settings.enablePushNotifications}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        enablePushNotifications: e.target.checked,
                      })
                    }
                    className="w-6 h-6 text-orange-500 rounded focus:ring-2 focus:ring-orange-500"
                  />
                  <Bell className="text-orange-500 shrink-0" size={28} />
                  <div className="flex-1">
                    <span className="font-bold text-gray-900 text-lg">
                      <Bell className="w-5 h-5 text-orange-500 mr-3" />
                      Push Notifications
                    </span>
                    <p className="text-sm text-gray-600 mt-1">
                      Gửi thông báo đẩy trực tiếp đến thiết bị của người dùng
                    </p>
                  </div>
                </label>

                <label className="flex items-center gap-3 cursor-pointer p-4 bg-linear-to-r from-orange-400 to-orange-1000 rounded-xl border-2 border-orange-500 hover:border-orange-500 transition-all">
                  <input
                    type="checkbox"
                    checked={settings.enableSMSNotifications}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        enableSMSNotifications: e.target.checked,
                      })
                    }
                    className="w-6 h-6 text-orange-500 rounded focus:ring-2 focus:ring-orange-500"
                  />
                  <span className="text-3xl shrink-0">💬</span>
                  <div className="flex-1">
                    <span className="font-bold text-gray-900 text-lg">
                      <Smartphone className="w-5 h-5 text-orange-500 mr-3" />
                      Thông báo qua SMS
                    </span>
                    <p className="text-sm text-gray-600 mt-1">
                      Gửi tin nhắn SMS cho các thông báo bảo mật quan trọng
                    </p>
                  </div>
                </label>
              </div>

              <div className="bg-yellow-50 border-2 border-yellow-300 rounded-xl p-6">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="text-3xl text-yellow-600 shrink-0" />
                  <div>
                    <h3 className="font-bold text-gray-900 text-lg mb-2">
                      Lưu ý quan trọng
                    </h3>
                    <ul className="text-sm text-gray-700 space-y-1 list-disc list-inside">
                      <li>SMS Notifications có thể phát sinh chi phí cao</li>
                      <li>Email notifications yêu cầu cấu hình SMTP server</li>
                      <li>
                        Push notifications cần thiết lập Firebase hoặc OneSignal
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AppSettings;
