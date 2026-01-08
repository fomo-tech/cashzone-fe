import "swiper/css";

import { AppRouter } from "./routes/AppRouter";
import { useAuthInit } from "./hooks/useAuthInit";
import "sweetalert2/src/sweetalert2.scss";
import CustomToast from "./components/common/CustomToast";
import { useAppStore } from "./store/appStore";
import AuthModal from "./components/element/AuthModal";
import { Toaster } from "react-hot-toast";
import ScrollToTop from "./components/common/ScrollToTop";
import ReferralCodeTracker from "./components/common/ReferralCodeTracker";
import { WalletProvider } from "./context/WalletContext";
import { useSocketNotifications } from "./hooks/useSocketNotifications";
import toast from "react-hot-toast";
// import InstallPrompt from "./components/common/InstallPrompt";
// import OfflineIndicator from "./components/common/OfflineIndicator";

function App() {
  useAuthInit();
  const { toast: customToast } = useAppStore();

  // Setup socket notifications
  useSocketNotifications({
    onNewNotification: (notification) => {
      // Show toast notification
      const message = notification.message
        ? `${notification.title}\n${notification.message}`
        : notification.title || "Thông báo mới";

      toast.success(message, {
        duration: 5000,
        style: {
          maxWidth: "500px",
        },
      });
    },
    onBroadcastNotification: (notification) => {
      // Show broadcast notification
      const message = notification.message
        ? `${notification.title}\n${notification.message}`
        : notification.title || "Thông báo";

      toast(message, {
        duration: 5000,
        icon: "📢",
        style: {
          maxWidth: "500px",
        },
      });
    },
  });

  return (
    <WalletProvider>
      <ReferralCodeTracker />
      <AppRouter />;
      <CustomToast
        title={customToast?.title || ""}
        type={customToast?.type || "success"}
        isVisible={customToast?.isVisible || false}
        timer={customToast?.timer || 3000}
      />
      <AuthModal />
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: "#fff",
            color: "#363636",
            padding: "16px",
            borderRadius: "12px",
            boxShadow: "0 10px 25px rgba(0, 0, 0, 0.1)",
          },
          success: {
            iconTheme: {
              primary: "#10B981",
              secondary: "#fff",
            },
          },
          error: {
            iconTheme: {
              primary: "#EF4444",
              secondary: "#fff",
            },
          },
        }}
      />
      <ScrollToTop />
      {/* <InstallPrompt />
      <OfflineIndicator /> */}
    </WalletProvider>
  );
}

export default App;
