import { useEffect } from "react";
import { referralCodeUtils } from "@/utils/referralCode";

// Component để tự động lưu referral code từ URL vào sessionStorage
const ReferralCodeTracker: React.FC = () => {
  useEffect(() => {
    // Kiểm tra và lưu referral code khi app khởi động hoặc URL thay đổi
    referralCodeUtils.getFromUrlOrStorage();
  }, []);

  return null; // Component này không render gì
};

export default ReferralCodeTracker;
