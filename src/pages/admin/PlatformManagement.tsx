import { useEffect, useState } from "react";
import {
  Globe,
  Plus,
  Edit,
  Trash2,
  X,
  Search,
  ExternalLink,
} from "lucide-react";
import http from "@/services/api";
import ConfirmModal from "@/components/modals/ConfirmModal";
import { notification } from "@/utils/notification";

interface Platform {
  _id: string;
  name: string;
  logo?: string;
  type: string;
  website?: string;
  description?: string;
  trackingMode: "deeplink" | "redirect" | "refLinkOnly";
  refLink?: string;
  apiConfig?: {
    baseUrl?: string;
    apiKey?: string;
    apiSecret?: string;
    deeplinkEndpoint?: string;
  };
  commissionType?: "percentage" | "fixed";
  commissionValue?: number;
  status: "active" | "inactive";
  createdAt: string;
  updatedAt: string;
}

interface PlatformForm {
  name: string;
  logo: string;
  type: string;
  website: string;
  description: string;
  trackingMode: "deeplink" | "redirect" | "refLinkOnly";
  refLink: string;
  apiConfig: {
    baseUrl: string;
    apiKey: string;
    apiSecret: string;
    deeplinkEndpoint: string;
  };
  commissionType: "percentage" | "fixed";
  commissionValue: number;
  status: "active" | "inactive";
}

