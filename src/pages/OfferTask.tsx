import React, { useState, useEffect, useMemo, useCallback } from "react";
import {
  Zap,
  Clock,
  Filter,
  BarChart2,
  Search,
  CheckCircle,
  Package,
  CreditCard,
  Target,
  TrendingUp,
  Loader2,
  X,
  AlertTriangle,
} from "lucide-react";
import taskService, { type Task } from "@/services/taskService";
import uploadService from "@/services/uploadService";
import TaskSubmitModal from "@/components/element/TaskSubmitModal";
import { notification } from "@/utils/notification";

// =========================================================================
// 1. INTERFACES & DATA
// =========================================================================

interface OfferCategory {
  id: string;
  name: string;
  icon: React.ReactNode;
}

interface OfferTask {
  id: string;
  title: string;
  description: string;
  rewardAmount: number;
  rewardUnit: "VND" | "Points" | "Cashback %";
  platformName: string;
  category: string; // Category ID
  timeEstimate: string; // e.g., "5 phút"
  statusBadge: "Hot" | "New" | "Expiring" | "High Rate";
  completionRate: number; // Percentage
  imgUrl: string;
  link: string;
  requirements: string[]; // Yêu cầu chi tiết để hoàn thành nhiệm vụ
}

const OFFER_CATEGORIES: OfferCategory[] = [
  { id: "all", name: "Tất cả", icon: <Filter size={16} /> },
  { id: "finance", name: "Tài chính", icon: <CreditCard size={16} /> },
  { id: "cashback", name: "Hoàn tiền", icon: <Package size={16} /> },
  { id: "point", name: "Tích điểm", icon: <Target size={16} /> },
  { id: "game", name: "Game/App", icon: <Zap size={16} /> },
  { id: "survey", name: "Khảo sát", icon: <BarChart2 size={16} /> },
  { id: "shopping", name: "Mua sắm", icon: <TrendingUp size={16} /> },
];

