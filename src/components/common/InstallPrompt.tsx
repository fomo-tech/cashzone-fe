import { useState, useEffect } from "react";
import { Download, X } from "lucide-react";
import {
  canShowInstallPrompt,
  showInstallPrompt,
  isAppInstalled,
} from "@/utils/pwa";

const InstallPrompt = () => {
  const [showPrompt, setShowPrompt] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    // Check if already installed
    setIsInstalled(isAppInstalled());

    // Listen for installable event
    const handleInstallable = () => {
      if (!isAppInstalled()) {
        setShowPrompt(true);
      }
    };

    // Listen for installed event
    const handleInstalled = () => {
      setIsInstalled(true);
      setShowPrompt(false);
    };

    window.addEventListener("pwa:installable", handleInstallable);
    window.addEventListener("pwa:installed", handleInstalled);

    // Check if can show prompt
    if (canShowInstallPrompt() && !isAppInstalled()) {
      // Delay showing prompt
      setTimeout(() => {
        setShowPrompt(true);
      }, 5000);
    }

    return () => {
      window.removeEventListener("pwa:installable", handleInstallable);
      window.removeEventListener("pwa:installed", handleInstalled);
    };
  }, []);

  const handleInstall = async () => {
    const accepted = await showInstallPrompt();
    if (accepted) {
      setShowPrompt(false);
    }
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    // Don't show again for this session
    sessionStorage.setItem("pwa-prompt-dismissed", "true");
  };

  // Don't show if already installed or dismissed
  if (
    isInstalled ||
    !showPrompt ||
    sessionStorage.getItem("pwa-prompt-dismissed")
  ) {
    return null;
  }

  return (
    <div
      className="fixed left-4 right-4 sm:left-auto sm:right-4 sm:w-96 z-50 animate-slide-up"
      style={{ bottom: "max(1rem, var(--safe-area-inset-bottom))" }}
    >
      <div className="bg-white rounded-2xl shadow-2xl border border-pink-100 p-4 sm:p-5">
        <button
          onClick={handleDismiss}
          className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-start gap-4">
          <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-[#E91E63] to-[#FF8C1A] rounded-xl flex items-center justify-center shadow-lg">
            <Download className="w-6 h-6 text-white" />
          </div>

          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-bold text-gray-900 mb-1">
              Cài đặt ứng dụng
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              Thêm Cashzone vào màn hình chính để truy cập nhanh và nhận thông
              báo
            </p>

            <div className="flex gap-2">
              <button
                onClick={handleInstall}
                className="flex-1 px-4 py-2.5 bg-gradient-to-r from-[#E91E63] to-[#FF8C1A] text-white rounded-xl font-semibold hover:shadow-lg transition-all duration-300 active:scale-95"
              >
                Cài đặt
              </button>
              <button
                onClick={handleDismiss}
                className="px-4 py-2.5 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-colors"
              >
                Sau
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InstallPrompt;
