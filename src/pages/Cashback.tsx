import React, { useState, useCallback, useMemo } from "react";
import {
  Link,
  Copy,
  CornerDownRight,
  Search,
  Zap,
  Loader,
  Shield,
  Plane,
  TrendingUp,
  RefreshCcw,
  Hotel,
  DollarSign,
  ArrowRightLeft,
} from "lucide-react";
import axios from "axios"; // Import axios

// =========================================================================
// 1. UTILITIES & CONFIGURATION
// =========================================================================

// Địa chỉ Mock API Server. Cần đảm bảo server.js đang chạy tại cổng này.
const API_BASE_URL = "http://localhost:3000";

// Hàm định dạng tiền tệ Việt Nam (VNĐ)
const formatCurrency = (amount: number | string) => {
  // Chuyển string (nếu có) thành number, hoặc mặc định là 0
  const number = typeof amount === "string" ? parseFloat(amount) : amount;
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    minimumFractionDigits: 0,
  }).format(number || 0);
};

// Định nghĩa màu thương hiệu chính (Primary Brand Color)
const PRIMARY_COLOR = "bg-[#00b47d]";
const PRIMARY_RING_COLOR = "ring-[#00b47d]";
const PRIMARY_TEXT_COLOR = "text-[#00b47d]";

// =========================================================================
// 2. INTERFACES (TypeScript Types)
// =========================================================================

// Platform Type distinction for UI clarity
interface Platform {
  id: string;
  name: string;
  color: string; // Tailwind custom color class (e.g., bg-[#FF6A00])
  logo: string | JSX.Element; // URL, Emoji, or React component
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
  {
    id: "tiktok",
    name: "TikTok Shop",
    color: "bg-[#000000]",
    logo: "https://img.icons8.com/?size=100&id=118638&format=png&color=000000",
    type: "product",
  },
  {
    id: "booking",
    name: "Booking.com",
    color: "bg-[#0066CC]",
    logo: <Hotel className="text-[#0066CC]" size={20} />,
    type: "service",
  },
  {
    id: "loan",
    name: "App Vay (VPBank)",
    color: "bg-[#8B5CF6]",
    logo: <DollarSign className="text-[#8B5CF6]" size={20} />,
    type: "finance",
  },
  {
    id: "binance",
    name: "Binance (Rebate)",
    color: "bg-[#F3B000]",
    logo: <ArrowRightLeft className="text-[#F3B000]" size={20} />,
    type: "trade",
  },
];

const SAMPLE_PRODUCTS: ProductOffer[] = [
  {
    id: "p1",
    title: "Ốp điện thoại iPhone 17 Pro Max trong suốt cao cấp",
    shop: "E36 SodaShop",
    feeText: formatCurrency(9238),
    rateText: "14%",
    priceText: formatCurrency(650000),
    img: "https://via.placeholder.com/96/EE4D2D/FFFFFF?text=Shopee",
    platform: "shopee",
  },
  {
    id: "p2",
    title: "Áo Hoodie unisex form rộng phong cách Hàn Quốc",
    shop: "StreetVibe Official",
    feeText: formatCurrency(15000),
    rateText: "10%",
    priceText: formatCurrency(499000),
    img: "https://via.placeholder.com/96/000000/FFFFFF?text=TikTok",
    platform: "tiktok",
  },
];

// =========================================================================
// 4. COMPONENTS
// =========================================================================

