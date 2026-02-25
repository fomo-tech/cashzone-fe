import React from "react";
import { cn } from "@/utils/lib";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "outline" | "ghost" | "destructive" | "secondary";
  size?: "default" | "sm" | "lg" | "icon";
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "default", ...props }, ref) => {
    const baseClasses =
      "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-bold transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50";

    const variants = {
      default:
        "bg-gradient-to-br from-orange-500 via-orange-600 to-amber-600 text-white shadow hover:from-[#C2185B] hover:to-[#F57C00]",
      destructive: "bg-red-600 text-white shadow-sm hover:bg-red-700",
      outline:
        "border border-gray-200 bg-white shadow-sm hover:bg-gray-50 hover:text-gray-900",
      secondary: "bg-gray-100 text-gray-900 shadow-sm hover:bg-gray-200",
      ghost: "hover:bg-gray-100 hover:text-gray-900",
    };

    const sizes = {
      default: "h-9 px-3 sm:px-4 py-2 text-sm",
      sm: "h-8 rounded-md px-2 sm:px-3 text-xs",
      lg: "h-10 rounded-md px-4 sm:px-8 text-sm sm:text-base",
      icon: "h-8 w-8 sm:h-9 sm:w-9",
    };

    return (
      <button
        className={cn(baseClasses, variants[variant], sizes[size], className)}
        ref={ref}
        {...props}
      />
    );
  },
);

Button.displayName = "Button";

export { Button };
