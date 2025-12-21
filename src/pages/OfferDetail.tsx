import React, { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Zap,
  Clock,
  CheckCircle,
  Package,
  CreditCard,
  Target,
  Loader2,
  X,
  AlertTriangle,
  ArrowLeft,
  UploadCloud,
  Trophy,
  Wallet,
  User,
} from "lucide-react";
import taskService from "@/services/taskService";
import uploadService from "@/services/uploadService";
import profileService, { type UserProfile } from "@/services/profileService";
import { notification } from "@/utils/notification";
import { useAuthStore } from "@/store/authStore";

interface OfferTask {
  id: string;
  title: string;
  description: string;
  rewardAmount: number;
  rewardUnit: "VND" | "Points" | "Cashback %";
  platformName: string;
  category: string;
  timeEstimate: string;
  statusBadge: "Hot" | "New" | "Expiring" | "High Rate";
  completionRate: number;
  imgUrl: string;
  link: string;
  requirements: Array<{ title: string; description: string } | string>;
}

// Helper function để định dạng phần thưởng
const formatReward = (amount: number, unit: OfferTask["rewardUnit"]) => {
  if (unit === "VND") {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
      minimumFractionDigits: 0,
    })
      .format(amount)
      .replace("₫", " VNĐ");
  } else if (unit === "Cashback %") {
    return `${amount}% Cashback`;
  }
  return `${amount} Points`;
};

// --- SUB COMPONENTS FOR CLEANER UI ---

