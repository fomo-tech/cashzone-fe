import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, EffectFade } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/effect-fade";

const heroSlides = [
  {
    id: 1,
    badge: "Hoàn tiền 24/7",
    icon: "💸",
    title: "Nhận Rebate",
    highlight: "Lên đến 30%",
    description:
      "Chọn sàn → Dán link → Nhận tiền. Tiết kiệm hơn mỗi ngày cùng cộng đồng mua sắm thông minh.",
  },
  {
    id: 2,
    badge: "Ưu đãi mỗi ngày",
    icon: "🔥",
    title: "Deal Hot",
    highlight: "Giảm đến 50%",
    description:
      "Săn deal khủng từ hàng ngàn thương hiệu uy tín. Cập nhật mỗi giờ, không bỏ lỡ cơ hội tiết kiệm.",
  },
  {
    id: 3,
    badge: "Tích điểm đổi quà",
    icon: "🎁",
    title: "Thưởng Khủng",
    highlight: "Tích lũy điểm",
    description:
      "Mỗi giao dịch đều được tích điểm. Đổi quà, rút tiền hoặc nâng hạng VIP để hưởng đặc quyền.",
  },
  {
    id: 4,
    badge: "Thu nhập thụ động",
    icon: "🚀",
    title: "Kiếm Thêm",
    highlight: "Hoa hồng x2",
    description:
      "Giới thiệu bạn bè, nhận hoa hồng từ giao dịch của họ. Xây dựng mạng lưới, thu nhập bền vững.",
  },
];

const SectionHero = () => {
  return (
    <section className="w-full max-w-screen-xl mx-auto px-2 sm:px-4 md:px-8 py-6 md:py-10 lg:py-14">
      <Swiper
        modules={[Autoplay, Pagination, EffectFade]}
        effect="fade"
        loop
        autoplay={{ delay: 4000, disableOnInteraction: false }}
        pagination={{ clickable: true }}
        className="w-full"
        style={{ width: "100%" }}
      >
        {heroSlides.map((slide) => (
          <SwiperSlide key={slide.id}>
            <div className="flex flex-col items-center justify-center bg-gradient-to-br from-orange-400 via-orange-300 to-yellow-200 rounded-2xl shadow-lg px-3 py-6 sm:px-6 sm:py-8 md:px-10 md:py-12 min-h-[180px] sm:min-h-[220px] md:min-h-[260px] lg:min-h-[320px] relative overflow-hidden w-full mx-auto">
              {/* Badge */}
              <div className="flex items-center gap-2 px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-full bg-white/30 backdrop-blur-md border border-white/40 text-orange-600 text-xs sm:text-sm font-bold uppercase tracking-wide mb-3 sm:mb-4 shadow-lg animate-bounce">
                <span className="text-base sm:text-lg">{slide.icon}</span>
                <span>{slide.badge}</span>
              </div>
              {/* Title & Highlight */}
              <h2 className="text-lg sm:text-2xl md:text-3xl lg:text-4xl font-black text-gray-900 mb-1 sm:mb-2 text-center drop-shadow-lg">
                {slide.title}
                <br />
                <span className="inline-block mt-1 text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-yellow-200 to-red-400 font-black text-lg sm:text-2xl md:text-3xl lg:text-4xl">
                  {slide.highlight}
                </span>
              </h2>
              {/* Description */}
              <p className="text-gray-800/90 text-xs sm:text-sm md:text-base lg:text-lg text-center max-w-xs sm:max-w-md md:max-w-xl mb-1 sm:mb-2">
                {slide.description}
              </p>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
};
