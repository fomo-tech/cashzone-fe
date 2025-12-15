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
  { bg: string; text: string; border: string }
> = {
  success: {
    bg: "bg-green-50",
    text: "text-green-700",
    border: "border-green-500",
  },
  error: { bg: "bg-red-50", text: "text-red-700", border: "border-red-500" },
  warning: {
    bg: "bg-yellow-50",
    text: "text-yellow-700",
    border: "border-yellow-500",
  },
  info: { bg: "bg-blue-50", text: "text-blue-700", border: "border-blue-500" },
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
      className={`flex items-center justify-between p-4 rounded-2xl border ${color.border} ${color.bg} shadow-md mb-2 animate-fadeIn`}
    >
      <div className="flex items-center space-x-3">
        <div
          className={`w-12 h-12 flex items-center justify-center rounded-xl ${color.bg}`}
        >
          {type === "success" && (
            <CheckCircle className="text-green-500" size={20} />
          )}
          {type === "error" && <XCircle className="text-red-500" size={20} />}
          {type === "warning" && (
            <AlertTriangle className="text-yellow-500" size={20} />
          )}
          {type === "info" && <Info className="text-blue-500" size={20} />}
        </div>
        <div className="flex flex-col">
          <div className={`font-medium ${color.text}`}>{message}</div>
          {description && (
            <div className="text-sm text-gray-600">{description}</div>
          )}
        </div>
      </div>
      <button
        onClick={onClose}
        className="ml-4 text-gray-400 hover:text-gray-700"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};

export default NotificationComponent;
