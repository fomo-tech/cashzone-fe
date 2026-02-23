import { useAppStore } from "@/store/appStore";
import { useCallback } from "react";

type AsyncFn<T> = () => Promise<T>;
type OnError = (error: Error) => void;

export function useHandleSubmit() {
  const setLoading = useAppStore((state) => state.setLoading);

  const handleSubmit = useCallback(
    async function <T>(
      asyncFn: AsyncFn<T>,
      onError?: OnError
    ): Promise<T | undefined> {
      try {
        // Bật loading global
        setLoading?.("global", true);

        // Thực thi async function
        const result = await asyncFn();

        // Nếu là axios response, trả về result.data, nếu không thì trả result thẳng
        const data =
          result && typeof result === "object" && "data" in result
            ? (result as any).data
            : result;

        return data;
      } catch (err) {
        // Xử lý lỗi
        const error = err instanceof Error ? err : new Error("Unknown error");
        onError?.(error);
      } finally {
        // Tắt loading global
        setLoading?.("global", false);
      }
    },
    [setLoading]
  );

  return { handleSubmit };
}
