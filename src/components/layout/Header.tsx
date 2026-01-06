import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "react-hot-toast";
import logo_m from "@/assets/logo.png";
import UserMenu from "../element/UserMenu";
import NotificationDropdown from "../element/NotificationDropdown";
import { checkRole } from "@/utils/lib";
import { useAuthStore } from "@/store/authStore";
import { useSocketNotifications } from "@/hooks/useSocketNotifications";
import { Wallet2Icon } from "lucide-react";

const Header = () => {
  const { user } = useAuthStore();
  const { t } = useTranslation();
  const { handleToggleAuthModal } = useAuthStore();
  // Socket notifications integration
  const { isConnected } = useSocketNotifications({
    onNewNotification: (notification) => {
      // Show toast notification for new individual notifications
      toast.success(notification.title, {
        duration: 4000,
        position: "top-right",
        icon: "🔔",
      });

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
      console.log("Socket connected for user:", user.email);
    }
  }, [isConnected, user]);

  return (
    <>
      {/* Header Container */}
      <header
        className="sticky z-20 bg-white/95 backdrop-blur-md border-b border-pink-100/50 shadow-lg shadow-pink-100/20"
        style={{ top: "var(--safe-area-inset-top)" }}
      >
        <div className="flex items-center justify-between h-14 sm:h-16 pl-14 sm:pl-16 pr-3 sm:pr-4 md:px-8">
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="relative md:hidden flex items-center justify-center w-[90%] h-10">
              <img
                src={logo_m}
                alt="Cashzone"
                className="relative z-10 w-full h-full object-contain"
              />
            </div>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-2 md:gap-3">
            {/* Nếu chưa login */}
            {!user && (
              <>
                <button
                  onClick={() =>
                    handleToggleAuthModal({ isOpen: true, mode: "signin" })
                  }
                  className="cursor-pointer px-3 sm:px-4 md:px-5 py-1.5 sm:py-2 rounded-full bg-slate-100 text-slate-700 font-semibold hover:bg-gradient-to-r hover:from-pink-50 hover:to-orange-50 hover:text-[#E91E63] transition-all duration-300 text-xs sm:text-sm active:scale-95"
                >
                  {t("auth.login")}
                </button>
                <button
                  onClick={() =>
                    handleToggleAuthModal({
                      isOpen: true,
                      mode: "signup",
                    })
                  }
                  className="cursor-pointer px-3 sm:px-4 md:px-5 py-1.5 sm:py-2 rounded-full bg-gradient-to-br from-orange-500 via-orange-600 to-amber-600 text-white font-semibold hover:from-orange-600 hover:to-amber-700 transition-all duration-300 shadow-lg shadow-pink-500/30 text-xs sm:text-sm active:scale-95"
                >
                  {t("auth.signup")}
                </button>

                {/* Divider */}
                <div className="hidden sm:block h-6 w-px bg-gradient-to-b from-transparent via-pink-200 to-transparent mx-1" />
              </>
            )}

            {/* Nếu đã login */}
            {user && (
              <>
                {/* Wallet Balance - Chỉ hiện cho user */}
                {checkRole(user.roles || [], "user") && (
                  <div className="hidden sm:flex items-center px-2 sm:px-3 py-1.5 bg-gradient-to-r from-[#E91E63]/10 to-[#FF8C1A]/10 text-[#E91E63] rounded-full text-xs sm:text-sm font-bold border border-[#E91E63]/30 shadow-md shadow-pink-500/10 backdrop-blur-sm">
                    <Wallet2Icon className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
                    <span className="ml-1.5 sm:ml-2 whitespace-nowrap">
                      <span className="hidden md:inline">
                        {(user.wallet?.available || 0).toLocaleString("vi-VN")}{" "}
                        VNĐ
                      </span>
                      <span className="md:hidden">
                        {((user.wallet?.available || 0) / 1000).toFixed(0)}K
                      </span>
                    </span>
                  </div>
                )}

                {/* Divider */}
                {checkRole(user.roles || [], "user") && (
                  <div className="hidden sm:block h-6 sm:h-8 w-px bg-gradient-to-b from-transparent via-pink-200 to-transparent mx-1 sm:mx-2" />
                )}

                {/* Notification Dropdown */}
                <NotificationDropdown />

                {/* Divider */}
                <div className="hidden sm:block h-6 sm:h-8 w-px bg-gradient-to-b from-transparent via-pink-200 to-transparent mx-1 sm:mx-2" />

                {/* User Info & Menu */}
                <div className="flex items-center gap-1.5 sm:gap-2 md:gap-3">
                  {/* User Name - Hidden on mobile */}
                  <div className="text-right hidden lg:block">
                    <div className="text-sm font-bold bg-gradient-to-br from-orange-500 via-orange-600 to-amber-600 bg-clip-text text-transparent truncate max-w-[150px] xl:max-w-[200px]">
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
        </div>
      </header>
    </>
  );
};

export default Header;
