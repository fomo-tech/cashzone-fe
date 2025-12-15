import React, { useState } from "react";
import {
  Copy,
  Check,
  Share2,
  Gift,
  Users,
  Zap,
  Clock,
  Trophy,
  TrendingUp,
} from "lucide-react";

// Dữ liệu giả định cho các cấp độ thưởng (Mô hình 3 cấp)
const REWARD_TIERS = [
  {
    level: "Cấp 1: Cộng Tác Viên (F1)",
    commission: "5%",
    duration: "1 Năm",
    description:
      "Nhận 5% hoa hồng từ tất cả các đơn hàng thành công của người bạn trực tiếp giới thiệu (F1).",
    color: "bg-amber-500",
  },
  {
    level: "Cấp 2: Đại Lý (F2)",
    commission: "2%",
    duration: "Vĩnh Viễn",
    description:
      "Nhận thêm 2% hoa hồng từ tất cả các đơn hàng thành công của người được F1 giới thiệu (F2).",
    color: "bg-slate-500",
  },
  {
    level: "Cấp 3: Tổng Đại Lý (F3)",
    commission: "1%",
    duration: "Vĩnh Viễn",
    description:
      "Nhận thêm 1% hoa hồng từ tất cả các đơn hàng thành công của người được F2 giới thiệu (F3).",
    color: "bg-indigo-500",
  },
];

// Dữ liệu giả định cho Mốc Thưởng Cá Nhân
const MILESTONES = [
  {
    referrals: 5,
    reward: 50000,
    description: "Thưởng chào mừng 5 thành viên mới",
    achieved: true,
  },
  {
    referrals: 20,
    reward: 200000,
    description: "Đạt mốc 20 thành viên",
    achieved: false,
  },
  {
    referrals: 50,
    reward: 500000,
    description: "Đạt mốc 50 thành viên",
    achieved: false,
  },
];

// Dữ liệu giả định cho Lịch Sử Thưởng
const MOCK_HISTORY = [
  {
    id: 1,
    user: "An Nguyen (F1)",
    commission: 15000,
    date: "2024-11-28",
    status: "Hoàn tất",
  },
  {
    id: 2,
    user: "Bao Tran (F2)",
    commission: 8000,
    date: "2024-11-25",
    status: "Hoàn tất",
  },
  {
    id: 3,
    user: "Chi Hoang (F1)",
    commission: 22000,
    date: "2024-11-20",
    status: "Đang xử lý",
  },
];

