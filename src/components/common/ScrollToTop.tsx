import React, { useState, useEffect } from "react";
import { ArrowUp } from "lucide-react";

const ScrollToTop: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);

  // Hiển thị button khi scroll xuống 300px
  const toggleVisibility = () => {
    if (window.pageYOffset > 300) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  };

  // Scroll lên đầu trang mượt mà
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  useEffect(() => {
    window.addEventListener("scroll", toggleVisibility);
    return () => {
      window.removeEventListener("scroll", toggleVisibility);
    };
  }, []);

  return (
    <>
      {isVisible && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-20 sm:bottom-6  right-2 sm:right-6 z-50 group"
          aria-label="Lên đầu trang"
        >
          <div className="relative">
            {/* Glow effect */}
            <div className="absolute inset-0 bg-gradient-to-br from-orange-500 via-orange-600 to-amber-600 rounded-full blur-lg opacity-60 group-hover:opacity-100 transition-opacity duration-300 animate-pulse"></div>

            {/* Button */}
            <div className="relative w-12 h-12 md:w-14 md:h-14 bg-gradient-to-br from-orange-500 via-orange-600 to-amber-600 rounded-full flex items-center justify-center shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-110 active:scale-95">
              <ArrowUp
                size={24}
                className="text-white font-bold group-hover:animate-bounce"
              />
            </div>
          </div>

          {/* Tooltip */}
          <span className="absolute bottom-full right-0 mb-2 px-3 py-1.5 bg-gray-900 text-white text-xs font-semibold rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap pointer-events-none">
            Lên đầu trang
            <span className="absolute top-full right-4 -mt-1 border-4 border-transparent border-t-gray-900"></span>
          </span>
        </button>
      )}
    </>
  );
};

export default ScrollToTop;
