import React from "react";
import { Frown, ArrowLeft } from "lucide-react";

const NotFoundPage: React.FC = () => {
  // Hàm mô phỏng việc điều hướng người dùng (trong ứng dụng thực tế sẽ dùng navigate/Link)
  const handleGoBack = () => {
    alert("Đang quay lại Trang Chủ...");
    // Trong ứng dụng thực tế, bạn sẽ dùng: navigate('/') hoặc window.location.href = '/'
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="text-center w-full max-w-xl p-8 sm:p-12 bg-white rounded-3xl shadow-xl border border-slate-100 transform transition-all duration-500 hover:scale-[1.01] hover:shadow-2xl">
        {/* Icon and Main Error Code */}
        <div className="mb-8 flex flex-col items-center">
          <Frown className="w-16 h-16 text-red-500 mb-4 animate-bounce-slow" />
          <h1 className="text-9xl font-extrabold text-slate-800 tracking-tight transition-colors duration-300 sm:text-[10rem]">
            404
          </h1>
        </div>

        {/* Error Message */}
        <h2 className="text-3xl font-bold text-slate-700 mb-4 sm:text-4xl">
          Trang Không Tìm Thấy
        </h2>

        {/* Explanation */}
        <p className="text-lg text-slate-500 mb-8">
          Chúng tôi xin lỗi, trang bạn đang tìm kiếm có thể đã bị xóa, đổi tên,
          hoặc tạm thời không có sẵn. Hãy thử quay lại trang chủ hoặc kiểm tra
          lại đường dẫn.
        </p>

        {/* Call to Action Button */}
        <button
          onClick={handleGoBack}
          className="inline-flex items-center justify-center px-8 py-3 border border-transparent text-base font-bold rounded-xl shadow-lg text-white bg-green-600 hover:bg-green-700 transition duration-300 ease-in-out transform hover:-translate-y-0.5 focus:outline-none focus:ring-4 focus:ring-green-500 focus:ring-opacity-50"
        >
          <ArrowLeft className="w-5 h-5 mr-3" />
          Quay Về Trang Chủ
        </button>

        {/* Support Link */}
        <div className="mt-8 text-sm">
          <p className="text-slate-500">
            Nếu bạn tin đây là một lỗi, vui lòng
            <a
              href="/contact"
              className="text-green-600 font-medium hover:underline ml-1"
            >
              liên hệ hỗ trợ
            </a>
            .
          </p>
        </div>
      </div>

      <style jsx>{`
        /* Simple custom animation for the icon */
        @keyframes bounce-slow {
          0%,
          100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-10px);
          }
        }
        .animate-bounce-slow {
          animation: bounce-slow 4s infinite ease-in-out;
        }
      `}</style>
    </div>
  );
};

export default NotFoundPage;
