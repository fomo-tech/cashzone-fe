import { defaultHttp } from "./api";

export interface LeaderBoardUser {
  id: string;
  name: string;
  rank: number;
  totalEarnings: number;
  totalReferrals: number;
  avatar?: string;
}

export interface LeaderBoardStats {
  totalUsers: number;
  totalEarnings: number;
  averageEarnings: number;
}

export interface LeaderBoardResponse {
  topUsers: LeaderBoardUser[];
  currentUser: LeaderBoardUser | null;
  stats: LeaderBoardStats;
  period: string;
  limit: number;
}

export const leaderboardService = {
  // Get leaderboard data - Public API, no auth required
  getLeaderBoard: async (
    period: "all" | "week" | "month" | "year" = "all",
    limit: number = 10
  ): Promise<LeaderBoardResponse> => {
    const response = await defaultHttp.get("/leaderboard", {
      params: { period, limit },
    });
    return response.data.data;
  },

  // Get user ranking - Public API, no auth required
  getUserRanking: async (userId?: string): Promise<LeaderBoardUser | null> => {
    const response = await defaultHttp.get("/leaderboard", {
      params: { period: "all", limit: 1 },
    });
    return response.data.data.currentUser;
  },
};
