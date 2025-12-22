import { ArrowRight, Sparkles, Zap } from "lucide-react";
import React from "react";

const SectionHero = () => {
  return (
    <section className="relative overflow-hidden group rounded-2xl sm:rounded-3xl lg:rounded-[2.5rem] p-4 sm:p-8 md:p-10 lg:p-12 xl:p-16 shadow-[0_20px_60px_rgba(233,30,99,0.35)] flex flex-col gap-6 sm:gap-7 md:gap-8">
      {/* Background Layer with Animated Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#E91E63] via-[#FF4081] to-[#FF8C1A] transition-transform duration-700 group-hover:scale-105" />

      {/* Decorative Orbs - Balanced sizes */}
      <div className="absolute top-[-8%] right-[-4%] w-48 h-48 sm:w-56 sm:h-56 md:w-64 md:h-64 lg:w-72 lg:h-72 xl:w-80 xl:h-80 bg-white opacity-10 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-[-8%] left-[-4%] w-40 h-40 sm:w-48 sm:h-48 md:w-56 md:h-56 lg:w-64 lg:h-64 xl:w-72 xl:h-72 bg-yellow-400 opacity-20 rounded-full blur-2xl" />

      {/* Content Layer */}
      <div className="relative z-10 flex flex-col xl:flex-row items-center justify-between gap-8 sm:gap-10 lg:gap-12 xl:gap-14">
        <div className="flex-1 w-full text-center lg:text-left space-y-4 sm:space-y-5 md:space-y-6 lg:space-y-7">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-white/20 backdrop-blur-md border border-white/30 text-white text-xs sm:text-sm font-extrabold uppercase tracking-wide animate-bounce shadow-lg">
            <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            <span className="whitespace-nowrap">
              Hệ thống hoàn tiền tự động 24/7
            </span>
          </div>

          {/* Main Heading */}
          <div className="relative">
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-black text-white leading-[1.05] tracking-tight">
              {/* Text with multiple shadows for depth */}
              <span className="inline-block drop-shadow-[0_4px_20px_rgba(0,0,0,0.4)] drop-shadow-[0_2px_10px_rgba(233,30,99,0.5)]">
                Nhận Rebate
              </span>
              <br />
              {/* Gradient text with glow effect */}
              <span className="relative inline-block mt-2">
                <span className="absolute inset-0 blur-2xl bg-gradient-to-r from-yellow-300 via-yellow-200 to-white opacity-60"></span>
                <span className="relative text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-yellow-100 to-white font-black">
                  Lên đến 30%
                </span>
              </span>
            </h1>
            {/* Decorative line */}
            <div className="mt-3 w-20 sm:w-24 md:w-28 lg:w-32 h-1.5 bg-gradient-to-r from-yellow-300 to-transparent rounded-full mx-auto lg:mx-0 shadow-lg shadow-yellow-300/50"></div>
          </div>

          {/* Description */}
          <div className="max-w-2xl mx-auto lg:mx-0">
            <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-white/95 font-semibold leading-relaxed">
              Quy trình đơn giản:{" "}
              <span className="font-bold underline decoration-yellow-300 decoration-2 underline-offset-4">
                Chọn sàn
              </span>{" "}
              →{" "}
              <span className="font-bold underline decoration-yellow-300 decoration-2 underline-offset-4">
                Dán link
              </span>{" "}
              →{" "}
              <span className="font-bold underline decoration-yellow-300 decoration-2 underline-offset-4">
                Nhận tiền
              </span>
              . Tiết kiệm hơn mỗi ngày cùng cộng đồng mua sắm thông minh.
            </p>
          </div>
        </div>
      </div>

      {/* Bottom badge - User stats */}
      <div className="relative z-10 mt-2 sm:mt-3 md:mt-4 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 sm:gap-5 md:gap-6 pt-5 sm:pt-6 md:pt-7 border-t border-white/20">
        <div className="flex -space-x-2 sm:-space-x-2.5">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 rounded-full border-2 sm:border-[3px] border-[#E91E63] bg-slate-200 overflow-hidden ring-2 ring-white/20 transition-transform hover:scale-110 hover:z-10"
            >
              <img
                src={`https://i.pravatar.cc/100?img=${i + 10}`}
                alt="user"
                className="w-full h-full object-cover"
              />
            </div>
          ))}
          <div className="w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 rounded-full border-2 sm:border-[3px] border-[#E91E63] bg-white flex items-center justify-center text-[10px] sm:text-xs font-extrabold text-pink-600 ring-2 ring-white/20 transition-transform hover:scale-110">
            +2k
          </div>
        </div>
        <p className="text-white/90 text-sm sm:text-base md:text-lg font-bold text-center sm:text-left leading-snug">
          Đang có <span className="text-white font-extrabold">2,415</span> người
          dùng hoạt động hôm nay
        </p>
      </div>
    </section>
  );
};

export default SectionHero;
