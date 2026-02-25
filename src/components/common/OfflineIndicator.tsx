import { useEffect, useState } from "react";
import { WifiOff, Wifi } from "lucide-react";
import { isOnline, addNetworkListeners } from "@/utils/pwa";

const OfflineIndicator = () => {
  const [online, setOnline] = useState(isOnline());
  const [showOffline, setShowOffline] = useState(false);

  useEffect(() => {
    const cleanup = addNetworkListeners(
      () => {
        setOnline(true);
        setShowOffline(false);
      },
      () => {
        setOnline(false);
        setShowOffline(true);
      },
    );

    return cleanup;
  }, []);

  if (online) {
    return null;
  }

  return (
    <div
      className="fixed left-0 right-0 z-40 animate-slide-down"
      style={{ top: "calc(var(--safe-area-inset-top) + 3.5rem)" }}
    >
      <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-4 py-3 shadow-lg">
        <div className="max-w-7xl mx-auto flex items-center justify-center gap-2 text-sm sm:text-base font-bold">
          <WifiOff className="w-5 h-5 animate-pulse" />
          <span>
            Không có kết nối internet. Một số tính năng có thể không hoạt động.
          </span>
        </div>
      </div>
    </div>
  );
};

export default OfflineIndicator;
