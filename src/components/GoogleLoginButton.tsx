import React, { useState } from "react";
import { GoogleLogin, type CredentialResponse } from "@react-oauth/google";
import authService from "@/services/authService";
import { useAuthStore } from "@/store/authStore";
import toast from "react-hot-toast";

interface GoogleLoginButtonProps {
  onSuccess?: () => void;
  onError?: () => void;
  mode?: "signin" | "signup";
}

// Google Icon Component
const GoogleIcon = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 20 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="shrink-0"
  >
    <path
      d="M19.6 10.227c0-.709-.064-1.39-.182-2.045H10v3.868h5.382a4.6 4.6 0 01-1.996 3.018v2.51h3.232c1.891-1.742 2.982-4.305 2.982-7.35z"
      fill="#4285F4"
    />
    <path
      d="M10 20c2.7 0 4.964-.895 6.618-2.423l-3.232-2.509c-.895.6-2.04.955-3.386.955-2.605 0-4.81-1.76-5.595-4.123H1.064v2.59A9.996 9.996 0 0010 20z"
      fill="#34A853"
    />
    <path
      d="M4.405 11.9c-.2-.6-.314-1.24-.314-1.9 0-.66.114-1.3.314-1.9V5.51H1.064A9.996 9.996 0 000 10c0 1.614.386 3.14 1.064 4.49l3.34-2.59z"
      fill="#FBBC05"
    />
    <path
      d="M10 3.977c1.468 0 2.786.505 3.823 1.496l2.868-2.868C14.959.99 12.695 0 10 0 6.09 0 2.71 2.24 1.064 5.51l3.34 2.59C5.19 5.736 7.395 3.977 10 3.977z"
      fill="#EA4335"
    />
  </svg>
);

export const GoogleLoginButton: React.FC<GoogleLoginButtonProps> = ({
  onSuccess,
  onError,
  mode = "signin",
}) => {
  const { login } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);

  const handleGoogleSuccess = async (
    credentialResponse: CredentialResponse,
  ) => {
    if (!credentialResponse.credential) {
      toast.error("Không nhận được thông tin từ Google");
      onError?.();
      return;
    }

    setIsLoading(true);
    try {
      // Gọi API backend để xác thực với ID token
      const data = await authService.googleLogin(credentialResponse.credential);

      // Lưu thông tin user và tokens
      login(data);

      onSuccess?.();
    } catch (error: any) {
      console.error("Google login error:", error);
      const errorMessage =
        error?.response?.data?.message ||
        "Đăng nhập Google thất bại. Vui lòng thử lại.";
      toast.error(errorMessage, {
        duration: 4000,
      });
      onError?.();
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleError = () => {
    console.error("Google login failed");
    toast.error("Đăng nhập Google thất bại");
    onError?.();
  };

  const buttonText =
    mode === "signup" ? "Đăng ký với Google" : "Đăng nhập với Google";

  return (
    <div className="relative">
      {/* Custom styled wrapper */}
      <div
        className={`relative overflow-hidden rounded-xl ${isLoading ? "pointer-events-none opacity-60" : ""}`}
      >
        {/* Loading overlay */}
        {isLoading && (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/80 backdrop-blur-sm rounded-xl">
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 border-2 border-gray-300 border-t-orange-500 rounded-full animate-spin" />
              <span className="text-sm font-bold text-gray-700">
                Đang xử lý...
              </span>
            </div>
          </div>
        )}

        {/* Custom button wrapper cho GoogleLogin */}
        <div className="google-login-wrapper">
          <div className="hidden">
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={handleGoogleError}
              size="large"
              width="100%"
              useOneTap={true}
              auto_select={false}
            />
          </div>

          {/* Custom styled button */}
          <button
            type="button"
            onClick={() => {
              // Trigger hidden Google button
              const googleBtn = document.querySelector(
                '[aria-labelledby="button-label"]',
              ) as HTMLElement;
              if (googleBtn) {
                googleBtn.click();
              }
            }}
            disabled={isLoading}
            className="group relative w-full flex items-center justify-center gap-3 px-6 py-3.5 
              bg-white border-2 border-gray-200 rounded-xl
              font-semibold text-gray-700 text-base
              transition-all duration-300 ease-out
              hover:border-orange-500 hover:bg-orange-50
              hover:shadow-lg hover:shadow-orange-100/50
              focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2
              disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:border-gray-200 disabled:hover:bg-white
              active:scale-[0.98] transform"
          >
            <GoogleIcon />
            <span className="group-hover:text-orange-600 transition-colors duration-300">
              {buttonText}
            </span>

            {/* Shine effect */}
            <div
              className="absolute inset-0 rounded-xl bg-linear-to-r from-transparent via-white/20 to-transparent 
              -translate-x-full group-hover:translate-x-full transition-transform duration-1000"
            />
          </button>
        </div>
      </div>
    </div>
  );
};

export default GoogleLoginButton;
