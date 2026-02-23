import { Camera, CameraResultType, CameraSource } from "@capacitor/camera";
import { Capacitor } from "@capacitor/core";

/**
 * Chụp ảnh hoặc chọn từ thư viện
 */
export const takePicture = async (options?: {
  source?: "camera" | "gallery";
  quality?: number;
}) => {
  if (!Capacitor.isNativePlatform()) {
    // Web fallback: use input file
    return new Promise<string>((resolve) => {
      const input = document.createElement("input");
      input.type = "file";
      input.accept = "image/*";
      input.onchange = (e: any) => {
        const file = e.target.files[0];
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.readAsDataURL(file);
      };
      input.click();
    });
  }

  // Native camera
  const image = await Camera.getPhoto({
    quality: options?.quality || 90,
    allowEditing: true,
    resultType: CameraResultType.DataUrl,
    source:
      options?.source === "gallery" ? CameraSource.Photos : CameraSource.Camera,
  });

  return image.dataUrl!;
};

/**
 * Upload screenshot đơn hàng
 */
export const uploadOrderScreenshot = async () => {
  const imageData = await takePicture({ source: "gallery" });

  // Convert to blob
  const response = await fetch(imageData);
  const blob = await response.blob();

  return new File([blob], "order-screenshot.jpg", { type: "image/jpeg" });
};

export default takePicture;
