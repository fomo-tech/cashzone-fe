import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";
import http from "../services/api";

interface WalletContextType {
  balance: number;
  loading: boolean;
  updateBalance: () => Promise<void>;
  addBalance: (amount: number) => void;
  deductBalance: (amount: number) => void;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export const useWallet = () => {
  const context = useContext(WalletContext);
  if (!context) {
    throw new Error("useWallet must be used within a WalletProvider");
  }
  return context;
};

interface WalletProviderProps {
  children: ReactNode;
}

export const WalletProvider: React.FC<WalletProviderProps> = ({ children }) => {
  const [balance, setBalance] = useState(0);
  const [loading, setLoading] = useState(true);

  const updateBalance = async () => {
    try {
      const response = await http.get("/wallet/info");
      const walletData = response.data.data;
      setBalance(walletData.balance || 0);
    } catch (error) {
      console.error("Failed to fetch wallet balance:", error);
      // Keep current balance on error
    } finally {
      setLoading(false);
    }
  };

  const addBalance = (amount: number) => {
    setBalance((prev) => prev + amount);
  };

  const deductBalance = (amount: number) => {
    setBalance((prev) => Math.max(0, prev - amount));
  };

  useEffect(() => {
    updateBalance();
  }, []);

  const value = {
    balance,
    loading,
    updateBalance,
    addBalance,
    deductBalance,
  };

  return (
    <WalletContext.Provider value={value}>{children}</WalletContext.Provider>
  );
};
