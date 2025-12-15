import NotificationComponent, {
  type NotificationProps,
} from "@/components/common/Notification";
import { createRoot } from "react-dom/client";

export function notification({
  message,
  type = "info",
  description,
  duration = 3000,
  placePosition = "top-right",
}: NotificationProps) {
  const containerId = `alert-container-${placePosition}`;
  let container = document.getElementById(containerId);

  if (!container) {
    container = document.createElement("div");
    container.id = containerId;
    container.className = "fixed z-50 flex flex-col space-y-2";

    // Xử lý vị trí dựa trên placePosition
    switch (placePosition) {
      case "top-right":
        container.classList.add("top-4", "right-4");
        break;
      case "top-left":
        container.classList.add("top-4", "left-4");
        break;
      case "bottom-right":
        container.classList.add("bottom-4", "right-4");
        break;
      case "bottom-left":
        container.classList.add("bottom-4", "left-4");
        break;
    }

    document.body.appendChild(container);
  }

  const div = document.createElement("div");
  container.appendChild(div);

  const root = createRoot(div);

  const remove = () => {
    root.unmount();
    container?.removeChild(div);
  };

  root.render(
    <NotificationComponent
      message={message}
      description={description}
      type={type}
      duration={duration}
      onClose={remove}
    />
  );
}
