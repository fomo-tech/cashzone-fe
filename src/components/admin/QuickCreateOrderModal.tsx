import { useState, useEffect, useCallback } from "react";
import { Search, Zap, X, ChevronRight, Package } from "lucide-react";
import cashbackService from "@/services/cashbackService";
import appSettingsService from "@/services/appSettingsService";
import { notification } from "@/utils/notification";

interface QuickCreateOrderModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

interface AffiliateLink {
  _id: string;
  userId: {
    _id: string;
    name: string;
    email: string;
  };
  productName?: string;
  productImage?: string;
  platform: string;
  shortCode?: string;
  cashbackRate?: number;
  createdAt: string;
}

export default function QuickCreateOrderModal({
  open,
  onClose,
  onSuccess,
}: QuickCreateOrderModalProps) {
  const [step, setStep] = useState(1);
  const [selectedLink, setSelectedLink] = useState<AffiliateLink | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [links, setLinks] = useState<AffiliateLink[]>([]);
  const [searching, setSearching] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [defaultCashbackRate, setDefaultCashbackRate] = useState(80);

  const [formData, setFormData] = useState({
    orderId: "",
    orderAmount: "",
    commissionFromShopee: "",
    shareRate: 80, // % trả lại cho user - sẽ được cập nhật từ config
    orderDate: new Date().toISOString().split("T")[0],
  });

  // Fetch default cashback rate from app settings
  useEffect(() => {
    const fetchDefaultRate = async () => {
      try {
        const settings = await appSettingsService.getPublicSettings();
        const rate = settings.defaultCashbackRate || 80;
        setDefaultCashbackRate(rate);
        // Update formData with default rate when modal opens
        if (open) {
          setFormData((prev) => ({ ...prev, shareRate: rate }));
        }
      } catch (error) {
        console.error("Failed to fetch default cashback rate:", error);
        // Keep default 80% if fetch fails
      }
    };

    if (open) {
      fetchDefaultRate();
    }
  }, [open]);

  // Search affiliate links
  useEffect(() => {
    const searchLinks = async () => {
      try {
        setSearching(true);
        const response = await cashbackService.searchAffiliateLinks({
          search: searchTerm,
          limit: 20,
        });
        setLinks(response.links || []);
      } catch (error) {
        console.error("Search failed:", error);
      } finally {
        setSearching(false);
      }
    };

    if (searchTerm.length >= 2) {
      searchLinks();
    } else {
      setLinks([]);
    }
  }, [searchTerm]);

  const handleSelectLink = (link: AffiliateLink) => {
    setSelectedLink(link);
    setStep(2);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedLink) return;

    try {
      setSubmitting(true);

      const commissionAmount = parseFloat(formData.commissionFromShopee);
      const cashbackAmount = (commissionAmount * formData.shareRate) / 100;

      await cashbackService.createOrder({
        userId: selectedLink.userId._id,
        affiliateLinkId: selectedLink._id,
        orderId: formData.orderId,
        platform: selectedLink.platform,
        orderAmount: parseFloat(formData.orderAmount),
        orderDate: formData.orderDate,
        productName: selectedLink.productName,
        productImage: selectedLink.productImage,
        commissionAmount: commissionAmount,
        commissionRate: 10, // Default
        cashbackAmount: cashbackAmount,
        cashbackRate: formData.shareRate,
        cashbackStatus: "pending",
      });

      notification({
        message: "✅ Tạo đơn hàng thành công!",
        type: "success",
      });

      onSuccess();
      handleClose();
    } catch (error: any) {
      notification({
        message: error.response?.data?.message || "Lỗi khi tạo đơn hàng",
        type: "error",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleClose = useCallback(() => {
    if (submitting) return; // Prevent close while submitting
    setStep(1);
    setSelectedLink(null);
    setSearchTerm("");
    setLinks([]);
    setFormData({
      orderId: "",
      orderAmount: "",
      commissionFromShopee: "",
      shareRate: defaultCashbackRate, // Reset to default from config
      orderDate: new Date().toISOString().split("T")[0],
    });
    onClose();
  }, [submitting, defaultCashbackRate, onClose]);

  // Keyboard support - ESC to close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && open && !submitting) {
        handleClose();
      }
    };

    if (open) {
      document.addEventListener("keydown", handleKeyDown);
      // Prevent body scroll when modal is open
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "unset";
    };
  }, [open, submitting, handleClose]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("vi-VN").format(amount);
  };

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 animate-fadeIn"
      onClick={(e) => {
        if (e.target === e.currentTarget && !submitting) {
          handleClose();
        }
      }}
    >
      <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl animate-slideIn">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-orange-600 to-orange-500 text-white p-6 rounded-t-2xl flex justify-between items-center">
          <div className="flex items-center gap-3">
            <Zap size={28} className="animate-pulse" />
            <div>
              <h2 className="text-2xl font-bold">Tạo Đơn Nhanh</h2>
              <p className="text-orange-100 text-sm">
                {step === 1 ? "Bước 1: Chọn link" : "Bước 2: Nhập thông tin"}
              </p>
            </div>
          </div>
          <button
            onClick={handleClose}
            disabled={submitting}
            className="text-white hover:bg-white hover:bg-opacity-20 p-2 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
            title="Đóng (ESC)"
          >
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {step === 1 && (
            <div>
              {/* Search */}
              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  🔍 Tìm Affiliate Link
                </label>
                <div className="relative">
                  <Search
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                    size={20}
                  />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Tìm theo tên user, product, link code..."
                    className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-200 text-lg transition-all"
                    autoFocus
                  />
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  Nhập ít nhất 2 ký tự để tìm kiếm
                </p>
              </div>

              {/* Results */}
              {searching && (
                <div className="text-center py-8">
                  <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-orange-500 border-t-transparent"></div>
                  <p className="text-gray-500 mt-2">Đang tìm kiếm...</p>
                </div>
              )}

              {!searching && links.length === 0 && searchTerm.length >= 2 && (
                <div className="text-center py-8">
                  <Package className="mx-auto text-gray-300 mb-3" size={48} />
                  <p className="text-gray-500">Không tìm thấy link nào</p>
                </div>
              )}

              {!searching && links.length > 0 && (
                <div className="space-y-3">
                  <p className="text-sm font-semibold text-gray-600 mb-3">
                    Tìm thấy {links.length} link:
                  </p>
                  {links.map((link) => (
                    <div
                      key={link._id}
                      onClick={() => handleSelectLink(link)}
                      className="border-2 border-gray-200 rounded-xl p-4 hover:border-orange-500 hover:bg-orange-50 cursor-pointer transition group"
                    >
                      <div className="flex items-center gap-4">
                        {link.productImage && (
                          <img
                            src={link.productImage}
                            alt={link.productName}
                            className="w-16 h-16 rounded-lg object-cover border-2 border-gray-100"
                          />
                        )}
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-gray-900 truncate">
                            {link.productName || "Sản phẩm"}
                          </p>
                          <p className="text-sm text-gray-600">
                            👤 {link.userId.name} • 📧 {link.userId.email}
                          </p>
                          <div className="flex items-center gap-3 mt-1">
                            <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
                              {link.platform}
                            </span>
                            {link.shortCode && (
                              <span className="text-xs text-gray-500">
                                Code: {link.shortCode}
                              </span>
                            )}
                            <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded font-semibold">
                              {link.cashbackRate || 5}% cashback
                            </span>
                          </div>
                        </div>
                        <ChevronRight
                          className="text-gray-400 group-hover:text-orange-500"
                          size={24}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {step === 2 && selectedLink && (
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Selected Link Info */}
              <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-4">
                <p className="text-xs font-semibold text-blue-800 mb-2">
                  ✅ Link đã chọn:
                </p>
                <div className="flex items-center gap-3">
                  {selectedLink.productImage && (
                    <img
                      src={selectedLink.productImage}
                      alt={selectedLink.productName}
                      className="w-12 h-12 rounded-lg object-cover"
                    />
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-900 text-sm">
                      {selectedLink.productName || "Sản phẩm"}
                    </p>
                    <p className="text-xs text-gray-600">
                      User: {selectedLink.userId.name} • Code:{" "}
                      {selectedLink.shortCode}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                  >
                    Đổi link
                  </button>
                </div>
              </div>

              {/* Order ID */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  📦 Mã Đơn Hàng Shopee *
                </label>
                <input
                  type="text"
                  value={formData.orderId}
                  onChange={(e) =>
                    setFormData({ ...formData, orderId: e.target.value })
                  }
                  placeholder="230223ABC123XYZ"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-200 transition-all"
                  required
                  minLength={5}
                />
              </div>

              {/* Order Amount */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  💵 Giá Trị Đơn Hàng (VNĐ) *
                </label>
                <input
                  type="number"
                  value={formData.orderAmount}
                  onChange={(e) =>
                    setFormData({ ...formData, orderAmount: e.target.value })
                  }
                  placeholder="500000"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-200 transition-all"
                  required
                  min="0"
                  step="1000"
                />
              </div>

              {/* Commission from Shopee */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  💰 Commission Admin Nhận Từ Shopee (VNĐ) *
                </label>
                <input
                  type="number"
                  value={formData.commissionFromShopee}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      commissionFromShopee: e.target.value,
                    })
                  }
                  placeholder="25000"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-200 transition-all"
                  required
                  min="0"
                  step="1000"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Số tiền thực tế Shopee đã trả cho bạn (admin)
                </p>
              </div>

              {/* Share Rate Slider */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  📊 % Trả Lại Cho User
                  <span className="ml-2 text-xs font-normal text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
                    Mặc định: {defaultCashbackRate}%
                  </span>
                </label>
                <div className="flex items-center gap-4">
                  <input
                    type="range"
                    min="50"
                    max="100"
                    value={formData.shareRate}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        shareRate: parseInt(e.target.value),
                      })
                    }
                    className="flex-1 h-3 bg-orange-200 rounded-full appearance-none cursor-pointer
                      [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-6 [&::-webkit-slider-thumb]:h-6 
                      [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-orange-600 
                      [&::-webkit-slider-thumb]:shadow-lg [&::-webkit-slider-thumb]:cursor-pointer
                      [&::-moz-range-thumb]:w-6 [&::-moz-range-thumb]:h-6 [&::-moz-range-thumb]:rounded-full 
                      [&::-moz-range-thumb]:bg-orange-600 [&::-moz-range-thumb]:border-0 [&::-moz-range-thumb]:shadow-lg"
                  />
                  <span className="text-2xl font-bold text-orange-600 min-w-[60px]">
                    {formData.shareRate}%
                  </span>
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  User sẽ nhận:{" "}
                  <strong className="text-green-600">
                    {formatCurrency(
                      (parseFloat(formData.commissionFromShopee || "0") *
                        formData.shareRate) /
                        100,
                    )}{" "}
                    VNĐ
                  </strong>
                </p>
              </div>

              {/* Order Date */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  📅 Ngày Mua Hàng
                </label>
                <input
                  type="date"
                  value={formData.orderDate}
                  onChange={(e) =>
                    setFormData({ ...formData, orderDate: e.target.value })
                  }
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-200 transition-all"
                />
              </div>

              {/* Summary */}
              <div className="bg-green-50 border-2 border-green-200 rounded-xl p-5">
                <h3 className="font-bold text-green-900 mb-3 flex items-center gap-2">
                  <span className="text-lg">📊</span> Tóm Tắt:
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Giá trị đơn:</span>
                    <strong className="text-gray-900">
                      {formatCurrency(parseFloat(formData.orderAmount || "0"))}{" "}
                      VNĐ
                    </strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Commission từ Shopee:</span>
                    <strong className="text-blue-700">
                      {formatCurrency(
                        parseFloat(formData.commissionFromShopee || "0"),
                      )}{" "}
                      VNĐ
                    </strong>
                  </div>
                  <div className="h-px bg-green-200 my-2"></div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">
                      User nhận ({formData.shareRate}%):
                    </span>
                    <strong className="text-green-700 text-lg">
                      {formatCurrency(
                        (parseFloat(formData.commissionFromShopee || "0") *
                          formData.shareRate) /
                          100,
                      )}{" "}
                      VNĐ
                    </strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Admin giữ lại:</span>
                    <strong className="text-purple-700">
                      {formatCurrency(
                        parseFloat(formData.commissionFromShopee || "0") -
                          (parseFloat(formData.commissionFromShopee || "0") *
                            formData.shareRate) /
                            100,
                      )}{" "}
                      VNĐ
                    </strong>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 font-semibold transition"
                >
                  ← Quay lại
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 px-6 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
                >
                  {submitting ? (
                    <span className="flex items-center justify-center gap-2">
                      <div className="w-5 h-5 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
                      Đang tạo...
                    </span>
                  ) : (
                    "✓ Tạo Đơn Hàng"
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
