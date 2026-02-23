import { Share } from "@capacitor/share";
import { Capacitor } from "@capacitor/core";

/**
 * Share affiliate link qua native share sheet
 */
export const shareAffiliateLink = async (link: {
  url: string;
  productName?: string;
  cashbackRate?: number;
}) => {
  if (!Capacitor.isNativePlatform()) {
    // Fallback to Web Share API hoặc copy to clipboard
    if (navigator.share) {
      await navigator.share({
        title: `${link.productName || "Sản phẩm"} - Hoàn tiền ${link.cashbackRate}%`,
        text: `Mua qua link này nhận ${link.cashbackRate}% hoàn tiền!`,
        url: link.url,
      });
    } else {
      await navigator.clipboard.writeText(link.url);
      alert("Đã copy link!");
    }
    return;
  }

  // Native share
  await Share.share({
    title: `${link.productName || "Sản phẩm"} - BagBack`,
    text: `🎁 Mua qua link này nhận ${link.cashbackRate}% hoàn tiền!\n\n${link.url}`,
    url: link.url,
    dialogTitle: "Chia sẻ link affiliate",
  });
};

export default shareAffiliateLink;
