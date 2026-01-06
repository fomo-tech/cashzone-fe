import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  Zap,
  Clock,
  Filter,
  BarChart2,
  Search,
  CheckCircle,
  Package,
  CreditCard,
  Target,
  TrendingUp,
  Loader2,
  AlertTriangle,
} from "lucide-react";
import taskService, { type Task } from "@/services/taskService";

interface OfferCategory {
  id: string;
  name: string;
  icon: React.ReactNode;
}

interface OfferTask {
  id: string;
  title: string;
  description: string;
  rewardAmount: number;
  rewardUnit: "VND" | "Points" | "Cashback %";
  platformName: string;
  category: string; // Category ID
  timeEstimate: string; // e.g., "5 phút"
  statusBadge: "Hot" | "New" | "Expiring" | "High Rate";
  completionRate: number; // Percentage
  imgUrl: string;
  link: string;
  requirements: Array<{ title: string; description: string } | string>; // Yêu cầu chi tiết để hoàn thành nhiệm vụ
}

const OFFER_CATEGORIES: OfferCategory[] = [
  { id: "all", name: "Tất cả", icon: <Filter size={16} /> },
  { id: "finance", name: "Tài chính", icon: <CreditCard size={16} /> },
  { id: "cashback", name: "Hoàn tiền", icon: <Package size={16} /> },
  { id: "point", name: "Tích điểm", icon: <Target size={16} /> },
  { id: "game", name: "Game/App", icon: <Zap size={16} /> },
  { id: "survey", name: "Khảo sát", icon: <BarChart2 size={16} /> },
  { id: "shopping", name: "Mua sắm", icon: <TrendingUp size={16} /> },
];

// Helper function để định dạng phần thưởng
const formatReward = (amount: number, unit: OfferTask["rewardUnit"]) => {
  if (unit === "VND") {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    })
      .format(amount)
      .replace("₫", "VNĐ");
  } else if (unit === "Cashback %") {
    return `${amount}%`;
  }
  return `${amount} Points`;
};

/**
 * Thẻ nhiệm vụ riêng lẻ (Offer Card) - Kích thước đã được thu nhỏ
 */
const OfferCard: React.FC<{
  offer: OfferTask;
}> = ({ offer }) => {
  const navigate = useNavigate();
  const badgeColors = {
    Hot: "bg-red-500",
    New: "bg-[#E91E63]",
    Expiring: "bg-yellow-500",
    "High Rate": "bg-[#E91E63]",
  };

  const rewardText = formatReward(offer.rewardAmount, offer.rewardUnit);

  const isCashback = offer.rewardUnit === "Cashback %";
  const isVND = offer.rewardUnit === "VND";

  const rewardStyle = useMemo(() => {
    if (isVND) {
      return "text-[#E91E63] font-black";
    }
    if (isCashback) {
      return "text-[#FF8C1A] font-black";
    }
    // Mặc định cho Points (Cam/Vàng)
    return "text-orange-500 font-black";
  }, [isVND, isCashback]);

  const rewardUnitLabel = useMemo(() => {
    if (isVND) return "Thưởng VNĐ";
    if (isCashback) return "Hoàn tiền";
    // Tên nhãn ngắn gọn, tập trung vào Points
    return "Points";
  }, [isVND, isCashback]);

  const handleJoinClick = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      navigate(`/tasks/${offer.id}`);
    },
    [offer.id, navigate]
  );

  return (
    <div className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden transition duration-300 hover:shadow-xl hover:border-pink-200 hover:ring-2 hover:ring-pink-100 cursor-pointer">
      {/* Main Content */}
      <div className="p-3 sm:p-4">
        <div className="flex gap-3 items-start">
          {/* Image & Badge */}
          <div className="relative shrink-0">
            <img
              src={offer.imgUrl}
              alt={offer.title}
              className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl object-cover shadow-md border-2 border-white ring-2 ring-gray-100"
              onError={(e) => {
                e.currentTarget.onerror = null;
                e.currentTarget.src = `https://placehold.co/100x100/CCCCCC/666666?text=${offer.platformName.substring(
                  0,
                  4
                )}`;
              }}
            />
            <span
              className={`absolute -top-2 -right-2 text-[10px] font-bold text-white px-2 py-0.5 rounded-full shadow-lg ${
                badgeColors[offer.statusBadge]
              }`}
            >
              {offer.statusBadge}
            </span>
          </div>

          {/* Content Column */}
          <div className="flex-1 min-w-0">
            {/* Title & Description */}
            <h3 className="text-base sm:text-lg font-bold text-gray-900 line-clamp-2 mb-1.5 leading-tight hover:text-[#E91E63] transition">
              {offer.title}
            </h3>
            <p className="text-xs sm:text-sm text-gray-600 line-clamp-2 mb-2">
              {offer.description}
            </p>

            {/* Metadata */}
            <div className="flex flex-wrap items-center gap-2 text-xs text-gray-600 mb-3">
              <span className="flex items-center font-medium bg-gray-50 px-2 py-1 rounded-lg">
                <Clock size={12} className="mr-1 text-[#E91E63]" />
                {offer.timeEstimate}
              </span>
              <span className="flex items-center font-medium bg-gray-50 px-2 py-1 rounded-lg">
                <CheckCircle size={12} className="mr-1 text-[#FF8C1A]" />
                {offer.completionRate}%
              </span>
              <span className="text-xs font-semibold text-gray-700 bg-gray-100 px-2 py-1 rounded-lg border border-gray-200">
                {offer.platformName}
              </span>
            </div>
          </div>
        </div>

        {/* Reward & CTA Row */}
        <div className="flex items-center justify-between gap-3 pt-3 border-t border-gray-100 mt-3">
          {/* Reward */}
          <div className="flex-1">
            <p className="text-[10px] text-gray-500 font-medium uppercase mb-0.5">
              {rewardUnitLabel}
            </p>
            <p className={`text-lg sm:text-xl font-black ${rewardStyle}`}>
              {rewardText}
            </p>
          </div>

          {/* CTA Button */}
          <button
            onClick={handleJoinClick}
            className="px-4 sm:px-5 py-2.5 sm:py-3 bg-gradient-to-br from-orange-500 via-orange-600 to-amber-600 text-white font-bold rounded-xl transition duration-200 text-xs sm:text-sm shadow-md hover:shadow-lg transform hover:scale-105 flex items-center gap-1.5 whitespace-nowrap"
          >
            <Zap size={14} className="sm:w-4 sm:h-4" />
            Tham gia
          </button>
        </div>
      </div>
    </div>
  );
};

