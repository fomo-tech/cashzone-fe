import React, { useState, useEffect } from "react";
import {
  Settings,
  DollarSign,
  Wallet,
  Wrench,
  Globe,
  Building2,
  Plus,
  Trash2,
  Save,
  AlertTriangle,
  Copy,
  Shield,
  Phone,
  Mail,
  Link,
  Loader,
} from "lucide-react";
import http from "@/services/api";
import CommonModal from "@/components/common/Modal";

interface BankInfo {
  _id?: string;
  bankName: string;
  accountNumber: string;
  accountName: string;
  branchName?: string;
  qrCode?: string;
}

interface SystemSettings {
  minDepositAmount: number;
  minWithdrawAmount: number;
  bep20Addresses: string[];
  bankInfo: BankInfo[];
  maintenance: {
    enabled: boolean;
    message: string;
    startTime?: Date;
    endTime?: Date;
  };
  marketingApi: {
    enabled: boolean;
    apiKey?: string;
    apiUrl?: string;
    webhookUrl?: string;
  };
  commission: {
    level1Rate: number; // Tỷ lệ hoa hồng cấp 1 (%)
    level2Rate: number; // Tỷ lệ hoa hồng cấp 2 (%)
    level3Rate: number; // Tỷ lệ hoa hồng cấp 3 (%)
    enabled: boolean; // Bật/tắt hệ thống hoa hồng
  };
  systemName: string;
  systemLogo?: string;
  contactEmail?: string;
  contactPhone?: string;
  supportUrl?: string;
}

