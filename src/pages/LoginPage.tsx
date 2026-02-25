import React, { useState } from "react";
import { Mail, UserPlus, Lock, Key } from "lucide-react";
import { useNavigate } from "react-router-dom";
import authService from "@/services/authService";
import { useAuthStore } from "@/store/authStore";
import toast from "react-hot-toast";
import GoogleLoginButton from "@/components/GoogleLoginButton";

const LoginForm: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { login: authLogin } = useAuthStore();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const data = await authService.login({ email, password });
      authLogin(data);
      toast.success("Đăng nhập thành công!");
      navigate("/");
    } catch (error: any) {
      console.error("Login error:", error);
      toast.error(error?.response?.data?.message || "Đăng nhập thất bại");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSuccess = () => {
    navigate("/");
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-gray-50 rounded-3xl shadow-2xl p-6 md:p-10 space-y-6">
        {/* Header and Icon */}
        <div className="text-center">
          <Key className="w-12 h-12 text-[orange-600] mx-auto mb-4" />
          <h1 className="text-3xl  text-slate-800">Sign in to your account</h1>
          <p className="text-slate-500 mt-1 text-sm">
            Welcome back! Please enter your details.
          </p>
        </div>

        {/* Google Login Button */}
        <div className="w-full">
          <GoogleLoginButton onSuccess={handleGoogleSuccess} mode="signin" />
        </div>

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
              className="block w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-pink-500 text-slate-700 font-bold placeholder-slate-400"
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
              className="block w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-pink-500 text-slate-700 font-bold placeholder-slate-400"
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
                className="w-4 h-4 text-[orange-600] bg-gray-100 border-gray-300 rounded focus:ring-pink-500"
              />
              <label htmlFor="remember" className="ml-2 text-slate-600">
                Ghi nhớ đăng nhập
              </label>
            </div>
            <a href="#" className="text-pink-500 hover:underline font-bold">
              Quên Mật Khẩu?
            </a>
          </div>

          {/* Login Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 rounded-xl font-bold text-white transition-colors duration-200 shadow-md bg-[orange-600] hover:bg-[#AD1457] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? "Đang đăng nhập..." : "Sign in"}
          </button>
        </form>

        {/* Footer Link to Signup */}
        <div className="text-center pt-4 border-t border-slate-100 mt-6">
          <p className="text-sm text-slate-600">
            Chưa có tài khoản?
            <a
              href="/signup" // Thay đổi link này nếu cần
              className="text-pink-500 font-semibold hover:underline ml-2"
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
