import React from "react";
import { motion, AnimatePresence } from "framer-motion";

const cn = (...classes: (string | boolean | undefined | null)[]): string =>
  classes.filter(Boolean).join(" ");

interface SelectContextValue {
  value: string;
  onValueChange: (value: string) => void;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

const SelectContext = React.createContext<SelectContextValue | null>(null);

export interface SelectProps {
  value: string;
  onValueChange: (value: string) => void;
  children: React.ReactNode;
}

export const Select: React.FC<SelectProps> = ({
  value,
  onValueChange,
  children,
}) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const containerRef = React.useRef(null);

  // Đóng menu khi click bên ngoài
  React.useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <SelectContext.Provider value={{ value, onValueChange, isOpen, setIsOpen }}>
      <div className="relative w-full min-w-[160px]" ref={containerRef}>
        {children}
      </div>
    </SelectContext.Provider>
  );
};

export interface SelectTriggerProps {
  className?: string;
  children: React.ReactNode;
}

export const SelectTrigger: React.FC<SelectTriggerProps> = ({
  className,
  children,
}) => {
  const context = React.useContext(SelectContext);
  if (!context) throw new Error("SelectTrigger must be used within a Select");

  const { isOpen, setIsOpen } = context;

  return (
    <button
      type="button"
      className={cn(
        "flex h-11 w-full items-center justify-between rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm font-medium transition-all duration-200 hover:border-gray-300 hover:bg-gray-50/50 focus:outline-none focus:ring-2 focus:ring-pink-500/20 shadow-sm",
        isOpen && "border-pink-500 ring-2 ring-pink-500/10",
        className
      )}
      onClick={() => setIsOpen(!isOpen)}
    >
      <div className="flex items-center gap-2 truncate">{children}</div>
      <motion.svg
        animate={{ rotate: isOpen ? 180 : 0 }}
        transition={{ duration: 0.2 }}
        className="h-4 w-4 text-gray-400"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <polyline points="6,9 12,15 18,9" />
      </motion.svg>
    </button>
  );
};

export interface SelectValueProps {
  placeholder?: string;
  className?: string;
}

export const SelectValue: React.FC<SelectValueProps> = ({
  placeholder,
  className,
}) => {
  const context = React.useContext(SelectContext);
  if (!context) throw new Error("SelectValue must be used within a Select");
  return (
    <span
      className={cn("truncate", !context.value && "text-gray-400", className)}
    >
      {context.value || placeholder}
    </span>
  );
};

export interface SelectContentProps {
  className?: string;
  children: React.ReactNode;
}

export const SelectContent: React.FC<SelectContentProps> = ({
  className,
  children,
}) => {
  const context = React.useContext(SelectContext);
  const { isOpen } = context;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: 4, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 4, scale: 0.98 }}
          transition={{ duration: 0.15, ease: "easeOut" }}
          className={cn(
            "absolute z-50 mt-2 max-h-64 w-full overflow-hidden rounded-xl border border-gray-200 bg-white/95 backdrop-blur-xl p-1.5 shadow-xl ring-1 ring-black/5",
            className
          )}
        >
          <div className="overflow-y-auto max-h-60 scrollbar-hide">
            {children}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export const SelectItem = ({ value: itemValue, children, className }) => {
  const context = React.useContext(SelectContext);
  const { value: selectedValue, onValueChange, setIsOpen } = context;
  const isSelected = selectedValue === itemValue;

  return (
    <div
      className={cn(
        "relative flex w-full cursor-pointer select-none items-center rounded-lg py-2.5 px-3 text-sm transition-colors",
        isSelected
          ? "bg-pink-50 text-pink-700 font-semibold"
          : "text-gray-600 hover:bg-gray-100 hover:text-gray-900",
        className
      )}
      onClick={() => {
        onValueChange?.(itemValue);
        setIsOpen(false);
      }}
    >
      <span className="truncate">{children}</span>
      {isSelected && (
        <motion.div layoutId="selected-check" className="ml-auto">
          <svg
            className="h-4 w-4 text-pink-500"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            viewBox="0 0 24 24"
          >
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </motion.div>
      )}
    </div>
  );
};
