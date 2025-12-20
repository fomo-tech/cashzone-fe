import React from "react";

/**
 * Utility function for conditional class names
 */
const cn = (...classes: (string | boolean | undefined | null)[]): string =>
  classes.filter(Boolean).join(" ");

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  className?: string;
  type?: string;
  error?: boolean | string;
  icon?: React.ReactNode;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, error, icon, ...props }, ref) => {
    return (
      <div className="relative w-full group">
        {/* Icon support */}
        {icon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-pink-500 transition-colors pointer-events-none">
            {icon}
          </div>
        )}

        <input
          type={type}
          className={cn(
            "flex h-11 w-full rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm shadow-sm transition-all duration-200",
            "placeholder:text-gray-400",
            "disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-gray-100",
            // Padding adjustment if icon exists
            icon ? "pl-10" : "",
            // Error state
            error &&
              "border-red-500 focus:ring-red-500/10 focus:border-red-500",
            className
          )}
          ref={ref}
          {...props}
        />
      </div>
    );
  }
);

Input.displayName = "Input";
export { Input };