const SystemSettingsPage: React.FC = () => {
  const [settings, setSettings] = useState<SystemSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Modal states
  const [showBankModal, setShowBankModal] = useState(false);
  const [showBep20Modal, setShowBep20Modal] = useState(false);
  const [editingBank, setEditingBank] = useState<BankInfo | null>(null);

  // Form states
  const [newBep20Address, setNewBep20Address] = useState("");
  const [bankForm, setBankForm] = useState<BankInfo>({
    bankName: "",
    accountNumber: "",
    accountName: "",
    branchName: "",
    qrCode: "",
  });

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      setLoading(true);
      const response = await http.get("/app-settings");
      const data = response.data.data;

      // Set default commission values if not exist
      if (!data.commission) {
        data.commission = {
          level1Rate: 5,
          level2Rate: 3,
          level3Rate: 1,
          enabled: true,
        };
      }

      setSettings(data);
    } catch (error) {
      console.error("Failed to load settings:", error);
      showToast("Không thể tải cài đặt");
    } finally {
      setLoading(false);
    }
  };

  const saveSettings = async (updates: Partial<SystemSettings>) => {
    try {
      const response = await http.put("/app-settings", updates);
      setSettings(response.data.data);
      showToast("Cập nhật thành công!");
    } catch (error) {
      console.error("Failed to save settings:", error);
      showToast("Lưu thất bại");
    }
  };

  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const updateField = async (field: keyof SystemSettings, value: any) => {
    if (!settings) return;
    const updated = { ...settings, [field]: value };
    setSettings(updated);
    await saveSettings({ [field]: value });
  };

  const addBep20Address = async () => {
    if (!newBep20Address.trim()) {
      showToast("Vui lòng nhập địa chỉ BEP20");
      return;
    }

    try {
      const response = await http.post("/app-settings/bep20", {
        address: newBep20Address,
      });
      setSettings(response.data.data);
      setNewBep20Address("");
      setShowBep20Modal(false);
      showToast("Thêm địa chỉ thành công!");
    } catch (error: any) {
      showToast(error.response?.data?.message || "Thêm địa chỉ thất bại");
    }
  };

  const removeBep20Address = async (address: string) => {
    try {
      const response = await http.delete(`/app-settings/bep20/${address}`);
      setSettings(response.data.data);
      showToast("Xóa địa chỉ thành công!");
    } catch (error) {
      showToast("Xóa địa chỉ thất bại");
    }
  };

  const saveBankInfo = async () => {
    if (
      !bankForm.bankName ||
      !bankForm.accountNumber ||
      !bankForm.accountName
    ) {
      showToast("Vui lòng điền đầy đủ thông tin");
      return;
    }

    try {
      const response = await http.post("/app-settings/bank", bankForm);
      setSettings(response.data.data);
      setBankForm({
        bankName: "",
        accountNumber: "",
        accountName: "",
        branchName: "",
        qrCode: "",
      });
      setEditingBank(null);
      setShowBankModal(false);
      showToast("Lưu thông tin ngân hàng thành công!");
    } catch (error) {
      showToast("Lưu thông tin ngân hàng thất bại");
    }
  };

  const removeBankInfo = async (index: number) => {
    try {
      const response = await http.delete(`/app-settings/bank/${index}`);
      setSettings(response.data.data);
      showToast("Xóa ngân hàng thành công!");
    } catch (error) {
      showToast("Xóa ngân hàng thất bại");
    }
  };

  const toggleMaintenance = async () => {
    if (!settings) return;

    try {
      const response = await http.post("/app-settings/maintenance", {
        enabled: !settings.maintenance.enabled,
        message: settings.maintenance.message,
      });
      setSettings(response.data.data);
      showToast(
        `${
          !settings.maintenance.enabled ? "Bật" : "Tắt"
        } chế độ bảo trì thành công!`
      );
    } catch (error) {
      showToast("Cập nhật chế độ bảo trì thất bại");
    }
  };

  const openEditBank = (bank: BankInfo, index?: number) => {
    setBankForm({ ...bank, _id: index?.toString() });
    setEditingBank(bank);
    setShowBankModal(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader className="w-8 h-8 text-blue-600 animate-spin" />
      </div>
    );
  }

  if (!settings) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <p className="text-red-600">Không thể tải cài đặt hệ thống</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Toast */}
      {toastMessage && (
        <div className="fixed top-4 right-4 z-50 bg-slate-800 text-white px-6 py-3 rounded-lg shadow-lg">
          {toastMessage}
        </div>
      )}

      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-semibold text-gray-900 mb-2 flex items-center gap-3">
            <div className="bg-slate-100 p-3 rounded-lg">
              <Settings className="w-6 h-6 text-gray-700" />
            </div>
            Cài Đặt Hệ Thống
          </h1>
          <p className="text-gray-600">
            Quản lý các cài đặt hệ thống và cấu hình ứng dụng
          </p>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
          {/* Wallet Settings */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="border-b border-gray-200 p-6">
              <div className="flex items-center gap-3">
                <div className="bg-blue-50 p-2 rounded-lg">
                  <Wallet className="w-5 h-5 text-blue-600" />
                </div>
                <h2 className="text-lg font-semibold text-gray-900">
                  Cài Đặt Ví
                </h2>
              </div>
            </div>
            <div className="p-6">
              <div className="space-y-6">
                {/* Min Deposit */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Số tiền nạp tối thiểu (VND)
                  </label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="number"
                      min="0"
                      step="1000"
                      value={settings.minDepositAmount}
                      onChange={(e) =>
                        updateField(
                          "minDepositAmount",
                          parseInt(e.target.value) || 0
                        )
                      }
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                    />
                  </div>
                </div>

                {/* Min Withdraw */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Số tiền rút tối thiểu (VND)
                  </label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="number"
                      min="0"
                      step="1000"
                      value={settings.minWithdrawAmount}
                      onChange={(e) =>
                        updateField(
                          "minWithdrawAmount",
                          parseInt(e.target.value) || 0
                        )
                      }
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* System Info */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="border-b border-gray-200 p-6">
              <div className="flex items-center gap-3">
                <div className="bg-green-50 p-2 rounded-lg">
                  <Globe className="w-5 h-5 text-green-600" />
                </div>
                <h2 className="text-lg font-semibold text-gray-900">
                  Thông Tin Hệ Thống
                </h2>
              </div>
            </div>
            <div className="p-6">
              <div className="space-y-6">
                {/* System Name */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Tên hệ thống
                  </label>
                  <input
                    type="text"
                    value={settings.systemName}
                    onChange={(e) => updateField("systemName", e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                  />
                </div>

                {/* Contact Email */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Email liên hệ
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input
                      type="email"
                      value={settings.contactEmail}
                      onChange={(e) =>
                        updateField("contactEmail", e.target.value)
                      }
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>

                {/* Contact Phone */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Số điện thoại
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input
                      type="tel"
                      value={settings.contactPhone}
                      onChange={(e) =>
                        updateField("contactPhone", e.target.value)
                      }
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* BEP20 Addresses */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="border-b border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="bg-orange-50 p-2 rounded-lg">
                    <Shield className="w-5 h-5 text-orange-600" />
                  </div>
                  <h2 className="text-lg font-semibold text-gray-900">
                    Địa Chỉ BEP20
                  </h2>
                </div>
                <button
                  onClick={() => setShowBep20Modal(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                >
                  <Plus className="w-4 h-4" />
                  Thêm
                </button>
              </div>
            </div>
            <div className="p-6">
              <div className="space-y-3">
                {settings.bep20Addresses.map((address, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                  >
                    <div className="flex items-center gap-3 flex-1">
                      <code className="text-sm text-gray-700 bg-white px-3 py-2 rounded-lg font-mono">
                        {address.slice(0, 10)}...{address.slice(-10)}
                      </code>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => navigator.clipboard.writeText(address)}
                        className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Copy"
                      >
                        <Copy className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => removeBep20Address(address)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Remove"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}

                {settings.bep20Addresses.length === 0 && (
                  <div className="text-center py-8 text-slate-500">
                    Chưa có địa chỉ BEP20 nào
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Bank Info */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="border-b border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="bg-emerald-50 p-2 rounded-lg">
                    <Building2 className="w-5 h-5 text-emerald-600" />
                  </div>
                  <h2 className="text-lg font-semibold text-gray-900">
                    Thông Tin Ngân Hàng
                  </h2>
                </div>
                <button
                  onClick={() => {
                    setBankForm({
                      bankName: "",
                      accountNumber: "",
                      accountName: "",
                      branchName: "",
                      qrCode: "",
                    });
                    setEditingBank(null);
                    setShowBankModal(true);
                  }}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                >
                  <Plus className="w-4 h-4" />
                  Thêm
                </button>
              </div>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {settings.bankInfo.map((bank, index) => (
                  <div key={index} className="p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-800">
                          {bank.bankName}
                        </h3>
                        <p className="text-gray-600">
                          {bank.accountNumber} - {bank.accountName}
                        </p>
                        {bank.branchName && (
                          <p className="text-sm text-slate-500">
                            Chi nhánh: {bank.branchName}
                          </p>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => openEditBank(bank, index)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Edit"
                        >
                          <Settings className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => removeBankInfo(index)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Remove"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}

                {settings.bankInfo.length === 0 && (
                  <div className="text-center py-8 text-slate-500">
                    Chưa có thông tin ngân hàng
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Maintenance Mode */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="border-b border-gray-200 p-6">
              <div className="flex items-center gap-3">
                <div className="bg-red-50 p-2 rounded-lg">
                  <Wrench className="w-5 h-5 text-red-600" />
                </div>
                <h2 className="text-lg font-semibold text-gray-900">
                  Chế Độ Bảo Trì
                </h2>
              </div>
            </div>
            <div className="p-6">
              <div className="space-y-6">
                {/* Toggle */}
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <h3 className="font-semibold text-gray-800">
                      Kích hoạt bảo trì
                    </h3>
                    <p className="text-sm text-gray-600">
                      Tạm khóa toàn bộ hệ thống
                    </p>
                  </div>
                  <button
                    onClick={toggleMaintenance}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      settings.maintenance.enabled
                        ? "bg-red-600"
                        : "bg-gray-300"
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        settings.maintenance.enabled
                          ? "translate-x-6"
                          : "translate-x-1"
                      }`}
                    />
                  </button>
                </div>

                {/* Message */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Thông báo bảo trì
                  </label>
                  <textarea
                    value={settings.maintenance.message}
                    onChange={(e) =>
                      updateField("maintenance", {
                        ...settings.maintenance,
                        message: e.target.value,
                      })
                    }
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                    placeholder="Nhập thông báo bảo trì..."
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Marketing API */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="border-b border-gray-200 p-6">
              <div className="flex items-center gap-3">
                <div className="bg-purple-50 p-2 rounded-lg">
                  <Link className="w-5 h-5 text-purple-600" />
                </div>
                <h2 className="text-lg font-semibold text-gray-900">
                  Marketing API
                </h2>
              </div>
            </div>
            <div className="p-6">
              <div className="space-y-6">
                {/* Enable/Disable */}
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <h3 className="font-semibold text-gray-800">
                      Kích hoạt Marketing API
                    </h3>
                    <p className="text-sm text-gray-600">
                      Tích hợp với hệ thống marketing
                    </p>
                  </div>
                  <button
                    onClick={() =>
                      updateField("marketingApi", {
                        ...settings.marketingApi,
                        enabled: !settings.marketingApi.enabled,
                      })
                    }
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      settings.marketingApi.enabled
                        ? "bg-blue-600"
                        : "bg-gray-300"
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        settings.marketingApi.enabled
                          ? "translate-x-6"
                          : "translate-x-1"
                      }`}
                    />
                  </button>
                </div>

                {/* API Settings */}
                {settings.marketingApi.enabled && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        API Key
                      </label>
                      <input
                        type="password"
                        value={settings.marketingApi.apiKey || ""}
                        onChange={(e) =>
                          updateField("marketingApi", {
                            ...settings.marketingApi,
                            apiKey: e.target.value,
                          })
                        }
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Nhập API key..."
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        API URL
                      </label>
                      <input
                        type="url"
                        value={settings.marketingApi.apiUrl || ""}
                        onChange={(e) =>
                          updateField("marketingApi", {
                            ...settings.marketingApi,
                            apiUrl: e.target.value,
                          })
                        }
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="https://api.example.com"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Webhook URL
                      </label>
                      <input
                        type="url"
                        value={settings.marketingApi.webhookUrl || ""}
                        onChange={(e) =>
                          updateField("marketingApi", {
                            ...settings.marketingApi,
                            webhookUrl: e.target.value,
                          })
                        }
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="https://webhook.example.com"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Commission Settings */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="border-b border-gray-200 p-6">
              <div className="flex items-center gap-3">
                <div className="bg-gradient-to-br from-orange-500 via-orange-600 to-amber-600 p-2 rounded-lg">
                  <DollarSign className="w-5 h-5 text-white" />
                </div>
                <h2 className="text-lg font-semibold text-gray-900">
                  Cài Đặt Hoa Hồng
                </h2>
              </div>
            </div>
            <div className="p-6">
              <div className="space-y-6">
                {/* Enable/Disable Commission */}
                <div className="flex items-center justify-between p-4 bg-gradient-to-r from-pink-50 to-orange-50 rounded-lg border border-pink-100">
                  <div>
                    <h3 className="font-semibold text-gray-800">
                      Kích hoạt hệ thống hoa hồng
                    </h3>
                    <p className="text-sm text-gray-600">
                      Bật/tắt hệ thống hoa hồng 3 cấp
                    </p>
                  </div>
                  <button
                    onClick={() =>
                      updateField("commission", {
                        ...settings.commission,
                        enabled: !settings.commission?.enabled,
                      })
                    }
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      settings.commission?.enabled
                        ? "bg-gradient-to-br from-orange-500 via-orange-600 to-amber-600"
                        : "bg-gray-300"
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        settings.commission?.enabled
                          ? "translate-x-6"
                          : "translate-x-1"
                      }`}
                    />
                  </button>
                </div>

                {/* Commission Rates */}
                {settings.commission?.enabled && (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Level 1 Commission */}
                    <div className="p-4 border border-gray-200 rounded-lg bg-gradient-to-br from-green-50 to-emerald-50">
                      <div className="flex items-center gap-2 mb-3">
                        <div className="w-3 h-3 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full"></div>
                        <h4 className="font-semibold text-gray-800">
                          Cấp 1 (F1)
                        </h4>
                      </div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Tỷ lệ hoa hồng (%)
                      </label>
                      <div className="relative">
                        <input
                          type="number"
                          min="0"
                          max="100"
                          step="0.1"
                          value={settings.commission?.level1Rate || 0}
                          onChange={(e) =>
                            updateField("commission", {
                              ...settings.commission,
                              level1Rate: parseFloat(e.target.value) || 0,
                            })
                          }
                          className="w-full px-4 py-3 pr-8 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                          placeholder="5.0"
                        />
                        <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">
                          %
                        </span>
                      </div>
                      <p className="text-xs text-gray-600 mt-2">
                        Hoa hồng trực tiếp từ người dùng cấp 1
                      </p>
                    </div>

                    {/* Level 2 Commission */}
                    <div className="p-4 border border-gray-200 rounded-lg bg-gradient-to-br from-blue-50 to-cyan-50">
                      <div className="flex items-center gap-2 mb-3">
                        <div className="w-3 h-3 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full"></div>
                        <h4 className="font-semibold text-gray-800">
                          Cấp 2 (F2)
                        </h4>
                      </div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Tỷ lệ hoa hồng (%)
                      </label>
                      <div className="relative">
                        <input
                          type="number"
                          min="0"
                          max="100"
                          step="0.1"
                          value={settings.commission?.level2Rate || 0}
                          onChange={(e) =>
                            updateField("commission", {
                              ...settings.commission,
                              level2Rate: parseFloat(e.target.value) || 0,
                            })
                          }
                          className="w-full px-4 py-3 pr-8 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="3.0"
                        />
                        <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">
                          %
                        </span>
                      </div>
                      <p className="text-xs text-gray-600 mt-2">
                        Hoa hồng từ người dùng cấp 2
                      </p>
                    </div>

                    {/* Level 3 Commission */}
                    <div className="p-4 border border-gray-200 rounded-lg bg-gradient-to-br from-purple-50 to-violet-50">
                      <div className="flex items-center gap-2 mb-3">
                        <div className="w-3 h-3 bg-gradient-to-r from-purple-500 to-violet-500 rounded-full"></div>
                        <h4 className="font-semibold text-gray-800">
                          Cấp 3 (F3)
                        </h4>
                      </div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Tỷ lệ hoa hồng (%)
                      </label>
                      <div className="relative">
                        <input
                          type="number"
                          min="0"
                          max="100"
                          step="0.1"
                          value={settings.commission?.level3Rate || 0}
                          onChange={(e) =>
                            updateField("commission", {
                              ...settings.commission,
                              level3Rate: parseFloat(e.target.value) || 0,
                            })
                          }
                          className="w-full px-4 py-3 pr-8 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                          placeholder="1.0"
                        />
                        <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">
                          %
                        </span>
                      </div>
                      <p className="text-xs text-gray-600 mt-2">
                        Hoa hồng từ người dùng cấp 3
                      </p>
                    </div>
                  </div>
                )}

                {/* Commission Info */}
                <div className="bg-gradient-to-r from-amber-50 to-yellow-50 border border-amber-200 p-4 rounded-lg">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
                    <div className="text-sm text-amber-800">
                      <p className="font-semibold mb-1">Lưu ý về hoa hồng:</p>
                      <ul className="space-y-1">
                        <li>
                          • Cấp 1 (F1): Hoa hồng trực tiếp từ người giới thiệu
                        </li>
                        <li>
                          • Cấp 2 (F2): Hoa hồng từ người do F1 giới thiệu
                        </li>
                        <li>
                          • Cấp 3 (F3): Hoa hồng từ người do F2 giới thiệu
                        </li>
                        <li>
                          • Tỷ lệ hoa hồng áp dụng cho tất cả giao dịch thành
                          công
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* BEP20 Modal */}
      <CommonModal
        isOpen={showBep20Modal}
        onClose={() => setShowBep20Modal(false)}
        title="Thêm Địa Chỉ BEP20"
        width="max-w-md"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Địa chỉ BEP20
            </label>
            <input
              type="text"
              value={newBep20Address}
              onChange={(e) => setNewBep20Address(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="0x..."
              autoFocus
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button
              onClick={() => setShowBep20Modal(false)}
              className="flex-1 py-3 border border-gray-300 rounded-lg font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Hủy
            </button>
            <button
              onClick={addBep20Address}
              className="flex-1 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              Thêm
            </button>
          </div>
        </div>
      </CommonModal>

      {/* Bank Modal */}
      <CommonModal
        isOpen={showBankModal}
        onClose={() => setShowBankModal(false)}
        title={editingBank ? "Sửa Thông Tin Ngân Hàng" : "Thêm Ngân Hàng"}
        width="max-w-lg"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Tên ngân hàng <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={bankForm.bankName}
              onChange={(e) =>
                setBankForm({ ...bankForm, bankName: e.target.value })
              }
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Vietcombank, Techcombank..."
              autoFocus
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Số tài khoản <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={bankForm.accountNumber}
              onChange={(e) =>
                setBankForm({ ...bankForm, accountNumber: e.target.value })
              }
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="1234567890"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Tên chủ tài khoản <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={bankForm.accountName}
              onChange={(e) =>
                setBankForm({ ...bankForm, accountName: e.target.value })
              }
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="NGUYEN VAN A"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Chi nhánh
            </label>
            <input
              type="text"
              value={bankForm.branchName || ""}
              onChange={(e) =>
                setBankForm({ ...bankForm, branchName: e.target.value })
              }
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Chi nhánh Hà Nội"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              QR Code (URL)
            </label>
            <input
              type="url"
              value={bankForm.qrCode || ""}
              onChange={(e) =>
                setBankForm({ ...bankForm, qrCode: e.target.value })
              }
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="https://example.com/qr-code.png"
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button
              onClick={() => setShowBankModal(false)}
              className="flex-1 py-3 border border-gray-300 rounded-lg font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Hủy
            </button>
            <button
              onClick={saveBankInfo}
              className="flex-1 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
            >
              <Save className="w-4 h-4" />
              {editingBank ? "Cập nhật" : "Thêm"}
            </button>
          </div>
        </div>
      </CommonModal>
    </div>
  );
};

export default SystemSettingsPage;
