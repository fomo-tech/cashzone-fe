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
  CalendarDays,
  Coins,
  RotateCcw,
  Zap,
  Palette,
  Gift,
} from "lucide-react";
import http from "@/services/api";
import CommonModal from "@/components/common/Modal";
import checkinService, {
  type CheckInRewards,
} from "../../services/checkinService";
import luckywheelService, {
  type LuckyWheelSettings,
  type LuckyWheelPrize,
} from "../../services/luckywheelService";

interface BankInfo {
  _id?: string;
  bankName: string;
  accountNumber: string;
  accountName: string;
  branchName?: string;
  qrCode?: string;
}

interface ReferralMilestone {
  referrals: number;
  reward: number;
  title: string;
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
  defaultCashbackRate?: number; // Tỷ lệ hoàn tiền mặc định cho user (%)
  referralMilestones?: ReferralMilestone[];
  checkInRewards?: CheckInRewards;
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

  // CheckIn Settings states
  const [checkInRewards, setCheckInRewards] = useState<CheckInRewards>({
    day1: 100,
    day2: 150,
    day3: 200,
    day4: 250,
    day5: 300,
    day6: 350,
    day7: 500,
    bonusWeekComplete: 100,
  });
  const [originalCheckInRewards, setOriginalCheckInRewards] =
    useState<CheckInRewards | null>(null);
  const [savingCheckIn, setSavingCheckIn] = useState(false);
  const [editingBank, setEditingBank] = useState<BankInfo | null>(null);
  const [showMilestoneModal, setShowMilestoneModal] = useState(false);
  const [editingMilestones, setEditingMilestones] = useState<
    ReferralMilestone[]
  >([]);

  // Lucky Wheel Settings states
  const [luckyWheelSettings, setLuckyWheelSettings] =
    useState<LuckyWheelSettings | null>(null);
  const [originalLuckyWheelSettings, setOriginalLuckyWheelSettings] =
    useState<LuckyWheelSettings | null>(null);
  const [savingLuckyWheel, setSavingLuckyWheel] = useState(false);

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

      // Load system settings and checkin rewards in parallel
      const [settingsResponse, checkInResponse, luckyWheelResponse] =
        await Promise.all([
          http.get("/app-settings"),
          checkinService.getAdminRewardsConfig().catch(() => ({
            day1: 100,
            day2: 150,
            day3: 200,
            day4: 250,
            day5: 300,
            day6: 350,
            day7: 500,
            bonusWeekComplete: 100,
          })),
          luckywheelService.getSettings().catch(() => null),
        ]);

      const data = settingsResponse.data.data;

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

      // Set checkin rewards
      setCheckInRewards(checkInResponse);
      setOriginalCheckInRewards({ ...checkInResponse });

      // Set lucky wheel settings
      if (luckyWheelResponse) {
        setLuckyWheelSettings(luckyWheelResponse);
        setOriginalLuckyWheelSettings({ ...luckyWheelResponse });
      }
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

