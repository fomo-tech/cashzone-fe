import React, { useState, useCallback, useMemo, useEffect } from "react";
import {
  Link,
  Copy,
  CornerDownRight,
  Search,
  Zap,
  Loader,
  Shield,
  TrendingUp,
  RefreshCcw,
  Clipboard,
  QrCode,
  ExternalLink,
  X,
  CheckCircle2,
  ShoppingCart,
  DollarSign,
  Gift,
  ArrowRight,
} from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import cashbackService from "@/services/cashbackService";
import type { ShopeeProductInfo } from "@/services/cashbackService";
import { useAuthStore } from "@/store/authStore";
import { Input } from "@/components/ui/input";
import PlatformTypeBadge from "@/components/cashback/PlatformTypeBadge";
import { notification } from "@/utils/notification";
import CommonModal from "@/components/common/Modal";
import PriorityProducts from "@/components/cashback/PriorityProducts";
import { formatCurrency } from "@/utils/lib";
import CashbackHeroSection from "@/components/cashback/CashbackHeroSection";

export interface Platform {
  id: string;
  name: string;
  color: string; // Tailwind custom color class (e.g., bg-[#FF6A00])
  logo: string | React.ReactNode; // URL, Emoji, or React component
  type: "product" | "trade" | "service" | "finance"; // E-commerce, Crypto/Forex, Travel, Loan
}

interface ProductOffer {
  id: string;
  title: string;
  shop: string;
  feeText: string; // Hoa hồng/Phí hoàn lại đã format
  rateText: string; // Tỷ lệ hoàn tiền/lãi suất
  priceText: string; // Giá đã format
  img: string; // URL
  platform: string; // platform id
}

interface HistoryItem {
  id: string; // unique token
  platform: string;
  title: string;
  createdAt: string;
  link: string;
  type: "product" | "trade" | "service" | "finance";
  imageUrl?: string; // Product image
  productPrice?: number; // Product price
  commissionRate?: number; // Commission rate from Shopee API (0.15 = 15%)
  estimatedCommission?: number; // Commission amount from Shopee API
  cashbackRate?: number; // User cashback rate (80%)
  estimatedCashback?: number; // User cashback amount
}

// =========================================================================
// 3. DATA (Kept the original mock data)
// =========================================================================
const PLATFORMS: Platform[] = [
  {
    id: "shopee",
    name: "Shopee",
    color: "bg-[#EE4D2D]",
    logo: "https://img.icons8.com/?size=100&id=mBkyWceUPlkM&format=png&color=000000",
    type: "product",
  },
];

const SAMPLE_PRODUCTS: ProductOffer[] = [];

// Icon and badge based on Platform Type (Moved outside App for better structure)

