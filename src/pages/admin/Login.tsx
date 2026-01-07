import React, { useEffect, useState } from "react";
import { Lock, Loader, Check, Mail } from "lucide-react";
import { useForm } from "react-hook-form";
import { useHandleSubmit } from "@/hooks/useHandleSubmit";
import http from "@/services/api";
import { useAppStore } from "@/store/appStore";
import clsx from "clsx";
import { useAuthStore } from "@/store/authStore";
import { notification } from "@/utils/notification";

type FormData = {
  email: string;
  password: string;
};

const AdminLogin = () => {
  const { loading } = useAppStore();
  const { login } = useAuthStore();
  const [error, setError] = useState("");
  const { handleSubmit: handleSubmitApi } = useHandleSubmit();
  const isLoading = loading["global"] || false;

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormData>();

  const onSubmit = async (data: FormData) => {
    setError("");
    const res = await handleSubmitApi(
      () => http.post("/auth/signin", data),
      (err: any) => {
        setError(err.response?.data?.message || "Đăng nhập thất bại");
      }
    );
    if (res) {
      notification({
        type: "success",
        message: "Đăng nhập thành công!",
      });
      login(res.data);
      reset();
    }
  };

  // Xóa error sau 1.5s khi thay đổi
  useEffect(() => {
    if (!error) return;
    const timer = setTimeout(() => setError(""), 3000);
    return () => clearTimeout(timer);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-2xl border border-gray-200">
        <div className="text-center mb-6">
          <Lock className="w-10 h-10 text-[orange-600] mx-auto mb-3" />
          <h2 className="text-2xl font-bold text-gray-900">
            Đăng Nhập Quản Trị
          </h2>
          <p className="text-sm text-gray-500 mt-1">Truy cập trang quản lý</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Email */}
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="email"
              placeholder="Nhập email quản trị"
              {...register("email", {
                required: "Vui lòng nhập email",
                pattern: {
                  value: /^\S+@\S+\.\S+$/,
                  message: "Email không hợp lệ",
                },
              })}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-pink-500 focus:border-[orange-600] transition"
            />
            {errors.email && (
              <p className="text-sm text-red-500 mt-1">
                {errors.email.message}
              </p>
            )}
          </div>

          {/* Password */}
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="password"
              placeholder="Nhập mật khẩu"
              {...register("password", {
                required: "Vui lòng nhập mật khẩu",
                minLength: { value: 3, message: "Mật khẩu quá ngắn" },
              })}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-pink-500 focus:border-[orange-600] transition"
            />
            {errors.password && (
              <p className="text-sm text-red-500 mt-1">
                {errors.password.message}
              </p>
            )}
          </div>

          {/* General error */}
          {error && (
            <p className="text-sm text-red-600 mt-2 text-center font-medium">
              {error}
            </p>
          )}

          <button
            type="submit"
            // disabled={getValues("email") === "" || getValues("password") === ""}
            className={clsx(
              "w-full py-3 bg-[orange-600] text-white font-semibold rounded-lg hover:bg-[orange-600] transition shadow-lg flex items-center justify-center"
              // {
              //   "opacity-50 cursor-not-allowed":
              //     getValues("email") === "" || getValues("password") === "",
              // }
            )}
          >
            {isLoading ? (
              <Loader className="w-5 h-5 mr-2 animate-spin" />
            ) : (
              <Check className="w-5 h-5 mr-2" />
            )}
            {isLoading ? "Đang xác thực" : "Đăng Nhập"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;
