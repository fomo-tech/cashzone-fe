import React, { useState, useEffect, useCallback } from "react";
import { Star, ExternalLink, TrendingUp, Sparkles } from "lucide-react";
import affiliateProductService from "@/services/affiliateProductService";
import type { AffiliateProduct } from "@/services/affiliateProductService";

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    minimumFractionDigits: 0,
  }).format(amount);
};

interface PriorityProductsProps {
  limit?: number;
  platform?: string;
  onProductClick?: (product: AffiliateProduct) => void;
}

const PriorityProducts: React.FC<PriorityProductsProps> = ({
  limit = 6,
  platform,
  onProductClick,
}) => {
  const [products, setProducts] = useState<AffiliateProduct[]>([]);
  const [loading, setLoading] = useState(true);

  const loadPriorityProducts = useCallback(async () => {
    setLoading(true);
    try {
      const response = await affiliateProductService.getPriorityProducts({
        limit,
        platform,
      });
      // Backend trả về { statusCode, message, data: { products, total } }
      const productsData = response.data?.products || response.products || [];
      setProducts(Array.isArray(productsData) ? productsData : []);
    } catch (error) {
      console.error("Error loading priority products:", error);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, [limit, platform]);

  useEffect(() => {
    loadPriorityProducts();
  }, [loadPriorityProducts]);

  const handleProductClick = (product: AffiliateProduct) => {
    if (onProductClick) {
      onProductClick(product);
    } else {
      // Default behavior: open affiliate link
      window.open(product.affiliateUrl || product.productUrl, "_blank");
    }
  };

  if (loading) {
    return (
      <div className="py-8">
        <div className="flex items-center justify-center gap-3">
          <div className="w-6 h-6 border-3 border-pink-600 border-t-transparent rounded-full animate-spin"></div>
          <span className="text-gray-600 font-medium">
            Đang tải sản phẩm ưu đãi...
          </span>
        </div>
      </div>
    );
  }

  if (products.length === 0) {
    return null;
  }

  return (
    <div className="w-full">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-pink-600 to-orange-500 flex items-center justify-center">
            <Sparkles className="text-white" size={20} />
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-gray-900">
            Sản phẩm ưu đãi hot
          </h2>
        </div>
        <p className="text-base sm:text-lg text-gray-600 font-medium">
          Các sản phẩm được chọn lọc với tỷ lệ hoàn tiền cao nhất
        </p>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        {products.map((product, index) => (
          <div
            key={product._id}
            className="group relative bg-white rounded-xl md:rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden cursor-pointer transform hover:-translate-y-1"
            onClick={() => handleProductClick(product)}
          >
            {/* Priority Badge */}
            {product.isPriority && (
              <div className="absolute top-3 left-3 z-10">
                <div className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-yellow-400 to-orange-400 text-white rounded-full shadow-lg">
                  <Star size={14} className="fill-current" />
                  <span className="text-xs font-extrabold">
                    HOT #{index + 1}
                  </span>
                </div>
              </div>
            )}

            {/* Platform Badge */}
            <div className="absolute top-3 right-3 z-10">
              <div className="w-8 h-8 bg-white rounded-full shadow-lg flex items-center justify-center">
                <img
                  src={product.platform.logo}
                  alt={product.platform.name}
                  className="w-5 h-5 object-contain"
                />
              </div>
            </div>

            {/* Product Image */}
            <div className="relative h-48 sm:h-56 overflow-hidden bg-gray-100">
              <img
                src={product.imageUrl}
                alt={product.productName}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </div>

            {/* Product Info */}
            <div className="p-4">
              <h3 className="font-bold text-base md:text-lg text-gray-900 mb-2 line-clamp-2 group-hover:text-pink-600 transition">
                {product.productName}
              </h3>

              {product.shopName && (
                <p className="text-sm text-gray-500 mb-3 font-medium">
                  {product.shopName}
                </p>
              )}

              <div className="flex items-center justify-between mb-3">
                <div>
                  <div className="text-xs text-gray-500 mb-1">Giá sản phẩm</div>
                  <div className="text-xl font-black text-gray-900">
                    {formatCurrency(product.price)}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xs text-gray-500 mb-1">Hoàn tiền</div>
                  <div className="text-lg font-black text-pink-600">
                    {product.commissionRate}%
                  </div>
                </div>
              </div>

              {/* Estimated Cashback */}
              <div className="p-3 bg-gradient-to-r from-pink-50 to-orange-50 rounded-xl mb-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-gray-700">
                    Nhận về
                  </span>
                  <div className="flex items-center gap-1">
                    <TrendingUp size={16} className="text-green-600" />
                    <span className="text-lg font-black text-green-600">
                      {formatCurrency(product.estimatedCashback || 0)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleProductClick(product);
                }}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-pink-600 to-orange-500 text-white rounded-xl font-extrabold text-sm hover:from-pink-700 hover:to-orange-600 transition shadow-lg group-hover:shadow-xl"
              >
                Tạo link ngay
                <ExternalLink size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PriorityProducts;
