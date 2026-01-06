import React, { useState, useCallback, useMemo } from "react";
import {
  CalendarCheck,
  Zap,
  Gift,
  DollarSign,
  Target,
  X,
  CheckCircle,
  RotateCw,
  MessageSquare,
  Users,
  Leaf, // Icon mới cho theme Green
} from "lucide-react";

// =========================================================================
// 1. DATA VÀ INTERFACE (Không đổi)
// =========================================================================

interface ActivityDetail {
  title: string;
  icon: React.ReactNode;
  reward: string;
  cost: string;
  description: string;
  requirements: string[];
}

// Dữ liệu mẫu cho các hoạt động hàng ngày
const DAILY_ACTIVITIES: { [key: string]: ActivityDetail } = {
  checkin: {
    title: "Điểm Danh Hàng Ngày",
    icon: <CalendarCheck size={24} className="text-orange-500" />, // Màu Emerald
    reward: "+100 Points",
    cost: "Miễn phí (1 lần/ngày)",
    description:
      "Hoạt động đơn giản nhất. Chỉ cần truy cập và bấm nút để nhận Points.",
    requirements: [
      "Bước 1: Đảm bảo bạn đã đăng nhập tài khoản.",
      "Bước 2: Bấm nút **'Điểm Danh Ngay'** bên trong giao diện này.",
      "Bước 3: Hệ thống sẽ tự động cộng **100 Points** vào tài khoản của bạn.",
      "Lưu ý quan trọng: Chỉ có thể điểm danh 1 lần duy nhất trong khoảng thời gian từ 00:00 đến 23:59 (GMT+7) mỗi ngày.",
    ],
  },
  luckywheel: {
    title: "Vòng Quay May Mắn",
    icon: <Zap size={24} className="text-yellow-500" />, // Vẫn giữ màu vàng cho Zap
    reward: "Ngẫu nhiên (Tối đa 500 Points)",
    cost: "50 Points/lượt",
    description:
      "Thử vận may của bạn với cơ hội trúng những phần thưởng Points lớn hoặc vật phẩm đặc biệt.",
    requirements: [
      "Bước 1: Kiểm tra Points.",
      "Đảm bảo tài khoản của bạn có ít nhất **50 Points** để tham gia.",
      "Bước 2: Bấm nút 'QUAY NGAY'.",
      "Mỗi lượt quay sẽ trừ **50 Points** và kích hoạt bánh xe quay.",
      "Bước 3: Theo dõi kết quả.",
      "Hệ thống sẽ hiển thị phần thưởng bạn nhận được sau khi bánh xe dừng lại (khoảng 5 giây).",
      "Lưu ý: Nếu trúng 'Thử Lại', chi phí 50 Points sẽ được hoàn lại.",
    ],
  },
};

// =========================================================================
// 2. COMPONENTS (MODAL)
// =========================================================================

/**
 * Modal hiển thị chi tiết và hướng dẫn thực hiện hoạt động
 */
const ActivityDetailModal: React.FC<{
  activityKey: keyof typeof DAILY_ACTIVITIES;
  onClose: () => void;
}> = ({ activityKey, onClose }) => {
  const activity = DAILY_ACTIVITIES[activityKey];

  if (!activity) return null;

  return (
    <div
      className="fixed inset-0 bg-gray-900 bg-opacity-80 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-3xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto transform transition-all duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6 sm:p-8">
          {/* Header Modal */}
          <div className="flex justify-between items-start border-b border-gray-100 pb-4 mb-4">
            <div className="flex items-center space-x-3">
              <span className="p-3 bg-orange-50 rounded-full">
                {activity.icon}
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 leading-snug">
                {activity.title}
              </h2>
            </div>
            <button
              onClick={onClose}
              className="p-2 -mr-2 text-gray-500 hover:text-gray-700 transition rounded-full hover:bg-gray-100"
              aria-label="Đóng"
            >
              <X size={24} />
            </button>
          </div>

          {/* Thông tin chính */}
          <div className="mb-6 space-y-3">
            <p className="text-sm text-gray-600 border-l-4 border-pink-500 pl-3 italic py-1">
              {activity.description}
            </p>
            <div className="flex space-x-4 flex-wrap gap-y-2">
              <div className="flex items-center text-sm font-semibold text-orange-600 bg-orange-50 px-3 py-1.5 rounded-xl">
                <Gift size={16} className="mr-2" />
                Phần Thưởng:{" "}
                <span className="ml-1 font-extrabold">{activity.reward}</span>
              </div>
              <div className="flex items-center text-sm font-semibold text-orange-700 bg-orange-50 px-3 py-1.5 rounded-xl">
                <DollarSign size={16} className="mr-2" />
                Chi Phí:{" "}
                <span className="ml-1 font-extrabold">{activity.cost}</span>
              </div>
            </div>
          </div>

          {/* Hướng dẫn chi tiết */}
          <div className="mb-6">
            <h3 className="text-xl font-bold text-gray-800 mb-3 flex items-center">
              <CheckCircle size={20} className="mr-2 text-orange-500" /> Hướng
              Dẫn Chi Tiết
            </h3>
            <ol className="space-y-4 text-gray-700">
              {activity.requirements.map((req, index) => {
                // Phân tích để làm nổi bật tiêu đề bước
                const parts = req.split(":");
                const isHeader =
                  parts[0].startsWith("Bước") || parts[0].startsWith("Lưu ý");

                return (
                  <li key={index}>
                    <div
                      className={`text-sm ${
                        isHeader
                          ? "font-extrabold text-gray-900"
                          : "text-gray-700"
                      }`}
                    >
                      {isHeader ? (
                        <span className="inline-flex items-center">
                          <span className="inline-flex items-center justify-center w-5 h-5 mr-2 bg-orange-500 text-white rounded-full text-xs font-bold">
                            {index + 1}
                          </span>
                          {req}
                        </span>
                      ) : (
                        <span className="ml-7 block">— {req}</span>
                      )}
                    </div>
                  </li>
                );
              })}
            </ol>
          </div>

          {/* Nút Thực Hiện Hành Động */}
          <button
            // Màu xanh lá cây nổi bật
            className="w-full inline-flex items-center justify-center px-6 py-3 bg-orange-500 text-white font-bold rounded-xl transition duration-200 hover:bg-orange-600 text-lg shadow-xl shadow-orange-500/50 transform hover:scale-[1.01]"
            onClick={onClose} // Đóng modal và chuyển hướng/thực hiện hành động
          >
            <Zap size={20} className="inline mr-2" />
            Bắt Đầu Thực Hiện Ngay!
          </button>
        </div>
      </div>
    </div>
  );
};

