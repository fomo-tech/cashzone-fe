// components/common/NotificationComponent.tsx
import React, { useEffect } from "react";
import { X, CheckCircle, XCircle, AlertTriangle, Info } from "lucide-react";

type NotificationType = "success" | "error" | "warning" | "info";

export interface NotificationProps {
  type?: NotificationType;
  message: string;
  description?: string;
  duration?: number;
  onClose?: () => void;
  placePosition?: "top-right" | "top-left" | "bottom-right" | "bottom-left";
}

const colors: Record<
  NotificationType,
  { bg: string; text: string; border: string; icon: string }
> = {
  success: {
    bg: "bg-green-50",
    text: "text-green-700",
    border: "border-green-500",
    icon: "text-green-600",
  },
  error: {
    bg: "bg-red-50",
    text: "text-red-700",
    border: "border-red-500",
    icon: "text-red-600",
  },
  warning: {
    bg: "bg-yellow-50",
    text: "text-yellow-700",
    border: "border-yellow-500",
    icon: "text-yellow-600",
  },
  info: {
    bg: "bg-orange-50",
    text: "text-orange-700",
    border: "border-orange-500",
    icon: "text-orange-600",
  },
};

const NotificationComponent: React.FC<NotificationProps> = ({
  type = "info",
  message,
  description,
  duration = 3000,
  onClose,
}) => {
  useEffect(() => {
    const timer = setTimeout(() => onClose?.(), duration);
    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const color = colors[type];

  return (
    <div
      className={`flex items-center justify-between p-3 md:p-4 rounded-xl md:rounded-2xl border ${color.border} ${color.bg} shadow-md mb-2 animate-fadeIn max-w-sm md:max-w-md`}
    >
      <div className="flex items-center space-x-2 md:space-x-3">
        <div
          className={`w-8 h-8 md:w-10 md:h-10 flex items-center justify-center rounded-lg md:rounded-xl ${color.bg} flex-shrink-0`}
        >
          {type === "success" && (
            <CheckCircle className={`${color.icon} animate-bounce`} size={18} />
          )}
          {type === "error" && (
            <XCircle className={`${color.icon} animate-pulse`} size={18} />
          )}
          {type === "warning" && (
            <AlertTriangle
              className={`${color.icon} animate-pulse`}
              size={18}
            />
          )}
          {type === "info" && (
            <Info className={`${color.icon} animate-pulse`} size={18} />
          )}
        </div>
        <div className="flex flex-col min-w-0">
          <div
            className={`font-semibold text-sm md:text-base ${color.text} truncate`}
          >
            {message}
          </div>
          {description && (
            <div className="text-xs md:text-sm text-gray-600 mt-0.5 line-clamp-2">
              {description}
            </div>
          )}
        </div>
      </div>
      <button
        onClick={onClose}
        className="ml-2 md:ml-4 text-gray-400 hover:text-gray-700 transition-colors flex-shrink-0"
      >
        <X className="w-3.5 h-3.5 md:w-4 md:h-4" />
      </button>
    </div>
  );
};

export default NotificationComponent;
