// AccessTrade API Demo Test
// API Documentation: https://api.accesstrade.vn
// Access key from: http://pub.accesstrade.vn/accounts/profile

import axios from "axios";

// Configuration
const ACCESSTRADE_API_BASE = "https://api.accesstrade.vn";
const ACCESS_KEY = "jFogCAEIT6Aq2zWrtibeABDDv85kXlVI";

// Create axios instance with default headers
const accessTradeAPI = axios.create({
  baseURL: ACCESSTRADE_API_BASE,
  headers: {
    Authorization: `Token ${ACCESS_KEY}`,
    "Content-Type": "application/json",
  },
  timeout: 30000,
});

// Add request interceptor for logging
accessTradeAPI.interceptors.request.use(
  (config) => {
    console.log(`🚀 AccessTrade API Request:`, {
      method: config.method?.toUpperCase(),
      url: config.url,
      headers: config.headers,
    });
    return config;
  },
  (error) => {
    console.error("❌ Request Error:", error);
    return Promise.reject(error);
  }
);

// Add response interceptor for logging
accessTradeAPI.interceptors.response.use(
  (response) => {
    console.log(`✅ AccessTrade API Response:`, {
      status: response.status,
      statusText: response.statusText,
      data: response.data,
    });
    return response;
  },
  (error) => {
    console.error("❌ Response Error:", {
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data,
      message: error.message,
    });
    return Promise.reject(error);
  }
);

// Demo API Functions
export const accessTradeDemo = {
  // Test API connection and get campaigns
  async getCampaigns(params?: {
    limit?: number;
    offset?: number;
    status?: string;
  }) {
    try {
      const response = await accessTradeAPI.get("/v1/campaigns", { params });
      return {
        success: true,
        data: response.data,
        status: response.status,
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data || error.message,
        status: error.response?.status,
      };
    }
  },

  // Get campaign details by ID
  async getCampaignDetails(campaignId: string) {
    try {
      const response = await accessTradeAPI.get(`/v1/campaigns/${campaignId}`);
      return {
        success: true,
        data: response.data,
        status: response.status,
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data || error.message,
        status: error.response?.status,
      };
    }
  },

  // Get offers/products
  async getOffers(params?: {
    limit?: number;
    offset?: number;
    campaign_id?: string;
    category_id?: string;
  }) {
    try {
      const response = await accessTradeAPI.get("/v1/offers", { params });
      return {
        success: true,
        data: response.data,
        status: response.status,
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data || error.message,
        status: error.response?.status,
      };
    }
  },

  // Get categories
  async getCategories() {
    try {
      const response = await accessTradeAPI.get("/v1/categories");
      return {
        success: true,
        data: response.data,
        status: response.status,
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data || error.message,
        status: error.response?.status,
      };
    }
  },

  // Get transactions/commissions
  async getTransactions(params?: {
    limit?: number;
    offset?: number;
    from_date?: string;
    to_date?: string;
  }) {
    try {
      const response = await accessTradeAPI.get("/v1/transactions", { params });
      return {
        success: true,
        data: response.data,
        status: response.status,
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data || error.message,
        status: error.response?.status,
      };
    }
  },

  // Test all endpoints sequentially
  async runFullDemo() {
    console.log("\n🧪 Starting AccessTrade API Full Demo...\n");

    const results = {
      campaigns: await this.getCampaigns({ limit: 5 }),
      categories: await this.getCategories(),
      offers: await this.getOffers({ limit: 5 }),
      transactions: await this.getTransactions({ limit: 5 }),
    };

    // Summary
    console.log("\n📊 Demo Results Summary:");
    Object.entries(results).forEach(([endpoint, result]) => {
      const status = result.success ? "✅" : "❌";
      const httpStatus = result.status || "N/A";
      console.log(`${status} ${endpoint}: HTTP ${httpStatus}`);
    });

    return results;
  },

  // Quick test - just check connection with campaigns endpoint
  async quickTest() {
    console.log("\n⚡ Quick AccessTrade API Test...");

    const result = await this.getCampaigns({ limit: 1 });

    if (result.success) {
      console.log("✅ API Connection Success!");
      console.log("📦 Sample Data:", JSON.stringify(result.data, null, 2));
    } else {
      console.log("❌ API Connection Failed!");
      console.log("🚨 Error:", result.error);
    }

    return result;
  },
};

// Export for use in other files
export default accessTradeDemo;

// Demo usage examples (commented out to avoid auto-execution)
/*
// Example 1: Quick test
accessTradeDemo.quickTest();

// Example 2: Get campaigns with parameters
accessTradeDemo.getCampaigns({ limit: 10, status: 'active' })
  .then(result => console.log('Campaigns:', result));

// Example 3: Run full demo
accessTradeDemo.runFullDemo();

// Example 4: Get specific campaign details
accessTradeDemo.getCampaignDetails('CAMPAIGN_ID_HERE')
  .then(result => console.log('Campaign Details:', result));
*/
