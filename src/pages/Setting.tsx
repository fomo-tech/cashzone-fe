import { useState, useEffect } from "react";
import {
  Settings,
  User,
  Shield,
  Bell,
  Globe,
  Lock,
  Server,
  Info,
  ArrowRight,
  AlertCircle,
  Trash2,
} from "lucide-react";
import settingsService from "@/services/settingsService";
import { toast } from "react-hot-toast";
import { useAuthStore } from "@/store/authStore";
import { RoleEnum } from "@/utils/types";

// Component con cho Toggle Switch (Bật/Tắt)
const ToggleSwitch = ({
  label,
  isChecked,
  onToggle,
}: {
  label: string;
  isChecked: boolean;
  onToggle: () => void;
}) => (
  <div className="flex items-center justify-between py-3 border-b border-gray-100 last:border-b-0">
    <span className="text-sm font-medium text-gray-700">{label}</span>
    <button
      onClick={onToggle}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 ${
        isChecked ? "bg-[#E91E63]" : "bg-gray-200"
      }`}
    >
      <span className="sr-only">Toggle {label}</span>
      <span
        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
          isChecked ? "translate-x-6" : "translate-x-1"
        }`}
      />
    </button>
  </div>
);

// Component con cho Cài đặt dạng Chọn (Select Setting)
const SelectSetting = ({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  options: { value: string; label: string }[];
}) => (
  <div className="flex flex-col space-y-1 py-3 border-b border-gray-100 last:border-b-0">
    <label htmlFor={label} className="text-sm font-medium text-gray-700">
      {label}
    </label>
    <select
      id={label}
      value={value}
      onChange={onChange}
      className="mt-1 block w-full px-3 py-2 border border-gray-300 bg-white rounded-lg shadow-sm focus:outline-none focus:ring-[#E91E63] focus:border-[#E91E63] text-sm"
    >
      {options.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  </div>
);

// Component con cho Thẻ thiết lập chung (Setting Card)
const SettingCard = ({
  icon: Icon,
  title,
  description,
  children,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
  children: React.ReactNode;
}) => (
  <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
    <div className="flex items-center space-x-3 mb-4 border-b pb-3">
      <Icon className="w-6 h-6 text-[#E91E63]" />
      <h3 className="text-lg font-bold text-gray-800">{title}</h3>
    </div>
    <p className="text-sm text-gray-500 mb-4">{description}</p>
    <div className="space-y-2">{children}</div>
  </div>
);

// Fix lỗi runtime: chỉ dùng interface local
interface AppSettings {
  // Cấu hình chung
  appName?: string;
  appDescription?: string;
  appVersion?: string;
  appLogo?: string;
  supportEmail?: string;
  supportPhone?: string;
  termsOfServiceUrl?: string;
  privacyPolicyUrl?: string;

  // Social Media
  facebookUrl?: string;
  twitterUrl?: string;
  instagramUrl?: string;
  linkedinUrl?: string;

  // Cấu hình tài chính
  minWithdrawalAmount?: number;
  maxWithdrawalAmount?: number;
  withdrawalFee?: number;
  withdrawalFeeType?: "fixed" | "percentage";
  withdrawalProcessingTime?: number;

  // Payment Methods
  enableBankTransfer?: boolean;
  enableMomo?: boolean;
  enableZaloPay?: boolean;
  enableViettelPay?: boolean;

  // Cấu hình hoa hồng
  defaultCommissionRate?: number;
  referralCommissionRate?: number;
  tierCommissionRates?: { tier: number; rate: number }[];

  // Cấu hình người dùng
  minRegistrationAge?: number;
  requireEmailVerification?: boolean;
  requirePhoneVerification?: boolean;
  allowGuestCheckout?: boolean;
  autoApproveNewUsers?: boolean;

  // Cấu hình bảo mật
  sessionTimeout?: number;
  maxLoginAttempts?: number;
  passwordMinLength?: number;
  requireStrongPassword?: boolean;
  enable2FA?: boolean;

  // Cấu hình thông báo
  enableEmailNotifications?: boolean;
  enablePushNotifications?: boolean;
  enableSMSNotifications?: boolean;

  // API Configuration
  apiRateLimit?: number;
  enableApiCache?: boolean;
  apiCacheDuration?: number;

  // Advanced
  enableDebugMode?: boolean;
  enableAnalytics?: boolean;
  maxUploadFileSize?: number;
  allowedFileTypes?: string[];

  // Bảo trì
  maintenanceMode?: boolean;
  maintenanceMessage?: string;

  // UI Settings
  language?: string;
  timezone?: string;
}

const SettingsPage = () => {
  const { user } = useAuthStore();
  const isAdmin = user?.roles?.includes(RoleEnum.ADMIN);

  const [notificationSettings, setNotificationSettings] = useState({
    emailAlerts: true,
    pushNotifications: true,
    productUpdates: false,
  });

  const [securitySettings, setSecuritySettings] = useState({
    twoFactorAuth: false,
    sessionTimeout: true,
  });

  // State quản lý tab hiện tại
  const [activeTab, setActiveTab] = useState("account");

  // State cho settings từ API
  const [settings, setSettings] = useState<AppSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Xử lý chuyển đổi (Toggle)
  const handleToggle = (
    settingKey: string,
    setState: React.Dispatch<React.SetStateAction<any>>
  ) => {
    setState((prev: any) => ({ ...prev, [settingKey]: !prev[settingKey] }));
  };

  // Fetch settings từ API khi load trang
  useEffect(() => {
    setLoading(true);
    const fetchSettings = isAdmin
      ? settingsService.getSettings()
      : settingsService.getPublicSettings();

    fetchSettings
      .then((res) => {
        if (res.success) setSettings(res.data as AppSettings);
      })
      .catch((error) => {
        console.error("Settings error:", error);
        toast.error("Không thể tải cấu hình hệ thống!");
      })
      .finally(() => setLoading(false));
  }, [isAdmin]);

  // Handler cập nhật settings
  const handleSave = async () => {
    if (!settings || !isAdmin) {
      toast.error("Bạn không có quyền cập nhật cấu hình!");
      return;
    }
    setSaving(true);
    try {
      const res = await settingsService.updateSettings(settings);
      if (res.success) toast.success("Lưu cấu hình thành công!");
      else toast.error(res.message || "Lỗi khi lưu cấu hình!");
    } catch (e) {
      console.error("Update error:", e);
      toast.error("Lỗi khi lưu cấu hình!");
    } finally {
      setSaving(false);
    }
  };

  // Handler thay đổi field
  const handleSettingChange = (key: keyof AppSettings, value: any) => {
    setSettings((prev) => (prev ? { ...prev, [key]: value } : prev));
  };

  // Dữ liệu cho Sidebar Navigation
  const navItems = [
    { id: "account", icon: User, label: "Tài khoản & Hồ sơ" },
    { id: "security", icon: Shield, label: "Bảo mật & Đăng nhập" },
    { id: "notifications", icon: Bell, label: "Tùy chọn Thông báo" },
    { id: "general", icon: Globe, label: "Cài đặt Chung" },
    { id: "data", icon: Server, label: "Dữ liệu & Quyền riêng tư" },
  ];

  // Render nội dung theo Tab
  const renderContent = () => {
    switch (activeTab) {
      case "account":
        return (
          <SettingCard
            icon={User}
            title="Tài khoản & Hồ sơ"
            description="Cập nhật thông tin cá nhân và quản lý hồ sơ công khai."
          >
            <div className="py-3 border-b border-gray-100">
              <span className="text-sm font-semibold text-gray-700">
                Tên người dùng:
              </span>
              <p className="text-sm text-gray-500">Admin</p>
            </div>
            <div className="py-3 border-b border-gray-100">
              <span className="text-sm font-semibold text-gray-700">
                Email:
              </span>
              <p className="text-sm text-gray-500">admin@app.com</p>
            </div>
            <button className="flex items-center justify-between w-full text-left py-3 text-sm font-medium text-[#E91E63] hover:text-[#E91E63] transition duration-150">
              Chỉnh sửa Hồ sơ <ArrowRight className="w-4 h-4" />
            </button>
          </SettingCard>
        );

      case "security":
        return (
          <SettingCard
            icon={Shield}
            title="Bảo mật & Đăng nhập"
            description="Quản lý mật khẩu, xác thực hai yếu tố và phiên đăng nhập."
          >
            <button className="flex items-center justify-between w-full text-left py-3 text-sm font-medium text-red-600 hover:text-red-800 transition duration-150 border-b border-gray-100">
              Đổi mật khẩu <Lock className="w-4 h-4" />
            </button>

            <ToggleSwitch
              label="Xác thực hai yếu tố (2FA)"
              isChecked={securitySettings.twoFactorAuth}
              onToggle={() =>
                handleToggle("twoFactorAuth", setSecuritySettings)
              }
            />

            <ToggleSwitch
              label="Tự động đăng xuất sau 30 phút không hoạt động"
              isChecked={securitySettings.sessionTimeout}
              onToggle={() =>
                handleToggle("sessionTimeout", setSecuritySettings)
              }
            />
          </SettingCard>
        );

      case "notifications":
        return (
          <SettingCard
            icon={Bell}
            title="Tùy chọn Thông báo"
            description="Chọn cách bạn muốn nhận thông báo từ hệ thống."
          >
            <ToggleSwitch
              label="Thông báo qua Email cho các hoạt động quan trọng"
              isChecked={notificationSettings.emailAlerts}
              onToggle={() =>
                handleToggle("emailAlerts", setNotificationSettings)
              }
            />
            <ToggleSwitch
              label="Thông báo đẩy (Push) trên thiết bị"
              isChecked={notificationSettings.pushNotifications}
              onToggle={() =>
                handleToggle("pushNotifications", setNotificationSettings)
              }
            />
            <ToggleSwitch
              label="Thông báo về các cập nhật sản phẩm mới"
              isChecked={notificationSettings.productUpdates}
              onToggle={() =>
                handleToggle("productUpdates", setNotificationSettings)
              }
            />
          </SettingCard>
        );

      case "general":
        return (
          <SettingCard
            icon={Globe}
            title="Cài đặt Chung"
            description="Thiết lập ngôn ngữ, định dạng ngày giờ và múi giờ."
          >
            {isAdmin ? (
              <>
                <SelectSetting
                  label="Ngôn ngữ Hiển thị"
                  value={settings?.language || "vi"}
                  onChange={(e) => handleSettingChange("language", e.target.value)}
                  options={[
                    { value: "vi", label: "Tiếng Việt (Vietnamese)" },
                    { value: "en", label: "English (US)" },
                  ]}
                />
                <SelectSetting
                  label="Múi giờ"
                  value={settings?.timezone || "hcm"}
                  onChange={(e) => handleSettingChange("timezone", e.target.value)}
                  options={[
                    { value: "hcm", label: "GMT+7 (Hồ Chí Minh, Việt Nam)" },
                    { value: "utc", label: "UTC (Coordinated Universal Time)" },
                  ]}
                />
              </>
            ) : (
              <>
                <div className="py-3 border-b border-gray-100">
                  <span className="text-sm font-semibold text-gray-700">
                    Ngôn ngữ Hiển thị:
                  </span>
                  <p className="text-sm text-gray-500">
                    {settings?.language === "en" ? "English (US)" : "Tiếng Việt (Vietnamese)"}
                  </p>
                </div>
                <div className="py-3 border-b border-gray-100">
                  <span className="text-sm font-semibold text-gray-700">
                    Múi giờ:
                  </span>
                  <p className="text-sm text-gray-500">
                    {settings?.timezone === "utc" ? "UTC (Coordinated Universal Time)" : "GMT+7 (Hồ Chí Minh, Việt Nam)"}
                  </p>
                </div>
              </>
            )}
          </SettingCard>
        );

      case "data":
        return (
          <SettingCard
            icon={Server}
            title="Dữ liệu & Quyền riêng tư"
            description="Xem chính sách, quản lý dữ liệu và yêu cầu xuất dữ liệu."
          >
            <button className="flex items-center justify-between w-full text-left py-3 text-sm font-medium text-[#E91E63] hover:text-[#E91E63] transition duration-150 border-b border-gray-100">
              Xem Chính sách Quyền riêng tư <Info className="w-4 h-4" />
            </button>
            <button className="flex items-center justify-between w-full text-left py-3 text-sm font-medium text-[#E91E63] hover:text-[#E91E63] transition duration-150 border-b border-gray-100">
              Yêu cầu Xuất dữ liệu cá nhân <Server className="w-4 h-4" />
            </button>
            <button className="flex items-center justify-between w-full text-left py-3 text-sm font-medium text-red-600 hover:text-red-800 transition duration-150">
              Xóa Tài khoản (Hành động vĩnh viễn) <Trash2 className="w-4 h-4" />
            </button>
          </SettingCard>
        );

      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#E91E63] mr-4" />
        <span className="text-lg font-semibold text-[#E91E63]">
          Đang tải cấu hình...
        </span>
      </div>
    );
  }

  if (!settings) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <span className="text-lg font-semibold text-red-500">
          Không thể tải cấu hình hệ thống!
        </span>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 sm:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center space-x-3">
          <Settings className="w-8 h-8 text-[#E91E63]" />
          <h1 className="text-3xl font-extrabold text-gray-900">
            Cài Đặt Hệ Thống
          </h1>
        </div>
        <p className="text-gray-500">
          Quản lý các tùy chọn tài khoản, bảo mật và trải nghiệm ứng dụng của
          bạn.
        </p>

        {/* Admin notice */}
        {!isAdmin && (
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 flex items-start space-x-3">
            <AlertCircle className="w-5 h-5 text-amber-600 mt-0.5 shrink-0" />
            <div>
              <p className="text-sm font-medium text-amber-800">
                Chế độ chỉ xem
              </p>
              <p className="text-sm text-amber-700">
                Bạn chỉ có thể xem cấu hình hệ thống. Liên hệ quản trị viên để thay đổi.
              </p>
            </div>
          </div>
        )}

        {/* Cấu trúc 2 cột: Menu bên trái, Nội dung bên phải */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar Navigation */}
          <nav className="lg:col-span-1 bg-white rounded-xl shadow-lg border border-gray-100 p-4 h-fit">
            <h2 className="text-lg font-semibold text-gray-700 mb-3 border-b pb-2">
              Các Mục Cài Đặt
            </h2>
            <ul className="space-y-1">
              {navItems.map((item) => (
                <li key={item.id}>
                  <button
                    onClick={() => setActiveTab(item.id)}
                    className={`flex items-center w-full px-4 py-3 rounded-lg text-left text-sm font-medium transition duration-200 
                      ${
                        activeTab === item.id
                          ? "bg-linear-to-r from-[#E91E63]/10 to-[#FF8C1A]/10 text-[#E91E63] border border-[#E91E63]/30 font-bold"
                          : "text-gray-600 hover:bg-gray-50 hover:text-[#E91E63]"
                      }`}
                  >
                    <item.icon className="w-5 h-5 mr-3" />
                    {item.label}
                  </button>
                </li>
              ))}
            </ul>
          </nav>

          {/* Main Content Area */}
          <div className="lg:col-span-3 space-y-6">
            {renderContent()}

            {/* Nút lưu (Chỉ hiện cho admin) */}
            {isAdmin && (
              <div className="mt-8 pt-4 border-t border-gray-200">
                <button
                  className="px-6 py-3 bg-linear-to-r from-[#E91E63] to-[#FF8C1A] text-white font-semibold rounded-xl shadow-lg hover:from-[#AD1457] hover:to-[#E65100] transition duration-300 disabled:opacity-60 disabled:cursor-not-allowed"
                  onClick={handleSave}
                  disabled={saving}
                >
                  {saving ? "Đang lưu..." : "Lưu Thay Đổi"}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
