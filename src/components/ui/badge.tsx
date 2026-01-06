import React from "react";
import { cn } from "@/utils/lib";

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "secondary" | "destructive" | "outline";
}

function badgeVariants({
  variant = "default",
}: {
  variant?: BadgeProps["variant"];
}) {
  const variants = {
    default:
      "border-transparent bg-orange-600 text-white shadow hover:bg-orange-700",
    secondary: "border-transparent bg-gray-100 text-gray-900 hover:bg-gray-200",
    destructive:
      "border-transparent bg-red-600 text-white shadow hover:bg-red-700",
    outline: "text-gray-900 border-gray-200",
  };

  return cn(
    "inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
    variants[variant]
  );
}

const Badge = React.forwardRef<HTMLDivElement, BadgeProps>(
  ({ className, variant, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(badgeVariants({ variant }), className)}
        {...props}
      />
    );
  }
);
Badge.displayName = "Badge";

export { Badge, badgeVariants };