  // CheckIn Rewards handlers
  const handleCheckInRewardChange = (
    key: keyof CheckInRewards,
    value: number,
  ) => {
    if (value < 0) return;
    setCheckInRewards((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const saveCheckInRewards = async () => {
    setSavingCheckIn(true);
    try {
      await checkinService.updateRewardsConfig(checkInRewards);
      setOriginalCheckInRewards({ ...checkInRewards });
      showToast("Cập nhật thưởng điểm danh thành công!");
    } catch (error: any) {
      console.error("Failed to save checkin rewards:", error);
      showToast(
        error.response?.data?.message || "Cập nhật thưởng điểm danh thất bại",
      );
    } finally {
      setSavingCheckIn(false);
    }
  };

  const resetCheckInRewards = () => {
    if (originalCheckInRewards) {
      setCheckInRewards({ ...originalCheckInRewards });
    }
  };

  // Lucky Wheel management functions
  const hasLuckyWheelChanges =
    luckyWheelSettings && originalLuckyWheelSettings
      ? JSON.stringify(luckyWheelSettings) !==
        JSON.stringify(originalLuckyWheelSettings)
      : false;

  const handleLuckyWheelSettingChange = (
    key: keyof LuckyWheelSettings,
    value: any,
  ) => {
    if (!luckyWheelSettings) return;
    setLuckyWheelSettings((prev) =>
      prev
        ? {
            ...prev,
            [key]: value,
          }
        : null,
    );
  };

  const handlePrizeChange = (
    index: number,
    key: keyof LuckyWheelPrize,
    value: any,
  ) => {
    if (!luckyWheelSettings) return;
    const newPrizes = [...luckyWheelSettings.prizes];
    newPrizes[index] = { ...newPrizes[index], [key]: value };
    setLuckyWheelSettings((prev) =>
      prev ? { ...prev, prizes: newPrizes } : null,
    );
  };

  const saveLuckyWheelSettings = async () => {
    if (!luckyWheelSettings) return;

    setSavingLuckyWheel(true);
    try {
      const updated =
        await luckywheelService.updateSettings(luckyWheelSettings);
      setOriginalLuckyWheelSettings({ ...updated });
      showToast("Cập nhật cài đặt vòng quay thành công!");
    } catch (error: any) {
      console.error("Failed to save lucky wheel settings:", error);
      showToast(
        error.response?.data?.message || "Cập nhật cài đặt vòng quay thất bại",
      );
    } finally {
      setSavingLuckyWheel(false);
    }
  };

  const resetLuckyWheelSettings = () => {
    if (originalLuckyWheelSettings) {
      setLuckyWheelSettings({ ...originalLuckyWheelSettings });
    }
  };

  const hasCheckInChanges =
    originalCheckInRewards &&
    JSON.stringify(checkInRewards) !== JSON.stringify(originalCheckInRewards);

  const dayNames = [
    "Ngày 1 liên tiếp",
    "Ngày 2 liên tiếp",
    "Ngày 3 liên tiếp",
    "Ngày 4 liên tiếp",
    "Ngày 5 liên tiếp",
    "Ngày 6 liên tiếp",
    "Ngày 7 liên tiếp",
  ];

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
        } chế độ bảo trì thành công!`,
      );
    } catch (error) {
      showToast("Cập nhật chế độ bảo trì thất bại");
    }
  };

  const openEditMilestones = () => {
    const defaultMilestones = [
      { referrals: 5, reward: 50000, title: "Người giới thiệu mới" },
      { referrals: 20, reward: 200000, title: "Cộng tác viên tích cực" },
      { referrals: 50, reward: 500000, title: "Đại lý chuyên nghiệp" },
      { referrals: 100, reward: 1000000, title: "Chuyên gia giới thiệu" },
    ];
    setEditingMilestones(settings?.referralMilestones || defaultMilestones);
    setShowMilestoneModal(true);
  };

  const saveMilestones = async () => {
    try {
      const response = await http.put("/app-settings/referral-milestones", {
        milestones: editingMilestones,
      });
      setSettings(response.data.data);
      setShowMilestoneModal(false);
      showToast("Cập nhật mốc thưởng thành công!");
    } catch (error) {
      showToast("Cập nhật mốc thưởng thất bại");
    }
  };

  const addMilestone = () => {
    setEditingMilestones([
      ...editingMilestones,
      { referrals: 0, reward: 0, title: "" },
    ]);
  };

  const updateMilestone = (
    index: number,
    field: keyof ReferralMilestone,
    value: any,
  ) => {
    const updated = [...editingMilestones];
    updated[index] = { ...updated[index], [field]: value };
    setEditingMilestones(updated);
  };

  const removeMilestone = (index: number) => {
    setEditingMilestones(editingMilestones.filter((_, i) => i !== index));
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
                          parseInt(e.target.value) || 0,
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
                          parseInt(e.target.value) || 0,
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

                {/* Default Cashback Rate */}
                <div className="bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200 p-5 rounded-xl">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg flex items-center justify-center">
                      <DollarSign className="text-white" size={20} />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-800">
                        Tỷ Lệ Hoàn Tiền Mặc Định
                      </h4>
                      <p className="text-xs text-gray-600">
                        % user nhận khi tạo đơn hàng
                      </p>
                    </div>
                  </div>
                  <div className="relative">
                    <input
                      type="number"
                      min="50"
                      max="100"
                      step="1"
                      value={settings.defaultCashbackRate || 80}
                      onChange={(e) =>
                        updateField(
                          "defaultCashbackRate",
                          parseFloat(e.target.value) || 80,
                        )
                      }
                      className="w-full px-4 py-3 pr-12 border-2 border-green-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 font-semibold text-lg"
                      placeholder="80"
                    />
                    <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-green-600 text-lg font-bold">
                      %
                    </span>
                  </div>
                  <p className="text-xs text-gray-600 mt-3">
                    💡 User sẽ nhận {settings.defaultCashbackRate || 80}% từ
                    commission, Admin giữ{" "}
                    {100 - (settings.defaultCashbackRate || 80)}%
                  </p>
                  <p className="text-xs text-green-700 mt-2 bg-green-100 p-2 rounded">
                    ⚙️ Áp dụng cho modal "Tạo Đơn Nhanh" tại trang Duyệt Hoàn
                    Tiền
                  </p>
                </div>

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

          {/* Referral Milestones Settings */}
          <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200">
            <div className="bg-gradient-to-r from-orange-500 to-amber-500 px-6 py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                    <Settings className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-white">
                      Mốc Thưởng Giới Thiệu
                    </h2>
                    <p className="text-orange-100 text-sm">
                      Cài đặt các mốc thưởng cho người giới thiệu
                    </p>
                  </div>
                </div>
                <button
                  onClick={openEditMilestones}
                  className="px-4 py-2 bg-white text-orange-600 rounded-lg hover:bg-orange-50 transition-colors font-semibold flex items-center gap-2"
                >
                  <Settings className="w-4 h-4" />
                  Chỉnh Sửa
                </button>
              </div>
            </div>

            <div className="p-6">
              <div className="space-y-3">
                {(settings?.referralMilestones || []).map(
                  (milestone, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-amber-500 rounded-full flex items-center justify-center text-white font-bold">
                          {index + 1}
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-800">
                            {milestone.title}
                          </h3>
                          <p className="text-sm text-gray-600">
                            {milestone.referrals} người đã mua hàng
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-orange-600">
                          {milestone.reward.toLocaleString("vi-VN")}đ
                        </p>
                        <p className="text-xs text-gray-500">Thưởng</p>
                      </div>
                    </div>
                  ),
                )}

                {(!settings?.referralMilestones ||
                  settings.referralMilestones.length === 0) && (
                  <div className="text-center py-8 text-gray-500">
                    <p>Chưa có mốc thưởng nào</p>
                    <button
                      onClick={openEditMilestones}
                      className="mt-3 text-orange-600 hover:text-orange-700 font-semibold"
                    >
                      Thêm mốc thưởng
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Daily CheckIn Settings */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 xl:col-span-2">
          <div className="bg-gradient-to-r from-orange-500 to-amber-500 px-6 py-4 rounded-t-xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                  <CalendarDays className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white">
                    Cài đặt điểm danh hàng ngày
                  </h2>
                  <p className="text-orange-100 text-sm">
                    Quản lý thưởng điểm danh theo số ngày liên tiếp và thưởng
                    hoàn thành tuần
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                {hasCheckInChanges && (
                  <button
                    onClick={resetCheckInRewards}
                    className="px-4 py-2 bg-white/20 text-white rounded-lg hover:bg-white/30 transition-colors flex items-center gap-2 backdrop-blur-sm"
                  >
                    <RotateCcw className="h-4 w-4" />
                    Hủy thay đổi
                  </button>
                )}

                <button
                  onClick={saveCheckInRewards}
                  disabled={savingCheckIn || !hasCheckInChanges}
                  className={`px-6 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors ${
                    hasCheckInChanges && !savingCheckIn
                      ? "bg-white text-orange-600 hover:bg-orange-50 shadow-lg"
                      : "bg-white/20 text-white/60 cursor-not-allowed"
                  }`}
                >
                  {savingCheckIn ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current"></div>
                      Đang lưu...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4" />
                      Lưu cài đặt
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          <div className="p-6">
            {/* Daily Rewards */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Coins className="h-5 w-5 text-green-600" />
                Thưởng theo số ngày liên tiếp
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {dayNames.map((dayName, index) => (
                  <div
                    key={index}
                    className="border border-gray-200 rounded-lg p-4 hover:border-orange-300 transition-colors"
                  >
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {dayName}
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        min="0"
                        step="1000"
                        value={
                          checkInRewards[
                            `day${index + 1}` as keyof CheckInRewards
                          ]
                        }
                        onChange={(e) =>
                          handleCheckInRewardChange(
                            `day${index + 1}` as keyof CheckInRewards,
                            parseInt(e.target.value) || 0,
                          )
                        }
                        className="block w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all"
                        placeholder="0"
                      />
                      <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                        <span className="text-gray-500 text-sm">VNĐ</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Week Complete Bonus */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Settings className="h-5 w-5 text-orange-600" />
                Thưởng hoàn thành 1 tuần
              </h3>

              <div className="border border-gray-200 rounded-lg p-6 bg-gradient-to-r from-orange-50 to-yellow-50">
                <div className="max-w-md">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Thưởng thêm khi hoàn thành điểm danh 7 ngày liên tiếp
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      min="0"
                      step="1000"
                      value={checkInRewards.bonusWeekComplete}
                      onChange={(e) =>
                        handleCheckInRewardChange(
                          "bonusWeekComplete",
                          parseInt(e.target.value) || 0,
                        )
                      }
                      className="block w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all"
                      placeholder="0"
                    />
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                      <span className="text-gray-500 text-sm">VNĐ</span>
                    </div>
                  </div>
                  <p className="mt-2 text-sm text-gray-600">
                    Thưởng này sẽ được cộng thêm khi người dùng hoàn thành điểm
                    danh 7 ngày liên tiếp.
                  </p>
                </div>
              </div>
            </div>

            {/* Preview */}
            <div className="p-6 bg-blue-50 rounded-lg border border-blue-200">
              <h3 className="text-lg font-semibold text-blue-900 mb-4">
                Xem trước thưởng theo ngày liên tiếp
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {dayNames.map((dayName, index) => (
                  <div
                    key={index}
                    className="bg-white p-3 rounded-lg border shadow-sm"
                  >
                    <div className="text-sm text-gray-600 text-center">
                      {dayName}
                    </div>
                    <div className="text-lg font-bold text-center text-blue-600 mt-1">
                      {(
                        checkInRewards[
                          `day${index + 1}` as keyof CheckInRewards
                        ] as number
                      ).toLocaleString()}{" "}
                      VNĐ
                    </div>
                    {index === 6 && checkInRewards.bonusWeekComplete > 0 && (
                      <div className="text-xs text-center text-orange-600 mt-1">
                        +{checkInRewards.bonusWeekComplete.toLocaleString()}{" "}
                        (hoàn thành tuần)
                      </div>
                    )}
                  </div>
                ))}
              </div>

              <div className="mt-4 text-sm text-gray-600">
                <strong>Lưu ý:</strong> Hệ thống điểm danh theo ngày liên tiếp.
                Thưởng tăng dần từ ngày 1 đến ngày 7. Khi hoàn thành 7 ngày liên
                tiếp sẽ nhận thêm thưởng hoàn thành tuần.
              </div>
            </div>
          </div>
        </div>

        {/* Lucky Wheel Settings */}
        {luckyWheelSettings && (
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 xl:col-span-2">
            <div className="bg-gradient-to-r from-amber-500 to-yellow-500 px-6 py-4 rounded-t-xl">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                    <Zap className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-white">
                      Cài đặt vòng quay may mắn
                    </h2>
                    <p className="text-amber-100 text-sm">
                      Quản lý phần thưởng và tỷ lệ trúng trong vòng quay
                    </p>
                  </div>
                </div>

                <div className="flex gap-3">
                  {hasLuckyWheelChanges && (
                    <button
                      onClick={resetLuckyWheelSettings}
                      className="px-4 py-2 bg-white/20 text-white rounded-lg hover:bg-white/30 transition-colors flex items-center gap-2 backdrop-blur-sm"
                    >
                      <RotateCcw className="h-4 w-4" />
                      Hủy thay đổi
                    </button>
                  )}

                  <button
                    onClick={saveLuckyWheelSettings}
                    disabled={savingLuckyWheel || !hasLuckyWheelChanges}
                    className={`px-6 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors ${
                      hasLuckyWheelChanges && !savingLuckyWheel
                        ? "bg-white text-amber-600 hover:bg-amber-50 shadow-lg"
                        : "bg-white/20 text-white/60 cursor-not-allowed"
                    }`}
                  >
                    {savingLuckyWheel ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current"></div>
                        Đang lưu...
                      </>
                    ) : (
                      <>
                        <Save className="h-4 w-4" />
                        Lưu cài đặt
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>

            <div className="p-6">
              {/* General Settings */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Settings className="h-5 w-5 text-amber-600" />
                  Cài đặt chung
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Chi phí mỗi lượt quay
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        min="1"
                        value={luckyWheelSettings.costPerSpin}
                        onChange={(e) =>
                          handleLuckyWheelSettingChange(
                            "costPerSpin",
                            parseInt(e.target.value) || 50,
                          )
                        }
                        className="block w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                      />
                      <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                        <span className="text-gray-500 text-sm">Points</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Giới hạn quay/ngày
                    </label>
                    <input
                      type="number"
                      min="1"
                      value={luckyWheelSettings.maxSpinsPerDay || 10}
                      onChange={(e) =>
                        handleLuckyWheelSettingChange(
                          "maxSpinsPerDay",
                          parseInt(e.target.value) || 10,
                        )
                      }
                      className="block w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                    />
                  </div>

                  <div className="flex items-center">
                    <div className="flex h-5 items-center">
                      <input
                        type="checkbox"
                        checked={luckyWheelSettings.enabled}
                        onChange={(e) =>
                          handleLuckyWheelSettingChange(
                            "enabled",
                            e.target.checked,
                          )
                        }
                        className="h-4 w-4 text-amber-600 focus:ring-amber-500 border-gray-300 rounded"
                      />
                    </div>
                    <div className="ml-3 text-sm">
                      <label className="font-medium text-gray-700">
                        Kích hoạt vòng quay
                      </label>
                      <p className="text-gray-500">
                        Cho phép người dùng sử dụng
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Prizes Configuration */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Gift className="h-5 w-5 text-amber-600" />
                  Cấu hình phần thưởng
                </h3>

                <div className="space-y-4">
                  {luckyWheelSettings.prizes.map((prize, index) => (
                    <div
                      key={prize.id}
                      className="p-4 border border-gray-200 rounded-lg"
                    >
                      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Tên phần thưởng
                          </label>
                          <input
                            type="text"
                            value={prize.name}
                            onChange={(e) =>
                              handlePrizeChange(index, "name", e.target.value)
                            }
                            className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-sm"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Giá trị Points
                          </label>
                          <input
                            type="number"
                            min="0"
                            value={prize.value}
                            onChange={(e) =>
                              handlePrizeChange(
                                index,
                                "value",
                                parseInt(e.target.value) || 0,
                              )
                            }
                            className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-sm"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Tỷ lệ (%)
                          </label>
                          <input
                            type="number"
                            min="0"
                            max="100"
                            step="0.1"
                            value={prize.probability}
                            onChange={(e) =>
                              handlePrizeChange(
                                index,
                                "probability",
                                parseFloat(e.target.value) || 0,
                              )
                            }
                            className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-sm"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Màu sắc
                          </label>
                          <div className="flex items-center gap-2">
                            <input
                              type="color"
                              value={prize.color}
                              onChange={(e) =>
                                handlePrizeChange(
                                  index,
                                  "color",
                                  e.target.value,
                                )
                              }
                              className="h-8 w-12 border border-gray-300 rounded cursor-pointer"
                            />
                            <input
                              type="text"
                              value={prize.color}
                              onChange={(e) =>
                                handlePrizeChange(
                                  index,
                                  "color",
                                  e.target.value,
                                )
                              }
                              className="block flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-sm"
                            />
                          </div>
                        </div>

                        <div className="flex items-end">
                          <div
                            className="w-12 h-8 rounded border"
                            style={{ backgroundColor: prize.color }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <p className="text-sm text-yellow-800">
                    <strong>Lưu ý:</strong> Tổng tỷ lệ của tất cả phần thưởng
                    phải bằng 100%. Hiện tại:{" "}
                    {luckyWheelSettings.prizes
                      .reduce((sum, p) => sum + p.probability, 0)
                      .toFixed(1)}
                    %
                  </p>
                </div>
              </div>

              {/* Preview */}
              <div className="p-6 bg-amber-50 rounded-lg border border-amber-200">
                <h3 className="text-lg font-semibold text-amber-900 mb-4">
                  Xem trước vòng quay
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-3">
                      Danh sách phần thưởng:
                    </h4>
                    <div className="space-y-2">
                      {luckyWheelSettings.prizes.map((prize, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between py-2 px-3 bg-white rounded border"
                        >
                          <div className="flex items-center gap-3">
                            <div
                              className="w-4 h-4 rounded"
                              style={{ backgroundColor: prize.color }}
                            ></div>
                            <span className="font-medium">{prize.name}</span>
                            <span className="text-sm text-gray-600">
                              ({prize.value} Points)
                            </span>
                          </div>
                          <span className="text-sm font-medium text-amber-600">
                            {prize.probability}%
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-3">
                      Thông tin chung:
                    </h4>
                    <div className="bg-white p-4 rounded border space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Chi phí/lượt:</span>
                        <span className="font-medium">
                          {luckyWheelSettings.costPerSpin} Points
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Giới hạn/ngày:</span>
                        <span className="font-medium">
                          {luckyWheelSettings.maxSpinsPerDay} lượt
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Trạng thái:</span>
                        <span
                          className={`font-medium ${
                            luckyWheelSettings.enabled
                              ? "text-green-600"
                              : "text-red-600"
                          }`}
                        >
                          {luckyWheelSettings.enabled
                            ? "Đang hoạt động"
                            : "Tạm dừng"}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
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

      {/* Milestones Modal */}
      <CommonModal
        isOpen={showMilestoneModal}
        onClose={() => setShowMilestoneModal(false)}
        title="Chỉnh Sửa Mốc Thưởng"
        width="max-w-3xl"
      >
        <div className="space-y-4">
          <div className="max-h-96 overflow-y-auto space-y-3">
            {editingMilestones.map((milestone, index) => (
              <div
                key={index}
                className="p-4 border border-gray-200 rounded-lg bg-gray-50"
              >
                <div className="flex items-start gap-3">
                  <div className="flex-1 grid grid-cols-3 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">
                        Số người
                      </label>
                      <input
                        type="number"
                        min="1"
                        value={milestone.referrals}
                        onChange={(e) =>
                          updateMilestone(
                            index,
                            "referrals",
                            parseInt(e.target.value) || 0,
                          )
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                        placeholder="5"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">
                        Thưởng (VNĐ)
                      </label>
                      <input
                        type="number"
                        min="0"
                        step="1000"
                        value={milestone.reward}
                        onChange={(e) =>
                          updateMilestone(
                            index,
                            "reward",
                            parseInt(e.target.value) || 0,
                          )
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                        placeholder="50000"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">
                        Tiêu đề
                      </label>
                      <input
                        type="text"
                        value={milestone.title}
                        onChange={(e) =>
                          updateMilestone(index, "title", e.target.value)
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                        placeholder="Người mới"
                      />
                    </div>
                  </div>
                  <button
                    onClick={() => removeMilestone(index)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="Xóa"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <button
            onClick={addMilestone}
            className="w-full py-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-orange-500 hover:text-orange-600 transition-colors flex items-center justify-center gap-2 font-semibold"
          >
            <Plus className="w-5 h-5" />
            Thêm Mốc Thưởng
          </button>

          <div className="flex gap-3 pt-4 border-t">
            <button
              onClick={() => setShowMilestoneModal(false)}
              className="flex-1 py-3 border border-gray-300 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
            >
              Hủy
            </button>
            <button
              onClick={saveMilestones}
              className="flex-1 py-3 bg-orange-600 text-white rounded-lg font-semibold hover:bg-orange-700 transition-colors flex items-center justify-center gap-2"
            >
              <Save className="w-4 h-4" />
              Lưu Mốc Thưởng
            </button>
          </div>
        </div>
      </CommonModal>
    </div>
  );
};

export default SystemSettingsPage;
