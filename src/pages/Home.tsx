import React, { useEffect, useState, useRef } from "react";
import { useAuthStore } from "@/store/authStore";
import cashbackService, {
  type CashbackStatistics,
} from "@/services/cashbackService";
import taskService, { type Task } from "@/services/taskService";
import { notification } from "@/utils/notification";
import { Link } from "react-router-dom";
import { TrendingUp, UserIcon, Wallet2Icon } from "lucide-react";
import PriorityProducts from "@/components/cashback/PriorityProducts";

// Custom hook for counting animation
const useCountUp = (
  end: number,
  duration: number = 2000,
  shouldStart: boolean = false
) => {
  const [count, setCount] = useState(0);
  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    if (!shouldStart || hasAnimated) return;

    setHasAnimated(true);
    let startTime: number | null = null;
    const startValue = 0;

    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / duration, 1);

      // Easing function for smooth animation
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      const currentCount = Math.floor(
        easeOutQuart * (end - startValue) + startValue
      );

      setCount(currentCount);

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        setCount(end);
      }
    };

    requestAnimationFrame(animate);
  }, [end, duration, shouldStart, hasAnimated]);

  return count;
};

const HomePage: React.FC = () => {
  const { user } = useAuthStore();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [latestTasks, setLatestTasks] = useState<Task[]>([]);
  const [statistics, setStatistics] = useState<CashbackStatistics | null>(null);
  const [loading, setLoading] = useState(true);
  const [dataFetched, setDataFetched] = useState(false);
  const [statsVisible, setStatsVisible] = useState(false);
  const statsRef = useRef<HTMLDivElement>(null);

  // Counting animations
  const userCount = useCountUp(50, 2000, statsVisible);
  const cashbackCount = useCountUp(450, 2000, statsVisible);
  const brandCount = useCountUp(1000, 2000, statsVisible);
  const campaignCount = useCountUp(200, 2000, statsVisible);

  // Intersection Observer for stats section
  useEffect(() => {
    const currentRef = statsRef.current;

    // Fallback: nếu section đã visible ngay từ đầu, trigger animation sau 500ms
    const fallbackTimer = setTimeout(() => {
      if (!statsVisible) {
        setStatsVisible(true);
      }
    }, 500);

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !statsVisible) {
            clearTimeout(fallbackTimer);
            setStatsVisible(true);
          }
        });
      },
      { threshold: 0.1 }
    );

    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      clearTimeout(fallbackTimer);
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [statsVisible]);

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
            const stats = await cashbackService.getMyCashbackStatistics();
            if (!isCancelled) {
              setStatistics(stats);
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
          <div className="w-16 h-16 border-4 border-[#E91E63] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Đang tải dữ liệu...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen font-sans">
      <div className="max-w-7xl mx-auto p-2 sm:p-3 lg:p-4">
        <div className="bg-white/80 backdrop-blur-md rounded-[32px] shadow-[0_20px_60px_rgba(0,0,0,0.08)] overflow-hidden border border-white">
          {/* Header Section */}
          <div className="bg-gradient-to-br from-[#E91E63] via-[#EC407A] to-[#FF8C1A] text-white p-3 sm:p-4 lg:p-5 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-72 h-72 bg-white/5 rounded-full blur-2xl" />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-center relative z-10">
              <div className="lg:col-span-2">
                <div className="inline-block px-3 py-1.5 bg-white/20 backdrop-blur-sm rounded-full mb-3">
                  <span className="text-xs font-bold text-white">
                    ⚡ Hoàn tiền lên đến 15%
                  </span>
                </div>
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black mb-2 sm:mb-3 leading-tight tracking-tight">
                  Mua Sắm Thông Minh
                  <br />
                  <span className="text-white/90">Nhận Tiền Hoàn Ngay</span>
                </h2>
                <p className="text-sm sm:text-base opacity-95 mb-3 sm:mb-4 max-w-xl font-medium">
                  Mua sắm tại hàng ngàn thương hiệu yêu thích, nhận hoàn tiền tự
                  động vào ví.
                  <span className="font-bold text-white">
                    {" "}
                    Rút tiền nhanh chóng, không giới hạn!
                  </span>
                </p>

                <div className="flex flex-wrap gap-3 mb-4">
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
                      <div className="w-16 h-16 bg-gradient-to-br from-[#E91E63] to-[#FF8C1A] rounded-2xl mx-auto flex items-center justify-center shadow-lg">
                        <Wallet2Icon className="w-8 h-8 text-white" />
                      </div>
                    </div>
                    <p className="text-gray-500 text-sm font-semibold uppercase tracking-wide">
                      Ví Hoàn Tiền
                    </p>
                    <p className="text-3xl font-black bg-gradient-to-r from-[#E91E63] to-[#FF8C1A] bg-clip-text text-transparent mt-2 mb-1">
                      {user
                        ? formatCurrency(user.wallet?.available || 0)
                        : "0đ"}
                    </p>
                    <p className="text-xs text-gray-400 mb-4">
                      Số dư có thể rút
                    </p>
                    <Link to="/cashback">
                      <button className="w-full bg-gradient-to-r from-[#E91E63] to-[#FF8C1A] text-white font-bold text-sm py-3 px-4 rounded-xl shadow-lg hover:shadow-xl transition-all hover:scale-105">
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
                        <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-[#E91E63] to-[#FF8C1A] rounded-lg sm:rounded-xl flex items-center justify-center shadow-md">
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
                      <p className="text-xl sm:text-2xl md:text-3xl font-black bg-gradient-to-r from-[#E91E63] to-[#FF8C1A] bg-clip-text text-transparent mb-1">
                        {user
                          ? formatCurrency(user.wallet?.available || 0)
                          : "0đ"}
                      </p>
                      <p className="text-xs md:text-sm text-gray-400">
                        Số dư có thể rút bất kỳ lúc nào
                      </p>
                    </div>

                    <Link to="/cashback" className="block">
                      <button className="w-full bg-gradient-to-r from-[#E91E63] to-[#FF8C1A] text-white font-bold py-2 md:py-3 px-3 md:px-4 rounded-xl md:rounded-2xl shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 text-xs md:text-sm">
                        <Wallet2Icon className="w-5 h-5" />
                        Mua sắm & Nhận hoàn tiền
                      </button>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Stats Section - Số liệu ấn tượng */}
          <div
            ref={statsRef}
            className="p-2 sm:p-3 md:p-4 lg:p-6 bg-gradient-to-br from-gray-50 to-white"
          >
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 sm:gap-3 md:gap-4 max-w-5xl mx-auto">
              <div className="text-center p-3 md:p-4 lg:p-6 bg-white rounded-xl md:rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                <div className="w-10 h-10 md:w-12 md:h-12 lg:w-14 lg:h-14 bg-gradient-to-br from-[#E91E63] to-[#FF8C1A] rounded-xl md:rounded-2xl mx-auto mb-2 md:mb-3 lg:mb-4 flex items-center justify-center">
                  <svg
                    className="w-5 h-5 md:w-6 md:h-6 lg:w-8 lg:h-8 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                    />
                  </svg>
                </div>
                <p className="text-xl md:text-2xl lg:text-3xl font-black text-gray-800 mb-1">
                  {userCount}K+
                </p>
                <p className="text-xs md:text-sm text-gray-500 font-medium">
                  Người dùng
                </p>
              </div>

              <div className="text-center p-6 bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                <div className="w-14 h-14 bg-gradient-to-br from-[#E91E63] to-[#FF8C1A] rounded-2xl mx-auto mb-4 flex items-center justify-center">
                  <svg
                    className="w-8 h-8 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <p className="text-xl md:text-2xl lg:text-3xl font-black text-gray-800 mb-1">
                  {cashbackCount}M+
                </p>
                <p className="text-xs md:text-sm text-gray-500 font-medium">
                  Đã hoàn tiền
                </p>
              </div>

              <div className="text-center p-6 bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                <div className="w-14 h-14 bg-gradient-to-br from-[#E91E63] to-[#FF8C1A] rounded-2xl mx-auto mb-4 flex items-center justify-center">
                  <svg
                    className="w-8 h-8 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                    />
                  </svg>
                </div>
                <p className="text-xl md:text-2xl lg:text-3xl font-black text-gray-800 mb-1">
                  {brandCount}+
                </p>
                <p className="text-xs md:text-sm text-gray-500 font-medium">
                  Thương hiệu
                </p>
              </div>

              <div className="text-center p-6 bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                <div className="w-14 h-14 bg-gradient-to-br from-[#E91E63] to-[#FF8C1A] rounded-2xl mx-auto mb-4 flex items-center justify-center">
                  <svg
                    className="w-8 h-8 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"
                    />
                  </svg>
                </div>
                <p className="text-xl md:text-2xl lg:text-3xl font-black text-gray-800 mb-1">
                  {campaignCount}+
                </p>
                <p className="text-xs md:text-sm text-gray-500 font-medium">
                  Chiến dịch
                </p>
              </div>
            </div>
          </div>

          {/* Priority Products Section */}
          <div className="p-4 sm:p-6 lg:p-4 bg-white">
            <PriorityProducts limit={6} />
          </div>

          {/* How It Works Section */}
          <div className="p-6 sm:p-8 lg:p-12 bg-gradient-to-br from-[#E91E63] via-[#EC407A] to-[#FF8C1A] relative overflow-hidden">
            <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-white/5 rounded-full blur-3xl" />

            <div className="relative z-10">
              <div className="text-center mb-8 sm:mb-10 lg:mb-12">
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white mb-2 sm:mb-3">
                  Cách Thức Hoạt Động
                </h2>
                <p className="text-white/90 text-base sm:text-lg max-w-2xl mx-auto">
                  Chỉ 3 bước đơn giản để bắt đầu kiếm tiền hoàn ngay hôm nay
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                {/* Step 1 */}
                <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 hover:bg-white/15 transition-all duration-300 hover:-translate-y-2">
                  <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mb-6 mx-auto shadow-xl">
                    <span className="text-3xl font-black bg-gradient-to-r from-[#E91E63] to-[#FF8C1A] bg-clip-text text-transparent">
                      1
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3 text-center">
                    Đăng Ký Tài Khoản
                  </h3>
                  <p className="text-white/80 text-center leading-relaxed">
                    Tạo tài khoản miễn phí chỉ trong 30 giây. Không cần thẻ tín
                    dụng hay ràng buộc.
                  </p>
                </div>

                {/* Step 2 */}
                <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 hover:bg-white/15 transition-all duration-300 hover:-translate-y-2">
                  <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mb-6 mx-auto shadow-xl">
                    <span className="text-3xl font-black bg-gradient-to-r from-[#E91E63] to-[#FF8C1A] bg-clip-text text-transparent">
                      2
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3 text-center">
                    Mua Sắm hoặc Làm Nhiệm Vụ
                  </h3>
                  <p className="text-white/80 text-center leading-relaxed">
                    Mua sắm tại 1000+ thương hiệu hoặc hoàn thành các nhiệm vụ
                    đơn giản để tích điểm.
                  </p>
                </div>

                {/* Step 3 */}
                <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 hover:bg-white/15 transition-all duration-300 hover:-translate-y-2">
                  <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mb-6 mx-auto shadow-xl">
                    <span className="text-3xl font-black bg-gradient-to-r from-[#E91E63] to-[#FF8C1A] bg-clip-text text-transparent">
                      3
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3 text-center">
                    Nhận Tiền Hoàn
                  </h3>
                  <p className="text-white/80 text-center leading-relaxed">
                    Tiền hoàn được tự động cộng vào ví. Rút về tài khoản ngân
                    hàng bất cứ lúc nào, 24/7.
                  </p>
                </div>
              </div>

              <div className="text-center mt-10">
                <Link to="/register">
                  <button className="px-10 py-4 bg-white text-[#E91E63] font-bold text-lg rounded-full shadow-2xl hover:shadow-3xl hover:scale-105 transition-all duration-300 inline-flex items-center gap-3">
                    Bắt Đầu Ngay - Miễn Phí
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
                        d="M13 7l5 5m0 0l-5 5m5-5H6"
                      />
                    </svg>
                  </button>
                </Link>
              </div>
            </div>
          </div>

          {/* Latest Tasks - Chiến dịch mới nhất */}
          <div className="p-4 sm:p-6 lg:p-4">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl md:text-2xl font-bold text-gray-800 flex items-center">
                <svg
                  className="w-6 h-6 mr-2 text-[#E91E63]"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                Chiến dịch mới nhất
              </h3>
              <Link
                to="/tasks"
                className="text-sm font-semibold text-[#E91E63] hover:text-[#AD1457] transition"
              >
                Xem tất cả →
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5 lg:gap-6">
              {latestTasks.length > 0 ? (
                latestTasks.map((task) => (
                  <Link
                    key={task._id}
                    to={`/tasks/${task._id}`}
                    className="bg-white/90 backdrop-blur-md rounded-2xl border border-gray-100 shadow-lg p-4 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_20px_40px_rgba(0,0,0,0.12)] group"
                  >
                    <div className="flex items-center gap-3 mb-4">
                      {task.logoUrl ? (
                        <img
                          src={task.logoUrl}
                          alt={task.title}
                          className="w-11 h-11 rounded-xl object-cover shadow-md"
                        />
                      ) : (
                        <div className="text-white text-xl font-bold rounded-xl w-11 h-11 flex items-center justify-center bg-gradient-to-r from-[#E91E63] to-[#FF8C1A] shadow-md">
                          <svg
                            className="w-6 h-6"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"
                            />
                          </svg>
                        </div>
                      )}
                    </div>

                    <div className="flex justify-between items-start mb-3">
                      <h3 className="text-lg font-bold text-gray-800 group-hover:text-[#E91E63] transition">
                        {task.title}
                      </h3>
                      <span className="text-xs font-bold text-white bg-gradient-to-r from-[#E91E63] to-[#FF8C1A] rounded-full px-2 py-1 shadow-md uppercase">
                        {task.type === "app_install"
                          ? "App"
                          : task.type === "registration"
                          ? "Đăng ký"
                          : task.type === "purchase"
                          ? "Mua hàng"
                          : task.type === "social_media"
                          ? "Social"
                          : "Task"}
                      </span>
                    </div>

                    <p className="text-sm text-gray-500 mb-4 leading-relaxed line-clamp-2">
                      {task.description || "Hoàn thành nhiệm vụ để nhận thưởng"}
                    </p>

                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs text-gray-400">Phần thưởng</p>
                        <p className="text-lg font-black bg-gradient-to-r from-[#E91E63] to-[#FF8C1A] bg-clip-text text-transparent">
                          {formatCurrency(task.reward)}
                        </p>
                      </div>
                      {task.maxCompletions && (
                        <span className="text-xs text-gray-500">
                          Còn{" "}
                          {Math.max(
                            0,
                            task.maxCompletions - task.completedCount
                          )}{" "}
                          chỗ
                        </span>
                      )}
                    </div>
                  </Link>
                ))
              ) : (
                <div className="col-span-3 text-center py-12">
                  <p className="text-gray-500">
                    Chưa có chiến dịch nào. Vui lòng quay lại sau.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Featured Tasks/Campaigns - Chiến dịch nổi bật */}
          {tasks.length > 0 && (
            <div className="p-4 sm:p-6 lg:p-4 bg-gradient-to-br from-pink-50 to-orange-50">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl md:text-2xl font-black text-gray-800 flex items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-6 h-6 mr-2 text-[#E91E63]"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15.362 5.214A8.252 8.252 0 0 1 12 21 8.25 8.25 0 0 1 6.038 7.047 8.287 8.287 0 0 0 9 9.601a8.983 8.983 0 0 1 3.361-6.867 8.21 8.21 0 0 0 3 2.48Z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 18a3.75 3.75 0 0 0 .495-7.468 5.99 5.99 0 0 0-1.925 3.547 5.975 5.975 0 0 1-2.133-1.001A3.75 3.75 0 0 0 12 18Z"
                    />
                  </svg>
                  Chiến dịch nổi bật
                </h3>

                <Link
                  to="/tasks"
                  className="text-sm font-semibold text-[#E91E63] hover:text-[#AD1457] transition"
                >
                  Xem tất cả →
                </Link>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5 lg:gap-6">
                {tasks.map((task) => (
                  <Link
                    key={task._id}
                    to={`/tasks/${task._id}`}
                    className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 border border-white group"
                  >
                    {/* Image/Logo */}
                    <div className="relative h-40 bg-gradient-to-br from-pink-100 to-orange-100 overflow-hidden flex items-center justify-center">
                      {task.logoUrl ? (
                        <img
                          src={task.logoUrl}
                          alt={task.title}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <svg
                            className="w-16 h-16 text-[#E91E63] opacity-50"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"
                            />
                          </svg>
                        </div>
                      )}

                      {/* Badge */}
                      <div className="absolute top-3 right-3 bg-gradient-to-r from-[#E91E63] to-[#FF8C1A] text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                        Nổi bật
                      </div>

                      {/* Task Type */}
                      <div className="absolute bottom-3 left-3 bg-white/95 backdrop-blur-sm text-[#E91E63] text-xs font-bold px-3 py-1 rounded-full shadow-md uppercase">
                        {task.type === "app_install"
                          ? "CÀI APP"
                          : task.type === "registration"
                          ? "ĐĂNG KÝ"
                          : task.type === "purchase"
                          ? "MUA HÀNG"
                          : task.type === "social_media"
                          ? "MẠNG XÃ HỘI"
                          : "NHIỆM VỤ"}
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-4">
                      <div className="flex items-center justify-between mb-3">
                        {task.platform && (
                          <span className="text-xs text-gray-500 font-semibold">
                            {task.platform}
                          </span>
                        )}
                        {task.maxCompletions && (
                          <span className="text-xs text-gray-400">
                            Còn {task.maxCompletions - task.completedCount} chỗ
                          </span>
                        )}
                      </div>

                      <h4 className="text-lg font-bold text-gray-800 mb-2 leading-snug line-clamp-2 group-hover:text-[#E91E63] transition">
                        {task.title}
                      </h4>

                      {task.description && (
                        <p className="text-sm text-gray-500 mb-3 line-clamp-2">
                          {task.description}
                        </p>
                      )}

                      <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                        <div>
                          <p className="text-xs text-gray-500">Phần thưởng</p>
                          <p className="text-base font-extrabold text-[#E91E63]">
                            {formatCurrency(task.reward)}
                          </p>
                        </div>

                        <button className="px-4 py-2 text-sm font-bold text-white rounded-full bg-gradient-to-r from-[#E91E63] to-[#FF8C1A] shadow-md group-hover:scale-105 transition">
                          Làm ngay
                        </button>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Footer Summary */}
          <div className="bg-gradient-to-r from-pink-50 to-orange-50 p-10 border-t border-gray-200 flex flex-col md:flex-row justify-between items-center rounded-b-[32px] gap-8">
            {/* Summary */}
            <div className="mb-6 md:mb-0">
              <h4 className="text-xl font-bold text-gray-800 mb-2 flex items-center">
                <TrendingUp className="w-5 h-5 mr-2 text-[#E91E63]" />
                {user ? "Tổng quan của bạn" : "Tổng quan hoàn tiền"}
              </h4>
              <p className="text-4xl font-extrabold text-[#E91E63]">
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
                to={user ? "/wallet" : "/"}
                className="group w-full sm:w-auto px-8 py-4 text-lg font-bold rounded-2xl text-white bg-gradient-to-r from-[#E91E63] via-[#EC407A] to-[#FF8C1A] shadow-xl hover:shadow-2xl transition-all duration-300 flex items-center justify-center gap-2"
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
                className="w-full sm:w-auto px-8 py-4 text-lg font-bold rounded-2xl text-[#E91E63] bg-white border-2 border-[#E91E63] hover:bg-pink-50 transition flex items-center justify-center gap-2"
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
