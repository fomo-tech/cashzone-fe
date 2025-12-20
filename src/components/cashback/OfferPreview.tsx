import type { Platform } from "@/services/cashbackService";
import { HomeIcon, PercentIcon } from "lucide-react";

interface ProductOffer {
  id: string;
  title: string;
  shop: string;
  feeText: string; // Hoa hồng/Phí hoàn lại đã format
  rateText: string; // Tỷ lệ hoàn tiền/lãi suất
  priceText: string; // Giá đã format
  img: string; // URL
  platform?: string;
}

const OfferPreview: React.FC<{
  offer: ProductOffer;
  type: Platform["type"];
}> = ({ offer, type }) => {
  // Custom label based on type
  let rateLabel, feeLabel, rateColor;

  switch (type) {
    case "trade":
      rateLabel = "Rebate";
      feeLabel = "Hoàn phí:";
      rateColor = "text-pink-500";
      break;
    case "finance":
      rateLabel = "Ưu đãi Lãi suất";
      feeLabel = "Phí tư vấn:";
      rateColor = "text-blue-500";
      break;
    case "service":
      rateLabel = "Cashback";
      feeLabel = "Hoa hồng:";
      rateColor = "text-purple-500";
      break;
    case "product":
    default:
      rateLabel = "Tỉ lệ hoàn tiền";
      feeLabel = "Số tiền hoàn:";
      rateColor = "text-green-500";
  }

  return (
    <div className="mt-4 p-5 rounded-3xl bg-white border border-gray-100 flex gap-4 items-start shadow-md hover:shadow-xl transition-shadow duration-300 transform hover:-translate-y-1">
      {/* Hình sản phẩm */}
      <div className="flex-shrink-0 relative w-24 h-24">
        <img
          src={offer.img}
          alt={offer.title}
          className="w-full h-full rounded-xl object-cover shadow-inner"
        />
      </div>

      {/* Thông tin sản phẩm */}
      <div className="flex-1 flex flex-col justify-between min-w-0">
        <div className="flex flex-col gap-2">
          {/* Tên sản phẩm */}
          <div className="font-semibold text-gray-900 text-lg truncate">
            {offer.title}
          </div>

          {/* Giá sản phẩm */}
          <div className="text-gray-700 text-sm">
            <span className="font-medium">Giá:</span> {offer.priceText}
          </div>

          {/* Cashback / hoa hồng */}
          {offer.feeText && (
            <div className="flex items-center gap-2 text-sm mt-1 flex-wrap">
              <span className="flex items-center gap-1 px-3 py-1 rounded-full bg-green-600 text-white font-semibold shadow-md">
                {offer.rateText} {rateLabel}
              </span>
              <span className="text-gray-500">
                {feeLabel} <span className="font-medium">{offer.feeText}</span>
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
export default OfferPreview;
