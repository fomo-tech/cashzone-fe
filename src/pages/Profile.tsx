import React, { useState } from "react";
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
  ArrowUpRight, // Icon cho giao dịch vào (Nạp/Hoàn)
  ArrowDownLeft, // Icon cho giao dịch ra (Rút)
  ListOrdered, // Icon cho Lịch sử
} from "lucide-react";

// =========================================================================
// DỮ LIỆU MẪU (SAMPLE DATA)
// =========================================================================

const USER_PROFILE_DATA = {
  displayName: "Lộc Nguyễn",
  email: "nguyenloc.freelance@gmail.com",
  avatarUrl:
    "https://lh3.googleusercontent.com/a/ACg8ocIR2oy7cErlIuyQIaRHjKOPnszAhlyuKPxLu194yLTrnfs_dMs=s96-c",
  rank: "ĐỒNG",
  joinDate: "4/12/2025",
  phoneNumber: "0987654321",
  bank: {
    bankName: "Vietcombank",
    accountNumber: "00110022334455",
    accountName: "NGUYEN VAN A",
  },
  bep20Address: "0x39E92aA8F4F8B70b5c1E62F162A4895C9c1E33C6",
};

// DỮ LIỆU LỊCH SỬ GIAO DỊCH (Transaction History Data - Tông Xanh Lá)
const TRANSACTION_HISTORY_DATA = [
  {
    id: 1,
    type: "Nạp Tiền",
    amount: "+ 500,000đ",
    status: "Thành công",
    date: "01/12/2025",
    icon: ArrowUpRight,
    color: "text-green-700",
    bg: "bg-green-200",
  },
  {
    id: 2,
    type: "Rút Tiền",
    amount: "- 250,000đ",
    status: "Đang xử lý",
    date: "29/11/2025",
    icon: ArrowDownLeft,
    color: "text-amber-700",
    bg: "bg-amber-200",
  },
  {
    id: 3,
    type: "Hoàn Tiền",
    amount: "+ 50,000đ",
    status: "Thành công",
    date: "25/11/2025",
    icon: ArrowUpRight,
    color: "text-green-700",
    bg: "bg-green-200",
  },
  {
    id: 4,
    type: "Rút Tiền",
    amount: "- 100,000đ",
    status: "Đã hủy",
    date: "20/11/2025",
    icon: ArrowDownLeft,
    color: "text-red-700",
    bg: "bg-red-200",
  },
  {
    id: 5,
    type: "Nạp Tiền",
    amount: "+ 1,500,000đ",
    status: "Thành công",
    date: "15/11/2025",
    icon: ArrowUpRight,
    color: "text-green-700",
    bg: "bg-green-200",
  },
];

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
      className={`flex items-center justify-center w-10 h-10 rounded-xl ${iconBgClass}`}
    >
      {React.cloneElement(icon as React.ReactElement, {
        className: `w-5 h-5 ${iconColorClass}`,
      })}
    </div>
    <div className="flex-1">
      <p className="text-xs text-slate-500 font-medium">{label}</p>
      <div className="flex items-center gap-2">
        <p className="text-slate-800 font-medium line-clamp-1 break-all">
          {value || "Chưa cập nhật"}
        </p>
        {badge && (
          <span className="px-2 py-0.5 bg-pink-100 text-pink-700 text-xs font-medium rounded-full shrink-0">
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
  const [profileData, setProfileData] = useState(USER_PROFILE_DATA);
  // NEW STATE: Quản lý tab thanh toán đang hoạt động
  const [activePaymentTab, setActivePaymentTab] = useState<"banking" | "bep20">(
    "banking"
  );

  // Handlers cho Personal Info (Giữ nguyên)
  const handleEditProfile = () => setIsEditingProfile(true);
  const handleCancelProfile = () => setIsEditingProfile(false);
  const handleSaveProfile = () => {
    // Logic lưu thông tin profile thực tế sẽ ở đây
    alert("Đã lưu thông tin cá nhân! (Mô phỏng)");
    setIsEditingProfile(false);
  };

  // Handlers cho Bank/BEP20 Info
  const handleEditBank = () => setIsEditingBank(true);
  const handleCancelBank = () => setIsEditingBank(false);

  // Logic lưu thông tin Ngân hàng
  const handleSaveBanking = () => {
    // Logic lưu Ngân hàng thực tế sẽ ở đây
    alert("Đã lưu thông tin Ngân hàng! (Mô phỏng)");
    setIsEditingBank(false);
  };

  // Logic lưu thông tin BEP20
  const handleSaveBEP20 = () => {
    // Logic lưu BEP20 thực tế sẽ ở đây
    alert("Đã lưu địa chỉ BEP20! (Mô phỏng)");
    setIsEditingBank(false);
  };

  // Kiểm tra xem tab Banking đã có dữ liệu chưa
  const hasBankingInfo =
    !!profileData.bank.bankName && !!profileData.bank.accountNumber;
  // Kiểm tra xem tab BEP20 đã có dữ liệu chưa
  const hasBEP20Info = !!profileData.bep20Address;

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
              icon={<Building2 />}
              label="Tên Ngân Hàng"
              value={profileData.bank.bankName}
              iconBgClass="bg-purple-100"
              iconColorClass="text-purple-600"
            />
            <InfoField
              icon={<CreditCard />}
              label="Số Tài Khoản"
              value={profileData.bank.accountNumber}
              iconBgClass="bg-orange-100"
              iconColorClass="text-orange-600"
            />
            <InfoField
              icon={<User />}
              label="Tên Chủ Tài Khoản"
              value={profileData.bank.accountName}
              iconBgClass="bg-blue-100"
              iconColorClass="text-blue-600"
            />
          </div>
        );
      }
    } else {
      // BEP20 Tab
      if (hasBEP20Info) {
        return (
          <div className="space-y-4">
            <InfoField
              icon={<Wallet />}
              label="Địa chỉ BEP20 (Binance Smart Chain)"
              value={profileData.bep20Address}
              iconBgClass="bg-indigo-100"
              iconColorClass="text-indigo-600"
            />
          </div>
        );
      }
    }

    // Trường hợp không có dữ liệu
    return (
      <div className="text-center py-8 bg-slate-50 rounded-xl border border-dashed border-slate-200">
        <div className="flex items-center justify-center w-16 h-16 bg-slate-200 rounded-full mx-auto mb-3">
          <Banknote className="w-8 h-8 text-slate-500" />
        </div>
        <p className="text-slate-500 font-medium">
          Chưa có thông tin{" "}
          {activePaymentTab === "banking" ? "Ngân hàng" : "BEP20"}
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
                className="block text-sm font-medium text-slate-700 mb-1"
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
                  className="block w-full pl-10 pr-3 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm"
                  placeholder="VD: Vietcombank, Techcombank..."
                  defaultValue={profileData.bank.bankName}
                />
              </div>
            </div>

            {/* Input Số Tài Khoản */}
            <div>
              <label
                htmlFor="accountNumber"
                className="block text-sm font-medium text-slate-700 mb-1"
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
                  className="block w-full pl-10 pr-3 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm"
                  placeholder="Nhập số tài khoản"
                  defaultValue={profileData.bank.accountNumber}
                />
              </div>
            </div>

            {/* Input Tên Chủ Tài Khoản */}
            <div>
              <label
                htmlFor="accountName"
                className="block text-sm font-medium text-slate-700 mb-1"
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
                  className="block w-full pl-10 pr-3 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm"
                  placeholder="NGUYEN VAN A"
                  defaultValue={profileData.bank.accountName}
                />
              </div>
            </div>

            {/* Buttons */}
            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={handleCancelBank}
                className="flex items-center px-6 py-2.5 border border-slate-300 text-slate-700 rounded-xl font-semibold hover:bg-slate-50 transition-colors"
              >
                <X className="w-4 h-4 mr-1" />
                Hủy
              </button>
              <button
                type="submit"
                className="flex items-center px-6 py-2.5 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-colors shadow-lg shadow-blue-500/30"
              >
                <Save className="w-4 h-4 mr-2" />
                Lưu Ngân Hàng
              </button>
            </div>
          </div>
        </form>
      );
    }
    // B. Chế độ chỉnh sửa BEP20
    else {
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
                className="block text-sm font-medium text-slate-700 mb-1"
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
                  className="block w-full pl-10 pr-3 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm"
                  placeholder="Nhập địa chỉ ví BEP20 của bạn"
                  defaultValue={profileData.bep20Address}
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
                className="flex items-center px-6 py-2.5 border border-slate-300 text-slate-700 rounded-xl font-semibold hover:bg-slate-50 transition-colors"
              >
                <X className="w-4 h-4 mr-1" />
                Hủy
              </button>
              <button
                type="submit"
                className="flex items-center px-6 py-2.5 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-colors shadow-lg shadow-blue-500/30"
              >
                <Save className="w-4 h-4 mr-2" />
                Lưu Địa Chỉ Ví
              </button>
            </div>
          </div>
        </form>
      );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-extrabold text-slate-800 mb-8">
          Hồ Sơ Của Tôi
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Cột 1: Profile Card */}
          <div className="md:col-span-1">
            <div className="bg-white rounded-2xl shadow-xl border border-slate-100 p-6 text-center sticky md:top-8">
              <div className="relative inline-block mb-4">
                <img
                  src={profileData.avatarUrl}
                  alt="Avatar"
                  className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-md"
                />
                <div className="absolute bottom-0 right-0 bg-green-500 w-6 h-6 rounded-full border-2 border-white flex items-center justify-center">
                  {/* Trạng thái online */}
                </div>
              </div>
              <h3
                id="displayName"
                className="text-xl font-bold text-slate-800 mb-1"
              >
                {profileData.displayName}
              </h3>
              <p className="text-slate-500 text-sm mb-4">{profileData.email}</p>

              {/* Rank Badge */}
              <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-amber-100 text-amber-700 text-sm font-semibold mb-6 shadow-sm">
                <Award className="w-4 h-4 mr-2 fill-amber-300 stroke-amber-700" />
                Rank: {profileData.rank}
              </div>

              {/* Thông tin thêm */}
              <div className="border-t border-slate-100 pt-6 text-left">
                <div className="flex items-center gap-3">
                  <Calendar className="w-5 h-5 text-indigo-500 shrink-0" />
                  <div>
                    <label className="block text-xs font-medium text-slate-400 uppercase mb-0.5">
                      Ngày tham gia
                    </label>
                    <p className="text-slate-700 font-medium text-sm">
                      {profileData.joinDate}
                    </p>
                  </div>
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
                  className={`px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-xl font-medium transition-colors flex items-center gap-2 ${
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
                    icon={<User />}
                    label="Họ và Tên"
                    value={profileData.displayName}
                    iconBgClass="bg-blue-100"
                    iconColorClass="text-blue-600"
                  />
                  <InfoField
                    icon={<Phone />}
                    label="Số Điện Thoại"
                    value={profileData.phoneNumber}
                    badge={profileData.phoneNumber ? "Momo" : undefined}
                    iconBgClass="bg-green-100"
                    iconColorClass="text-green-600"
                  />
                </div>
              )}

              {/* Chế độ Chỉnh sửa */}
              {isEditingProfile && (
                <form
                  id="profileEditMode"
                  className="space-y-4"
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleSaveProfile();
                  }}
                >
                  <div className="grid grid-cols-1 gap-4">
                    {/* Input Họ và Tên */}
                    <div>
                      <label
                        htmlFor="userName"
                        className="block text-sm font-medium text-slate-700 mb-1"
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
                          className="block w-full pl-10 pr-3 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm"
                          placeholder="Nhập họ và tên của bạn"
                          defaultValue={profileData.displayName}
                        />
                      </div>
                    </div>

                    {/* Input Số Điện Thoại */}
                    <div>
                      <label
                        htmlFor="phoneNumber"
                        className="block text-sm font-medium text-slate-700 mb-1"
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
                          className="block w-full pl-10 pr-3 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm"
                          placeholder="Nhập số điện thoại của bạn"
                          defaultValue={profileData.phoneNumber}
                        />
                      </div>
                      <p className="text-xs text-pink-600 mt-1">
                        * Số điện thoại này cũng được dùng làm số Momo
                      </p>
                    </div>

                    {/* Buttons */}
                    <div className="flex justify-end gap-3 pt-2">
                      <button
                        type="button"
                        onClick={handleCancelProfile}
                        className="flex items-center px-6 py-2.5 border border-slate-300 text-slate-700 rounded-xl font-semibold hover:bg-slate-50 transition-colors"
                      >
                        <X className="w-4 h-4 mr-1" />
                        Hủy
                      </button>
                      <button
                        type="submit"
                        className="flex items-center px-6 py-2.5 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-colors shadow-lg shadow-blue-500/30"
                      >
                        <Save className="w-4 h-4 mr-2" />
                        Lưu Thay Đổi
                      </button>
                    </div>
                  </div>
                </form>
              )}
            </div>

            {/* 2. Thông Tin Thanh Toán (Banking & BEP20) */}
            <div className="bg-white rounded-2xl shadow-xl border border-slate-100 p-6">
              <div className="flex justify-between items-center mb-6">
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
                  className={`px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-xl font-medium transition-colors flex items-center gap-2 ${
                    isEditingBank ? "hidden" : ""
                  }`}
                >
                  <Edit2 className="w-4 h-4" />
                  Chỉnh sửa
                </button>
              </div>

              {/* Tab Selector */}
              <div
                className={`flex gap-3 mb-6 ${
                  isEditingBank ? "pointer-events-none opacity-50" : ""
                }`}
              >
                <button
                  onClick={() => setActivePaymentTab("banking")}
                  className={`px-4 py-2 rounded-full text-sm font-semibold transition-all flex items-center ${
                    activePaymentTab === "banking"
                      ? "bg-blue-500 text-white shadow-md shadow-blue-500/30"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  <Banknote className="w-4 h-4 mr-2" />
                  Banking
                  {hasBankingInfo && activePaymentTab !== "banking" && (
                    <span className="ml-2 w-2 h-2 bg-green-500 rounded-full"></span>
                  )}
                </button>
                <button
                  onClick={() => setActivePaymentTab("bep20")}
                  className={`px-4 py-2 rounded-full text-sm font-semibold transition-all flex items-center ${
                    activePaymentTab === "bep20"
                      ? "bg-blue-500 text-white shadow-md shadow-blue-500/30"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  <Wallet className="w-4 h-4 mr-2" />
                  BEP20
                  {hasBEP20Info && activePaymentTab !== "bep20" && (
                    <span className="ml-2 w-2 h-2 bg-green-500 rounded-full"></span>
                  )}
                </button>
              </div>

              {/* Nội dung Hiển thị / Chỉnh sửa */}
              {isEditingBank
                ? renderPaymentEditMode()
                : renderPaymentDisplayMode()}
            </div>

            {/* 3. LỊCH SỬ GIAO DỊCH (Transaction History) - Tông Xanh Lá */}
            <div className="bg-white rounded-2xl shadow-xl border border-slate-100 p-6">
              <div className="flex justify-between items-center mb-6 border-b border-green-200 pb-4">
                <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                  <ListOrdered className="w-6 h-6 text-green-600" />
                  Lịch Sử Giao Dịch
                </h3>
                <button className="px-3 py-1.5 text-green-700 bg-green-100 hover:bg-green-200 rounded-xl text-sm font-medium transition-colors shadow-sm">
                  Xem tất cả
                </button>
              </div>

              <div className="space-y-3">
                {TRANSACTION_HISTORY_DATA.map((tx) => (
                  <div
                    key={tx.id}
                    className="flex items-center justify-between p-4 bg-green-50 rounded-xl border border-green-100 hover:bg-green-100 transition-colors cursor-pointer shadow-sm"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`flex items-center justify-center w-10 h-10 rounded-full ${tx.bg} shrink-0`}
                      >
                        {/* Render dynamic icon from object */}
                        {React.createElement(tx.icon, {
                          className: `w-5 h-5 ${tx.color}`,
                        })}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-slate-800 line-clamp-1">
                          {tx.type}
                        </p>
                        <p className="text-xs text-slate-500">{tx.date}</p>
                      </div>
                    </div>
                    <div className="text-right shrink-0 ml-4">
                      <p className={`text-sm font-semibold ${tx.color}`}>
                        {tx.amount}
                      </p>
                      {/* Badge for Status */}
                      <span
                        className={`text-xs font-medium px-2 py-0.5 rounded-full mt-1 inline-block ${
                          tx.status === "Thành công"
                            ? "bg-green-600/10 text-green-700"
                            : tx.status === "Đang xử lý"
                            ? "bg-amber-600/10 text-amber-700"
                            : "bg-red-600/10 text-red-700"
                        }`}
                      >
                        {tx.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
