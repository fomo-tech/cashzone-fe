import React, { useState } from "react";
import { Crown, Gem, Zap, CheckCircle, Trophy, Star } from "lucide-react";

// Định nghĩa style cố định cho Top 3 (Vàng, Bạc, Đồng) - Đã điều chỉnh cho nền sáng
const TOP_RANK_STYLES = {
  // Rank 1: GOLD - Vàng trên nền sáng
  1: {
    title: "Vàng",
    crown: "text-[#FFD700]",
    bgColor: "bg-white border-4 border-[#FFD700]/70",
    shadow:
      "shadow-[0_20px_40px_rgba(255,215,0,0.3),_0_0_10px_rgba(255,215,0,0.2)]",
    heightClass: "min-h-80",
    order: "order-1", // Giữa
    avatarBg: "bg-yellow-500/90 text-white",
    avatarRing: "ring-4 ring-yellow-400",
    scoreColor: "text-yellow-600",
    textColor: "text-gray-900",
  },
  // Rank 2: SILVER - Bạc trên nền sáng
  2: {
    title: "Bạc",
    crown: "text-[#C0C0C0]",
    bgColor: "bg-gray-100 border-4 border-[#C0C0C0]/70",
    shadow:
      "shadow-[0_15px_30px_rgba(192,192,192,0.25),_0_0_8px_rgba(192,192,192,0.1)]",
    heightClass: "min-h-72",
    order: "order-0", // Bên trái
    avatarBg: "bg-gray-500/90 text-white",
    avatarRing: "ring-4 ring-gray-400",
    scoreColor: "text-gray-600",
    textColor: "text-gray-800",
  },
  // Rank 3: BRONZE - Đồng trên nền sáng
  3: {
    title: "Đồng",
    crown: "text-[#CD7F32]",
    bgColor: "bg-orange-50 border-4 border-[#CD7F32]/70",
    shadow:
      "shadow-[0_15px_30px_rgba(205,127,50,0.25),_0_0_8px_rgba(205,127,50,0.1)]",
    heightClass: "min-h-72",
    order: "order-2", // Bên phải
    avatarBg: "bg-orange-500/90 text-white",
    avatarRing: "ring-4 ring-orange-400",
    scoreColor: "text-orange-600",
    textColor: "text-gray-800",
  },
};

