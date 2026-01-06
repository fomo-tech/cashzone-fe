import { Frown, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

const NotFoundPage = () => {
  const navigate = useNavigate();
  const handleGoBack = () => {
    navigate("/");
  };

  // Định nghĩa CSS cho animation
  const customStyles = `
    @keyframes bounce-slow {
      0%, 100% {
        transform: translateY(0);
      }
      50% {
        transform: translateY(-15px);
      }
    }
    .animate-bounce-slow {
      animation: bounce-slow 3s infinite ease-in-out;
    }
  `;

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      {/* Container chính */}
      <div className="text-center w-full max-w-xl p-8 sm:p-14 bg-white rounded-3xl shadow-3xl border border-slate-200 transform transition-all duration-700 hover:scale-[1.01] hover:shadow-2xl">
        {/* Icon và Mã Lỗi Chính */}
        <div className="mb-10 flex flex-col items-center">
          {/* Icon (lớn hơn và màu xanh lá cây) */}
          <div className="p-4 rounded-full bg-pink-50 inline-block mb-6 shadow-md">
            <Frown className="w-12 h-12 text-[#E91E63] animate-bounce-slow" />
          </div>

          {/* Số 404 với Gradient Text (Xanh lá - Xanh ngọc) */}
          <h1
            className="text-[12rem] font-black tracking-tighter sm:text-[14rem] leading-none"
            style={{
              // Màu chủ đạo xanh lá và xanh ngọc
              background: "linear-gradient(90deg, #10b981, #06b6d4)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              textShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
            }}
          >
            404
          </h1>
        </div>

        {/* Thông báo Lỗi */}
        <h2 className="text-4xl font-extrabold text-slate-800 mb-4 sm:text-5xl">
          Trang Không Tìm Thấy
        </h2>

        {/* Giải thích */}
        <p className="text-lg text-slate-600 mb-10 leading-relaxed">
          Chúng tôi rất tiếc, địa chỉ bạn đang truy cập không tồn tại. Có vẻ như
          bạn đã đi lạc vào không gian số.
        </p>

        {/* Nút Hành động (Màu xanh lá cây) */}
        <button
          onClick={handleGoBack}
          className="inline-flex items-center justify-center px-10 py-3.5 border border-transparent text-lg font-bold rounded-xl shadow-xl text-white bg-gradient-to-br from-orange-500 via-orange-600 to-amber-600
            hover:from-orange-600 hover:to-amber-700 transition duration-300 ease-in-out transform hover:-translate-y-1 
            focus:outline-none focus:ring-4 focus:ring-pink-500/50 focus:ring-opacity-50 active:translate-y-0 cursor-pointer shadow-pink-500/30"
        >
          <ArrowLeft className="w-5 h-5 mr-3" />
          Quay Về Trang Chủ An Toàn
        </button>

        {/* Liên kết Hỗ trợ (Màu xanh lá cây) */}
        <div className="mt-10 text-sm">
          <p className="text-slate-500">
            Cần giúp đỡ?
            <a
              href="/contact"
              className="text-[#E91E63] font-semibold hover:text-[#AD1457] hover:underline ml-1 transition-colors"
            >
              Liên hệ với đội ngũ hỗ trợ
            </a>
            .
          </p>
        </div>
      </div>

      {/* Custom styles for the animation */}
      <style>{customStyles}</style>
    </div>
  );
};

export default NotFoundPage;
