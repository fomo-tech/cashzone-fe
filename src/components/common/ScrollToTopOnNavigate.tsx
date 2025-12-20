import { useEffect } from "react";
import { useLocation } from "react-router-dom";

/**
 * Component tự động scroll lên đầu trang khi navigate sang route mới
 */
const ScrollToTopOnNavigate = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    // Scroll lên đầu trang mỗi khi pathname thay đổi
    window.scrollTo({
      top: 0,
      behavior: "instant", // Sử dụng instant để scroll nhanh khi chuyển trang
    });
  }, [pathname]);

  return null;
};

export default ScrollToTopOnNavigate;