const ALL_OFFERS: OfferTask[] = [
  {
    id: "o1",
    title: "Đăng ký tài khoản Ngân hàng A, nhận ngay 200K",
    description: "Mở tài khoản, định danh KYC online. Yêu cầu: 18+.",
    rewardAmount: 200000,
    rewardUnit: "VND",
    platformName: "MB Bank",
    category: "finance",
    timeEstimate: "5 phút",
    statusBadge: "Hot",
    completionRate: 85,
    imgUrl: "https://placehold.co/100x100/10B981/FFFFFF?text=BANK",
    link: "https://banka.com/join",
    requirements: [
      "Bước 1 - Tải ứng dụng và Đăng ký:",
      "Tải ứng dụng Ngân hàng A từ App Store/Google Play. Chỉ sử dụng **link giới thiệu** từ ứng dụng này. Không tải trực tiếp.",
      "Bước 2 - Định danh (KYC) thành công:",
      "Cung cấp CCCD/CMND rõ ràng, chụp ảnh khuôn mặt theo hướng dẫn để hoàn tất định danh. **Trạng thái tài khoản phải là ACTIVE**.",
      "Bước 3 - Phát sinh giao dịch đầu tiên (Rất quan trọng):",
      "Thực hiện một giao dịch **nạp tiền hoặc chuyển khoản** tối thiểu **50.000 VNĐ** trong vòng 7 ngày kể từ khi mở tài khoản.",
      "Bước 4 - Xác minh và Nhận thưởng:",
      "Hệ thống Ngân hàng A sẽ xác minh giao dịch của bạn. Phần thưởng **200.000 VNĐ** sẽ được cộng vào Ví Tiền VNĐ của bạn sau **3 ngày làm việc** (không tính T7, CN) kể từ ngày xác minh thành công. Nếu không nhận được, vui lòng gửi ticket hỗ trợ.",
    ],
  },
  {
    id: "o6",
    title: "Xem video quảng cáo và trả lời 3 câu hỏi",
    description: "Kiếm Points siêu nhanh, tăng cấp độ tài khoản.",
    rewardAmount: 150,
    rewardUnit: "Points",
    platformName: "AdView",
    category: "point",
    timeEstimate: "2 phút",
    statusBadge: "New",
    completionRate: 70,
    imgUrl: "https://placehold.co/100x100/F59E0B/FFFFFF?text=ADS",
    link: "https://adview.com/task",
    requirements: [
      "Bước 1 - Bấm Tham gia:",
      "Bạn sẽ được chuyển hướng đến trang xem video. Lưu ý **không được đóng hoặc chuyển tab** trong quá trình xem.",
      "Bước 2 - Xem video đủ thời lượng:",
      "Video có thời lượng **30 giây**. Bạn phải xem hết 100% video.",
      "Bước 3 - Trả lời Câu hỏi Kiểm tra:",
      "Sau khi video kết thúc, 3 câu hỏi trắc nghiệm sẽ hiện ra. Bạn phải trả lời đúng **cả 3 câu hỏi** trong vòng **60 giây**.",
      "Bước 4 - Cộng Points:",
      "Nếu hoàn thành đúng cả 3 bước trên, **150 Points** sẽ được cộng tức thì vào tài khoản Points Rank của bạn.",
    ],
  },
  {
    id: "o4",
    title: "Hoàn tiền 10% khi mua sắm tại Shopee",
    description: "Áp dụng cho đơn hàng đầu tiên, tối đa 50K.",
    rewardAmount: 10,
    rewardUnit: "Cashback %",
    platformName: "Shopee",
    category: "cashback",
    timeEstimate: "Tức thì",
    statusBadge: "High Rate",
    completionRate: 98,
    imgUrl: "https://placehold.co/100x100/F97316/FFFFFF?text=SHOP",
    link: "https://shopee.vn/affiliate",
    requirements: [
      "Bước 1 - Truy cập qua Link:",
      "Bấm **'Tham gia'** để được chuyển hướng đến Ứng dụng/Website Shopee. **KHÔNG** thêm sản phẩm vào giỏ trước khi bấm.",
      "Bước 2 - Điều kiện Đơn hàng:",
      "Áp dụng cho **ĐƠN HÀNG ĐẦU TIÊN** của bạn trên Shopee sau khi bấm link. Giá trị đơn hàng tối thiểu **100.000 VNĐ**.",
      "Bước 3 - Quy tắc Hoàn tiền:",
      "Tỉ lệ hoàn tiền là **10%** giá trị đơn hàng thực tế (sau khi trừ voucher). Mức hoàn tiền tối đa là **50.000 VNĐ**.",
      "Bước 4 - Xác nhận và Rút tiền:",
      "Cashback sẽ được ghi nhận là 'Chờ duyệt' sau khi bạn nhận hàng. Tiền sẽ chuyển sang 'Khả dụng' sau **60 ngày** (thời gian đổi trả) và bạn có thể rút tiền về tài khoản ngân hàng.",
    ],
  },
  {
    id: "o5",
    title: "Hoàn tiền 5% tất cả dịch vụ thanh toán MoMo",
    description: "Hoàn tiền cho hóa đơn điện, nước, internet qua app.",
    rewardAmount: 5,
    rewardUnit: "Cashback %",
    platformName: "MoMo",
    category: "cashback",
    timeEstimate: "Tức thì",
    statusBadge: "Expiring",
    completionRate: 95,
    imgUrl: "https://placehold.co/100x100/A855F7/FFFFFF?text=MOMO",
    link: "https://momo.vn/cashback",
    requirements: [
      "Bước 1 - Mở Ứng dụng MoMo:",
      "Bấm 'Tham gia' để mở MoMo App. Đảm bảo bạn đang sử dụng phiên bản MoMo mới nhất.",
      "Bước 2 - Thanh toán Hóa đơn:",
      "Thực hiện thanh toán **bất kỳ hóa đơn** dịch vụ (Điện, Nước, Internet, Truyền hình cáp) với giá trị **tối thiểu 80.000 VNĐ**.",
      "Bước 3 - Nhận Cashback:",
      "Tiền Cashback **5%** sẽ được hoàn lại ngay lập tức vào Ví Tiền MoMo của bạn (Không phải ví khuyến mại).",
      "Bước 4 - Giới hạn:",
      "Chương trình áp dụng tối đa **3 lần/tháng** và tổng mức hoàn tiền tối đa là **20.000 VNĐ/tháng** cho mỗi người dùng.",
    ],
  },
  {
    id: "o2",
    title: "Chơi game Thần Rồng Đại Chiến đạt cấp 10",
    description: "Cài đặt và hoàn thành nhiệm vụ trong game.",
    rewardAmount: 1500,
    rewardUnit: "Points",
    platformName: "Google Play",
    category: "point",
    timeEstimate: "20 phút",
    statusBadge: "New",
    completionRate: 15,
    imgUrl: "https://placehold.co/100x100/F59E0B/FFFFFF?text=GAME",
    link: "https://googleplay.com/game",
    requirements: [
      "Bước 1 - Cài đặt game chính xác:",
      "Cài đặt Game 'Thần Rồng Đại Chiến' **DUY NHẤT** qua link giới thiệu. Không cài đặt nếu đã từng chơi game này trên thiết bị hiện tại.",
      "Bước 2 - Hoàn thành mục tiêu:",
      "Đạt đến cấp độ **Level 10** trong Game. Thường mất khoảng 20-30 phút chơi liên tục.",
      "Bước 3 - Yêu cầu giữ ứng dụng:",
      "Sau khi đạt Level 10, **KHÔNG GỠ** ứng dụng và phải mở lại game ít nhất một lần sau **48 giờ** để hệ thống tracking ghi nhận thành công.",
      "Bước 4 - Xác nhận Points:",
      "**1500 Points** sẽ được cộng tự động vào tài khoản của bạn trong vòng **1 giờ** sau khi hệ thống ghi nhận thành công (sau 48 giờ).",
    ],
  },
  {
    id: "o3",
    title: "Hoàn thành Khảo sát thị trường về Smartphone",
    description: "Trả lời các câu hỏi về xu hướng tiêu dùng di động.",
    rewardAmount: 500,
    rewardUnit: "Points",
    platformName: "SurveyX",
    category: "point",
    timeEstimate: "10 phút",
    statusBadge: "Expiring",
    completionRate: 60,
    imgUrl: "https://placehold.co/100x100/3B82F6/FFFFFF?text=SURV",
    link: "https://surveyx.com/smartphone",
    requirements: [
      "Bước 1 - Thông tin người dùng:",
      "Bấm 'Tham gia' và điền đầy đủ thông tin cá nhân. Đảm bảo thông tin (Tuổi, Nghề nghiệp) phải **TRÙNG KHỚP** với hồ sơ bạn đã khai báo với chúng tôi.",
      "Bước 2 - Hoàn tất khảo sát:",
      "Hoàn thành tất cả **25 câu hỏi** trong khảo sát. Thời gian tối thiểu để hoàn thành là **8 phút**.",
      "Bước 3 - Kiểm tra chất lượng (Quality Check):",
      "Trả lời phải trung thực. Khảo sát có **3 câu hỏi kiểm tra** (Attention Check). Nếu trả lời sai 2/3 câu, khảo sát sẽ bị từ chối.",
      "Bước 4 - Nhận Points:",
      "**500 Points** sẽ được cộng sau khi Khảo sát được duyệt bởi SurveyX (quá trình này thường mất từ **4-24 giờ**).",
    ],
  },
];

