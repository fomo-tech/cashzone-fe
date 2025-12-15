import { useState } from "react";
import logo_m from "@/assets/logo_m.svg";
import UserMenu from "../element/UserMenu";
import NotificationDropdown from "../element/NotificationDropdown";
import AuthModal from "../element/AuthModal";
import { checkRole } from "@/utils/lib";
import { useAuthStore } from "@/store/authStore";

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
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  const handleOpenAuthModal = () => {
    setIsAuthModalOpen(true);
  };

  const handleCloseAuthModal = () => {
    setIsAuthModalOpen(false);
  };

  return (
    <>
      {/* Header Container */}
      <header className="sticky top-0 h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 lg:px-8 z-20 shadow-sm">
        <div className="flex items-center gap-4">
          <img src={logo_m} alt="Cashzone" className="h-12" />
          <h1
            className="text-xl font-bold text-slate-800 hidden sm:block"
            id="page-title"
          >
            Tổng Quan
          </h1>
        </div>

        <div className="flex items-center gap-2 sm:gap-4">
          {/* Nếu chưa login */}
          {!user && (
            <div className="flex items-center gap-3">
              <button
                onClick={handleOpenAuthModal}
                className="px-4 py-1.5 rounded-full bg-slate-100 text-slate-700 font-semibold hover:bg-slate-200 transition"
              >
                Đăng nhập
              </button>
              <button
                onClick={handleOpenAuthModal}
                className="px-4 py-1.5 rounded-full bg-green-600 text-white font-semibold hover:bg-green-700 transition"
              >
                Đăng ký
              </button>
            </div>
          )}

          {/* Nếu đã login */}
          {user && (
            <>
              {checkRole(user.roles || [], "user") && (
                <div className="hidden md:flex items-center px-3 py-1.5 bg-green-50/70 text-green-700 rounded-full text-sm font-bold border border-green-200 shadow-sm">
                  <DollarSignIcon />
                  <span className="ml-2">{user.wallet.available} VNĐ</span>
                </div>
              )}

              <div className="hidden md:flex h-8 w-px bg-slate-200 mx-2" />

              <NotificationDropdown />

              {checkRole(user.roles || [], "user") && (
                <>
                  <button className="hidden sm:block text-slate-500 hover:text-slate-700 p-1.5 rounded-full transition-colors hover:bg-slate-100">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="size-6"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="m10.5 21 5.25-11.25L21 21m-9-3h7.5M3 5.621a48.474 48.474 0 0 1 6-.371m0 0c1.12 0 2.233.038 3.334.114M9 5.25V3m3.334 2.364C11.176 10.658 7.69 15.08 3 17.502m9.334-12.138c.896.061 1.785.147 2.666.257m-4.589 8.495a18.023 18.023 0 0 1-3.827-5.802"
                      />
                    </svg>
                  </button>

                  <div className="hidden md:flex items-center px-3 py-1.5 bg-amber-100 text-amber-700 border-amber-200 rounded-full text-sm font-medium border">
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
                      className="lucide lucide-crown w-4 h-4 mr-2"
                    >
                      <path d="M11.562 3.266a.5.5 0 0 1 .876 0L15.39 8.87a1 1 0 0 0 1.516.294L21.183 5.5a.5.5 0 0 1 .798.519l-2.834 10.246a1 1 0 0 1-.956.734H5.81a1 1 0 0 1-.957-.734L2.02 6.02a.5.5 0 0 1 .798-.519l4.276 3.664a1 1 0 0 0 1.516-.294z" />
                      <path d="M5 21h14" />
                    </svg>
                    Rank: ĐỒNG
                  </div>
                </>
              )}

              <div className="h-8 w-px bg-slate-200 mx-2" />

              <div className="flex items-center gap-3">
                <div className="text-right hidden sm:block">
                  <div className="text-sm font-bold text-slate-700">
                    {user.name}
                  </div>
                </div>
                <UserMenu />
              </div>
            </>
          )}
        </div>
      </header>

      {/* Auth Modal */}
      <AuthModal isOpen={isAuthModalOpen} onClose={handleCloseAuthModal} />
    </>
  );
};

export default Header;