// Component for displaying temporary messages/toasts
const ToastMessage: React.FC<{
  message: string;
  type: "success" | "error" | "info";
  onClose: () => void;
}> = ({ message, type, onClose }) => {
  const colorMap = {
    success: "bg-green-500",
    error: "bg-red-500",
    info: "bg-blue-500",
  };

  // Automatically close the toast after 3 seconds
  React.useEffect(() => {
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  if (!message) return null;

  return (
    <div
      className={`fixed bottom-5 right-5 z-50 p-4 rounded-xl shadow-2xl text-white font-semibold transition-opacity duration-300 ${colorMap[type]}`}
    >
      {message}
    </div>
  );
};

// Product/Offer Preview Component
const OfferPreview: React.FC<{
  offer: ProductOffer;
  type: Platform["type"];
}> = ({ offer, type }) => {
  // Custom label based on type
  let rateLabel, feeLabel;

  switch (type) {
    case "trade":
      rateLabel = "Rebate";
      feeLabel = "Hoàn phí:";
      break;
    case "finance":
      rateLabel = "Ưu đãi Lãi suất";
      feeLabel = "Phí tư vấn:";
      break;
    case "service":
      rateLabel = "Cashback";
      feeLabel = "Hoa hồng:";
      break;
    case "product":
    default:
      rateLabel = "Cashback";
      feeLabel = "Hoa hồng:";
  }

  return (
    <div className="mt-5 p-4 rounded-xl bg-white border border-green-200 flex gap-4 items-start shadow-md">
      <img
        src={offer.img}
        alt={offer.title}
        className="w-20 h-20 rounded-xl object-cover shadow-sm flex-shrink-0"
      />
      <div className="flex-1 min-w-0">
        <div className="font-semibold text-gray-800 truncate">
          {offer.title}
        </div>
        <div className="text-xs text-gray-500 mt-0.5">{offer.shop}</div>
        <div className="flex items-center mt-2 text-sm flex-wrap gap-x-4">
          <div className="font-bold text-red-600">
            <Zap size={14} className="inline mr-1" />
            {offer.rateText} {rateLabel}
          </div>
          <div className="text-gray-700 mt-1 sm:mt-0">
            {feeLabel} <span className="font-semibold">{offer.feeText}</span>
          </div>
        </div>
        <div className="text-xs text-gray-500 mt-1">
          Giá/Mức phí: <span className="font-medium">{offer.priceText}</span>
        </div>
      </div>
      <div className="text-sm text-gray-500 flex-shrink-0">
        <span className="font-medium capitalize">{offer.platform}</span>
      </div>
    </div>
  );
};

// Icon and badge based on Platform Type (Moved outside App for better structure)
const PlatformTypeBadge: React.FC<{
  type: Platform["type"];
  isActive: boolean;
}> = ({ type, isActive }) => {
  let icon, text, bgColor;

  switch (type) {
    case "product":
      icon = <Zap size={14} className="mr-1" />;
      text = "Cashback SP";
      bgColor = isActive ? "bg-white/20" : "bg-green-100 text-green-700";
      break;
    case "trade":
      icon = <TrendingUp size={14} className="mr-1" />;
      text = "Rebate Trade";
      bgColor = isActive ? "bg-white/20" : "bg-yellow-100 text-yellow-700";
      break;
    case "service":
      icon = <Plane size={14} className="mr-1" />;
      text = "Dịch vụ/Du lịch";
      bgColor = isActive ? "bg-white/20" : "bg-blue-100 text-blue-700";
      break;
    case "finance":
      icon = <Shield size={14} className="mr-1" />;
      text = "Vay/Tài chính";
      bgColor = isActive ? "bg-white/20" : "bg-purple-100 text-purple-700";
      break;
    default:
      return null;
  }
  return (
    <div
      className={`flex items-center text-xs font-semibold px-2 py-0.5 rounded-full ${bgColor}`}
    >
      {icon}
      {text}
    </div>
  );
};

// =========================================================================
// 5. MAIN APPLICATION
// =========================================================================

export default function App() {
  const [activePlatformId, setActivePlatformId] = useState<string>(
    PLATFORMS[0].id
  );
  const [inputLink, setInputLink] = useState<string>("");
  const [currentOffer, setCurrentOffer] = useState<ProductOffer | null>(null);
  const [generatedLink, setGeneratedLink] = useState<string>("");
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [query, setQuery] = useState<string>("");
  const [isCopying, setIsCopying] = useState<boolean>(false);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [message, setMessage] = useState<{
    msg: string;
    type: "success" | "error" | "info";
  } | null>(null);

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

  const showToast = useCallback(
    (msg: string, type: "success" | "error" | "info" = "info") => {
      setMessage({ msg, type });
    },
    []
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
          showToast("Vui lòng dán link sản phẩm hợp lệ", "error");
          setIsGenerating(false);
          return;
        }

        // --- GỌI API ĐẾN MOCK SERVER ---
        try {
          const response = await axios.get(`${API_BASE_URL}/api/convert`, {
            params: { url: input.trim() },
          });

          const data = response.data;

          if (data.success) {
            // Thành công: Lấy dữ liệu từ API
            finalLink = data.affiliateLink;

            finalOffer = {
              id: "api-gen-" + Date.now(),
              title: data.name,
              shop: platform.name, // Use platform name for shop
              feeText: formatCurrency(data.commission),
              // Tỷ lệ hoàn tiền: Mock một giá trị hợp lý
              rateText: `${Math.round((data.commission / data.price) * 100)}%`,
              priceText: formatCurrency(data.price),
              img: `https://via.placeholder.com/96/4B5563/FFFFFF?text=${platform.id
                .toUpperCase()
                .charAt(0)}`,
              platform: platform.id,
            };
          } else {
            // Lỗi từ server (ví dụ: URL không hợp lệ)
            showToast(
              data.error || "Lỗi không xác định từ máy chủ API.",
              "error"
            );
            setIsGenerating(false);
            return;
          }
        } catch (error: any) {
          console.error("API Error:", error);
          let errorMessage =
            "Không thể kết nối API. Đảm bảo server.js đang chạy.";
          if (
            error.response &&
            error.response.data &&
            error.response.data.error
          ) {
            errorMessage = error.response.data.error;
          }
          showToast(errorMessage, "error");
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
        showToast("Tạo link thành công!", "success");

        // Thêm vào lịch sử
        setHistory((h) => [
          {
            id: finalLink!.split("/").pop()!, // Lấy token từ link
            platform: platform.id,
            title: finalOffer!.title,
            createdAt: new Date().toISOString(),
            link: finalLink!,
            type: platform.type,
          },
          ...h,
        ]);

        setIsGenerating(false);
      }, delay);
    },
    [showToast, setHistory]
  );

  // Hàm xử lý khi nhấn nút TẠO LINK
  const handleGenerate = useCallback(() => {
    generateLogic(activePlatform, inputLink);
  }, [activePlatform, inputLink, generateLogic]);

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
    if (!generatedLink) return showToast("Chưa có link để sao chép", "error");
    setIsCopying(true);
    try {
      const tempInput = document.createElement("input");
      tempInput.value = generatedLink;
      document.body.appendChild(tempInput);
      tempInput.select();
      document.execCommand("copy");
      document.body.removeChild(tempInput);

      showToast("Đã sao chép link!", "success");
    } catch {
      showToast("Lỗi: Không thể sao chép link", "error");
    } finally {
      setTimeout(() => setIsCopying(false), 1000); // 1s visual feedback
    }
  }, [generatedLink, showToast]);

  const handleOpen = useCallback(() => {
    if (!generatedLink) return showToast("Chưa có link", "error");
    window.open(generatedLink, "_blank");
  }, [generatedLink, showToast]);

  const filteredHistory = useMemo(() => {
    if (!query) return history;
    return history.filter((h) =>
      h.title.toLowerCase().includes(query.toLowerCase())
    );
  }, [history, query]);

  // Dynamic Input Label and Placeholder
  const inputLabel = useMemo(() => {
    switch (activePlatform.type) {
      case "trade":
        return (
          <>
            <TrendingUp size={16} className="mr-2 text-gray-500" />
            Yêu cầu Rebate/Mã giới thiệu (Tùy chọn)
          </>
        );
      case "finance":
        return (
          <>
            <Shield size={16} className="mr-2 text-gray-500" />
            Nhu cầu tư vấn/vay vốn (Tùy chọn)
          </>
        );
      default:
        return (
          <>
            <Link size={16} className="mr-2 text-gray-500" />
            Dán link sản phẩm hoặc affiliate (BẮT BUỘC)
          </>
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
    <div className="min-h-screen bg-gray-50 py-10 font-sans">
      <div className="w-full max-w-6xl mx-auto px-4">
        {/* Toast Message */}
        {message && (
          <ToastMessage
            message={message.msg}
            type={message.type}
            onClose={() => setMessage(null)}
          />
        )}

        {/* Header */}
        <header className="text-center mb-10">
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight">
            Cashback Hub
          </h1>
          <p className="mt-2 text-lg text-gray-500">
            Tạo link hoàn tiền, Rebate và tư vấn ưu đãi nhanh chóng
          </p>
        </header>

        {/* Top hero */}
        <section
          className={`bg-linear-to-r from-[#00b47d] to-[#2ee59d] rounded-3xl p-8 shadow-2xl shadow-green-400/30 text-white flex flex-col md:flex-row gap-6 items-center`}
        >
          <div className="flex-1">
            <h2 className="text-3xl font-black">
              Nhận hoàn tiền/Rebate lên đến 30%
            </h2>
            <p className="mt-2 text-lg opacity-90">
              Chỉ 3 bước: Chọn nền tảng, Cung cấp thông tin (nếu cần), Tạo link
              và chia sẻ
            </p>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => {
                setInputLink("https://shopee.vn/product/17227968/41052353272");
                handleSelectPlatform("shopee");
              }}
              className="px-5 py-2.5 bg-white/20 rounded-xl font-semibold hover:bg-white/30 transition duration-200 shadow-lg"
            >
              <Zap size={18} className="inline mr-1" />
              Thử link mẫu (Shopee)
            </button>
            <button
              onClick={() => window.scrollTo({ top: 400, behavior: "smooth" })}
              className="px-5 py-2.5 bg-white/30 rounded-xl font-semibold hover:bg-white/40 transition duration-200 shadow-lg"
            >
              Bắt đầu
            </button>
          </div>
        </section>

        {/* Platform selector - Cải tiến UI/UX ở đây */}
        <div className="mt-8 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {PLATFORMS.map((p) => (
            <button
              key={p.id}
              onClick={() => handleSelectPlatform(p.id)}
              className={`group flex flex-col items-center p-5 rounded-2xl border-2 transition-all duration-300 shadow-md transform hover:scale-[1.02] hover:shadow-lg ${
                activePlatformId === p.id
                  ? `${PRIMARY_COLOR} border-white ring-4 ring-offset-2 ${PRIMARY_RING_COLOR} text-white shadow-xl`
                  : "bg-white border-gray-100 text-gray-800 hover:bg-gray-50"
              }`}
            >
              {/* Icon / Logo Area */}
              <div
                className={`w-14 h-14 flex items-center justify-center rounded-xl text-3xl mb-2 transition duration-300 ${
                  activePlatformId === p.id
                    ? "bg-white text-gray-800"
                    : `${p.color.replace("bg-", "text-")} bg-white shadow-inner`
                }`}
              >
                {/* Check if logo is an image URL, React component, or emoji */}
                {typeof p.logo === "string" && p.logo.startsWith("http") ? (
                  <img
                    src={p.logo}
                    alt={p.name}
                    className="w-8 h-8 object-contain"
                  />
                ) : typeof p.logo === "object" ? (
                  p.logo
                ) : (
                  <span className="text-3xl">{p.logo}</span>
                )}
              </div>

              {/* Name */}
              <div
                className={`font-black text-lg mt-1 ${
                  activePlatformId === p.id ? "text-white" : "text-gray-800"
                }`}
              >
                {p.name.split("(")[0].trim()}
              </div>

              {/* Badge/Type */}
              <div className="mt-1">
                <PlatformTypeBadge
                  type={p.type}
                  isActive={activePlatformId === p.id}
                />
              </div>
            </button>
          ))}
        </div>

        {/* Input and Output Section */}
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Input Card */}
          <div className="lg:col-span-2 bg-white rounded-2xl p-6 shadow-xl border border-gray-100">
            {isLinkRequired ? (
              // Case 1: Cashback Product/Service (Link Required)
              <>
                <label className="text-sm text-gray-700 font-semibold flex items-center mb-3">
                  {inputLabel}
                </label>
                <div className="flex gap-3">
                  <input
                    type="text"
                    value={inputLink}
                    onChange={(e) => setInputLink(e.target.value)}
                    placeholder={inputPlaceholder}
                    className={`flex-1 px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 ${PRIMARY_RING_COLOR} transition`}
                    disabled={isGenerating}
                  />
                  <button
                    onClick={handleGenerate}
                    className={`px-6 py-3 ${PRIMARY_COLOR} text-white rounded-xl font-bold hover:bg-[#01966a] transition shadow-lg disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center`}
                    disabled={isButtonDisabled}
                  >
                    {isGenerating ? (
                      <Loader size={20} className="animate-spin mr-2" />
                    ) : (
                      <CornerDownRight size={20} className="mr-2" />
                    )}
                    {isGenerating ? "Đang tạo..." : "Tạo link"}
                  </button>
                </div>
                <p className="text-xs text-gray-500 mt-2">{helperText}</p>
              </>
            ) : (
              // Case 2: Trade/Finance (Link Auto-Generated, Input is Optional Update)
              <div className="space-y-3">
                <div className="text-sm text-gray-700 font-bold mb-4 flex items-center">
                  <Shield size={16} className="inline mr-2 text-purple-600" />
                  Link ĐĂNG KÝ/TƯ VẤN đã được tạo tự động!
                </div>

                <div className="flex flex-col gap-2 p-4 bg-gray-50 rounded-xl border border-gray-200">
                  <label className="text-xs text-gray-600 font-semibold flex items-center">
                    {inputLabel}
                  </label>
                  <div className="flex gap-3">
                    <input
                      type="text"
                      value={inputLink}
                      onChange={(e) => setInputLink(e.target.value)}
                      placeholder={inputPlaceholder}
                      className={`flex-1 px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 ${PRIMARY_RING_COLOR} transition`}
                      disabled={isGenerating}
                    />
                    <button
                      onClick={handleGenerate}
                      className={`px-4 py-2 ${PRIMARY_COLOR} text-white rounded-lg font-bold hover:bg-[#01966a] transition shadow-md disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center`}
                      disabled={isGenerating}
                    >
                      {isGenerating ? (
                        <Loader size={16} className="animate-spin" />
                      ) : (
                        <RefreshCcw size={16} className="mr-1" />
                      )}
                      {isGenerating ? "Đang tạo..." : "Cập nhật"}
                    </button>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">{helperText}</p>
                </div>
              </div>
            )}

            {/* Offer preview */}
            {currentOffer && (
              <OfferPreview offer={currentOffer} type={activePlatform.type} />
            )}

            {/* Disclaimer for trade/finance */}
            {(activePlatform.type === "trade" ||
              activePlatform.type === "finance") && (
              <div className="mt-4 p-3 bg-yellow-50 rounded-lg text-yellow-800 text-sm border border-yellow-200">
                <Shield size={16} className="inline mr-2" />
                Link này là link đăng ký/tư vấn cá nhân hóa. Vui lòng không dán
                link sản phẩm.
              </div>
            )}
          </div>

          {/* Output Link Card */}
          <div className="bg-white rounded-2xl p-6 shadow-xl border border-gray-100 flex flex-col">
            <div className="text-sm text-gray-700 font-semibold mb-3">
              Link{" "}
              {activePlatform.type === "trade"
                ? "Rebate"
                : activePlatform.type === "finance"
                ? "Tư Vấn"
                : "Hoàn Tiền"}{" "}
              đã tạo
            </div>
            <input
              readOnly
              value={
                generatedLink || (isGenerating ? "Đang tải..." : "Chưa có link")
              }
              placeholder="Chưa có link"
              className="w-full px-4 py-3 bg-gray-100 rounded-xl border border-gray-200 text-sm truncate"
            />

            <div className="mt-4 flex gap-3">
              <button
                onClick={handleCopy}
                className={`flex-1 px-4 py-3 ${
                  isCopying ? "bg-green-600" : "bg-orange-500"
                } text-white rounded-xl font-semibold transition duration-300 hover:opacity-95 flex items-center justify-center disabled:opacity-50`}
                disabled={!generatedLink}
              >
                <Copy size={18} className="mr-2" />
                {isCopying ? "Đã sao chép!" : "Sao chép"}
              </button>
              <button
                onClick={handleOpen}
                className="px-4 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:opacity-95 disabled:opacity-50"
                disabled={!generatedLink}
              >
                Mở
              </button>
              <button
                onClick={() =>
                  showToast("Chức năng QR đang phát triển", "info")
                }
                className="w-12 h-auto bg-gray-100 rounded-xl text-gray-600 hover:bg-gray-200 transition"
              >
                QR
              </button>
            </div>

            <div className="mt-4 text-xs text-gray-500 border-t pt-3">
              <p>Link có thời hạn 30 ngày kể từ ngày tạo.</p>
            </div>
          </div>
        </div>

        {/* History and Recommended Offers */}
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Search history */}
          <div className="bg-white rounded-2xl p-6 shadow-xl border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <div className="font-bold text-xl text-gray-800">
                Lịch sử tạo link
              </div>
              <div className="relative">
                <Search
                  size={16}
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                />
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Tìm theo tiêu đề"
                  className="text-sm px-10 py-2 bg-gray-50 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-300"
                />
              </div>
            </div>

            <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
              {filteredHistory.length === 0 && (
                <div className="text-center text-gray-500 py-4">
                  Chưa có lịch sử hoặc không tìm thấy kết quả.
                </div>
              )}

              {filteredHistory.map((h) => (
                <div
                  key={h.id}
                  className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition border border-transparent hover:border-gray-100"
                >
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold bg-gray-100 text-gray-600 shadow-md flex-shrink-0`}
                  >
                    {PLATFORMS.find((p) => p.id === h.platform)?.logo ||
                      h.platform.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-gray-800 truncate">
                      {h.title}
                    </div>
                    <div className="text-xs text-gray-500 mt-0.5 flex items-center">
                      <PlatformTypeBadge type={h.type} isActive={false} />
                      <span className="ml-2 text-gray-500">
                        Tạo lúc: {new Date(h.createdAt).toLocaleTimeString()}
                      </span>
                    </div>
                  </div>
                  <a
                    href={h.link}
                    target="_blank"
                    rel="noreferrer"
                    className={`px-4 py-2 ${PRIMARY_COLOR} text-white rounded-lg text-sm font-medium hover:bg-[#01966a] transition flex-shrink-0`}
                  >
                    Mở link
                  </a>
                </div>
              ))}
            </div>
          </div>

          {/* Quick list of recommended offers */}
          <div className="bg-white rounded-2xl p-6 shadow-xl border border-gray-100">
            <div className="font-bold text-xl text-gray-800 mb-4">
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
                    className="w-16 h-16 rounded-lg object-cover shadow-sm flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-gray-800 text-sm truncate">
                      {p.title}
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      {p.shop} ({p.platform})
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <div className="text-red-600 font-bold text-base">
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
                Liên hệ hỗ trợ viên để nhận link Rebate Crypto/Forex hoặc tư vấn
                Vay ưu đãi tốt nhất.
              </div>
            </div>
          </div>
        </div>

        {/* Footer info (Completed the incomplete tag) */}
        <footer className="mt-12 text-sm text-gray-500 text-center border-t border-gray-200 pt-6">
          <p>
            &copy; {new Date().getFullYear()} Cashback Hub. Tất cả quyền được
            bảo lưu.
          </p>
        </footer>
      </div>
    </div>
  );
}
