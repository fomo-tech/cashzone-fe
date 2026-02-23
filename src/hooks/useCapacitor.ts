import { useState, useEffect } from "react";
import { Capacitor } from "@capacitor/core";

/**
 * Hook để detect và sử dụng Capacitor features
 */
export const useCapacitor = () => {
  const [isNative, setIsNative] = useState(false);
  const [platform, setPlatform] = useState<"ios" | "android" | "web">("web");

  useEffect(() => {
    const native = Capacitor.isNativePlatform();
    const plat = Capacitor.getPlatform() as "ios" | "android" | "web";

    setIsNative(native);
    setPlatform(plat);
  }, []);

  return {
    isNative,
    platform,
    isIOS: platform === "ios",
    isAndroid: platform === "android",
    isWeb: platform === "web",
  };
};

export default useCapacitor;
