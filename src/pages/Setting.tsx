import React, { useState, useEffect } from "react";
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
  Trash2,
  Loader2,
} from "lucide-react";
import { toast } from "react-hot-toast";
import { useAuthStore } from "@/store/authStore";

// User Preferences Interface
interface UserPreferences {
  language: string;
  timezone: string;
  emailNotifications: boolean;
  pushNotifications: boolean;
  smsNotifications: boolean;
  twoFactorAuth: boolean;
  sessionTimeout: boolean;
}

// Component con cho Toggle Switch (Bật/Tắt)
interface ToggleSwitchProps {
  label: string;
  isChecked: boolean;
  onToggle: () => void;
}

const ToggleSwitch: React.FC<ToggleSwitchProps> = ({
  label,
  isChecked,
  onToggle,
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
interface SelectSettingProps {
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  options: { value: string; label: string }[];
}

const SelectSetting: React.FC<SelectSettingProps> = ({
  label,
  value,
  onChange,
  options,
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
interface SettingCardProps {
  icon: React.ElementType;
  title: string;
  description: string;
  children: React.ReactNode;
}

const SettingCard: React.FC<SettingCardProps> = ({
  icon: Icon,
  title,
  description,
  children,
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

const SettingsPage = () => {
  const { user } = useAuthStore();

  // User Preferences State
  const [preferences, setPreferences] = useState<UserPreferences>({
    language: "vi",
    timezone: "hcm",
    emailNotifications: true,
    pushNotifications: true,
    smsNotifications: false,
    twoFactorAuth: false,
    sessionTimeout: true,
  });

  // State quản lý tab hiện tại
  const [activeTab, setActiveTab] = useState("account");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Load preferences from localStorage
  useEffect(() => {
    setLoading(true);
    try {
      const savedPrefs = localStorage.getItem("userPreferences");
      if (savedPrefs) {
        setPreferences(JSON.parse(savedPrefs));
      }
    } catch (error) {
      console.error("Error loading preferences:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  // Save preferences to localStorage
  const handleSave = async () => {
    setSaving(true);
    try {
      localStorage.setItem("userPreferences", JSON.stringify(preferences));
      toast.success("Lưu cài đặt thành công!");
    } catch (error: any) {
      console.error("Error saving preferences:", error);
      toast.error(error?.message || "Lỗi khi lưu cài đặt!");
    } finally {
      setSaving(false);
    }
  };

  // Update preference
  const updatePreference = (key: keyof UserPreferences, value: any) => {
    setPreferences((prev) => ({ ...prev, [key]: value }));
  };

  // Toggle preference
  const togglePreference = (key: keyof UserPreferences) => {
    setPreferences((prev) => ({ ...prev, [key]: !prev[key] }));
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
              <p className="text-sm text-gray-500">
                {user?.name || "Chưa cập nhật"}
              </p>
            </div>
            <div className="py-3 border-b border-gray-100">
              <span className="text-sm font-semibold text-gray-700">
                Email:
              </span>
              <p className="text-sm text-gray-500">
                {user?.email || "Chưa cập nhật"}
              </p>
            </div>
            <div className="py-3 border-b border-gray-100">
              <span className="text-sm font-semibold text-gray-700">
                Số điện thoại:
              </span>
              <p className="text-sm text-gray-500">
                {user?.phone || "Chưa cập nhật"}
              </p>
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
              isChecked={preferences.twoFactorAuth}
              onToggle={() => togglePreference("twoFactorAuth")}
            />

            <ToggleSwitch
              label="Tự động đăng xuất sau 30 phút không hoạt động"
              isChecked={preferences.sessionTimeout}
              onToggle={() => togglePreference("sessionTimeout")}
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
              isChecked={preferences.emailNotifications}
              onToggle={() => togglePreference("emailNotifications")}
            />
            <ToggleSwitch
              label="Thông báo đẩy (Push) trên thiết bị"
              isChecked={preferences.pushNotifications}
              onToggle={() => togglePreference("pushNotifications")}
            />
            <ToggleSwitch
              label="Thông báo qua SMS"
              isChecked={preferences.smsNotifications}
              onToggle={() => togglePreference("smsNotifications")}
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
            <SelectSetting
              label="Ngôn ngữ Hiển thị"
              value={preferences.language}
              onChange={(e) => updatePreference("language", e.target.value)}
              options={[
                { value: "vi", label: "Tiếng Việt (Vietnamese)" },
                { value: "en", label: "English (US)" },
              ]}
            />
            <SelectSetting
              label="Múi giờ"
              value={preferences.timezone}
              onChange={(e) => updatePreference("timezone", e.target.value)}
              options={[
                { value: "hcm", label: "GMT+7 (Hồ Chí Minh, Việt Nam)" },
                { value: "utc", label: "UTC (Coordinated Universal Time)" },
              ]}
            />
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
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <Loader2 className="w-12 h-12 text-[#E91E63] animate-spin" />
        <span className="text-lg font-semibold text-gray-700">
          Đang tải cài đặt...
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
            Cài Đặt Cá Nhân
          </h1>
        </div>
        <p className="text-gray-500">
          Quản lý các tùy chọn tài khoản, bảo mật và trải nghiệm cá nhân của
          bạn.
        </p>

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
                          ? "bg-gradient-to-r from-[#E91E63]/10 to-[#FF8C1A]/10 text-[#E91E63] border border-[#E91E63]/30 font-bold"
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

            {/* Nút lưu (Chỉ hiện nếu có thay đổi) - Mock up */}
            <div className="mt-8 pt-4 border-t border-gray-200">
              <button
                className="px-6 py-3 bg-gradient-to-br from-orange-500 via-orange-600 to-amber-600 text-white font-semibold rounded-xl shadow-lg hover:from-orange-600 hover:to-amber-700 transition duration-300 disabled:opacity-60 disabled:cursor-not-allowed"
                onClick={handleSave}
                disabled={saving}
              >
                {saving ? "Đang lưu..." : "Lưu Thay Đổi"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
