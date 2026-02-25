import React, { useState, useEffect } from "react";
import {
  Copy,
  Check,
  Share2,
  Users,
  Clock,
  Trophy,
  TrendingUp,
  QrCode,
  ArrowRight,
  Star,
  Target,
  Award,
  DollarSign,
  LogIn,
  UserPlus,
  Gift,
  Sparkles,
} from "lucide-react";
import { THEME, formatCurrency, formatNumber } from "@/utils/constants";
import referralService from "@/services/referral.service";
import profileService from "@/services/profileService";
import http from "@/services/api";
import type {
  ReferralStats,
  ReferralCode,
  ReferralHistory,
} from "@/services/referral.service";
import { useAppStore } from "@/store/appStore";
import { useAuthStore } from "@/store/authStore";

// Referral Tree View Component
const ReferralTreeView: React.FC<{ treeData: any }> = ({ treeData }) => {
  if (!treeData) {
    return (
      <div className="text-center py-12">
        <div className="animate-pulse">
          <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">Đang tải...</p>
        </div>
      </div>
    );
  }

  const level1Users = treeData.level1 || [];
  const level2Users = treeData.level2 || [];
  const level3Users = treeData.level3 || [];
  const stats = treeData.stats || {};

  const totalReferrals = stats.totalCount || 0;

  if (totalReferrals === 0) {
    return (
      <div className="text-center py-12">
        <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <p className="text-gray-500">Chưa có người được giới thiệu</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-gradient-to-r from-pink-50 to-rose-50 border-2 border-pink-300 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-8 h-8 bg-pink-100 rounded-full flex items-center justify-center">
              <span className="text-pink-700 font-bold text-sm">F1</span>
            </div>
            <span className="text-sm text-gray-600">Cấp 1 - Trực tiếp</span>
          </div>
          <p className="text-2xl font-bold text-pink-700">
            {stats.level1Count || 0}
          </p>
        </div>
        <div className="bg-gradient-to-r from-orange-50 to-amber-50 border-2 border-orange-300 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
              <span className="text-orange-700 font-bold text-sm">F2</span>
            </div>
            <span className="text-sm text-gray-600">Cấp 2 - Gián tiếp</span>
          </div>
          <p className="text-2xl font-bold text-orange-700">
            {stats.level2Count || 0}
          </p>
        </div>
        <div className="bg-gradient-to-r from-amber-50 to-yellow-50 border-2 border-amber-300 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-8 h-8 bg-amber-100 rounded-full flex items-center justify-center">
              <span className="text-amber-700 font-bold text-sm">F3</span>
            </div>
            <span className="text-sm text-gray-600">Cấp 3</span>
          </div>
          <p className="text-2xl font-bold text-amber-700">
            {stats.level3Count || 0}
          </p>
        </div>
      </div>

      {/* Level-based List View */}
      <div className="space-y-6">
        {/* Level 1 */}
        {level1Users.length > 0 && (
          <div>
            <h3 className="text-lg font-bold text-pink-700 mb-3 flex items-center gap-2">
              <div className="w-8 h-8 bg-pink-100 rounded-full flex items-center justify-center">
                <span className="text-sm">F1</span>
              </div>
              Cấp 1 - Trực tiếp ({level1Users.length})
            </h3>
            <div className="space-y-2">
              {level1Users.map((user: any) => (
                <div
                  key={user.id}
                  className="flex items-center gap-3 p-4 rounded-lg border-2 border-pink-300 bg-gradient-to-r from-pink-50 to-rose-50 hover:shadow-md transition-all"
                >
                  <div className="shrink-0 w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm bg-pink-100 text-pink-700">
                    F1
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-pink-700">{user.name}</p>
                    <p className="text-xs text-gray-500">{user.email}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Level 2 */}
        {level2Users.length > 0 && (
          <div>
            <h3 className="text-lg font-bold text-orange-700 mb-3 flex items-center gap-2">
              <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                <span className="text-sm">F2</span>
              </div>
              Cấp 2 - Gián tiếp ({level2Users.length})
            </h3>
            <div className="space-y-2 ml-4">
              {level2Users.map((user: any) => (
                <div
                  key={user.id}
                  className="flex items-center gap-3 p-4 rounded-lg border-2 border-orange-300 bg-gradient-to-r from-orange-50 to-amber-50 hover:shadow-md transition-all"
                >
                  <div className="shrink-0 w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm bg-orange-100 text-orange-700">
                    F2
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-orange-700">{user.name}</p>
                    <p className="text-xs text-gray-500">{user.email}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Level 3 */}
        {level3Users.length > 0 && (
          <div>
            <h3 className="text-lg font-bold text-amber-700 mb-3 flex items-center gap-2">
              <div className="w-8 h-8 bg-amber-100 rounded-full flex items-center justify-center">
                <span className="text-sm">F3</span>
              </div>
              Cấp 3 ({level3Users.length})
            </h3>
            <div className="space-y-2 ml-8">
              {level3Users.map((user: any) => (
                <div
                  key={user.id}
                  className="flex items-center gap-3 p-4 rounded-lg border-2 border-amber-300 bg-gradient-to-r from-amber-50 to-yellow-50 hover:shadow-md transition-all"
                >
                  <div className="shrink-0 w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm bg-amber-100 text-amber-700">
                    F3
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-amber-700">{user.name}</p>
                    <p className="text-xs text-gray-500">{user.email}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const ReferralProgram: React.FC = () => {
  const { setToast } = useAppStore();
  const { user, setUser } = useAuthStore();
  const [referralCode, setReferralCode] = useState<ReferralCode | null>(null);
  const [referralStats, setReferralStats] = useState<ReferralStats | null>(
    null,
  );
  const [referralHistory, setReferralHistory] = useState<ReferralHistory[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCopied, setIsCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<
    "overview" | "referrals" | "commissions"
  >("overview");
  const [referralListData, setReferralListData] = useState<any>(null);
  const [commissionListData, setCommissionListData] = useState<any>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [referralTreeData, setReferralTreeData] = useState<any>(null);
  const [viewMode, setViewMode] = useState<"tree" | "list">("tree");

  // Dynamic settings from admin
  const [dynamicConfig, setDynamicConfig] = useState({
    commissionRates: {
      level1: 10,
      level2: 5,
      level3: 2,
    },
    milestones: [
      { referrals: 5, reward: 50000, title: "Người giới thiệu mới" },
      { referrals: 20, reward: 200000, title: "Cộng tác viên tích cực" },
      { referrals: 50, reward: 500000, title: "Đại lý chuyên nghiệp" },
      { referrals: 100, reward: 1000000, title: "Chuyên gia giới thiệu" },
    ],
    levelNames: {
      1: "Cấp 1 - Trực tiếp",
      2: "Cấp 2 - Gián tiếp",
      3: "Cấp 3 - Xa nhất",
    },
    levelColors: {
      1: {
        bg: "bg-gradient-to-r from-pink-50 to-rose-50",
        border: "border-pink-200",
        text: "text-orange-600",
        accent: "text-orange-600",
      },
      2: {
        bg: "bg-gradient-to-r from-orange-50 to-amber-50",
        border: "border-orange-200",
        text: "text-[#FF8C1A]",
        accent: "text-[#FF8C1A]",
      },
      3: {
        bg: "bg-gradient-to-r from-amber-50 to-yellow-50",
        border: "border-amber-200",
        text: "text-amber-700",
        accent: "text-amber-600",
      },
    },
  });

  // Load data on component mount
  useEffect(() => {
    console.log("Referral page - user:", user);
    if (user) {
      console.log("Loading referral data for user:", user.name);
      loadReferralData();
    } else {
      console.log("No user found, skipping data load");
      setLoading(false);
    }
  }, [user]);

  const loadDynamicSettings = async () => {
    try {
      // Gọi public endpoint không cần auth
      const response = await http.get("/app-settings/public");
      const data = response.data?.data;

      if (data) {
        // Update commission rates
        if (data.commission) {
          setDynamicConfig((prev) => ({
            ...prev,
            commissionRates: {
              level1: data.commission.level1Rate || 10,
              level2: data.commission.level2Rate || 5,
              level3: data.commission.level3Rate || 2,
            },
          }));
        }

        // Update milestones
        if (data.referralMilestones && data.referralMilestones.length > 0) {
          setDynamicConfig((prev) => ({
            ...prev,
            milestones: data.referralMilestones,
          }));
        }
      }
    } catch (error: unknown) {
      console.log("Using default commission rates and milestones");
    }
  };

  const loadReferralData = async () => {
    try {
      setLoading(true);
      console.log("Starting to load referral data...");

      // Load dynamic settings first
      await loadDynamicSettings();

      // Load user profile first to get affiliate info
      setUser(user);

      // Check if user has referral code in profile, if not try API
      if ((user as any).referralCode) {
        console.log("User has referral code:", (user as any).referralCode);
        setReferralCode({
          code: (user as any).referralCode,
          shareUrl: `${window.location.origin}/register?ref=${
            (user as any).referralCode
          }`,
          createdAt: user.createdAt || new Date().toISOString(),
        });
      } else {
        console.log("User doesn't have referral code, generating...");
        // Fallback: auto-generate referral code if user doesn't have one
        // This should not happen for registered users, but just in case
        try {
          const newCode = await referralService.generateReferralCode();
          setReferralCode(newCode);
          console.log("Generated new referral code:", newCode);
        } catch (error) {
          console.error("Failed to generate referral code:", error);
          // If that also fails, create a temporary one from user ID
          const tempCode = `REF${user._id.slice(-6).toUpperCase()}`;
          setReferralCode({
            code: tempCode,
            shareUrl: `${window.location.origin}/register?ref=${tempCode}`,
            createdAt: new Date().toISOString(),
          });
          console.log("Created temporary referral code:", tempCode);
        }
      }

      // Then load additional referral data from API
      const [statsData, historyData] = await Promise.all([
        referralService.getReferralStats().catch((err) => {
          console.error("Failed to load stats:", err);
          return null;
        }),
        referralService.getReferralHistory({ limit: 10 }).catch((err) => {
          console.error("Failed to load history:", err);
          return { data: [] };
        }),
      ]);

      console.log("Stats data from API:", statsData);
      console.log("History data from API:", historyData);

      // setReferralCode(codeData) - already set above

      // Merge stats from profile and API
      if (statsData) {
        console.log("Using stats from API");
        setReferralStats(statsData);
      } else if (user && user.affiliate) {
        console.log("Using stats from user.affiliate");
        // Fallback to profile affiliate data
        setReferralStats({
          totalReferrals: user.affiliate.totalReferrals || 0,
          directReferrals: user.affiliate.directReferrals || 0,
          level2Referrals: user.affiliate.level2Referrals || 0,
          level3Referrals: user.affiliate.level3Referrals || 0,
          totalCommissions: user.affiliate.commissions || {
            level1Total: 0,
            level2Total: 0,
            level3Total: 0,
            totalEarned: 0,
          },
          monthlyStats: {
            referrals: 0,
            commissions: 0,
          },
        });
      } else {
        console.log("No stats data, using defaults");
        // Set default empty stats if no data available
        setReferralStats({
          totalReferrals: 0,
          directReferrals: 0,
          level2Referrals: 0,
          level3Referrals: 0,
          totalCommissions: {
            level1Total: 0,
            level2Total: 0,
            level3Total: 0,
            totalEarned: 0,
          },
          monthlyStats: {
            referrals: 0,
            commissions: 0,
          },
        });
      }

      setReferralHistory(historyData.data || []);
      console.log("Referral data loaded successfully");
    } catch (error) {
      console.error("Error loading referral data:", error);

      // Even on error, try to set stats from user profile
      if (user && user.affiliate) {
        console.log("Setting stats from user.affiliate after error");
        setReferralStats({
          totalReferrals: user.affiliate.totalReferrals || 0,
          directReferrals: user.affiliate.directReferrals || 0,
          level2Referrals: user.affiliate.level2Referrals || 0,
          level3Referrals: user.affiliate.level3Referrals || 0,
          totalCommissions: user.affiliate.commissions || {
            level1Total: 0,
            level2Total: 0,
            level3Total: 0,
            totalEarned: 0,
          },
          monthlyStats: {
            referrals: 0,
            commissions: 0,
          },
        });
      }

      setToast({
        type: "error",
        title: "Không thể tải đầy đủ dữ liệu giới thiệu",
        isVisible: true,
        timer: 3000,
      });
    } finally {
      console.log("Finished loading, setting loading to false");
      setLoading(false);
    }
  };

  const loadReferralTree = async () => {
    try {
      const data = await referralService.getReferralTree();
      setReferralTreeData(data);
    } catch (error) {
      console.error("Failed to load referral tree:", error);
    }
  };

  const loadReferralList = async (page: number = 1) => {
    try {
      const data = await referralService.getReferralList({ page, limit: 10 });
      setReferralListData(data);
    } catch (error) {
      console.error("Failed to load referral list:", error);
    }
  };

  const loadCommissionHistory = async (page: number = 1) => {
    try {
      const data = await referralService.getCommissionHistory({
        page,
        limit: 10,
      });
      setCommissionListData(data);
    } catch (error) {
      console.error("Failed to load commission history:", error);
    }
  };

  useEffect(() => {
    if (activeTab === "referrals") {
      if (!referralTreeData) {
        loadReferralTree();
      }
      if (!referralListData) {
        loadReferralList(currentPage);
      }
    } else if (activeTab === "commissions" && !commissionListData) {
      loadCommissionHistory(currentPage);
    }
  }, [activeTab]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    if (activeTab === "referrals") {
      loadReferralList(page);
    } else if (activeTab === "commissions") {
      loadCommissionHistory(page);
    }
  };

  const generateReferralCode = async () => {
    try {
      const newCode = await referralService.generateReferralCode();
      setReferralCode(newCode);

      // Update user profile after generating new code
      const updatedProfile = await profileService.getProfile();
      setUser(updatedProfile);

      setToast({
        type: "success",
        title: "Đã tạo mã giới thiệu mới!",
        isVisible: true,
        timer: 3000,
      });
    } catch (error) {
      setToast({
        type: "error",
        title: "Không thể tạo mã giới thiệu",
        isVisible: true,
        timer: 3000,
      });
    }
  };

  const handleCopyLink = async () => {
    if (!referralCode?.code) return;

    const success = await referralService.shareReferralLink(
      referralCode.code,
      "copy",
    );
    if (success) {
      setIsCopied(true);
      setToast({
        type: "success",
        title: "Đã copy link giới thiệu!",
        isVisible: true,
        timer: 2000,
      });
      setTimeout(() => setIsCopied(false), 2000);
    }
  };

  const handleShare = async (
    platform: "facebook" | "zalo" | "telegram" | "whatsapp",
  ) => {
    if (!referralCode?.code) return;

    await referralService.shareReferralLink(referralCode.code, platform);
    setToast({
      type: "success",
      title: `Đã mở chia sẻ trên ${platform}!`,
      isVisible: true,
      timer: 2000,
    });
  };

  // Calculate next milestone
  const currentReferrals = referralStats?.totalReferrals || 0;
  const nextMilestone = dynamicConfig.milestones.find(
    (m) => currentReferrals < m.referrals,
  );
  const progressPercentage = nextMilestone
    ? (currentReferrals / nextMilestone.referrals) * 100
    : 100;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-orange-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-2 md:p-3 lg:p-4">
      <div className="max-w-6xl mx-auto space-y-3 md:space-y-4 lg:space-y-6">
        {/* Header & Quick Stats */}
        <div className="text-center mb-3 md:mb-4 lg:mb-6">
          <div className="flex items-center justify-center gap-3 mb-2 md:mb-3">
            <div className="p-2 md:p-3 bg-gradient-to-br from-orange-500/10 to-amber-500/10 rounded-xl">
              <Trophy className="w-6 h-6 md:w-7 md:h-7 lg:w-8 lg:h-8 text-orange-600" />
            </div>
            <h1 className="text-xl md:text-2xl lg:text-3xl font-bold bg-gradient-to-br from-orange-500 via-orange-600 to-amber-600 bg-clip-text text-transparent">
              Chương Trình Giới Thiệu 3 Cấp
            </h1>
          </div>
          <p className="text-gray-600 text-sm md:text-base lg:text-lg max-w-2xl mx-auto">
            Mời bạn bè mua sắm và nhận hoa hồng từ chuỗi giới thiệu 3 cấp độ với
            tỷ lệ hoa hồng lên đến 17% trên mỗi đơn hoàn tiền
          </p>
        </div>

        {/* Tabs Navigation */}
        {user && (
          <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-2 mb-3 md:mb-4">
            <div className="flex gap-2">
              <button
                onClick={() => setActiveTab("overview")}
                className={`flex-1 px-4 py-3 rounded-lg font-semibold transition-colors ${
                  activeTab === "overview"
                    ? "bg-gradient-to-r from-orange-500 to-amber-500 text-white"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                Tổng Quan
              </button>
              <button
                onClick={() => setActiveTab("referrals")}
                className={`flex-1 px-4 py-3 rounded-lg font-semibold transition-colors ${
                  activeTab === "referrals"
                    ? "bg-gradient-to-r from-orange-500 to-amber-500 text-white"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                Danh Sách
              </button>
              <button
                onClick={() => setActiveTab("commissions")}
                className={`flex-1 px-4 py-3 rounded-lg font-semibold transition-colors ${
                  activeTab === "commissions"
                    ? "bg-gradient-to-r from-orange-500 to-amber-500 text-white"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                Hoa Hồng
              </button>
            </div>
          </div>
        )}

        {/* Overview Tab Content */}
        {activeTab === "overview" && (
          <>
            {/* Quick Stats Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-3 lg:gap-4 mb-3 md:mb-4 lg:mb-6">
              <div className="bg-gradient-to-r from-pink-50 to-rose-50 border-l-4 border-orange-500 p-3 md:p-4 lg:p-6 rounded-lg md:rounded-xl shadow-md">
                <div className="flex items-center">
                  <Users className="w-6 h-6 md:w-7 md:h-7 lg:w-8 lg:h-8 text-orange-600 mr-2 md:mr-3" />
                  <div>
                    <p className="text-xs md:text-sm text-gray-600">
                      Tổng Giới Thiệu
                    </p>
                    <p className="text-lg md:text-xl lg:text-2xl font-bold text-orange-600">
                      {formatNumber(currentReferrals)}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-r from-orange-50 to-amber-50 border-l-4 border-[#FF8C1A] p-3 md:p-4 lg:p-6 rounded-lg md:rounded-xl shadow-md">
                <div className="flex items-center">
                  <DollarSign className="w-6 h-6 md:w-7 md:h-7 lg:w-8 lg:h-8 text-[#FF8C1A] mr-2 md:mr-3" />
                  <div>
                    <p className="text-xs md:text-sm text-gray-600">
                      Tổng Hoa Hồng
                    </p>
                    <p className="text-lg md:text-xl lg:text-2xl font-bold text-[#FF8C1A]">
                      {formatCurrency(
                        referralStats?.totalCommissions?.totalEarned || 0,
                      )}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-r from-emerald-50 to-green-50 border-l-4 border-emerald-600 p-3 md:p-4 lg:p-6 rounded-lg md:rounded-xl shadow-md">
                <div className="flex items-center">
                  <TrendingUp className="w-6 h-6 md:w-7 md:h-7 lg:w-8 lg:h-8 text-emerald-600 mr-2 md:mr-3" />
                  <div>
                    <p className="text-xs md:text-sm text-gray-600">
                      Tháng Này
                    </p>
                    <p className="text-lg md:text-xl lg:text-2xl font-bold text-emerald-600">
                      {formatCurrency(
                        referralStats?.monthlyStats?.commissions || 0,
                      )}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-r from-amber-50 to-yellow-50 border-l-4 border-amber-500 p-3 md:p-4 lg:p-6 rounded-lg md:rounded-xl shadow-md">
                <div className="flex items-center">
                  <Award className="w-6 h-6 md:w-7 md:h-7 lg:w-8 lg:h-8 text-amber-600 mr-2 md:mr-3" />
                  <div>
                    <p className="text-xs md:text-sm text-gray-600">
                      Cấp Cao Nhất
                    </p>
                    <p className="text-lg md:text-xl lg:text-2xl font-bold text-amber-600">
                      Cấp{" "}
                      {referralStats?.level3Referrals
                        ? 3
                        : referralStats?.level2Referrals
                          ? 2
                          : referralStats?.directReferrals
                            ? 1
                            : 0}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Referral Link Section */}
            {!user ? (
              <div className="bg-gradient-to-br from-orange-50 via-white to-amber-50 rounded-xl md:rounded-2xl shadow-xl border border-orange-200 p-6 md:p-8 lg:p-10">
                <div className="max-w-2xl mx-auto text-center space-y-6">
                  <div className="flex justify-center">
                    <div className="relative">
                      <div className="absolute inset-0 bg-gradient-to-br from-orange-400 to-amber-500 rounded-full blur-xl opacity-30 animate-pulse"></div>
                      <div className="relative p-4 md:p-6 bg-gradient-to-br from-orange-500 to-amber-600 rounded-full">
                        <Gift className="w-12 h-12 md:w-16 md:h-16 text-white" />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-800">
                      Kiếm Tiền Từ Mua Sắm
                    </h2>
                    <p className="text-base md:text-lg text-gray-600 max-w-xl mx-auto">
                      Đăng nhập ngay để nhận mã giới thiệu độc quyền và bắt đầu
                      kiếm hoa hồng khi bạn bè mua sắm qua link của bạn
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 my-8">
                    <div className="bg-white rounded-xl p-4 shadow-md border border-orange-100">
                      <div className="flex justify-center mb-3">
                        <div className="p-3 bg-gradient-to-br from-pink-50 to-rose-50 rounded-lg">
                          <Users className="w-6 h-6 text-orange-600" />
                        </div>
                      </div>
                      <h3 className="font-bold text-gray-800 mb-2">
                        Giới Thiệu Bạn Bè
                      </h3>
                      <p className="text-sm text-gray-600">
                        Chia sẻ link và nhận 10% hoa hồng khi F1 mua sắm
                      </p>
                    </div>

                    <div className="bg-white rounded-xl p-4 shadow-md border border-orange-100">
                      <div className="flex justify-center mb-3">
                        <div className="p-3 bg-gradient-to-br from-orange-50 to-amber-50 rounded-lg">
                          <TrendingUp className="w-6 h-6 text-[#FF8C1A]" />
                        </div>
                      </div>
                      <h3 className="font-bold text-gray-800 mb-2">
                        Thu Nhập Thụ Động
                      </h3>
                      <p className="text-sm text-gray-600">
                        Nhận thêm 5% từ F2 và 2% từ F3 khi họ mua sắm
                      </p>
                    </div>

                    <div className="bg-white rounded-xl p-4 shadow-md border border-orange-100">
                      <div className="flex justify-center mb-3">
                        <div className="p-3 bg-gradient-to-br from-emerald-50 to-green-50 rounded-lg">
                          <Sparkles className="w-6 h-6 text-emerald-600" />
                        </div>
                      </div>
                      <h3 className="font-bold text-gray-800 mb-2">
                        Thưởng Đặc Biệt
                      </h3>
                      <p className="text-sm text-gray-600">
                        Nhận bonus khi đạt mốc giới thiệu
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3 justify-center items-center pt-4">
                    <a
                      href="/login"
                      className="w-full sm:w-auto px-8 py-4 bg-gradient-to-br from-orange-500 via-orange-600 to-amber-600 hover:from-orange-600 hover:to-amber-700 text-white rounded-xl font-semibold shadow-lg transition-all hover:shadow-xl flex items-center justify-center gap-2"
                    >
                      <LogIn className="w-5 h-5" />
                      Đăng Nhập Ngay
                    </a>
                    <a
                      href="/register"
                      className="w-full sm:w-auto px-8 py-4 bg-white hover:bg-gray-50 text-gray-800 rounded-xl font-semibold shadow-lg transition-all hover:shadow-xl flex items-center justify-center gap-2 border-2 border-orange-200"
                    >
                      <UserPlus className="w-5 h-5" />
                      Đăng Ký Miễn Phí
                    </a>
                  </div>

                  <p className="text-xs text-gray-500 mt-4">
                    Miễn phí 100% • Không yêu cầu thẻ tín dụng • Rút tiền nhanh
                    chóng
                  </p>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-xl md:rounded-2xl shadow-xl border border-gray-100 p-4 md:p-6 lg:p-4">
                <div className="flex items-center gap-2 md:gap-3 mb-4 md:mb-5 lg:mb-6">
                  <div className="p-2 md:p-3 bg-gradient-to-r from-pink-50 to-rose-50 rounded-lg md:rounded-xl">
                    <Share2 className="w-5 h-5 md:w-6 md:h-6 text-orange-600" />
                  </div>
                  <div>
                    <h2 className="text-lg md:text-xl lg:text-2xl font-bold text-gray-800">
                      Link Giới Thiệu Của Bạn
                    </h2>
                    <p className="text-xs md:text-sm lg:text-base text-gray-600">
                      Chia sẻ link này để nhận hoa hồng khi bạn bè mua sắm
                    </p>
                  </div>
                </div>

                {referralCode ? (
                  <div className="space-y-6">
                    {/* Referral Code Display */}
                    <div className="bg-gradient-to-r from-pink-50 to-rose-50 rounded-xl p-6 border border-pink-200">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-bold text-gray-600 mb-1">
                            Mã Giới Thiệu
                          </p>
                          <p className="text-3xl font-bold font-mono text-orange-600">
                            {referralCode.code}
                          </p>
                        </div>
                        <QrCode className="w-12 h-12 text-orange-600" />
                      </div>
                    </div>

                    {/* Share URL */}
                    <div className="flex gap-3">
                      <input
                        type="text"
                        value={referralCode.shareUrl}
                        readOnly
                        className="flex-1 px-4 py-3 border border-gray-300 rounded-xl bg-gray-50 text-gray-700 font-mono text-sm"
                      />
                      <button
                        onClick={handleCopyLink}
                        className="px-6 py-3 bg-gradient-to-br from-orange-500 via-orange-600 to-amber-600 hover:from-orange-600 hover:to-amber-700 text-white rounded-xl font-bold transition-colors flex items-center gap-2 shadow-lg"
                      >
                        {isCopied ? (
                          <Check className="w-5 h-5" />
                        ) : (
                          <Copy className="w-5 h-5" />
                        )}
                        {isCopied ? "Đã Copy!" : "Copy"}
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <button
                      onClick={generateReferralCode}
                      className="px-8 py-4 bg-gradient-to-br from-orange-500 via-orange-600 to-amber-600 hover:from-orange-600 hover:to-amber-700 text-white rounded-xl font-semibold shadow-lg transition-colors"
                    >
                      Tạo Mã Giới Thiệu
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Commission Calculation Explanation */}
            <div className="bg-white rounded-2xl shadow-xl border border-orange-200 p-6 md:p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-gradient-to-br from-orange-100 to-amber-100 rounded-xl">
                  <DollarSign className="w-6 h-6 text-orange-600" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-800">
                    Cách tính Hoa Hồng
                  </h2>
                  <p className="text-gray-600">
                    Hiểu rõ cách bạn kiếm tiền từ chương trình giới thiệu
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-2 mb-4">
                    <TrendingUp className="w-5 h-5 text-orange-600" />
                    <h3 className="text-lg font-bold text-gray-800">
                      Nguồn thu hoa hồng
                    </h3>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-start gap-3 p-3 bg-gradient-to-r from-emerald-50 to-green-50 rounded-lg border-2 border-emerald-200">
                      <div className="w-2 h-2 bg-emerald-500 rounded-full mt-2 shrink-0"></div>
                      <div>
                        <p className="font-semibold text-gray-800">
                          Hoàn Tiền Mua Sắm
                        </p>
                        <p className="text-sm text-gray-600">
                          Người được giới thiệu mua sắm qua các sàn TMĐT
                          (Shopee, Lazada, Tiki...) và nhận hoàn tiền thành công
                        </p>
                      </div>
                    </div>
                    <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mt-4">
                      <div className="flex items-start gap-3">
                        <div className="p-1.5 bg-amber-100 rounded-lg shrink-0">
                          <Star className="w-4 h-4 text-amber-600" />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-amber-800 mb-2">
                            Hoa hồng được tính khi:
                          </p>
                          <p className="text-sm text-amber-700">
                            • Người được giới thiệu click vào link sản phẩm
                          </p>
                          <p className="text-sm text-amber-700">
                            • Hoàn thành đơn hàng và thanh toán thành công
                          </p>
                          <p className="text-sm text-amber-700">
                            • Nhận được hoàn tiền từ sàn TMĐT
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center gap-2 mb-4">
                    <Target className="w-5 h-5 text-orange-600" />
                    <h3 className="text-lg font-bold text-gray-800">
                      Ví dụ tính hoa hồng
                    </h3>
                  </div>
                  <div className="bg-white rounded-xl p-5 border border-gray-200">
                    <div className="space-y-3">
                      <div className="flex justify-between items-center p-3 bg-pink-50 rounded-lg">
                        <span className="font-semibold text-gray-800">
                          Bạn B mua sắm và nhận hoàn tiền
                        </span>
                        <span className="font-bold text-orange-600">
                          +100,000đ
                        </span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg border-l-4 border-green-400">
                        <span className="text-sm text-gray-700">
                          → A nhận (Cấp 1 -{" "}
                          {dynamicConfig.commissionRates.level1}%)
                        </span>
                        <span className="font-bold text-green-600">
                          +
                          {(
                            (100000 * dynamicConfig.commissionRates.level1) /
                            100
                          ).toLocaleString("vi-VN")}
                          đ
                        </span>
                      </div>

                      <div className="flex justify-between items-center p-3 bg-orange-50 rounded-lg">
                        <span className="font-semibold text-gray-800">
                          Bạn C mua sắm và nhận hoàn tiền
                        </span>
                        <span className="font-bold text-[#FF8C1A]">
                          +200,000đ
                        </span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg border-l-4 border-green-400">
                        <span className="text-sm text-gray-700">
                          → A nhận (Cấp 2 -{" "}
                          {dynamicConfig.commissionRates.level2}%)
                        </span>
                        <span className="font-bold text-green-600">
                          +
                          {(
                            (200000 * dynamicConfig.commissionRates.level2) /
                            100
                          ).toLocaleString("vi-VN")}
                          đ
                        </span>
                      </div>
                    </div>

                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <div className="flex justify-between items-center text-lg font-bold">
                        <span className="text-gray-800">
                          Tổng hoa hồng A nhận:
                        </span>
                        <span className="text-green-600">
                          +
                          {(
                            (100000 * dynamicConfig.commissionRates.level1) /
                              100 +
                            (200000 * dynamicConfig.commissionRates.level2) /
                              100
                          ).toLocaleString("vi-VN")}
                          đ
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                    <div className="flex items-start gap-3">
                      <div className="p-1.5 bg-amber-100 rounded-lg shrink-0">
                        <Star className="w-4 h-4 text-amber-600" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-amber-800">
                          Lưu ý quan trọng:
                        </p>
                        <p className="text-sm text-amber-700">
                          • Hoa hồng không ảnh hưởng đến số tiền hoàn lại của
                          người được giới thiệu
                        </p>
                        <p className="text-sm text-amber-700">
                          • Hệ thống sẽ tự động chi trả hoa hồng từ quỹ thưởng
                        </p>
                        <p className="text-sm text-amber-700">
                          • <strong>Điều kiện nhận hoa hồng:</strong> Người được
                          giới thiệu phải mua sắm qua link và nhận được hoàn
                          tiền thành công
                        </p>
                        <p className="text-sm text-amber-700">
                          • Hoa hồng được tính dựa trên số tiền hoàn lại thực tế
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Commission Rates */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {Object.entries(dynamicConfig.levelColors).map(
                ([level, colors]) => (
                  <div
                    key={level}
                    className={`${colors.bg} border ${colors.border} rounded-2xl p-6 shadow-lg`}
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className={`p-3 bg-white rounded-xl shadow-md`}>
                        <Target className={`w-6 h-6 ${colors.text}`} />
                      </div>
                      <span className={`${colors.accent} text-2xl font-bold`}>
                        {level === "1"
                          ? dynamicConfig.commissionRates.level1
                          : level === "2"
                            ? dynamicConfig.commissionRates.level2
                            : dynamicConfig.commissionRates.level3}
                        %
                      </span>
                    </div>
                    <h3 className={`text-xl font-bold ${colors.text} mb-2`}>
                      {
                        dynamicConfig.levelNames[
                          parseInt(
                            level,
                          ) as keyof typeof dynamicConfig.levelNames
                        ]
                      }
                    </h3>
                    <p className="text-gray-600 text-sm mb-4">
                      {level === "1" &&
                        "Hoa hồng từ hoàn tiền mua sắm của người bạn giới thiệu trực tiếp"}
                      {level === "2" &&
                        "Hoa hồng từ hoàn tiền mua sắm của người được F1 giới thiệu"}
                      {level === "3" &&
                        "Hoa hồng từ hoàn tiền mua sắm của người được F2 giới thiệu"}
                    </p>
                    <div
                      className={`${colors.accent} text-lg font-semibold mb-2`}
                    >
                      Số người đã mua hàng:{" "}
                      {level === "1"
                        ? referralStats?.directReferrals || 0
                        : level === "2"
                          ? referralStats?.level2Referrals || 0
                          : referralStats?.level3Referrals || 0}
                    </div>
                    <p className="text-xs text-gray-500">
                      * Chỉ tính người đã hoàn thành mua sắm và nhận được hoàn
                      tiền
                    </p>
                  </div>
                ),
              )}
            </div>

            {/* Progress to Next Milestone */}
            {nextMilestone && (
              <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-3 bg-gradient-to-r from-amber-50 to-yellow-50 rounded-xl">
                    <Trophy className="w-6 h-6 text-amber-600" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-800">
                      Mốc Thưởng Tiếp Theo
                    </h2>
                    <p className="text-gray-600">
                      Còn {nextMilestone.referrals - currentReferrals} người đã
                      mua hàng nữa để đạt mốc
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      * Chỉ tính người đã hoàn thành mua sắm và nhận được hoàn
                      tiền
                    </p>
                  </div>
                </div>

                <div className="mb-4">
                  <div className="flex justify-between text-sm text-gray-600 mb-2">
                    <span>
                      {currentReferrals} / {nextMilestone.referrals} người đã
                      mua hàng
                    </span>
                    <span>{Math.round(progressPercentage)}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div
                      className="h-3 bg-gradient-to-br from-orange-500 via-orange-600 to-amber-600 rounded-full transition-all duration-500"
                      style={{ width: `${Math.min(progressPercentage, 100)}%` }}
                    ></div>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-amber-50 to-yellow-50 rounded-xl p-4 border border-amber-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-gray-800">
                        {nextMilestone.title}
                      </p>
                      <p className="text-gray-600 text-sm">
                        Thưởng: {formatCurrency(nextMilestone.reward)}
                      </p>
                    </div>
                    <ArrowRight className="w-6 h-6 text-amber-600" />
                  </div>
                </div>
              </div>
            )}

            {/* Recent Referral History */}
            {referralHistory.length > 0 && activeTab === "overview" && (
              <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className={`p-3 ${THEME.SUCCESS_BG_LIGHT} rounded-xl`}>
                      <Clock className={`w-6 h-6 ${THEME.SUCCESS_TEXT}`} />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-gray-800">
                        Lịch Sử Hoa Hồng Gần Đây
                      </h2>
                      <p className="text-gray-600">
                        Hoa hồng từ hoàn tiền mua sắm của những người bạn giới
                        thiệu
                      </p>
                    </div>
                  </div>
                  <button className="px-4 py-2 bg-gradient-to-br from-orange-500 via-orange-600 to-amber-600 text-white rounded-lg hover:opacity-90 transition-colors">
                    Xem Tất Cả
                  </button>
                </div>

                <div className="space-y-3">
                  {referralHistory.slice(0, 5).map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between p-4 border border-gray-100 rounded-xl hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-center gap-4 flex-1">
                        <div
                          className={`w-10 h-10 ${
                            dynamicConfig.levelColors[item.level].bg
                          } rounded-full flex items-center justify-center font-bold text-sm ${
                            dynamicConfig.levelColors[item.level].text
                          }`}
                        >
                          F{item.level}
                        </div>
                        <div className="flex-1">
                          <p className="font-semibold text-gray-800">
                            {item.referredUser.name}
                          </p>
                          <p className="text-sm text-gray-500">
                            {item.productName ||
                              item.shopName ||
                              "Mua sắm hoàn tiền"}
                          </p>
                          <div className="flex items-center gap-3 mt-1">
                            <p className="text-xs text-gray-400">
                              {new Date(item.createdAt).toLocaleDateString(
                                "vi-VN",
                              )}
                            </p>
                            {item.originalAmount && (
                              <p className="text-xs text-gray-400">
                                • Hoàn tiền gốc:{" "}
                                {item.originalAmount.toLocaleString("vi-VN")}đ
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <p
                          className={`font-bold text-lg ${THEME.SUCCESS_TEXT}`}
                        >
                          +{formatCurrency(item.commission)}
                        </p>
                        {item.commissionRate && (
                          <p className="text-xs text-gray-500 mb-1">
                            {item.commissionRate}% hoa hồng
                          </p>
                        )}
                        <p
                          className={`text-xs px-2 py-1 rounded-full inline-block ${
                            item.status === "approved"
                              ? "bg-gradient-to-r from-orange-500/10 to-amber-500/10 text-orange-600 border border-orange-500/30"
                              : item.status === "pending"
                                ? "bg-yellow-100 text-yellow-700"
                                : "bg-red-100 text-red-700"
                          }`}
                        >
                          {item.status === "approved"
                            ? "Đã duyệt"
                            : item.status === "pending"
                              ? "Chờ duyệt"
                              : "Từ chối"}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}

        {/* Referral List Tab */}
        {activeTab === "referrals" && user && (
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 md:p-8">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-gray-800 mb-2">
                  Danh Sách Người Được Giới Thiệu
                </h2>
                <p className="text-gray-600">
                  {viewMode === "tree"
                    ? `${referralTreeData?.totalReferrals || 0} người`
                    : `${referralListData?.pagination?.total || 0} người`}
                </p>
              </div>
              {/* View Mode Toggle */}
              <div className="flex gap-2">
                <button
                  onClick={() => setViewMode("tree")}
                  className={`px-4 py-2 rounded-lg font-bold transition-colors ${
                    viewMode === "tree"
                      ? "bg-gradient-to-r from-orange-500 to-amber-600 text-white"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  Dạng Cây
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`px-4 py-2 rounded-lg font-bold transition-colors ${
                    viewMode === "list"
                      ? "bg-gradient-to-r from-orange-500 to-amber-600 text-white"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  Danh Sách
                </button>
              </div>
            </div>

            {viewMode === "tree" ? (
              <ReferralTreeView treeData={referralTreeData} />
            ) : (
              <>
                {referralListData && referralListData.data.length > 0 ? (
                  <>
                    <div className="space-y-3">
                      {referralListData.data.map((referral: any) => (
                        <div
                          key={referral._id}
                          className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                          <div>
                            <p className="font-semibold text-gray-800">
                              {referral.name}
                            </p>
                            <p className="text-sm text-gray-500">
                              {referral.email}
                            </p>
                            <p className="text-xs text-gray-400 mt-1">
                              Tham gia:{" "}
                              {new Date(referral.joinedAt).toLocaleDateString(
                                "vi-VN",
                              )}
                            </p>
                          </div>
                          <div className="text-right">
                            <span
                              className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                referral.hasCompletedPurchase
                                  ? "bg-green-100 text-green-700"
                                  : "bg-gray-100 text-gray-600"
                              }`}
                            >
                              {referral.hasCompletedPurchase
                                ? "Đã mua hàng"
                                : "Chưa mua"}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Pagination */}
                    {referralListData.pagination.totalPages > 1 && (
                      <div className="flex justify-center gap-2 mt-6">
                        <button
                          onClick={() => handlePageChange(currentPage - 1)}
                          disabled={currentPage === 1}
                          className="px-4 py-2 border rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
                        >
                          Trước
                        </button>
                        <span className="px-4 py-2">
                          Trang {currentPage} /{" "}
                          {referralListData.pagination.totalPages}
                        </span>
                        <button
                          onClick={() => handlePageChange(currentPage + 1)}
                          disabled={
                            currentPage ===
                            referralListData.pagination.totalPages
                          }
                          className="px-4 py-2 border rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
                        >
                          Sau
                        </button>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="text-center py-12">
                    <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">
                      Chưa có người được giới thiệu
                    </p>
                  </div>
                )}
              </>
            )}
          </div>
        )}

        {/* Commission History Tab */}
        {activeTab === "commissions" && user && (
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 md:p-8">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-2">
                Lịch Sử Hoa Hồng Mua Sắm
              </h2>
              <p className="text-gray-600">
                Hoa hồng từ hoàn tiền mua sắm -{" "}
                {commissionListData?.pagination?.total || 0} giao dịch
              </p>
            </div>

            {/* Summary Cards */}
            {referralStats && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-gradient-to-r from-pink-50 to-rose-50 border border-pink-200 rounded-xl p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-bold text-gray-600">
                      Hoa Hồng F1
                    </span>
                    <div className="w-8 h-8 bg-pink-100 rounded-full flex items-center justify-center">
                      <span className="text-pink-700 font-bold text-sm">
                        F1
                      </span>
                    </div>
                  </div>
                  <p className="text-2xl font-bold text-pink-700">
                    {formatCurrency(
                      referralStats.totalCommissions?.level1Total || 0,
                    )}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    {dynamicConfig.commissionRates.level1}% từ{" "}
                    {referralStats.directReferrals || 0} người
                  </p>
                </div>

                <div className="bg-gradient-to-r from-orange-50 to-amber-50 border border-orange-200 rounded-xl p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-bold text-gray-600">
                      Hoa Hồng F2
                    </span>
                    <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                      <span className="text-orange-700 font-bold text-sm">
                        F2
                      </span>
                    </div>
                  </div>
                  <p className="text-2xl font-bold text-orange-700">
                    {formatCurrency(
                      referralStats.totalCommissions?.level2Total || 0,
                    )}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    {dynamicConfig.commissionRates.level2}% từ{" "}
                    {referralStats.level2Referrals || 0} người
                  </p>
                </div>

                <div className="bg-gradient-to-r from-amber-50 to-yellow-50 border border-amber-200 rounded-xl p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-bold text-gray-600">
                      Hoa Hồng F3
                    </span>
                    <div className="w-8 h-8 bg-amber-100 rounded-full flex items-center justify-center">
                      <span className="text-amber-700 font-bold text-sm">
                        F3
                      </span>
                    </div>
                  </div>
                  <p className="text-2xl font-bold text-amber-700">
                    {formatCurrency(
                      referralStats.totalCommissions?.level3Total || 0,
                    )}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    {dynamicConfig.commissionRates.level3}% từ{" "}
                    {referralStats.level3Referrals || 0} người
                  </p>
                </div>
              </div>
            )}

            {commissionListData && commissionListData.data.length > 0 ? (
              <>
                <div className="space-y-3">
                  {commissionListData.data.map((commission: any) => (
                    <div
                      key={commission._id}
                      className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center font-bold text-orange-600">
                            F{commission.level}
                          </div>
                          <div className="flex-1">
                            <p className="font-semibold text-gray-800">
                              {commission.referredUser?.name || "Unknown"}
                            </p>
                            <p className="text-sm text-gray-500">
                              {commission.productName ||
                                commission.shopName ||
                                "Mua sắm hoàn tiền"}
                            </p>
                            {commission.originalAmount && (
                              <p className="text-xs text-gray-400 mt-1">
                                Hoàn tiền gốc:{" "}
                                {commission.originalAmount.toLocaleString(
                                  "vi-VN",
                                )}
                                đ
                              </p>
                            )}
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-lg font-bold text-orange-600">
                            +{commission.amount.toLocaleString("vi-VN")}đ
                          </p>
                          {commission.commissionRate && (
                            <p className="text-xs text-gray-500 mb-1">
                              {commission.commissionRate}% hoa hồng
                            </p>
                          )}
                          <span
                            className={`text-xs px-2 py-1 rounded-full ${
                              commission.status === "approved"
                                ? "bg-green-100 text-green-700"
                                : commission.status === "pending"
                                  ? "bg-yellow-100 text-yellow-700"
                                  : "bg-red-100 text-red-700"
                            }`}
                          >
                            {commission.status === "approved"
                              ? "Đã duyệt"
                              : commission.status === "pending"
                                ? "Chờ duyệt"
                                : "Từ chối"}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between text-xs text-gray-400 pt-2 border-t border-gray-100">
                        <span>
                          {new Date(commission.createdAt).toLocaleString(
                            "vi-VN",
                          )}
                        </span>
                        {commission.platform && (
                          <span className="bg-gray-100 px-2 py-1 rounded">
                            {commission.platform}
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Pagination */}
                {commissionListData.pagination.totalPages > 1 && (
                  <div className="flex justify-center gap-2 mt-6">
                    <button
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                      className="px-4 py-2 border rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
                    >
                      Trước
                    </button>
                    <span className="px-4 py-2">
                      Trang {currentPage} /{" "}
                      {commissionListData.pagination.totalPages}
                    </span>
                    <button
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={
                        currentPage === commissionListData.pagination.totalPages
                      }
                      className="px-4 py-2 border rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
                    >
                      Sau
                    </button>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-12">
                <DollarSign className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">Chưa có lịch sử hoa hồng</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ReferralProgram;
