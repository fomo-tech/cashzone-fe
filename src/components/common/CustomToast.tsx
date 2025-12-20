import { useAppStore } from "@/store/appStore";
import { CheckCircle, XCircle } from "lucide-react";
import { useEffect } from "react";

const CustomToast: React.FC<{
  title: string;
  type: "success" | "error";
  isVisible: boolean;
  timer: number;
}> = ({ title, type, isVisible, timer }) => {
  const { setToast } = useAppStore();

  const isSuccess = type === "success";

  // Định nghĩa màu sắc dựa trên type
  const iconColor = isSuccess ? "text-[#E91E63]" : "text-red-500";
  const bgColor = isSuccess ? "bg-[#E91E63]" : "bg-red-500";
  const Icon = isSuccess ? CheckCircle : XCircle;

  useEffect(() => {
    const timeout = setTimeout(() => {
      setToast(null);
    }, timer);

    return () => clearTimeout(timeout);
  }, [isVisible, timer, setToast]);

  if (!isVisible) return null;

  return (
    // Overlay: Sử dụng fixed để căn giữa màn hình, z-index cao
    <div className="fixed inset-0 z-[100] flex items-center justify-center pointer-events-none p-4">
      {/* Toast Card */}
      <div
        className={`
          bg-white p-8 rounded-2xl shadow-2xl transition-all duration-300 ease-in-out max-w-sm w-full
          transform scale-100 opacity-100 animate-fadeIn
        `}
      >
        <div className="text-center">
          {/* Icon - Sử dụng màu gradient nổi bật */}
          <div
            className={`
              mx-auto w-16 h-16 flex items-center justify-center rounded-full mb-4
              ${isSuccess ? "bg-[#E91E63]" : "bg-red-100"}
            `}
          >
            <Icon className={`w-8 h-8 ${iconColor} stroke-2`} />
          </div>

          {/* Title */}
          <h2 className="text-xl font-extrabold text-slate-800 mb-2">
            {title}
          </h2>

          {/* Optional Message */}
          <p className="text-sm text-slate-500">
            {isSuccess
              ? "Dữ liệu đã được cập nhật thành công."
              : "Đã xảy ra lỗi trong quá trình thực hiện."}
          </p>
        </div>

        {/* Progress Bar (Timer Indicator) */}
        <div className="mt-6 h-1 bg-gray-200 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full ${bgColor} transition-width duration-100 ease-linear`}
            style={{
              animation: `progress-sweep ${timer}ms linear forwards`,
              transformOrigin: "left",
            }}
          />
        </div>
      </div>

      {/* CSS Animation Keyframes for smooth bar progress */}
      <style>
        {`
            @keyframes progress-sweep {
                from { width: 100%; }
                to { width: 0%; }
            }
            .animate-fadeIn {
                animation: fadeIn 0.3s ease-out;
            }
            @keyframes fadeIn {
                from { opacity: 0; transform: scale(0.9); }
                to { opacity: 1; transform: scale(1); }
            }
          `}
      </style>
    </div>
  );
};
export default CustomToast;
