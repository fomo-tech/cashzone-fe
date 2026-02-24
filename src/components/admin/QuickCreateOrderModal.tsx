import { useState, useEffect, useCallback } from "react";
import { Search, Zap, X, ChevronRight, Package } from "lucide-react";
import cashbackService from "@/services/cashbackService";
import { notification } from "@/utils/notification";
import CommonModal from "../common/Modal";

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
  const [searchMode, setSearchMode] = useState<"search" | "direct">("direct"); // Mặc định là nhập trực tiếp
  const [directInput, setDirectInput] = useState(""); // ID hoặc link
  const [searchTerm, setSearchTerm] = useState("");
  const [links, setLinks] = useState<AffiliateLink[]>([]);
  const [searching, setSearching] = useState(false);
  const [loadingDirect, setLoadingDirect] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    orderId: "",
    orderAmount: 0,
    cashbackRate: 0,
    notes: "",
  });

  // Auto-focus cleanup
  useEffect(() => {
    if (open) {
      // Reset to step 1 when modal opens
      setStep(1);
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

  // Fetch link từ ID hoặc link trực tiếp
  const handleFetchDirect = async () => {
    if (!directInput.trim()) {
      notification({
        message: "Vui lòng nhập ID hoặc link",
        type: "error",
      });
      return;
    }

    try {
      setLoadingDirect(true);

      // Trích xuất ID từ input (có thể là ID thuần hoặc URL)
      let linkId = directInput.trim();

      // Nếu là URL, extract ID từ shortCode hoặc path
      if (linkId.includes("http") || linkId.includes("/")) {
        // Ví dụ: https://domain.com/ABC123 -> ABC123
        const parts = linkId.split("/");
        linkId = parts[parts.length - 1];
      }

      // Tìm link bằng ID hoặc shortCode
      const response = await cashbackService.searchAffiliateLinks({
        search: linkId,
        limit: 1,
      });

      if (response.links && response.links.length > 0) {
        const link = response.links[0];
        setSelectedLink(link);
        // Set default cashback rate from link
        setFormData((prev) => ({
          ...prev,
          cashbackRate: link.cashbackRate || 5,
        }));
        setStep(2);
        notification({
          message: "Tìm thấy link!",
          type: "success",
        });
      } else {
        notification({
          message: "Không tìm thấy link với ID/link này",
          type: "error",
        });
      }
    } catch (error: any) {
      notification({
        message: error.response?.data?.message || "Lỗi khi tìm link",
        type: "error",
      });
    } finally {
      setLoadingDirect(false);
    }
  };

  const handleSelectLink = (link: AffiliateLink) => {
    setSelectedLink(link);
    // Set default cashback rate from link
    setFormData((prev) => ({
      ...prev,
      cashbackRate: link.cashbackRate || 5,
    }));
    setStep(2);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedLink) return;

    if (!formData.orderId || formData.orderAmount <= 0) {
      notification({
        message: "Vui lòng nhập đầy đủ thông tin đơn hàng",
        type: "error",
      });
      return;
    }

    try {
      setSubmitting(true);

      await cashbackService.adminCreateOrderForLink(selectedLink._id, {
        orderId: formData.orderId,
        orderAmount: formData.orderAmount,
        cashbackRate: formData.cashbackRate,
        productName: selectedLink.productName,
        productImage: selectedLink.productImage,
        notes: formData.notes || "Đơn hàng được tạo bởi admin (Tạo nhanh)",
      });

      notification({
        message: "Tạo đơn hoàn tiền thành công!",
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
    setSearchMode("direct");
    setDirectInput("");
    setSearchTerm("");
    setLinks([]);
    setFormData({
      orderId: "",
      orderAmount: 0,
      cashbackRate: 0,
      notes: "",
    });
    onClose();
  }, [submitting, onClose]);

  if (!open) return null;

  return (
    <CommonModal
      isOpen={open}
      onClose={handleClose}
      width="max-w-3xl"
      showCloseButton={false}
      className=""
      headerClassName=""
      bodyClassName="p-0"
    >
      {/* Custom Header */}
      <div className="bg-gradient-to-r from-orange-600 to-orange-500 text-white px-6 py-5 rounded-t-2xl">
        <div className="flex items-center justify-between">
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
      </div>

      {/* Content */}
      <div className="p-6">
        {step === 1 && (
          <div>
            {/* Mode Toggle */}
            <div className="flex gap-2 mb-6 p-1 bg-gray-100 rounded-xl">
              <button
                type="button"
                onClick={() => setSearchMode("direct")}
                className={`flex-1 py-2.5 px-4 rounded-lg font-medium text-sm transition-all ${
                  searchMode === "direct"
                    ? "bg-white text-orange-600 shadow-sm"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                Nhập ID/Link
              </button>
              <button
                type="button"
                onClick={() => setSearchMode("search")}
                className={`flex-1 py-2.5 px-4 rounded-lg font-medium text-sm transition-all ${
                  searchMode === "search"
                    ? "bg-white text-orange-600 shadow-sm"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                Tìm kiếm
              </button>
            </div>

            {/* Direct Input Mode */}
            {searchMode === "direct" && (
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Nhập ID hoặc Link Affiliate
                </label>
                <div className="space-y-3">
                  <input
                    type="text"
                    value={directInput}
                    onChange={(e) => setDirectInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !loadingDirect) {
                        handleFetchDirect();
                      }
                    }}
                    placeholder="Ví dụ: ABC123 hoặc https://domain.com/ABC123"
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl hover:border-gray-400 focus:border-gray-500 focus:outline-none text-lg transition-all"
                    autoFocus
                  />
                  <button
                    type="button"
                    onClick={handleFetchDirect}
                    disabled={loadingDirect || !directInput.trim()}
                    className="w-full py-3 bg-orange-600 text-white rounded-xl hover:bg-orange-700 font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-sm flex items-center justify-center gap-2"
                  >
                    {loadingDirect ? (
                      <>
                        <div className="w-5 h-5 border-3 border-white border-t-transparent rounded-full animate-spin"></div>
                        Đang tìm...
                      </>
                    ) : (
                      <>
                        <Search size={18} />
                        Tìm Link
                      </>
                    )}
                  </button>
                </div>
                <p className="text-xs text-gray-500 mt-3 bg-blue-50 border border-blue-100 rounded-lg p-3">
                  <strong>Hướng dẫn:</strong> Nhập ID shortCode (vd: ABC123)
                  hoặc paste toàn bộ URL affiliate link, sau đó nhấn Enter hoặc
                  nút "Tìm Link"
                </p>
              </div>
            )}

            {/* Search Mode */}
            {searchMode === "search" && (
              <div>
                {/* Search */}
                <div className="mb-6">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Tìm Affiliate Link
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
                      className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl hover:border-gray-400 focus:border-gray-500 focus:outline-none text-lg transition-all"
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
                              {link.userId.name} • {link.userId.email}
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
          </div>
        )}

        {step === 2 && selectedLink && (
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Thông tin Link */}
            <div className="bg-gradient-to-r from-orange-50 to-amber-50 rounded-xl p-4">
              <h3 className="font-semibold text-gray-800 mb-3">
                Thông tin Link
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-gray-600">Sản phẩm</p>
                  <p className="font-medium text-gray-800">
                    {selectedLink.productName || "N/A"}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-600">Platform</p>
                  <p className="font-medium text-gray-800">
                    {selectedLink.platform}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-600">Tỷ lệ hoàn tiền</p>
                  <p className="font-medium text-green-600">
                    {selectedLink.cashbackRate || 5}%
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-600">User</p>
                  <p className="font-medium text-gray-800">
                    {selectedLink.userId.name || "N/A"}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setStep(1)}
                className="mt-3 text-blue-600 hover:text-blue-800 text-sm font-medium"
              >
                ← Đổi link khác
              </button>
            </div>

            {/* Form nhập thông tin đơn hàng */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Mã đơn hàng <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.orderId}
                  onChange={(e) =>
                    setFormData({ ...formData, orderId: e.target.value })
                  }
                  placeholder="VD: 2401SHOP12345 (từ Shopee/Lazada...)"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg hover:border-gray-400 focus:border-gray-500 focus:outline-none"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Số tiền đơn hàng <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    value={formData.orderAmount || ""}
                    onChange={(e) => {
                      const value = e.target.value;
                      setFormData({
                        ...formData,
                        orderAmount: value === "" ? 0 : parseFloat(value),
                      });
                    }}
                    placeholder="Nhập số tiền"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg hover:border-gray-400 focus:border-gray-500 focus:outline-none"
                    required
                    min="0"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tỷ lệ hoàn tiền (%)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    max="100"
                    value={formData.cashbackRate}
                    onChange={(e) => {
                      const val = e.target.valueAsNumber;
                      if (!isNaN(val)) {
                        setFormData({
                          ...formData,
                          cashbackRate: val,
                        });
                      } else if (e.target.value === "") {
                        setFormData({
                          ...formData,
                          cashbackRate: 0,
                        });
                      }
                    }}
                    placeholder={(selectedLink.cashbackRate || 5).toString()}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg hover:border-gray-400 focus:border-gray-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Tính toán hoàn tiền */}
              {formData.orderAmount > 0 && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-700">
                      Số tiền hoàn lại:
                    </span>
                    <span className="text-xl font-bold text-green-600">
                      {(
                        (formData.orderAmount * formData.cashbackRate) /
                        100
                      ).toLocaleString()}
                      đ
                    </span>
                  </div>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Ghi chú
                </label>
                <textarea
                  value={formData.notes}
                  onChange={(e) =>
                    setFormData({ ...formData, notes: e.target.value })
                  }
                  placeholder="Ghi chú thêm về đơn hàng (không bắt buộc)"
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg hover:border-gray-400 focus:border-gray-500 focus:outline-none"
                />
              </div>
            </div>

            {/* Actions */}
            <div className="bg-gray-50 px-6 py-4 flex items-center justify-end gap-3 border-t -mx-6 -mb-6">
              <button
                type="button"
                onClick={handleClose}
                disabled={submitting}
                className="px-6 py-3 text-gray-700 hover:bg-gray-200 rounded-lg font-medium transition-colors disabled:opacity-50"
              >
                Hủy
              </button>
              <button
                type="submit"
                disabled={
                  submitting || !formData.orderId || formData.orderAmount <= 0
                }
                className="px-6 py-3 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-lg font-medium hover:from-orange-600 hover:to-amber-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {submitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Đang tạo...
                  </>
                ) : (
                  <>
                    <Zap size={18} />
                    Duyệt Đơn (Trạng thái: Đang xử lý)
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </CommonModal>
  );
}
