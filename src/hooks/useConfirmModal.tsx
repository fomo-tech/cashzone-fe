import { useState, useCallback } from "react";

export function useConfirmModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [options, setOptions] = useState<{
    title?: string;
    content?: React.ReactNode;
    onConfirm?: () => void;
  }>({});

  const confirm = useCallback(
    (title: string, content: React.ReactNode, onConfirm: () => void) => {
      setOptions({ title, content, onConfirm });
      setIsOpen(true);
    },
    []
  );

  const close = useCallback(() => {
    setIsOpen(false);
  }, []);

  return { isOpen, options, confirm, close };
}