const LeaderBoard = () => {
  // Dữ liệu giả lập cho Bảng xếp hạng
  const topUsers = [
    {
      rank: 1,
      username: "Netrox",
      country: "FR",
      score: 88920,
      prize: 17.5,
      initial: "N",
    },
    {
      rank: 2,
      username: "Shaniaramaa",
      country: "PK",
      score: 501896,
      prize: 25,
      initial: "S",
    },
    {
      rank: 3,
      username: "147MAXBREAK",
      country: "GB",
      score: 51116,
      prize: 8.75,
      initial: "B",
    },
  ].sort((a, b) => a.rank - b.rank); // Sắp xếp lại: 1, 2, 3

  const leaderboard = [
    {
      rank: 4,
      username: "Gopalbnm",
      country: "IN",
      score: 40257,
      prize: 6.25,
      initial: "G",
      initialBg: "bg-blue-600",
    },
    {
      rank: 5,
      username: "momofragratz",
      country: "VN",
      score: 37908,
      prize: 5.65,
      initial: "V",
      initialBg: "bg-red-600",
    },
    {
      rank: 6,
      username: "Petnow",
      country: "US",
      score: 29470,
      prize: 5,
      initial: "P",
      initialBg: "bg-green-600",
    },
    {
      rank: 7,
      username: "DarkHorse",
      country: "JP",
      score: 25100,
      prize: 4.5,
      initial: "D",
      initialBg: "bg-purple-600",
    },
    {
      rank: 8,
      username: "NinjaTurtles",
      country: "CA",
      score: 22000,
      prize: 4.0,
      initial: "T",
      initialBg: "bg-cyan-600",
    },
  ];

  // Giả định dữ liệu người dùng hiện tại
  const currentUser = {
    rank: 5397,
    username: "MySelf999",
    score: 15000,
    earned: 0,
    roundStatus: "Ended",
  };

  // Component Avatar
  const Avatar = ({ initial, rank }) => {
    const style = TOP_RANK_STYLES[rank] || {};
    return (
      <div
        className={`w-[85px] h-[85px] rounded-full border-4 ${style.avatarRing} ${style.avatarBg} 
                flex items-center justify-center mb-3 overflow-hidden shadow-xl
                text-4xl font-extrabold`}
      >
        {initial.charAt(0)}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-sans p-4 sm:p-8">
      <div className="max-w-6xl mx-auto flex flex-col items-center">
        {/* Header Section (Title & Glow) */}
        <div className="relative w-full text-center mb-16 mt-10">
          {/* Glow background (Màu xanh lá) */}
          <div className="absolute inset-0 flex justify-center opacity-30">
            <div className="w-96 h-96 bg-green-500/30 blur-[80px] rounded-full"></div>
          </div>

          {/* Title */}
          <h1 className="relative z-10 font-extrabold tracking-tighter uppercase text-6xl sm:text-7xl lg:text-8xl text-transparent bg-clip-text bg-linear-to-r from-green-600 to-emerald-800">
            BẢNG XẾP HẠNG
          </h1>

          {/* Subtitle */}
          <div className="relative z-10 flex justify-center mt-3">
            <div className="flex items-center space-x-2 text-xl font-semibold text-gray-600">
              <Trophy className="w-6 h-6 text-green-500" />
              <span>
                Round hiện tại: <span className="text-green-600">#123</span>
              </span>
              <span className="text-sm font-light text-gray-500 ml-4">
                Cập nhật 1 phút trước
              </span>
            </div>
          </div>
        </div>

        {/* --- Top 3 Users --- */}
        <div
          className="flex justify-center items-end w-full max-w-4xl gap-4 sm:gap-6 mb-16
                        flex-col sm:flex-row"
        >
          {topUsers.map((user) => {
            const style = TOP_RANK_STYLES[user.rank];

            return (
              <div
                key={user.rank}
                className={`flex flex-col items-center p-6 rounded-3xl w-full sm:w-1/3 
                                    text-center transition-all duration-500 backdrop-blur-sm ${style.bgColor} ${style.heightClass} ${style.order} ${style.textColor}`}
                style={{
                  boxShadow: style.shadow,
                  transform: user.rank === 1 ? "scale(1.15)" : "scale(1.0)",
                }}
              >
                {/* Rank/Crown Icon */}
                <div className={`text-6xl mb-3 ${style.crown} drop-shadow-lg`}>
                  <Crown
                    className="w-12 h-12 mx-auto fill-current"
                    strokeWidth={1}
                  />
                </div>

                {/* Rank Number */}
                <div
                  className="text-3xl font-black mb-3 -mt-4"
                  style={{ color: style.crown }}
                >
                  #{user.rank}
                </div>

                {/* Avatar */}
                <Avatar initial={user.initial} rank={user.rank} />

                {/* Username */}
                <p className="text-2xl font-black mb-1 tracking-tight">
                  {user.username}
                </p>

                {/* Score */}
                <p className="text-lg font-bold opacity-90 flex items-center mb-3">
                  <Gem
                    className={`w-5 h-5 mr-1 fill-current ${style.scoreColor}`}
                    strokeWidth={1.5}
                  />
                  <span className={style.scoreColor}>
                    {user.score.toLocaleString()}
                  </span>
                </p>

                {/* Prize */}
                <div className="p-2 px-5 rounded-full text-base font-extrabold bg-linear-to-r from-emerald-500 to-green-600 text-white shadow-xl mt-auto">
                  ${user.prize}
                </div>
              </div>
            );
          })}
        </div>

        {/* --- Bảng Xếp Hạng Chính (Hạng 4+) --- */}
        <div className="w-full max-w-4xl space-y-4">
          {/* Thanh thông tin người dùng hiện tại (Màu xanh lá) */}
          <div className="w-full p-4 rounded-xl bg-green-600/90 border border-green-500 shadow-xl flex justify-between items-center transition-all duration-300">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 rounded-full bg-green-200 flex items-center justify-center text-green-900 font-bold text-lg ring-2 ring-green-400">
                {currentUser.username.charAt(0)}
              </div>
              <div>
                <p className="text-lg font-extrabold text-white">
                  {currentUser.username} (Bạn)
                </p>
                <p className="text-sm font-semibold text-green-200">
                  Hạng hiện tại: #{currentUser.rank.toLocaleString()}
                </p>
              </div>
            </div>

            <div className="text-right">
              <p className="text-xl font-extrabold text-yellow-300 flex items-center">
                <Gem
                  className="w-5 h-5 mr-1 fill-yellow-300"
                  strokeWidth={1.5}
                />
                {currentUser.score.toLocaleString()}
              </p>
              <p className="text-sm text-green-200">
                {currentUser.roundStatus}
              </p>
            </div>
          </div>

          {/* Bảng xếp hạng chi tiết (Nền trắng/xám nhẹ) */}
          <div className="w-full p-2 bg-white rounded-xl shadow-2xl border border-gray-200">
            <table className="min-w-full text-left text-sm table-auto">
              {/* Header */}
              <thead>
                <tr className="border-b border-gray-200 text-gray-500 font-semibold tracking-wider uppercase text-xs">
                  <th className="py-3 px-5 text-center w-16">#</th>
                  <th className="py-3 px-5">Người Dùng</th>
                  <th className="py-3 px-5 text-right w-32">Điểm (Score)</th>
                  <th className="py-3 px-5 text-center w-24">Thưởng</th>
                </tr>
              </thead>
              {/* Rows */}
              <tbody>
                {leaderboard.map((user, index) => (
                  <tr
                    key={user.rank}
                    className={`transition-colors border-b border-gray-100 last:border-b-0
                                            hover:bg-green-50`}
                  >
                    {/* Ranking */}
                    <td className="py-3 px-5 text-center font-extrabold text-lg text-green-600">
                      {`#${user.rank}`}
                    </td>

                    {/* Username */}
                    <td className="py-3 px-5">
                      <div className="flex items-center space-x-3">
                        {/* Initial Circle (Avatar) */}
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm ${user.initialBg} ring-2 ring-gray-200 shadow-md`}
                        >
                          {user.initial}
                        </div>
                        <span className="text-gray-800 font-medium text-base">
                          {user.username}
                        </span>
                      </div>
                    </td>

                    {/* Earned/Score */}
                    <td className="py-3 px-5 text-right font-semibold text-base text-gray-700">
                      <span className="text-yellow-500 mr-1">
                        <Gem
                          className="w-4 h-4 inline-block mr-1 mb-0.5 fill-yellow-500"
                          strokeWidth={1.5}
                        />
                      </span>
                      {user.score.toLocaleString()}
                    </td>

                    {/* Prize */}
                    <td className="py-3 px-5 text-center">
                      <span className="bg-green-600 text-white font-extrabold text-sm p-1.5 px-3 rounded-full shadow-md">
                        ${user.prize}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="text-center p-4">
            <button className="text-sm font-semibold text-gray-600 hover:text-green-600 transition">
              Tải thêm người dùng (5000+ trên BXH)
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeaderBoard;
