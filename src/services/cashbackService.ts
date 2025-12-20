import http from "./api";

export interface Platform {
  _id: string;
  name: string;
  logo?: string;
  type: string; // ecommerce, crypto, finance, ads...
  website?: string;
  description?: string;
  trackingMode: "deeplink" | "redirect" | "refLinkOnly";
  refLink?: string;
  commissionType?: "percentage" | "fixed";
  commissionValue?: number;
  status: "active" | "inactive";
  createdAt: string;
  updatedAt: string;
}

export interface Offer {
  _id: string;
  flatformId: {
    _id: string;
    name: string;
    logo?: string;
    type: string;
  };
  title: string;
  description?: string;
  type: string;
  affLink?: string;
  image?: string;
  price?: number;
  discount?: number;
  cashbackRate?: number;
  rewardUser: number;
  rewardSystem: number;
  category?: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export interface CashbackTransaction {
  _id: string;
  userId: {
    _id: string;
    name: string;
    email: string;
    phone?: string;
  };
  offerId: {
    _id: string;
    title: string;
    description?: string;
  };
  flatformId: {
    _id: string;
    name: string;
    logo?: string;
  };
  advertiserOrderId?: string;
  clickId?: string;
  trackingUrl?: string;
  purchaseAmount: number;
  cashbackAmount: number;
  percentage: number;
  networkStatus?: string;
  estimatePayoutDate?: string;
  status: "pending" | "completed" | "rejected";
  rawData?: any;
  createdAt: string;
  updatedAt: string;
}

export interface CashbackStatistics {
  totalCashback: number;
  pendingCashback: number;
  completedCashback: number;
  rejectedCashback: number;
  totalAmount: number;
  pendingAmount: number;
  completedAmount: number;
  rejectedAmount: number;
}

export interface CashbackListResponse {
  data: CashbackTransaction[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface CreateCashbackData {
  userId: string;
  offerId: string;
  flatformId: string;
  advertiserOrderId?: string;
  clickId?: string;
  trackingUrl?: string;
  purchaseAmount: number;
  cashbackAmount: number;
  percentage: number;
  networkStatus?: string;
  estimatePayoutDate?: string;
  rawData?: any;
}

export interface CashbackFilters {
  page?: number;
  limit?: number;
  userId?: string;
  offerId?: string;
  flatformId?: string;
  status?: "pending" | "completed" | "rejected";
  networkStatus?: string;
  dateFrom?: string;
  dateTo?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

export interface ShopeeProductInfo {
  originalUrl: string;
  cleanUrl: string;
  productId: string | null;
  shopId: string | number;
  itemId: string | number;
  productName: string | null;
  imageUrl: string | null;
  affiliateUrl: string | null;
  productLink: string;
  // Commission info
  commission: number | null;
  commissionRate: string | null;
  sellerCommissionRate: string | null;
  shopeeCommissionRate: string | null;
  // Price info
  priceMin: string | null;
  // Cashback for user
  estimatedCashback: number | null;
  cashbackRate: number;
  // Short link
  shortLink?: {
    shortCode: string;
    shortUrl: string;
    originalUrl: string;
    createdAt: string;
    expiresAt: string;
  };
}

const cashbackService = {
  /**
   * Tạo cashback mới (admin)
   */
  createCashback: async (data: CreateCashbackData) => {
    const response = await http.post("/cashback", data);
    return response.data;
  },

  /**
   * Lấy danh sách cashback của user hiện tại
   */
  getMyCashbacks: async (params?: {
    page?: number;
    limit?: number;
    status?: "pending" | "completed" | "rejected";
  }): Promise<CashbackListResponse> => {
    const response = await http.get("/cashback/my-cashbacks", { params });
    return response.data.data;
  },

  /**
   * Lấy thống kê cashback của user hiện tại
   */
  getMyCashbackStatistics: async (params?: {
    dateFrom?: string;
    dateTo?: string;
  }): Promise<CashbackStatistics> => {
    const response = await http.get("/cashback/my-statistics", { params });
    return response.data.data.statistics;
  },

  /**
   * Lấy chi tiết một cashback
   */
  getCashbackById: async (id: string): Promise<CashbackTransaction> => {
    const response = await http.get(`/cashback/${id}`);
    return response.data.data.cashback;
  },

  // ============================================
  // Platform APIs
  // ============================================

  /**
   * Lấy danh sách platforms
   */
  getPlatforms: async (params?: {
    type?: string;
    status?: "active" | "inactive";
  }): Promise<Platform[]> => {
    const response = await http.get("/platforms", { params });
    return response.data.data.data;
  },

  /**
   * Lấy chi tiết platform
   */
  getPlatformById: async (id: string): Promise<Platform> => {
    const response = await http.get(`/platforms/${id}`);
    return response.data.data.data;
  },

  // ============================================
  // Offer APIs
  // ============================================

  /**
   * Lấy danh sách offers
   */
  getOffers: async (params?: {
    flatformId?: string;
    type?: string;
    status?: string;
    category?: string;
    page?: number;
    limit?: number;
  }): Promise<{
    data: Offer[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  }> => {
    const response = await http.get("/offers", { params });
    return response.data.data;
  },

  /**
   * Lấy chi tiết offer
   */
  getOfferById: async (id: string): Promise<Offer> => {
    const response = await http.get(`/offers/${id}`);
    return response.data.data.data;
  },

  /**
   * Lấy offers theo platform
   */
  getOffersByPlatform: async (
    platformId: string,
    params?: { page?: number; limit?: number }
  ): Promise<{
    data: Offer[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  }> => {
    const response = await http.get(`/offers/platform/${platformId}`, {
      params,
    });
    return response.data.data;
  },

  /**
   * Tìm offer từ link (hỗ trợ link rút gọn)
   */
  findOfferByLink: async (
    link: string,
    platformId?: string
  ): Promise<Offer | null> => {
    const response = await http.post("/offers/find-by-link", {
      link,
      platformId,
    });
    return response.data.data.offer;
  },

  /**
   * Tạo link cashback
   */
  generateCashbackLink: async (data: {
    offerId: string;
    flatformId: string;
  }): Promise<{
    trackingUrl?: string;
    affLink?: string;
    clickId?: string;
  }> => {
    const response = await http.post("/offers/generate-link", data);
    return response.data.data;
  },

  // ============================================
  // CSV APIs - Đọc trực tiếp từ file CSV
  // ============================================

  /**
   * Tìm sản phẩm từ link (đọc từ CSV)
   */
  findProductByLink: async (link: string): Promise<any> => {
    const response = await http.post("/csv/find-by-link", { link });
    return response.data.data.product;
  },

  /**
   * Search sản phẩm từ CSV
   */
  searchProductsInCSV: async (params: {
    keyword: string;
    page?: number;
    limit?: number;
  }): Promise<{
    data: any[];
    total: number;
    page: number;
    totalPages: number;
  }> => {
    const response = await http.get("/csv/search", { params });
    return response.data.data;
  },

  /**
   * Lấy sản phẩm ngẫu nhiên từ CSV
   */
  getRandomProducts: async (limit: number = 20): Promise<any[]> => {
    const response = await http.get("/csv/random", { params: { limit } });
    return response.data.data.products;
  },

  /**
   * Lấy sản phẩm từ CSV với pagination
   */
  getProductsFromCSV: async (params: {
    page?: number;
    limit?: number;
  }): Promise<{
    data: any[];
    total: number;
    page: number;
    totalPages: number;
  }> => {
    const response = await http.get("/csv", { params });
    return response.data.data;
  },

  // ============================================
  // Shopee Link Conversion APIs
  // ============================================

  /**
   * Convert Shopee link to affiliate link with product info
   */
  convertShopeeLink: async (
    url: string,
    userId?: string
  ): Promise<ShopeeProductInfo> => {
    const params: any = { url };
    if (userId) params.userId = userId;

    const response = await http.get("/affiliate/convert", { params });
    const { convertedLink, shortLink } = response.data.data;
    // Merge shortLink info into convertedLink
    return { ...convertedLink, shortLink };
  },

  // ============================================
  // Link Management APIs
  // ============================================

  /**
   * Lấy danh sách link của user
   */
  getUserLinks: async (params?: {
    page?: number;
    limit?: number;
    status?: string;
    platform?: string;
    search?: string;
  }): Promise<{ links: any[]; total: number; totalPages: number }> => {
    const response = await http.get("/management/links/my-links", { params });
    return response.data.data;
  },

  /**
   * Lấy thống kê link của user
   */
  getUserLinkStats: async (): Promise<any> => {
    const response = await http.get("/management/links/my-stats");
    return response.data.data.stats;
  },

  /**
   * Lấy tất cả links (admin)
   */
  getAllLinks: async (params?: {
    userId?: string;
    platform?: string;
    status?: string;
    page?: number;
    limit?: number;
    search?: string;
  }): Promise<{ links: any[]; total: number; totalPages: number }> => {
    const response = await http.get("/management/admin/links", { params });
    return response.data.data;
  },

  /**
   * Cập nhật status link (admin)
   */
  updateLinkStatus: async (
    linkId: string,
    status: "active" | "expired" | "suspended"
  ): Promise<any> => {
    const response = await http.patch(
      `/management/admin/links/${linkId}/status`,
      { status }
    );
    return response.data.data.link;
  },

  /**
   * Xóa link (admin)
   */
  deleteLink: async (linkId: string): Promise<void> => {
    await http.delete(`/management/admin/links/${linkId}`);
  },

  /**
   * Lấy thống kê tổng quan links (admin)
   */
  getOverallLinkStats: async (): Promise<any> => {
    const response = await http.get("/management/admin/links/stats/overall");
    return response.data.data.stats;
  },

  // ============================================
  // Order Tracking & Cashback History APIs
  // ============================================

  /**
   * Lấy lịch sử cashback của user
   */
  getUserOrders: async (params?: {
    page?: number;
    limit?: number;
    status?: string;
    type?: string;
    search?: string;
  }): Promise<{ orders: any[]; total: number; totalPages: number }> => {
    const response = await http.get("/cashback/history", { params });
    return response.data.data;
  },

  /**
   * Lấy thống kê cashback của user
   */
  getUserCashbackStatsNew: async (): Promise<any> => {
    const response = await http.get("/cashback/stats");
    return response.data.data.stats;
  },

  /**
   * Lấy tất cả orders (admin)
   */
  getAllOrders: async (params?: {
    userId?: string;
    platform?: string;
    orderStatus?: string;
    cashbackStatus?: string;
    page?: number;
    limit?: number;
    search?: string;
    fromDate?: string;
    toDate?: string;
  }): Promise<{ orders: any[]; total: number; totalPages: number }> => {
    const response = await http.get("/management/admin/orders", { params });
    return response.data.data;
  },

  /**
   * Tạo order tracking (admin)
   */
  createOrder: async (orderData: any): Promise<any> => {
    const response = await http.post("/management/admin/orders", orderData);
    return response.data.data.order;
  },

  /**
   * Cập nhật order tracking (admin)
   */
  updateOrder: async (orderId: string, orderData: any): Promise<any> => {
    const response = await http.put(
      `/management/admin/orders/${orderId}`,
      orderData
    );
    return response.data.data.order;
  },

  /**
   * Xóa order tracking (admin)
   */
  deleteOrder: async (orderId: string): Promise<any> => {
    const response = await http.delete(`/management/admin/orders/${orderId}`);
    return response.data;
  },

  /**
   * Duyệt order (admin)
   */
  approveOrder: async (orderId: string): Promise<any> => {
    const response = await http.patch(
      `/management/admin/orders/${orderId}/approve`
    );
    return response.data.data.order;
  },

  /**
   * Từ chối order (admin)
   */
  rejectOrder: async (orderId: string, reason: string): Promise<any> => {
    const response = await http.patch(
      `/management/admin/orders/${orderId}/reject`,
      { reason }
    );
    return response.data.data.order;
  },

  /**
   * Đánh dấu đã thanh toán (admin)
   */
  markOrderAsPaid: async (orderId: string): Promise<any> => {
    const response = await http.patch(
      `/management/admin/orders/${orderId}/mark-paid`
    );
    return response.data.data.order;
  },

  /**
   * Bulk approve orders (admin)
   */
  bulkApproveOrders: async (orderIds: string[]): Promise<number> => {
    const response = await http.post("/management/admin/orders/bulk-approve", {
      orderIds,
    });
    return response.data.data.count;
  },

  /**
   * Bulk mark as paid (admin)
   */
  bulkMarkAsPaid: async (orderIds: string[]): Promise<number> => {
    const response = await http.post("/management/admin/orders/bulk-paid", {
      orderIds,
    });
    return response.data.data.count;
  },

  /**
   * Lấy thống kê tổng quan orders (admin)
   */
  getOverallOrderStats: async (): Promise<any> => {
    const response = await http.get("/management/admin/orders/stats/overall");
    return response.data.data.stats;
  },

  // ============================================
  // Admin APIs
  // ============================================

  /**
   * Lấy tất cả cashback (admin)
   */
  getAllCashbacks: async (
    filters?: CashbackFilters
  ): Promise<CashbackListResponse> => {
    const response = await http.get("/cashback/admin/all", { params: filters });
    return response.data.data;
  },

  /**
   * Lấy cashback của một user cụ thể (admin)
   */
  getUserCashbacks: async (
    userId: string,
    params?: {
      page?: number;
      limit?: number;
      status?: "pending" | "completed" | "rejected";
    }
  ): Promise<CashbackListResponse> => {
    const response = await http.get(`/cashback/admin/user/${userId}`, {
      params,
    });
    return response.data.data;
  },

  /**
   * Cập nhật trạng thái cashback (admin)
   */
  updateCashbackStatus: async (
    id: string,
    data: {
      status: "pending" | "completed" | "rejected";
      networkStatus?: string;
    }
  ): Promise<CashbackTransaction> => {
    const response = await http.patch(`/cashback/admin/${id}/status`, data);
    return response.data.data.cashback;
  },

  /**
   * Xóa cashback (admin)
   */
  deleteCashback: async (id: string) => {
    const response = await http.delete(`/cashback/admin/${id}`);
    return response.data;
  },

  /**
   * Lấy thống kê cashback (admin có thể filter theo userId)
   */
  getCashbackStatistics: async (params?: {
    userId?: string;
    dateFrom?: string;
    dateTo?: string;
  }): Promise<CashbackStatistics> => {
    const response = await http.get("/cashback/admin/statistics", { params });
    return response.data.data.statistics;
  },
};

export default cashbackService;