export default function Cashback() {
  // Auth store
  const { isAuthenticated, handleToggleAuthModal, user } = useAuthStore();

  const [activePlatformId, setActivePlatformId] = useState<string>(
    PLATFORMS[0].id
  );
  const [inputLink, setInputLink] = useState<string>("");
  const [currentOffer, setCurrentOffer] = useState<ProductOffer | null>(null);
  const [generatedLink, setGeneratedLink] = useState<string>("");
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const [query, setQuery] = useState<string>("");
  const [isCopying, setIsCopying] = useState<boolean>(false);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [qrModal, setQrModal] = useState<{
    show: boolean;
    link: string;
    title: string;
  } | null>(null);

  // Load link history from API
  const loadLinkHistory = useCallback(async () => {
    if (isAuthenticated && user?._id) {
      setLoadingHistory(true);
      try {
        const response = await cashbackService.getUserLinks({
          page: 1,
          limit: 10,
        });

        // Transform API data to HistoryItem format
        const transformedHistory: HistoryItem[] = response.links.map(
          (link: any) => {
            return {
              id: link._id,
              platform:
                link.platform?.name?.toLowerCase() || link.platform || "shopee",
              title:
                link.productName ||
                link.productInfo?.name ||
                link.originalUrl ||
                "Link không có tên",
              createdAt: link.createdAt,
              link:
                link.shortUrl ||
                link.trackingUrl ||
                link.shortLink ||
                link.originalUrl,
              type: link.platform?.type || "product",
              imageUrl:
                link.productImage ||
                link.productInfo?.imageUrl ||
                link.productInfo?.thumbnail ||
                link.productInfo?.image ||
                link.imageUrl,
              productPrice: link.productPrice,
              // Use platform commissionValue if available, otherwise use commissionRate from Shopee
              commissionRate: link.platform?.commissionValue
                ? link.platform.commissionValue / 100
                : link.commissionRate,
              estimatedCommission: link.commission,
              cashbackRate: link.cashbackRate,
              estimatedCashback: link.estimatedCashback,
            };
          }
        );

        setHistory(transformedHistory);
      } catch (error) {
        console.error("Failed to load link history:", error);
      } finally {
        setLoadingHistory(false);
      }
    }
  }, [isAuthenticated, user?._id]);
  useEffect(() => {
    loadLinkHistory();
  }, [isAuthenticated, user, loadLinkHistory]);

  const activePlatform = useMemo(
    () => PLATFORMS.find((p) => p.id === activePlatformId) || PLATFORMS[0],
    [activePlatformId]
  );

  // Define if a link is strictly required for this platform
  const isLinkRequired = useMemo(
    () =>
      activePlatform.type === "product" || activePlatform.type === "service",
    [activePlatform.type]
  );

  // Hàm chứa logic tạo link cốt lõi (ASYNC để gọi API)
  const generateLogic = useCallback(
    async (platform: Platform, input: string) => {
      setIsGenerating(true);
      setCurrentOffer(null); // Clear previous offer
      setGeneratedLink(""); // Clear previous link

      let finalOffer: ProductOffer | undefined;
      let finalLink: string | undefined;

      // --- BƯỚC 1: XÁC ĐỊNH LOẠI OFFER VÀ KIỂM TRA INPUT ---
      if (platform.type === "product" || platform.type === "service") {
        // Case PRODUCT/SERVICE: Yêu cầu dán link sản phẩm (BẮT BUỘC)
        if (!input || input.trim().length < 5) {
          notification({
            type: "error",
            message: "Vui lòng dán link sản phẩm hợp lệ để tạo link cashback",
          });
          setIsGenerating(false);
          return;
        }

        // --- GỌI API ĐẾN BACKEND SERVER ---
        try {
          // Sử dụng cashbackService để gọi API convert Shopee link
          const userId = user?._id; // Get userId from auth store
          const response = await cashbackService.convertShopeeLink(
            input.trim(),
            userId
          );
          const productInfo: ShopeeProductInfo = response;

          if (productInfo && productInfo.affiliateUrl) {
            // Thành công: Lấy dữ liệu từ API
            // Use short link if available, otherwise use affiliate URL
            finalLink =
              productInfo.shortLink?.shortUrl || productInfo.affiliateUrl;

            // Show message if existing link was returned
            if ((productInfo as any).existingLink) {
              notification({
                type: "info",
                message: "Link này đã tồn tại trong hệ thống của bạn.",
              });
            }

            finalOffer = {
              id: (productInfo as any).linkId || "api-gen-" + Date.now(),
              title: productInfo.productName || "Sản phẩm Shopee",
              shop: platform.name, // Use platform name for shop
              feeText: formatCurrency(productInfo.estimatedCashback || 0),
              // Tỷ lệ hoàn tiền từ backend
              rateText: `${productInfo.commissionRate}%`,
              priceText: formatCurrency(Number(productInfo.priceMin) || 0),
              img:
                productInfo.imageUrl ||
                `https://via.placeholder.com/96/EE4D2D/FFFFFF?text=${platform.id
                  .toUpperCase()
                  .charAt(0)}`,
              platform: platform.id,
            };
          } else {
            // Lỗi: Không thể convert link
            notification({
              type: "error",
              message:
                "Không thể tạo link hoàn tiền từ link đã cung cấp. Vui lòng kiểm tra lại.",
            });
            setIsGenerating(false);
            return;
          }
        } catch (error: any) {
          console.error("API Error:", error);
          let errorMessage =
            "Không thể kết nối API. Vui lòng kiểm tra lại đường truyền.";

          // Check for maintenance mode
          if (
            error.response?.data?.message === "MAINTENANCE_MODE" ||
            error.response?.data?.message?.includes("MAINTENANCE")
          ) {
            errorMessage =
              "🔧 Hệ thống đang bảo trì. Vui lòng thử lại sau ít phút.";
          } else if (error.response?.data?.message) {
            errorMessage = error.response.data.message;
          } else if (error.message) {
            errorMessage = error.message;
          }
          notification({
            type: "error",
            message: errorMessage,
          });
          setIsGenerating(false);
          return;
        }
      } else if (platform.type === "trade") {
        // Case TRADE/REBATE: Tự động tạo link đăng ký cá nhân hóa
        const token = Math.random().toString(36).slice(2, 9);
        finalLink = `https://cbhub.vn/${platform.id}/${token}`;

        finalOffer = {
          id: "trade-gen-" + Date.now(),
          title: `Link đăng ký ${platform.name} (Rebate ${
            input || "20% Tối đa"
          })`,
          shop: platform.name,
          feeText: "Backcom tự động",
          rateText: "20% (Tối đa)",
          priceText: "Phí giao dịch",
          img: `https://via.placeholder.com/96/F3B000/FFFFFF?text=Trade`,
          platform: platform.id,
        };
      }

      if (!finalOffer || !finalLink) {
        setIsGenerating(false);
        return;
      }

      // --- BƯỚC 2: CẬP NHẬT STATE SAU KHI TẠO ---
      // Dùng setTimeout ngắn để tạo hiệu ứng hoàn thành cho Trade/Finance
      const delay =
        platform.type === "product" || platform.type === "service" ? 0 : 400;

      setTimeout(() => {
        setCurrentOffer(finalOffer as ProductOffer);
        setGeneratedLink(finalLink as string);
        notification({
          type: "success",
          message: "Tạo link hoàn tiền thành công!",
        });

        // Reload history from API after creating new link
        if (isAuthenticated && user?._id) {
          loadLinkHistory();
        }

        setIsGenerating(false);
      }, delay);
    },
    [isAuthenticated, user, loadLinkHistory]
  );

  // Hàm xử lý khi nhấn nút TẠO LINK
  const handleGenerate = useCallback(() => {
    // Check authentication first
    if (!isAuthenticated) {
      handleToggleAuthModal({ mode: "signin" });
      return;
    }

    generateLogic(activePlatform, inputLink);
  }, [
    isAuthenticated,
    activePlatform,
    inputLink,
    generateLogic,
    handleToggleAuthModal,
  ]);

  // Hàm xử lý khi chọn Platform (TỰ ĐỘNG tạo link cho Trade/Finance)
  const handleSelectPlatform = useCallback(
    (id: string) => {
      const selectedPlatform =
        PLATFORMS.find((p) => p.id === id) || PLATFORMS[0];

      // 1. Cleanup old state
      setActivePlatformId(id);
      setCurrentOffer(null);
      setGeneratedLink("");
      setInputLink("");

      // 2. Tự động tạo link cho Trade/Finance (Không cần dán link sản phẩm)
      if (
        selectedPlatform.type === "trade" ||
        selectedPlatform.type === "finance"
      ) {
        // Kích hoạt trạng thái loading
        setIsGenerating(true);
        // Gọi logic tạo link với input rỗng (vì inputLink vừa được clear)
        generateLogic(selectedPlatform, "");
      }
    },
    [generateLogic]
  );

  const handleCopy = useCallback(async () => {
    if (!generatedLink)
      return notification({
        type: "error",
        message: "Chưa có link",
      });
    try {
      const tempInput = document.createElement("input");
      tempInput.value = generatedLink;
      document.body.appendChild(tempInput);
      tempInput.select();
      document.execCommand("copy");
      document.body.removeChild(tempInput);
      notification({
        type: "success",
        message: "Đã sao chép link vào clipboard!",
      });
    } catch {
      notification({
        type: "error",
        message: "Lỗi: Không thể sao chép link",
      });
    } finally {
      setTimeout(() => setIsCopying(false), 1000); // 1s visual feedback
    }
  }, [generatedLink]);

  const handleOpen = useCallback(() => {
    if (!generatedLink)
      return notification({
        type: "error",
        message: "Chưa có link",
      });
    window.open(generatedLink, "_blank");
  }, [generatedLink]);

  const filteredHistory = useMemo(() => {
    if (!query) return history;
    return history.filter((h) =>
      h.title.toLowerCase().includes(query.toLowerCase())
    );
  }, [history, query]);

  // Dynamic Input Label and Placeholder
  const inputLabel = useMemo(() => {
    const commonClass =
      "inline-flex items-center gap-2 text-gray-800 text-base sm:text-lg font-semibold";

    switch (activePlatform.type) {
      case "trade":
        return (
          <span className={commonClass}>
            <TrendingUp size={18} className="text-orange-500" />
            Yêu cầu Rebate/Mã giới thiệu{" "}
            <span className="text-gray-400">(Tùy chọn)</span>
          </span>
        );
      case "finance":
        return (
          <span className={commonClass}>
            <Shield size={18} className="text-orange-500" />
            Nhu cầu tư vấn/vay vốn{" "}
            <span className="text-gray-400">(Tùy chọn)</span>
          </span>
        );
      default:
        return (
          <span className={commonClass}>
            <Link size={18} />
            Dán link sản phẩm <span className="text-red-500">(BẮT BUỘC)</span>
          </span>
        );
    }
  }, [activePlatform.type]);

  const inputPlaceholder = useMemo(() => {
    switch (activePlatform.type) {
      case "trade":
        return "Tùy chọn: Nhập mã giới thiệu hoặc yêu cầu đặc biệt (Ex: 20% Rebate)";
      case "finance":
        return "Tùy chọn: Nhập nhu cầu vay (Ex: Vay 50 triệu trong 12 tháng)";
      default:
        return `Dán link sản phẩm từ ${activePlatform.name}...`;
    }
  }, [activePlatform.type, activePlatform.name]);

  // Disable button if link is required AND no input provided
  const isButtonDisabled = useMemo(() => {
    // isLinkRequired is only true for product/service.
    return isGenerating || (isLinkRequired && inputLink.trim().length < 5);
  }, [isGenerating, isLinkRequired, inputLink]);

  // Helper text
  const helperText = useMemo(() => {
    if (isLinkRequired) {
      return "Mẹo: Paste link Shopee hoặc Lazada để mua sắm nhận hoàn tiền. Xem hướng dẫn chi tiết tại đây.";
    }
    return "Link đã được tạo tự động. Bạn có thể nhập thêm yêu cầu đặc biệt và bấm 'Cập nhật' để thay đổi nội dung tư vấn.";
  }, [isLinkRequired]);

  return (
    <>
      <div className="min-h-screen py-2  font-sans">
        <div className="w-full max-w-6xl mx-auto px-0 sm:px-2 md:px-4">
          {/* QR Code Modal */}
          <CommonModal
            isOpen={!!qrModal}
            onClose={() => setQrModal(null)}
            title="Quét mã QR để mở link"
          >
            <div className="flex flex-col items-center justify-center gap-4 p-4 md:p-6">
              <div className="bg-gradient-to-br from-white via-gray-50 to-white p-6 rounded-2xl border border-gray-200  flex items-center justify-center">
                {qrModal?.link && (
                  <QRCodeSVG
                    value={qrModal.link}
                    size={256}
                    level="H"
                    includeMargin={true}
                    className="w-64 h-64 md:w-72 md:h-72"
                  />
                )}
              </div>
              <div className="text-center space-y-2">
                <p className="text-sm md:text-base font-semibold text-gray-800">
                  {qrModal?.title}
                </p>
                <p className="text-xs md:text-sm text-gray-500">
                  Quét mã QR để mở link trên điện thoại
                </p>
              </div>
            </div>
          </CommonModal>

          <CashbackHeroSection />

          {/* Input and Output Section */}
          <div className="mt-4 sm:mt-6 lg:mt-8 grid grid-cols-1 lg:grid-cols-3 gap-0 sm:gap-4 lg:gap-6">
            {/* Input Card */}
            <div className="lg:col-span-3 bg-gradient-to-br from-orange-50 via-white to-red-50 rounded-none sm:rounded-2xl p-4 sm:p-8 lg:p-10 border-0 sm:border-2 sm:border-orange-200 relative overflow-hidden">
              {/* Decorative elements */}
              <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-br from-orange-200 to-transparent rounded-full blur-2xl opacity-20 -mr-24 -mt-24"></div>
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-red-200 to-transparent rounded-full blur-2xl opacity-20 -ml-24 -mb-24"></div>

              <div className="relative z-10">
                {isLinkRequired ? (
                  // Case 1: Cashback Product/Service (Link Required)
                  <>
                    {/* Header */}
                    <div className="mb-6 sm:mb-8 text-center">
                      <div className="inline-flex items-center justify-center w-20 h-20 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-br from-orange-500 to-red-600 mb-4">
                        <Zap className="text-white" size={40} />
                      </div>
                      <h3 className="text-2xl sm:text-2xl lg:text-3xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent mb-3">
                        Tạo Link Hoàn Tiền
                      </h3>
                      <p className="text-base sm:text-base lg:text-lg text-gray-700 font-medium px-4">
                        Dán link sản phẩm Shopee để nhận hoàn tiền ngay
                      </p>
                    </div>

                    {/* Input Section */}
                    <div className="space-y-5 max-w-4xl mx-auto">
                      <div className="bg-white rounded-xl sm:rounded-2xl p-3 sm:p-6 border sm:border-2 border-orange-200">
                        <label className="text-lg sm:text-lg font-bold text-gray-800 flex flex-col sm:flex-row items-start sm:items-center gap-2 mb-4">
                          <div className="flex items-center gap-2">
                            <Link size={24} className="text-orange-500" />
                            <span>Link sản phẩm Shopee</span>
                          </div>
                          <span className="text-red-500 text-base animate-pulse ml-0 sm:ml-0">
                            (BẮT BUỘC)
                          </span>
                        </label>

                        <div className="flex flex-col sm:flex-row gap-3">
                          {/* Input field */}
                          <div className="relative flex-1">
                            <Input
                              type="text"
                              value={inputLink}
                              onChange={(e) => setInputLink(e.target.value)}
                              placeholder={inputPlaceholder}
                              className="w-full px-5 py-4 text-base rounded-xl border-2 border-gray-300 focus:border-orange-500 focus:ring-4 focus:ring-orange-200 pr-32 sm:pr-24 font-medium transition-all"
                              disabled={isGenerating}
                            />
                            <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
                              {/* Paste button - inside input on mobile */}
                              <button
                                onClick={async () => {
                                  try {
                                    const text =
                                      await navigator.clipboard.readText();
                                    setInputLink(text);
                                    notification({
                                      type: "success",
                                      message: "Đã dán link!",
                                    });
                                  } catch (err) {
                                    console.error(
                                      "Failed to read clipboard:",
                                      err
                                    );
                                  }
                                }}
                                className="sm:hidden p-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg transition-all active:scale-95"
                                title="Dán từ clipboard"
                              >
                                <Clipboard size={20} />
                              </button>

                              {/* Clear button */}
                              {inputLink && (
                                <button
                                  onClick={() => setInputLink("")}
                                  className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                                  title="Xóa"
                                >
                                  <X size={22} />
                                </button>
                              )}
                            </div>
                          </div>

                          {/* Buttons row - Desktop only */}
                          <div className="flex flex-col sm:flex-row gap-3">
                            {/* Desktop: Paste button */}
                            <button
                              onClick={async () => {
                                try {
                                  const text =
                                    await navigator.clipboard.readText();
                                  setInputLink(text);
                                  notification({
                                    type: "success",
                                    message: "Đã dán link!",
                                  });
                                } catch (err) {
                                  console.error(
                                    "Failed to read clipboard:",
                                    err
                                  );
                                }
                              }}
                              className="hidden sm:flex items-center gap-2 px-5 py-4 text-base bg-gray-100 text-gray-700 rounded-xl font-semibold border-2 border-gray-300 hover:bg-gray-200 hover:border-gray-400 transition-all"
                              title="Dán từ clipboard"
                            >
                              <Clipboard size={20} />
                              <span>Dán</span>
                            </button>

                            {/* Generate button */}
                            <button
                              onClick={handleGenerate}
                              disabled={isButtonDisabled}
                              className="flex items-center justify-center gap-2 px-8 h-14 sm:h-auto sm:py-4 text-base sm:text-base bg-gradient-to-r from-orange-500 to-red-600 text-white rounded-xl font-bold hover:from-orange-600 hover:to-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all transform active:scale-95 sm:hover:scale-105 disabled:hover:scale-100"
                            >
                              {isGenerating ? (
                                <>
                                  <Loader size={20} className="animate-spin" />
                                  <span>Đang tạo...</span>
                                </>
                              ) : (
                                <>
                                  <Zap size={20} />
                                  <span>Tạo Link</span>
                                </>
                              )}
                            </button>
                          </div>
                        </div>

                        {/* Helper text */}
                        {helperText && (
                          <div className="mt-4 flex items-start gap-2.5 p-4 bg-orange-50 rounded-xl border border-orange-200">
                            <Shield
                              size={20}
                              className="text-orange-500 flex-shrink-0 mt-0.5"
                            />
                            <p className="text-sm sm:text-sm text-orange-800 font-medium leading-relaxed">
                              {helperText}
                            </p>
                          </div>
                        )}
                      </div>
                      {/* Feature Cards */}
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div className="flex items-center gap-3 p-4 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl border-2 border-green-200 transition-all">
                          <div className="flex items-center justify-center w-12 h-12 rounded-full bg-green-500 flex-shrink-0">
                            <CheckCircle2 className="text-white" size={24} />
                          </div>
                          <span className="text-sm sm:text-sm font-bold text-gray-800">
                            Tự động tính hoa hồng
                          </span>
                        </div>
                        <div className="flex items-center gap-3 p-4 bg-gradient-to-br from-orange-50 to-red-50 rounded-xl border-2 border-orange-200 transition-all">
                          <div className="flex items-center justify-center w-12 h-12 rounded-full bg-orange-500 flex-shrink-0">
                            <Zap className="text-white" size={24} />
                          </div>
                          <span className="text-sm sm:text-sm font-bold text-gray-800">
                            Hoàn tiền nhanh chóng
                          </span>
                        </div>
                        <div className="flex items-center gap-3 p-4 bg-gradient-to-br from-orange-50 to-red-50 rounded-xl border-2 border-orange-200 transition-all">
                          <div className="flex items-center justify-center w-12 h-12 rounded-full bg-orange-500 flex-shrink-0">
                            <Gift className="text-white" size={24} />
                          </div>
                          <span className="text-sm sm:text-sm font-bold text-gray-800">
                            Miễn phí sử dụng
                          </span>
                        </div>
                      </div>
                    </div>
                  </>
                ) : (
                  // Case 2: Trade/Finance (Link Auto-Generated, Input is Optional Update)
                  <div className="space-y-4">
                    <div className="mb-6">
                      <h3 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2">
                        Link Đăng Ký / Tư Vấn
                      </h3>
                      <p className="text-sm sm:text-base text-gray-600">
                        Link đã được tạo tự động
                      </p>
                    </div>

                    <div className="space-y-4">
                      <label className="text-base font-semibold text-gray-700">
                        {inputLabel}
                      </label>
                      <div className="flex gap-3">
                        <div className="relative flex-1">
                          <input
                            type="text"
                            value={inputLink}
                            onChange={(e) => setInputLink(e.target.value)}
                            placeholder={inputPlaceholder}
                            className="w-full px-4 py-3 text-base rounded-lg border border-gray-300 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 pr-10"
                            disabled={isGenerating}
                          />
                          {/* Clear button */}
                          {inputLink && (
                            <button
                              onClick={() => setInputLink("")}
                              className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 text-gray-400 hover:text-gray-600 rounded"
                              title="Xóa"
                            >
                              <X size={18} />
                            </button>
                          )}
                        </div>
                        <button
                          onClick={handleGenerate}
                          className="px-4 py-3 text-base bg-orange-500 text-white rounded-lg font-bold hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                          disabled={isGenerating}
                        >
                          {isGenerating ? (
                            <>
                              <Loader size={18} className="animate-spin" />
                              <span>Đang tạo...</span>
                            </>
                          ) : (
                            <>
                              <RefreshCcw size={18} />
                              <span>Cập nhật</span>
                            </>
                          )}
                        </button>
                      </div>
                      {helperText && (
                        <p className="text-sm text-gray-600 mt-2">
                          💡 {helperText}
                        </p>
                      )}
                    </div>
                  </div>
                )}

                {/* Offer preview */}
                {currentOffer && (
                  <div className="mt-4 sm:mt-6 bg-white rounded-lg sm:rounded-xl p-4 sm:p-6  ">
                    {/* Product Card - Similar to Shopee style */}
                    <div className="flex flex-col sm:flex-row gap-4">
                      {/* Product Image */}
                      <div className="shrink-0">
                        <img
                          src={currentOffer.img}
                          alt={currentOffer.title}
                          className="w-full sm:w-32 md:w-40 h-32 md:h-40 object-cover rounded-lg border border-gray-200"
                          onError={(e) => {
                            const target = e.currentTarget as HTMLImageElement;
                            target.src = `https://via.placeholder.com/160x160/EE4D2D/FFFFFF?text=SP`;
                          }}
                        />
                      </div>

                      {/* Product Info */}
                      <div className="flex-1 space-y-3">
                        {/* Shopee Logo */}
                        <div className="flex items-center gap-2">
                          <div className="bg-[#EE4D2D] px-2 py-1 rounded text-white text-xs font-bold">
                            <img
                              src="https://img.icons8.com/?size=100&id=arKs3bvtn3Xr&format=png&color=ffffff"
                              alt="Shopee Logo"
                              className="w-4 h-4 inline-block mr-1"
                            />
                            SHOPEE
                          </div>
                        </div>

                        {/* Product Title */}
                        <h2 className="text-sm sm:text-base md:text-lg font-medium text-gray-800 leading-tight">
                          {currentOffer.title}
                        </h2>

                        {/* Commission Info */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          {/* Partner Commission */}
                          <div className="bg-orange-50 p-3 rounded-lg border border-orange-200">
                            <div className="text-orange-600 text-xs font-medium mb-1">
                              HOA HỒNG ĐỐI TÁC
                            </div>
                            <div className="text-orange-600 text-lg sm:text-xl font-bold">
                              {currentOffer.feeText}
                            </div>
                          </div>

                          {/* Your Cashback */}
                          <div className="bg-green-50 p-3 rounded-lg border border-green-200">
                            <div className="text-green-600 text-xs font-medium mb-1">
                              HOÀN TIỀN CỦA BẠN
                            </div>
                            <div className="text-green-600 text-lg sm:text-xl font-bold">
                              từ{" "}
                              {Math.floor(
                                parseFloat(
                                  currentOffer.feeText.replace(/[^\d]/g, "")
                                ) * 0.6
                              ).toLocaleString("vi-VN")}{" "}
                              đ đến{" "}
                              {Math.floor(
                                parseFloat(
                                  currentOffer.feeText.replace(/[^\d]/g, "")
                                ) * 0.9
                              ).toLocaleString("vi-VN")}{" "}
                              đ
                            </div>
                          </div>
                        </div>

                        {/* Link hoàn tiền */}
                        <div className="space-y-2">
                          <div className="text-gray-600 text-sm font-medium">
                            Link hoàn tiền:
                          </div>
                          <div className="flex gap-2">
                            <input
                              type="text"
                              value={generatedLink}
                              readOnly
                              className="flex-1 px-3 py-2 bg-gray-50 border border-gray-300 rounded text-sm text-gray-600"
                            />
                            <button
                              onClick={handleCopy}
                              className="px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded transition"
                            >
                              <Copy size={16} />
                            </button>
                            <button
                              onClick={() => {
                                if (generatedLink && currentOffer) {
                                  setQrModal({
                                    show: true,
                                    link: generatedLink,
                                    title: currentOffer.title,
                                  });
                                }
                              }}
                              className="px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded transition"
                            >
                              <QrCode size={16} />
                            </button>
                          </div>
                        </div>

                        {/* Large Buy Button */}
                        <button
                          onClick={handleOpen}
                          className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-bold py-4 px-6 rounded-lg text-lg flex items-center justify-center gap-2 transition-all transform hover:scale-[1.02] "
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={1.5}
                            stroke="currentColor"
                            className="size-6"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007ZM8.625 10.5a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm7.5 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z"
                            />
                          </svg>
                          MỞ ĐỂ MUA HÀNG NGAY
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Disclaimer for trade/finance */}
                {(activePlatform.type === "trade" ||
                  activePlatform.type === "finance") && (
                  <div className="mt-3 md:mt-4 p-2.5 md:p-3 bg-yellow-50 rounded-lg text-yellow-800 text-sm sm:text-base font-semibold border border-yellow-200">
                    <Shield size={16} className="inline mr-1.5 md:mr-2" />
                    Link này là link đăng ký/tư vấn cá nhân hóa. Vui lòng không
                    dán link sản phẩm.
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* HOW IT WORKS - QUY TRÌNH HOÀN TIỀN */}
          <div className="mt-6 sm:mt-8 lg:mt-10">
            {/* Header */}
            <div className="text-center mb-6 sm:mb-8">
              <div className="inline-flex items-center justify-center gap-2 mb-3">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center">
                  <Gift className="text-white" size={20} />
                </div>
              </div>
              <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-2">
                Quy Trình Hoàn Tiền
              </h2>
              <p className="text-xs sm:text-sm lg:text-base text-gray-600 max-w-xl mx-auto">
                Nhận hoàn tiền chỉ với 4 bước đơn giản
              </p>
            </div>

            {/* Steps Container */}
            <div className="max-w-6xl mx-auto">
              {/* Desktop - Horizontal Layout */}
              <div className="hidden lg:block mb-8">
                <div className="relative">
                  {/* Connector Line Background */}
                  <div className="absolute top-12 left-0 right-0 h-0.5 bg-gradient-to-r from-orange-400 via-blue-400 via-green-400 to-yellow-400 opacity-20"></div>

                  {/* Steps Grid */}
                  <div className="grid grid-cols-4 gap-6">
                    {/* Step 1 */}
                    <div className="relative">
                      <div className="flex flex-col items-center">
                        {/* Icon Circle */}
                        <div className="relative z-10 w-24 h-24 rounded-full bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center mb-4 ring-6 ring-orange-100">
                          <Link
                            className="text-white"
                            size={36}
                            strokeWidth={2.5}
                          />
                        </div>

                        {/* Content Card */}
                        <div className="bg-white rounded-xl p-4 border border-orange-100 w-full">
                          <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-br from-orange-500 to-red-600 text-white font-bold text-base mb-2 mx-auto">
                            1
                          </div>
                          <h3 className="text-base font-bold text-gray-900 mb-1.5 text-center">
                            Tạo Link
                          </h3>
                          <p className="text-xs text-gray-600 leading-snug text-center">
                            Dán link sản phẩm từ Shopee vào hệ thống để tạo link
                            hoàn tiền
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Step 2 */}
                    <div className="relative">
                      <div className="flex flex-col items-center">
                        <div className="relative z-10 w-24 h-24 rounded-full bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center mb-4 ring-6 ring-blue-100">
                          <ShoppingCart
                            className="text-white"
                            size={36}
                            strokeWidth={2.5}
                          />
                        </div>

                        <div className="bg-white rounded-xl p-4 border border-orange-100 w-full">
                          <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-br from-orange-500 to-red-600 text-white font-bold text-base mb-2 mx-auto">
                            2
                          </div>
                          <h3 className="text-base font-bold text-gray-900 mb-1.5 text-center">
                            Mua Hàng
                          </h3>
                          <p className="text-xs text-gray-600 leading-snug text-center">
                            Click vào link để mua sản phẩm trên Shopee như bình
                            thường
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Step 3 */}
                    <div className="relative">
                      <div className="flex flex-col items-center">
                        <div className="relative z-10 w-24 h-24 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center mb-4 ring-6 ring-green-100">
                          <CheckCircle2
                            className="text-white"
                            size={36}
                            strokeWidth={2.5}
                          />
                        </div>

                        <div className="bg-white rounded-xl p-4 border border-green-100 w-full">
                          <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-br from-green-500 to-emerald-600 text-white font-bold text-base mb-2 mx-auto">
                            3
                          </div>
                          <h3 className="text-base font-bold text-gray-900 mb-1.5 text-center">
                            Xác Nhận
                          </h3>
                          <p className="text-xs text-gray-600 leading-snug text-center">
                            Đơn hàng được xác nhận và hệ thống ghi nhận hoa hồng
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Step 4 */}
                    <div className="relative">
                      <div className="flex flex-col items-center">
                        <div className="relative z-10 w-24 h-24 rounded-full bg-gradient-to-br from-yellow-500 to-amber-600 flex items-center justify-center mb-4 ring-6 ring-yellow-100">
                          <DollarSign
                            className="text-white"
                            size={36}
                            strokeWidth={2.5}
                          />
                        </div>

                        <div className="bg-white rounded-xl p-4 border border-yellow-100 w-full">
                          <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-br from-yellow-500 to-amber-600 text-white font-bold text-base mb-2 mx-auto">
                            4
                          </div>
                          <h3 className="text-base font-bold text-gray-900 mb-1.5 text-center">
                            Nhận Tiền
                          </h3>
                          <p className="text-xs text-gray-600 leading-snug text-center">
                            Hoàn tiền vào ví, sẵn sàng rút về tài khoản ngân
                            hàng
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Mobile/Tablet - Vertical Layout */}
              <div className="lg:hidden space-y-3 sm:space-y-4 mb-6 sm:mb-8">
                {/* Step 1 */}
                <div className="bg-white rounded-2xl p-5 sm:p-6 shadow-lg border border-gray-100">
                  <div className="flex gap-4 sm:gap-5 items-start">
                    <div className="flex-shrink-0">
                      <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center">
                        <Link className="text-white" size={28} />
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-orange-100 text-orange-600 font-bold text-xs mb-2">
                        1
                      </div>
                      <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-1.5">
                        Tạo Link Hoàn Tiền
                      </h3>
                      <p className="text-xs sm:text-sm text-gray-600 leading-snug">
                        Dán link sản phẩm từ Shopee vào hệ thống để tạo link
                        hoàn tiền của bạn
                      </p>
                    </div>
                  </div>
                </div>

                {/* Arrow Connector */}
                <div className="flex justify-center">
                  <div className="w-1 h-8 bg-gradient-to-b from-orange-500 to-red-500 rounded-full"></div>
                </div>

                {/* Step 2 */}
                <div className="bg-white rounded-2xl p-5 sm:p-6 shadow-lg border border-gray-100">
                  <div className="flex gap-4 sm:gap-5 items-start">
                    <div className="flex-shrink-0">
                      <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center">
                        <ShoppingCart className="text-white" size={28} />
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-orange-100 text-orange-600 font-bold text-sm mb-3">
                        2
                      </div>
                      <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2">
                        Mua Hàng Qua Link
                      </h3>
                      <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                        Click vào link hoàn tiền để mua sản phẩm trên Shopee như
                        bình thường
                      </p>
                    </div>
                  </div>
                </div>

                {/* Arrow Connector */}
                <div className="flex justify-center">
                  <div className="w-1 h-8 bg-gradient-to-b from-orange-500 to-green-500 rounded-full"></div>
                </div>

                {/* Step 3 */}
                <div className="bg-white rounded-2xl p-5 sm:p-6 shadow-lg border border-gray-100">
                  <div className="flex gap-4 sm:gap-5 items-start">
                    <div className="flex-shrink-0">
                      <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center">
                        <CheckCircle2 className="text-white" size={28} />
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-green-100 text-green-600 font-bold text-sm mb-3">
                        3
                      </div>
                      <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2">
                        Xác Nhận Đơn Hàng
                      </h3>
                      <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                        Đơn hàng được xác nhận và hệ thống tự động ghi nhận hoa
                        hồng cho bạn
                      </p>
                    </div>
                  </div>
                </div>

                {/* Arrow Connector */}
                <div className="flex justify-center">
                  <div className="w-1 h-8 bg-gradient-to-b from-green-500 to-yellow-500 rounded-full"></div>
                </div>

                {/* Step 4 */}
                <div className="bg-white rounded-2xl p-5 sm:p-6 shadow-lg border border-gray-100">
                  <div className="flex gap-4 sm:gap-5 items-start">
                    <div className="flex-shrink-0">
                      <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-br from-yellow-500 to-amber-600 flex items-center justify-center">
                        <DollarSign className="text-white" size={28} />
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-yellow-100 text-yellow-600 font-bold text-sm mb-3">
                        4
                      </div>
                      <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2">
                        Nhận Hoàn Tiền
                      </h3>
                      <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                        Hoàn tiền được chuyển vào ví của bạn, sẵn sàng rút về
                        tài khoản ngân hàng
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Stats Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
                <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-xl p-4 sm:p-6 border border-orange-200 text-center">
                  <div className="text-3xl sm:text-4xl font-extrabold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent mb-2">
                    60-90%
                  </div>
                  <div className="text-xs sm:text-sm text-gray-700 font-semibold">
                    Tỷ lệ hoàn tiền từ hoa hồng
                  </div>
                </div>
                <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-xl p-4 sm:p-6 border border-orange-200 text-center">
                  <div className="text-3xl sm:text-4xl font-extrabold bg-gradient-to-r from-blue-600 to-red-600 bg-clip-text text-transparent mb-2">
                    24-48h
                  </div>
                  <div className="text-xs sm:text-sm text-gray-700 font-semibold">
                    Thời gian xử lý hoàn tiền
                  </div>
                </div>
                <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-4 sm:p-6 border border-green-200 text-center">
                  <div className="text-3xl sm:text-4xl font-extrabold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent mb-2">
                    0đ
                  </div>
                  <div className="text-xs sm:text-sm text-gray-700 font-semibold">
                    Phí sử dụng dịch vụ
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
