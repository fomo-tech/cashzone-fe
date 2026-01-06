import React, { useState } from "react";
import { Mail, UserPlus, Lock, Key } from "lucide-react";

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

const LoginForm: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    alert(
      `Đang tiến hành Đăng Nhập với Email: ${email}. Ghi nhớ: ${
        rememberMe ? "Có" : "Không"
      }`
    );
    // Logic API Đăng nhập thường được thêm ở đây
  };

  const handleGoogleLogin = () => {
    alert("Đang chuyển hướng đến Google để Đăng Nhập...");
    // Logic OAuth Google ở đây
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-gray-50 rounded-3xl shadow-2xl p-6 md:p-10 space-y-6">
        {/* Header and Icon */}
        <div className="text-center">
          <Key className="w-12 h-12 text-orange-500 mx-auto mb-4" />
          <h1 className="text-3xl font-extrabold text-slate-800">
            Sign in to your account
          </h1>
          <p className="text-slate-500 mt-1 text-sm">
            Welcome back! Please enter your details.
          </p>
        </div>

        {/* Sign in with Google Button */}
        <button
          onClick={handleGoogleLogin}
          className="w-full flex items-center justify-center px-4 py-3 border border-slate-200 rounded-xl text-base font-semibold text-slate-700 bg-white hover:bg-slate-50 transition-colors duration-200 shadow-sm"
        >
          <GoogleIcon />
          <span>Sign in with Google</span>
        </button>

        {/* 'or' Separator */}
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-200"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-3 bg-gray-50 text-slate-400">or</span>
          </div>
        </div>

        {/* Email and Password Form */}
        <form onSubmit={handleLogin} className="space-y-4">
          {/* Email Input */}
          <div>
            <input
              type="email"
              placeholder="Email hoặc Tên đăng nhập"
              required
              className="block w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-slate-700 font-medium placeholder-slate-400"
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
              className="block w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-slate-700 font-medium placeholder-slate-400"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {/* Remember Me and Forgot Password */}
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center">
              <input
                id="remember"
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 h-4 text-orange-500 bg-gray-100 border-gray-300 rounded focus:ring-orange-500"
              />
              <label htmlFor="remember" className="ml-2 text-slate-600">
                Ghi nhớ đăng nhập
              </label>
            </div>
            <a href="#" className="text-orange-500 hover:underline font-medium">
              Quên Mật Khẩu?
            </a>
          </div>

          {/* Login Button */}
          <button
            type="submit"
            className="w-full py-3 rounded-xl font-bold text-white transition-colors duration-200 shadow-md bg-orange-500 hover:bg-orange-600"
          >
            Sign in
          </button>
        </form>

        {/* Footer Link to Signup */}
        <div className="text-center pt-4 border-t border-slate-100 mt-6">
          <p className="text-sm text-slate-600">
            Chưa có tài khoản?
            <a
              href="/signup" // Thay đổi link này nếu cần
              className="text-orange-500 font-semibold hover:underline ml-2"
            >
              Đăng Ký Ngay
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
