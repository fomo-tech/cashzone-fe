import React from "react";
import { Wallet2Icon, Sparkles, TrendingUp, Zap } from "lucide-react";

const CashbackHeroSection: React.FC = () => {
  return (
    <section className="w-full max-w-7xl mx-auto p-2 sm:p-2 lg:p-3">
      <div className="bg-white/95 backdrop-blur-md rounded-2xl sm:rounded-3xl shadow-[0_8px_30px_rgba(249,115,22,0.08)] overflow-hidden border border-orange-100/50">
        <div className="bg-gradient-to-r from-orange-500 to-amber-500 text-white p-3 sm:p-4 lg:p-5 relative overflow-hidden">
          {/* Enhanced Animated Background */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-orange-500/5 rounded-full blur-3xl" />
          <div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-white/5 rounded-full blur-2xl animate-pulse"
            style={{ animationDelay: "1s" }}
          />

          {/* Floating particles effect */}
          <div className="absolute inset-0 opacity-10">
            <div
              className="absolute top-20 left-20 w-2 h-2 bg-white rounded-full animate-bounce"
              style={{ animationDelay: "0s", animationDuration: "3s" }}
            />
            <div
              className="absolute top-40 right-32 w-1.5 h-1.5 bg-orange-200 rounded-full animate-bounce"
              style={{ animationDelay: "0.5s", animationDuration: "2.5s" }}
            />
            <div
              className="absolute bottom-32 left-40 w-2 h-2 bg-white rounded-full animate-bounce"
              style={{ animationDelay: "1s", animationDuration: "2s" }}
            />
            <div
              className="absolute bottom-20 right-20 w-1 h-1 bg-orange-100 rounded-full animate-bounce"
              style={{ animationDelay: "1.5s", animationDuration: "3.5s" }}
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-5 items-center relative z-10">
            <div className="lg:col-span-2 space-y-2 sm:space-y-3">
              {/* Badge with animation */}
              <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-white/15 backdrop-blur-md rounded-full border border-white/20 shadow-md">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="size-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M21 11.25v8.25a1.5 1.5 0 0 1-1.5 1.5H5.25a1.5 1.5 0 0 1-1.5-1.5v-8.25M12 4.875A2.625 2.625 0 1 0 9.375 7.5H12m0-2.625V7.5m0-2.625A2.625 2.625 0 1 1 14.625 7.5H12m0 0V21m-8.625-9.75h18c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125h-18c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125Z"
                  />
                </svg>

                <span className="text-xs font-bold text-white">
                  Hoàn tiền lên đến 20%
                </span>
              </div>

              {/* Main Heading with gradient text */}
              <h2 className="text-xl sm:text-2xl lg:text-3xl font-black mb-2 leading-tight tracking-tight">
                <span className="block">Mua sắm thông minh</span>
                <span className="block text-yellow-100">
                  Nhận hoàn tiền ngay
                </span>
              </h2>

              {/* Description with icons */}
              <p className="text-sm sm:text-base opacity-95 mb-2 sm:mb-3 max-w-xl font-medium">
                Chuyển link mua sắm thành tiền.
                <span className="font-bold text-yellow-100 inline-flex items-center gap-1 ml-1">
                  <Zap className="w-4 h-4" />
                  Nhanh chóng
                </span>
                <span className="mx-1">•</span>
                <span className="font-bold text-yellow-100">An toàn</span>
                <span className="mx-1">•</span>
                <span className="font-bold text-yellow-100">Miễn phí!</span>
              </p>

              {/* Stats/Features */}
              <div className="flex flex-wrap gap-4 pt-2">
                <div className="flex items-center gap-2 px-4 py-2 bg-white/15 backdrop-blur-sm rounded-xl border border-white/20">
                  <TrendingUp className="w-5 h-5 text-yellow-200" />
                  <div>
                    <p className="text-xs text-yellow-100 font-semibold">
                      Hoàn tiền lên đến
                    </p>
                    <p className="text-lg font-black">20%</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 bg-white/15 backdrop-blur-sm rounded-xl border border-white/20">
                  <Wallet2Icon className="w-5 h-5 text-yellow-200" />
                  <div>
                    <p className="text-xs text-yellow-100 font-semibold">
                      Rút tiền tối thiểu
                    </p>
                    <p className="text-lg font-black">50.000đ</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Enhanced Wallet Card - Desktop & Mobile */}
            <div className="lg:col-span-1 flex justify-center relative mt-4 lg:mt-0">
              {/* Desktop 3D Phone Mockup */}
              <div className="hidden lg:flex w-44 h-80 bg-gray-900 rounded-[3rem] shadow-xl p-2.5 items-center justify-center border-6 border-gray-800 transform hover:scale-105 transition-all duration-300 hover:rotate-0 rotate-2 relative group">
                {/* Phone notch */}
                <div className="absolute top-2.5 left-1/2 -translate-x-1/2 w-20 h-5 bg-gray-900 rounded-full z-20" />

                <div className="w-full h-full bg-gradient-to-br from-orange-50 via-white to-amber-50 rounded-[2.5rem] p-3 flex flex-col justify-between relative overflow-hidden shadow-inner">
                  {/* Animated background gradient */}
                  <div className="absolute inset-0 bg-gradient-to-br from-orange-100/50 via-transparent to-amber-100/50" />

                  <div className="relative z-10">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-[10px] text-gray-500 font-bold">
                        VÍ CỦA BẠN
                      </p>
                      <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                    </div>

                    <div className="bg-white rounded-xl p-2.5 shadow-md mb-2 border border-orange-100/50">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-amber-500 rounded-lg flex items-center justify-center shadow-md">
                          <Wallet2Icon className="w-4 h-4 text-white" />
                        </div>
                        <div>
                          <p className="text-[9px] text-gray-500 font-semibold">
                            Số dư
                          </p>
                          <p className="text-[10px] text-gray-700 font-bold">
                            Hoàn Tiền
                          </p>
                        </div>
                      </div>

                      <div className="text-center py-1">
                        <p className="text-xl font-black bg-gradient-to-r from-orange-500 to-amber-500 bg-clip-text text-transparent">
                          0đ
                        </p>
                        <p className="text-[9px] text-gray-400">Rút tiền</p>
                      </div>
                    </div>
                  </div>

                  {/* Mini stats */}
                  <div className="space-y-1.5 relative z-10">
                    <div className="flex items-center justify-between p-1.5 bg-white/80 backdrop-blur-sm rounded-lg">
                      <span className="text-[9px] text-gray-600 font-medium">
                        Tổng kiếm
                      </span>
                      <span className="text-[9px] font-black text-orange-600">
                        0đ
                      </span>
                    </div>
                    <div className="flex items-center justify-between p-1.5 bg-white/80 backdrop-blur-sm rounded-lg">
                      <span className="text-[9px] text-gray-600 font-medium">
                        Đã rút
                      </span>
                      <span className="text-[9px] font-black text-green-600">
                        0đ
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Mobile Wallet Card */}
              <div className="lg:hidden w-full max-w-md">
                <div className="bg-gradient-to-br from-white via-orange-50/30 to-amber-50/30 rounded-2xl shadow-lg p-4 border border-orange-100/50 relative overflow-hidden">
                  {/* Animated background */}
                  <div className="absolute inset-0 bg-gradient-to-br from-orange-100/20 via-transparent to-amber-100/20 animate-gradient" />

                  <div className="relative z-10">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2.5">
                        <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-amber-500 rounded-xl flex items-center justify-center shadow-lg">
                          <Wallet2Icon className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wide">
                            Ví Của Bạn
                          </p>
                          <p className="text-sm text-gray-800 font-black">
                            Hoàn Tiền
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                        <span className="text-[10px] text-green-600 font-semibold">
                          Online
                        </span>
                      </div>
                    </div>

                    <div className="bg-gradient-to-r from-orange-500 to-amber-500 rounded-xl p-3 mb-3 text-white shadow-lg relative overflow-hidden">
                      <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full blur-xl" />
                      <div className="relative z-10">
                        <p className="text-xs opacity-90 mb-1 font-semibold">
                          Số dư khả dụng
                        </p>
                        <p className="text-2xl font-black mb-0.5">0đ</p>
                        <p className="text-[10px] opacity-75">
                          Rút tiền bất kỳ lúc nào
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div className="bg-white/80 backdrop-blur-sm rounded-lg p-2 border border-orange-100/50 shadow-sm">
                        <p className="text-[10px] text-gray-500 font-semibold mb-0.5">
                          Tổng kiếm
                        </p>
                        <p className="text-sm font-black text-orange-600">0đ</p>
                      </div>
                      <div className="bg-white/80 backdrop-blur-sm rounded-lg p-2 border border-green-100/50 shadow-sm">
                        <p className="text-[10px] text-gray-500 font-semibold mb-0.5">
                          Đã rút
                        </p>
                        <p className="text-sm font-black text-green-600">0đ</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CashbackHeroSection;
