import React from "react";
import { X } from "lucide-react";

interface ConfirmModalProps {
  isOpen: boolean;
  title?: string;
  children: React.ReactNode;
  onClose: () => void;
  onConfirm?: () => void;
}

export const ConfirmModal = ({
  isOpen,
  title,
  children,
  onClose,
  onConfirm,
}: ConfirmModalProps) => {
  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 ${
        isOpen
          ? "visible opacity-100"
          : "invisible opacity-0 pointer-events-none"
      } transition-opacity duration-200`}
    >
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />

      <div
        className={`relative z-10 w-full max-w-md bg-white rounded-xl shadow-xl p-5 transition-all ${
          isOpen ? "scale-100 opacity-100" : "scale-95 opacity-0"
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          {title && <h2 className="text-lg font-semibold">{title}</h2>}
          <button onClick={onClose}>
            <X className="w-5 h-5" />
          </button>
        </div>

        <div>{children}</div>

        <div className="mt-6 flex justify-end gap-4">
          <button
            className="px-4 py-2 bg-gray-200 rounded-lg"
            onClick={onClose}
          >
            Hủy
          </button>
          <button
            className="px-4 py-2 bg-red-600 text-white rounded-lg"
            onClick={() => {
              onConfirm?.();
              onClose();
            }}
          >
            Xác Nhận
          </button>
        </div>
      </div>
    </div>
  );
};
