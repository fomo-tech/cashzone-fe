import { AppRouter } from "./routes/AppRouter";
import { useAuthInit } from "./hooks/useAuthInit";
import "sweetalert2/src/sweetalert2.scss";
import CustomToast from "./components/common/CustomToast";
import { useAppStore } from "./store/appStore";
import { useConfirmModal } from "./hooks/useConfirmModal";
import { ConfirmModal } from "./components/common/ConfirmModal";
import AuthModal from "./components/element/AuthModal";
import { useAuthStore } from "./store/authStore";
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
    </>
  );
}

export default App;
