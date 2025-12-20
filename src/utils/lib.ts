import type { RoleEnum } from "./types";

export const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(amount);
};

export const checkRole = (
  roles: RoleEnum[],
  requiredRole: RoleEnum
): boolean => {
  return roles.includes(requiredRole);
};

//getTitle page with pathname
export const getTitlePage = (pathname: string): string => {
  switch (pathname) {
    case "/dashboard":
      return "Dashboard";
    case "/products":
      return "Products";
    case "/orders":
      return "Orders";
    case "/customers":
      return "Customers";
    case "/reports":
      return "Reports";
    case "/settings":
      return "Settings";
    default:
      return "Page";
  }
};

export const generateSlug = (text: string): string => {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
};

export const capitalizeFirstLetter = (text: string): string => {
  if (!text) return "";
  return text.charAt(0).toUpperCase() + text.slice(1);
};

export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + "...";
};

export const delay = (ms: number): Promise<void> => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailRegex.test(email);
};

export const isValidPhoneNumber = (phone: string): boolean => {
  const phoneRegex =
    /^(0|\+84)(3[2-9]|5[6|8|9]|7[0|6-9]|8[1-5]|9[0-4|6-9])[0-9]{7}$/;
  return phoneRegex.test(phone);
};

export const scrollToTop = (): void => {
  window.scrollTo({ top: 0, behavior: "smooth" });
};

export const getRandomInt = (min: number, max: number): number => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

export const mergeClasses = (...classes: (string | undefined)[]): string => {
  return classes.filter(Boolean).join(" ");
};

// Alias for mergeClasses to match shadcn/ui naming convention
export const cn = mergeClasses;
