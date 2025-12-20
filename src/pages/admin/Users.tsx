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
  const [currentPage, setCurrentPage] = useState(1);
  const { confirmModal, showConfirm, hideConfirm } = useConfirmModal();
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
  const handleDelete = async (id: string, userName: string) => {
    showConfirm({
      title: "Xác nhận xóa người dùng",
      message: `Bạn có chắc chắn muốn xóa người dùng "${userName}"? Hành động này không thể hoàn tác.`,
      confirmText: "Xóa",
      cancelText: "Hủy",
      type: "danger",
      onConfirm: async () => {
        try {
          await http.delete(`/admin/user/${id}`);
          setUsers((prevUsers) => prevUsers.filter((user) => user._id !== id));
          setToast({
            title: "Xóa người dùng thành công",
            type: "success",
            isVisible: true,
            timer: 2000,
          });
          hideConfirm();
          // Reload data if current page becomes empty
          if (users.length === 1 && currentPage > 1) {
            setCurrentPage(currentPage - 1);
          } else {
            fetchUsers(currentPage);
          }
        } catch (err: any) {
          setToast({
            title: err.response?.data?.message || "Xóa người dùng thất bại",
            type: "error",
            isVisible: true,
            timer: 2000,
          });
        }
      },
    });
  };

  // Fetch users with pagination and search
  const fetchUsers = async (page: number = 1, search: string = "") => {
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: "10",
        ...(search && { search }),
      });

      const res = await http.get(`/admin/users?${params}`);

      if (res && res.data && res.data.data) {
        // API structure: res.data.data.data (users array) and res.data.data.pagination
        const userData = res.data.data.data || [];
        const paginationData = res.data.data.pagination || null;
        setUsers(userData);
        setPagination(paginationData);
      }
    } catch (err: any) {
      console.error("Fetch users error:", err);
      setToast({
        title:
          err.response?.data?.message || "Lấy danh sách người dùng thất bại",
        type: "error",
        isVisible: true,
        timer: 2000,
      });
    }
  };

  // Initial load
  useEffect(() => {
    fetchUsers(1, "");
  }, []);

  // Handle page change (only when page changes and not initial)
  useEffect(() => {
    if (currentPage > 1) {
      fetchUsers(currentPage, searchTerm);
    }
  }, [currentPage]);

  // Debounce search (only trigger when user actually types)
  useEffect(() => {
    // Skip if it's the initial empty string
    if (searchTerm === "") return;

    const timer = setTimeout(() => {
      setCurrentPage(1);
      fetchUsers(1, searchTerm);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-orange-50/30">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-[#E91E63] to-[#FF8C1A] shadow-lg">
        <div className="max-w-7xl mx-auto py-6 px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white flex items-center gap-3">
                <Users className="w-8 h-8" />
                Quản Lý Người Dùng
              </h1>
              <p className="text-white/90 text-sm mt-2">
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
                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent text-gray-700 transition-all"
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
              <div className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#E91E63]/10 to-[#FF8C1A]/10 rounded-xl border border-[#E91E63]/30">
                <Users className="w-5 h-5 text-[#E91E63]" />
                <span className="text-sm text-gray-600">Tổng:</span>
                <span className="font-bold text-[#E91E63] text-lg">
                  {pagination?.totalItems || 0}
                </span>
              </div>
              <button
                onClick={() => window.location.reload()}
                className="p-2.5 text-gray-600 hover:text-[#E91E63] hover:bg-gradient-to-r hover:from-pink-50 hover:to-orange-50 rounded-xl transition-all"
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
              <thead className="bg-gradient-to-r from-gray-50 to-orange-50/50">
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
                {users.length > 0 ? (
                  users.map((user) => (
                    <tr
                      key={user._id}
                      className="hover:bg-gradient-to-r hover:from-pink-50 hover:to-orange-50 transition-colors"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-[#E91E63] to-[#FF8C1A] rounded-full flex items-center justify-center text-white font-bold">
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
                              className="inline-flex items-center gap-1 px-3 py-2 text-[#E91E63] hover:text-white hover:bg-gradient-to-r hover:from-[#E91E63] hover:to-[#FF8C1A] rounded-lg transition-all border border-[#E91E63] hover:border-[#E91E63]"
                            >
                              <Eye className="w-4 h-4" />
                              <span className="text-xs font-semibold">Xem</span>
                            </button>
                          </Link>
                          {/* Sửa */}
                          <button
                            onClick={() => openModal(user)}
                            title="Sửa"
                            className="inline-flex items-center gap-1 px-3 py-2 text-blue-600 hover:text-white hover:bg-blue-600 rounded-lg transition-all border border-blue-600"
                          >
                            <Edit className="w-4 h-4" />
                            <span className="text-xs font-semibold">Sửa</span>
                          </button>
                          {/* Xóa */}
                          <button
                            title="Xóa"
                            onClick={() => handleDelete(user._id, user.name)}
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
                      {searchTerm
                        ? `Không tìm thấy người dùng nào phù hợp với từ khóa "${searchTerm}".`
                        : "Chưa có người dùng nào."}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
            {pagination && pagination.totalItems > 0 && (
              <Pagination
                page={pagination.page}
                limit={pagination.limit}
                totalItems={pagination.totalItems}
                onPageChange={(page: number) => setCurrentPage(page)}
              />
            )}
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
          closeModal={() => {
            closeModal();
            fetchUsers(currentPage, searchTerm);
          }}
          setUsers={setUsers}
        />
      </CommonModal>

      <ConfirmModal
        isOpen={confirmModal.isOpen}
        title={confirmModal.title}
        message={confirmModal.message}
        onClose={hideConfirm}
        onConfirm={confirmModal.onConfirm}
        confirmText={confirmModal.confirmText}
        cancelText={confirmModal.cancelText}
        type={confirmModal.type}
      />
    </div>
  );
};

export default UserManagement;
