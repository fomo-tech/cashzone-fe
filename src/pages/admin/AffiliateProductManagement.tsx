import React, { useState, useEffect } from "react";
import {
  Plus,
  Edit,
  Trash2,
  Search,
  Filter,
  Package,
  Star,
  AlertCircle,
  CheckCircle,
} from "lucide-react";
import affiliateProductService from "@/services/affiliateProductService";
import type {
  AffiliateProduct,
  CreateAffiliateProductDto,
} from "@/services/affiliateProductService";
import cashbackService, { type Platform } from "@/services/cashbackService";
import { notification } from "@/utils/notification";
import CommonModal from "@/components/common/Modal";

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    minimumFractionDigits: 0,
  }).format(amount);
};

const AffiliateProductManagement: React.FC = () => {
  const [products, setProducts] = useState<AffiliateProduct[]>([]);
  const [platforms, setPlatforms] = useState<Platform[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterPriority, setFilterPriority] = useState<boolean | undefined>(
    undefined
  );
  const [filterActive, setFilterActive] = useState<boolean | undefined>(
    undefined
  );
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<AffiliateProduct | null>(
    null
  );
  const [formData, setFormData] = useState<CreateAffiliateProductDto>({
    productName: "",
    productUrl: "",
    affiliateUrl: "",
    imageUrl: "",
    price: 0,
    commissionRate: 0,
    platform: "",
    category: "",
    description: "",
    isPriority: false,
    isActive: true,
    priority: 0,
    shopName: "",
  });

  const loadProducts = React.useCallback(async () => {
    setLoading(true);
    try {
      const response = await affiliateProductService.getAll({
        page: currentPage,
        limit: 20,
        search: searchQuery || undefined,
        isPriority: filterPriority,
        isActive: filterActive,
      });
      // Backend: { statusCode, message, data: { products, pagination } }
      const productsData = response.data?.products || [];
      const paginationData = response.data?.pagination || {};
      setProducts(Array.isArray(productsData) ? productsData : []);
      setTotalPages(paginationData.totalPages || 1);
    } catch (err) {
      console.error("Error loading products:", err);
      notification({
        type: "error",
        message: "Không thể tải danh sách sản phẩm",
      });
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, [currentPage, searchQuery, filterPriority, filterActive]);

  useEffect(() => {
    loadProducts();
    loadPlatforms();
  }, [loadProducts]);

  const loadPlatforms = async () => {
    try {
      const data = await cashbackService.getPlatforms();
      setPlatforms(data);
    } catch (err) {
      console.error("Error loading platforms:", err);
    }
  };

  const handleCreate = () => {
    setEditingProduct(null);
    setFormData({
      productName: "",
      productUrl: "",
      affiliateUrl: "",
      imageUrl: "",
      price: 0,
      commissionRate: 0,
      platform: "",
      category: "",
      description: "",
      isPriority: false,
      isActive: true,
      priority: 0,
      shopName: "",
    });
    setIsModalOpen(true);
  };

  const handleEdit = (product: AffiliateProduct) => {
    setEditingProduct(product);
    setFormData({
      productName: product.productName,
      productUrl: product.productUrl,
      affiliateUrl: product.affiliateUrl,
      imageUrl: product.imageUrl,
      price: product.price,
      commissionRate: product.commissionRate,
      platform: product.platform._id,
      category: product.category || "",
      description: product.description || "",
      isPriority: product.isPriority,
      isActive: product.isActive,
      priority: product.priority,
      shopName: product.shopName || "",
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (editingProduct) {
        await affiliateProductService.update(editingProduct._id, formData);
        notification({
          type: "success",
          message: "Cập nhật sản phẩm thành công!",
        });
      } else {
        await affiliateProductService.create(formData);
        notification({ type: "success", message: "Thêm sản phẩm thành công!" });
      }
      setIsModalOpen(false);
      loadProducts();
    } catch (error: any) {
      notification({
        type: "error",
        message: error.response?.data?.message || "Có lỗi xảy ra",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Bạn có chắc chắn muốn xóa sản phẩm này?")) return;

    setLoading(true);
    try {
      await affiliateProductService.delete(id);
      notification({ type: "success", message: "Xóa sản phẩm thành công!" });
      loadProducts();
    } catch (err) {
      console.error("Error deleting product:", err);
      notification({ type: "error", message: "Không thể xóa sản phẩm" });
    } finally {
      setLoading(false);
    }
  };

  const handleToggleActive = async (product: AffiliateProduct) => {
    setLoading(true);
    try {
      await affiliateProductService.toggleActive(product._id);
      notification({
        type: "success",
        message: `Đã ${product.isActive ? "ẩn" : "hiện"} sản phẩm`,
      });
      loadProducts();
    } catch (err) {
      console.error("Error toggling status:", err);
      notification({ type: "error", message: "Không thể thay đổi trạng thái" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-orange-50/30">
      {/* Header Section */}
      <div className="bg-gradient-to-br from-orange-500 via-orange-600 to-amber-600 shadow-lg">
        <div className="max-w-7xl mx-auto py-6 px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white flex items-center gap-3">
                <Package className="w-8 h-8" />
                Quản lý Sản phẩm Affiliate
              </h1>
              <p className="text-white/90 text-sm mt-2">
                Quản lý sản phẩm ưu tiên hiển thị trên trang chủ và hoàn tiền
              </p>
            </div>
            <button
              onClick={handleCreate}
              className="inline-flex items-center gap-2 px-5 py-3 text-base font-semibold rounded-xl text-white bg-white/10 hover:bg-white/20 border border-white/30 backdrop-blur-sm transition duration-300 cursor-pointer shadow-lg"
            >
              <Plus className="w-5 h-5" />
              Thêm sản phẩm
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6 lg:p-4 space-y-6">
        {/* Filters */}
        <div className="bg-white rounded-xl shadow-md p-4 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                size={20}
              />
              <input
                type="text"
                placeholder="Tìm kiếm sản phẩm..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
              />
            </div>
            <select
              value={
                filterPriority === undefined ? "" : filterPriority.toString()
              }
              onChange={(e) =>
                setFilterPriority(
                  e.target.value === "" ? undefined : e.target.value === "true"
                )
              }
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500"
            >
              <option value="">Tất cả (Ưu tiên)</option>
              <option value="true">Ưu tiên</option>
              <option value="false">Không ưu tiên</option>
            </select>
            <select
              value={filterActive === undefined ? "" : filterActive.toString()}
              onChange={(e) =>
                setFilterActive(
                  e.target.value === "" ? undefined : e.target.value === "true"
                )
              }
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500"
            >
              <option value="">Tất cả (Trạng thái)</option>
              <option value="true">Đang hiển thị</option>
              <option value="false">Đã ẩn</option>
            </select>
            <button
              onClick={loadProducts}
              className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg font-semibold transition"
            >
              <Filter size={20} className="inline mr-2" />
              Lọc
            </button>
          </div>
        </div>

        {/* Products Table */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-orange-500 to-amber-500 text-white">
                <tr>
                  <th className="px-4 py-4 text-left font-bold">Sản phẩm</th>
                  <th className="px-4 py-4 text-left font-bold">Nền tảng</th>
                  <th className="px-4 py-4 text-right font-bold">Giá</th>
                  <th className="px-4 py-4 text-right font-bold">Hoa hồng</th>
                  <th className="px-4 py-4 text-center font-bold">Ưu tiên</th>
                  <th className="px-4 py-4 text-center font-bold">
                    Trạng thái
                  </th>
                  <th className="px-4 py-4 text-center font-bold">Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={7} className="px-4 py-12 text-center">
                      <div className="flex items-center justify-center gap-3">
                        <div className="w-6 h-6 border-3 border-pink-600 border-t-transparent rounded-full animate-spin"></div>
                        <span className="text-gray-600 font-medium">
                          Đang tải...
                        </span>
                      </div>
                    </td>
                  </tr>
                ) : products.length === 0 ? (
                  <tr>
                    <td
                      colSpan={7}
                      className="px-4 py-12 text-center text-gray-500"
                    >
                      <Package
                        size={48}
                        className="mx-auto mb-3 text-gray-300"
                      />
                      <p className="font-medium">Chưa có sản phẩm nào</p>
                    </td>
                  </tr>
                ) : (
                  products.map((product) => (
                    <tr
                      key={product._id}
                      className="border-b hover:bg-gray-50 transition"
                    >
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={product.imageUrl}
                            alt={product.productName}
                            className="w-16 h-16 object-cover rounded-lg shadow"
                          />
                          <div>
                            <div className="font-bold text-gray-900">
                              {product.productName}
                            </div>
                            <div className="text-sm text-gray-500">
                              {product.shopName}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-2">
                          <img
                            src={product.platform.logo}
                            alt={product.platform.name}
                            className="w-6 h-6 object-contain"
                          />
                          <span className="font-semibold">
                            {product.platform.name}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-4 text-right font-bold text-gray-900">
                        {formatCurrency(product.price)}
                      </td>
                      <td className="px-4 py-4 text-right">
                        <div className="font-bold text-pink-600">
                          {product.commissionRate}%
                        </div>
                        <div className="text-sm text-gray-500">
                          {formatCurrency(product.estimatedCashback || 0)}
                        </div>
                      </td>
                      <td className="px-4 py-4 text-center">
                        {product.isPriority ? (
                          <span className="inline-flex items-center gap-1 px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm font-bold">
                            <Star size={14} className="fill-current" />
                            Ưu tiên {product.priority}
                          </span>
                        ) : (
                          <span className="text-gray-400 text-sm">-</span>
                        )}
                      </td>
                      <td className="px-4 py-4 text-center">
                        <button
                          onClick={() => handleToggleActive(product)}
                          className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-bold transition ${
                            product.isActive
                              ? "bg-green-100 text-green-800 hover:bg-green-200"
                              : "bg-red-100 text-red-800 hover:bg-red-200"
                          }`}
                        >
                          {product.isActive ? (
                            <>
                              <CheckCircle size={14} />
                              Hiển thị
                            </>
                          ) : (
                            <>
                              <AlertCircle size={14} />
                              Ẩn
                            </>
                          )}
                        </button>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => handleEdit(product)}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                            title="Sửa"
                          >
                            <Edit size={18} />
                          </button>
                          <button
                            onClick={() => handleDelete(product._id)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                            title="Xóa"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 p-4 border-t">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 bg-gray-100 rounded-lg font-semibold disabled:opacity-50"
              >
                Trước
              </button>
              <span className="px-4 py-2 font-semibold">
                Trang {currentPage} / {totalPages}
              </span>
              <button
                onClick={() =>
                  setCurrentPage((p) => Math.min(totalPages, p + 1))
                }
                disabled={currentPage === totalPages}
                className="px-4 py-2 bg-gray-100 rounded-lg font-semibold disabled:opacity-50"
              >
                Sau
              </button>
            </div>
          )}
        </div>

        {/* Modal Form */}
        <CommonModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title={editingProduct ? "Sửa sản phẩm" : "Thêm sản phẩm mới"}
        >
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">
                Tên sản phẩm <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.productName}
                onChange={(e) =>
                  setFormData({ ...formData, productName: e.target.value })
                }
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-pink-500"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">
                  Tên shop
                </label>
                <input
                  type="text"
                  value={formData.shopName}
                  onChange={(e) =>
                    setFormData({ ...formData, shopName: e.target.value })
                  }
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-pink-500"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">
                  Danh mục
                </label>
                <input
                  type="text"
                  value={formData.category}
                  onChange={(e) =>
                    setFormData({ ...formData, category: e.target.value })
                  }
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-pink-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">
                Nền tảng <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.platform}
                onChange={(e) =>
                  setFormData({ ...formData, platform: e.target.value })
                }
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-pink-500"
                required
              >
                <option value="">-- Chọn nền tảng --</option>
                {platforms?.map((platform) => (
                  <option key={platform._id} value={platform._id}>
                    {platform.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">
                Link sản phẩm gốc <span className="text-red-500">*</span>
              </label>
              <input
                type="url"
                value={formData.productUrl}
                onChange={(e) =>
                  setFormData({ ...formData, productUrl: e.target.value })
                }
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-pink-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">
                Link affiliate
              </label>
              <input
                type="url"
                value={formData.affiliateUrl}
                onChange={(e) =>
                  setFormData({ ...formData, affiliateUrl: e.target.value })
                }
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-pink-500"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">
                Link hình ảnh <span className="text-red-500">*</span>
              </label>
              <input
                type="url"
                value={formData.imageUrl}
                onChange={(e) =>
                  setFormData({ ...formData, imageUrl: e.target.value })
                }
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-pink-500"
                required
              />
              {formData.imageUrl && (
                <img
                  src={formData.imageUrl}
                  alt="Preview"
                  className="mt-2 w-24 h-24 object-cover rounded-lg"
                />
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">
                  Giá (VNĐ) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  value={formData.price}
                  onChange={(e) =>
                    setFormData({ ...formData, price: Number(e.target.value) })
                  }
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-pink-500"
                  required
                  min="0"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">
                  Hoa hồng (%) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  value={formData.commissionRate}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      commissionRate: Number(e.target.value),
                    })
                  }
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-pink-500"
                  required
                  min="0"
                  max="100"
                  step="0.1"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">
                Mô tả
              </label>
              <textarea
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-pink-500"
                rows={3}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="isPriority"
                  checked={formData.isPriority}
                  onChange={(e) =>
                    setFormData({ ...formData, isPriority: e.target.checked })
                  }
                  className="w-5 h-5 text-pink-600 rounded focus:ring-pink-500"
                />
                <label
                  htmlFor="isPriority"
                  className="text-sm font-bold text-gray-700"
                >
                  Ưu tiên hiển thị
                </label>
              </div>
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="isActive"
                  checked={formData.isActive}
                  onChange={(e) =>
                    setFormData({ ...formData, isActive: e.target.checked })
                  }
                  className="w-5 h-5 text-pink-600 rounded focus:ring-pink-500"
                />
                <label
                  htmlFor="isActive"
                  className="text-sm font-bold text-gray-700"
                >
                  Kích hoạt
                </label>
              </div>
            </div>

            {formData.isPriority && (
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">
                  Mức độ ưu tiên (số càng nhỏ càng ưu tiên)
                </label>
                <input
                  type="number"
                  value={formData.priority}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      priority: Number(e.target.value),
                    })
                  }
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-pink-500"
                  min="0"
                />
              </div>
            )}

            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="flex-1 px-6 py-3 border border-gray-300 rounded-lg font-bold hover:bg-gray-50 transition"
              >
                Hủy
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-lg font-bold hover:from-orange-600 hover:to-amber-600 transition disabled:opacity-50"
              >
                {loading
                  ? "Đang xử lý..."
                  : editingProduct
                  ? "Cập nhật"
                  : "Thêm mới"}
              </button>
            </div>
          </form>
        </CommonModal>
      </div>
    </div>
  );
};

export default AffiliateProductManagement;
