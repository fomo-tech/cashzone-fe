import React, { useState } from "react";
import { Mail, UserPlus, Lock, Check } from "lucide-react";
import { notification } from "@/utils/notification";
import { useNavigate } from "react-router-dom";
import authService from "@/services/authService";
import { useAuthStore } from "@/store/authStore";
import toast from "react-hot-toast";
import GoogleLoginButton from "@/components/GoogleLoginButton";

const SignupForm: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [referralCode, setReferralCode] = useState(""); // State mới cho Mã Giới Thiệu
  const [agreed, setAgreed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { login: authLogin } = useAuthStore();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!agreed) {
      notification({
        message: "Vui lòng đồng ý với Điều Khoản Dịch Vụ và Chính Sách Bảo Mật",
        type: "warning",
      });
      return;
    }

    setIsLoading(true);
    try {
      const data = await authService.signup({
        email,
        password,
        name,
        phone,
        referralCode: referralCode || undefined,
      });
      
      authLogin(data);
      toast.success("Đăng ký thành công!");
      navigate("/");
    } catch (error: any) {
      console.error("Signup error:", error);
      toast.error(error?.response?.data?.message || "Đăng ký thất bại");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSuccess = () => {
    navigate("/");
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
        <div className="w-full">
          <GoogleLoginButton 
            onSuccess={handleGoogleSuccess}
            mode="signup"
          />
        </div>

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
