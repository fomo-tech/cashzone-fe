import React, { useState } from "react";
import { Mail, UserPlus, Lock, Check } from "lucide-react";
import { notification } from "@/utils/notification";

// Component Icon Google (Sử dụng SVG phổ biến)
const GoogleIcon: React.FC = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 48 48"
    width="24px"
    height="24px"
    className="mr-3 shrink-0"
  >
    <path
      fill="#FFC107"
      d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 7.957-11.303 7.957-6.514 0-11.882-5.228-11.882-11.758 0-6.53 5.368-11.758 11.882-11.758a12.871 12.871 0 0 1 8.895 3.541l6.982-6.982A22.08 22.08 0 0 0 24 10C12.954 10 3.823 19.045 3.823 30c0 10.954 9.131 20 20.177 20 17.518 0 22.213-16.71 18.257-27.917z"
    />
    <path
      fill="#FF3D00"
      d="M6.355 20.655l8.747 6.749A11.082 11.082 0 0 1 24 16c2.56 0 4.96.88 6.94 2.47l8.28-6.39A20.007 20.007 0 0 0 24 10c-10.954 0-20.081 9.045-20.081 20 0 1.348.163 2.665.485 3.94l8.36-6.438A12.036 12.036 0 0 1 6.355 20.655z"
    />
    <path
      fill="#4CAF50"
      d="M24 50c5.385 0 10.607-2.022 14.582-5.996l-8.28-6.39A14.07 14.07 0 0 1 24 38c-3.15 0-6.082-.9-8.483-2.434l-8.4 6.47A22.083 22.083 0 0 0 24 50z"
    />
    <path
      fill="#1976D2"
      d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 7.957-11.303 7.957-6.514 0-11.882-5.228-11.882-11.758 0-6.53 5.368-11.758 11.882-11.758a12.871 12.871 0 0 1 8.895 3.541l6.982-6.982A22.08 22.08 0 0 0 24 10c-10.954 0-20.081 9.045-20.081 20s9.127 20 20.081 20c13.09 0 23.362-12.008 19.53-29.917z"
    />
  </svg>
);

const SignupForm: React.FC = () => {
  const [email, setEmail] = useState("nguyenloc12021999vn@gmail.com");
  const [password, setPassword] = useState("**********");
  const [referralCode, setReferralCode] = useState(""); // State mới cho Mã Giới Thiệu
  const [agreed, setAgreed] = useState(true);

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    if (!agreed) {
      notification({
        message: "Vui lòng đồng ý với Điều Khoản Dịch Vụ và Chính Sách Bảo Mật",
        type: "warning",
      });
      return;
    }
    notification({
      message: "Đang tiến hành Đăng ký",
      description: `Email: ${email}, Mã GT: ${referralCode || "Không có"}`,
      type: "info",
    });
    // Logic API Đăng ký: Gửi email, password và referralCode lên server
  };

  const handleGoogleSignup = () => {
    notification({
      message: "Đang chuyển hướng đến Google để Đăng Ký...",
      type: "info",
    });
    // Logic OAuth Google ở đây
  };

  return (
    <div className="min-h-screen  flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-gray-50 rounded-3xl shadow-2xl p-6 md:p-10 space-y-6">
        {/* Header and Avatar */}
        <div className="text-center">
          <img
            src="path_to_your_avatar_image" // Thay thế bằng path hình ảnh avatar thực tế của bạn
            alt="Avatar"
            className="w-20 h-20 mx-auto mb-4"
          />
          <h1 className="text-3xl font-extrabold text-slate-800">
            Create a new account
          </h1>
          <p className="text-slate-500 mt-1 text-sm">
            Already have an account?
            <a
              href="/login"
              className="text-pink-500 font-medium hover:underline ml-1"
            >
              Sign in
            </a>
          </p>
        </div>

        {/* Sign up with Google Button */}
        <button
          onClick={handleGoogleSignup}
          className="w-full flex items-center justify-center px-4 py-3 border border-slate-200 rounded-xl text-base font-semibold text-slate-700 bg-white hover:bg-slate-50 transition-colors duration-200 shadow-sm"
        >
          <GoogleIcon />
          <span>Sign up with Google</span>
        </button>

        {/* 'or' Separator */}
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-200"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-3 bg-white text-slate-400">or</span>
          </div>
        </div>

        {/* Email and Password Form */}
        <form onSubmit={handleSignup} className="space-y-4">
          {/* Email Input */}
          <div>
            <input
              type="email"
              placeholder="Email"
              required
              className="block w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-pink-500 text-slate-700 font-medium placeholder-slate-400"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          {/* Password Input */}
          <div>
            <input
              type="password"
              placeholder="Mật khẩu"
              required
              className="block w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-pink-500 text-slate-700 font-medium placeholder-slate-400"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {/* New: Referral Code Input (Không bắt buộc) */}
          <div>
            <input
              type="text"
              placeholder="Mã Giới Thiệu (Không bắt buộc)"
              className="block w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-pink-500 text-slate-700 placeholder-slate-400"
              value={referralCode}
              onChange={(e) => setReferralCode(e.target.value)}
            />
          </div>

          {/* Terms & Privacy Checkbox */}
          <div className="flex items-start pt-2">
            <div className="flex items-center h-5">
              <input
                id="terms"
                type="checkbox"
                checked={agreed}
                onChange={(e) => setAgreed(e.target.checked)}
                className="w-4 h-4 text-[orange-600] bg-gray-100 border-gray-300 rounded focus:ring-pink-500"
              />
            </div>
            <label htmlFor="terms" className="ml-3 text-sm text-slate-600">
              I agree to
              <a
                href="#"
                className="text-pink-500 hover:underline font-medium ml-1"
              >
                Terms of Service
              </a>
              and
              <a
                href="#"
                className="text-pink-500 hover:underline font-medium ml-1"
              >
                Privacy Policy
              </a>
            </label>
          </div>

          {/* Sign up Button */}
          <button
            type="submit"
            disabled={!agreed}
            className={`w-full py-3 rounded-xl font-bold text-white transition-colors duration-200 shadow-md ${
              agreed
                ? "bg-[orange-600] hover:bg-[#AD1457]"
                : "bg-gray-400 cursor-not-allowed opacity-80"
            }`}
          >
            Sign up
          </button>
        </form>
      </div>
    </div>
  );
};

export default SignupForm;
