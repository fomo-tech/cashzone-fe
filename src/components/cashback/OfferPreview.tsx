import type { Platform } from "@/services/cashbackService";
import { ExternalLink } from "lucide-react";

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
  cashbackLink?: string; // Link hoàn tiền để click vào
}> = ({ offer, type, cashbackLink }) => {
  // Custom label based on type
  let rateLabel, feeLabel, rateColor;

  switch (type) {
    case "trade":
      rateLabel = "Rebate";
      feeLabel = "Hoàn phí:";
      rateColor = "text-orange-500";
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

  const handleClick = () => {
    if (cashbackLink) {
      window.open(cashbackLink, "_blank", "noopener,noreferrer");
    }
  };

  return (
    <div
      className={`mt-4 p-5 rounded-2xl bg-white border border-gray-200 flex gap-4 items-start shadow-sm hover:shadow-md transition-all duration-300 ${
        cashbackLink ? "cursor-pointer hover:border-pink-400" : ""
      }`}
      onClick={handleClick}
      role={cashbackLink ? "button" : undefined}
      tabIndex={cashbackLink ? 0 : undefined}
    >
      {/* Hình sản phẩm */}
      <div className="flex-shrink-0 relative w-24 h-24 sm:w-28 sm:h-28">
        <img
          src={offer.img}
          alt={offer.title}
          className="w-full h-full rounded-lg object-cover"
        />
        {cashbackLink && (
          <div className="absolute -top-1 -right-1 bg-orange-500 text-white rounded-full p-1 shadow">
            <ExternalLink size={12} />
          </div>
        )}
      </div>

      {/* Thông tin sản phẩm */}
      <div className="flex-1 flex flex-col justify-between min-w-0">
        <div className="flex flex-col gap-2.5">
          {/* Tên sản phẩm */}
          <div className="font-semibold text-gray-900 text-base sm:text-lg line-clamp-2">
            {offer.title}
          </div>

          {/* Giá sản phẩm */}
          <div className="text-gray-600 text-sm sm:text-base">
            <span className="font-medium">Giá:</span>{" "}
            <span className="font-semibold text-gray-900">
              {offer.priceText}
            </span>
          </div>

          {/* Cashback / hoa hồng */}
          {offer.feeText && (
            <div className="flex flex-col gap-1.5">
              {/* Tỉ lệ hoàn tiền */}
              <div className="flex items-center gap-2 flex-wrap">
                <span className="px-3 py-1.5 rounded-lg bg-green-500 text-white font-semibold text-sm sm:text-base">
                  {offer.rateText} {rateLabel}
                </span>
              </div>

              {/* Số tiền hoàn */}
              <div className="flex items-center gap-2 text-sm">
                <span className="text-gray-600">{feeLabel}</span>
                <span className="font-semibold text-green-600">
                  {offer.feeText}
                </span>
              </div>
            </div>
          )}

          {/* Clickable indicator */}
          {cashbackLink && (
            <div className="flex items-center gap-1 text-xs text-orange-600 font-medium">
              <ExternalLink size={12} />
              <span>Click để mua</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
export default OfferPreview;
