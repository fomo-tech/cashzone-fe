import React, { useState, useMemo } from "react";
import {
  Plus,
  CheckCircle,
  Clock,
  XCircle,
  BarChart2,
  Zap,
  Search,
  RefreshCw,
  Eye,
  TrendingUp,
  DollarSign,
  Target,
  Gift,
} from "lucide-react";

// Định nghĩa kiểu dữ liệu cho Chiến dịch/Nhiệm vụ (Campaign/Offer)
interface Campaign {
  id: number;
  title: string;
  category: "Tài chính" | "Game/App" | "Khảo sát" | "Mua sắm" | "Khác";
  reward: number; // VND hoặc Points
  rewardType: "VND" | "Points";
  status: "Active" | "Expired" | "Pending" | "Paused";
  conversionRate: number; // Tỷ lệ chuyển đổi thành công (%)
  targetAudience: string; // Ví dụ: 18+, User mới
  isHot: boolean;
  isNew: boolean;
  deadline: string; // Hạn chót
}

// Dữ liệu giả định dựa trên hình ảnh bạn cung cấp
const MOCK_CAMPAIGNS: Campaign[] = [
  {
    id: 101,
    title: "Đăng ký tài khoản Ngân hàng A, nhận ngay 200K",
    category: "Tài chính",
    reward: 200000,
    rewardType: "VND",
    status: "Active",
    conversionRate: 85,
    targetAudience: "18+, KYC Online",
    isHot: true,
    isNew: false,
    deadline: "2025-01-31",
  },
  {
    id: 102,
    title: "Chơi game Thần Rồng Đại Chiến đạt cấp 10",
    category: "Game/App",
    reward: 50000,
    rewardType: "VND",
    status: "Active",
    conversionRate: 15,
    targetAudience: "Cài đặt mới",
    isHot: false,
    isNew: true,
    deadline: "2024-12-31",
  },
  {
    id: 103,
    title: "Hoàn thành Khảo sát thị trường về Smartphone",
    category: "Khảo sát",
    reward: 500,
    rewardType: "Points",
    status: "Expired", // Giả định đã hết hạn
    conversionRate: 60,
    targetAudience: "Người dùng di động",
    isHot: false,
    isNew: false,
    deadline: "2024-11-30",
  },
  {
    id: 104,
    title: "Mua hàng tại sàn E-commerce Z nhận Cashback 5%",
    category: "Mua sắm",
    reward: 5,
    rewardType: "Points", // Reward là 5%
    status: "Paused",
    conversionRate: 40,
    targetAudience: "Tất cả user",
    isHot: false,
    isNew: false,
    deadline: "2025-02-28",
  },
];

// Hàm format tiền tệ Việt Nam
const formatCurrency = (amount: number, type: "VND" | "Points") => {
  if (type === "VND") {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    })
      .format(amount)
      .replace("₫", " VND");
  }
  return `${amount} Points`;
};

