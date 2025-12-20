import { useState } from "react";

interface ConfirmModalState {
  isOpen: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  type?: "danger" | "warning" | "info";
  confirmText?: string;
  cancelText?: string;
}

export function useConfirmModal() {
  const [confirmModal, setConfirmModal] = useState<ConfirmModalState>({
    isOpen: false,
    title: "",
    message: "",
    onConfirm: () => {},
    type: "warning",
  });

  const showConfirm = (options: Omit<ConfirmModalState, "isOpen">) => {
    setConfirmModal({
      ...options,
      isOpen: true,
    });
  };

  const hideConfirm = () => {
    setConfirmModal((prev) => ({ ...prev, isOpen: false }));
  };

  return {
    confirmModal,
    showConfirm,
    hideConfirm,
  };
}
