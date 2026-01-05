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
} from "lucide-react";
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
  useEffect(() => {
    const loadLinkHistory = async () => {
      if (isAuthenticated && user?._id) {
        setLoadingHistory(true);
        try {
          const response = await cashbackService.getUserLinks({
            page: 1,
            limit: 50,
          });

          // Transform API data to HistoryItem format
          const transformedHistory: HistoryItem[] = response.links.map(
            (link: any) => {
              return {
                id: link._id,
                platform:
                  link.platform?.name?.toLowerCase() ||
                  link.platform ||
                  "shopee",
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
    };

    loadLinkHistory();
  }, [isAuthenticated, user]);

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
      } else if (platform.type === "finance") {
        // Case FINANCE/LOAN: Tự động tạo link tư vấn
        const token = Math.random().toString(36).slice(2, 9);
        finalLink = `https://cbhub.vn/${platform.id}/${token}`;

        finalOffer = {
          id: "finance-gen-" + Date.now(),
          title: `Link tư vấn ${platform.name} - Yêu cầu: ${
            input || "Không có"
          }`,
          shop: platform.name,
          feeText: "Liên hệ",
          rateText: "Lãi suất ưu đãi",
          priceText: "Tối đa 500M",
          img: `https://via.placeholder.com/96/8B5CF6/FFFFFF?text=Loan`,
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
          cashbackService
            .getUserLinks({ page: 1, limit: 50 })
            .then((response) => {
              const transformedHistory: HistoryItem[] = response.links.map(
                (link: any) => {
                  return {
                    id: link._id,
                    platform:
                      link.platform?.logo?.toLowerCase() ||
                      link.platform ||
                      "shopee",
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
            })
            .catch((error) => {
              console.error("Failed to reload history:", error);
            });
        }

        setIsGenerating(false);
      }, delay);
    },
    [isAuthenticated, user]
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
            <TrendingUp size={18} className="text-pink-500" />
            Yêu cầu Rebate/Mã giới thiệu{" "}
            <span className="text-gray-400">(Tùy chọn)</span>
          </span>
        );
      case "finance":
        return (
          <span className={commonClass}>
            <Shield size={18} className="text-blue-500" />
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
      return "Hệ thống sẽ tự động dò tìm thông tin sản phẩm và tỷ lệ hoàn tiền tối đa.";
    }
    return "Link đã được tạo tự động. Bạn có thể nhập thêm yêu cầu đặc biệt và bấm 'Cập nhật' để thay đổi nội dung tư vấn.";
  }, [isLinkRequired]);

  return (
    <>
      <div className="min-h-screen py-2  font-sans">
        <div className="w-full max-w-6xl mx-auto px-2 md:px-4">
          {/* QR Code Modal */}
          <CommonModal
            isOpen={!!qrModal}
            onClose={() => setQrModal(null)}
            title="Quét mã QR để mở link"
          >
            <div className="flex flex-col items-center justify-center gap-4 p-4 md:p-6">
              <div className="bg-gradient-to-br from-white via-gray-50 to-white p-4 rounded-2xl border border-gray-200 shadow-lg flex items-center justify-center">
                <img
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(
                    qrModal?.link || ""
                  )}`}
                  alt="QR Code"
                  className="w-64 h-64 md:w-72 md:h-72 object-contain"
                />
              </div>
              <p className="text-sm text-gray-500 text-center">
                Quét mã QR để mở link
              </p>
            </div>
          </CommonModal>

          <CashbackHeroSection />

          {/* Platform Selection */}

          {/* <div className="mt-4 md:mt-6 lg:mt-8 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2 md:gap-3 lg:gap-4">
            {PLATFORMS.map((p) => {
              if (!p) return null;

              const isActive = activePlatformId === p.id;

              return (
                <button
                  key={p.id}
                  onClick={() =>
                    handleSelectPlatform && handleSelectPlatform(p.id)
                  }
                  className={`group flex flex-col items-center p-2 md:p-2.5 lg:p-3 rounded-lg md:rounded-xl border-2 transition-all duration-300 shadow-sm transform hover:scale-[1.02] hover:shadow-md ${
                    isActive
                      ? "bg-gradient-to-r from-[#E91E63] to-[#FF8C1A] border-white text-white shadow-xl"
                      : "bg-white border-gray-100 text-gray-800 hover:bg-gray-50"
                  }`}
                >
               
                  <div
                    className={`w-8 h-8 md:w-9 md:h-9 lg:w-10 lg:h-10 flex items-center justify-center rounded-md md:rounded-lg text-xl md:text-2xl mb-1 md:mb-1.5 transition duration-300 ${
                      isActive
                        ? "bg-white text-gray-800"
                        : `${(p.color || "bg-gray-100").replace(
                            "bg-",
                            "text-"
                          )} bg-white shadow-inner`
                    }`}
                  >
                    {typeof p.logo === "string" && p.logo.startsWith("http") ? (
                      <img
                        src={p.logo}
                        alt={p.name || "platform"}
                        className="w-6 h-6 object-contain"
                        onError={(e) => {
                          e.currentTarget.style.display = "none";
                        }}
                      />
                    ) : React.isValidElement(p.logo) ? (
                      p.logo
                    ) : (
                      <span className="text-xl md:text-2xl">
                        {p.logo || "🛒"}
                      </span>
                    )}
                  </div>

                  <div
                    className={`font-extrabold text-xs sm:text-sm md:text-base mt-0.5 md:mt-1 truncate w-full px-1 text-center ${
                      isActive ? "text-white" : "text-gray-800"
                    }`}
                  >
                    {(p.name || "").split("(")[0].trim() || "Nền tảng"}
                  </div>

                  <div className="mt-1">
                    {PlatformTypeBadge ? (
                      <PlatformTypeBadge type={p.type} isActive={isActive} />
                    ) : (
                      <span
                        className={`text-[9px] sm:text-[10px] px-1.5 py-0.5 rounded uppercase font-extrabold ${
                          isActive
                            ? "bg-white/20 text-white"
                            : "bg-gray-100 text-gray-400"
                        }`}
                      >
                        {p.type || "Sàn"}
                      </span>
                    )}
                  </div>
                </button>
              );
            })}
          </div> */}

          {/* Input and Output Section */}
          <div className="mt-4 sm:mt-6 lg:mt-8 grid grid-cols-1 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-6">
            {/* Input Card */}
            <div className="lg:col-span-3 bg-white rounded-lg sm:rounded-xl lg:rounded-2xl p-3 sm:p-4 lg:p-6 shadow-xl border border-gray-100">
              {isLinkRequired ? (
                // Case 1: Cashback Product/Service (Link Required)
                <>
                  <label className="text-sm sm:text-base md:text-lg text-gray-800 font-bold flex items-center mb-2 sm:mb-3">
                    {inputLabel}
                  </label>

                  <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 w-full">
                    {/* Input + Paste icon trên mobile */}
                    <div className="relative flex-1 w-full">
                      <Input
                        type="text"
                        value={inputLink}
                        onChange={(e) => setInputLink(e.target.value)}
                        placeholder={inputPlaceholder}
                        className="w-full px-3 py-2.5 sm:px-4 sm:py-3 text-base sm:text-lg rounded-lg md:rounded-xl bg-gray-50 transition pr-10 sm:pr-4"
                        disabled={isGenerating}
                      />
                      {/* Paste icon chỉ hiển thị mobile */}
                      <button
                        onClick={async () => {
                          try {
                            const text = await navigator.clipboard.readText();
                            setInputLink(text);
                          } catch (err) {
                            console.error("Failed to read clipboard:", err);
                          }
                        }}
                        className="absolute right-2 top-1/2 -translate-y-1/2 sm:hidden flex items-center justify-center p-1 text-gray-600 hover:text-gray-800"
                        title="Dán từ clipboard"
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
                            d="M15.666 3.888A2.25 2.25 0 0 0 13.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 0 1-.75.75H9a.75.75 0 0 1-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 0 1-2.25 2.25H6.75A2.25 2.25 0 0 1 4.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 0 1 1.927-.184"
                          />
                        </svg>
                      </button>
                    </div>

                    {/* Desktop: Paste button */}
                    <button
                      onClick={async () => {
                        try {
                          const text = await navigator.clipboard.readText();
                          setInputLink(text);
                        } catch (err) {
                          console.error("Failed to read clipboard:", err);
                        }
                      }}
                      className="hidden sm:flex items-center justify-center gap-2 w-auto px-3 py-2.5 text-sm sm:text-base bg-gray-100 text-gray-700 rounded-lg md:rounded-xl font-semibold border border-gray-300 hover:bg-gray-200 transition"
                      title="Dán từ clipboard"
                    >
                      <Clipboard size={16} />
                    </button>

                    {/* Tạo link button */}
                    <button
                      onClick={handleGenerate}
                      disabled={isButtonDisabled}
                      className="mt-2 sm:mt-0 w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-3 sm:px-6 sm:py-3 text-base sm:text-lg bg-gradient-to-r from-[#E91E63] to-[#FF8C1A] text-white rounded-xl md:rounded-xl font-extrabold hover:from-[#AD1457] hover:to-[#E65100] transition shadow-lg disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                      {isGenerating ? (
                        <Loader size={18} className="animate-spin sm:mr-2" />
                      ) : (
                        <CornerDownRight size={18} className="sm:mr-2" />
                      )}
                      <span className="inline">
                        {isGenerating ? "Đang tạo..." : "Tạo link"}
                      </span>
                    </button>
                  </div>

                  {helperText && (
                    <p className="text-sm sm:text-base text-gray-600 mt-2 font-medium">
                      {helperText}
                    </p>
                  )}
                </>
              ) : (
                // Case 2: Trade/Finance (Link Auto-Generated, Input is Optional Update)
                <div className="space-y-2 md:space-y-3">
                  <div className="text-sm sm:text-base md:text-lg text-gray-800 font-extrabold mb-3 md:mb-4 flex items-center">
                    <Shield size={16} className="inline mr-2 text-purple-600" />
                    Link ĐĂNG KÝ/TƯ VẤN đã được tạo tự động!
                  </div>

                  <div className="flex flex-col gap-2 p-3 md:p-4 bg-gray-50 rounded-lg md:rounded-xl border border-gray-200">
                    <label className="text-sm sm:text-base text-gray-700 font-bold flex items-center">
                      {inputLabel}
                    </label>
                    <div className="flex gap-2 md:gap-3">
                      <input
                        type="text"
                        value={inputLink}
                        onChange={(e) => setInputLink(e.target.value)}
                        placeholder={inputPlaceholder}
                        className="flex-1 px-3 py-2 md:px-4 md:py-2 text-base sm:text-lg rounded-lg border border-gray-300 focus:outline-none focus:ring-2 ring-pink-300 focus:border-[#E91E63] transition"
                        disabled={isGenerating}
                      />
                      <button
                        onClick={handleGenerate}
                        className="px-3 py-2 md:px-4 md:py-2 text-sm sm:text-base bg-gradient-to-r from-[#E91E63] to-[#FF8C1A] text-white rounded-lg font-extrabold hover:from-[#AD1457] hover:to-[#E65100] transition shadow-md disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center shrink-0"
                        disabled={isGenerating}
                      >
                        {isGenerating ? (
                          <Loader size={14} className="animate-spin" />
                        ) : (
                          <RefreshCcw size={14} className="md:mr-1" />
                        )}
                        <span className="hidden md:inline">
                          {isGenerating ? "Đang tạo..." : "Cập nhật"}
                        </span>
                      </button>
                    </div>
                    <p className="text-sm sm:text-base text-gray-600 mt-1 font-medium">
                      {helperText}
                    </p>
                  </div>
                </div>
              )}

              {/* Offer preview */}
              {currentOffer && (
                <div className="mt-4 sm:mt-6 bg-white rounded-lg sm:rounded-xl p-4 sm:p-6 border-2 border-gray-200 shadow-lg">
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
                        className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-bold py-4 px-6 rounded-lg text-lg flex items-center justify-center gap-2 transition-all transform hover:scale-[1.02] shadow-lg"
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

            {/* Output Link Card */}
            {/* <div className="bg-white rounded-xl md:rounded-2xl p-4 md:p-6 shadow-xl border border-gray-100 flex flex-col">
              <div className="text-base sm:text-lg md:text-xl text-gray-800 font-extrabold mb-2 md:mb-3">
                Link{" "}
                {activePlatform.type === "trade"
                  ? "Rebate"
                  : activePlatform.type === "finance"
                  ? "Tư Vấn"
                  : "Hoàn Tiền"}{" "}
                đã tạo
              </div>
              <Input
                readOnly
                value={
                  generatedLink ||
                  (isGenerating ? "Đang tải..." : "Chưa có link")
                }
                placeholder="Chưa có link"
                className="w-full px-3 py-2 md:px-4 md:py-3 text-sm sm:text-base md:text-lg bg-gray-100 rounded-lg md:rounded-xl border border-gray-200 truncate font-medium"
              />

              <div className="mt-3 md:mt-4 flex gap-2 md:gap-3">
                <button
                  onClick={handleCopy}
                  className={` px-3 py-2 md:px-4 md:py-3 text-base sm:text-lg ${
                    isCopying
                      ? "bg-green-600"
                      : "bg-gradient-to-r from-[#E91E63] to-[#FF8C1A]"
                  } text-white rounded-lg md:rounded-xl font-semibold transition duration-300 hover:opacity-90 flex items-center justify-center disabled:opacity-50`}
                  disabled={!generatedLink}
                >
                  <Copy size={16} />
                </button>
                <button
                  onClick={handleOpen}
                  className="px-3 py-2 md:px-4 md:py-3 text-base sm:text-lg bg-gradient-to-r from-[#E91E63] to-[#FF8C1A] text-white rounded-lg md:rounded-xl font-extrabold hover:opacity-90 disabled:opacity-50"
                  disabled={!generatedLink}
                >
                  <ExternalLink size={16} />
                </button>
                <button
                  onClick={() => {
                    if (generatedLink && currentOffer) {
                      setQrModal({
                        show: true,
                        link: generatedLink,
                        title: currentOffer.title,
                      });
                    } else {
                      notification({
                        type: "error",
                        message: "Chưa có link để tạo QR",
                      });
                    }
                  }}
                  className="w-10 h-10 md:w-12 md:h-auto shrink-0 bg-gray-100 rounded-lg md:rounded-xl text-sm sm:text-base text-gray-600 hover:bg-gray-200 transition disabled:opacity-50 flex items-center justify-center"
                  disabled={!generatedLink}
                >
                  <QrCode size={16} />
                </button>
              </div>

              <div className="mt-3 md:mt-4 text-sm sm:text-base text-gray-600 border-t pt-2 md:pt-3 font-medium">
                <p>Link có thời hạn 30 ngày kể từ ngày tạo.</p>
              </div>
            </div> */}
          </div>

          {/* Priority Products Section - Hide when offer is shown */}
          {!currentOffer && (
            <div className="mt-6 md:mt-8">
              <PriorityProducts
                limit={6}
                platform={activePlatformId}
                onProductClick={(product) => {
                  setInputLink(product.productUrl);
                  handleSelectPlatform("shopee");
                }}
              />
            </div>
          )}

          {/* History and Recommended Offers - Hide when offer is shown */}
          {!currentOffer && (
            <div className="mt-6 md:mt-8 grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
              {/* Search history */}
              <div className="bg-white rounded-xl lg:rounded-2xl p-3.5 md:p-4 lg:p-6 shadow-xl border border-gray-100">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 md:gap-2.5 mb-2.5 md:mb-3">
                  <div className="flex items-center gap-1.5 md:gap-2">
                    <div className="w-8 h-8 md:w-9 md:h-9 lg:w-10 lg:h-10 rounded-lg md:rounded-xl bg-gradient-to-r from-[#E91E63] to-[#FF8C1A] flex items-center justify-center shrink-0 shadow-lg">
                      <svg
                        className="w-3.5 h-3.5 md:w-4 md:h-4 lg:w-5 lg:h-5 text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                    </div>
                    <div>
                      <div className="font-extrabold text-xs md:text-sm lg:text-base text-gray-900">
                        Lịch sử tạo link
                      </div>
                      <div className="text-[10px] md:text-[11px] lg:text-xs text-gray-600 font-medium">
                        {history.length} link đã tạo
                      </div>
                    </div>
                  </div>
                  <div className="relative w-full sm:w-auto">
                    <Search
                      size={12}
                      className="absolute left-2 md:left-2.5 top-1/2 transform -translate-y-1/2 text-gray-400"
                    />
                    <input
                      type="text"
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      placeholder="Tìm kiếm..."
                      className="text-[11px] md:text-xs lg:text-sm px-7 md:px-8 lg:px-9 py-1 md:py-1.5 bg-gray-50 rounded-md md:rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-pink-300 focus:border-transparent w-full sm:w-36 md:w-40 lg:w-48 transition-all"
                    />
                  </div>
                </div>

                <div className="space-y-2 md:space-y-2.5 max-h-[320px] md:max-h-[360px] lg:max-h-[480px] overflow-y-auto pr-1 md:pr-1.5 custom-scrollbar">
                  {loadingHistory ? (
                    <div className="text-center py-10 md:py-12 lg:py-14">
                      <Loader className="w-7 h-7 md:w-8 md:h-8 lg:w-10 lg:h-10 mx-auto mb-2 md:mb-3 text-pink-500 animate-spin" />
                      <p className="text-[11px] md:text-xs lg:text-sm text-gray-500 font-medium">
                        Đang tải lịch sử...
                      </p>
                    </div>
                  ) : filteredHistory.length === 0 ? (
                    <div className="text-center py-10 md:py-12 lg:py-14">
                      <div className="w-14 h-14 md:w-16 md:h-16 lg:w-20 lg:h-20 mx-auto mb-2 md:mb-3 rounded-full bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
                        <svg
                          className="w-7 h-7 md:w-8 md:h-8 lg:w-10 lg:h-10 text-gray-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                          />
                        </svg>
                      </div>
                      <p className="text-[11px] md:text-xs lg:text-sm text-gray-600 font-semibold mb-0.5 md:mb-1">
                        {query ? "Không tìm thấy kết quả" : "Chưa có lịch sử"}
                      </p>
                      <p className="text-[9px] md:text-[10px] lg:text-xs text-gray-400">
                        {query
                          ? "Thử từ khóa khác"
                          : "Tạo link đầu tiên của bạn"}
                      </p>
                    </div>
                  ) : null}

                  {!loadingHistory &&
                    filteredHistory.map((h) => {
                      const platform = PLATFORMS.find(
                        (p) => p.id === h.platform
                      );
                      return (
                        <div
                          key={h.id}
                          className="group flex items-start gap-2 md:gap-2.5 lg:gap-3 p-2 md:p-2.5 lg:p-3 rounded-md md:rounded-lg hover:bg-gradient-to-r hover:from-pink-50 hover:to-orange-50 transition-all duration-300 border border-gray-100 hover:border-pink-200 hover:shadow-lg"
                        >
                          {/* Product image or platform icon */}
                          <div className="shrink-0 relative">
                            <img
                              src={h.imageUrl || ""}
                              alt={h.title}
                              className="w-12 h-12 md:w-14 md:h-14 lg:w-16 lg:h-16 rounded-md md:rounded-lg object-cover border-2 border-gray-200 group-hover:border-pink-300 shadow-sm transition-all duration-300"
                              style={{ display: h.imageUrl ? "block" : "none" }}
                              onError={(e) => {
                                const target =
                                  e.currentTarget as HTMLImageElement;
                                target.style.display = "none";
                              }}
                            />
                            <div
                              className={`w-12 h-12 md:w-14 md:h-14 lg:w-16 lg:h-16 rounded-md md:rounded-lg flex items-center justify-center text-white font-bold shadow-md ${
                                h.platform === "shopee"
                                  ? "bg-gradient-to-br from-orange-500 to-orange-600"
                                  : h.platform === "tiki"
                                  ? "bg-gradient-to-br from-blue-500 to-blue-600"
                                  : h.platform === "lazada"
                                  ? "bg-gradient-to-br from-purple-600 to-purple-700"
                                  : "bg-gradient-to-br from-gray-400 to-gray-500"
                              }`}
                              style={{ display: h.imageUrl ? "none" : "flex" }}
                            >
                              {platform?.logo &&
                              typeof platform.logo === "string" ? (
                                <img
                                  src={platform.logo}
                                  alt={h.platform}
                                  className="w-6 h-6 md:w-7 md:h-7 lg:w-8 lg:h-8 object-contain"
                                />
                              ) : (
                                <span className="text-sm md:text-base lg:text-lg">
                                  {h.platform.charAt(0).toUpperCase()}
                                </span>
                              )}
                            </div>
                          </div>

                          {/* Content */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-1 md:gap-1.5 mb-1 md:mb-1.5">
                              <h3 className="font-semibold text-gray-900 text-[11px] md:text-xs lg:text-sm leading-tight line-clamp-2 group-hover:text-pink-700 transition-colors">
                                {h.title}
                              </h3>
                            </div>

                            <div className="flex items-center gap-1 md:gap-1.5 flex-wrap mb-1 md:mb-1.5">
                              <PlatformTypeBadge
                                type={h.type}
                                isActive={false}
                              />
                              <span className="text-[9px] md:text-[10px] lg:text-xs text-gray-500 flex items-center gap-0.5 font-medium">
                                <svg
                                  className="w-2 h-2 md:w-2.5 md:h-2.5"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                                  />
                                </svg>
                                {new Date(h.createdAt).toLocaleString("vi-VN", {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                  day: "2-digit",
                                  month: "2-digit",
                                })}
                              </span>
                            </div>

                            {/* Price and Commission Info */}
                            {h.productPrice && (
                              <div className="flex flex-wrap items-center gap-1 md:gap-1.5 lg:gap-2 mb-1.5 md:mb-2 text-[9px] md:text-[10px] lg:text-xs">
                                <span className="px-1 py-0.5 md:px-1.5 md:py-0.5 bg-gradient-to-r from-gray-50 to-gray-100 text-gray-800 font-bold rounded text-[9px] md:text-[10px] border border-gray-200">
                                  {formatCurrency(h.productPrice)}
                                </span>
                                {h.commissionRate && h.estimatedCommission && (
                                  <span className="px-1 py-0.5 md:px-1.5 md:py-0.5 bg-gradient-to-r from-green-50 to-emerald-50 text-green-700 font-bold rounded text-[9px] md:text-[10px] flex items-center gap-0.5 border border-green-200">
                                    <Zap
                                      size={9}
                                      className="inline md:w-2.5 md:h-2.5"
                                    />
                                    {(h.commissionRate * 100).toFixed(1)}%
                                    <span className="hidden sm:inline text-green-600">
                                      (~{formatCurrency(h.estimatedCommission)})
                                    </span>
                                  </span>
                                )}
                              </div>
                            )}

                            {/* Action buttons */}
                            <div className="flex flex-wrap gap-1 md:gap-1.5">
                              <a
                                href={h.link}
                                target="_blank"
                                rel="noreferrer"
                                onClick={(e) => e.stopPropagation()}
                                className="flex-1 sm:flex-none px-2 py-1 md:px-2.5 md:py-1.5 lg:px-3 lg:py-2 bg-gradient-to-r from-[#E91E63] to-[#FF8C1A] text-white rounded md:rounded-md text-[9px] md:text-[10px] lg:text-xs font-bold hover:shadow-xl hover:scale-105 transition-all duration-200 flex items-center justify-center gap-0.5 md:gap-1 cursor-pointer"
                              >
                                <ExternalLink
                                  size={10}
                                  className="md:w-3 md:h-3 lg:w-3.5 lg:h-3.5"
                                />
                                <span>Mở link</span>
                              </a>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  navigator.clipboard.writeText(h.link);
                                  notification({
                                    type: "success",
                                    message: "Đã sao chép link vào clipboard",
                                  });
                                }}
                                className="px-2 py-1 md:px-2.5 md:py-1.5 lg:px-3 lg:py-2 bg-white border border-gray-200 text-gray-700 rounded md:rounded-md text-[9px] md:text-[10px] lg:text-xs font-semibold hover:bg-gray-50 hover:border-pink-300 hover:shadow-md transition-all duration-200 flex items-center gap-0.5 md:gap-1 cursor-pointer"
                              >
                                <Copy
                                  size={10}
                                  className="md:w-3 md:h-3 lg:w-3.5 lg:h-3.5"
                                />
                                <span className="hidden sm:inline">Copy</span>
                              </button>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setQrModal({
                                    show: true,
                                    link: h.link,
                                    title: h.title,
                                  });
                                }}
                                className="px-2 py-1 md:px-2.5 md:py-1.5 lg:px-3 lg:py-2 bg-white border border-gray-200 text-gray-700 rounded md:rounded-md text-[9px] md:text-[10px] lg:text-xs font-semibold hover:bg-gray-50 hover:border-pink-300 hover:shadow-md transition-all duration-200 flex items-center gap-0.5 md:gap-1 cursor-pointer"
                              >
                                <QrCode
                                  size={10}
                                  className="md:w-3 md:h-3 lg:w-3.5 lg:h-3.5"
                                />
                                <span className="hidden sm:inline">QR</span>
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                </div>
              </div>

              {/* Quick list of recommended offers */}
              <div className="bg-white rounded-xl md:rounded-2xl p-4 md:p-6 shadow-xl border border-gray-100">
                <div className="font-bold text-lg md:text-xl lg:text-2xl text-gray-800 mb-4 md:mb-6">
                  Ưu đãi nổi bật đang hot (Sản phẩm & Dịch vụ)
                </div>
                <div className="space-y-4">
                  {SAMPLE_PRODUCTS.map((p) => (
                    <div
                      key={p.id}
                      className="flex items-center gap-4 p-3 rounded-xl hover:bg-gray-50 transition cursor-pointer"
                      onClick={() => {
                        setInputLink(
                          p.platform === "shopee"
                            ? "https://shopee.vn/product/17227968/41052353272" // Dùng link mẫu có sẵn trong server.js
                            : `https://${p.platform}.com/product/${p.id}`
                        );
                        handleSelectPlatform(p.platform);
                      }}
                    >
                      <img
                        src={p.img}
                        alt={p.title}
                        className="w-12 h-12 sm:w-16 sm:h-16 rounded-lg object-cover shadow-sm shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-gray-800 text-sm sm:text-base truncate">
                          {p.title}
                        </div>
                        <div className="text-xs sm:text-sm text-gray-500 mt-0.5 sm:mt-1">
                          {p.shop} ({p.platform})
                        </div>
                      </div>
                      <div className="text-right shrink-0">
                        <div className="text-[#E91E63] font-bold text-sm sm:text-base">
                          {p.rateText}
                        </div>
                        <div className="text-gray-500 text-xs mt-0.5 line-through">
                          {p.priceText}
                        </div>
                      </div>
                    </div>
                  ))}
                  {/* Placeholder for Loan/Trade Hot Deals */}
                  <div className="mt-4 p-3 bg-purple-50 rounded-lg text-purple-800 text-sm border border-purple-200">
                    <Shield size={16} className="inline mr-2" />
                    Liên hệ hỗ trợ viên để nhận link Rebate Crypto/Forex hoặc tư
                    vấn Vay ưu đãi tốt nhất.
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
