import type { Platform } from "@/services/cashbackService";
import { Plane, Shield, TrendingUp, Zap } from "lucide-react";

const PlatformTypeBadge: React.FC<{
  type: Platform["type"];
  isActive: boolean;
}> = ({ type, isActive }) => {
  let icon, text, bgColor;

  switch (type) {
    case "product":
      icon = <Zap size={14} className="mr-1" />;
      text = "Cashback SP";
      bgColor = isActive ? "bg-white/20" : "bg-green-100 text-green-700";
      break;
    case "trade":
      icon = <TrendingUp size={14} className="mr-1" />;
      text = "Rebate Trade";
      bgColor = isActive ? "bg-white/20" : "bg-yellow-100 text-yellow-700";
      break;
    case "service":
      icon = <Plane size={14} className="mr-1" />;
      text = "Dịch vụ/Du lịch";
      bgColor = isActive ? "bg-white/20" : "bg-orange-100 text-orange-700";
      break;
    case "finance":
      icon = <Shield size={14} className="mr-1" />;
      text = "Vay/Tài chính";
      bgColor = isActive ? "bg-white/20" : "bg-orange-100 text-orange-700";
      break;
    default:
      return null;
  }
  return (
    <div
      className={`flex items-center text-xs font-semibold px-2 py-0.5 rounded-full ${bgColor}`}
    >
      {icon}
      {text}
    </div>
  );
};
export default PlatformTypeBadge;
