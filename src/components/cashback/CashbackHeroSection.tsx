import React from "react";
import { Wallet2Icon } from "lucide-react";

const CashbackHeroSection: React.FC = () => {
  return (
    <section className="w-full max-w-7xl mx-auto p-2 sm:p-3 lg:p-4">
      <div className="bg-white/80 backdrop-blur-md rounded-[32px] shadow-[0_20px_60px_rgba(0,0,0,0.08)] overflow-hidden border border-white">
        <div className="bg-gradient-to-br from-orange-500 via-orange-600 to-amber-600 text-white p-3 sm:p-4 lg:p-5 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-72 h-72 bg-white/5 rounded-full blur-2xl" />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-center relative z-10">
            <div className="lg:col-span-2">
              <div className="inline-block px-3 py-1.5 bg-white/20 backdrop-blur-sm rounded-full mb-3">
                <span className="text-xs font-bold text-white">
                  🎉 Ưu đãi hoàn tiền mới nhất
                </span>
              </div>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black mb-2 sm:mb-3 leading-tight tracking-tight">
                Cashback cực nhanh, nhận tiền cực dễ
                <br />
                <span className="text-white/90">Chỉ với 1 link sản phẩm</span>
              </h2>
              <p className="text-sm sm:text-base opacity-95 mb-3 sm:mb-4 max-w-xl font-medium">
                Tạo link hoàn tiền cho mọi đơn hàng Shopee, Lazada, Tiki...{" "}
                <span className="font-bold text-white">
                  Không giới hạn số lần nhận thưởng!
                </span>
              </p>
            </div>

            {/* Ví Hoàn Tiền - Mobile & Desktop */}
            <div className="lg:col-span-1 flex justify-center relative mt-6 lg:mt-0">
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
                    0đ
                  </p>
                  <p className="text-xs text-gray-400 mb-4">Số dư có thể rút</p>
                  {/* Không có CTA */}
                </div>
              </div>
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
                      0đ
                    </p>
                    <p className="text-xs md:text-sm text-gray-400">
                      Số dư có thể rút bất kỳ lúc nào
                    </p>
                  </div>
                  {/* Không có CTA */}
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
