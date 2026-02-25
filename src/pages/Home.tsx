import React, { useEffect, useState } from "react";
import { useAuthStore } from "@/store/authStore";
import cashbackService, {
  type CashbackStatistics,
  type CashbackTransaction,
} from "@/services/cashbackService";
import taskService, { type Task } from "@/services/taskService";
import referralService, {
  type ReferralStats,
} from "@/services/referral.service";
import walletService, { type WalletInfo } from "@/services/walletService";
import { notification } from "@/utils/notification";
import { Link } from "react-router-dom";
import {
  TrendingUp,
  UserIcon,
  Wallet2Icon,
  ShoppingBag,
  CheckCircle2,
  Users,
  Banknote,
  Package,
} from "lucide-react";

const HomePage: React.FC = () => {
  const { user } = useAuthStore();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [latestTasks, setLatestTasks] = useState<Task[]>([]);
  const [statistics, setStatistics] = useState<CashbackStatistics | null>(null);
  const [referralStats, setReferralStats] = useState<ReferralStats | null>(
    null,
  );
  const [walletInfo, setWalletInfo] = useState<WalletInfo | null>(null);
  const [recentOrders, setRecentOrders] = useState<CashbackTransaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [dataFetched, setDataFetched] = useState(false);

  // Fetch data from APIs - Only once on mount
  useEffect(() => {
    // Prevent multiple fetches
    if (dataFetched) return;

    const controller = new AbortController();
    let isCancelled = false;

    const fetchData = async () => {
      try {
        setLoading(true);

        // Fetch latest tasks (newest campaigns)
        try {
          const latestTasksData = await taskService.getTasks({
            status: "active",
            limit: 6,
          });
          if (!isCancelled) {
            setLatestTasks(latestTasksData.data?.slice(0, 6) || []);
          }
        } catch (err) {
          console.error("Error fetching latest tasks:", err);
        }

        // Small delay to avoid rate limiting
        await new Promise((resolve) => setTimeout(resolve, 100));

        // Fetch featured tasks (campaigns)
        try {
          const tasksData = await taskService.getTasks({
            status: "active",
            isFeatured: true,
            limit: 8,
          });
          if (!isCancelled) {
            setTasks(tasksData.data?.slice(0, 8) || []);
          }
        } catch (err) {
          console.error("Error fetching tasks:", err);
        }

        // Fetch statistics if user is logged in
        if (user) {
          await new Promise((resolve) => setTimeout(resolve, 100));
          try {
            const [stats, refStats, wallet, orders] = await Promise.all([
              cashbackService.getMyCashbackStatistics(),
              referralService.getReferralStats().catch(() => null),
              walletService.getWalletInfo().catch(() => null),
              cashbackService
                .getMyCashbacks({ limit: 5, status: "completed" })
                .catch(() => ({
                  data: [],
                  pagination: { page: 1, limit: 5, total: 0, totalPages: 0 },
                })),
            ]);
            if (!isCancelled) {
              setStatistics(stats);
              setReferralStats(refStats);
              setWalletInfo(wallet);
              setRecentOrders(orders.data || []);
            }
          } catch (err) {
            console.error("Error fetching statistics:", err);
          }
        }

        if (!isCancelled) {
          setDataFetched(true);
        }
      } catch (error: any) {
        console.error("Error fetching home data:", error);
        if (!isCancelled && error?.response?.status !== 429) {
          notification({
            message: "Không thể tải một số dữ liệu. Vui lòng thử lại sau.",
            type: "warning",
          });
        }
      } finally {
        if (!isCancelled) {
          setLoading(false);
        }
      }
    };

    fetchData();

    // Cleanup function
    return () => {
      isCancelled = true;
      controller.abort();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Empty dependency array - only run once on mount

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[orange-600] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Đang tải dữ liệu...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen ">
      <div className="max-w-7xl mx-auto p-2 sm:p-2 lg:p-3">
        <div className="bg-white/95 backdrop-blur-md rounded-2xl sm:rounded-3xl shadow-[0_8px_30px_rgba(0,0,0,0.04)] overflow-hidden border border-white">
          {/* Header Section */}
          <div className="bg-gradient-to-r from-orange-500 to-amber-500 text-white p-3 sm:p-3 lg:p-4 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-72 h-72 bg-white/3 rounded-full blur-2xl" />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-5 items-center relative z-10">
              <div className="lg:col-span-2">
                <div className="inline-block px-2.5 py-1 bg-white/15 backdrop-blur-sm rounded-full mb-2">
                  <span className="text-xs font-bold text-white">
                    ⚡ Hoàn tiền 15%
                  </span>
                </div>
                <h2 className="text-xl sm:text-2xl lg:text-3xl font-black mb-2 leading-tight tracking-tight">
                  Mua Sắm Thông Minh
                  <br />
                  <span className="text-white/90">Nhận Tiền Hoàn Ngay</span>
                </h2>
                <p className="text-sm opacity-90 mb-2 sm:mb-3 max-w-xl font-bold">
                  Mua sắm tại hàng ngàn thương hiệu, nhận hoàn tiền tự động.
                  <span className="font-bold text-white">
                    {" "}
                    Rút tiền nhanh, không giới hạn!
                  </span>
                </p>

                <div className="flex flex-wrap gap-2 mb-3">
                  <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-3 py-1.5 rounded-full">
                    <svg
                      className="w-4 h-4"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span className="text-xs font-semibold">
                      Hoàn tiền tự động
                    </span>
                  </div>
                  <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full">
                    <svg
                      className="w-5 h-5"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span className="text-xs font-semibold">Rút tiền 24/7</span>
                  </div>
                  <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-3 py-1.5 rounded-full">
                    <svg
                      className="w-4 h-4"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span className="text-xs font-semibold">
                      1000+ thương hiệu
                    </span>
                  </div>
                </div>
              </div>

              {/* Ví Hoàn Tiền - Hiển thị trên cả mobile và desktop */}
              <div className="lg:col-span-1 flex justify-center relative mt-6 lg:mt-0">
                {/* Desktop version - Phone mockup */}
                <div className="hidden lg:flex w-52 h-96 bg-gray-800 rounded-[3rem] shadow-2xl p-2 items-center justify-center border-4 border-gray-700 transform rotate-3 hover:rotate-0 transition-transform duration-300">
                  <div className="w-full h-full bg-gradient-to-br from-white to-gray-50 rounded-[2.5rem] p-4 text-center flex flex-col justify-center">
                    <div className="mb-3">
                      <div className="w-16 h-16 bg-gradient-to-br from-orange-500 via-orange-600 to-amber-600 rounded-2xl mx-auto flex items-center justify-center shadow-lg">
                        <Wallet2Icon className="w-8 h-8 text-white" />
                      </div>
                    </div>
                    <p className="text-gray-500 text-sm font-semibold uppercase tracking-wide">
                      Ví Hoàn Tiền
                    </p>
                    <p className="text-3xl font-black bg-gradient-to-br from-orange-500 via-orange-600 to-amber-600 bg-clip-text text-transparent mt-2 mb-1">
                      {user
                        ? formatCurrency(user.wallet?.available || 0)
                        : "0đ"}
                    </p>
                    <p className="text-xs text-gray-400 mb-4">
                      Số dư có thể rút
                    </p>
                    <Link to="/cashback">
                      <button className="w-full bg-gradient-to-br from-orange-500 via-orange-600 to-amber-600 text-white font-bold text-sm py-3 px-4 rounded-xl shadow-lg hover:shadow-xl transition-all hover:scale-105">
                        Mua sắm ngay
                      </button>
                    </Link>
                  </div>
                </div>

                {/* Mobile version - Card style */}
                <div className="lg:hidden w-full max-w-sm">
                  <div className="bg-gradient-to-br from-white to-gray-50 rounded-2xl sm:rounded-3xl shadow-2xl p-4 sm:p-5 lg:p-6 border border-white/50">
                    <div className="flex items-center justify-between mb-3 sm:mb-4">
                      <div className="flex items-center gap-2 sm:gap-3">
                        <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-orange-500 via-orange-600 to-amber-600 rounded-lg sm:rounded-xl flex items-center justify-center shadow-md">
                          <Wallet2Icon className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                        </div>
                        <div>
                          <p className="text-gray-500 text-xs font-semibold uppercase tracking-wide">
                            Ví Của Bạn
                          </p>
                          <p className="text-gray-800 text-sm font-bold">
                            Hoàn Tiền
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="text-center py-2 md:py-3">
                      <p className="text-xl sm:text-2xl md:text-3xl font-black bg-gradient-to-br from-orange-500 via-orange-600 to-amber-600 bg-clip-text text-transparent mb-1">
                        {user
                          ? formatCurrency(user.wallet?.available || 0)
                          : "0đ"}
                      </p>
                      <p className="text-xs md:text-sm text-gray-400">
                        Số dư có thể rút bất kỳ lúc nào
                      </p>
                    </div>

                    <Link to="/cashback" className="block">
                      <button className="w-full bg-gradient-to-br from-orange-500 via-orange-600 to-amber-600 text-white font-bold py-2 md:py-3 px-3 md:px-4 rounded-xl md:rounded-2xl shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 text-xs md:text-sm">
                        <Wallet2Icon className="w-5 h-5" />
                        Mua sắm & Nhận hoàn tiền
                      </button>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* User Dashboard Statistics - Only show for logged in users */}
          {user && (
            <div className="p-6 sm:p-8 lg:p-12 bg-gradient-to-br from-gray-50 to-white">
              <div className="max-w-6xl mx-auto">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl sm:text-3xl font-black text-gray-800">
                    Thống Kê Của Bạn
                  </h2>
                  <Link
                    to="/wallet"
                    className="text-orange-600 hover:text-orange-700 font-semibold text-sm flex items-center gap-1"
                  >
                    Xem chi tiết
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </Link>
                </div>

                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  {/* Đơn Đã Hoàn */}
                  <div className="bg-white rounded-2xl p-5 shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-blue-100">
                    <div className="flex items-start justify-between mb-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-xl flex items-center justify-center shadow-lg">
                        <CheckCircle2 className="w-6 h-6 text-white" />
                      </div>
                    </div>
                    <p className="text-2xl font-black text-gray-800 mb-1">
                      {statistics?.completedAmount || 0}
                    </p>
                    <p className="text-sm text-gray-500 font-bold">
                      Đơn Đã Hoàn
                    </p>
                  </div>

                  {/* Tổng Hoàn Tiền */}
                  <div className="bg-white rounded-2xl p-5 shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-orange-100">
                    <div className="flex items-start justify-between mb-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-amber-600 rounded-xl flex items-center justify-center shadow-lg">
                        <Wallet2Icon className="w-6 h-6 text-white" />
                      </div>
                    </div>
                    <p className="text-2xl font-black text-gray-800 mb-1">
                      {formatCurrency(statistics?.completedCashback || 0)}
                    </p>
                    <p className="text-sm text-gray-500 font-bold">
                      Tổng Hoàn Tiền
                    </p>
                  </div>

                  {/* Mời Thành Công */}
                  <div className="bg-white rounded-2xl p-5 shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-purple-100">
                    <div className="flex items-start justify-between mb-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center shadow-lg">
                        <Users className="w-6 h-6 text-white" />
                      </div>
                    </div>
                    <p className="text-2xl font-black text-gray-800 mb-1">
                      {referralStats?.directReferrals || 0}
                    </p>
                    <p className="text-sm text-gray-500 font-bold">
                      Mời Thành Công
                    </p>
                  </div>

                  {/* Tổng Đã Rút */}
                  <div className="bg-white rounded-2xl p-5 shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-green-100">
                    <div className="flex items-start justify-between mb-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg">
                        <Banknote className="w-6 h-6 text-white" />
                      </div>
                    </div>
                    <p className="text-2xl font-black text-gray-800 mb-1">
                      {formatCurrency(walletInfo?.totalWithdrawn || 0)}
                    </p>
                    <p className="text-sm text-gray-500 font-bold">
                      Tổng Đã Rút
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Recent Orders Section - Only show for logged in users */}
          {user && (
            <div className="p-6 sm:p-8 lg:p-12 bg-white">
              <div className="max-w-6xl mx-auto">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl sm:text-3xl font-black text-gray-800 flex items-center gap-2">
                    <Package className="w-8 h-8 text-orange-600" />
                    Đơn Hàng Gần Đây
                  </h2>
                  <Link
                    to="/cashback-history"
                    className="text-orange-600 hover:text-orange-700 font-semibold text-sm flex items-center gap-1"
                  >
                    Xem tất cả
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </Link>
                </div>

                {recentOrders.length > 0 ? (
                  <div className="space-y-4">
                    {recentOrders.map((order) => (
                      <div
                        key={order._id}
                        className="bg-gradient-to-br from-white to-gray-50 rounded-2xl p-5 border border-gray-100 hover:shadow-lg transition-all duration-300"
                      >
                        <div className="flex items-center justify-between gap-4">
                          <div className="flex items-center gap-4 flex-1">
                            <div className="w-14 h-14 bg-gradient-to-br from-orange-100 to-amber-100 rounded-xl flex items-center justify-center flex-shrink-0">
                              {order.flatformId?.logo ? (
                                <img
                                  src={order.flatformId.logo}
                                  alt={order.flatformId.name}
                                  className="w-10 h-10 object-contain"
                                />
                              ) : (
                                <ShoppingBag className="w-7 h-7 text-orange-600" />
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <h3 className="text-base font-bold text-gray-800 mb-1 truncate">
                                {order.offerId?.title || "Đơn hàng"}
                              </h3>
                              <p className="text-sm text-gray-500">
                                {order.flatformId?.name || "Platform"} •{" "}
                                {new Date(order.createdAt).toLocaleDateString(
                                  "vi-VN",
                                )}
                              </p>
                            </div>
                          </div>
                          <div className="text-right flex-shrink-0">
                            <p className="text-lg font-black text-orange-600">
                              +{formatCurrency(order.cashbackAmount)}
                            </p>
                            <span className="inline-block px-3 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-full mt-1">
                              Đã hoàn
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="bg-gradient-to-br from-white to-gray-50 rounded-3xl p-12 border-2 border-dashed border-gray-200 text-center">
                    <div className="max-w-sm mx-auto">
                      <div className="w-20 h-20 bg-gradient-to-br from-orange-100 to-amber-100 rounded-2xl mx-auto mb-6 flex items-center justify-center relative">
                        <ShoppingBag className="w-10 h-10 text-orange-500" />
                        <div className="absolute -top-1 -right-1 w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center">
                          <svg
                            className="w-5 h-5 text-white"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" />
                          </svg>
                        </div>
                      </div>
                      <h3 className="text-2xl font-black text-gray-800 mb-3">
                        Đừng để tiền rơi! 💸
                      </h3>
                      <p className="text-gray-600 mb-6 leading-relaxed">
                        Hãy bắt đầu mua sắm qua link để nhận hoàn tiền ngay vào
                        túi nhé.
                      </p>
                      <Link to="/cashback">
                        <button className="px-8 py-3 bg-gradient-to-r from-orange-500 to-amber-600 text-white font-bold rounded-full shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 inline-flex items-center gap-2">
                          <svg
                            className="w-5 h-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M13 10V3L4 14h7v7l9-11h-7z"
                            />
                          </svg>
                          LẤY LINK HOÀN TIỀN NGAY
                        </button>
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Community Section - Cộng Đồng */}
          <div className="p-6 sm:p-8 lg:p-12 bg-white">
            <div className="max-w-5xl mx-auto">
              {/* Header */}
              <div className="flex items-center gap-3 mb-6">
                <div className="w-14 h-14 bg-gradient-to-br from-orange-500 to-amber-600 rounded-2xl flex items-center justify-center shadow-lg">
                  <svg
                    className="w-7 h-7 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                    />
                  </svg>
                </div>
                <div>
                  <h2 className="text-2xl sm:text-3xl font-black text-gray-800">
                    Cộng Đồng Hữu Duyên Hoàn Tiền
                  </h2>
                </div>
                <span className="px-3 py-1 bg-gradient-to-r from-orange-500 to-amber-600 text-white text-xs font-bold rounded-full shadow-lg ml-auto">
                  MỚI
                </span>
              </div>

              {/* Community Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* Group Facebook Card */}
                <a
                  href="https://www.facebook.com/groups/your-group"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group"
                >
                  <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-100 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-blue-200/20 rounded-full blur-2xl" />

                    <div className="flex items-start gap-4 relative z-10">
                      <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                        <svg
                          className="w-8 h-8 text-white"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                      </div>

                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-gray-800 mb-2 group-hover:text-blue-600 transition-colors">
                          Group Facebook
                        </h3>
                        <p className="text-gray-600 text-sm leading-relaxed mb-4">
                          Tham gia cộng đồng Hữu Duyên Hoàn Tiền để nhận hỗ trợ
                          & kinh nghiệm
                        </p>

                        <div className="flex items-center gap-2 text-blue-600 font-semibold text-sm">
                          <span>Tham gia ngay</span>
                          <svg
                            className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M9 5l7 7-7 7"
                            />
                          </svg>
                        </div>
                      </div>
                    </div>
                  </div>
                </a>

                {/* Fanpage Facebook Card */}
                <a
                  href="https://www.facebook.com/your-fanpage"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group"
                >
                  <div className="bg-gradient-to-br from-indigo-50 to-blue-50 rounded-2xl p-6 border border-indigo-100 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-200/20 rounded-full blur-2xl" />

                    <div className="flex items-start gap-4 relative z-10">
                      <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                        <svg
                          className="w-8 h-8 text-white"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                        </svg>
                      </div>

                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-gray-800 mb-2 group-hover:text-indigo-600 transition-colors">
                          Fanpage Facebook
                        </h3>
                        <p className="text-gray-600 text-sm leading-relaxed mb-4">
                          Cập nhật tin tức, sự kiện và ưu đãi mới nhất từ Caffi
                        </p>

                        <div className="flex items-center gap-2 text-indigo-600 font-semibold text-sm">
                          <span>Theo dõi ngay</span>
                          <svg
                            className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M9 5l7 7-7 7"
                            />
                          </svg>
                        </div>
                      </div>
                    </div>
                  </div>
                </a>
              </div>

              {/* Additional Info */}
              <div className="mt-6 text-center">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-orange-50 to-amber-50 rounded-full border border-orange-100">
                  <svg
                    className="w-5 h-5 text-orange-600"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <p className="text-sm text-gray-700">
                    <span className="font-bold text-orange-600">5,000+</span>{" "}
                    thành viên đang tích cực chia sẻ kinh nghiệm kiếm tiền
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Footer Summary */}
          <div className="bg-gradient-to-r from-pink-50 to-orange-50 p-10 border-t border-gray-200 flex flex-col md:flex-row justify-between items-center rounded-b-[32px] gap-8">
            {/* Summary */}
            <div className="mb-6 md:mb-0">
              <h4 className="text-xl font-bold text-gray-800 mb-2 flex items-center">
                <TrendingUp className="w-5 h-5 mr-2 text-[orange-600]" />
                {user ? "Tổng quan của bạn" : "Tổng quan hoàn tiền"}
              </h4>
              <p className="text-4xl  text-[orange-600]">
                {user && statistics
                  ? formatCurrency(statistics.totalCashback)
                  : "450.000.000₫"}
              </p>
              <p className="text-sm text-gray-500">
                {user
                  ? "Tổng số tiền hoàn về ví của bạn"
                  : "Tổng số tiền đã hoàn về ví người dùng"}
              </p>
            </div>

            {/* Dashboard Actions */}
            <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
              <Link
                to={user ? "/cashback-history" : "/"}
                className="group w-full sm:w-auto px-8 py-4 text-lg font-bold rounded-2xl text-white bg-gradient-to-br from-orange-500 via-orange-600 to-amber-600 shadow-xl hover:shadow-2xl transition-all duration-300 flex items-center justify-center gap-2"
              >
                <UserIcon />
                {user ? "Vào Dashboard" : "Đăng nhập ngay"}
                <svg
                  className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M13 7l5 5m0 0l-5 5m5-5H6"
                  />
                </svg>
              </Link>

              <Link
                to="/wallet"
                className="w-full sm:w-auto px-8 py-4 text-lg font-bold rounded-2xl text-[orange-600] bg-white border-2 border-[orange-600] hover:bg-pink-50 transition flex items-center justify-center gap-2"
              >
                <Wallet2Icon className="w-5 h-5" />
                Xem ví
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
