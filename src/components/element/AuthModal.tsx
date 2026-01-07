import { Check, UserPlus, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import authService from "../../services/authService";
import { useAuthStore } from "../../store/authStore";
import { notification } from "../../utils/notification";
import { referralCodeUtils } from "../../utils/referralCode";

interface SignupFormData {
  name: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
  referralCode?: string;
  agreed: boolean;
}

interface SigninFormData {
  email: string;
  password: string;
}

const AuthModal: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { isAuthModalOpen, handleToggleAuthModal, login } = useAuthStore();
  const { isOpen, mode } = isAuthModalOpen;

  const signupForm = useForm<SignupFormData>({
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      password: "",
      confirmPassword: "",
      referralCode: "",
      agreed: false,
    },
  });

  const signinForm = useForm<SigninFormData>({
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onClose = () => {
    handleToggleAuthModal();
  };

  // Tự động điền referralCode từ URL hoặc sessionStorage khi mở modal
  useEffect(() => {
    if (isOpen && mode === "signup") {
      const refCode = referralCodeUtils.getFromUrlOrStorage();

      if (refCode) {
        signupForm.setValue("referralCode", refCode);
        notification({
          message: `Đã áp dụng mã giới thiệu: ${refCode}`,
          type: "success",
          duration: 3000,
        });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, mode]);

  // Reset form when switching modes (nhưng giữ referralCode từ storage)
  useEffect(() => {
    const refCode = referralCodeUtils.get();

    signupForm.reset({
      name: "",
      email: "",
      phone: "",
      password: "",
      confirmPassword: "",
      referralCode: refCode || "", // Giữ referralCode từ storage
      agreed: false,
    });

    signinForm.reset();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthModalOpen.isOpen, isAuthModalOpen.mode]);

  const onSignupSubmit = async (data: SignupFormData) => {
    if (!data.agreed) {
      notification({
        message: "Vui lòng đồng ý điều khoản và chính sách.",
        type: "error",
      });
      return;
    }

    if (data.password !== data.confirmPassword) {
      signupForm.setError("confirmPassword", {
        message: "Mật khẩu xác nhận không khớp!",
      });
      notification({
        message: "Mật khẩu xác nhận không khớp!",
        type: "error",
      });
      return;
    }

    setIsLoading(true);
    try {
      const response = await authService.signup({
        email: data.email.trim(),
        password: data.password,
        name: data.name.trim(),
        phone: data.phone.trim(),
        referralCode: data.referralCode?.trim() || undefined,
      });

      login(response);

      // Xóa referral code sau khi đăng ký thành công
      referralCodeUtils.clear();

      notification({
        message: "Đăng ký thành công!",
        type: "success",
      });

      signupForm.reset();
      handleToggleAuthModal();
    } catch (error: any) {
      console.error("Signup error:", error);

      let errorMessage = "Đăng ký thất bại. Vui lòng thử lại.";

      // Handle validation errors from backend
      if (
        error?.response?.data?.details &&
        Array.isArray(error.response.data.details)
      ) {
        const details = error.response.data.details;
        errorMessage = details.join(", ");
      } else if (error?.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error?.message) {
        errorMessage = error.message;
      }

      notification({
        message: errorMessage,
        type: "error",
        duration: 5000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const onSigninSubmit = async (data: SigninFormData) => {
    setIsLoading(true);
    try {
      const response = await authService.login({
        email: data.email.trim(),
        password: data.password,
      });

      login(response);

      notification({
        message: "Đăng nhập thành công!",
        type: "success",
      });

      signinForm.reset();
      handleToggleAuthModal();
    } catch (error: any) {
      console.error("Login error:", error);

      let errorMessage = "Đăng nhập thất bại. Vui lòng thử lại.";

      if (error?.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error?.message) {
        const errorTranslations: Record<string, string> = {
          invalid_credentials: "Email hoặc mật khẩu không đúng!",
          user_not_found: "Tài khoản không tồn tại!",
          account_disabled: "Tài khoản đã bị vô hiệu hóa!",
        };

        errorMessage = errorTranslations[error.message] || error.message;
      }

      notification({
        message: errorMessage,
        type: "error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignup = () => {
    notification({
      message: "Tính năng đăng nhập Google đang phát triển",
      type: "info",
    });
  };

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 transition-opacity duration-200 ${
        isOpen
          ? "visible opacity-100"
          : "invisible opacity-0 pointer-events-none"
      }`}
    >
      <div
        className="absolute inset-0 bg-black/50 transition-opacity"
        onClick={onClose}
      />
      <div
        className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl p-8 space-y-6 transform transition"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-full"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="text-center">
          <UserPlus className="w-12 h-12 mx-auto mb-4 text-orange-600 p-2 bg-gradient-to-r from-orange-600/10 to-[#FF8C1A]/10 rounded-full" />
          <h1 className="text-3xl font-bold text-slate-800">
            {mode === "signup" ? "Tạo tài khoản mới" : "Chào mừng trở lại"}
          </h1>
          <p className="text-slate-500 mt-1 text-sm">
            {mode === "signup" ? "Đã có tài khoản?" : "Chưa có tài khoản?"}
            <span
              className="text-orange-600 font-medium ml-1 cursor-pointer hover:underline"
              onClick={() =>
                handleToggleAuthModal({
                  isOpen: true,
                  mode: mode === "signup" ? "signin" : "signup",
                })
              }
            >
              {mode === "signup" ? "Đăng nhập" : "Đăng ký"}
            </span>
          </p>
        </div>

        {/* Google signup */}
        <button
          onClick={handleGoogleSignup}
          className="w-full flex items-center justify-center gap-2 px-4 py-3 border border-slate-200 rounded-xl font-semibold text-slate-700 bg-white hover:bg-slate-50 shadow-sm hover:shadow-md"
        >
          <img
            src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
            alt="Google"
            className="w-5 h-5"
          />
          <span>{mode === "signup" ? "Đăng ký" : "Đăng nhập"} với Google</span>
        </button>

        {/* Separator */}
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-200" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-3 bg-white text-slate-400">hoặc</span>
          </div>
        </div>

        {/* Form */}
        {mode === "signup" ? (
          <form
            onSubmit={signupForm.handleSubmit(onSignupSubmit)}
            className="space-y-4"
          >
            <div>
              <input
                type="text"
                placeholder="Họ và tên *"
                {...signupForm.register("name", {
                  required: "Vui lòng nhập họ và tên",
                })}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent"
              />
              {signupForm.formState.errors.name && (
                <p className="text-red-500 text-sm mt-1">
                  {signupForm.formState.errors.name.message}
                </p>
              )}
            </div>

            <div>
              <input
                type="email"
                placeholder="Email *"
                {...signupForm.register("email", {
                  required: "Vui lòng nhập email",
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: "Email không hợp lệ",
                  },
                })}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent"
              />
              {signupForm.formState.errors.email && (
                <p className="text-red-500 text-sm mt-1">
                  {signupForm.formState.errors.email.message}
                </p>
              )}
            </div>

            <div>
              <input
                type="tel"
                placeholder="Số điện thoại *"
                {...signupForm.register("phone", {
                  required: "Vui lòng nhập số điện thoại",
                })}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent"
              />
              {signupForm.formState.errors.phone && (
                <p className="text-red-500 text-sm mt-1">
                  {signupForm.formState.errors.phone.message}
                </p>
              )}
            </div>

            <div>
              <input
                type="password"
                placeholder="Mật khẩu *"
                {...signupForm.register("password", {
                  required: "Vui lòng nhập mật khẩu",
                  minLength: {
                    value: 6,
                    message: "Mật khẩu phải có ít nhất 6 ký tự",
                  },
                })}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent"
              />
              {signupForm.formState.errors.password && (
                <p className="text-red-500 text-sm mt-1">
                  {signupForm.formState.errors.password.message}
                </p>
              )}
            </div>

            <div>
              <input
                type="password"
                placeholder="Xác nhận mật khẩu *"
                {...signupForm.register("confirmPassword", {
                  required: "Vui lòng xác nhận mật khẩu",
                })}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent"
              />
              {signupForm.formState.errors.confirmPassword && (
                <p className="text-red-500 text-sm mt-1">
                  {signupForm.formState.errors.confirmPassword.message}
                </p>
              )}
            </div>

            <div>
              <input
                type="text"
                placeholder="Mã giới thiệu (tùy chọn)"
                {...signupForm.register("referralCode")}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent"
              />
            </div>

            {/* Terms */}
            <div className="flex items-start">
              <label className="flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  {...signupForm.register("agreed")}
                  className="sr-only"
                />
                <div
                  className={`w-4 h-4 rounded flex items-center justify-center border transition ${
                    signupForm.watch("agreed")
                      ? "bg-orange-600 border-orange-600"
                      : "bg-white border-gray-300"
                  }`}
                >
                  {signupForm.watch("agreed") && (
                    <Check className="w-3 h-3 text-white" />
                  )}
                </div>
                <p className="ml-3 text-sm text-slate-600">
                  Tôi đồng ý với
                  <span className="text-orange-600 font-medium ml-1">
                    Điều khoản dịch vụ
                  </span>{" "}
                  và{" "}
                  <span className="text-orange-600 font-medium">
                    Chính sách bảo mật
                  </span>
                </p>
              </label>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={!signupForm.watch("agreed") || isLoading}
              className={`cursor-pointer w-full py-3 rounded-xl font-bold text-white transition shadow-lg mt-4 ${
                signupForm.watch("agreed") && !isLoading
                  ? "bg-orange-600 hover:bg-orange-700 shadow-orange-300/50"
                  : "bg-gray-400 cursor-not-allowed opacity-80"
              }`}
            >
              {isLoading ? "Đang xử lý..." : "Đăng ký"}
            </button>
          </form>
        ) : (
          <form
            onSubmit={signinForm.handleSubmit(onSigninSubmit)}
            className="space-y-4"
          >
            <div>
              <input
                type="email"
                placeholder="Email *"
                {...signinForm.register("email", {
                  required: "Vui lòng nhập email",
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: "Email không hợp lệ",
                  },
                })}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent"
              />
              {signinForm.formState.errors.email && (
                <p className="text-red-500 text-sm mt-1">
                  {signinForm.formState.errors.email.message}
                </p>
              )}
            </div>

            <div>
              <input
                type="password"
                placeholder="Mật khẩu *"
                {...signinForm.register("password", {
                  required: "Vui lòng nhập mật khẩu",
                })}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent"
              />
              {signinForm.formState.errors.password && (
                <p className="text-red-500 text-sm mt-1">
                  {signinForm.formState.errors.password.message}
                </p>
              )}
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isLoading}
              className={`w-full py-3 rounded-xl font-bold text-white transition shadow-lg mt-4 ${
                !isLoading
                  ? "bg-orange-600 hover:bg-orange-700 shadow-orange-300/50"
                  : "bg-gray-400 cursor-not-allowed opacity-80"
              }`}
            >
              {isLoading ? "Đang xử lý..." : "Đăng nhập"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default AuthModal;
