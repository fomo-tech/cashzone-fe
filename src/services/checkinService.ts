import api from "./api";

export interface CheckInResponse {
  reward: number;
  consecutiveCount: number;
  isConsecutive: boolean;
  claimedDayOfWeek: number;
  claimedDayName: string;
  message: string;
}

export interface WeeklyCheckInData {
  dayOfWeek: number;
  date: Date;
  isToday: boolean;
  isCheckedIn: boolean;
  reward: number;
  claimedDayOfWeek?: number;
  canCheckIn: boolean;
}

export interface CheckInStats {
  weeklyHistory: {
    weekData: WeeklyCheckInData[];
    totalReward: number;
    checkInCount: number;
    nextClaimDay: number;
  };
  consecutiveCount: number;
  totalCheckIns: number;
  totalRewards: number;
  canCheckInToday: boolean;
}

export interface CheckInRewards {
  day1: number; // Ngày 1 liên tiếp
  day2: number; // Ngày 2 liên tiếp
  day3: number; // Ngày 3 liên tiếp
  day4: number; // Ngày 4 liên tiếp
  day5: number; // Ngày 5 liên tiếp
  day6: number; // Ngày 6 liên tiếp
  day7: number; // Ngày 7 liên tiếp
  bonusWeekComplete: number; // Thưởng hoàn thành 1 tuần
}

class CheckInService {
  /**
   * Thực hiện điểm danh hàng ngày
   */
  async checkIn(): Promise<CheckInResponse> {
    const response = await api.post("/checkin");
    return response.data.data;
  }

  /**
   * Lấy thống kê điểm danh
   */
  async getStats(): Promise<CheckInStats> {
    const response = await api.get("/checkin/stats");
    return response.data.data;
  }

  /**
   * Lấy lịch điểm danh tuần
   */
  async getWeeklyCalendar() {
    const response = await api.get("/checkin/calendar");
    return response.data.data;
  }

  /**
   * Kiểm tra có thể điểm danh hôm nay không
   */
  async canCheckIn(): Promise<boolean> {
    const response = await api.get("/checkin/can-checkin");
    return response.data.data.canCheckIn;
  }

  /**
   * Lấy cấu hình thưởng điểm danh
   */
  async getRewardsConfig(): Promise<CheckInRewards> {
    const response = await api.get("/checkin/rewards");
    return response.data.data;
  }

  // Admin methods
  /**
   * Lấy cấu hình thưởng điểm danh (admin)
   */
  async getAdminRewardsConfig(): Promise<CheckInRewards> {
    const response = await api.get("/admin/checkin-rewards");
    return response.data.data;
  }

  /**
   * Cập nhật cấu hình thưởng điểm danh (admin)
   */
  async updateRewardsConfig(rewards: CheckInRewards): Promise<CheckInRewards> {
    const response = await api.put("/admin/checkin-rewards", rewards);
    return response.data.data;
  }
}

export default new CheckInService();
