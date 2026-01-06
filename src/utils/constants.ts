// ===========================================
// THEME COLORS - Updated Theme 2025
// ===========================================

// Primary theme - Deep Blue Professional
export const COLORS = {
  // Primary Colors - Pink to Orange Gradient Theme
  PRIMARY: "#E91E63", // pink-600
  PRIMARY_50: "#FCE4EC", // pink-50
  PRIMARY_100: "#F8BBD9", // pink-100
  PRIMARY_200: "#F48FB1", // pink-200
  PRIMARY_300: "#F06292", // pink-300
  PRIMARY_400: "#EC407A", // pink-400
  PRIMARY_500: "#E91E63", // pink-500 (primary)
  PRIMARY_600: "#D81B60", // pink-600
  PRIMARY_700: "#C2185B", // pink-700
  PRIMARY_800: "#AD1457", // pink-800
  PRIMARY_900: "#880E4F", // pink-900

  SECONDARY: "#FF8C1A", // orange-500
  SECONDARY_50: "#FFF3E0",
  SECONDARY_100: "#FFE0B2",
  SECONDARY_200: "#FFCC80",
  SECONDARY_300: "#FFB74D",
  SECONDARY_400: "#FFA726",
  SECONDARY_500: "#FF8C1A",
  SECONDARY_600: "#FB8C00",
  SECONDARY_700: "#F57C00",
  SECONDARY_800: "#EF6C00",
  SECONDARY_900: "#E65100",

  // Gradient Definitions
  GRADIENT_PRIMARY: "linear-gradient(135deg, #E91E63 0%, #FF8C1A 100%)",
  GRADIENT_HORIZONTAL: "linear-gradient(90deg, #E91E63 0%, #FF8C1A 100%)",
  GRADIENT_VERTICAL: "linear-gradient(180deg, #E91E63 0%, #FF8C1A 100%)",

  // Accent Colors - Modern Orange/Amber
  ACCENT: "#f59e0b", // amber-500
  ACCENT_50: "#fffbeb", // amber-50
  ACCENT_100: "#fef3c7", // amber-100
  ACCENT_200: "#fde68a", // amber-200
  ACCENT_300: "#fcd34d", // amber-300
  ACCENT_400: "#fbbf24", // amber-400
  ACCENT_500: "#f59e0b", // amber-500
  ACCENT_600: "#d97706", // amber-600

  // Status Colors
  SUCCESS: "#059669", // emerald-600
  SUCCESS_50: "#ecfdf5",
  SUCCESS_100: "#d1fae5",
  WARNING: "#f59e0b", // amber-500
  WARNING_50: "#fffbeb",
  WARNING_100: "#fef3c7",
  ERROR: "#dc2626", // red-600
  ERROR_50: "#fef2f2",
  ERROR_100: "#fee2e2",

  // Neutral Colors
  GRAY_50: "#f9fafb",
  GRAY_100: "#f3f4f6",
  GRAY_200: "#e5e7eb",
  GRAY_300: "#d1d5db",
  GRAY_400: "#9ca3af",
  GRAY_500: "#6b7280",
  GRAY_600: "#4b5563",
  GRAY_700: "#374151",
  GRAY_800: "#1f2937",
  GRAY_900: "#111827",

  // Background Colors
  BG_PRIMARY: "#ffffff",
  BG_SECONDARY: "#f8fafc",
  BG_ACCENT: "#f1f5f9",
} as const;