const RewardPill = ({
  icon,
  amount,
  unit,
}: {
  icon: React.ReactNode;
  amount: number;
  unit: OfferTask["rewardUnit"];
}) => {
  const rewardText = formatReward(amount, unit);

  return (
    <div className="flex items-center gap-4 px-6 py-4 rounded-xl bg-white/70 shadow-lg border border-pink-200 backdrop-blur-sm transition-all duration-300 hover:shadow-2xl hover:scale-[1.01]">
      <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-[#E91E63] to-[#FF8C1A] shadow-lg shrink-0">
        <span className="text-white w-6 h-6">{icon}</span>
      </div>
      <div>
        <p className="text-sm text-gray-500 font-medium uppercase tracking-wider">
          Phần thưởng
        </p>
        <p className="text-2xl font-black bg-gradient-to-r from-[#E91E63] to-[#FF8C1A] bg-clip-text text-transparent">
          {rewardText}
        </p>
      </div>
    </div>
  );
};

const InstructionStep = ({
  step,
  index,
  isLast,
}: {
  step: { title: string; description: string } | string;
  index: number;
  isLast?: boolean;
}) => {
  // Handle new object format
  if (typeof step === "object") {
    return (
      <div className="relative pl-20 pt-4 pb-2">
        {/* Vertical connecting line */}
        {!isLast && (
          <div className="absolute top-16 left-6 w-0.5 h-full bg-gradient-to-b from-[#E91E63] via-pink-300 to-[#FF8C1A] opacity-40"></div>
        )}

        {/* Step Number Badge with enhanced gradient */}
        <div className="absolute top-4 left-0 z-10 flex items-center justify-center w-14 h-14 bg-gradient-to-br from-[#E91E63] via-[#EC407A] to-[#FF8C1A] text-white rounded-2xl font-black text-xl shadow-2xl ring-4 ring-pink-50 transform hover:scale-110 transition-all duration-300 hover:rotate-6 hover:shadow-pink-500/50">
          <span className="relative z-10">{index + 1}</span>
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-tl from-orange-400 via-pink-500 to-rose-600 opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
        </div>

        <div className="group bg-gradient-to-br from-white via-pink-50/20 to-orange-50/20 rounded-2xl p-6 border-2 border-pink-200 shadow-lg hover:shadow-2xl transition-all duration-300 hover:border-pink-400 hover:-translate-y-1">
          <div className="flex items-start gap-3">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-3">
                <span className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-gradient-to-r from-[#E91E63] via-[#EC407A] to-[#FF8C1A] text-white text-xs font-black rounded-full shadow-lg ring-2 ring-pink-100 hover:ring-4 hover:ring-pink-200 hover:shadow-xl transition-all duration-200 hover:scale-105">
                  <svg
                    className="w-3 h-3"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span>Bước {index + 1}</span>
                </span>
              </div>
              <h3 className="font-black text-lg text-gray-900 mb-2 group-hover:bg-gradient-to-r group-hover:from-[#E91E63] group-hover:to-[#FF8C1A] group-hover:bg-clip-text group-hover:text-transparent transition-all duration-300 leading-tight">
                {step.title}
              </h3>
              {step.description && (
                <p className="text-sm text-gray-700 leading-relaxed border-l-4 border-pink-300 pl-3 py-1 italic bg-pink-50/50 rounded-r">
                  {step.description}
                </p>
              )}
            </div>
            <Zap
              size={20}
              className="text-[#FF8C1A] shrink-0 mt-1 animate-pulse"
            />
          </div>
        </div>
      </div>
    );
  }

  // Handle legacy string format
  const match = step.match(/Bước (\d+)/);
  const isHeader = match !== null;

  if (isHeader) {
    // Parsing format: "Bước X - Title: Description" or just "Bước X - Title"
    const [headerPart, ...detailsPart] = step.split(":");
    const fullTitle =
      headerPart.split("-").slice(1).join("-").trim() || headerPart;
    const stepTitle = fullTitle;
    const description = detailsPart.join(":").trim();

    return (
      <div className="relative pl-20 pt-4 pb-2">
        {/* Vertical connecting line */}
        {!isLast && (
          <div className="absolute top-16 left-6 w-0.5 h-full bg-gradient-to-b from-[#E91E63] via-pink-300 to-[#FF8C1A] opacity-40"></div>
        )}

        {/* Step Number Badge with enhanced gradient */}
        <div className="absolute top-4 left-0 z-10 flex items-center justify-center w-14 h-14 bg-gradient-to-br from-[#E91E63] via-[#EC407A] to-[#FF8C1A] text-white rounded-2xl font-black text-xl shadow-2xl ring-4 ring-pink-50 transform hover:scale-110 transition-all duration-300 hover:rotate-6 hover:shadow-pink-500/50">
          <span className="relative z-10">{index + 1}</span>
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-tl from-orange-400 via-pink-500 to-rose-600 opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
        </div>

        <div className="group bg-gradient-to-br from-white via-pink-50/20 to-orange-50/20 rounded-2xl p-6 border-2 border-pink-200 shadow-lg hover:shadow-2xl transition-all duration-300 hover:border-pink-400 hover:-translate-y-1">
          <div className="flex items-start gap-3">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-3">
                <span className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-gradient-to-r from-[#E91E63] via-[#EC407A] to-[#FF8C1A] text-white text-xs font-black rounded-full shadow-lg ring-2 ring-pink-100 hover:ring-4 hover:ring-pink-200 hover:shadow-xl transition-all duration-200 hover:scale-105">
                  <svg
                    className="w-3 h-3"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span>Bước {index + 1}</span>
                </span>
              </div>
              <h3 className="font-black text-lg text-gray-900 mb-2 group-hover:bg-gradient-to-r group-hover:from-[#E91E63] group-hover:to-[#FF8C1A] group-hover:bg-clip-text group-hover:text-transparent transition-all duration-300 leading-tight">
                {stepTitle}
              </h3>
              {description && (
                <p className="text-sm text-gray-700 leading-relaxed border-l-4 border-pink-300 pl-3 py-1 italic bg-pink-50/50 rounded-r">
                  {description}
                </p>
              )}
            </div>
            <Zap
              size={20}
              className="text-[#FF8C1A] shrink-0 mt-1 animate-pulse"
            />
          </div>
        </div>
      </div>
    );
  } else {
    // Detail step (use index as key, but don't show index)
    return (
      <div className="flex items-start gap-3 pl-20 text-gray-700 py-2">
        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-br from-pink-100 to-orange-100 border-2 border-pink-200 shrink-0 mt-0.5 shadow-sm">
          <span className="bg-gradient-to-r from-[#E91E63] to-[#FF8C1A] bg-clip-text text-transparent font-bold text-sm">
            {index + 1}
          </span>
        </div>
        <span className="text-sm sm:text-base leading-relaxed break-words flex-1">
          {step}
        </span>
      </div>
    );
  }
};

// --- MAIN COMPONENT ---

const OfferDetail: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, setUser } = useAuthStore(); // Get user from authStore

  const [offer, setOffer] = useState<OfferTask | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [uploadedImages, setUploadedImages] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);

  // Load User Profile from authStore
  useEffect(() => {
    // Use profile from authStore instead of fetching again
    if (user) {
      setUserProfile(user as UserProfile);
    }
  }, [user]);

  // Fetch Offer Detail
  useEffect(() => {
    const fetchOfferDetail = async () => {
      if (!id) return;

      try {
        setLoading(true);
        const taskData = await taskService.getTaskById(id);

        const offerData: OfferTask = {
          id: taskData._id,
          title: taskData.title,
          description: taskData.description || "",
          rewardAmount: taskData.reward || 0,
          rewardUnit: "VND",
          platformName: taskData.platform || "Platform",
          category: taskData.type || "other",
          timeEstimate: "Dưới 10 phút",
          statusBadge: "Hot",
          completionRate:
            taskData.maxCompletions > 0
              ? (taskData.completedCount / taskData.maxCompletions) * 100
              : 0,
          imgUrl: "",
          link: taskData.link || "#",
          requirements: taskData.requirements || taskData.steps || [],
        };

        setOffer(offerData);
      } catch (error: any) {
        console.error("Error fetching task:", error);
        notification({
          message:
            error.response?.data?.message || "Không thể tải thông tin nhiệm vụ",
          type: "error",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchOfferDetail();
  }, [id]);

  // Handle Image Upload and Preview
  const handleImageUpload = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = Array.from(e.target.files || []);
      const totalImages = files.length + uploadedImages.length;

      if (totalImages > 5) {
        notification({
          message: `Bạn chỉ có thể tải lên tối đa 5 ảnh (hiện tại: ${uploadedImages.length}, thêm: ${files.length}).`,
          type: "warning",
        });
        return;
      }

      setUploadedImages((prev) => [...prev, ...files]);

      const newPreviews = files.map((file) => URL.createObjectURL(file));
      setPreviewUrls((prev) => [...prev, ...newPreviews]);
    },
    [uploadedImages.length]
  );

  // Remove Image and clean up URL
  const removeImage = useCallback(
    (index: number) => {
      URL.revokeObjectURL(previewUrls[index]); // Free up memory
      setUploadedImages((prev) => prev.filter((_, i) => i !== index));
      setPreviewUrls((prev) => prev.filter((_, i) => i !== index));
    },
    [previewUrls]
  );

  // Handle Task Submission
  const handleSubmitTask = async () => {
    if (!offer || !id) return;

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
      // Upload all images
      const uploadPromises = uploadedImages.map((image) =>
        uploadService.uploadImage(image)
      );
      const uploadResults = await Promise.all(uploadPromises);
      const imageUrls = uploadResults.map((result) => result.data.imageUrl);

      // Submit task with the first image URL (current API supports single image)
      await taskService.submitTask(id!, imageUrls[0] || "");

      notification({
        message: `Đã gửi nhiệm vụ thành công! Chờ xét duyệt để nhận ${formatReward(
          offer.rewardAmount,
          offer.rewardUnit
        )}. Xin cảm ơn!`,
        type: "success",
      });

      // Refresh user profile from API to get updated balance (if approved immediately)
      try {
        const updatedProfile = await profileService.getProfile();
        setUserProfile(updatedProfile);
        setUser(updatedProfile); // Update authStore with latest balance
      } catch (error) {
        console.error("Error refreshing profile:", error);
      }

      // Clean up all preview URLs
      previewUrls.forEach((url) => URL.revokeObjectURL(url));

      // Navigate back after success
      setTimeout(() => {
        navigate("/tasks");
      }, 1500);
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

  // --- Render Functions ---

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <Loader2
            size={48}
            className="animate-spin text-[#E91E63] mx-auto mb-4"
          />
          <p className="text-gray-600 font-medium">
            Đang tải thông tin nhiệm vụ...
          </p>
        </div>
      </div>
    );
  }

  if (!offer) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center bg-gray-50 p-10 rounded-xl shadow-lg border border-gray-100">
          <AlertTriangle size={36} className="text-red-500 mx-auto mb-4" />
          <p className="text-gray-600 font-medium mb-6 text-xl">
            Không tìm thấy nhiệm vụ bạn yêu cầu.
          </p>
          <button
            onClick={() => navigate("/tasks")}
            className="px-6 py-3 bg-gradient-to-r from-[#E91E63] to-[#FF8C1A] text-white font-bold rounded-xl shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-105"
          >
            Quay lại danh sách
          </button>
        </div>
      </div>
    );
  }

  const rewardIcon =
    offer.rewardUnit === "VND" ? (
      <CreditCard />
    ) : offer.rewardUnit === "Cashback %" ? (
      <Package />
    ) : (
      <Trophy />
    );

  return (
    <div className="min-h-screen pb-16">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header and Back Button */}
        <div className="mb-6 flex justify-between items-center">
          <button
            onClick={() => navigate("/tasks")}
            className="group inline-flex items-center gap-2 px-4 py-2 bg-white hover:bg-pink-50 text-gray-700 hover:text-[#E91E63] font-medium transition-all duration-200 rounded-full shadow-lg border border-gray-200"
          >
            <ArrowLeft
              size={18}
              className="group-hover:-translate-x-1 transition-transform"
            />
            <span className="hidden sm:inline">Danh sách nhiệm vụ</span>
          </button>

          {/* User Profile Info */}
          {userProfile && (
            <div className="flex items-center gap-4 bg-white px-4 py-2 rounded-full shadow-lg border border-pink-200">
              <div className="flex items-center gap-2">
                <div className="flex items-center justify-center w-8 h-8 bg-gradient-to-br from-[#E91E63] to-[#FF8C1A] rounded-full">
                  <User size={16} className="text-white" />
                </div>
                <span className="text-sm font-semibold text-gray-700 hidden sm:inline">
                  {userProfile.name || userProfile.email}
                </span>
              </div>
              <div className="flex items-center gap-2 pl-4 border-l border-gray-200">
                <Wallet size={16} className="text-[#E91E63]" />
                <span className="text-sm font-bold text-gray-900">
                  {new Intl.NumberFormat("vi-VN", {
                    style: "currency",
                    currency: "VND",
                    minimumFractionDigits: 0,
                  })
                    .format(userProfile.balance || 0)
                    .replace("₫", " VNĐ")}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Main Offer Card */}
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-pink-100">
          {/* Section 1: Title and Reward */}
          <div className="relative p-6 sm:p-10 bg-gradient-to-br from-pink-50 to-orange-50/70 border-b border-pink-200">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 leading-snug mb-4">
              {offer.title}
            </h1>

            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <RewardPill
                icon={rewardIcon}
                amount={offer.rewardAmount}
                unit={offer.rewardUnit}
              />

              {/* Additional Info Tags */}
              <div className="flex flex-wrap items-center gap-2 mt-2 sm:mt-0">
                <span className="inline-flex items-center gap-1 px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm font-semibold">
                  <Clock size={14} className="text-gray-500" />
                  {offer.timeEstimate}
                </span>
                <span className="inline-flex items-center gap-1 px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-sm font-bold">
                  <CheckCircle size={14} />
                  {offer.completionRate.toFixed(0)}% Hoàn thành
                </span>
              </div>
            </div>

            <p className="mt-6 text-base text-gray-700 italic border-l-4 border-pink-400 pl-4 py-1">
              "{offer.description}"
            </p>
          </div>

          {/* Section 2: Instructions */}
          <div className="p-6 sm:p-10">
            <div className="mb-8 pb-6 border-b-2 border-pink-200">
              <div className="flex items-center gap-3 mb-2">
                <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-[#E91E63] to-[#FF8C1A] rounded-xl shadow-lg">
                  <Target size={24} className="text-white" />
                </div>
                <h2 className="text-2xl sm:text-3xl font-black text-gray-900">
                  Các Bước Thực Hiện
                </h2>
              </div>
              <p className="text-gray-600 mt-2 ml-15 font-medium">
                Làm theo chính xác trình tự dưới đây để được xét duyệt ✓
              </p>
            </div>

            <div className="space-y-5 pb-5">
              {offer.requirements.map((step, index) => (
                <InstructionStep
                  key={index}
                  step={step}
                  index={index}
                  isLast={index === offer.requirements.length - 1}
                />
              ))}
            </div>

            {/* Warning Block */}
            <div className="mt-10 p-5 bg-yellow-50 border border-yellow-300 rounded-xl shadow-inner">
              <div className="flex items-start gap-4">
                <AlertTriangle
                  size={24}
                  className="text-red-500 shrink-0 mt-1"
                />
                <div className="min-w-0">
                  <h4 className="font-bold text-lg text-red-700 mb-1">
                    LƯU Ý BẮT BUỘC
                  </h4>
                  <p className="text-sm text-red-600 leading-relaxed font-medium">
                    Ảnh bằng chứng phải rõ ràng, hiển thị đầy đủ thông tin giao
                    dịch/đăng ký. Thiếu bằng chứng hoặc làm sai bước sẽ bị **từ
                    chối** xét duyệt.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Section 3: Call to Action - Start Task */}
          <div className="p-6 sm:p-8 bg-gradient-to-r from-pink-50 to-orange-50/30 border-t-2 border-pink-200">
            <div className="flex items-center justify-center">
              <a
                href={offer.link}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-[#E91E63] via-pink-500 to-[#FF8C1A] text-white font-bold rounded-xl transition-all duration-300 hover:shadow-xl text-base transform hover:scale-105 active:scale-95 gap-2 shadow-lg hover:gap-3"
              >
                <Zap size={18} className="shrink-0" />
                <span>Bắt đầu thực hiện nhiệm vụ</span>
                <svg
                  className="w-4 h-4 shrink-0"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                  />
                </svg>
              </a>
            </div>
            <p className="text-center text-sm text-gray-600 mt-3 font-medium">
              Nhấn vào nút trên để mở link và bắt đầu nhiệm vụ
            </p>
          </div>
        </div>

        {/* Submission Card (Always Visible) */}
        <div className="mt-8 p-6 sm:p-8 bg-white rounded-3xl shadow-2xl border-4 border-pink-200/50">
          <div className="flex items-center gap-4 mb-6">
            <div className="flex items-center justify-center w-14 h-14 bg-gradient-to-br from-indigo-500 to-blue-500 rounded-2xl shadow-xl shrink-0">
              <UploadCloud size={24} className="text-white" />
            </div>
            <div>
              <h3 className="text-xl sm:text-2xl font-black text-gray-900">
                Gửi bằng chứng & Nhận thưởng
              </h3>
              <p className="text-sm text-gray-500 font-medium">
                Tải lên ảnh chụp màn hình giao dịch/đăng ký hoàn tất
              </p>
            </div>
          </div>

          <div className="space-y-4">
            {/* Upload Area */}
            <div
              className={`border-2 border-dashed ${
                uploadedImages.length >= 5
                  ? "border-gray-400 bg-gray-50"
                  : "border-pink-400 hover:border-[#E91E63] hover:bg-pink-50/50"
              } rounded-xl p-8 text-center transition-all duration-200`}
            >
              <label className="cursor-pointer">
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                  disabled={uploadedImages.length >= 5}
                />
                <div className="space-y-3">
                  <div
                    className={`flex items-center justify-center w-16 h-16 rounded-full mx-auto shadow-md ${
                      uploadedImages.length >= 5
                        ? "bg-gray-200"
                        : "bg-gradient-to-br from-pink-100 to-orange-100"
                    }`}
                  >
                    <UploadCloud
                      size={32}
                      className={`${
                        uploadedImages.length >= 5
                          ? "text-gray-500"
                          : "text-[#E91E63]"
                      }`}
                    />
                  </div>
                  <div>
                    <p className="text-lg font-semibold text-gray-900">
                      {uploadedImages.length >= 5
                        ? "Đã đạt giới hạn 5 ảnh"
                        : "Thả ảnh vào đây hoặc nhấn để chọn"}
                    </p>
                    <p className="text-sm text-gray-500 mt-1">
                      PNG, JPG, JPEG (Tối đa 5 ảnh) - Đã chọn:{" "}
                      {uploadedImages.length}
                    </p>
                  </div>
                </div>
              </label>
            </div>

            {/* Image Preview */}
            {previewUrls.length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-2">
                {previewUrls.map((url, index) => (
                  <div
                    key={index}
                    className="relative group shadow-md hover:shadow-lg transition-all duration-200"
                  >
                    <img
                      src={url}
                      alt={`Preview ${index + 1}`}
                      className="w-full h-24 sm:h-32 object-cover rounded-lg border-2 border-pink-300"
                    />
                    <button
                      onClick={() => removeImage(index)}
                      className="absolute -top-3 -right-3 w-7 h-7 bg-red-600 text-white rounded-full opacity-80 group-hover:opacity-100 transition-opacity shadow-lg flex items-center justify-center hover:bg-red-700 ring-2 ring-white"
                    >
                      <X size={14} />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Submit Button */}
            <button
              onClick={handleSubmitTask}
              disabled={uploadedImages.length === 0 || submitting}
              className="w-full py-4 px-8 bg-gradient-to-r from-[#E91E63] via-pink-500 to-[#FF8C1A] text-white font-black rounded-2xl hover:shadow-2xl disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed transition-all duration-300 shadow-xl flex items-center justify-center gap-3 text-lg mt-6 transform hover:scale-[1.01] active:scale-[0.99] ring-2 ring-pink-200"
            >
              {submitting ? (
                <>
                  <Loader2 size={24} className="animate-spin" />
                  <span>Đang tải lên và gửi...</span>
                </>
              ) : (
                <>
                  <Package size={24} />
                  <span>GỬI YÊU CẦU XÉT DUYỆT NGAY</span>
                </>
              )}
            </button>

            <p className="text-center text-sm text-gray-600 font-medium pt-2 flex items-center justify-center gap-1">
              <Clock size={16} className="text-blue-500" />
              Thời gian xét duyệt dự kiến: 24 - 48 giờ.
            </p>
          </div>
        </div>
      </div>
      {/* Notification Container for Toasts */}
      <div
        id="notification-container"
        className="fixed bottom-4 right-4 z-50 w-full max-w-xs"
      ></div>
    </div>
  );
};

export default OfferDetail;