const ReferralProgram: React.FC = () => {
  const inviteLink =
    "https://app.caffiliate.vn/login?invite_code=108718836350816245155";
  const [isCopied, setIsCopied] = useState(false);

  // Dữ liệu giả định về tiến trình người dùng
  const currentReferrals = 12; // Số lượng người giới thiệu thành công hiện tại
  const nextMilestone = MILESTONES.find((m) => !m.achieved);
  const progressPercentage = nextMilestone
    ? (currentReferrals / nextMilestone.referrals) * 100
    : 100;

  const copyInviteLink = () => {
    // Sử dụng document.execCommand('copy') để đảm bảo hoạt động trong iFrame
    const input = document.createElement("input");
    input.value = inviteLink;
    document.body.appendChild(input);
    input.select();
    document.execCommand("copy");
    document.body.removeChild(input);

    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  // Tính tổng thưởng (Hoa hồng + Thưởng Mốc đã đạt)
  const totalCommission = MOCK_HISTORY.reduce(
    (sum, item) => (item.status === "Hoàn tất" ? sum + item.commission : sum),
    0
  );
  const totalMilestoneReward = MILESTONES.reduce(
    (sum, item) => (item.achieved ? sum + item.reward : sum),
    0
  );
  const totalReward = totalCommission + totalMilestoneReward;

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Header & Stats */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-800">
              Chương Trình Giới Thiệu
            </h1>
            <p className="text-slate-500 text-base">
              Mời bạn bè và nhận hoa hồng kép từ mạng lưới 3 cấp độ.
            </p>
          </div>
          <div className="bg-linear-to-r from-green-700 to-emerald-500 text-white px-6 py-3 rounded-2xl shadow-lg shadow-green-500/30 flex items-center gap-3 w-full md:w-auto">
            <div className="p-2 bg-white/20 rounded-lg">
              <Gift className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-sm text-green-100 font-medium">
                Tổng thưởng đã nhận
              </p>
              <p className="text-2xl font-bold">
                {formatCurrency(totalReward)}
              </p>
            </div>
          </div>
        </div>

        {/* Invitation Link Section */}
        <div className="bg-white rounded-2xl shadow-lg border border-slate-100 p-6">
          <div className="flex items-center gap-3 mb-4 border-b pb-4 border-slate-100">
            <div className="p-2 bg-green-100 rounded-lg">
              <Share2 className="w-6 h-6 text-green-600" />
            </div>
            <h2 className="text-xl font-bold text-slate-800">
              Link Mời & Mã Giới Thiệu
            </h2>
          </div>
          <div className="bg-slate-50 rounded-xl p-4 mb-4 border border-slate-100">
            <label
              htmlFor="inviteLink"
              className="text-xs font-semibold text-slate-500 block mb-1"
            >
              Link Giới Thiệu:
            </label>
            <div className="flex items-center justify-between gap-3">
              <input
                type="text"
                id="inviteLink"
                value={inviteLink}
                readOnly
                className="flex-1 bg-transparent border-none outline-none text-slate-700 font-mono text-sm sm:text-base truncate"
              />
              <button
                onClick={copyInviteLink}
                className={`px-4 py-2 text-white rounded-xl font-medium transition-colors flex items-center gap-2 min-w-[100px] justify-center ${
                  isCopied
                    ? "bg-indigo-500 hover:bg-indigo-600"
                    : "bg-green-600 hover:bg-green-700"
                }`}
              >
                {isCopied ? (
                  <Check className="w-4 h-4" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
                <span id="copyBtnText">
                  {isCopied ? "Đã Sao Chép" : "Sao Chép"}
                </span>
              </button>
            </div>
            <p className="text-xs text-slate-500 mt-2">
              Mã Giới Thiệu Của Bạn:{" "}
              <span className="font-mono text-slate-800 font-bold">
                10871883...5155
              </span>
            </p>
          </div>
        </div>

        {/* New: Personal Milestones Section */}
        <div className="bg-white rounded-2xl shadow-lg border border-slate-100 p-6">
          <h2 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
            <Trophy className="w-6 h-6 text-yellow-500" />
            Mốc Thưởng Cá Nhân
          </h2>

          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-semibold text-slate-700">
              Đã giới thiệu thành công:{" "}
              <span className="text-green-600 text-lg font-extrabold">
                {currentReferrals}
              </span>{" "}
              người
            </span>
            {nextMilestone && (
              <span className="text-sm text-slate-500">
                Mục tiêu tiếp theo: {nextMilestone.referrals} người
              </span>
            )}
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-slate-200 rounded-full h-3 mb-6">
            <div
              className="bg-green-600 h-3 rounded-full transition-all duration-700 ease-out"
              style={{ width: `${progressPercentage}%` }}
            ></div>
          </div>

          {/* Milestones List */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {MILESTONES.map((milestone, index) => (
              <div
                key={index}
                className={`p-4 rounded-xl shadow-md border ${
                  milestone.achieved
                    ? "bg-green-50 border-green-200 opacity-100"
                    : "bg-white border-slate-200 opacity-70"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-extrabold text-slate-800">
                    {milestone.referrals}
                  </span>
                  <Trophy
                    className={`w-6 h-6 ${
                      milestone.achieved ? "text-green-600" : "text-slate-400"
                    }`}
                  />
                </div>
                <p className="text-sm text-slate-600 mt-1">
                  {milestone.description}
                </p>
                <p className="text-lg font-bold text-yellow-600">
                  {formatCurrency(milestone.reward)}
                </p>
                {milestone.achieved && (
                  <span className="text-xs text-green-700 font-semibold flex items-center mt-1">
                    <Check className="w-3 h-3 mr-1" /> Đã nhận thưởng
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Reward Tiers Section (3 Tiers) */}
        <div className="bg-white rounded-2xl shadow-lg border border-slate-100 p-6">
          <h2 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
            <Users className="w-6 h-6 text-green-600" />
            Cơ Chế Hoa Hồng Giới Thiệu (Mô Hình 3 Cấp)
          </h2>
          <p className="text-slate-500 mb-6">
            Bạn nhận hoa hồng từ mạng lưới 3 cấp độ: F1, F2 và F3. Càng mời
            nhiều, thu nhập thụ động càng lớn.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {REWARD_TIERS.map((tier, index) => (
              <div
                key={index}
                className="p-5 border border-slate-200 rounded-xl shadow-md space-y-3 bg-white hover:shadow-xl transition-shadow duration-300"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`p-2 rounded-lg ${
                      index === 0
                        ? "bg-amber-100"
                        : index === 1
                        ? "bg-slate-100"
                        : "bg-indigo-100"
                    }`}
                  >
                    <TrendingUp
                      className={`w-5 h-5 ${
                        index === 0
                          ? "text-amber-600"
                          : index === 1
                          ? "text-slate-600"
                          : "text-indigo-600"
                      }`}
                    />
                  </div>
                  <h3 className="text-lg font-bold text-slate-800">
                    {tier.level}
                  </h3>
                </div>

                <p className="text-3xl font-extrabold text-green-600">
                  {tier.commission} Hoa Hồng
                </p>

                <p className="text-slate-600 text-sm h-12">
                  {tier.description}
                </p>

                <div className="flex items-center text-xs text-slate-500 pt-2 border-t border-slate-100">
                  <Clock className="w-4 h-4 mr-2 text-slate-400" />
                  Thời hạn áp dụng: {tier.duration}
                </div>
              </div>
            ))}
          </div>

          <div className="bg-green-50 text-slate-700 rounded-xl p-4 mt-6 text-sm border border-green-200">
            <p className="font-semibold mb-1">Lưu ý quan trọng:</p>
            <ul className="list-disc list-inside space-y-1 ml-2">
              <li>
                Người được mời (F1/F2/F3) vẫn nhận đủ 100% hoàn tiền như bình
                thường.
              </li>
              <li>
                Hoa hồng chỉ áp dụng cho các đơn hàng được xác nhận thành công.
              </li>
            </ul>
          </div>
        </div>

        {/* Bonus List */}
        <div className="bg-white rounded-2xl shadow-lg border border-slate-100 overflow-hidden">
          <div className="p-6 border-b border-slate-100 flex justify-between items-center">
            <h2 className="font-bold text-xl text-slate-800">
              Lịch Sử Thưởng Giới Thiệu
            </h2>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Người giới thiệu
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Hoa hồng nhận
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Ngày
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Trạng thái
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-slate-100">
                {MOCK_HISTORY.length > 0 ? (
                  MOCK_HISTORY.map((item) => (
                    <tr
                      key={item.id}
                      className="hover:bg-slate-50 transition-colors"
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900">
                        {item.user}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600 font-bold">
                        {formatCurrency(item.commission)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                        {item.date}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <span
                          className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            item.status === "Hoàn tất"
                              ? "bg-green-100 text-green-800"
                              : "bg-yellow-100 text-yellow-800"
                          }`}
                        >
                          {item.status}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="p-8 text-center text-slate-500">
                      Chưa có dữ liệu lịch sử thưởng nào.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReferralProgram;
