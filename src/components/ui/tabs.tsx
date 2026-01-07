import React from "react";
import { motion, AnimatePresence } from "framer-motion";

// Helper đơn giản thay thế cho cn/clsx nếu bạn không muốn phụ thuộc thư viện ngoài
const cn = (...classes: (string | boolean | undefined | null)[]): string =>
  classes.filter(Boolean).join(" ");

interface TabsContextValue {
  activeTab: string;
  onValueChange: (value: string) => void;
}

const TabsContext = React.createContext<TabsContextValue | null>(null);

export interface TabsProps {
  value: string;
  onValueChange: (value: string) => void;
  children: React.ReactNode;
  className?: string;
}

export interface TabsListProps {
  children: React.ReactNode;
  className?: string;
}

export interface TabsTriggerProps {
  value: string;
  children: React.ReactNode;
  className?: string;
}

export interface TabsContentProps {
  value: string;
  children: React.ReactNode;
  className?: string;
}

export const Tabs: React.FC<TabsProps> = ({
  value,
  onValueChange,
  children,
  className,
}) => {
  return (
    <TabsContext.Provider value={{ activeTab: value, onValueChange }}>
      <div className={cn("w-full", className)}>{children}</div>
    </TabsContext.Provider>
  );
};

export const TabsList: React.FC<TabsListProps> = ({ children, className }) => {
  return (
    <div
      className={cn(
        "inline-flex p-1.5 items-center justify-start rounded-2xl bg-gray-100/80 backdrop-blur-md border border-gray-200/50 shadow-inner gap-1",
        className
      )}
    >
      {children}
    </div>
  );
};

export const TabsTrigger: React.FC<TabsTriggerProps> = ({
  value,
  children,
  className,
}) => {
  const context = React.useContext(TabsContext);
  if (!context) throw new Error("TabsTrigger must be used within Tabs");

  const { activeTab, onValueChange } = context;
  const isActive = activeTab === value;

  return (
    <button
      className={cn(
        "relative flex items-center justify-center px-6 py-2 text-sm font-semibold transition-colors duration-300 focus:outline-none min-h-[40px] rounded-xl",
        isActive ? "text-white" : "text-gray-500 hover:text-gray-800"
      )}
      onClick={() => onValueChange(value)}
    >
      {isActive && (
        <motion.span
          layoutId="activeTabIndicator"
          className="absolute inset-0 rounded-xl shadow-[0_4px_12px_rgba(249,115,22,0.25)] bg-gradient-to-r from-orange-500 to-amber-500"
          transition={{
            type: "spring",
            stiffness: 400,
            damping: 30,
          }}
        />
      )}
      <div className={cn("relative z-10", className)}>{children}</div>
    </button>
  );
};

export const TabsContent: React.FC<TabsContentProps> = ({
  value,
  children,
  className,
}) => {
  const context = React.useContext(TabsContext);
  if (!context) throw new Error("TabsContent must be used within Tabs");

  const { activeTab } = context;

  return (
    <AnimatePresence mode="wait">
      {activeTab === value && (
        <motion.div
          key={value}
          initial={{ opacity: 0, x: 10, filter: "blur(4px)" }}
          animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
          exit={{ opacity: 0, x: -10, filter: "blur(4px)" }}
          transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
          className={cn("mt-4", className)}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
};
