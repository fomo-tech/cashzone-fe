import http from "./api";

export interface WalletInfo {
  availableBalance: number;
  pendingBalance: number;
  totalWithdrawn: number;
}

export interface Transaction {
  _id: string;
  userId: string;
  type: "WITHDRAW" | "DEPOSIT" | "COMMISSION" | "REFERRAL" | "REFUND";
  amount: number;
  balanceBefore?: number;
  balanceAfter?: number;
  status: "PENDING" | "COMPLETED" | "REJECTED" | "FAILED";
  paymentInfo?: {
    method: "bank" | "momo" | "bep20";
    transactionId?: string;
  };
  relatedSubmission?: string;
  createdAt: string;
  updatedAt: string;
}

export interface TransactionListResponse {
  transactions: Transaction[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export interface ProfileCompletion {
  hasPhone: boolean;
  hasBankingInfo: boolean;
  hasMomoInfo: boolean;
  hasBEP20Info: boolean;
}

export interface PaymentInfo {
  bankInfo?: {
    bankName: string;
    accountNumber: string;
    accountName: string;
    branch?: string;
  } | null;
  momoInfo?: {
    phoneNumber: string;
    accountName: string;
  } | null;
  bep20Info?: {
    walletAddress: string;
    network: string;
  } | null;
}

const walletService = {
  /**
   * Get wallet info (balance, stats)
   */
  getWalletInfo: async (): Promise<WalletInfo> => {
    const response = await http.get("/wallet/info");
    return response.data.data;
  },

  /**
   * Get transaction history
   */
  getTransactions: async (params?: {
    page?: number;
    limit?: number;
    type?: string;
    status?: string;
  }): Promise<TransactionListResponse> => {
    const response = await http.get("/wallet/transactions", { params });
    return response.data.data;
  },

  /**
   * Create withdrawal request
   */
  createWithdrawal: async (data: {
    amount: number;
    paymentMethod: "bank" | "momo" | "bep20";
  }): Promise<Transaction> => {
    const response = await http.post("/wallet/withdraw", data);
    return response.data.data;
  },

  /**
   * Get profile completion status
   */
  getProfileCompletion: async (): Promise<ProfileCompletion> => {
    const response = await http.get("/wallet/profile-completion");
    return response.data.data;
  },

  /**
   * Get payment information
   */
  getPaymentInfo: async (): Promise<PaymentInfo> => {
    const response = await http.get("/wallet/payment-info");
    return response.data.data;
  },

  /**
   * Update payment information
   */
  updatePaymentInfo: async (
    data: Partial<PaymentInfo>,
  ): Promise<PaymentInfo> => {
    const response = await http.put("/wallet/payment-info", data);
    return response.data.data;
  },
};

export default walletService;
