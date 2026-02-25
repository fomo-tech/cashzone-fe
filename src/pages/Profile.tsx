import React, { useState, useEffect } from "react";
import {
  User,
  Phone,
  Edit2,
  Award,
  Calendar,
  CreditCard,
  Banknote,
  Building2,
  Save,
  X,
  Wallet,
  Loader2,
  Mail,
  Smartphone,
} from "lucide-react";
import profileService from "@/services/profileService";
import type { UserProfile } from "@/services/profileService";
import { notification } from "@/utils/notification";
import { useAuthStore } from "@/store/authStore";
import UserAvatar from "@/components/element/UserAvatar";

// =========================================================================
// CÁC COMPONENT PHỤ
// =========================================================================

// Hàm hiển thị một trường thông tin đơn lẻ
const InfoField: React.FC<{
  icon: React.ReactNode;
  label: string;
  value: string;
  badge?: string;
  iconBgClass: string;
  iconColorClass: string;
}> = ({ icon, label, value, badge, iconBgClass, iconColorClass }) => (
  <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl">
    <div
      className={`flex items-center justify-center w-10 h-10 rounded-xl ${iconBgClass} ${iconColorClass}`}
    >
      {icon}
    </div>
    <div className="flex-1">
      <p className="text-xs text-slate-500 font-bold">{label}</p>
      <div className="flex items-center gap-2">
        <p className="text-slate-800 font-bold line-clamp-1 break-all">
          {value || "Chưa cập nhật"}
        </p>
        {badge && (
          <span className="px-2 py-0.5 bg-orange-100 text-orange-700 text-xs font-bold rounded-full shrink-0">
            {badge}
          </span>
        )}
      </div>
    </div>
  </div>
);

// =========================================================================
// MAIN PAGE COMPONENT
// =========================================================================

