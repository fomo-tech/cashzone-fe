import React, { useState, useCallback, useMemo } from "react";
import { Link, Copy, Search, Zap, Loader, Shield } from "lucide-react";
import axios from "axios";

// =========================================================================
// CONFIGURATION
// =========================================================================

const API_BASE_URL = "http://localhost:3000";

// =========================================================================
// INTERFACES
// =========================================================================

interface Platform {
  id: string;
  name: string;
  color: string;
  logo: string | JSX.Element;
  type: "product" | "trade" | "service" | "finance";
}

interface ProductOffer {
  id: string;
  title: string;
  shop: string;
  feeText: string;
  rateText: string;
  priceText: string;
  img: string;
  platform: string;
}

interface HistoryItem {
  id: string;
  platform: string;
  title: string;
  createdAt: string;
  link: string;
  type: "product" | "trade" | "service" | "finance";
}

// =========================================================================
// DATA
// =========================================================================

const PLATFORMS: Platform[] = [
  {
    id: "shopee",
    name: "Shopee",
    color: "bg-orange-500",
    logo: "🛒",
    type: "product",
  },
  {
    id: "tiktok",
    name: "TikTok Shop",
    color: "bg-black",
    logo: "📱",
    type: "product",
  },
  {
    id: "lazada",
    name: "Lazada",
    color: "bg-blue-600",
    logo: "🛍️",
    type: "product",
  },
];

const SAMPLE_PRODUCTS: ProductOffer[] = [
  {
    id: "p1",
    title: "Ốp điện thoại iPhone 15 Pro Max trong suốt cao cấp",
    shop: "E36 SodaShop",
    feeText: "9.238₫",
    rateText: "14%",
    priceText: "650.000₫",
    img: "https://via.placeholder.com/80/FF6B35/FFFFFF?text=📱",
    platform: "shopee",
  },
  {
    id: "p2",
    title: "Áo Hoodie unisex form rộng phong cách Hàn Quốc",
    shop: "StreetVibe Official",
    feeText: "15.000₫",
    rateText: "10%",
    priceText: "499.000₫",
    img: "https://via.placeholder.com/80/000000/FFFFFF?text=👕",
    platform: "tiktok",
  },
];

