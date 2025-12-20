import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useLocation } from "react-router-dom";
import { toast } from "react-hot-toast";
import logo_m from "@/assets/logo.svg";
import UserMenu from "../element/UserMenu";
import NotificationDropdown from "../element/NotificationDropdown";
import AuthModal from "../element/AuthModal";
import LanguageSwitcher from "../common/LanguageSwitcher";
import { checkRole } from "@/utils/lib";
import { useAuthStore } from "@/store/authStore";
import { useSocketNotifications } from "@/hooks/useSocketNotifications";

// Icons SVGs (Sử dụng inline SVG để giữ tính nhất quán với component gốc)

const DollarSignIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={24}
    height={24}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
    className="lucide lucide-dollar-sign w-5 h-5"
  >
    <line x1="12" x2="12" y1="2" y2="22" />
    <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
  </svg>
);

const Header = () => {
  const { user } = useAuthStore();
  const { t } = useTranslation();
  const location = useLocation();
  const [pageTitle, setPageTitle] = useState("Tổng Quan");
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<{
    isOpen: boolean;
    mode: "signin" | "signup";
  }>({ isOpen: false, mode: "signup" });

  // Socket notifications integration
  const { isConnected } = useSocketNotifications({
    onNewNotification: (notification) => {
      // Show toast notification for new individual notifications
      toast.success(notification.title, {
        duration: 4000,
        position: "top-right",
        icon: "🔔",
      });

      // You can trigger a refetch of notifications here if needed
      // For example, emit a custom event to NotificationDropdown
      window.dispatchEvent(new CustomEvent("notification:new"));
    },
    onBroadcastNotification: (notification) => {
      // Show toast notification for broadcast notifications
      toast(notification.title, {
        duration: 5000,
        position: "top-right",
        icon: "📢",
        style: {
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          color: "#fff",
        },
      });

      // Trigger refetch
      window.dispatchEvent(new CustomEvent("notification:broadcast"));
    },
    onUnreadCountUpdate: (count) => {
      console.log("Unread count updated:", count);
      // Trigger unread count update in NotificationDropdown
      window.dispatchEvent(
        new CustomEvent("notification:unread-count", { detail: count })
      );
    },
  });

  useEffect(() => {
    if (isConnected && user) {
      console.log("✅ Socket connected for user:", user.email);
    }
  }, [isConnected, user]);

  // Update page title based on route
  useEffect(() => {
    const routeTitles: Record<string, string> = {
      "/": "Trang Chủ",
      "/dashboard": "Tổng Quan",
      "/tasks": "Nhiệm Vụ",
      "/cashback": "Cashback",
      "/referrals": "Giới Thiệu",
      "/ranks": "Bảng Xếp Hạng",
      "/wallet": "Ví Tiền",
      "/profile": "Hồ Sơ",
      "/activities": "Hoạt Động",
      "/settings": "Cài Đặt",
      "/notifications": "Thông Báo",
    };

    // Check for dynamic routes
    if (location.pathname.startsWith("/notifications/")) {
      setPageTitle("Chi Tiết Thông Báo");
    } else if (location.pathname.startsWith("/tasks/")) {
      setPageTitle("Chi Tiết Nhiệm Vụ");
    } else {
      setPageTitle(routeTitles[location.pathname] || "Tổng Quan");
    }
  }, [location.pathname]);

  const handleOpenAuthModal = (mode: "signin" | "signup") => {
    setIsAuthModalOpen({ isOpen: true, mode });
  };

  const handleCloseAuthModal = () => {
    setIsAuthModalOpen({ isOpen: false, mode: "signup" });
  };

  return (
    <>
      {/* Header Container */}
      <header className="sticky top-0 h-16 bg-white/95 backdrop-blur-md border-b border-pink-100/50 flex items-center justify-between pl-16 pr-4 md:px-8 z-20 shadow-lg shadow-pink-100/20">
        <div className="flex items-center gap-4">
          <div className="relative md:hidden flex items-center justify-center w-12 h-12">
            <div className="absolute -inset-1 bg-gradient-to-r from-[#E91E63]/20 to-[#FF8C1A]/20 rounded-lg blur-sm"></div>
            <img src={logo_m} alt="Cashzone" className=" relative z-10" />
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          {/* Nếu chưa login */}
          {!user && (
            <>
              <button
                onClick={() => handleOpenAuthModal("signin")}
                className="cursor-pointer px-3 sm:px-4 py-1.5 rounded-full bg-slate-100 text-slate-700 font-semibold hover:bg-gradient-to-r hover:from-pink-50 hover:to-orange-50 hover:text-[#E91E63] transition-all text-sm"
              >
                {t("auth.login")}
              </button>
              <button
                onClick={() => handleOpenAuthModal("signup")}
                className="cursor-pointer px-3 sm:px-4 py-1.5 rounded-full bg-gradient-to-r from-[#E91E63] to-[#FF8C1A] text-white font-semibold hover:from-[#AD1457] hover:to-[#E65100] transition-all shadow-lg shadow-pink-500/30 text-sm"
              >
                {t("auth.signup")}
              </button>

              {/* Divider */}
              <div className="h-6 w-px bg-gradient-to-b from-transparent via-pink-200 to-transparent mx-1" />
            </>
          )}

          {/* Nếu đã login */}
          {user && (
            <>
              {/* Wallet Balance - Chỉ hiện cho user */}
              {checkRole(user.roles || [], "user") && (
                <div className="hidden md:flex items-center px-3 py-1.5 bg-gradient-to-r from-[#E91E63]/10 to-[#FF8C1A]/10 text-[#E91E63] rounded-full text-sm font-bold border border-[#E91E63]/30 shadow-md shadow-pink-500/10 backdrop-blur-sm">
                  <DollarSignIcon />
                  <span className="ml-2">
                    {(user.wallet?.available || 0).toLocaleString("vi-VN")} VNĐ
                  </span>
                </div>
              )}

              {/* Divider */}
              {checkRole(user.roles || [], "user") && (
                <div className="hidden md:flex h-8 w-px bg-gradient-to-b from-transparent via-pink-200 to-transparent mx-2" />
              )}

              {/* Notification Dropdown */}
              <NotificationDropdown />

              {/* Language Switcher */}
              <LanguageSwitcher />

              {/* Divider */}
              <div className="h-8 w-px bg-gradient-to-b from-transparent via-pink-200 to-transparent mx-2" />

              {/* User Info & Menu */}
              <div className="flex items-center gap-2 sm:gap-3">
                {/* User Name - Hidden on mobile */}
                <div className="text-right hidden lg:block">
                  <div className="text-sm font-bold bg-gradient-to-r from-[#E91E63] to-[#FF8C1A] bg-clip-text text-transparent">
                    {user.name || user.email?.split("@")[0]}
                  </div>
                  {checkRole(user.roles || [], "admin") && (
                    <div className="text-xs text-slate-500">
                      {t("common.admin") || "Admin"}
                    </div>
                  )}
                </div>

                {/* User Menu */}
                <UserMenu />
              </div>
            </>
          )}
        </div>
      </header>

      {/* Auth Modal */}
      <AuthModal
        isOpen={isAuthModalOpen.isOpen}
        onClose={handleCloseAuthModal}
        mode={isAuthModalOpen.mode}
      />
    </>
  );
};

export default Header;
