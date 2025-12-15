export const RoleEnum = {
  GUEST: "guest",
  USER: "user",
  CREATOR: "creator",
  ADMIN: "admin",
} as const;

export type RoleEnum = (typeof RoleEnum)[keyof typeof RoleEnum];

export interface User {
  _id: string;
  phone: string;
  password?: string;
  email: string;
  name?: string;
  roles: RoleEnum[];
  avatar?: string;
  wallet: {
    available: number;
    pending: number;
  };
  affiliate: {
    code?: string;
    referredBy?: string;
  };
  status: boolean;
  deviceFingerprint?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface AuthState {
  user: User | null;
  accessToken: string | null;
  handleToggleAuthModal: () => void;
  refreshToken: string | null;
  tokens: string | null;
  loading: boolean;
  isAuthenticated: boolean;
  setUser: (user: User | null) => void;
  isAuthModalOpen: boolean;
  init: () => void;
  login: (data: {
    user: User;
    tokens: {
      accessToken: string;
      refreshToken: string;
    };
  }) => void;
  logout: () => void;
}

export interface AppState {
  loading: {
    [key: string]: boolean;
  };
  toast: {
    title: string;
    type: "success" | "error";
    isVisible: boolean;
    timer: number;
  } | null;
  setToast: (toast: AppState["toast"]) => void;
  setLoading: (key: string, value: boolean) => void;
}
