import { useEffect, useRef, useState } from "react";
import { User, Settings, LogOut, Wallet, History } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "@/store/authStore";

const UserMenu = () => {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      setOpen(false);
      navigate("/");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  // Auto close when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <img
        src="https://lh3.googleusercontent.com/a/ACg8ocLpo_ve57Hl-vfASdpt4MPAiXo-UnUPigBT7S9vam1j_FiPQg=s96-c"
        alt="Avatar"
        className="w-10 h-10 rounded-full border-2 border-white shadow-sm object-cover bg-slate-200 cursor-pointer hover:opacity-80 transition"
        onClick={() => setOpen((prev) => !prev)}
      />

      <div
        className={`absolute right-0 mt-2 w-52 bg-white rounded-xl shadow-lg border border-slate-200 py-2 z-50 transform transition-all duration-150 origin-top ${
          open
            ? "opacity-100 scale-100 visible"
            : "opacity-0 scale-95 invisible pointer-events-none"
        }`}
      >
        {/* User Header */}
        <div className="px-4 pb-2 border-b border-slate-100">
          <p className="text-sm font-semibold text-gray-700">
            {user?.name || "Người dùng"}
          </p>
          <p className="text-xs text-gray-500 truncate">{user?.email || ""}</p>
        </div>

        {/* Menu List */}
        <div className="py-1">
          <Link
            to="/profile"
            className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gradient-to-r hover:from-pink-50 hover:to-orange-50 hover:text-[#E91E63] transition"
          >
            <User className="w-4 h-4 mr-2" />
            Trang cá nhân
          </Link>

          <Link
            to="/wallet"
            className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gradient-to-r hover:from-pink-50 hover:to-orange-50 hover:text-[#E91E63] transition"
          >
            <Wallet className="w-4 h-4 mr-2" />
            Ví của tôi
          </Link>

          <Link
            to="/cashback-history"
            className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gradient-to-r hover:from-pink-50 hover:to-orange-50 hover:text-[#E91E63] transition"
          >
            <History className="w-4 h-4 mr-2" />
            Lịch sử hoàn tiền
          </Link>

          <Link
            to="/settings"
            className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gradient-to-r hover:from-pink-50 hover:to-orange-50 hover:text-[#E91E63] transition"
          >
            <Settings className="w-4 h-4 mr-2" />
            Cài đặt
          </Link>

          <button
            onClick={handleLogout}
            className="w-full flex items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Đăng xuất
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserMenu;