const ProfilePage: React.FC = () => {
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [isEditingBank, setIsEditingBank] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);

  // Get user and setUser from authStore
  const { user, setUser } = useAuthStore();

  // Form states
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
  });

  // Banking form state
  const [bankingData, setBankingData] = useState({
    bankName: "",
    accountNumber: "",
    accountName: "",
  });

  // BEP20 form state
  const [bep20Data, setBep20Data] = useState({
    address: "",
  });

  // Momo form state
  const [momoData, setMomoData] = useState({
    phoneNumber: "",
    accountName: "",
  });

  // NEW STATE: Quản lý tab thanh toán đang hoạt động
  const [activePaymentTab, setActivePaymentTab] = useState<
    "banking" | "bep20" | "momo"
  >("banking");

  // Load profile from authStore (already fetched by useAuthInit)
  useEffect(() => {
    const loadProfile = () => {
      try {
        setLoading(true);
        const profile = user; // Get from authStore instead of API call
        console.log("🔍 [Profile] Loading profile from authStore:", profile);
        console.log("🔍 [Profile] Payment Info:", profile?.paymentInfo);

        if (profile) {
          setUserProfile(profile);
          setFormData({
            name: profile.name || "",
            phone: profile.phone || "",
            email: profile.email || "",
          });

          // Load banking info if exists
          if (profile.paymentInfo?.bankInfo) {
            const bankData = {
              bankName: profile.paymentInfo.bankInfo.bankName || "",
              accountNumber: profile.paymentInfo.bankInfo.accountNumber || "",
              accountName: profile.paymentInfo.bankInfo.accountName || "",
            };
            console.log("💳 [Profile] Loading banking data:", bankData);
            setBankingData(bankData);
          } else {
            console.log("⚠️ [Profile] No banking info found");
          }

          // Load BEP20 address if exists
          if (profile.paymentInfo?.bep20Info?.walletAddress) {
            const bep20 = {
              address: profile.paymentInfo.bep20Info.walletAddress,
            };
            console.log("💰 [Profile] Loading BEP20 data:", bep20);
            setBep20Data(bep20);
          } else {
            console.log("⚠️ [Profile] No BEP20 info found");
          }

          // Load Momo info if exists
          if (profile.paymentInfo?.momoInfo) {
            const momo = {
              phoneNumber: profile.paymentInfo.momoInfo.phoneNumber || "",
              accountName: profile.paymentInfo.momoInfo.accountName || "",
            };
            console.log("📱 [Profile] Loading Momo data:", momo);
            setMomoData(momo);
          } else {
            console.log("⚠️ [Profile] No Momo info found");
          }
        }
      } catch (error: any) {
        console.error("Error loading profile:", error);
        notification({
          message: "Không thể tải thông tin profile",
          type: "error",
        });
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, [user]); // Re-load when user data changes in authStore

  // Handlers cho Personal Info
  const handleEditProfile = () => setIsEditingProfile(true);
  const handleCancelProfile = () => {
    setIsEditingProfile(false);
    // Reset form data
    if (userProfile) {
      setFormData({
        name: userProfile.name || "",
        phone: userProfile.phone || "",
        email: userProfile.email || "",
      });
    }
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setSaving(true);
      const updatedProfile = await profileService.updateProfile({
        name: formData.name,
        phone: formData.phone,
      });

      setUserProfile(updatedProfile);
      setUser(updatedProfile); // Update authStore to keep data in sync
      setIsEditingProfile(false);

      notification({
        message: "Đã lưu thông tin cá nhân thành công!",
        type: "success",
      });
    } catch (error: any) {
      console.error("Error updating profile:", error);
      notification({
        message:
          error?.response?.data?.message ||
          "Có lỗi xảy ra khi cập nhật thông tin",
        type: "error",
      });
    } finally {
      setSaving(false);
    }
  };

  // Handlers cho Bank/BEP20 Info
  const handleEditBank = () => setIsEditingBank(true);
  const handleCancelBank = () => {
    setIsEditingBank(false);
    // Reset banking form data
    if (userProfile?.paymentInfo?.bankInfo) {
      setBankingData({
        bankName: userProfile.paymentInfo.bankInfo.bankName || "",
        accountNumber: userProfile.paymentInfo.bankInfo.accountNumber || "",
        accountName: userProfile.paymentInfo.bankInfo.accountName || "",
      });
    } else {
      setBankingData({ bankName: "", accountNumber: "", accountName: "" });
    }

    // Reset BEP20 form data
    if (userProfile?.paymentInfo?.bep20Info?.walletAddress) {
      setBep20Data({
        address: userProfile.paymentInfo.bep20Info.walletAddress,
      });
    } else {
      setBep20Data({ address: "" });
    }

    // Reset Momo form data
    if (userProfile?.paymentInfo?.momoInfo) {
      setMomoData({
        phoneNumber: userProfile.paymentInfo.momoInfo.phoneNumber || "",
        accountName: userProfile.paymentInfo.momoInfo.accountName || "",
      });
    } else {
      setMomoData({ phoneNumber: "", accountName: "" });
    }
  };

  // Logic lưu thông tin Ngân hàng
  const handleSaveBanking = async () => {
    try {
      setSaving(true);
      console.log("💾 [Profile] Saving banking info:", bankingData);

      const updatedProfile = await profileService.updateBankingInfo({
        bankName: bankingData.bankName,
        accountNumber: bankingData.accountNumber,
        accountName: bankingData.accountName,
      });

      console.log(
        "✅ [Profile] Banking info saved. Updated profile:",
        updatedProfile,
      );
      console.log(
        "✅ [Profile] Updated payment info:",
        updatedProfile.paymentInfo,
      );

      setUserProfile(updatedProfile);
      setUser(updatedProfile); // Update authStore to keep data in sync
      setIsEditingBank(false);

      notification({
        message: "Đã lưu thông tin ngân hàng thành công!",
        type: "success",
      });
    } catch (error: any) {
      console.error("Error updating banking info:", error);
      notification({
        message:
          error?.response?.data?.message ||
          "Có lỗi xảy ra khi cập nhật thông tin ngân hàng",
        type: "error",
      });
    } finally {
      setSaving(false);
    }
  };

  // Logic lưu thông tin BEP20
  const handleSaveBEP20 = async () => {
    try {
      setSaving(true);
      console.log("💾 [Profile] Saving BEP20 address:", bep20Data.address);

      const updatedProfile = await profileService.updateBEP20Address(
        bep20Data.address,
      );

      console.log(
        "✅ [Profile] BEP20 address saved. Updated profile:",
        updatedProfile,
      );
      console.log(
        "✅ [Profile] Updated payment info:",
        updatedProfile.paymentInfo,
      );

      setUserProfile(updatedProfile);
      setUser(updatedProfile); // Update authStore to keep data in sync
      setIsEditingBank(false);

      notification({
        message: "Đã lưu địa chỉ BEP20 thành công!",
        type: "success",
      });
    } catch (error: any) {
      console.error("Error updating BEP20 address:", error);
      notification({
        message:
          error?.response?.data?.message ||
          "Có lỗi xảy ra khi cập nhật địa chỉ BEP20",
        type: "error",
      });
    } finally {
      setSaving(false);
    }
  };

  // Logic lưu thông tin Momo
  const handleSaveMomo = async () => {
    try {
      setSaving(true);
      console.log("💾 [Profile] Saving Momo info:", momoData);

      const updatedProfile = await profileService.updateMomoInfo({
        phoneNumber: momoData.phoneNumber,
        accountName: momoData.accountName,
      });

      console.log(
        "✅ [Profile] Momo info saved. Updated profile:",
        updatedProfile,
      );
      console.log(
        "✅ [Profile] Updated payment info:",
        updatedProfile.paymentInfo,
      );

      setUserProfile(updatedProfile);
      setUser(updatedProfile); // Update authStore to keep data in sync
      setIsEditingBank(false);

      notification({
        message: "Đã lưu thông tin Momo thành công!",
        type: "success",
      });
    } catch (error: any) {
      console.error("Error updating Momo info:", error);
      notification({
        message:
          error?.response?.data?.message ||
          "Có lỗi xảy ra khi cập nhật thông tin Momo",
        type: "error",
      });
    } finally {
      setSaving(false);
    }
  };

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <Loader2
            size={48}
            className="animate-spin text-[orange-600] mx-auto mb-4"
          />
          <p className="text-gray-600 font-bold">Đang tải thông tin...</p>
        </div>
      </div>
    );
  }

  if (!userProfile) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 font-bold">
            Không thể tải thông tin profile
          </p>
        </div>
      </div>
    );
  }

  // Kiểm tra xem tab Banking đã có dữ liệu chưa
  const hasBankingInfo = !!(
    userProfile?.paymentInfo?.bankInfo?.bankName &&
    userProfile?.paymentInfo?.bankInfo?.accountNumber
  );
  // Kiểm tra xem tab BEP20 đã có dữ liệu chưa
  const hasBEP20Info = !!userProfile?.paymentInfo?.bep20Info?.walletAddress;
  // Kiểm tra xem tab Momo đã có dữ liệu chưa
  const hasMomoInfo = !!(
    userProfile?.paymentInfo?.momoInfo?.phoneNumber &&
    userProfile?.paymentInfo?.momoInfo?.accountName
  );

  // Debug logging for payment info
  console.log(
    "🔍 [Profile Render] hasBankingInfo:",
    hasBankingInfo,
    "hasBEP20Info:",
    hasBEP20Info,
    "hasMomoInfo:",
    hasMomoInfo,
  );
  console.log(
    "🔍 [Profile Render] userProfile.paymentInfo:",
    userProfile?.paymentInfo,
  );

  // =========================================================================
  // RENDER SECTIONS
  // =========================================================================

  // --- 1. Rendering Tab Thanh Toán: Hiển Thị ---
  const renderPaymentDisplayMode = () => {
    if (activePaymentTab === "banking") {
      if (hasBankingInfo) {
        return (
          <div className="space-y-4">
            <InfoField
              icon={<Building2 className="w-5 h-5" />}
              label="Tên Ngân Hàng"
              value={
                userProfile?.paymentInfo?.bankInfo?.bankName || "Chưa cập nhật"
              }
              iconBgClass="bg-purple-100"
              iconColorClass="text-purple-600"
            />
            <InfoField
              icon={<CreditCard className="w-5 h-5" />}
              label="Số Tài Khoản"
              value={
                userProfile?.paymentInfo?.bankInfo?.accountNumber ||
                "Chưa cập nhật"
              }
              iconBgClass="bg-orange-100"
              iconColorClass="text-orange-600"
            />
            <InfoField
              icon={<User className="w-5 h-5" />}
              label="Tên Chủ Tài Khoản"
              value={
                userProfile?.paymentInfo?.bankInfo?.accountName ||
                "Chưa cập nhật"
              }
              iconBgClass="bg-orange-100"
              iconColorClass="text-[orange-600]"
            />
          </div>
        );
      }
    } else if (activePaymentTab === "bep20") {
      // BEP20 Tab
      if (hasBEP20Info) {
        return (
          <div className="space-y-4">
            <InfoField
              icon={<Wallet className="w-5 h-5" />}
              label="Địa chỉ BEP20 (Binance Smart Chain)"
              value={
                userProfile?.paymentInfo?.bep20Info?.walletAddress ||
                "Chưa cập nhật"
              }
              iconBgClass="bg-indigo-100"
              iconColorClass="text-indigo-600"
            />
            <p className="text-xs text-slate-500 bg-slate-50 p-3 rounded-lg border border-slate-200">
              <span className="font-semibold">Network:</span>{" "}
              {userProfile?.paymentInfo?.bep20Info?.network || "BSC"}
            </p>
          </div>
        );
      }
    } else if (activePaymentTab === "momo") {
      // Momo Tab
      if (hasMomoInfo) {
        return (
          <div className="space-y-4">
            <InfoField
              icon={<Smartphone className="w-5 h-5" />}
              label="Số Điện Thoại Momo"
              value={
                userProfile?.paymentInfo?.momoInfo?.phoneNumber ||
                "Chưa cập nhật"
              }
              iconBgClass="bg-pink-100"
              iconColorClass="text-pink-600"
            />
            <InfoField
              icon={<User className="w-5 h-5" />}
              label="Tên Chủ Tài Khoản"
              value={
                userProfile?.paymentInfo?.momoInfo?.accountName ||
                "Chưa cập nhật"
              }
              iconBgClass="bg-pink-100"
              iconColorClass="text-pink-600"
            />
          </div>
        );
      }
    }

    // Trường hợp không có dữ liệu
    const getEmptyIcon = () => {
      if (activePaymentTab === "banking")
        return <Banknote className="w-8 h-8 text-slate-500" />;
      if (activePaymentTab === "bep20")
        return <Wallet className="w-8 h-8 text-slate-500" />;
      return <Smartphone className="w-8 h-8 text-slate-500" />;
    };

    const getEmptyLabel = () => {
      if (activePaymentTab === "banking") return "Ngân hàng";
      if (activePaymentTab === "bep20") return "BEP20";
      return "Momo";
    };

    return (
      <div className="text-center py-8 bg-slate-50 rounded-xl border border-dashed border-slate-200">
        <div className="flex items-center justify-center w-16 h-16 bg-slate-200 rounded-full mx-auto mb-3">
          {getEmptyIcon()}
        </div>
        <p className="text-slate-500 font-bold">
          Chưa có thông tin {getEmptyLabel()}
        </p>
        <p className="text-sm text-slate-400 mt-1">
          Nhấp "Chỉnh sửa" để thêm thông tin
        </p>
      </div>
    );
  };

  // --- 2. Rendering Tab Thanh Toán: Chỉnh Sửa ---
  const renderPaymentEditMode = () => {
    // A. Chế độ chỉnh sửa Banking
    if (activePaymentTab === "banking") {
      return (
        <form
          id="bankEditMode"
          className="space-y-4"
          onSubmit={(e) => {
            e.preventDefault();
            handleSaveBanking();
          }}
        >
          <div className="grid grid-cols-1 gap-4">
            {/* Input Tên Ngân Hàng */}
            <div>
              <label
                htmlFor="bankName"
                className="block text-sm font-bold text-slate-700 mb-1"
              >
                Tên Ngân Hàng
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Building2 className="w-4 h-4 text-slate-400" />
                </div>
                <input
                  type="text"
                  id="bankName"
                  value={bankingData.bankName}
                  onChange={(e) =>
                    setBankingData({ ...bankingData, bankName: e.target.value })
                  }
                  className="block w-full pl-10 pr-3 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[orange-600] focus:border-[orange-600] shadow-sm"
                  placeholder="VD: Vietcombank, Techcombank..."
                  required
                />
              </div>
            </div>

            {/* Input Số Tài Khoản */}
            <div>
              <label
                htmlFor="accountNumber"
                className="block text-sm font-bold text-slate-700 mb-1"
              >
                Số Tài Khoản
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <CreditCard className="w-4 h-4 text-slate-400" />
                </div>
                <input
                  type="text"
                  id="accountNumber"
                  value={bankingData.accountNumber}
                  onChange={(e) =>
                    setBankingData({
                      ...bankingData,
                      accountNumber: e.target.value,
                    })
                  }
                  className="block w-full pl-10 pr-3 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[orange-600] focus:border-[orange-600] shadow-sm"
                  placeholder="Nhập số tài khoản"
                  required
                />
              </div>
            </div>

            {/* Input Tên Chủ Tài Khoản */}
            <div>
              <label
                htmlFor="accountName"
                className="block text-sm font-bold text-slate-700 mb-1"
              >
                Tên Chủ Tài Khoản
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="w-4 h-4 text-slate-400" />
                </div>
                <input
                  type="text"
                  id="accountName"
                  value={bankingData.accountName}
                  onChange={(e) =>
                    setBankingData({
                      ...bankingData,
                      accountName: e.target.value,
                    })
                  }
                  className="block w-full pl-10 pr-3 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[orange-600] focus:border-[orange-600] shadow-sm"
                  placeholder="NGUYEN VAN A"
                  required
                />
              </div>
            </div>

            {/* Buttons */}
            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={handleCancelBank}
                disabled={saving}
                className="flex items-center px-6 py-2.5 border border-slate-300 text-slate-700 rounded-xl font-semibold hover:bg-slate-50 transition-colors cursor-pointer disabled:opacity-50"
              >
                <X className="w-4 h-4 mr-1" />
                Hủy
              </button>
              <button
                type="submit"
                disabled={saving}
                className="flex items-center px-6 py-2.5 bg-gradient-to-br from-orange-500 via-orange-600 to-amber-600 text-white rounded-xl font-semibold hover:from-orange-600 hover:to-amber-700 transition-colors shadow-lg shadow-orange-500/30 cursor-pointer disabled:opacity-50"
              >
                {saving ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Đang lưu...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    Lưu Ngân Hàng
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      );
    }
    // B. Chế độ chỉnh sửa BEP20
    else if (activePaymentTab === "bep20") {
      return (
        <form
          id="bep20EditMode"
          className="space-y-4"
          onSubmit={(e) => {
            e.preventDefault();
            handleSaveBEP20();
          }}
        >
          <div className="grid grid-cols-1 gap-4">
            {/* Input Địa chỉ BEP20 */}
            <div>
              <label
                htmlFor="bep20Address"
                className="block text-sm font-bold text-slate-700 mb-1"
              >
                Địa chỉ BEP20 (Binance Smart Chain)
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Wallet className="w-4 h-4 text-slate-400" />
                </div>
                <input
                  type="text"
                  id="bep20Address"
                  value={bep20Data.address}
                  onChange={(e) => setBep20Data({ address: e.target.value })}
                  className="block w-full pl-10 pr-3 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[orange-600] focus:border-[orange-600] shadow-sm"
                  placeholder="Nhập địa chỉ ví BEP20 của bạn"
                  required
                />
              </div>
              <p className="text-xs text-red-500 mt-1">
                * Vui lòng kiểm tra kỹ địa chỉ. Tiền sẽ bị mất nếu nhập sai!
              </p>
            </div>

            {/* Buttons */}
            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={handleCancelBank}
                disabled={saving}
                className="flex items-center px-6 py-2.5 border border-slate-300 text-slate-700 rounded-xl font-semibold hover:bg-slate-50 transition-colors cursor-pointer disabled:opacity-50"
              >
                <X className="w-4 h-4 mr-1" />
                Hủy
              </button>
              <button
                type="submit"
                disabled={saving}
                className="flex items-center px-6 py-2.5 bg-gradient-to-br from-orange-500 via-orange-600 to-amber-600 text-white rounded-xl font-semibold hover:from-orange-600 hover:to-amber-700 transition-colors shadow-lg shadow-orange-500/30 cursor-pointer disabled:opacity-50"
              >
                {saving ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Đang lưu...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    Lưu Địa Chỉ Ví
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      );
    }
    // C. Chế độ chỉnh sửa Momo
    else {
      return (
        <form
          id="momoEditMode"
          className="space-y-4"
          onSubmit={(e) => {
            e.preventDefault();
            handleSaveMomo();
          }}
        >
          <div className="grid grid-cols-1 gap-4">
            {/* Input Số Điện Thoại Momo */}
            <div>
              <label
                htmlFor="momoPhone"
                className="block text-sm font-bold text-slate-700 mb-1"
              >
                Số Điện Thoại Momo
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Smartphone className="w-4 h-4 text-slate-400" />
                </div>
                <input
                  type="tel"
                  id="momoPhone"
                  value={momoData.phoneNumber}
                  onChange={(e) =>
                    setMomoData({ ...momoData, phoneNumber: e.target.value })
                  }
                  className="block w-full pl-10 pr-3 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[orange-600] focus:border-[orange-600] shadow-sm"
                  placeholder="0901234567"
                  required
                />
              </div>
            </div>

            {/* Input Tên Chủ Tài Khoản Momo */}
            <div>
              <label
                htmlFor="momoAccountName"
                className="block text-sm font-bold text-slate-700 mb-1"
              >
                Tên Chủ Tài Khoản
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="w-4 h-4 text-slate-400" />
                </div>
                <input
                  type="text"
                  id="momoAccountName"
                  value={momoData.accountName}
                  onChange={(e) =>
                    setMomoData({ ...momoData, accountName: e.target.value })
                  }
                  className="block w-full pl-10 pr-3 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[orange-600] focus:border-[orange-600] shadow-sm"
                  placeholder="NGUYEN VAN A"
                  required
                />
              </div>
            </div>

            {/* Buttons */}
            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={handleCancelBank}
                disabled={saving}
                className="flex items-center px-6 py-2.5 border border-slate-300 text-slate-700 rounded-xl font-semibold hover:bg-slate-50 transition-colors cursor-pointer disabled:opacity-50"
              >
                <X className="w-4 h-4 mr-1" />
                Hủy
              </button>
              <button
                type="submit"
                disabled={saving}
                className="flex items-center px-6 py-2.5 bg-gradient-to-br from-orange-500 via-orange-600 to-amber-600 text-white rounded-xl font-semibold hover:from-orange-600 hover:to-amber-700 transition-colors shadow-lg shadow-orange-500/30 cursor-pointer disabled:opacity-50"
              >
                {saving ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Đang lưu...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    Lưu Momo
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      );
    }
  };

  return (
    <div className="min-h-screen py-10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl  text-slate-800 mb-8">Hồ Sơ Của Tôi</h2>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          {/* Cột 1: Profile Card */}
          <div className="md:col-span-1">
            <div className="bg-white rounded-2xl shadow-xl border border-slate-100 p-6 text-center sticky md:top-8">
              <div className="relative inline-block mb-4">
                <UserAvatar
                  name={userProfile.name || userProfile.email}
                  src={userProfile.avatar}
                  size="128"
                />
                <div className="absolute bottom-0 right-0 bg-green-500 w-6 h-6 rounded-full border-2 border-white flex items-center justify-center">
                  {/* Trạng thái online */}
                </div>
              </div>
              <h3
                id="displayName"
                className="text-xl font-bold text-slate-800 mb-1"
              >
                {userProfile.name || "Chưa cập nhật tên"}
              </h3>
              <p className="text-slate-500 text-sm mb-4">{userProfile.email}</p>

              {/* Rank Badge */}
              <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-amber-100 text-amber-700 text-sm font-semibold mb-6 shadow-sm">
                <Award className="w-4 h-4 mr-2 fill-amber-300 stroke-amber-700" />
                {userProfile.roles?.[0] || "USER"}
              </div>

              {/* Thông tin thêm */}
              <div className="border-t border-slate-100 pt-6 text-left">
                <div className="flex items-center gap-3">
                  <Calendar className="w-5 h-5 text-indigo-500 shrink-0" />
                  <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase mb-0.5">
                      Ngày tham gia
                    </label>
                    <p className="text-slate-700 font-bold text-sm">
                      {userProfile.createdAt
                        ? new Date(userProfile.createdAt).toLocaleDateString(
                            "vi-VN",
                          )
                        : "N/A"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Balance Section */}
              <div className="mt-6 pt-6 border-t border-slate-100">
                <div className="bg-orange-50 rounded-xl p-4 border border-orange-100">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-slate-600 font-bold">
                      Số dư
                    </span>
                    <Wallet className="w-5 h-5 text-[orange-600]" />
                  </div>
                  <p className="text-2xl font-black bg-gradient-to-br from-orange-500 via-orange-600 to-amber-600 bg-clip-text text-transparent">
                    {new Intl.NumberFormat("vi-VN", {
                      style: "currency",
                      currency: "VND",
                      minimumFractionDigits: 0,
                    })
                      .format(userProfile.wallet?.available || 0)
                      .replace("₫", " VNĐ")}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Cột 2: Edit Info & Transaction History */}
          <div className="md:col-span-2 space-y-8">
            {/* 1. Thông Tin Cá Nhân (Giữ nguyên) */}
            <div className="bg-white rounded-2xl shadow-xl border border-slate-100 p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-slate-800">
                  Thông Tin Cá Nhân
                </h3>
                <button
                  type="button"
                  onClick={handleEditProfile}
                  className={`px-4 py-2 text-[orange-600] hover:bg-orange-50 rounded-xl font-bold transition-colors flex items-center gap-2 cursor-pointer ${
                    isEditingProfile ? "hidden" : ""
                  }`}
                >
                  <Edit2 className="w-4 h-4" />
                  Chỉnh sửa
                </button>
              </div>

              {/* Chế độ Xem */}
              {!isEditingProfile && (
                <div id="profileDisplayMode" className="space-y-4">
                  <InfoField
                    icon={<User className="w-5 h-5" />}
                    label="Họ và Tên"
                    value={userProfile.name || "Chưa cập nhật"}
                    iconBgClass="bg-orange-100"
                    iconColorClass="text-[orange-600]"
                  />
                  <InfoField
                    icon={<Mail className="w-5 h-5" />}
                    label="Email"
                    value={userProfile.email}
                    iconBgClass="bg-blue-100"
                    iconColorClass="text-blue-600"
                  />
                  <InfoField
                    icon={<Phone className="w-5 h-5" />}
                    label="Số Điện Thoại"
                    value={userProfile.phone || "Chưa cập nhật"}
                    badge={userProfile.phone ? "Momo" : undefined}
                    iconBgClass="bg-orange-100"
                    iconColorClass="text-[orange-600]"
                  />
                </div>
              )}

              {/* Chế độ Chỉnh sửa */}
              {isEditingProfile && (
                <form
                  id="profileEditMode"
                  className="space-y-4"
                  onSubmit={handleSaveProfile}
                >
                  <div className="grid grid-cols-1 gap-4">
                    {/* Input Họ và Tên */}
                    <div>
                      <label
                        htmlFor="userName"
                        className="block text-sm font-bold text-slate-700 mb-1"
                      >
                        Họ và Tên
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <User className="w-4 h-4 text-slate-400" />
                        </div>
                        <input
                          type="text"
                          id="userName"
                          value={formData.name}
                          onChange={(e) =>
                            setFormData({ ...formData, name: e.target.value })
                          }
                          className="block w-full pl-10 pr-3 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[orange-600] focus:border-[orange-600] shadow-sm"
                          placeholder="Nhập họ và tên"
                        />
                      </div>
                    </div>

                    {/* Input Email (Read-only) */}
                    <div>
                      <label
                        htmlFor="userEmail"
                        className="block text-sm font-bold text-slate-700 mb-1"
                      >
                        Email
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Mail className="w-4 h-4 text-slate-400" />
                        </div>
                        <input
                          type="email"
                          id="userEmail"
                          value={formData.email}
                          disabled
                          className="block w-full pl-10 pr-3 py-2.5 border border-slate-200 rounded-xl bg-gray-100 cursor-not-allowed shadow-sm"
                        />
                      </div>
                      <p className="text-xs text-slate-500 mt-1">
                        Email không thể thay đổi
                      </p>
                    </div>

                    {/* Input Số Điện Thoại */}
                    <div>
                      <label
                        htmlFor="phoneNumber"
                        className="block text-sm font-bold text-slate-700 mb-1"
                      >
                        Số Điện Thoại
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Phone className="w-4 h-4 text-slate-400" />
                        </div>
                        <input
                          type="tel"
                          id="phoneNumber"
                          value={formData.phone}
                          onChange={(e) =>
                            setFormData({ ...formData, phone: e.target.value })
                          }
                          className="block w-full pl-10 pr-3 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[orange-600] focus:border-[orange-600] shadow-sm"
                          placeholder="Nhập số điện thoại"
                        />
                      </div>
                      <p className="text-xs text-orange-600 mt-1">
                        * Số điện thoại này cũng được dùng làm số Momo
                      </p>
                    </div>

                    {/* Buttons */}
                    <div className="flex justify-end gap-3 pt-2">
                      <button
                        type="button"
                        onClick={handleCancelProfile}
                        disabled={saving}
                        className="flex items-center px-6 py-2.5 border border-slate-300 text-slate-700 rounded-xl font-semibold hover:bg-slate-50 transition-colors disabled:opacity-50 cursor-pointer"
                      >
                        <X className="w-4 h-4 mr-1" />
                        Hủy
                      </button>
                      <button
                        type="submit"
                        disabled={saving}
                        className="flex items-center px-6 py-2.5 bg-gradient-to-br from-orange-500 via-orange-600 to-amber-600 text-white rounded-xl font-semibold hover:from-orange-600 hover:to-amber-700 transition-colors shadow-lg shadow-orange-500/30 disabled:opacity-50 cursor-pointer"
                      >
                        {saving ? (
                          <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Đang lưu...
                          </>
                        ) : (
                          <>
                            <Save className="w-4 h-4 mr-2" />
                            Lưu Thay Đổi
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </form>
              )}
            </div>

            {/* 2. Thông Tin Thanh Toán (Banking & BEP20) */}
            <div className="bg-white rounded-2xl shadow-xl border border-slate-100 p-6">
              <div className="sm:flex justify-between items-center mb-6">
                <div>
                  <h3 className="text-xl font-bold text-slate-800">
                    Thông Tin Thanh Toán
                  </h3>
                  <p className="text-sm text-slate-500">
                    Cập nhật để rút tiền / hoàn tiền
                  </p>
                </div>
                {/* Nút Chỉnh sửa chỉ hiển thị khi không ở chế độ chỉnh sửa */}
                <button
                  type="button"
                  onClick={handleEditBank}
                  className={`px-4 py-2 text-[orange-600] hover:bg-orange-50 rounded-xl font-bold transition-colors flex items-center gap-2 cursor-pointer ${
                    isEditingBank ? "hidden" : ""
                  }`}
                >
                  <Edit2 className="w-4 h-4" />
                  Chỉnh sửa
                </button>
              </div>

              {/* Tab Selector */}
              <div
                className={`flex gap-3 mb-6 flex-wrap ${
                  isEditingBank ? "pointer-events-none opacity-50" : ""
                }`}
              >
                {/* Banking Tab - Luôn hiển thị */}
                <button
                  onClick={() => setActivePaymentTab("banking")}
                  className={`px-4 py-2 rounded-full text-sm font-semibold transition-all flex items-center cursor-pointer ${
                    activePaymentTab === "banking"
                      ? "bg-gradient-to-br from-orange-500 via-orange-600 to-amber-600 text-white shadow-md shadow-orange-500/30"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  <Banknote className="w-4 h-4 mr-2" />
                  Banking
                  {hasBankingInfo && activePaymentTab !== "banking" && (
                    <span className="ml-2 w-2 h-2 bg-green-500 rounded-full"></span>
                  )}
                </button>

                {/* Momo Tab - Luôn hiển thị */}
                <button
                  onClick={() => setActivePaymentTab("momo")}
                  className={`px-4 py-2 rounded-full text-sm font-semibold transition-all flex items-center cursor-pointer ${
                    activePaymentTab === "momo"
                      ? "bg-gradient-to-br from-orange-500 via-orange-600 to-amber-600 text-white shadow-md shadow-orange-500/30"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  <Smartphone className="w-4 h-4 mr-2" />
                  Momo
                  {hasMomoInfo && activePaymentTab !== "momo" && (
                    <span className="ml-2 w-2 h-2 bg-green-500 rounded-full"></span>
                  )}
                </button>

                {/* BEP20 Tab - Luôn hiển thị */}
                {/* <button
                  onClick={() => setActivePaymentTab("bep20")}
                  className={`px-4 py-2 rounded-full text-sm font-semibold transition-all flex items-center cursor-pointer ${
                    activePaymentTab === "bep20"
                      ? "bg-gradient-to-br from-orange-500 via-orange-600 to-amber-600 text-white shadow-md shadow-orange-500/30"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  <Wallet className="w-4 h-4 mr-2" />
                  BEP20
                  {hasBEP20Info && activePaymentTab !== "bep20" && (
                    <span className="ml-2 w-2 h-2 bg-green-500 rounded-full"></span>
                  )}
                </button> */}
              </div>

              {/* Nội dung Hiển thị / Chỉnh sửa */}
              {isEditingBank
                ? renderPaymentEditMode()
                : renderPaymentDisplayMode()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
