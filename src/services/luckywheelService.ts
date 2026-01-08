import http from "./api";

interface LuckyWheelPrize {
  id: string;
  name: string;
  value: number;
  probability: number;
  color: string;
}

interface LuckyWheelSettings {
  prizes: LuckyWheelPrize[];
  costPerSpin: number;
  enabled: boolean;
  maxSpinsPerDay?: number;
  lastUpdated: Date;
}

interface SpinResult {
  prize: LuckyWheelPrize;
  costPaid: number;
  rewardReceived: number;
  newBalance: number;
  isTryAgain?: boolean; // Đánh dấu nếu là giải "Thử Lại"
}

interface LuckyWheelHistory {
  _id: string;
  userId: string;
  prizeId: string;
  prizeName: string;
  prizeValue: number;
  costPaid: number;
  spinDate: Date;
  isTryAgain?: boolean;
}

class LuckyWheelService {
  // Get Lucky Wheel settings
  async getSettings(): Promise<LuckyWheelSettings> {
    try {
      const response = await http.get("/luckywheel/settings");
      return response.data.data;
    } catch (error) {
      console.error("Error fetching lucky wheel settings:", error);
      throw error;
    }
  }

  // Update Lucky Wheel settings (Admin)
  async updateSettings(
    settings: Partial<LuckyWheelSettings>
  ): Promise<LuckyWheelSettings> {
    try {
      const response = await http.put("/luckywheel/settings", settings);
      return response.data.data;
    } catch (error) {
      console.error("Error updating lucky wheel settings:", error);
      throw error;
    }
  }

  // Spin the wheel
  async spin(): Promise<SpinResult> {
    try {
      const response = await http.post("/luckywheel/spin");
      return response.data.data;
    } catch (error) {
      console.error("Error spinning lucky wheel:", error);
      throw error;
    }
  }

  // Get user history
  async getHistory(
    page = 1,
    limit = 20
  ): Promise<{
    history: LuckyWheelHistory[];
    pagination: {
      total: number;
      page: number;
      limit: number;
      totalPages: number;
    };
  }> {
    try {
      const response = await http.get(
        `/luckywheel/history?page=${page}&limit=${limit}`
      );
      return response.data.data;
    } catch (error) {
      console.error("Error fetching lucky wheel history:", error);
      throw error;
    }
  }

  // Get statistics (Admin)
  async getStats(
    startDate?: string,
    endDate?: string
  ): Promise<{
    overview: {
      totalSpins: number;
      totalCostCollected: number;
      totalRewardsGiven: number;
      uniqueUsersCount: number;
      netProfit: number;
    };
    prizeDistribution: {
      _id: { prizeId: string; prizeName: string };
      count: number;
      totalValue: number;
    }[];
  }> {
    try {
      const params = new URLSearchParams();
      if (startDate) params.append("startDate", startDate);
      if (endDate) params.append("endDate", endDate);

      const response = await http.get(`/luckywheel/stats?${params}`);
      return response.data.data;
    } catch (error) {
      console.error("Error fetching lucky wheel stats:", error);
      throw error;
    }
  }
}

const luckywheelService = new LuckyWheelService();
export default luckywheelService;
export type {
  LuckyWheelPrize,
  LuckyWheelSettings,
  SpinResult,
  LuckyWheelHistory,
};
