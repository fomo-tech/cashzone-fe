import { useState, useCallback } from "react";

export function useCopy(timeout = 1500) {
  const [copied, setCopied] = useState(false);

  const copy = useCallback(
    async (text: string) => {
      if (!text) return false;

      try {
        await navigator.clipboard.writeText(text);
        setCopied(true);

        setTimeout(() => setCopied(false), timeout);
        return true;
      } catch (err) {
        console.error("Copy failed", err);
        setCopied(false);
        return false;
      }
    },
    [timeout]
  );

  return { copied, copy };
}