export default function PlatformManagement() {
  const [platforms, setPlatforms] = useState<Platform[]>([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState<"create" | "edit">("create");
  const [editingPlatform, setEditingPlatform] = useState<Platform | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState("");
  const [filterStatus, setFilterStatus] = useState("");

  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
  }>({
    isOpen: false,
    title: "",
    message: "",
    onConfirm: () => {},
  });

  const [formData, setFormData] = useState<PlatformForm>({
    name: "",
    logo: "",
    type: "ecommerce",
    website: "",
    description: "",
    trackingMode: "deeplink",
    refLink: "",
    apiConfig: {
      baseUrl: "",
      apiKey: "",
      apiSecret: "",
      deeplinkEndpoint: "",
    },
    commissionType: "percentage",
    commissionValue: 0,
    status: "active",
  });

  useEffect(() => {
    loadPlatforms();
  }, [filterType, filterStatus]);

  const loadPlatforms = async () => {
    setLoading(true);
    try {
      const params: any = {};
      if (filterType) params.type = filterType;
      if (filterStatus) params.status = filterStatus;

      const response = await http.get("/platforms", { params });
      console.log("Platforms response:", response.data);

      // Handle response structure: response.data could be array or { data: array }
      const platformsList = Array.isArray(response.data)
        ? response.data
        : response.data?.data || [];

      setPlatforms(platformsList);
    } catch (error) {
      console.error("Failed to load platforms:", error);
      notification({
        message: "Lỗi khi tải danh sách platform",
        type: "error",
      });
      setPlatforms([]);
    } finally {
      setLoading(false);
    }
  };

  const handleCreatePlatform = () => {
    setModalMode("create");
    setFormData({
      name: "",
      logo: "",
      type: "ecommerce",
      website: "",
      description: "",
      trackingMode: "deeplink",
      refLink: "",
      apiConfig: {
        baseUrl: "",
        apiKey: "",
        apiSecret: "",
        deeplinkEndpoint: "",
      },
      commissionType: "percentage",
      commissionValue: 0,
      status: "active",
    });
    setShowModal(true);
  };

  const handleEditPlatform = (platform: Platform) => {
    setModalMode("edit");
    setEditingPlatform(platform);
    setFormData({
      name: platform.name,
      logo: platform.logo || "",
      type: platform.type,
      website: platform.website || "",
      description: platform.description || "",
      trackingMode: platform.trackingMode,
      refLink: platform.refLink || "",
      apiConfig: {
        baseUrl: platform.apiConfig?.baseUrl || "",
        apiKey: platform.apiConfig?.apiKey || "",
        apiSecret: platform.apiConfig?.apiSecret || "",
        deeplinkEndpoint: platform.apiConfig?.deeplinkEndpoint || "",
      },
      commissionType: platform.commissionType || "percentage",
      commissionValue: platform.commissionValue || 0,
      status: platform.status,
    });
    setShowModal(true);
  };

  const handleDeletePlatform = async (id: string) => {
    setConfirmModal({
      isOpen: true,
      title: "Xóa Platform",
      message:
        "Bạn có chắc muốn xóa platform này? Tất cả offers và links liên quan sẽ ảnh hưởng.",
      onConfirm: async () => {
        console.log("Deleting platform:", id);
        try {
          const response = await http.delete(`/platforms/${id}`);
          console.log("Delete response:", response);
          await loadPlatforms();
          notification({
            message: "Xóa platform thành công!",
            type: "success",
          });
        } catch (error: any) {
          console.error("Delete error:", error);
          console.error("Error response:", error.response);
          const errorMsg =
            error.response?.data?.message ||
            error.message ||
            "Lỗi khi xóa platform";
          notification({
            message: "Không thể xóa platform",
            description: errorMsg,
            type: "error",
          });
        }
      },
    });
  };

  const handleSubmitForm = async (e: React.FormEvent) => {
    e.preventDefault();

    console.log("Submitting platform:", formData);

    try {
      let response;
      if (modalMode === "create") {
        console.log("Creating new platform...");
        response = await http.post("/platforms", formData);
      } else {
        console.log("Updating platform:", editingPlatform?._id);
        response = await http.patch(
          `/platforms/${editingPlatform?._id}`,
          formData,
        );
      }

      console.log("Response:", response);

      await loadPlatforms();
      setShowModal(false);
      notification({
        message:
          modalMode === "create"
            ? "Thêm platform thành công!"
            : "Cập nhật platform thành công!",
        type: "success",
      });
    } catch (error: any) {
      console.error("Submit error:", error);
      console.error("Error response:", error.response);
      const errorMsg =
        error.response?.data?.message || error.message || "Có lỗi xảy ra";
      notification({
        message: "Không thể lưu platform",
        description: errorMsg,
        type: "error",
      });
    }
  };

  const filteredPlatforms = platforms.filter((platform) => {
    const matchSearch =
      platform.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      platform.type.toLowerCase().includes(searchQuery.toLowerCase());
    return matchSearch;
  });

  const platformTypes = [
    { value: "ecommerce", label: "E-commerce" },
    { value: "crypto", label: "Crypto" },
    { value: "finance", label: "Finance" },
    { value: "ads", label: "Ads" },
    { value: "service", label: "Service" },
    { value: "other", label: "Other" },
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
            <Globe className="text-pink-600" size={32} />
            Quản lý Platform
          </h1>
          <p className="text-gray-600 mt-2">
            Quản lý các nền tảng affiliate và cấu hình tracking
          </p>
        </div>

        {/* Filters & Actions */}
        <div className="bg-white rounded-xl p-6 shadow-md mb-6">
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div className="flex items-center gap-4 flex-1">
              <div className="relative flex-1 max-w-md">
                <Search
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  size={20}
                />
                <input
                  type="text"
                  placeholder="Tìm kiếm platform..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                />
              </div>

              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
              >
                <option value="">Tất cả loại</option>
                {platformTypes.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>

              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
              >
                <option value="">Tất cả trạng thái</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>

            <button
              onClick={handleCreatePlatform}
              className="px-4 py-2 bg-gradient-to-r from-pink-500 to-orange-500 text-white rounded-lg hover:from-pink-600 hover:to-orange-600 flex items-center gap-2 whitespace-nowrap"
            >
              <Plus size={20} />
              Thêm Platform
            </button>
          </div>
        </div>

        {/* Platforms Grid */}
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block w-8 h-8 border-4 border-pink-500 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-gray-500 mt-4">Đang tải...</p>
          </div>
        ) : filteredPlatforms.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-xl">
            <Globe className="mx-auto text-gray-400" size={64} />
            <p className="text-gray-500 mt-4">Không có platform nào</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPlatforms.map((platform) => (
              <div
                key={platform._id}
                className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow"
              >
                <div className="p-6">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3 flex-1">
                      {platform.logo ? (
                        <img
                          src={platform.logo}
                          alt={platform.name}
                          className="w-12 h-12 rounded-lg object-cover"
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-pink-500 to-orange-500 flex items-center justify-center text-white font-bold text-xl">
                          {platform.name.charAt(0)}
                        </div>
                      )}
                      <div className="flex-1">
                        <h3 className="font-bold text-gray-800 text-lg">
                          {platform.name}
                        </h3>
                        <p className="text-xs text-gray-500">{platform.type}</p>
                      </div>
                    </div>
                    <span
                      className={`px-2 py-1 text-xs rounded-full font-bold ${
                        platform.status === "active"
                          ? "bg-green-100 text-green-700"
                          : "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {platform.status}
                    </span>
                  </div>

                  {/* Description */}
                  {platform.description && (
                    <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                      {platform.description}
                    </p>
                  )}

                  {/* Details */}
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500">Tracking:</span>
                      <span className="font-bold text-gray-700">
                        {platform.trackingMode}
                      </span>
                    </div>
                    {platform.commissionValue && (
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-500">Commission:</span>
                        <span className="font-bold text-green-600">
                          {platform.commissionType === "percentage"
                            ? `${platform.commissionValue}%`
                            : `${platform.commissionValue.toLocaleString()} VND`}
                        </span>
                      </div>
                    )}
                    {platform.website && (
                      <a
                        href={platform.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700"
                      >
                        <ExternalLink size={14} />
                        Website
                      </a>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 pt-4 border-t">
                    <button
                      onClick={() => handleEditPlatform(platform)}
                      className="flex-1 px-3 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 flex items-center justify-center gap-2"
                    >
                      <Edit size={16} />
                      Sửa
                    </button>
                    <button
                      onClick={() => handleDeletePlatform(platform._id)}
                      className="flex-1 px-3 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 flex items-center justify-center gap-2"
                    >
                      <Trash2 size={16} />
                      Xóa
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Modal for Create/Edit Platform */}
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
              <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-800">
                  {modalMode === "create"
                    ? "Thêm Platform mới"
                    : "Chỉnh sửa Platform"}
                </h2>
                <button
                  onClick={() => setShowModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg"
                >
                  <X size={24} />
                </button>
              </div>

              <form onSubmit={handleSubmitForm} className="p-6 space-y-6">
                {/* Basic Info */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-lg text-gray-800">
                    Thông tin cơ bản
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">
                        Tên Platform <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) =>
                          setFormData({ ...formData, name: e.target.value })
                        }
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                        placeholder="Shopee, Tiki, Lazada..."
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">
                        Loại <span className="text-red-500">*</span>
                      </label>
                      <select
                        required
                        value={formData.type}
                        onChange={(e) =>
                          setFormData({ ...formData, type: e.target.value })
                        }
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                      >
                        {platformTypes.map((type) => (
                          <option key={type.value} value={type.value}>
                            {type.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">
                        Logo URL
                      </label>
                      <input
                        type="text"
                        value={formData.logo}
                        onChange={(e) =>
                          setFormData({ ...formData, logo: e.target.value })
                        }
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                        placeholder="https://..."
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">
                        Website
                      </label>
                      <input
                        type="text"
                        value={formData.website}
                        onChange={(e) =>
                          setFormData({ ...formData, website: e.target.value })
                        }
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                        placeholder="https://..."
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                      Mô tả
                    </label>
                    <textarea
                      value={formData.description}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          description: e.target.value,
                        })
                      }
                      rows={3}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                      placeholder="Mô tả về platform..."
                    />
                  </div>
                </div>

                {/* Tracking Config */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-lg text-gray-800">
                    Cấu hình Tracking
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">
                        Tracking Mode <span className="text-red-500">*</span>
                      </label>
                      <select
                        required
                        value={formData.trackingMode}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            trackingMode: e.target.value as any,
                          })
                        }
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                      >
                        <option value="deeplink">Deeplink</option>
                        <option value="redirect">Redirect</option>
                        <option value="refLinkOnly">Ref Link Only</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">
                        Trạng thái <span className="text-red-500">*</span>
                      </label>
                      <select
                        required
                        value={formData.status}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            status: e.target.value as any,
                          })
                        }
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                      >
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                      Ref Link (cho refLinkOnly mode)
                    </label>
                    <input
                      type="text"
                      value={formData.refLink}
                      onChange={(e) =>
                        setFormData({ ...formData, refLink: e.target.value })
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                      placeholder="https://..."
                    />
                  </div>
                </div>

                {/* Commission Config */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-lg text-gray-800">
                    Cấu hình Commission
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">
                        Loại Commission
                      </label>
                      <select
                        value={formData.commissionType}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            commissionType: e.target.value as any,
                          })
                        }
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                      >
                        <option value="percentage">Percentage (%)</option>
                        <option value="fixed">Fixed (VND)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">
                        Giá trị Commission
                      </label>
                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        value={formData.commissionValue}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            commissionValue: Number(e.target.value),
                          })
                        }
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                        placeholder="0"
                      />
                    </div>
                  </div>
                </div>

                {/* API Config */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-lg text-gray-800">
                    Cấu hình API (Tùy chọn)
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">
                        Base URL
                      </label>
                      <input
                        type="text"
                        value={formData.apiConfig.baseUrl}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            apiConfig: {
                              ...formData.apiConfig,
                              baseUrl: e.target.value,
                            },
                          })
                        }
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                        placeholder="https://api.platform.com"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">
                        Deeplink Endpoint
                      </label>
                      <input
                        type="text"
                        value={formData.apiConfig.deeplinkEndpoint}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            apiConfig: {
                              ...formData.apiConfig,
                              deeplinkEndpoint: e.target.value,
                            },
                          })
                        }
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                        placeholder="/deeplink"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">
                        API Key
                      </label>
                      <input
                        type="text"
                        value={formData.apiConfig.apiKey}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            apiConfig: {
                              ...formData.apiConfig,
                              apiKey: e.target.value,
                            },
                          })
                        }
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                        placeholder="API Key"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">
                        API Secret
                      </label>
                      <input
                        type="password"
                        value={formData.apiConfig.apiSecret}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            apiConfig: {
                              ...formData.apiConfig,
                              apiSecret: e.target.value,
                            },
                          })
                        }
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                        placeholder="API Secret"
                      />
                    </div>
                  </div>
                </div>

                {/* Form Actions */}
                <div className="flex gap-3 pt-4 border-t">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                  >
                    Hủy
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-6 py-3 bg-gradient-to-r from-pink-500 to-orange-500 text-white rounded-lg hover:from-pink-600 hover:to-orange-600"
                  >
                    {modalMode === "create" ? "Thêm Platform" : "Cập nhật"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>

      {/* Confirm Modal */}
      <ConfirmModal
        isOpen={confirmModal.isOpen}
        onClose={() => setConfirmModal({ ...confirmModal, isOpen: false })}
        onConfirm={confirmModal.onConfirm}
        title={confirmModal.title}
        message={confirmModal.message}
        type="danger"
        confirmText="Xóa"
        cancelText="Hủy"
      />
    </div>
  );
}