// Tailwind CSS Classes
export const THEME = {
  // Primary Background Classes - Gradient Theme
  PRIMARY_BG: "bg-primary-gradient",
  PRIMARY_BG_HOVER: "hover:opacity-90",
  PRIMARY_BG_LIGHT: "bg-pink-50",
  PRIMARY_BG_GRADIENT: "bg-gradient-to-br from-orange-500 via-orange-600 to-amber-600",
  PRIMARY_BG_GRADIENT_HOVER: "hover:from-orange-600 hover:to-amber-700",

  // Primary Text Classes
  PRIMARY_TEXT: "text-[#E91E63]",
  PRIMARY_TEXT_LIGHT: "text-[#F48FB1]",
  PRIMARY_TEXT_DARK: "text-[#AD1457]",

  // Primary Border Classes
  PRIMARY_BORDER: "border-[#E91E63]",
  PRIMARY_BORDER_LIGHT: "border-[#F48FB1]",

  // Secondary Classes
  SECONDARY_BG: "bg-[#FF8C1A]",
  SECONDARY_BG_HOVER: "hover:bg-[#E65100]",
  SECONDARY_BG_LIGHT: "bg-[#FFE0B2]",
  SECONDARY_TEXT: "text-[#FF8C1A]",
  SECONDARY_BORDER: "border-[#FF8C1A]",

  // Accent Classes
  ACCENT_BG: "bg-amber-500",
  ACCENT_BG_HOVER: "hover:bg-amber-600",
  ACCENT_BG_LIGHT: "bg-amber-50",
  ACCENT_TEXT: "text-amber-500",
  ACCENT_BORDER: "border-amber-500",

  // Status Classes
  SUCCESS_BG: "bg-[#E91E63]",
  SUCCESS_BG_LIGHT: "bg-pink-50",
  SUCCESS_TEXT: "text-[#E91E63]",
  SUCCESS_BORDER: "border-[#E91E63]",

  WARNING_BG: "bg-amber-500",
  WARNING_BG_LIGHT: "bg-amber-50",
  WARNING_TEXT: "text-amber-500",
  WARNING_BORDER: "border-amber-500",

  ERROR_BG: "bg-red-600",
  ERROR_BG_LIGHT: "bg-red-50",
  ERROR_TEXT: "text-red-600",
  ERROR_BORDER: "border-red-600",
} as const;

// ===========================================
// REFERRAL SYSTEM CONSTANTS
// ===========================================

export const REFERRAL_CONFIG = {
  // Commission Rates (matches backend)
  COMMISSION_RATES: {
    LEVEL_1: 10, // 10%
    LEVEL_2: 5, // 5%
    LEVEL_3: 2, // 2%
  },

  // Level Names
  LEVEL_NAMES: {
    1: "Cấp 1 - Trực tiếp",
    2: "Cấp 2 - Gián tiếp",
    3: "Cấp 3 - Xa nhất",
  },

  // Level Colors (using new theme)
  LEVEL_COLORS: {
    1: {
      bg: "bg-blue-50",
      border: "border-blue-200",
      text: "text-blue-700",
      accent: "text-blue-600",
    },
    2: {
      bg: "bg-orange-50",
      border: "border-orange-200",
      text: "text-[#E65100]",
      accent: "text-[#FF8C1A]",
    },
    3: {
      bg: "bg-amber-50",
      border: "border-amber-200",
      text: "text-amber-700",
      accent: "text-amber-600",
    },
  },

  // Milestone Rewards
  MILESTONES: [
    { referrals: 5, reward: 50000, title: "Người giới thiệu mới" },
    { referrals: 20, reward: 200000, title: "Cộng tác viên tích cực" },
    { referrals: 50, reward: 500000, title: "Đại lý chuyên nghiệp" },
    { referrals: 100, reward: 1000000, title: "Chuyên gia giới thiệu" },
  ],
} as const;

// ===========================================
// APP CONSTANTS
// ===========================================

export const APP_CONFIG = {
  APP_NAME: "AffiliateNet",
  APP_VERSION: "2.0.0",
  API_VERSION: "v1",

  // Pagination
  DEFAULT_PAGE_SIZE: 20,
  MAX_PAGE_SIZE: 100,

  // Currency
  CURRENCY: "VND",
  CURRENCY_SYMBOL: "₫",
} as const;

// Helper Functions
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: APP_CONFIG.CURRENCY,
  }).format(amount);
};

export const formatNumber = (num: number): string => {
  return new Intl.NumberFormat("vi-VN").format(num);
};

export default COLORS;
