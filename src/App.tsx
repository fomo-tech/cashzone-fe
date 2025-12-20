import { AppRouter } from "./routes/AppRouter";
import { useAuthInit } from "./hooks/useAuthInit";
import "sweetalert2/src/sweetalert2.scss";
import CustomToast from "./components/common/CustomToast";
import { useAppStore } from "./store/appStore";
import { useConfirmModal } from "./hooks/useConfirmModal";
import { ConfirmModal } from "./components/common/ConfirmModal";
import AuthModal from "./components/element/AuthModal";
import { useAuthStore } from "./store/authStore";
import { Toaster } from "react-hot-toast";
import ScrollToTop from "./components/common/ScrollToTop";

function App() {
  useAuthInit();
  const { toast } = useAppStore();
  const { isAuthModalOpen, handleToggleAuthModal } = useAuthStore();

  return (
    <>
      <AppRouter />;
      <CustomToast
        title={toast?.title || ""}
        type={toast?.type || "success"}
        isVisible={toast?.isVisible || false}
        timer={toast?.timer || 3000}
      />
      <AuthModal onClose={handleToggleAuthModal} isOpen={isAuthModalOpen} />
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
    </>
  );
}

export default App;