/**
 * Thẻ Hoạt Động (Card)
 */
const ActivityCard: React.FC<{
  activityKey: keyof typeof DAILY_ACTIVITIES;
  onClick: (key: keyof typeof DAILY_ACTIVITIES) => void;
}> = ({ activityKey, onClick }) => {
  const activity = DAILY_ACTIVITIES[activityKey];
  const isCostFree = activity.cost.includes("Miễn phí");

  const handleCardClick = useCallback(() => {
    onClick(activityKey);
  }, [activityKey, onClick]);

  return (
    <div
      onClick={handleCardClick}
      // Thẻ sang trọng hơn với bo góc lớn hơn, border tinh tế và shadow
      className="bg-white p-5 rounded-3xl shadow-xl border border-gray-100 flex flex-col transition duration-300 hover:shadow-2xl hover:border-orange-400 hover:ring-2 hover:ring-pink-400/30 cursor-pointer h-full"
    >
      <div className="flex items-center justify-between mb-3">
        <span className="p-3 bg-orange-50 rounded-xl">{activity.icon}</span>
        <span
          className={`text-xs font-semibold px-3 py-1 rounded-full ${
            isCostFree
              ? "bg-orange-100 text-orange-600"
              : "bg-yellow-100 text-yellow-700"
          }`}
        >
          {activity.cost}
        </span>
      </div>

      <h3 className="text-xl font-bold text-gray-900 line-clamp-1 mb-1">
        {activity.title}
      </h3>

      <p className="text-sm text-gray-500 flex-1 line-clamp-2">
        {activity.description}
      </p>

      <div className="mt-3 pt-3 border-t border-gray-100 flex justify-between items-center">
        <div className="text-base font-bold text-orange-500 flex items-center">
          <Gift size={18} className="mr-1" />
          {activity.reward}
        </div>
        <button
          // Nút chi tiết màu xanh lá cây đậm
          className="px-4 py-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white text-sm font-semibold rounded-lg hover:from-orange-600 hover:to-orange-700 transition shadow-md"
        >
          Chi tiết
        </button>
      </div>
    </div>
  );
};

// =========================================================================
// 3. MAIN APP
// =========================================================================

export default function Activities() {
  const [selectedActivity, setSelectedActivity] = useState<
    keyof typeof DAILY_ACTIVITIES | null
  >(null);

  const handleActivityClick = useCallback(
    (key: keyof typeof DAILY_ACTIVITIES) => {
      setSelectedActivity(key);
    },
    []
  );

  const handleCloseModal = useCallback(() => {
    setSelectedActivity(null);
  }, []);

  const activityKeys = useMemo(
    () => Object.keys(DAILY_ACTIVITIES) as (keyof typeof DAILY_ACTIVITIES)[],
    []
  );

  return (
    <div className="min-h-screen py-8 sm:py-12 font-sans">
      <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 space-y-8">
        {/* Header Section - Sang trọng hơn */}
        <header className="text-center bg-white p-6 rounded-3xl shadow-2xl border border-orange-100">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 flex items-center justify-center">
            <Leaf size={36} className="text-orange-500 mr-3" />
            Trung Tâm Hoạt Động (VIP)
          </h1>
          <p className="mt-2 text-lg text-gray-600">
            Kiếm Points và phần thưởng giá trị mỗi ngày. Thiết kế sang trọng,
            trải nghiệm hoàn hảo.
          </p>
          {/* Màu indigo/tím làm màu nhấn tương phản với xanh lá */}
          <div className="mt-4 inline-flex items-center text-base font-semibold text-orange-700 bg-orange-100 px-4 py-2 rounded-full shadow-inner">
            <DollarSign size={18} className="mr-2" />
            Points hiện tại: <span className="font-extrabold ml-1">8,500</span>
          </div>
        </header>

        {/* Danh sách Hoạt Động */}
        <main>
          <h2 className="text-2xl font-bold text-gray-800 mb-4 px-1 flex items-center">
            <RotateCw size={24} className="text-orange-500 mr-2" />
            Hoạt Động Hàng Ngày & Định Kỳ
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6">
            {activityKeys.map((key) => (
              <ActivityCard
                key={key}
                activityKey={key}
                onClick={handleActivityClick}
              />
            ))}
          </div>
        </main>
      </div>

      {/* Modal Chi Tiết */}
      {selectedActivity && (
        <ActivityDetailModal
          activityKey={selectedActivity}
          onClose={handleCloseModal}
        />
      )}
    </div>
  );
}