const TaskManagement: React.FC = () => {
  const [campaigns, setCampaigns] = useState<Campaign[]>(MOCK_CAMPAIGNS);
  const [filterCategory, setFilterCategory] = useState<
    "All" | Campaign["category"]
  >("All");
  const [filterStatus, setFilterStatus] = useState<"All" | Campaign["status"]>(
    "All"
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCampaign, setEditingCampaign] = useState<Campaign | null>(null);

  // State cho form thêm/sửa
  const [formData, setFormData] = useState<
    Omit<Campaign, "id" | "isHot" | "isNew" | "conversionRate">
  >({
    title: "",
    category: "Khác",
    reward: 0,
    rewardType: "VND",
    status: "Pending",
    targetAudience: "",
    deadline: new Date().toISOString().split("T")[0],
  });

  // Tính toán thống kê tổng quan
  const stats = useMemo(() => {
    const total = campaigns.length;
    const active = campaigns.filter((c) => c.status === "Active").length;
    const highReward = campaigns.filter(
      (c) => c.rewardType === "VND" && c.reward >= 100000
    ).length;
    const avgConversion =
      campaigns.reduce((sum, c) => sum + c.conversionRate, 0) / (total || 1);

    return {
      total,
      active,
      highReward,
      avgConversion: avgConversion.toFixed(1),
    };
  }, [campaigns]);

  // Xử lý Thay đổi Status (Active/Paused)
  const handleStatusChange = (id: number, newStatus: Campaign["status"]) => {
    const updatedCampaigns = campaigns.map((c) =>
      c.id === id ? { ...c, status: newStatus } : c
    );
    setCampaigns(updatedCampaigns);
  };

  // Xử lý Xóa Nhiệm Vụ
  const handleDelete = (id: number, title: string) => {
    console.log(`Yêu cầu xóa Chiến dịch: "${title}" (ID: ${id}).`);
    setCampaigns(campaigns.filter((c) => c.id !== id));
  };

  // Mở Modal và thiết lập dữ liệu
  const openModal = (campaignToEdit: Campaign | null = null) => {
    setEditingCampaign(campaignToEdit);
    if (campaignToEdit) {
      setFormData({
        title: campaignToEdit.title,
        category: campaignToEdit.category,
        reward: campaignToEdit.reward,
        rewardType: campaignToEdit.rewardType,
        status: campaignToEdit.status,
        targetAudience: campaignToEdit.targetAudience,
        deadline: campaignToEdit.deadline,
      });
    } else {
      setFormData({
        title: "",
        category: "Khác",
        reward: 0,
        rewardType: "VND",
        status: "Pending",
        targetAudience: "",
        deadline: new Date().toISOString().split("T")[0],
      });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingCampaign(null);
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "number" ? parseFloat(value) : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const baseData = {
      title: formData.title,
      category: formData.category,
      reward: formData.reward,
      rewardType: formData.rewardType,
      status: formData.status,
      targetAudience: formData.targetAudience,
      deadline: formData.deadline,
    };

    if (editingCampaign) {
      // Logic Sửa Campaign (Giữ nguyên các giá trị không đổi như isHot, conversionRate)
      setCampaigns(
        campaigns.map((c) =>
          c.id === editingCampaign.id ? { ...editingCampaign, ...baseData } : c
        )
      );
      console.log(`Đã cập nhật Chiến dịch: ${formData.title}`);
    } else {
      // Logic Thêm Campaign Mới
      const newId =
        campaigns.length > 0 ? Math.max(...campaigns.map((c) => c.id)) + 1 : 1;
      const campaignToAdd: Campaign = {
        ...baseData,
        id: newId,
        isHot: false,
        isNew: true,
        conversionRate: 0, // Mới tạo nên tỷ lệ là 0
        rewardType: baseData.rewardType as Campaign["rewardType"],
      };
      setCampaigns([...campaigns, campaignToAdd]);
      console.log(`Đã thêm Chiến dịch mới: ${campaignToAdd.title}`);
    }
    closeModal();
  };

  // Lọc và tìm kiếm nhiệm vụ
  const filteredCampaigns = campaigns
    .filter((c) => {
      const categoryMatch =
        filterCategory === "All" || c.category === filterCategory;
      const statusMatch = filterStatus === "All" || c.status === filterStatus;
      const searchMatch = c.title
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      return categoryMatch && statusMatch && searchMatch;
    })
    .sort((a, b) => {
      // Sắp xếp: Active lên trên, sau đó là Hot/New
      if (a.status === "Active" && b.status !== "Active") return -1;
      if (a.status !== "Active" && b.status === "Active") return 1;
      if (a.isHot && !b.isHot) return -1;
      if (!a.isHot && b.isHot) return 1;
      if (a.isNew && !b.isNew) return -1;
      if (!a.isNew && b.isNew) return 1;
      return 0;
    });

  // Component cho trạng thái
  const StatusBadge: React.FC<{ status: Campaign["status"] }> = ({
    status,
  }) => {
    let colorClass = "";
    let text = "";

    switch (status) {
      case "Active":
        colorClass = "bg-green-100 text-green-800";
        text = "Đang chạy";
        break;
      case "Expired":
        colorClass = "bg-slate-200 text-slate-700";
        text = "Đã hết hạn";
        break;
      case "Pending":
        colorClass = "bg-amber-100 text-amber-800";
        text = "Chờ duyệt";
        break;
      case "Paused":
        colorClass = "bg-blue-100 text-blue-800";
        text = "Tạm dừng";
        break;
    }

    return (
      <span
        className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${colorClass}`}
      >
        {text}
      </span>
    );
  };

  // Component Card Thống Kê
  const StatCard: React.FC<{
    icon: React.ReactNode;
    title: string;
    value: string | number;
    color: string;
  }> = ({ icon, title, value, color }) => (
    <div className="p-5 bg-white rounded-xl shadow-lg border border-slate-100 flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-slate-500">{title}</p>
        <p className={`text-2xl font-bold ${color} mt-1`}>{value}</p>
      </div>
      <div
        className={`flex items-center justify-center w-12 h-12 rounded-full ${color}/10`}
      >
        {React.cloneElement(icon as React.ReactElement, {
          className: `w-6 h-6 ${color}`,
        })}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-100 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-extrabold text-slate-800 flex items-center gap-3">
            <Target className="w-8 h-8 text-red-600" />
            Quản Lý Chiến Dịch/Nhiệm Vụ Người Dùng
          </h1>
          <button
            onClick={() => openModal()}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-xl shadow-md text-white bg-red-600 hover:bg-red-700 transition duration-300"
          >
            <Plus className="w-5 h-5 mr-2" />
            Tạo Chiến Dịch Mới
          </button>
        </div>

        {/* 1. Thống kê Tổng quan (Stats) */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <StatCard
            icon={<Gift />}
            title="Tổng Chiến Dịch"
            value={stats.total}
            color="text-slate-600"
          />
          <StatCard
            icon={<TrendingUp />}
            title="Đang Hoạt Động"
            value={stats.active}
            color="text-green-600"
          />
          <StatCard
            icon={<DollarSign />}
            title="Thưởng Lớn (>=100K VND)"
            value={stats.highReward}
            color="text-red-600"
          />
          <StatCard
            icon={<Target />}
            title="Tỷ lệ Chuyển đổi TB"
            value={`${stats.avgConversion}%`}
            color="text-blue-600"
          />
        </div>

        {/* 2. Bảng Nhiệm Vụ */}
        <div className="bg-white rounded-xl shadow-lg border border-slate-100 p-6">
          <h2 className="text-xl font-bold text-slate-800 mb-4 border-b pb-2">
            Danh Sách Chiến Dịch
          </h2>

          {/* Thanh Lọc & Tìm kiếm */}
          <div className="flex flex-col md:flex-row gap-4 mb-5 items-center">
            <div className="relative w-full md:w-80">
              <Search className="w-5 h-5 text-slate-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
              <input
                type="text"
                placeholder="Tìm theo Tiêu đề..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-xl focus:ring-red-500 focus:border-red-500 text-slate-700"
              />
            </div>

            <select
              value={filterCategory}
              onChange={(e) =>
                setFilterCategory(
                  e.target.value as Campaign["category"] | "All"
                )
              }
              className="w-full md:w-48 px-4 py-2 border border-slate-300 rounded-xl bg-white focus:ring-red-500 focus:border-red-500 text-slate-700"
            >
              <option value="All">Tất cả Danh mục</option>
              <option value="Tài chính">Tài chính</option>
              <option value="Game/App">Game/App</option>
              <option value="Khảo sát">Khảo sát</option>
              <option value="Mua sắm">Mua sắm</option>
              <option value="Khác">Khác</option>
            </select>

            <select
              value={filterStatus}
              onChange={(e) =>
                setFilterStatus(e.target.value as Campaign["status"] | "All")
              }
              className="w-full md:w-48 px-4 py-2 border border-slate-300 rounded-xl bg-white focus:ring-red-500 focus:border-red-500 text-slate-700"
            >
              <option value="All">Tất cả Trạng thái</option>
              <option value="Active">Đang chạy</option>
              <option value="Paused">Tạm dừng</option>
              <option value="Pending">Chờ duyệt</option>
              <option value="Expired">Đã hết hạn</option>
            </select>

            <p className="text-sm text-slate-500 ml-auto">
              Hiển thị:{" "}
              <span className="font-bold text-slate-800">
                {filteredCampaigns.length}
              </span>{" "}
              chiến dịch
            </p>
          </div>

          {/* Bảng dữ liệu */}
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Tiêu đề (Tags)
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Danh mục
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Phần thưởng
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Tỷ lệ C.Đổi
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Trạng thái
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Hạn chót
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Hành động
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-slate-100">
                {filteredCampaigns.length > 0 ? (
                  filteredCampaigns.map((c) => (
                    <tr
                      key={c.id}
                      className="hover:bg-red-50 transition-colors"
                    >
                      <td className="px-6 py-4 max-w-sm text-sm font-medium text-slate-900">
                        <div className="flex flex-col">
                          <span>{c.title}</span>
                          <div className="mt-1 flex gap-2">
                            {c.isHot && (
                              <span className="text-red-500 text-xs font-bold border border-red-500 px-2 py-0.5 rounded-full">
                                HOT
                              </span>
                            )}
                            {c.isNew && (
                              <span className="text-blue-500 text-xs font-bold border border-blue-500 px-2 py-0.5 rounded-full">
                                NEW
                              </span>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                        {c.category}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-red-600">
                        {formatCurrency(c.reward, c.rewardType)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                        {c.conversionRate}%
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <StatusBadge status={c.status} />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-red-500 font-medium">
                        {c.deadline}
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-center">
                        <div className="flex justify-center gap-2">
                          <button
                            onClick={() =>
                              handleStatusChange(
                                c.id,
                                c.status === "Active" ? "Paused" : "Active"
                              )
                            }
                            title={
                              c.status === "Active" ? "Tạm dừng" : "Kích hoạt"
                            }
                            disabled={
                              c.status === "Expired" || c.status === "Pending"
                            }
                            className={`p-2 rounded-full transition duration-150 border 
                                    ${
                                      c.status === "Active"
                                        ? "text-blue-600 hover:bg-blue-600 hover:text-white border-blue-600"
                                        : "text-green-600 hover:bg-green-600 hover:text-white border-green-600"
                                    }
                                    ${
                                      c.status === "Expired" ||
                                      c.status === "Pending"
                                        ? "opacity-50 cursor-not-allowed"
                                        : ""
                                    }`}
                          >
                            {c.status === "Active" ? (
                              <Clock className="w-5 h-5" />
                            ) : (
                              <Zap className="w-5 h-5" />
                            )}
                          </button>
                          <button
                            onClick={() => openModal(c)}
                            title="Sửa chi tiết"
                            className="text-slate-600 hover:text-white hover:bg-slate-600 border border-slate-600 p-2 rounded-full transition duration-150"
                          >
                            <Eye className="w-5 h-5" />
                          </button>
                          <button
                            onClick={() => handleDelete(c.id, c.title)}
                            title="Xóa"
                            className="text-red-600 hover:text-white hover:bg-red-600 border border-red-600 p-2 rounded-full transition duration-150"
                          >
                            <XCircle className="w-5 h-5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} className="p-8 text-center text-slate-500">
                      Không tìm thấy chiến dịch nào phù hợp.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Modal Thêm/Sửa Campaign */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg p-6 transform transition-all duration-300 scale-100">
            <div className="flex justify-between items-center border-b pb-3 mb-4">
              <h3 className="text-xl font-bold text-slate-800">
                {editingCampaign
                  ? "Sửa Chi Tiết Chiến Dịch"
                  : "Tạo Chiến Dịch Mới"}
              </h3>
              <button
                onClick={closeModal}
                className="text-slate-400 hover:text-slate-600"
              >
                <XCircle className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Tiêu đề */}
              <div>
                <label className="block text-sm font-medium text-slate-700">
                  Tiêu đề Chiến dịch
                </label>
                <input
                  type="text"
                  name="title"
                  required
                  value={formData.title}
                  onChange={handleChange}
                  className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-lg shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                {/* Danh mục */}
                <div>
                  <label className="block text-sm font-medium text-slate-700">
                    Danh mục
                  </label>
                  <select
                    name="category"
                    required
                    value={formData.category}
                    onChange={handleChange}
                    className="mt-1 block w-full px-3 py-2 border border-slate-300 bg-white rounded-lg shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500"
                  >
                    <option value="Tài chính">Tài chính</option>
                    <option value="Game/App">Game/App</option>
                    <option value="Khảo sát">Khảo sát</option>
                    <option value="Mua sắm">Mua sắm</option>
                    <option value="Khác">Khác</option>
                  </select>
                </div>

                {/* Trạng thái */}
                <div>
                  <label className="block text-sm font-medium text-slate-700">
                    Trạng thái
                  </label>
                  <select
                    name="status"
                    required
                    value={formData.status}
                    onChange={handleChange}
                    className="mt-1 block w-full px-3 py-2 border border-slate-300 bg-white rounded-lg shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500"
                  >
                    <option value="Active">Đang chạy</option>
                    <option value="Paused">Tạm dừng</option>
                    <option value="Pending">Chờ duyệt</option>
                    <option value="Expired">Đã hết hạn (Chỉ xem)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                {/* Phần thưởng */}
                <div>
                  <label className="block text-sm font-medium text-slate-700">
                    Giá trị Thưởng
                  </label>
                  <input
                    type="number"
                    name="reward"
                    required
                    value={formData.reward}
                    onChange={handleChange}
                    min="0"
                    className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-lg shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500"
                  />
                </div>
                {/* Loại thưởng */}
                <div>
                  <label className="block text-sm font-medium text-slate-700">
                    Loại Thưởng
                  </label>
                  <select
                    name="rewardType"
                    required
                    value={formData.rewardType}
                    onChange={handleChange}
                    className="mt-1 block w-full px-3 py-2 border border-slate-300 bg-white rounded-lg shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500"
                  >
                    <option value="VND">VND (Tiền mặt)</option>
                    <option value="Points">Points (Điểm)</option>
                  </select>
                </div>
                {/* Hạn chót */}
                <div>
                  <label className="block text-sm font-medium text-slate-700">
                    Hạn chót
                  </label>
                  <input
                    type="date"
                    name="deadline"
                    required
                    value={formData.deadline}
                    onChange={handleChange}
                    className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-lg shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500"
                  />
                </div>
              </div>

              {/* Đối tượng mục tiêu */}
              <div>
                <label className="block text-sm font-medium text-slate-700">
                  Đối tượng mục tiêu (Điều kiện)
                </label>
                <input
                  type="text"
                  name="targetAudience"
                  required
                  value={formData.targetAudience}
                  onChange={handleChange}
                  placeholder="Ví dụ: 18+, KYC Online, Cài đặt mới"
                  className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-lg shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500"
                />
              </div>

              {/* Nút Submit */}
              <div className="pt-4">
                <button
                  type="submit"
                  className="w-full py-2 px-4 border border-transparent rounded-xl shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition duration-300"
                >
                  {editingCampaign
                    ? "Lưu Thay Đổi Chiến Dịch"
                    : "Tạo Chiến Dịch"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default TaskManagement;
