import React from "react";
import { Wallet2Icon, TrendingUp, Zap } from "lucide-react";

const CashbackHeroSection: React.FC = () => {
  return (
    <section className="w-full max-w-7xl mx-auto p-0 sm:p-3 lg:p-4">
      <div className="bg-gradient-to-br from-orange-50 via-white to-red-50 rounded-none sm:rounded-[32px] overflow-hidden relative border-0 sm:border-2 sm:border-orange-200">
        {/* Soft decorative elements */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-br from-orange-100 to-transparent rounded-full blur-3xl opacity-30" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-gradient-to-tr from-red-100 to-transparent rounded-full blur-3xl opacity-30" />

        <div className="relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 items-center p-4 sm:p-6 lg:p-8">
            <div className="lg:col-span-3">
              {/* Simple badge */}
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-orange-100 rounded-full mb-4 border border-orange-200">
                <span className="text-sm font-bold text-orange-600">
                  🎉 Hoàn tiền cao nhất
                </span>
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-black mb-4 leading-tight">
                <span className="text-gray-800">Nhận Hoàn Tiền</span>
                <br />
                <span className="bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
                  Lên Đến 90%
                </span>
              </h1>

              <p className="text-base sm:text-lg lg:text-xl text-gray-600 mb-6 max-w-2xl font-medium leading-relaxed">
                Mua sắm thông minh với{" "}
                <span className="text-orange-600 font-bold">
                  link hoàn tiền độc quyền
                </span>
                . Không giới hạn, không điều kiện ẩn.
              </p>

              {/* Stats */}
              <div className="flex flex-wrap gap-4 sm:gap-6">
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 rounded-xl bg-orange-100 flex items-center justify-center border border-orange-200">
                    <TrendingUp className="w-5 h-5 text-orange-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-black text-gray-800">99.9%</p>
                    <p className="text-xs text-gray-600">
                      Giao dịch thành công
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 rounded-xl bg-orange-100 flex items-center justify-center border border-orange-200">
                    <Zap className="w-5 h-5 text-orange-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-black text-gray-800">24/7</p>
                    <p className="text-xs text-gray-600">Hỗ trợ nhanh chóng</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Wallet Card */}
            <div className="lg:col-span-2 flex justify-center lg:justify-end">
              <div className="w-full max-w-md">
                <div className="bg-white rounded-2xl p-6 border-2 border-orange-200">
                  {/* Card header */}
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl flex items-center justify-center">
                        <Wallet2Icon className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                          Ví Của Bạn
                        </p>
                        <p className="text-sm font-bold text-gray-800">
                          Hoàn Tiền
                        </p>
                      </div>
                    </div>
                    <div className="px-3 py-1 bg-green-100 rounded-full border border-green-300">
                      <span className="text-xs font-bold text-green-700">
                        ACTIVE
                      </span>
                    </div>
                  </div>

                  {/* Balance */}
                  <div className="mb-6">
                    <p className="text-xs text-gray-500 mb-2">Số dư khả dụng</p>
                    <p className="text-4xl font-black bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
                      0đ
                    </p>
                  </div>

                  {/* Features */}
                  <div className="grid grid-cols-3 gap-3">
                    <div className="bg-orange-50 rounded-xl p-3 border border-orange-200">
                      <p className="text-xs text-gray-600 mb-1">Tích lũy</p>
                      <p className="text-sm font-bold text-gray-800">0đ</p>
                    </div>
                    <div className="bg-orange-50 rounded-xl p-3 border border-orange-200">
                      <p className="text-xs text-gray-600 mb-1">Đơn hàng</p>
                      <p className="text-sm font-bold text-gray-800">0</p>
                    </div>
                    <div className="bg-orange-50 rounded-xl p-3 border border-orange-200">
                      <p className="text-xs text-gray-600 mb-1">Hạng</p>
                      <p className="text-sm font-bold text-orange-600">VIP</p>
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