// =========================================================================
// COMPONENTS
// =========================================================================

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

  React.useEffect(() => {
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  if (!message) return null;

  return (
    <div
      className={`fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg text-white font-medium ${colorMap[type]}`}
    >
      {message}
    </div>
  );
};

const OfferPreview: React.FC<{
  offer: ProductOffer;
}> = ({ offer }) => {
  return (
    <div className="flex gap-4 items-start p-4 bg-gray-50 rounded-xl border border-gray-200">
      <div className="w-16 h-16 bg-white rounded-lg flex items-center justify-center text-2xl">
        {offer.img.includes("placeholder") ? offer.img.split("text=")[1] : "📦"}
      </div>
      <div className="flex-1 min-w-0">
        <h4 className="font-semibold text-gray-900 line-clamp-2">
          {offer.title}
        </h4>
        <p className="text-sm text-gray-500 mt-1">{offer.shop}</p>
        <div className="flex items-center gap-4 mt-2">
          <div className="text-green-600 font-semibold">
            💰 {offer.rateText} Cashback
          </div>
          <div className="text-gray-600 text-sm">Hoa hồng: {offer.feeText}</div>
        </div>
      </div>
    </div>
  );
};

// =========================================================================
// MAIN COMPONENT
// =========================================================================

export default function CashbackHub() {
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

  const showToast = useCallback(
    (msg: string, type: "success" | "error" | "info" = "info") => {
      setMessage({ msg, type });
    },
    []
  );

  const generateLink = useCallback(
    async (platformId: string, inputUrl: string) => {
      if (!inputUrl.trim()) {
        showToast("Vui lòng nhập link sản phẩm", "error");
        return;
      }

      setIsGenerating(true);
      setCurrentOffer(null);
      setGeneratedLink("");

      try {
        const response = await axios.get(`${API_BASE_URL}/api/convert`, {
          params: { url: inputUrl.trim() },
        });

        const data = response.data;

        if (data.success) {
          const offer: ProductOffer = {
            id: "gen-" + Date.now(),
            title: data.name,
            shop: activePlatform.name,
            feeText: `${data.commission.toLocaleString()}₫`,
            rateText: `${Math.round((data.commission / data.price) * 100)}%`,
            priceText: `${data.price.toLocaleString()}₫`,
            img: `https://via.placeholder.com/80/4A90E2/FFFFFF?text=${platformId
              .charAt(0)
              .toUpperCase()}`,
            platform: platformId,
          };

          setCurrentOffer(offer);
          setGeneratedLink(data.affiliateLink);

          setHistory((prev) => [
            {
              id: Date.now().toString(),
              platform: platformId,
              title: offer.title,
              createdAt: new Date().toISOString(),
              link: data.affiliateLink,
              type: "product",
            },
            ...prev,
          ]);

          showToast("Tạo link thành công!", "success");
        } else {
          showToast(data.error || "Không thể tạo link", "error");
        }
      } catch (error) {
        console.error("API Error:", error);
        showToast("Lỗi kết nối API. Vui lòng thử lại.", "error");
      } finally {
        setIsGenerating(false);
      }
    },
    [activePlatform, showToast]
  );

  const handleGenerate = useCallback(() => {
    generateLink(activePlatformId, inputLink);
  }, [activePlatformId, inputLink, generateLink]);

  const handleCopy = useCallback(async () => {
    if (!generatedLink) return;

    setIsCopying(true);
    try {
      await navigator.clipboard.writeText(generatedLink);
      showToast("Đã sao chép link!", "success");
    } catch {
      showToast("Không thể sao chép", "error");
    } finally {
      setTimeout(() => setIsCopying(false), 1000);
    }
  }, [generatedLink, showToast]);

  const filteredHistory = useMemo(() => {
    if (!query) return history;
    return history.filter((h) =>
      h.title.toLowerCase().includes(query.toLowerCase())
    );
  }, [history, query]);

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Toast */}
        {message && (
          <ToastMessage
            message={message.msg}
            type={message.type}
            onClose={() => setMessage(null)}
          />
        )}

        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            💰 Cashback Hub
          </h1>
          <p className="text-xl text-gray-600">
            Tạo link hoàn tiền nhanh chóng và dễ dàng
          </p>
        </div>

        {/* Hero Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 mb-8 text-center">
          <div className="text-6xl mb-4">🎁</div>
          <h2 className="text-2xl font-semibold text-gray-900 mb-3">
            Nhận hoàn tiền lên đến 30%
          </h2>
          <p className="text-gray-600 mb-6">
            Dán link sản phẩm, tạo link hoàn tiền và chia sẻ ngay!
          </p>
          <button
            onClick={() => {
              setInputLink("https://shopee.vn/product/17227968/41052353272");
              setActivePlatformId("shopee");
            }}
            className="bg-orange-500 text-white px-6 py-3 rounded-xl font-medium hover:bg-orange-600 transition-colors"
          >
            🚀 Thử ngay với Shopee
          </button>
        </div>

        {/* Platform Selector */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            🏪 Chọn nền tảng:
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {PLATFORMS.map((platform) => (
              <button
                key={platform.id}
                onClick={() => setActivePlatformId(platform.id)}
                className={`p-4 rounded-xl border-2 transition-colors ${
                  activePlatformId === platform.id
                    ? "border-blue-500 bg-blue-50"
                    : "border-gray-200 bg-white hover:border-gray-300"
                }`}
              >
                <div className="text-3xl mb-2">{platform.logo}</div>
                <div className="font-medium">{platform.name}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Main Action */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            🔗 Tạo link hoàn tiền
          </h3>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Dán link sản phẩm từ {activePlatform.name}:
              </label>
              <div className="flex gap-3">
                <input
                  type="text"
                  value={inputLink}
                  onChange={(e) => setInputLink(e.target.value)}
                  placeholder={`Dán link từ ${activePlatform.name}...`}
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  disabled={isGenerating}
                />
                <button
                  onClick={handleGenerate}
                  disabled={!inputLink.trim() || isGenerating}
                  className="px-6 py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {isGenerating ? (
                    <Loader size={20} className="animate-spin" />
                  ) : (
                    <Zap size={20} />
                  )}
                  {isGenerating ? "Đang tạo..." : "Tạo link"}
                </button>
              </div>
            </div>

            {/* Generated Link */}
            {generatedLink && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Link hoàn tiền đã tạo:
                </label>
                <div className="flex gap-3">
                  <input
                    readOnly
                    value={generatedLink}
                    className="flex-1 px-4 py-3 bg-gray-50 border border-gray-300 rounded-xl text-sm"
                  />
                  <button
                    onClick={handleCopy}
                    className="px-4 py-3 bg-green-600 text-white rounded-xl font-medium hover:bg-green-700 flex items-center gap-2"
                  >
                    <Copy size={16} />
                    {isCopying ? "Đã copy!" : "Copy"}
                  </button>
                  <button
                    onClick={() => window.open(generatedLink, "_blank")}
                    className="px-4 py-3 bg-gray-600 text-white rounded-xl font-medium hover:bg-gray-700"
                  >
                    Mở
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Offer Preview */}
        {currentOffer && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              📝 Thông tin sản phẩm
            </h3>
            <OfferPreview offer={currentOffer} />
          </div>
        )}

        {/* History & Products Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* History */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                🕐 Lịch sử
              </h3>
              <div className="relative">
                <Search
                  size={16}
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                />
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Tìm kiếm..."
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="space-y-3 max-h-80 overflow-y-auto">
              {filteredHistory.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <div className="text-4xl mb-2">📋</div>
                  <p>Chưa có lịch sử nào</p>
                </div>
              ) : (
                filteredHistory.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center gap-3 p-3 border border-gray-100 rounded-lg hover:bg-gray-50"
                  >
                    <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center text-sm">
                      🔗
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-gray-900 text-sm truncate">
                        {item.title}
                      </div>
                      <div className="text-xs text-gray-500">
                        {new Date(item.createdAt).toLocaleDateString("vi-VN")}
                      </div>
                    </div>
                    <a
                      href={item.link}
                      target="_blank"
                      rel="noreferrer"
                      className="px-3 py-1 bg-blue-600 text-white rounded-lg text-xs font-medium hover:bg-blue-700"
                    >
                      Mở
                    </a>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Sample Products */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              🔥 Sản phẩm hot
            </h3>
            <div className="space-y-4">
              {SAMPLE_PRODUCTS.map((product) => (
                <div
                  key={product.id}
                  className="flex items-center gap-3 p-3 border border-gray-100 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                  onClick={() => {
                    setInputLink(
                      "https://shopee.vn/product/17227968/41052353272"
                    );
                    setActivePlatformId(product.platform);
                  }}
                >
                  <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center text-xl">
                    {product.img.includes("placeholder")
                      ? product.img.split("text=")[1]
                      : "📦"}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-gray-900 text-sm line-clamp-2">
                      {product.title}
                    </div>
                    <div className="text-xs text-gray-500">{product.shop}</div>
                  </div>
                  <div className="text-green-600 font-semibold text-sm">
                    {product.rateText}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="mt-16 pt-8 border-t border-gray-200 text-center">
          <p className="text-gray-500">
            &copy; {new Date().getFullYear()} Cashback Hub - 💰 Tạo link hoàn
            tiền dễ dàng
          </p>
        </footer>
      </div>
    </div>
  );
}
