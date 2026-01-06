import { createContext, useContext, type ReactNode } from "react";

export interface UserProfile {
  _id?: string;
  id?: string;
  name?: string;
  email: string;
  phone?: string;
  avatar?: string;
  roles: RoleEnum[];
  isActive: boolean;
  referralCode?: string;
  createdAt?: Date | string;
  totalEarned?: number;
  balance?: number;
  level?: number;
}

export enum RoleEnum {
  USER = "user",
  ADMIN = "admin",
}

export interface AuthResponse {
  user: UserProfile;
  tokens: {
    accessToken: string;
    refreshToken: string;
  };
}

export interface AuthContextValue {
  user: UserProfile | null;
  isAuthenticated: boolean;
  login: (authData: AuthResponse) => void;
  logout: () => void;
  updateUser: (userData: Partial<UserProfile>) => void;
}

export const AuthContext = createContext<AuthContextValue | null>(null);

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuthContext must be used within an AuthProvider");
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  // This is a placeholder - implement your auth logic here
  // For now, returning a default context value
  const contextValue: AuthContextValue = {
    user: null,
    isAuthenticated: false,
    login: () => {},
    logout: () => {},
    updateUser: () => {},
  };

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};
