import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuthStore } from "@/store/authStore";

const SignupRedirect: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { handleToggleAuthModal } = useAuthStore();

  useEffect(() => {
    // Giữ query params khi redirect (VD: ?ref=CODE)
    const queryParams = location.search;
    navigate(`/${queryParams}`, { replace: true });

    // Open signup modal after a small delay
    setTimeout(() => {
      handleToggleAuthModal({ isOpen: true, mode: "signup" });
    }, 100);
  }, [navigate, location.search, handleToggleAuthModal]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto"></div>
        <p className="mt-4 text-gray-600">Đang chuyển hướng...</p>
      </div>
    </div>
  );
};

export default SignupRedirect;