// =========================================================================
// 4. MAIN PAGE COMPONENT
// =========================================================================

export default function App() {
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [sortOrder, setSortOrder] = useState<"reward" | "newest">("reward");
  const [searchTerm, setSearchTerm] = useState<string>("");

  // States cho API
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch tasks từ API
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await taskService.getTasks({
          status: "active",
          page: 1,
          limit: 100,
        });
        setTasks(response.data || []);
      } catch (err: any) {
        console.error("Error fetching tasks:", err);
        setError(err?.message || "Không thể tải danh sách nhiệm vụ");
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, []);

  // Map Task từ backend sang OfferTask format
  const mapTaskToOffer = useCallback((task: Task): OfferTask => {
    // Map task type to category
    const categoryMap: Record<string, string> = {
      survey: "survey",
      app_install: "game",
      registration: "finance",
      purchase: "shopping",
      social_media: "point",
      other: "all",
    };

    // Calculate completion rate
    const completionRate = task.maxCompletions
      ? Math.round((task.completedCount / task.maxCompletions) * 100)
      : Math.round((task.completedCount / 100) * 100);

    // Determine status badge
    let statusBadge: "Hot" | "New" | "Expiring" | "High Rate" = "New";
    if (task.reward >= 100000) {
      statusBadge = "Hot";
    } else if (completionRate >= 90) {
      statusBadge = "High Rate";
    }

    return {
      id: String(task._id),
      title: task.title,
      description: task.description || "",
      rewardAmount: task.reward,
      rewardUnit: "VND",
      platformName: task.platform || "Platform",
      category: categoryMap[task.type] || "all",
      timeEstimate: "5-10 phút",
      statusBadge,
      completionRate: Math.min(completionRate, 100),
      imgUrl: `https://placehold.co/100x100/10B981/FFFFFF?text=${(
        task.platform?.substring(0, 4) || "TASK"
      ).toUpperCase()}`,
      link: "#",
      requirements: task.requirements || [],
    };
  }, []);

  // Kết hợp data từ API và data mẫu
  const allOffers = useMemo(() => {
    const apiOffers = tasks.map(mapTaskToOffer);
    // Kết hợp với data mẫu nếu API không có data
    return apiOffers.length > 0 ? apiOffers : [];
  }, [tasks, mapTaskToOffer]);

  const filteredAndSortedOffers = useMemo(() => {
    let list = allOffers;

    if (activeCategory !== "all") {
      list = list.filter((offer) => offer.category === activeCategory);
    }
    if (searchTerm) {
      list = list.filter(
        (offer) =>
          offer.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          offer.platformName.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Sắp xếp: Ưu tiên VND > Points > Cashback
    if (sortOrder === "reward") {
      list.sort((a, b) => {
        // 1. VND (cao nhất)
        if (a.rewardUnit === "VND" && b.rewardUnit !== "VND") return -1;
        if (a.rewardUnit !== "VND" && b.rewardUnit === "VND") return 1;
        // 2. Points (cao thứ hai)
        if (a.rewardUnit === "Points" && b.rewardUnit !== "Points") return -1;
        if (a.rewardUnit !== "Points" && b.rewardUnit === "Points") return 1;
        // 3. Cashback % (cuối cùng)

        // Sắp xếp theo số lượng (trong cùng loại)
        return b.rewardAmount - a.rewardAmount;
      });
    } else if (sortOrder === "newest") {
      list.sort((a, b) => (b.id > a.id ? 1 : -1));
    }

    return list;
  }, [allOffers, activeCategory, sortOrder, searchTerm]);

  const getCategoryColor = (id: string) => {
    switch (id) {
      case "finance":
        return "text-indigo-600";
      case "cashback":
        return "text-[#FF8C1A]";
      case "point":
        return "text-orange-500";
      case "game":
        return "text-purple-600";
      case "survey":
        return "text-blue-600";
      case "shopping":
        return "text-pink-600";
      default:
        return "text-primary";
    }
  };

  return (
    <div
      className="min-h-screen py-4 sm:py-8 font-sans"
      style={{ "--primary-color": "var(--primary)" } as React.CSSProperties}
    >
      <div className="w-full max-w-7xl mx-auto px-3 sm:px-6">
        {/* HERO SECTION - Responsive và compact hơn */}
        <header className="bg-gradient-to-br from-orange-500 via-orange-600 to-amber-600 rounded-xl sm:rounded-2xl p-4 sm:p-6 mb-4 sm:mb-6 shadow-xl text-white relative overflow-hidden">
          <div className="relative z-10">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight mb-1">
              Săn Tiền Thưởng & Hoàn Tiền Hot!
            </h1>
            <p className="text-sm sm:text-base lg:text-lg opacity-95">
              Kiếm VNĐ, tích Points, nâng Rank — Tất cả trong một ứng dụng.
            </p>
          </div>

          {/* STATS SECTION - Responsive grid */}
          <div className="mt-4 sm:mt-6 grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3 lg:gap-4 relative z-10">
            {/* Stat 1 */}
            <div className="bg-white/15 p-2.5 sm:p-3 lg:p-4 rounded-lg sm:rounded-xl backdrop-blur-sm border border-white/20">
              <p className="text-xl sm:text-2xl lg:text-3xl font-black">24+</p>
              <p className="text-[10px] sm:text-xs opacity-90">
                Nhiệm vụ hoạt động
              </p>
            </div>

            {/* Stat 2 */}
            <div className="bg-white/15 p-2.5 sm:p-3 lg:p-4 rounded-lg sm:rounded-xl backdrop-blur-sm border border-white/20">
              <p className="text-xl sm:text-2xl lg:text-3xl font-black">75M+</p>
              <p className="text-[10px] sm:text-xs opacity-90">
                Tổng thưởng tháng
              </p>
            </div>

            {/* Stat 3: Points */}
            <div className="bg-orange-400/20 text-orange-100 p-2.5 sm:p-3 lg:p-4 rounded-lg sm:rounded-xl backdrop-blur-sm border-2 border-orange-300/50">
              <div className="flex items-center justify-between gap-1">
                <div className="min-w-0">
                  <p className="text-[9px] sm:text-[10px] font-semibold uppercase opacity-95 text-orange-200 flex items-center gap-1">
                    <Target size={12} className="shrink-0" />
                    <span className="truncate">Điểm Tích Lũy</span>
                  </p>
                  <p className="text-base sm:text-xl lg:text-2xl font-black text-white">
                    12,500
                  </p>
                </div>
                <a
                  href="#"
                  className="hidden sm:block bg-white text-gray-800 text-[10px] font-bold px-2 py-1 rounded-lg shadow-md hover:bg-gray-100 transition whitespace-nowrap"
                >
                  Nâng Rank
                </a>
              </div>
            </div>

            {/* Stat 4: Cashback */}
            <div className="bg-orange-400/20 text-orange-100 p-2.5 sm:p-3 lg:p-4 rounded-lg sm:rounded-xl backdrop-blur-sm border-2 border-orange-300/50">
              <div className="flex items-center justify-between gap-1">
                <div className="min-w-0">
                  <p className="text-[9px] sm:text-[10px] font-semibold uppercase opacity-95 text-orange-200 flex items-center gap-1">
                    <Package size={12} className="shrink-0" />
                    <span className="truncate">Cashback</span>
                  </p>
                  <p className="text-base sm:text-xl lg:text-2xl font-black text-white">
                    1.25M
                  </p>
                </div>
                <a
                  href="#"
                  className="hidden sm:block bg-white text-gray-800 text-[10px] font-bold px-2 py-1 rounded-lg shadow-md hover:bg-gray-100 transition whitespace-nowrap"
                >
                  Rút tiền
                </a>
              </div>
            </div>
          </div>
        </header>

        {/* CONTROLS (Filters, Search, Sort) - Premium Design */}
        <div className="relative overflow-hidden bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl border border-white mb-6">
          {/* Gradient Background Overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#E91E63]/5 via-[#EC407A]/5 to-[#FF8C1A]/5 rounded-3xl"></div>

          {/* Header */}
          <div className="relative px-6 py-5 border-b border-gray-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 via-orange-600 to-amber-600 flex items-center justify-center shadow-lg">
                <Filter size={18} className="text-white" />
              </div>
              <div>
                <h2 className="text-lg font-black bg-gradient-to-br from-orange-500 via-orange-600 to-amber-600 bg-clip-text text-transparent">
                  Bộ lọc & Tìm kiếm
                </h2>
                <p className="text-xs text-gray-500 mt-0.5">
                  Tìm nhiệm vụ phù hợp với bạn
                </p>
              </div>
            </div>
          </div>

          <div className="relative p-6">
            {/* Category Filter - Enhanced */}
            <div className="mb-5">
              <label className="block text-sm font-bold text-gray-700 mb-3 flex items-center gap-2">
                <span className="w-1 h-4 bg-gradient-to-b from-orange-500 via-orange-600 to-amber-600 rounded-full"></span>
                Danh mục
              </label>
              <div className="flex flex-wrap gap-2">
                {OFFER_CATEGORIES.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setActiveCategory(cat.id)}
                    className={`group flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 
                                  ${
                                    activeCategory === cat.id
                                      ? `bg-gradient-to-br from-orange-500 via-orange-600 to-amber-600 text-white shadow-lg shadow-pink-500/30 scale-105`
                                      : `bg-white ${getCategoryColor(
                                          cat.id
                                        )} border border-gray-200 hover:border-pink-300 hover:shadow-md hover:scale-105`
                                  }`}
                  >
                    <span
                      className={activeCategory === cat.id ? "text-white" : ""}
                    >
                      {cat.icon}
                    </span>
                    <span>{cat.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Search and Sort - Enhanced Grid */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-3 pt-5 border-t border-gray-100">
              {/* Search Input with Premium Styling */}
              <div className="md:col-span-3">
                <label className="block text-xs font-semibold text-gray-600 mb-2 ml-1">
                  Tìm kiếm
                </label>
                <div className="relative group">
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Nhập tên nhiệm vụ hoặc nền tảng..."
                    className="w-full pl-11 pr-4 py-3 border-2 border-gray-200 rounded-xl bg-white text-gray-700 text-sm font-medium 
                             focus:outline-none focus:border-pink-400 focus:ring-4 focus:ring-pink-100 
                             hover:border-gray-300 transition-all placeholder:text-gray-400"
                  />
                  <div className="absolute left-3.5 top-1/2 transform -translate-y-1/2 w-6 h-6 rounded-lg bg-gradient-to-br from-orange-500 via-orange-600 to-amber-600 flex items-center justify-center">
                    <Search size={14} className="text-white" />
                  </div>
                  {searchTerm && (
                    <button
                      onClick={() => setSearchTerm("")}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      ✕
                    </button>
                  )}
                </div>
              </div>

              {/* Sort Select with Premium Styling */}
              <div className="md:col-span-2">
                <label className="block text-xs font-semibold text-gray-600 mb-2 ml-1">
                  Sắp xếp theo
                </label>
                <div className="relative">
                  <div className="absolute left-3.5 top-1/2 transform -translate-y-1/2 pointer-events-none z-10">
                    {sortOrder === "reward" ? (
                      <TrendingUp size={16} className="text-[#E91E63]" />
                    ) : (
                      <Zap size={16} className="text-[#FF8C1A]" />
                    )}
                  </div>
                  <select
                    value={sortOrder}
                    onChange={(e) =>
                      setSortOrder(e.target.value as "reward" | "newest")
                    }
                    className="w-full py-3 pl-11 pr-10 border-2 border-gray-200 bg-white rounded-xl text-sm font-medium 
                             focus:outline-none focus:border-pink-400 focus:ring-4 focus:ring-pink-100 
                             hover:border-gray-300 transition-all appearance-none cursor-pointer"
                  >
                    <option value="reward">Phần thưởng cao nhất</option>
                    <option value="newest">Mới nhất</option>
                  </select>
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                    <svg
                      className="w-5 h-5 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            {/* Active Filters Display */}
            {(activeCategory !== "all" || searchTerm) && (
              <div className="mt-4 pt-4 border-t border-gray-100">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xs font-semibold text-gray-500">
                    Bộ lọc đang áp dụng:
                  </span>
                  {activeCategory !== "all" && (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-pink-100 to-orange-100 text-pink-700 text-xs font-bold rounded-lg border border-pink-200">
                      {
                        OFFER_CATEGORIES.find((c) => c.id === activeCategory)
                          ?.name
                      }
                      <button
                        onClick={() => setActiveCategory("all")}
                        className="ml-1 hover:text-pink-900"
                      >
                        ✕
                      </button>
                    </span>
                  )}
                  {searchTerm && (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-blue-100 to-cyan-100 text-blue-700 text-xs font-bold rounded-lg border border-blue-200">
                      "{searchTerm}"
                      <button
                        onClick={() => setSearchTerm("")}
                        className="ml-1 hover:text-blue-900"
                      >
                        ✕
                      </button>
                    </span>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* OFFER LIST */}
        <main>
          {loading ? (
            <div className="text-center py-12 sm:py-20 bg-white rounded-xl sm:rounded-2xl shadow-lg border border-gray-100">
              <Loader2 className="w-10 h-10 sm:w-12 sm:h-12 text-[#E91E63] animate-spin mx-auto mb-4" />
              <p className="text-gray-600 text-base sm:text-lg font-semibold">
                Đang tải nhiệm vụ...
              </p>
            </div>
          ) : error ? (
            <div className="text-center py-12 sm:py-20 bg-red-50 rounded-xl sm:rounded-2xl shadow-lg border border-red-200">
              <AlertTriangle
                size={40}
                className="sm:w-12 sm:h-12 text-red-500 mx-auto mb-4"
              />
              <p className="text-red-600 text-base sm:text-lg font-semibold mb-4 px-4">
                {error}
              </p>
              <button
                onClick={() => window.location.reload()}
                className="px-5 sm:px-6 py-2 sm:py-2.5 bg-red-600 text-white font-semibold rounded-xl hover:bg-red-700 transition shadow-lg text-sm sm:text-base"
              >
                Thử lại
              </button>
            </div>
          ) : (
            <>
              <div className="flex items-center justify-between mb-3 sm:mb-4 px-1">
                <h2 className="text-lg sm:text-2xl font-bold text-gray-900">
                  Kết quả
                  <span className="ml-2 text-base sm:text-xl text-[#E91E63]">
                    ({filteredAndSortedOffers.length})
                  </span>
                </h2>
              </div>

              {filteredAndSortedOffers.length === 0 ? (
                <div className="text-center text-sm sm:text-base text-gray-500 py-12 sm:py-16 bg-white rounded-xl sm:rounded-2xl shadow-lg border border-gray-100">
                  <Package size={48} className="mx-auto mb-4 text-gray-300" />
                  <p className="font-medium">
                    Không tìm thấy nhiệm vụ nào phù hợp
                  </p>
                  <p className="text-xs sm:text-sm text-gray-400 mt-2">
                    Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm
                  </p>
                </div>
              ) : (
                <div className="space-y-3 sm:space-y-4">
                  {filteredAndSortedOffers.map((offer) => (
                    <OfferCard key={offer.id} offer={offer} />
                  ))}

                  {/* Load More Button */}
                  <div className="text-center pt-4 pb-2">
                    <button className="group inline-flex items-center gap-2 px-5 py-2 bg-white text-gray-700 text-sm font-semibold rounded-xl border border-gray-200 hover:border-pink-300 hover:shadow-md hover:scale-[1.02] transition-all duration-200">
                      <TrendingUp
                        size={16}
                        className="text-gray-400 group-hover:text-[#E91E63] group-hover:rotate-12 transition-all"
                      />
                      <span className="group-hover:bg-gradient-to-r group-hover:from-[#E91E63] group-hover:to-[#FF8C1A] group-hover:bg-clip-text group-hover:text-transparent">
                        Tải thêm nhiệm vụ
                      </span>
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </main>
      </div>
    </div>
  );
}
