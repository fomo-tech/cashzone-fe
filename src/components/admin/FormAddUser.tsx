import type { RoleEnum, User } from "@/utils/types";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import Checkbox from "../common/Checkbox";
import { useHandleSubmit } from "@/hooks/useHandleSubmit";
import http from "@/services/api";
import { useAppStore } from "@/store/appStore";

type FormValues = {
  name: string;
  password: string;
  phone: string;
  email: string;

  referralCode?: string; // mã của user mới
  referredCode?: string; // mã người giới thiệu

  roles: RoleEnum[];
  status: "Active" | "Inactive";
};

interface FormAddUserProps {
  setUsers: React.Dispatch<React.SetStateAction<User[]>>;
  editingUser?: User | null;
  closeModal: () => void;
}

const FormAddUser: React.FC<FormAddUserProps> = ({
  setUsers,
  editingUser,
  closeModal,
}) => {
  const { setToast } = useAppStore();
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
    reset,
  } = useForm<FormValues>({
    defaultValues: {
      name: "",
      password: "",
      phone: "",
      email: "",
      referralCode: "",
      referredCode: "",
      roles: ["user"],
      status: "Active",
    },
  });

  const { handleSubmit: onSubmitAddUser } = useHandleSubmit();

  useEffect(() => {
    if (editingUser) {
      reset({
        name: editingUser.name || "",
        phone: editingUser.phone || "",
        email: editingUser.email || "",
        referralCode: editingUser.affiliate?.code || "",
        referredCode: "",
        roles: editingUser.roles || ["User"],
        status: editingUser.status ? "Active" : "Inactive",
        password: "",
      });
    }
  }, [editingUser, reset]);

  const onSubmit = async (data: FormValues) => {
    const payload = {
      name: data.name,
      phone: data.phone,
      email: data.email,
      password: data.password,

      affiliate: {
        code: data.referralCode || null,
        referredByCode: data.referredCode || null,
      },

      roles: data.roles,
      status: data.status === "Active",
    };

    const res = await onSubmitAddUser(
      () => http.post("/admin/user", payload),
      (err: any) => {
        setToast({
          title: err.response?.data?.message || "Thêm người dùng thất bại",
          type: "error",
          isVisible: true,
          timer: 900,
        });
      }
    );
    if (res && res.data) {
      setToast({
        title: editingUser
          ? "Cập nhật người dùng thành công"
          : "Thêm người dùng thành công",
        type: "success",
        isVisible: true,
        timer: 1000,
      });
      // Cập nhật lại danh sách người dùng
      if (editingUser) {
        setUsers((prevUsers) =>
          prevUsers.map((user) =>
            user._id === editingUser._id ? res.data.user : user
          )
        );
      } else {
        setUsers((prevUsers) => [res.data.user, ...prevUsers]);
      }
      closeModal();
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {/* Tên */}
      <div>
        <label className="block text-sm font-medium text-slate-700">Tên</label>
        <input
          type="text"
          placeholder="Nhập tên"
          className="mt-1 w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:outline-none"
          {...register("name", { required: "Vui lòng nhập tên" })}
        />
        {errors.name && (
          <p className="text-sm text-red-500 mt-1">{errors.name.message}</p>
        )}
      </div>

      {/* SĐT */}
      <div>
        <label className="block text-sm font-medium text-slate-700">
          Số điện thoại
        </label>
        <input
          type="text"
          placeholder="Nhập số điện thoại"
          className="mt-1 w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:outline-none"
          {...register("phone", { required: "Vui lòng nhập số điện thoại" })}
        />
        {errors.phone && (
          <p className="text-sm text-red-500 mt-1">{errors.phone.message}</p>
        )}
      </div>

      {/* Email */}
      <div>
        <label className="block text-sm font-medium text-slate-700">
          Email
        </label>
        <input
          type="email"
          placeholder="Nhập email"
          className="mt-1 w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:outline-none"
          {...register("email", {
            required: "Vui lòng nhập email",
            pattern: { value: /^\S+@\S+$/i, message: "Email không hợp lệ" },
          })}
        />
        {errors.email && (
          <p className="text-sm text-red-500 mt-1">{errors.email.message}</p>
        )}
      </div>

      {/* Password chỉ hiện khi tạo mới */}
      {!editingUser && (
        <div>
          <label className="block text-sm font-medium text-slate-700">
            Mật khẩu
          </label>
          <input
            type="password"
            placeholder="Nhập mật khẩu"
            className="mt-1 w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:outline-none"
            {...register("password", {
              required: "Vui lòng nhập mật khẩu",
              minLength: { value: 6, message: "Tối thiểu 6 ký tự" },
            })}
          />
          {errors.password && (
            <p className="text-sm text-red-500 mt-1">
              {errors.password.message}
            </p>
          )}
        </div>
      )}

      {/* Mã của user */}
      <div>
        <label className="block text-sm font-medium text-slate-700">
          Mã giới thiệu của user
        </label>
        <input
          type="text"
          placeholder="Để trống sẽ tự tạo"
          className="mt-1 w-full px-3 py-2 border border-slate-300 rounded-lg"
          {...register("referralCode")}
        />
      </div>

      {/* Mã người giới thiệu */}
      <div>
        <label className="block text-sm font-medium text-slate-700">
          Mã người giới thiệu
        </label>
        <input
          type="text"
          placeholder="Nhập nếu có người giới thiệu"
          className="mt-1 w-full px-3 py-2 border border-slate-300 rounded-lg"
          {...register("referredCode")}
        />
      </div>

      {/* Roles */}
      <div>
        <label className="block text-sm font-medium text-slate-700">
          Quyền
        </label>
        <div className="flex gap-4 mt-1">
          {(["user", "admin"] as RoleEnum[]).map((role) => (
            <Checkbox
              key={role}
              id={`role-${role}`}
              label={role === "user" ? "Người dùng" : "Quản trị viên"}
              value={role}
              checked={watch("roles").includes(role)}
              onChange={(value: any) => {
                const currentRoles = watch("roles") as RoleEnum[];
                if (currentRoles.includes(value)) {
                  setValue(
                    "roles",
                    currentRoles.filter((r) => r !== value)
                  );
                } else {
                  setValue("roles", [...currentRoles, value]);
                }
              }}
            />
          ))}
        </div>
      </div>

      {/* Trạng thái */}
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium text-slate-700">Trạng thái</label>

        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            className="sr-only peer"
            checked={watch("status") === "Active"}
            onChange={(e) =>
              setValue("status", e.target.checked ? "Active" : "Inactive")
            }
          />
          <div
            className="w-11 h-6 bg-gray-200 rounded-full peer-checked:bg-[orange-600] 
            after:content-[''] after:absolute after:top-[2px] after:left-[2px] 
            after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all 
            peer-checked:after:translate-x-full"
          />
        </label>
      </div>

      {/* Submit */}
      <div className="pt-4">
        <button
          type="submit"
          className="cursor-pointer w-full py-2 rounded-xl bg-[orange-600] text-white font-medium hover:bg-[orange-600] transition"
        >
          {editingUser ? "Lưu Thay Đổi" : "Thêm Người Dùng"}
        </button>
      </div>
    </form>
  );
};

export default FormAddUser;
