import React from "react";

// Định nghĩa các Icon bằng SVG nội tuyến để tránh lỗi biên dịch
const IconSearchOutline = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    {...props}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
    ></path>
  </svg>
);
const IconWalletOutline = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    {...props}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m0 0l-1.5 1.5M7 15h12a2 2 0 002-2v-6a2 2 0 00-2-2H7a2 2 0 00-2 2v6a2 2 0 002 2z"
    ></path>
  </svg>
);

const IconStore = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    {...props}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 10h6M9 14h6"
    ></path>
  </svg>
);
const IconUsers = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    {...props}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="M17 20h-1a1 1 0 00-1 1v1h4v-1a1 1 0 00-1-1zm-1-8a4 4 0 100-8 4 4 0 000 8zm-8 2a5 5 0 00-5 5v1h14v-1a5 5 0 00-5-5H8z"
    ></path>
  </svg>
);
const IconTrendingUp = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    {...props}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="M13 7l5 5m0 0l-5 5m5-5H6"
    ></path>
  </svg>
);

// Dữ liệu mô phỏng cho các cửa hàng nổi bật
const featuredStores = [
  {
    name: "Shopee",
    percent: "10%",
    type: "Điện Tử",
    color: "bg-orange-500",
    icon: "S",
    description: "Hoàn tiền tối đa/chuẩn mọi ngành hàng, flash sale hằng ngày.",
  },
  {
    name: "Lazada",
    percent: "8.5%",
    type: "Điện Tử",
    color: "bg-red-500",
    icon: "L",
    description: "Về nhà mới tận hưởng cuộc sống hiện đại hơn.",
  },
  {
    name: "Booking.com",
    percent: "7%",
    type: "Du Lịch",
    color: "bg-blue-500",
    icon: "B",
    description: "Hoàn tiền tối đa/chuẩn mọi ngành hàng/dịch vụ.",
  },
  {
    name: "Grab",
    percent: "4%",
    type: "Dịch Vụ",
    color: "bg-green-600",
    icon: "G",
    description: "Hoàn tiền tối đa/chuẩn cho mọi dịch vụ di chuyển.",
  },
  {
    name: "Traveloka",
    percent: "5%",
    type: "Du Lịch",
    color: "bg-blue-700",
    icon: "T",
    description: "Vé máy bay và khách sạn, chỉ có ở đây.",
  },
  {
    name: "Shopeefood",
    percent: "4%",
    type: "Ăn Uống",
    color: "bg-orange-600",
    icon: "SF",
    description: "Voucher ăn uống/giao hàng, nhận hoàn tiền tối đa.",
  },
];

// Component Card Cửa hàng

const taskCampaigns = [
  {
    title: "Mua sắm Shopee hoàn tiền",
    reward: "Hoàn 12%",
    time: "Còn 2 ngày",
    badge: "HOT",
    color: "from-green-500 to-emerald-500",
  },
  {
    title: "Đăng ký Bybit nhận thưởng",
    reward: "Thưởng 50.000đ",
    time: "Còn 5 ngày",
    badge: "NEW",
    color: "from-emerald-500 to-teal-500",
  },
  {
    title: "Đặt phòng khách sạn",
    reward: "Hoàn 8%",
    time: "Còn 1 ngày",
    badge: "VIP",
    color: "from-green-600 to-lime-500",
  },
  {
    title: "Gọi xe Grab",
    reward: "Hoàn 4%",
    time: "Còn 3 ngày",
    badge: "HOT",
    color: "from-teal-500 to-green-500",
  },
];

