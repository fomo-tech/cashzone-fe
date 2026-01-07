import { useAppStore } from "@/store/appStore";
import { CheckCircle, XCircle, X } from "lucide-react";
import { useEffect } from "react";

const CustomToast: React.FC<{
  title: string;
  type: "success" | "error";
  isVisible: boolean;
  timer: number;
}> = ({ title, type, isVisible, timer }) => {
  const { setToast } = useAppStore();

  const isSuccess = type === "success";

  // Định nghĩa màu sắc dựa trên type với gradient theme
  const iconBgColor = isSuccess
    ? "bg-gradient-to-br from-emerald-50 to-green-50 border border-emerald-200"
    : "bg-gradient-to-br from-red-50 to-rose-50 border border-red-200";
  const iconColor = isSuccess ? "text-emerald-600" : "text-red-500";
  const progressBg = isSuccess
    ? "bg-gradient-to-r from-emerald-500 to-green-600"
    : "bg-gradient-to-r from-red-500 to-red-600";
  const Icon = isSuccess ? CheckCircle : XCircle;

  useEffect(() => {
    const timeout = setTimeout(() => {
      setToast(null);
    }, timer);

    return () => clearTimeout(timeout);
  }, [isVisible, timer, setToast]);

  if (!isVisible) return null;

  return (
    // Overlay with backdrop
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop with blur effect */}
      <div
        className="absolute inset-0 bg-black/20 backdrop-blur-sm pointer-events-auto"
        onClick={() => setToast(null)}
      />

      {/* Toast Card */}
      <div className="relative bg-white p-6 md:p-8 rounded-2xl shadow-2xl transition-all duration-300 ease-in-out max-w-sm w-full animate-fadeIn pointer-events-auto border border-gray-100">
        {/* Close Button */}
        <button
          onClick={() => setToast(null)}
          className="absolute top-4 right-4 p-1 hover:bg-gray-100 rounded-lg transition-colors"
          aria-label="Close"
        >
          <X className="w-5 h-5 text-gray-400 hover:text-gray-600" />
        </button>

        <div className="text-center">
          {/* Icon with consistent styling */}
          <div
            className={`mx-auto w-16 h-16 flex items-center justify-center rounded-full mb-4 ${iconBgColor}`}
          >
            <Icon className={`w-8 h-8 ${iconColor} stroke-[2.5]`} />
          </div>

          {/* Title */}
          <h2 className="text-lg md:text-xl font-bold text-gray-800 mb-2">
            {title}
          </h2>

          {/* Optional Message */}
          <p className="text-sm text-gray-600">
            {isSuccess
              ? "Dữ liệu đã được cập nhật thành công."
              : "Đã xảy ra lỗi trong quá trình thực hiện."}
          </p>
        </div>

        {/* Progress Bar (Timer Indicator) */}
        <div className="mt-6 h-1.5 bg-gray-200 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full ${progressBg} transition-all duration-100 ease-linear`}
            style={{
              animation: `progress-sweep ${timer}ms linear forwards`,
              transformOrigin: "left",
            }}
          />
        </div>
      </div>

      {/* CSS Animation Keyframes */}
      <style>
        {`
            @keyframes progress-sweep {
                from { width: 100%; }
                to { width: 0%; }
            }
            .animate-fadeIn {
                animation: fadeIn 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            }
            @keyframes fadeIn {
                from { 
                    opacity: 0; 
                    transform: scale(0.95) translateY(-10px); 
                }
                to { 
                    opacity: 1; 
                    transform: scale(1) translateY(0); 
                }
            }
          `}
      </style>
    </div>
  );
};
export default CustomToast;
