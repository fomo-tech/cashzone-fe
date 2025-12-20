import api from "./api";

export interface AffiliateProduct {
  _id: string;
  productName: string;
  productUrl: string;
  affiliateUrl: string;
  imageUrl: string;
  price: number;
  commissionRate: number;
  estimatedCashback: number;
  platform: {
    _id: string;
    name: string;
    slug: string;
    logo: string;
  };
  category?: string;
  description?: string;
  isPriority: boolean;
  isActive: boolean;
  priority: number;
  shopName?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateAffiliateProductDto {
  productName: string;
  productUrl: string;
  affiliateUrl?: string;
  imageUrl: string;
  price: number;
  commissionRate: number;
  platform: string;
  category?: string;
  description?: string;
  isPriority?: boolean;
  isActive?: boolean;
  priority?: number;
  shopName?: string;
}

export interface UpdateAffiliateProductDto
  extends Partial<CreateAffiliateProductDto> {}

export interface GetAffiliateProductsParams {
  page?: number;
  limit?: number;
  platform?: string;
  category?: string;
  isPriority?: boolean;
  isActive?: boolean;
  search?: string;
}

const affiliateProductService = {
  // Admin APIs
  getAll: async (params?: GetAffiliateProductsParams) => {
    const response = await api.get("/affiliate-products/admin/all", { params });
    return response.data;
  },

  getById: async (id: string) => {
    const response = await api.get(`/affiliate-products/admin/${id}`);
    return response.data;
  },

  create: async (data: CreateAffiliateProductDto) => {
    const response = await api.post("/affiliate-products/admin", data);
    return response.data;
  },

  update: async (id: string, data: UpdateAffiliateProductDto) => {
    const response = await api.put(`/affiliate-products/admin/${id}`, data);
    return response.data;
  },

  delete: async (id: string) => {
    const response = await api.delete(`/affiliate-products/admin/${id}`);
    return response.data;
  },

  bulkDelete: async (ids: string[]) => {
    const response = await api.post("/affiliate-products/admin/bulk-delete", {
      ids,
    });
    return response.data;
  },

  updatePriority: async (id: string, priority: number) => {
    const response = await api.patch(
      `/affiliate-products/admin/${id}/priority`,
      { priority }
    );
    return response.data;
  },

  toggleActive: async (id: string) => {
    const response = await api.patch(
      `/affiliate-products/admin/${id}/toggle-active`
    );
    return response.data;
  },

  // Public APIs
  getPriorityProducts: async (params?: {
    limit?: number;
    platform?: string;
  }) => {
    const response = await api.get("/affiliate-products/priority", { params });
    return response.data;
  },

  getActiveProducts: async (params?: GetAffiliateProductsParams) => {
    const response = await api.get("/affiliate-products", { params });
    return response.data;
  },

  getProductByUrl: async (url: string) => {
    const response = await api.post("/affiliate-products/by-url", { url });
    return response.data;
  },
};

export default affiliateProductService;
