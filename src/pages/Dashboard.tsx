import React from "react";

function Dashboard() {
  return (
    <>
      {/* Welcome Section */}
      <div className="welcome-section bg-primary-gradient mb-3 md:mb-4 lg:mb-6 rounded-xl md:rounded-2xl lg:rounded-3xl p-3 md:p-4 lg:p-6 text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10">
          <h2 className="text-lg md:text-xl lg:text-2xl font-bold mb-2">
            Xin chào, Lộc Nguyễn! 👋
          </h2>
          <p className="text-orange-50 mb-3 md:mb-4 lg:mb-6 max-w-xl text-xs md:text-sm lg:text-base">
            Bạn đang ở Rank
            <span className="font-bold text-white">ĐỒNG</span> với mức hoàn tiền{" "}
            <span className="font-bold text-white">55%</span> ngày thường -{" "}
            <span className="font-bold text-white">70%</span> ngày đôi, 15, 25
            hàng tháng..
          </p>
          <div className="flex flex-wrap gap-2 md:gap-3 lg:gap-4">
            <a
              href="/referrals"
              className="px-3 py-2 md:px-4 md:py-2.5 lg:px-6 bg-white text-(--primary) rounded-lg md:rounded-xl font-semibold shadow-lg hover:bg-orange-50 transition-colors flex items-center gap-1 md:gap-2 text-xs md:text-sm lg:text-base"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width={24}
                height={24}
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
                data-lucide="share-2"
                className="lucide lucide-share-2 w-3.5 h-3.5 md:w-4 md:h-4"
              >
                <circle cx={18} cy={5} r={3} />
                <circle cx={6} cy={12} r={3} />
                <circle cx={18} cy={19} r={3} />
                <line x1="8.59" x2="15.42" y1="13.51" y2="17.49" />
                <line x1="15.41" x2="8.59" y1="6.51" y2="10.49" />
              </svg>{" "}
              <span className="hidden sm:inline">Mời Bạn Bè</span>
              <span className="sm:hidden">Mời bạn</span>
            </a>
            <a
              href="/products"
              className="px-3 py-2 md:px-4 md:py-2.5 lg:px-6 bg-white text-(--primary) rounded-lg md:rounded-xl font-semibold shadow-lg hover:bg-orange-50 transition-colors flex items-center gap-1 md:gap-2 text-xs md:text-sm lg:text-base"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width={24}
                height={24}
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
                data-lucide="search"
                className="lucide lucide-search w-3.5 h-3.5 md:w-4 md:h-4"
              >
                <path d="m21 21-4.34-4.34" />
                <circle cx={11} cy={11} r={8} />
              </svg>{" "}
              <span className="hidden sm:inline">Tìm Sản Phẩm</span>
              <span className="sm:hidden">Tìm kiếm</span>
            </a>
          </div>
        </div>
        {/* Decorative BG */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-10 rounded-full -translate-y-1/2 translate-x-1/3 blur-3xl"></div>
      </div>
      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 lg:gap-6 mb-4 md:mb-6 lg:mb-8">
        {/* Stat Card 1 - Successful Orders */}
        <div className="bg-white p-3 md:p-4 lg:p-6 rounded-xl md:rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-2 md:mb-3 lg:mb-4">
            <div className="w-8 h-8 md:w-10 md:h-10 lg:w-12 lg:h-12 bg-pink-100 rounded-lg md:rounded-xl flex items-center justify-center text-[orange-600]">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width={24}
                height={24}
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
                data-lucide="shopping-cart"
                className="lucide lucide-shopping-cart w-4 h-4 md:w-5 md:h-5 lg:w-6 lg:h-6"
              >
                <circle cx={8} cy={21} r={1} />
                <circle cx={19} cy={21} r={1} />
                <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12" />
              </svg>
            </div>
          </div>
          <h3 className="text-slate-500 text-xs md:text-sm font-bold mb-1">
            Đơn Thành Công
          </h3>
          <p className="text-lg md:text-xl lg:text-2xl font-bold text-slate-800">
            0
          </p>
        </div>
        {/* Stat Card 2 - Total Commission */}
        <div className="bg-white p-3 md:p-4 lg:p-6 rounded-xl md:rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-2 md:mb-3 lg:mb-4">
            <div className="w-8 h-8 md:w-10 md:h-10 lg:w-12 lg:h-12 bg-blue-100 rounded-lg md:rounded-xl flex items-center justify-center text-blue-600">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width={24}
                height={24}
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
                data-lucide="dollar-sign"
                className="lucide lucide-dollar-sign w-4 h-4 md:w-5 md:h-5 lg:w-6 lg:h-6"
              >
                <line x1={12} x2={12} y1={2} y2={22} />
                <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
              </svg>
            </div>
          </div>
          <h3 className="text-slate-500 text-xs md:text-sm font-bold mb-1">
            Tổng Hoàn Tiền
          </h3>
          <p className="text-lg md:text-xl lg:text-2xl font-bold text-slate-800">
            0 ₫
          </p>
        </div>
        {/* Stat Card 3 - Available Balance */}
        <div className="bg-white p-3 md:p-4 lg:p-6 rounded-xl md:rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-2 md:mb-3 lg:mb-4">
            <div className="w-8 h-8 md:w-10 md:h-10 lg:w-12 lg:h-12 bg-purple-100 rounded-lg md:rounded-xl flex items-center justify-center text-purple-600">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width={24}
                height={24}
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
                data-lucide="wallet"
                className="lucide lucide-wallet w-4 h-4 md:w-5 md:h-5 lg:w-6 lg:h-6"
              >
                <path d="M19 7V4a1 1 0 0 0-1-1H5a2 2 0 0 0 0 4h15a1 1 0 0 1 1 1v4h-3a2 2 0 0 0 0 4h3a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1" />
                <path d="M3 5v14a2 2 0 0 0 2 2h15a1 1 0 0 0 1-1v-4" />
              </svg>
            </div>
          </div>
          <h3 className="text-slate-500 text-xs md:text-sm font-bold mb-1">
            Số Dư Khả Dụng
          </h3>
          <p className="text-lg md:text-xl lg:text-2xl font-bold text-slate-800">
            0 ₫
          </p>
        </div>
        {/* Stat Card 4 - Referrals */}
        <div className="bg-white p-3 md:p-4 lg:p-6 rounded-xl md:rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-2 md:mb-3 lg:mb-4">
            <div className="w-8 h-8 md:w-10 md:h-10 lg:w-12 lg:h-12 bg-orange-100 rounded-lg md:rounded-xl flex items-center justify-center text-orange-600">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width={24}
                height={24}
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
                data-lucide="users"
                className="lucide lucide-users w-4 h-4 md:w-5 md:h-5 lg:w-6 lg:h-6"
              >
                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                <path d="M16 3.128a4 4 0 0 1 0 7.744" />
                <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                <circle cx={9} cy={7} r={4} />
              </svg>
            </div>
            <span className="text-[9px] md:text-xs font-bold text-orange-600 bg-orange-50 px-1.5 md:px-2 py-0.5 md:py-1 rounded-md md:rounded-lg">
              Mới
            </span>
          </div>
          <h3 className="text-slate-500 text-xs md:text-sm font-bold mb-1">
            Mời Thành Công
          </h3>
          <div className="flex items-end justify-between">
            <p className="text-lg md:text-xl lg:text-2xl font-bold text-slate-800">
              0
            </p>
            <a
              href="/referrals"
              className="text-[10px] md:text-xs font-bold text-orange-600 hover:underline flex items-center"
            >
              <span className="hidden sm:inline">Chi tiết </span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width={24}
                height={24}
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
                data-lucide="chevron-right"
                className="lucide lucide-chevron-right w-3 h-3 ml-0.5"
              >
                <path d="m9 18 6-6-6-6" />
              </svg>
            </a>
          </div>
        </div>
      </div>
      {/* Recent Orders & Rank Progress */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6 lg:gap-8">
        {/* Recent Orders */}
        <div className="lg:col-span-2 bg-white rounded-xl md:rounded-2xl shadow-sm border border-slate-100 p-4 md:p-5 lg:p-6">
          <div className="flex items-center justify-between mb-4 md:mb-5 lg:mb-6">
            <h3 className="text-base md:text-lg font-bold text-slate-800">
              Đơn Hàng Gần Đây
            </h3>
            <a
              href="/orders"
              className="text-blue-600 text-xs md:text-sm font-bold hover:underline"
            >
              Xem tất cả
            </a>
          </div>
          {/* Desktop Table */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left border-b border-slate-100">
                  <th className="pb-2 md:pb-3 text-[10px] md:text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    Mã Đơn
                  </th>
                  <th className="pb-3 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    Sản Phẩm
                  </th>
                  <th className="pb-3 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    Hoa Hồng
                  </th>
                  <th className="pb-3 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    Trạng Thái
                  </th>
                </tr>
              </thead>
              <tbody className="text-sm">
                <tr>
                  <td colSpan={4} className="py-8 text-center text-slate-500">
                    Chưa có đơn hàng nào
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          {/* Mobile Card List */}
          <div className="md:hidden space-y-4">
            <div className="py-8 text-center text-slate-500">
              Chưa có đơn hàng nào
            </div>
          </div>
        </div>
        {/* Rank Progress */}
        <div className="bg-white rounded-xl md:rounded-2xl shadow-sm border border-slate-100 p-4 md:p-5 lg:p-6">
          <h3 className="text-base md:text-lg font-bold text-slate-800 mb-4 md:mb-5 lg:mb-6">
            Tiến Độ Rank
          </h3>
          <div className="flex flex-col items-center mb-4 md:mb-5 lg:mb-6">
            <div className="w-20 h-20 md:w-24 md:h-24 bg-linear-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mb-3 md:mb-4 shadow-inner">
              <img
                src="https://cdn-public.caffiliate.vn/upload_97c040fe-1c5e-4110-9bc0-c4cd17be65b0.webp"
                alt="Rank DONG"
                className="w-12 h-12 md:w-16 md:h-16 object-contain"
              />
            </div>
            <h4 className="text-lg md:text-xl font-bold text-slate-800">
              ĐỒNG
            </h4>
            <p className="text-xs md:text-sm text-slate-500">
              Cấp bậc hiện tại
            </p>
          </div>
          <div className="space-y-3 md:space-y-4">
            <div>
              <div className="flex justify-between text-xs md:text-sm mb-1">
                <span className="text-slate-600">Đơn hàng</span>
                <span className="font-bold text-slate-800">0 / 10</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2 md:h-2.5">
                <div
                  className="bg-purple-600 h-2.5 rounded-full"
                  style={{ width: "0%" }}
                ></div>
              </div>
            </div>
          </div>
          <div className="mt-4 md:mt-5 lg:mt-6 p-3 md:p-4 bg-slate-50 rounded-lg md:rounded-xl border border-slate-100">
            <p className="text-[10px] md:text-xs text-slate-500 text-center">
              Cố lên! Bạn chỉ còn thiếu{" "}
              <span className="font-bold text-slate-700">10</span> đơn hàng hoàn
              thành để lên rank{" "}
              <span className="font-bold text-yellow-600">VÀNG</span>.
            </p>
          </div>
        </div>
      </div>
      {/* Leaderboard Section */}
      <div className="mt-8 bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width={24}
              height={24}
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
              data-lucide="trophy"
              className="lucide lucide-trophy w-5 h-5 text-yellow-500"
            >
              <path d="M10 14.66v1.626a2 2 0 0 1-.976 1.696A5 5 0 0 0 7 21.978" />
              <path d="M14 14.66v1.626a2 2 0 0 0 .976 1.696A5 5 0 0 1 17 21.978" />
              <path d="M18 9h1.5a1 1 0 0 0 0-5H18" />
              <path d="M4 22h16" />
              <path d="M6 9a6 6 0 0 0 12 0V3a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1z" />
              <path d="M6 9H4.5a1 1 0 0 1 0-5H6" />
            </svg>
            Bảng Xếp Hạng
          </h3>
        </div>
        {/* Your Rank Card */}
        {/* Rankings Content */}
        {/* Tab Navigation */}
        <div className="flex border-b border-slate-200 mb-6">
          <button className="px-4 py-2 text-sm font-bold text-blue-600 border-b-2 border-blue-600">
            Tháng Này
          </button>
          <button className="px-4 py-2 text-sm font-bold text-slate-600 hover:text-slate-800">
            Tất Cả Thời Gian
          </button>
        </div>
        {/* Monthly Rankings */}
        <div id="monthly-tab" className="rankings-tab">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left border-b border-slate-100">
                  <th className="pb-3 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    Hạng
                  </th>
                  <th className="pb-3 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    Tên
                  </th>
                  <th className="pb-3 text-xs font-semibold text-slate-400 uppercase tracking-wider text-right">
                    Hoàn Tiền
                  </th>
                  <th className="pb-3 text-xs font-semibold text-slate-400 uppercase tracking-wider text-right">
                    Đơn Hàng
                  </th>
                </tr>
              </thead>
              <tbody className="text-sm">
                <tr className="border-b border-slate-50 last:border-0 hover:bg-slate-50 ">
                  <td className="py-3">
                    <div className="flex items-center gap-2">
                      <span className="w-6 h-6 bg-yellow-100 text-yellow-700 rounded-full flex items-center justify-center text-xs font-bold">
                        1
                      </span>
                    </div>
                  </td>
                  <td className="py-3">
                    <div className="font-bold text-slate-800">
                      Phạm Thị Mộng Hòa
                    </div>
                  </td>
                  <td className="py-3 text-right">
                    <div className="font-bold text-[orange-600]">
                      120.482&nbsp;₫
                    </div>
                  </td>
                  <td className="py-3 text-right text-slate-600">4</td>
                </tr>
                <tr className="border-b border-slate-50 last:border-0 hover:bg-slate-50 ">
                  <td className="py-3">
                    <div className="flex items-center gap-2">
                      <span className="w-6 h-6 bg-gray-100 text-gray-700 rounded-full flex items-center justify-center text-xs font-bold">
                        2
                      </span>
                    </div>
                  </td>
                  <td className="py-3">
                    <div className="font-bold text-slate-800">
                      Video Sexy Japan
                    </div>
                  </td>
                  <td className="py-3 text-right">
                    <div className="font-bold text-[orange-600]">
                      50.459&nbsp;₫
                    </div>
                  </td>
                  <td className="py-3 text-right text-slate-600">3</td>
                </tr>
                <tr className="border-b border-slate-50 last:border-0 hover:bg-slate-50 ">
                  <td className="py-3">
                    <div className="flex items-center gap-2">
                      <span className="w-6 h-6 bg-orange-100 text-orange-700 rounded-full flex items-center justify-center text-xs font-bold">
                        3
                      </span>
                    </div>
                  </td>
                  <td className="py-3">
                    <div className="font-bold text-slate-800">
                      Minh Pham Nguyen
                    </div>
                  </td>
                  <td className="py-3 text-right">
                    <div className="font-bold text-[orange-600]">
                      27.518&nbsp;₫
                    </div>
                  </td>
                  <td className="py-3 text-right text-slate-600">1</td>
                </tr>
                <tr className="border-b border-slate-50 last:border-0 hover:bg-slate-50 ">
                  <td className="py-3">
                    <div className="flex items-center gap-2">
                      <span className="w-6 h-6 bg-slate-100 text-slate-700 rounded-full flex items-center justify-center text-xs font-bold">
                        4
                      </span>
                    </div>
                  </td>
                  <td className="py-3">
                    <div className="font-bold text-slate-800">Canh Bach</div>
                  </td>
                  <td className="py-3 text-right">
                    <div className="font-bold text-[orange-600]">
                      25.735&nbsp;₫
                    </div>
                  </td>
                  <td className="py-3 text-right text-slate-600">3</td>
                </tr>
                <tr className="border-b border-slate-50 last:border-0 hover:bg-slate-50 ">
                  <td className="py-3">
                    <div className="flex items-center gap-2">
                      <span className="w-6 h-6 bg-slate-100 text-slate-700 rounded-full flex items-center justify-center text-xs font-bold">
                        5
                      </span>
                    </div>
                  </td>
                  <td className="py-3">
                    <div className="font-bold text-slate-800">
                      Nam Nguyễn Văn
                    </div>
                  </td>
                  <td className="py-3 text-right">
                    <div className="font-bold text-[orange-600]">
                      19.033&nbsp;₫
                    </div>
                  </td>
                  <td className="py-3 text-right text-slate-600">2</td>
                </tr>
                <tr className="border-b border-slate-50 last:border-0 hover:bg-slate-50 ">
                  <td className="py-3">
                    <div className="flex items-center gap-2">
                      <span className="w-6 h-6 bg-slate-100 text-slate-700 rounded-full flex items-center justify-center text-xs font-bold">
                        6
                      </span>
                    </div>
                  </td>
                  <td className="py-3">
                    <div className="font-bold text-slate-800">Hoa Nguyen</div>
                  </td>
                  <td className="py-3 text-right">
                    <div className="font-bold text-[orange-600]">
                      16.078&nbsp;₫
                    </div>
                  </td>
                  <td className="py-3 text-right text-slate-600">2</td>
                </tr>
                <tr className="border-b border-slate-50 last:border-0 hover:bg-slate-50 ">
                  <td className="py-3">
                    <div className="flex items-center gap-2">
                      <span className="w-6 h-6 bg-slate-100 text-slate-700 rounded-full flex items-center justify-center text-xs font-bold">
                        7
                      </span>
                    </div>
                  </td>
                  <td className="py-3">
                    <div className="font-bold text-slate-800">Memo</div>
                  </td>
                  <td className="py-3 text-right">
                    <div className="font-bold text-[orange-600]">
                      15.906&nbsp;₫
                    </div>
                  </td>
                  <td className="py-3 text-right text-slate-600">2</td>
                </tr>
                <tr className="border-b border-slate-50 last:border-0 hover:bg-slate-50 ">
                  <td className="py-3">
                    <div className="flex items-center gap-2">
                      <span className="w-6 h-6 bg-slate-100 text-slate-700 rounded-full flex items-center justify-center text-xs font-bold">
                        8
                      </span>
                    </div>
                  </td>
                  <td className="py-3">
                    <div className="font-bold text-slate-800">
                      Mai Quỳnh Nguyễn
                    </div>
                  </td>
                  <td className="py-3 text-right">
                    <div className="font-bold text-[orange-600]">
                      15.646&nbsp;₫
                    </div>
                  </td>
                  <td className="py-3 text-right text-slate-600">1</td>
                </tr>
                <tr className="border-b border-slate-50 last:border-0 hover:bg-slate-50 ">
                  <td className="py-3">
                    <div className="flex items-center gap-2">
                      <span className="w-6 h-6 bg-slate-100 text-slate-700 rounded-full flex items-center justify-center text-xs font-bold">
                        9
                      </span>
                    </div>
                  </td>
                  <td className="py-3">
                    <div className="font-bold text-slate-800">
                      Thanh Hảo Phạm Thị
                    </div>
                  </td>
                  <td className="py-3 text-right">
                    <div className="font-bold text-[orange-600]">
                      14.846&nbsp;₫
                    </div>
                  </td>
                  <td className="py-3 text-right text-slate-600">1</td>
                </tr>
                <tr className="border-b border-slate-50 last:border-0 hover:bg-slate-50 ">
                  <td className="py-3">
                    <div className="flex items-center gap-2">
                      <span className="w-6 h-6 bg-slate-100 text-slate-700 rounded-full flex items-center justify-center text-xs font-bold">
                        10
                      </span>
                    </div>
                  </td>
                  <td className="py-3">
                    <div className="font-bold text-slate-800">Vo Diem</div>
                  </td>
                  <td className="py-3 text-right">
                    <div className="font-bold text-[orange-600]">
                      12.571&nbsp;₫
                    </div>
                  </td>
                  <td className="py-3 text-right text-slate-600">1</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        {/* All-Time Rankings */}
        <div id="allTime-tab" className="rankings-tab hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left border-b border-slate-100">
                  <th className="pb-3 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    Hạng
                  </th>
                  <th className="pb-3 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    Tên
                  </th>
                  <th className="pb-3 text-xs font-semibold text-slate-400 uppercase tracking-wider text-right">
                    Hoàn Tiền
                  </th>
                  <th className="pb-3 text-xs font-semibold text-slate-400 uppercase tracking-wider text-right">
                    Đơn Hàng
                  </th>
                </tr>
              </thead>
              <tbody className="text-sm">
                <tr className="border-b border-slate-50 last:border-0 hover:bg-slate-50 ">
                  <td className="py-3">
                    <div className="flex items-center gap-2">
                      <span className="w-6 h-6 bg-yellow-100 text-yellow-700 rounded-full flex items-center justify-center text-xs font-bold">
                        1
                      </span>
                    </div>
                  </td>
                  <td className="py-3">
                    <div className="font-bold text-slate-800">
                      Phạm Thị Mộng Hòa
                    </div>
                  </td>
                  <td className="py-3 text-right">
                    <div className="font-bold text-[orange-600]">
                      2.909.280&nbsp;₫
                    </div>
                  </td>
                  <td className="py-3 text-right text-slate-600">113</td>
                </tr>
                <tr className="border-b border-slate-50 last:border-0 hover:bg-slate-50 ">
                  <td className="py-3">
                    <div className="flex items-center gap-2">
                      <span className="w-6 h-6 bg-gray-100 text-gray-700 rounded-full flex items-center justify-center text-xs font-bold">
                        2
                      </span>
                    </div>
                  </td>
                  <td className="py-3">
                    <div className="font-bold text-slate-800">Memo</div>
                  </td>
                  <td className="py-3 text-right">
                    <div className="font-bold text-[orange-600]">
                      2.154.745&nbsp;₫
                    </div>
                  </td>
                  <td className="py-3 text-right text-slate-600">61</td>
                </tr>
                <tr className="border-b border-slate-50 last:border-0 hover:bg-slate-50 ">
                  <td className="py-3">
                    <div className="flex items-center gap-2">
                      <span className="w-6 h-6 bg-orange-100 text-orange-700 rounded-full flex items-center justify-center text-xs font-bold">
                        3
                      </span>
                    </div>
                  </td>
                  <td className="py-3">
                    <div className="font-bold text-slate-800">Hoa Nguyen</div>
                  </td>
                  <td className="py-3 text-right">
                    <div className="font-bold text-[orange-600]">
                      1.704.502&nbsp;₫
                    </div>
                  </td>
                  <td className="py-3 text-right text-slate-600">75</td>
                </tr>
                <tr className="border-b border-slate-50 last:border-0 hover:bg-slate-50 ">
                  <td className="py-3">
                    <div className="flex items-center gap-2">
                      <span className="w-6 h-6 bg-slate-100 text-slate-700 rounded-full flex items-center justify-center text-xs font-bold">
                        4
                      </span>
                    </div>
                  </td>
                  <td className="py-3">
                    <div className="font-bold text-slate-800">Canh Bach</div>
                  </td>
                  <td className="py-3 text-right">
                    <div className="font-bold text-[orange-600]">
                      1.663.102&nbsp;₫
                    </div>
                  </td>
                  <td className="py-3 text-right text-slate-600">175</td>
                </tr>
                <tr className="border-b border-slate-50 last:border-0 hover:bg-slate-50 ">
                  <td className="py-3">
                    <div className="flex items-center gap-2">
                      <span className="w-6 h-6 bg-slate-100 text-slate-700 rounded-full flex items-center justify-center text-xs font-bold">
                        5
                      </span>
                    </div>
                  </td>
                  <td className="py-3">
                    <div className="font-bold text-slate-800">Vo Diem</div>
                  </td>
                  <td className="py-3 text-right">
                    <div className="font-bold text-[orange-600]">
                      1.214.375&nbsp;₫
                    </div>
                  </td>
                  <td className="py-3 text-right text-slate-600">69</td>
                </tr>
                <tr className="border-b border-slate-50 last:border-0 hover:bg-slate-50 ">
                  <td className="py-3">
                    <div className="flex items-center gap-2">
                      <span className="w-6 h-6 bg-slate-100 text-slate-700 rounded-full flex items-center justify-center text-xs font-bold">
                        6
                      </span>
                    </div>
                  </td>
                  <td className="py-3">
                    <div className="font-bold text-slate-800">
                      Huynh Thi Thanh Tra
                    </div>
                  </td>
                  <td className="py-3 text-right">
                    <div className="font-bold text-[orange-600]">
                      1.011.749&nbsp;₫
                    </div>
                  </td>
                  <td className="py-3 text-right text-slate-600">67</td>
                </tr>
                <tr className="border-b border-slate-50 last:border-0 hover:bg-slate-50 ">
                  <td className="py-3">
                    <div className="flex items-center gap-2">
                      <span className="w-6 h-6 bg-slate-100 text-slate-700 rounded-full flex items-center justify-center text-xs font-bold">
                        7
                      </span>
                    </div>
                  </td>
                  <td className="py-3">
                    <div className="font-bold text-slate-800">
                      Khanh Tran Quoc
                    </div>
                  </td>
                  <td className="py-3 text-right">
                    <div className="font-bold text-[orange-600]">
                      997.626&nbsp;₫
                    </div>
                  </td>
                  <td className="py-3 text-right text-slate-600">55</td>
                </tr>
                <tr className="border-b border-slate-50 last:border-0 hover:bg-slate-50 ">
                  <td className="py-3">
                    <div className="flex items-center gap-2">
                      <span className="w-6 h-6 bg-slate-100 text-slate-700 rounded-full flex items-center justify-center text-xs font-bold">
                        8
                      </span>
                    </div>
                  </td>
                  <td className="py-3">
                    <div className="font-bold text-slate-800">thoai anh</div>
                  </td>
                  <td className="py-3 text-right">
                    <div className="font-bold text-[orange-600]">
                      947.193&nbsp;₫
                    </div>
                  </td>
                  <td className="py-3 text-right text-slate-600">46</td>
                </tr>
                <tr className="border-b border-slate-50 last:border-0 hover:bg-slate-50 ">
                  <td className="py-3">
                    <div className="flex items-center gap-2">
                      <span className="w-6 h-6 bg-slate-100 text-slate-700 rounded-full flex items-center justify-center text-xs font-bold">
                        9
                      </span>
                    </div>
                  </td>
                  <td className="py-3">
                    <div className="font-bold text-slate-800">Bảo Kha</div>
                  </td>
                  <td className="py-3 text-right">
                    <div className="font-bold text-[orange-600]">
                      901.525&nbsp;₫
                    </div>
                  </td>
                  <td className="py-3 text-right text-slate-600">40</td>
                </tr>
                <tr className="border-b border-slate-50 last:border-0 hover:bg-slate-50 ">
                  <td className="py-3">
                    <div className="flex items-center gap-2">
                      <span className="w-6 h-6 bg-slate-100 text-slate-700 rounded-full flex items-center justify-center text-xs font-bold">
                        10
                      </span>
                    </div>
                  </td>
                  <td className="py-3">
                    <div className="font-bold text-slate-800">Thắng Quốc</div>
                  </td>
                  <td className="py-3 text-right">
                    <div className="font-bold text-[orange-600]">
                      878.946&nbsp;₫
                    </div>
                  </td>
                  <td className="py-3 text-right text-slate-600">45</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}

export default Dashboard;
