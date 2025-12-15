import React, { useEffect, useState } from "react";
import {
  Plus,
  Edit,
  Trash2,
  Users,
  Search,
  X,
  Eye,
  RefreshCw,
  Filter,
  UserPlus,
} from "lucide-react";

import CommonModal from "@/components/common/Modal";
import FormAddUser from "@/components/admin/FormAddUser";
import { useHandleSubmit } from "@/hooks/useHandleSubmit";
import http from "@/services/api";
import { useAppStore } from "@/store/appStore";

import type { RoleEnum, User } from "@/utils/types";
import type { IPagination } from "@/utils/types/pagination";
import Pagination from "@/components/common/Pagination";
import RoleBadge from "@/components/admin/RoleBadge";
import StatusBadge from "@/components/admin/StatusBadge";
import { Link } from "react-router-dom";
import { useConfirmModal } from "@/hooks/useConfirmModal";
import { ConfirmModal } from "@/components/common/ConfirmModal";

const UserManagement: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [pagination, setPagination] = useState<IPagination>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const { confirm, isOpen, close, options } = useConfirmModal();
  const { handleSubmit } = useHandleSubmit();
  const { setToast } = useAppStore();

  const openModal = (userToEdit: User | null = null) => {
    setEditingUser(userToEdit);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingUser(null);
  };

  // Logic Xóa User
  const handleDelete = (id: string) => {
    handleSubmit(
      () => http.delete(`/admin/user/${id}`),
      (err: any) => {
        setToast({
          title: err.response?.data?.message || "Xóa người dùng thất bại",
          type: "error",
          isVisible: true,
          timer: 2000,
        });
      }
    ).then((res) => {
      console.log(1211, res, res?.data);

      if (res && res.data) {
        setUsers((prevUsers) => prevUsers.filter((user) => user._id !== id));
        setToast({
          title: "Xóa người dùng thành công",
          type: "success",
          isVisible: true,
          timer: 2000,
        });
      }
    });
  };

  // Lọc danh sách người dùng
  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  //get Uses api

  useEffect(() => {
    const getUsers = async () => {
      const res = await handleSubmit(
        () => http.get("/admin/users"),
        (err: any) => {
          setToast({
            title:
              err.response?.data?.message ||
              "Lấy danh sách người dùng thất bại",
            type: "error",
            isVisible: true,
            timer: 2000,
          });
        }
      );
      if (res && res.data) {
        setUsers(res.data.data);
        setPagination(res.data.pagination);
      }
    };
    getUsers();
  }, []);

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 to-green-50/30">
      {/* Header Section */}
      <div className="bg-linear-to-r from-green-600 to-emerald-600 shadow-lg">
        <div className="max-w-7xl mx-auto py-6 px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white flex items-center gap-3">
                <Users className="w-8 h-8" />
                Quản Lý Người Dùng
              </h1>
              <p className="text-green-100 text-sm mt-2">
                Quản lý và theo dõi thông tin người dùng hệ thống
              </p>
            </div>
            <button
              onClick={() => openModal()}
              className="inline-flex items-center gap-2 px-5 py-3 text-base font-semibold rounded-xl text-white bg-white/10 hover:bg-white/20 border border-white/30 backdrop-blur-sm transition duration-300 cursor-pointer shadow-lg"
            >
              <UserPlus className="w-5 h-5" />
              Thêm Người Dùng
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6 lg:p-8 space-y-6">
        {/* Search and Stats Section */}
        <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-200">
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
            <div className="relative flex-1 max-w-md">
              <Search className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 transform -translate-y-1/2" />
              <input
                type="text"
                placeholder="Tìm theo Tên hoặc Email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-700 transition-all"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm("")}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 px-4 py-2 bg-green-50 rounded-xl border border-green-200">
                <Users className="w-5 h-5 text-green-600" />
                <span className="text-sm text-gray-600">Tổng:</span>
                <span className="font-bold text-green-600 text-lg">
                  {pagination?.totalItems || 0}
                </span>
              </div>
              <button
                onClick={() => window.location.reload()}
                className="p-2.5 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded-xl transition-colors"
                title="Làm mới"
              >
                <RefreshCw className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* User Table */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-linear-to-r from-gray-50 to-green-50/30">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Tên
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Vai trò
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Trạng thái
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Ngày tham gia
                  </th>
                  <th className="px-6 py-4 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Hành động
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-100">
                {filteredUsers.length > 0 ? (
                  filteredUsers.map((user) => (
                    <tr
                      key={user._id}
                      className="hover:bg-green-50/50 transition-colors"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-linear-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center text-white font-bold">
                            {user.name?.charAt(0).toUpperCase() || "U"}
                          </div>
                          <span className="text-sm font-medium text-gray-900">
                            {user.name}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {user.email}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <RoleBadge roles={user.roles} />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <StatusBadge status={user.status} />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                        {new Date(user.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-center">
                        <div className="flex items-center justify-center gap-2">
                          {/* Xem Chi Tiết */}
                          <Link to={`/admin/user/${user._id}`}>
                            <button
                              title="Chi Tiết"
                              className="inline-flex items-center gap-1 px-3 py-2 text-green-600 hover:text-white hover:bg-green-600 rounded-lg transition-all border border-green-200 hover:border-green-600"
                            >
                              <Eye className="w-4 h-4" />
                              <span className="text-xs font-semibold">Xem</span>
                            </button>
                          </Link>
                          {/* Sửa */}
                          <button
                            onClick={() => openModal(user)}
                            title="Sửa"
                            className="inline-flex items-center gap-1 px-3 py-2 text-blue-600 hover:text-white hover:bg-blue-600 rounded-lg transition-all border border-blue-200 hover:border-blue-600"
                          >
                            <Edit className="w-4 h-4" />
                            <span className="text-xs font-semibold">Sửa</span>
                          </button>
                          {/* Xóa */}
                          <button
                            title="Xóa"
                            onClick={() =>
                              confirm(
                                "Xác Nhận Xóa Người Dùng",
                                `Bạn có chắc chắn muốn xóa người dùng "${user.name}" không?`,
                                () => handleDelete(user?._id)
                              )
                            }
                            className="inline-flex items-center gap-1 px-3 py-2 text-red-600 hover:text-white hover:bg-red-600 rounded-lg transition-all border border-red-200 hover:border-red-600"
                          >
                            <Trash2 className="w-4 h-4" />
                            <span className="text-xs font-semibold">Xóa</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="p-8 text-center text-slate-500">
                      Không tìm thấy người dùng nào phù hợp với từ khóa "
                      {searchTerm}".
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
            <Pagination
              page={pagination?.page || 1}
              limit={pagination?.limit || 10}
              totalItems={pagination?.totalItems || 0}
              onPageChange={(p: number) =>
                setPagination((prev) => (prev ? { ...prev, page: p } : prev))
              }
            />
          </div>
        </div>
      </div>

      {/* Modal Thêm/Sửa User */}
      <CommonModal
        isOpen={isModalOpen}
        onClose={closeModal}
        title={editingUser ? "Sửa Người Dùng" : "Thêm Người Dùng Mới"}
        width="max-w-md"
      >
        <FormAddUser
          editingUser={editingUser}
          closeModal={closeModal}
          setUsers={setUsers}
        />
      </CommonModal>

      <ConfirmModal
        isOpen={isOpen}
        title={options.title}
        onClose={close}
        onConfirm={options.onConfirm}
      >
        {options.content}
      </ConfirmModal>
    </div>
  );
};

export default UserManagement;
