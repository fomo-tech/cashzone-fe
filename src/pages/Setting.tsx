import React, { useState } from "react";
import {
  Settings,
  User,
  Shield,
  Bell,
  Globe,
  Lock,
  Mail,
  Server,
  Info,
  ArrowRight,
} from "lucide-react";

// Component con cho Toggle Switch (Bật/Tắt)
const ToggleSwitch = ({ label, isChecked, onToggle }) => (
  <div className="flex items-center justify-between py-3 border-b border-gray-100 last:border-b-0">
    <span className="text-sm font-medium text-gray-700">{label}</span>
    <button
      onClick={onToggle}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 ${
        isChecked ? "bg-green-600" : "bg-gray-200"
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
const SelectSetting = ({ label, value, onChange, options }) => (
  <div className="flex flex-col space-y-1 py-3 border-b border-gray-100 last:border-b-0">
    <label htmlFor={label} className="text-sm font-medium text-gray-700">
      {label}
    </label>
    <select
      id={label}
      value={value}
      onChange={onChange}
      className="mt-1 block w-full px-3 py-2 border border-gray-300 bg-white rounded-lg shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 text-sm"
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
const SettingCard = ({ icon: Icon, title, description, children }) => (
  <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
    <div className="flex items-center space-x-3 mb-4 border-b pb-3">
      <Icon className="w-6 h-6 text-green-600" />
      <h3 className="text-lg font-bold text-gray-800">{title}</h3>
    </div>
    <p className="text-sm text-gray-500 mb-4">{description}</p>
    <div className="space-y-2">{children}</div>
  </div>
);

const SettingsPage = () => {
  // Mock State cho các cài đặt
  const [generalSettings, setGeneralSettings] = useState({
    language: "vi",
    timezone: "hcm",
  });

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

  // Xử lý thay đổi cài đặt chung
  const handleGeneralChange = (e) => {
    const { id, value } = e.target;
    setGeneralSettings((prev) => ({ ...prev, [id]: value }));
  };

  // Xử lý chuyển đổi (Toggle)
  const handleToggle = (settingKey, setState) => {
    setState((prev) => ({ ...prev, [settingKey]: !prev[settingKey] }));
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
            <button className="flex items-center justify-between w-full text-left py-3 text-sm font-medium text-green-600 hover:text-green-800 transition duration-150">
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
            <SelectSetting
              label="Ngôn ngữ Hiển thị"
              value={generalSettings.language}
              onChange={handleGeneralChange}
              options={[
                { value: "vi", label: "Tiếng Việt (Vietnamese)" },
                { value: "en", label: "English (US)" },
              ]}
            />
            <SelectSetting
              label="Múi giờ"
              value={generalSettings.timezone}
              onChange={handleGeneralChange}
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
            <button className="flex items-center justify-between w-full text-left py-3 text-sm font-medium text-green-600 hover:text-green-800 transition duration-150 border-b border-gray-100">
              Xem Chính sách Quyền riêng tư <Info className="w-4 h-4" />
            </button>
            <button className="flex items-center justify-between w-full text-left py-3 text-sm font-medium text-green-600 hover:text-green-800 transition duration-150 border-b border-gray-100">
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

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center space-x-3">
          <Settings className="w-8 h-8 text-green-600" />
          <h1 className="text-3xl font-extrabold text-gray-900">
            Cài Đặt Hệ Thống
          </h1>
        </div>
        <p className="text-gray-500">
          Quản lý các tùy chọn tài khoản, bảo mật và trải nghiệm ứng dụng của
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
                          ? "bg-green-100 text-green-700 font-bold"
                          : "text-gray-600 hover:bg-gray-50 hover:text-green-600"
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
              <button className="px-6 py-3 bg-green-600 text-white font-semibold rounded-xl shadow-lg hover:bg-green-700 transition duration-300">
                Lưu Thay Đổi
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
