import api from "./api";

export interface ActivityEarning {
  _id: string;
  userId: {
    _id: string;
    name: string;
    email: string;
    phone?: string;
    avatar?: string;
  };
  activityType: "checkin" | "lucky_wheel" | "task" | "referral_bonus" | "other";
  activityName: string;
  amount: number;
  balanceBefore: number;
  balanceAfter: number;
  metadata?: {
    checkinDay?: number;
    prizeId?: string;
    prizeName?: string;
    taskId?: string;
    referralUserId?: string;
    [key: string]: any;
  };
  ip?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ActivityEarningListResponse {
  history: ActivityEarning[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface ActivityEarningStats {
  byActivityType: {
    _id: string;
    totalAmount: number;
    count: number;
  }[];
  overall: {
    total: number;
    count: number;
  };
}

class ActivityEarningService {
  /**
   * Get all activity earnings (Admin only)
   */
  async getAllActivityEarnings(params?: {
    page?: number;
    limit?: number;
    userId?: string;
    activityType?: string;
    startDate?: string;
    endDate?: string;
  }): Promise<ActivityEarningListResponse> {
    const response = await api.get("/activity-earnings", { params });
    return response.data.data;
  }

  /**
   * Get activity earning statistics (Admin only)
   */
  async getActivityEarningStats(params?: {
    userId?: string;
    startDate?: string;
    endDate?: string;
  }): Promise<ActivityEarningStats> {
    const response = await api.get("/activity-earnings/stats", { params });
    return response.data.data;
  }

  /**
   * Get current user's activity earning history
   */
  async getMyActivityEarnings(params?: {
    page?: number;
    limit?: number;
    activityType?: string;
  }): Promise<ActivityEarningListResponse> {
    const response = await api.get("/activity-earnings/me", { params });
    return response.data.data;
  }

  /**
   * Get current user's activity earning statistics
   */
  async getMyActivityEarningStats(): Promise<ActivityEarningStats> {
    const response = await api.get("/activity-earnings/me/stats");
    return response.data.data;
  }
}

export default new ActivityEarningService();