// =========================================================================
// 2. STYLING & UTILS
// =========================================================================

const PRIMARY_COLOR_HEX = "#00b47d";

// Helper function để định dạng phần thưởng
const formatReward = (amount: number, unit: OfferTask["rewardUnit"]) => {
  if (unit === "VND") {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    })
      .format(amount)
      .replace("₫", "VNĐ");
  } else if (unit === "Cashback %") {
    return `${amount}%`;
  }
  return `${amount} Points`;
};

// =========================================================================
// 3. COMPONENTS
// =========================================================================

/**
 * Modal hiển thị chi tiết nhiệm vụ và các bước thực hiện.
 */
const OfferDetailModal: React.FC<{ offer: OfferTask; onClose: () => void }> = ({
  offer,
  onClose,
}) => {
  const [uploadedImages, setUploadedImages] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [showSubmitSection, setShowSubmitSection] = useState(false);

  const rewardText = formatReward(offer.rewardAmount, offer.rewardUnit);
  const isCashback = offer.rewardUnit === "Cashback %";
  const isVND = offer.rewardUnit === "VND";

  const rewardStyle = isVND
    ? "text-green-600"
    : isCashback
    ? "text-cyan-600"
    : "text-orange-500";
  const rewardIcon = isVND ? (
    <CreditCard size={20} />
  ) : isCashback ? (
    <Package size={20} />
  ) : (
    <Target size={20} />
  );

  const getStepNumber = (stepText: string) => {
    const match = stepText.match(/Bước (\d+)/);
    return match ? match[1] : null;
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length + uploadedImages.length > 5) {
      alert("Bạn chỉ có thể tải lên tối đa 5 ảnh");
      return;
    }

    setUploadedImages([...uploadedImages, ...files]);

    const newPreviews = files.map((file) => URL.createObjectURL(file));
    setPreviewUrls([...previewUrls, ...newPreviews]);
  };

  const removeImage = (index: number) => {
    const newImages = uploadedImages.filter((_, i) => i !== index);
    const newPreviews = previewUrls.filter((_, i) => i !== index);
    URL.revokeObjectURL(previewUrls[index]);
    setUploadedImages(newImages);
    setPreviewUrls(newPreviews);
  };

  const handleSubmitTask = async () => {
    if (uploadedImages.length === 0) {
      notification({
        message:
          "Vui lòng tải lên ít nhất 1 ảnh chứng minh hoàn thành nhiệm vụ",
        type: "warning",
      });
      return;
    }

    setSubmitting(true);
    try {
      // Upload image to server
      const uploadResponse = await uploadService.uploadImage(uploadedImages[0]);
      const proofImageUrl = uploadResponse.data.imageUrl;

      // Submit task with uploaded image URL
      await taskService.submitTask(offer.id, proofImageUrl);

      notification({
        message: "Đã gửi nhiệm vụ thành công! Chờ xét duyệt.",
        type: "success",
      });

      // Clean up preview URLs
      previewUrls.forEach((url) => URL.revokeObjectURL(url));

      onClose();
    } catch (error: any) {
      console.error("Error submitting task:", error);
      notification({
        message:
          error?.response?.data?.message || "Có lỗi xảy ra. Vui lòng thử lại!",
        type: "error",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 bg-gray-900 bg-opacity-75 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-3xl shadow-3xl max-w-lg w-full max-h-[90vh] overflow-y-auto transform transition-all duration-300 scale-100"
        onClick={(e) => e.stopPropagation()} // Ngăn chặn đóng modal khi click bên trong
      >
        <div className="p-6 sm:p-8">
          {/* Header */}
          <div className="flex justify-between items-start border-b pb-4 mb-4">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 leading-snug pr-8">
              {offer.title}
            </h2>
            <button
              onClick={onClose}
              className="p-2 -mr-2 text-gray-500 hover:text-gray-700 transition rounded-full hover:bg-gray-100"
              aria-label="Đóng"
            >
              <X size={24} />
            </button>
          </div>

          {/* Thông tin phần thưởng và mô tả */}
          <div className="mb-6 space-y-3">
            <div className="flex items-center space-x-2 text-lg font-bold">
              <span
                className={`p-2 rounded-full ${rewardStyle} bg-opacity-10`}
                style={{
                  background: isVND
                    ? "#10B9811A"
                    : isCashback
                    ? "#06B6D41A"
                    : "#F973161A",
                }}
              >
                {rewardIcon}
              </span>
              <span
                className={`text-xl sm:text-2xl font-black ${rewardStyle} tracking-tight`}
              >
                {rewardText}
              </span>
              <span className="text-gray-500 font-medium text-base">
                | {offer.platformName}
              </span>
            </div>
            <p className="text-sm text-gray-600 border-l-4 border-green-500 pl-3 italic py-1">
              "{offer.description}"
            </p>
          </div>

          {/* Yêu cầu chi tiết - Design mới đẹp hơn */}
          <div className="mb-6">
            <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center bg-linear-to-r from-green-50 to-emerald-50 p-3 rounded-xl">
              <CheckCircle size={22} className="mr-2 text-green-600" />
              <span>Hướng dẫn chi tiết</span>
            </h3>
            <div className="space-y-3">
              {offer.requirements.map((step, index) => {
                const stepNumber = getStepNumber(step);
                const isHeader = stepNumber !== null;

                // Nếu là tiêu đề bước (Bước X - Tên bước)
                if (isHeader) {
                  const [header, ...details] = step
                    .split(":")
                    .map((s) => s.trim());
                  // Lấy tên bước sau dấu "-"
                  const stepTitle =
                    header.split("-").slice(1).join("-").trim() || header;

                  return (
                    <div
                      key={index}
                      className="bg-linear-to-r from-green-50 via-emerald-50 to-teal-50 p-4 rounded-xl border-l-4 border-green-500 shadow-sm hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-start gap-3">
                        <div className="shrink-0 flex items-center justify-center w-10 h-10 bg-linear-to-br from-green-500 to-emerald-600 text-white rounded-lg text-lg font-black shadow-lg">
                          {stepNumber}.
                        </div>
                        <div className="flex-1">
                          <h4 className="font-bold text-base text-gray-900 mb-1 flex items-center gap-2">
                            <span className="text-green-700">{stepTitle}</span>
                          </h4>
                          {details.length > 0 && (
                            <p className="text-sm text-gray-700 leading-relaxed">
                              {details.join(":").trim()}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                } else {
                  // Nếu là nội dung chi tiết
                  return (
                    <div
                      key={index}
                      className="pl-[52px] text-sm text-gray-700 leading-relaxed flex items-start gap-2"
                    >
                      <span className="text-green-600 font-bold shrink-0">
                        →
                      </span>
                      <span>{step}</span>
                    </div>
                  );
                }
              })}
            </div>
            <div className="mt-4 p-3 bg-red-50 border-l-4 border-red-400 rounded-lg">
              <p className="text-xs text-red-600 font-semibold flex items-start gap-2">
                <AlertTriangle size={20} className="text-orange-500" />
                <span>
                  Lưu ý: Mọi sai sót trong việc thực hiện các bước trên đều có
                  thể dẫn đến việc nhiệm vụ <strong>không được ghi nhận</strong>{" "}
                  và không được cộng thưởng.
                </span>
              </p>
            </div>
          </div>

          {/* Phần Submit ảnh */}
          <div className="mb-6">
            <button
              onClick={() => setShowSubmitSection(!showSubmitSection)}
              className="w-full flex items-center justify-between p-4 bg-linear-to-r from-blue-50 to-indigo-50 rounded-xl border-2 border-blue-200 hover:border-blue-400 transition-all"
            >
              <div className="flex items-center gap-2">
                <Package size={20} className="text-blue-600" />
                <span className="font-bold text-gray-800">
                  Đã hoàn thành? Gửi bằng chứng
                </span>
              </div>
              <span className="text-blue-600 font-bold">
                {showSubmitSection ? "−" : "+"}
              </span>
            </button>

            {showSubmitSection && (
              <div className="mt-4 p-4 bg-gray-50 rounded-xl border border-gray-200">
                <h4 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
                  <span className="text-lg">📸</span>
                  Tải lên ảnh chứng minh (Tối đa 5 ảnh)
                </h4>

                <div className="mb-4">
                  <label className="flex items-center justify-center w-full p-6 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:border-green-500 hover:bg-green-50 transition-all bg-white">
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                      disabled={uploadedImages.length >= 5}
                    />
                    <div className="text-center">
                      <Package
                        size={32}
                        className="mx-auto mb-2 text-gray-400"
                      />
                      <p className="text-sm font-semibold text-gray-700">
                        Nhấn để chọn ảnh
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        PNG, JPG (Tối đa 5 ảnh)
                      </p>
                    </div>
                  </label>
                </div>

                {/* Preview ảnh đã tải */}
                {previewUrls.length > 0 && (
                  <div className="grid grid-cols-3 gap-3 mb-4">
                    {previewUrls.map((url, index) => (
                      <div key={index} className="relative group">
                        <img
                          src={url}
                          alt={`Preview ${index + 1}`}
                          className="w-full h-24 object-cover rounded-lg border-2 border-gray-200"
                        />
                        <button
                          onClick={() => removeImage(index)}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                        >
                          <X size={16} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                <button
                  onClick={handleSubmitTask}
                  disabled={uploadedImages.length === 0 || submitting}
                  className="w-full py-3 px-6 bg-linear-to-r from-green-600 to-emerald-600 text-white font-bold rounded-xl hover:from-green-700 hover:to-emerald-700 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed transition-all shadow-lg flex items-center justify-center gap-2"
                >
                  {submitting ? (
                    <>
                      <Loader2 size={20} className="animate-spin" />
                      Đang gửi...
                    </>
                  ) : (
                    <>
                      <CheckCircle size={20} />
                      Gửi nhiệm vụ để xét duyệt
                    </>
                  )}
                </button>

                <p className="text-xs text-gray-500 text-center mt-2">
                  Nhiệm vụ của bạn sẽ được xét duyệt trong vòng 24-48 giờ
                </p>
              </div>
            )}
          </div>

          {/* CTA cuối */}
          <a
            href={offer.link}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full inline-flex items-center justify-center px-6 py-4 bg-linear-to-r from-green-600 to-emerald-600 text-white font-bold rounded-xl transition duration-200 hover:from-green-700 hover:to-emerald-700 text-lg shadow-xl shadow-green-500/30 transform hover:scale-[1.02]"
          >
            <Zap size={22} className="inline mr-2" />
            Bắt đầu Thực hiện Nhiệm vụ
          </a>
        </div>
      </div>
    </div>
  );
};

/**
 * Thẻ nhiệm vụ riêng lẻ (Offer Card) - Kích thước đã được thu nhỏ
 */
const OfferCard: React.FC<{
  offer: OfferTask;
  onJoin: (offer: OfferTask) => void;
}> = ({ offer, onJoin }) => {
  const badgeColors = {
    Hot: "bg-red-500",
    New: "bg-blue-500",
    Expiring: "bg-yellow-500",
    "High Rate": "bg-green-600",
  };

  const rewardText = formatReward(offer.rewardAmount, offer.rewardUnit);

  const isCashback = offer.rewardUnit === "Cashback %";
  const isVND = offer.rewardUnit === "VND";

  const rewardStyle = useMemo(() => {
    if (isVND) {
      return "text-green-600 font-black";
    }
    if (isCashback) {
      return "text-cyan-600 font-black";
    }
    // Mặc định cho Points (Cam/Vàng)
    return "text-orange-500 font-black";
  }, [offer.rewardUnit]);

  const rewardUnitLabel = useMemo(() => {
    if (isVND) return "Thưởng VNĐ";
    if (isCashback) return "Hoàn tiền";
    // Tên nhãn ngắn gọn, tập trung vào Points
    return "Points";
  }, [offer.rewardUnit]);

  const handleJoinClick = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      onJoin(offer);
    },
    [offer, onJoin]
  );

  return (
    <div className="bg-white p-3 sm:p-4 rounded-2xl shadow-xl border border-gray-100 flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-5 transition duration-300 hover:shadow-2xl hover:border-green-400 hover:ring-2 hover:ring-green-400/20 cursor-pointer">
      {/* Khối chính: Image & Info */}
      <div className="flex flex-1 gap-3 items-start min-w-0">
        <div className="relative shrink-0 pt-1">
          <img
            src={offer.imgUrl}
            alt={offer.title}
            className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl object-cover shadow-lg border-2 border-white ring-2 ring-gray-200"
            onError={(e) => {
              e.currentTarget.onerror = null;
              e.currentTarget.src = `https://placehold.co/100x100/CCCCCC/666666?text=${offer.platformName.substring(
                0,
                4
              )}`;
            }}
          />
          <span
            className={`absolute -top-2 -right-2 text-[10px] font-bold text-white px-1.5 py-0.5 rounded-full shadow-lg ${
              badgeColors[offer.statusBadge]
            } transform rotate-3`}
          >
            {offer.statusBadge}
          </span>
        </div>

        {/* Cột 2: Thông tin chính và Metadata */}
        <div className="flex-1 min-w-0">
          <h3 className="text-base sm:text-lg font-bold text-gray-900 line-clamp-2 transition hover:text-green-600 leading-snug">
            {offer.title}
          </h3>
          <p className="text-xs text-gray-600 mt-1 line-clamp-2">
            {offer.description}
          </p>

          {/* Metadata chi tiết */}
          <div className="flex flex-wrap items-center text-[10px] text-gray-500 mt-1.5 sm:mt-2 gap-2 sm:gap-3">
            <span className="flex items-center font-medium text-gray-600">
              <Clock size={11} className="mr-1 text-blue-500" />
              {offer.timeEstimate}
            </span>
            <span className="flex items-center font-medium text-gray-600">
              <CheckCircle size={11} className="mr-1 text-green-500" />
              <span className="font-bold">{offer.completionRate}%</span>
              &nbsp;Tỷ lệ hoàn thành
            </span>
            <span className="text-[10px] font-semibold text-gray-700 bg-gray-100 px-2 py-0.5 rounded-lg border border-gray-200">
              {offer.platformName}
            </span>
          </div>
        </div>
      </div>

      {/* Cột 3: Phần thưởng và CTA - Tối ưu và nhỏ gọn hơn */}
      <div className="w-full sm:w-32 flex flex-row sm:flex-col items-center justify-between sm:justify-center border-t border-gray-100 sm:border-t-0 sm:border-l sm:pl-4 pt-3 sm:pt-0">
        <div className="text-left sm:text-center flex-1 sm:flex-auto mb-1 sm:mb-2">
          {/* Giảm cỡ chữ nhãn (text-[10px] - Rất nhỏ) */}
          <p className="text-[10px] text-gray-500 font-medium whitespace-nowrap uppercase">
            {rewardUnitLabel}
          </p>
          {/* Giảm cỡ chữ phần thưởng (text-base) */}
          <p className={`text-base tracking-tight mt-0.5 ${rewardStyle}`}>
            {rewardText}
          </p>
        </div>
        <button
          onClick={handleJoinClick}
          // Giảm padding nút CTA (px-3 py-2)
          className={`mt-0 sm:mt-1 w-full px-3 py-2 bg-green-600 text-white font-semibold rounded-xl transition duration-200 text-sm shadow-lg transform hover:scale-[1.03] shrink-0 whitespace-nowrap flex items-center justify-center hover:bg-green-700`}
        >
          <Zap size={14} className="inline mr-1" />
          Tham gia
        </button>
      </div>
    </div>
  );
};

// =========================================================================
// 4. MAIN PAGE COMPONENT
// =========================================================================

export default function App() {
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [sortOrder, setSortOrder] = useState<"reward" | "newest">("reward");
  const [searchTerm, setSearchTerm] = useState<string>("");
  // State để quản lý modal chi tiết
  const [selectedOffer, setSelectedOffer] = useState<OfferTask | null>(null);

  // States cho API
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch tasks từ API
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await taskService.getTasks({
          status: "active",
          page: 1,
          limit: 100,
        });
        setTasks(response.data || []);
      } catch (err: any) {
        console.error("Error fetching tasks:", err);
        setError(err?.message || "Không thể tải danh sách nhiệm vụ");
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, []);

  // Map Task từ backend sang OfferTask format
  const mapTaskToOffer = useCallback((task: Task): OfferTask => {
    // Map task type to category
    const categoryMap: Record<string, string> = {
      survey: "survey",
      app_install: "game",
      registration: "finance",
      purchase: "shopping",
      social_media: "point",
      other: "all",
    };

    // Calculate completion rate
    const completionRate = task.maxCompletions
      ? Math.round((task.completedCount / task.maxCompletions) * 100)
      : Math.round((task.completedCount / 100) * 100);

    // Determine status badge
    let statusBadge: "Hot" | "New" | "Expiring" | "High Rate" = "New";
    if (task.reward >= 100000) {
      statusBadge = "Hot";
    } else if (completionRate >= 90) {
      statusBadge = "High Rate";
    }

    return {
      id: String(task._id),
      title: task.title,
      description: task.description || "",
      rewardAmount: task.reward,
      rewardUnit: "VND",
      platformName: task.platform || "Platform",
      category: categoryMap[task.type] || "all",
      timeEstimate: "5-10 phút",
      statusBadge,
      completionRate: Math.min(completionRate, 100),
      imgUrl: `https://placehold.co/100x100/10B981/FFFFFF?text=${(
        task.platform?.substring(0, 4) || "TASK"
      ).toUpperCase()}`,
      link: "#",
      requirements: task.requirements || [],
    };
  }, []);

  // Kết hợp data từ API và data mẫu
  const allOffers = useMemo(() => {
    const apiOffers = tasks.map(mapTaskToOffer);
    // Kết hợp với data mẫu nếu API không có data
    return apiOffers.length > 0 ? apiOffers : ALL_OFFERS;
  }, [tasks, mapTaskToOffer]);

  const handleJoinOffer = useCallback((offer: OfferTask) => {
    setSelectedOffer(offer); // Mở modal với nhiệm vụ được chọn
  }, []);

  const filteredAndSortedOffers = useMemo(() => {
    let list = allOffers;

    if (activeCategory !== "all") {
      list = list.filter((offer) => offer.category === activeCategory);
    }
    if (searchTerm) {
      list = list.filter(
        (offer) =>
          offer.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          offer.platformName.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Sắp xếp: Ưu tiên VND > Points > Cashback
    if (sortOrder === "reward") {
      list.sort((a, b) => {
        // 1. VND (cao nhất)
        if (a.rewardUnit === "VND" && b.rewardUnit !== "VND") return -1;
        if (a.rewardUnit !== "VND" && b.rewardUnit === "VND") return 1;
        // 2. Points (cao thứ hai)
        if (a.rewardUnit === "Points" && b.rewardUnit !== "Points") return -1;
        if (a.rewardUnit !== "Points" && b.rewardUnit === "Points") return 1;
        // 3. Cashback % (cuối cùng)

        // Sắp xếp theo số lượng (trong cùng loại)
        return b.rewardAmount - a.rewardAmount;
      });
    } else if (sortOrder === "newest") {
      list.sort((a, b) => (b.id > a.id ? 1 : -1));
    }

    return list;
  }, [allOffers, activeCategory, sortOrder, searchTerm]);

  const getCategoryColor = (id: string) => {
    switch (id) {
      case "finance":
        return "text-indigo-600";
      case "cashback":
        return "text-cyan-600";
      case "point":
        return "text-orange-500";
      case "game":
        return "text-purple-600";
      case "survey":
        return "text-blue-600";
      case "shopping":
        return "text-pink-600";
      default:
        return "text-gray-600";
    }
  };

  return (
    <div
      className="min-h-screen bg-gray-50 py-6 sm:py-10 font-sans"
      style={{ "--primary-color": PRIMARY_COLOR_HEX } as React.CSSProperties}
    >
      <div className="w-full max-w-6xl mx-auto px-3 sm:px-4">
        {/* HERO SECTION - Green Chủ Đạo */}
        <header
          className={`bg-linear-to-r from-green-600 to-green-400 rounded-2xl p-6 sm:p-8 mb-6 sm:mb-8 shadow-2xl shadow-green-500/50 text-white relative overflow-hidden`}
        >
          <h1 className="text-3xl sm:text-4xl font-extrabold relative z-10 tracking-tight">
            Săn Tiền Thưởng & Hoàn Tiền Hot!
          </h1>
          <p className="mt-1 text-base sm:text-lg opacity-95 relative z-10">
            Kiếm VNĐ, tích Points, nâng Rank — Tất cả trong một ứng dụng.
          </p>

          {/* STATS SECTION - Points và Cashback nổi bật */}
          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 relative z-10">
            {/* Stat 1: Nhiệm vụ đang hoạt động */}
            <div className="bg-white/15 p-3 sm:p-4 rounded-xl backdrop-blur-sm border border-white/20">
              <p className="text-2xl sm:text-3xl font-black">24+</p>
              <p className="text-xs opacity-90">Nhiệm vụ đang hoạt động</p>
            </div>
            {/* Stat 2: Tổng thưởng */}
            <div className="bg-white/15 p-3 sm:p-4 rounded-xl backdrop-blur-sm border border-white/20">
              <p className="text-2xl sm:text-3xl font-black">75M+ VNĐ</p>
              <p className="text-xs opacity-90">Tổng phần thưởng tháng này</p>
            </div>

            {/* Stat 3: Điểm Tích Lũy (Points - Màu Orange/Yellow nổi bật) */}
            <div className="bg-orange-400/20 text-orange-100 p-3 sm:p-4 rounded-xl backdrop-blur-sm border-2 border-orange-300/50 shadow-inner shadow-orange-500/20 flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold uppercase opacity-95 text-orange-200">
                  <Target size={16} className="inline mr-1" />
                  Điểm Tích Lũy (Rank)
                </p>
                <p className="text-2xl sm:text-3xl font-black mt-0.5 text-white">
                  12,500 Pts
                </p>
              </div>
              <a
                href="#"
                className="bg-white text-gray-800 text-xs font-bold px-3 py-1.5 rounded-lg shadow-md hover:bg-gray-100 transition whitespace-nowrap"
              >
                Nâng Rank
              </a>
            </div>

            {/* Stat 4: Cashback đã tiết kiệm (Màu Bổ sung Cyan) */}
            <div className="bg-cyan-400/20 text-cyan-100 p-3 sm:p-4 rounded-xl backdrop-blur-sm border-2 border-cyan-300/50 shadow-inner shadow-cyan-500/20 flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold uppercase opacity-95 text-cyan-200">
                  <Package size={16} className="inline mr-1" />
                  Cashback đã tiết kiệm
                </p>
                <p className="text-2xl sm:text-3xl font-black mt-0.5 text-white">
                  1,250,000 VNĐ
                </p>
              </div>
              <a
                href="#"
                className="bg-white text-gray-800 text-xs font-bold px-3 py-1.5 rounded-lg shadow-md hover:bg-gray-100 transition whitespace-nowrap"
              >
                Rút tiền
              </a>
            </div>
          </div>
        </header>

        {/* CONTROLS (Filters, Search, Sort) */}
        <div className="bg-white p-4 sm:p-5 rounded-2xl shadow-2xl border border-gray-100 mb-6 sm:mb-8">
          <h2 className="text-lg sm:text-xl font-bold text-gray-800 mb-4 flex items-center border-b pb-3">
            <Filter size={18} className="mr-2 text-green-600" /> Bộ lọc & Tìm
            kiếm
          </h2>

          {/* Category Filter */}
          <div className="mb-4 pt-1">
            <label className="block text-sm font-bold text-gray-800 mb-2">
              Lọc theo Danh mục:
            </label>
            <div className="flex flex-wrap gap-2">
              {OFFER_CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`flex items-center px-3 py-1.5 rounded-full text-xs font-semibold transition duration-200 shadow-md 
                                ${
                                  activeCategory === cat.id
                                    ? `bg-green-600 text-white border-2 border-green-600 ring-2 ring-offset-2 ring-green-400/50`
                                    : `bg-gray-50 ${getCategoryColor(
                                        cat.id
                                      )} border border-gray-200 hover:bg-gray-100`
                                }`}
                >
                  {cat.icon}
                  <span className="ml-1.5">{cat.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Search and Sort */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 mt-4 border-t pt-4">
            <div className="relative col-span-1 sm:col-span-2">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Tìm kiếm nhiệm vụ, nền tảng..."
                className="w-full pl-9 pr-3 py-2.5 border border-gray-300 rounded-xl bg-white text-gray-700 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 shadow-inner transition"
              />
              <Search
                size={16}
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              />
            </div>

            <div className="flex items-center space-x-2">
              <label className="text-sm font-medium text-gray-700 shrink-0">
                Sắp xếp:
              </label>
              <select
                value={sortOrder}
                onChange={(e) =>
                  setSortOrder(e.target.value as "reward" | "newest")
                }
                className="flex-1 py-2.5 px-3 border border-gray-300 bg-white rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-500 shadow-sm appearance-none"
              >
                <option value="reward">Phần thưởng cao nhất</option>
                <option value="newest">Mới nhất</option>
              </select>
            </div>
          </div>
        </div>

        {/* OFFER LIST */}
        <main>
          {loading ? (
            <div className="text-center py-20 bg-white rounded-2xl shadow-xl border border-gray-100">
              <Loader2 className="w-12 h-12 text-green-600 animate-spin mx-auto mb-4" />
              <p className="text-gray-600 text-lg font-semibold">
                Đang tải nhiệm vụ...
              </p>
            </div>
          ) : error ? (
            <div className="text-center py-20 bg-red-50 rounded-2xl shadow-xl border border-red-200">
              <AlertTriangle size={48} className="text-red-500 mb-4" />
              <p className="text-red-600 text-lg font-semibold mb-4">{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="px-6 py-2.5 bg-red-600 text-white font-semibold rounded-xl hover:bg-red-700 transition shadow-lg"
              >
                Thử lại
              </button>
            </div>
          ) : (
            <>
              <h2 className="text-2xl font-bold text-gray-800 mb-4 px-1">
                Kết quả ({filteredAndSortedOffers.length})
              </h2>
              {filteredAndSortedOffers.length === 0 ? (
                <div className="text-center text-base sm:text-xl text-gray-500 py-10 sm:py-12 bg-white rounded-2xl shadow-xl border border-gray-100">
                  Không tìm thấy nhiệm vụ nào phù hợp với bộ lọc và từ khóa.
                </div>
              ) : (
                <div className="space-y-4 sm:space-y-5">
                  {filteredAndSortedOffers.map((offer) => (
                    <OfferCard
                      key={offer.id}
                      offer={offer}
                      onJoin={handleJoinOffer}
                    />
                  ))}

                  {/* Load More Button (UX element) */}
                  <div className="text-center pt-3 sm:pt-4">
                    <button className="px-8 py-2.5 bg-white text-gray-700 font-semibold rounded-xl border-2 border-dashed border-gray-300 hover:bg-gray-100 transition shadow-md text-sm hover:shadow-lg">
                      Tải thêm nhiệm vụ
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </main>
      </div>

      {/* Modal chi tiết nhiệm vụ */}
      {selectedOffer && (
        <OfferDetailModal
          offer={selectedOffer}
          onClose={() => setSelectedOffer(null)}
        />
      )}
    </div>
  );
}