const HomePage: React.FC = () => {
  // Biểu tượng Header (đã là SVG, giữ nguyên)

  return (
    <div className="min-h-screen font-sans ">
      <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
        <div className="bg-white/80 backdrop-blur-md rounded-[32px] shadow-[0_20px_60px_rgba(0,0,0,0.08)] overflow-hidden border border-white">
          {/* Header Section */}
          <div className="bg-linear-to-br from-green-600 via-emerald-600 to-green-500 text-white p-10 lg:p-14 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-72 h-72 bg-white/5 rounded-full blur-2xl" />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 items-center relative z-10">
              <div className="lg:col-span-2">
                <h2 className="text-5xl sm:text-6xl font-black mb-4 leading-tight tracking-tight">
                  Tiết Kiệm Hơn, Mua Sắm Xanh
                </h2>
                <p className="text-lg opacity-90 mb-8 max-w-xl">
                  Hoàn tiền tự động, trải nghiệm mượt mà, rút tiền siêu nhanh
                  cho mọi giao dịch.
                </p>

                <div className="relative max-w-lg">
                  <IconSearchOutline className="absolute left-5 top-1/2 -translate-y-1/2 w-6 h-6 text-green-600" />
                  <input
                    type="text"
                    placeholder="Tìm kiếm cửa hàng, thương hiệu..."
                    className="w-full py-4 pl-14 pr-6 rounded-full text-gray-800 bg-white shadow-xl focus:outline-none focus:ring-4 focus:ring-green-200 transition"
                  />
                </div>
              </div>

              {/* Mockup Ví */}
              <div className="hidden lg:flex lg:col-span-1 justify-center relative">
                <div className="w-52 h-96 bg-gray-800 rounded-[3rem] shadow-2xl p-2 flex items-center justify-center border-4 border-gray-700 transform rotate-3">
                  <div className="w-full h-full bg-green-400 rounded-[2.5rem] p-4 text-center flex flex-col justify-center">
                    <p className="text-white text-lg font-bold">Ví Cashback</p>
                    <p className="text-4xl font-extrabold text-white mt-2 drop-shadow-lg">
                      450.000đ
                    </p>
                    <p className="text-sm text-white/80 mt-1">
                      Hoàn tiền có thể rút
                    </p>
                    {/* Button color adjusted */}
                    <button className="mt-4 bg-white text-green-700 font-bold text-sm py-2 rounded-full shadow-lg hover:bg-gray-100 transition">
                      Rút tiền ngay
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Featured Stores */}
          <div className="p-10 lg:p-12">
            <h3 className="text-2xl font-bold text-gray-800 mb-8 flex items-center">
              <IconStore className="w-6 h-6 mr-2 text-green-600" />
              Cửa hàng nổi bật
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredStores.map((store, index) => (
                <div
                  key={index}
                  className="bg-white/90 backdrop-blur-md rounded-2xl border border-gray-100 shadow-lg p-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_20px_40px_rgba(0,0,0,0.12)]"
                >
                  <div
                    className={`text-white text-xl font-bold rounded-xl w-11 h-11 flex items-center justify-center ${store.color} mb-4 shadow-md`}
                  >
                    {store.icon}
                  </div>

                  <div className="flex justify-between items-start mb-3">
                    <h3 className="text-lg font-bold text-gray-800">
                      {store.name}
                    </h3>
                    <span className="text-sm font-semibold text-white bg-linear-to-r from-green-500 to-emerald-500 rounded-full px-3 py-1 shadow-md">
                      {store.percent}
                    </span>
                  </div>

                  <p className="text-sm text-gray-500 mb-4 leading-relaxed">
                    {store.description}
                  </p>

                  <div className="flex space-x-2 text-xs font-medium">
                    <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                      {store.type}
                    </span>
                    <span className="bg-green-50 text-green-600 px-2 py-1 rounded-full">
                      Ưu đãi
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="p-10 lg:p-12 ">
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-2xl font-black text-gray-800 flex items-center">
                <svg
                  className="w-6 h-6 mr-2 text-green-600"
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
                Chiến dịch nhiệm vụ
              </h3>

              <button className="text-sm font-semibold text-green-600 hover:text-green-700">
                Xem tất cả
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {taskCampaigns.map((task, index) => (
                <div
                  key={index}
                  className="bg-white rounded-2xl p-5 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 border border-gray-100 flex flex-col justify-between"
                >
                  <div className="flex justify-between items-center mb-4">
                    <span
                      className={`text-xs font-bold text-white px-3 py-1 rounded-full bg-linear-to-r ${task.color}`}
                    >
                      {task.badge}
                    </span>
                    <span className="text-xs text-gray-500">{task.time}</span>
                  </div>

                  <h4 className="text-lg font-bold text-gray-800 mb-3 leading-snug">
                    {task.title}
                  </h4>

                  <div className="flex items-center justify-between mt-auto">
                    <div>
                      <p className="text-sm text-gray-500">Phần thưởng</p>
                      <p className="text-lg font-extrabold text-green-600">
                        {task.reward}
                      </p>
                    </div>

                    <button className="px-4 py-2 text-sm font-bold text-white rounded-full bg-linear-to-r from-green-500 to-emerald-500 shadow-md hover:scale-105 transition">
                      Làm ngay
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Footer Summary */}
          <div className="bg-linear-to-r from-green-50 to-emerald-50 p-10 border-t border-gray-200 flex flex-col md:flex-row justify-between items-center rounded-b-[32px] gap-8">
            {/* Summary */}
            <div className="mb-6 md:mb-0">
              <h4 className="text-xl font-bold text-gray-800 mb-2 flex items-center">
                <IconTrendingUp className="w-5 h-5 mr-2 text-green-600" />
                Tổng quan hoàn tiền
              </h4>
              <p className="text-4xl font-extrabold text-green-600">
                450.000.000₫
              </p>
              <p className="text-sm text-gray-500">
                Tổng số tiền đã hoàn về ví người dùng
              </p>
            </div>

            {/* Dashboard Actions */}
            <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
              <button className="group w-full sm:w-auto px-8 py-4 text-lg font-bold rounded-2xl text-white bg-linear-to-r from-green-500 via-emerald-500 to-green-600 shadow-xl hover:shadow-2xl transition-all duration-300 flex items-center justify-center gap-2">
                <IconUsers className="w-5 h-5" />
                Vào Dashboard
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
              </button>

              <button className="w-full sm:w-auto px-8 py-4 text-lg font-bold rounded-2xl text-green-700 bg-white border-2 border-green-500 hover:bg-green-50 transition flex items-center justify-center gap-2">
                <IconWalletOutline className="w-5 h-5" />
                Xem ví
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
