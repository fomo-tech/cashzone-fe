import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  BookOpen,
  ShoppingBag,
  Target,
  Wallet,
  TrendingUp,
  ChevronDown,
  ChevronUp,
  CheckCircle,
  AlertCircle,
  DollarSign,
  Gift,
  CreditCard,
  Smartphone,
  Globe,
  Clock,
  Shield,
} from "lucide-react";

interface GuideSection {
  id: string;
  title: string;
  icon: React.ElementType;
  description: string;
  steps: {
    title: string;
    content: string;
    icon?: React.ElementType;
  }[];
  tips?: string[];
}

const GUIDE_SECTIONS: GuideSection[] = [
  {
    id: "cashback",
    title: "Hướng dẫn Cashback khi Mua sắm",
    icon: ShoppingBag,
    description: "Kiếm tiền hoàn lại mỗi khi mua sắm trực tuyến",
    steps: [
      {
        title: "Bước 1: Tìm kiếm Merchant",
        content:
          "Truy cập trang Offers/Merchants, tìm kiếm cửa hàng bạn muốn mua sắm (Shopee, Lazada, Tiki, v.v...)",
        icon: Globe,
      },
      {
        title: "Bước 2: Nhấn vào Link Affiliate",
        content:
          "Click vào nút 'Mua ngay' hoặc 'Nhận ưu đãi' để được chuyển đến trang merchant qua link affiliate của chúng tôi.",
        icon: Target,
      },
      {
        title: "Bước 3: Hoàn tất Đơn hàng",
        content:
          "Mua sắm bình thường và hoàn tất thanh toán đơn hàng. Đảm bảo không tắt trình duyệt hoặc xóa cookie.",
        icon: CreditCard,
      },
      {
        title: "Bước 4: Chờ Cashback",
        content:
          "Cashback sẽ được ghi nhận trong vòng 24-72 giờ. Số tiền sẽ chuyển từ trạng thái 'Pending' sang 'Available' sau 30-60 ngày khi merchant xác nhận.",
        icon: Clock,
      },
      {
        title: "Bước 5: Rút tiền về Ví",
        content:
          "Khi cashback đã ở trạng thái 'Available', bạn có thể rút tiền về tài khoản ngân hàng, Momo hoặcví BEP20.",
        icon: Wallet,
      },
    ],
    tips: [
      "Luôn truy cập merchant qua link của chúng tôi để đảm bảo tracking",
      "Không sử dụng AdBlock hoặc các extension chặn quảng cáo",
      "Hoàn tất đơn hàng trong cùng một phiên duyệt web",
      "Không kết hợp với mã giảm giá bên ngoài (dùng mã của merchant)",
      "Kiểm tra điều kiện cashback của từng merchant (đơn tối thiểu, sản phẩm loại trừ...)",
    ],
  },
  {
    id: "tasks",
    title: "Làm Nhiệm vụ để Hoàn tiền",
    icon: Target,
    description: "Hoàn thành các nhiệm vụ để nhận thưởng ngay lập tức",
    steps: [
      {
        title: "Bước 1: Xem Danh sách Nhiệm vụ",
        content:
          "Vào mục 'Nhiệm vụ' hoặc 'Tasks' để xem tất cả nhiệm vụ đang có. Các nhiệm vụ được chia theo loại: Đăng ký, Cài đặt App, Khảo sát, v.v...",
        icon: BookOpen,
      },
      {
        title: "Bước 2: Chọn Nhiệm vụ Phù hợp",
        content:
          "Đọc kỹ yêu cầu của nhiệm vụ (thời gian hoàn thành, điều kiện, phần thưởng). Chọn nhiệm vụ phù hợp với bạn.",
        icon: CheckCircle,
      },
      {
        title: "Bước 3: Thực hiện Nhiệm vụ",
        content:
          "Click 'Tham gia' và làm theo hướng dẫn. Ví dụ: Đăng ký tài khoản mới, cài đặt app, hoàn thành khảo sát, mua sản phẩm...",
        icon: Smartphone,
      },
      {
        title: "Bước 4: Xác nhận Hoàn thành",
        content:
          "Sau khi hoàn thành, hệ thống sẽ tự động tracking. Một số nhiệm vụ cần bạn submit thông tin hoặc screenshot làm bằng chứng.",
        icon: Shield,
      },
      {
        title: "Bước 5: Nhận Thưởng",
        content:
          "Phần thưởng sẽ được cộng vào ví sau khi nhiệm vụ được xác minh (thường trong vòng 1-7 ngày tùy loại nhiệm vụ).",
        icon: Gift,
      },
    ],
    tips: [
      "Ưu tiên nhiệm vụ có phần thưởng cao và thời gian hoàn thành nhanh",
      "Đọc kỹ yêu cầu để tránh mất công làm không được duyệt",
      "Chụp ảnh màn hình làm bằng chứng nếu cần",
      "Kiểm tra trạng thái nhiệm vụ trong 'Lịch sử Nhiệm vụ'",
      "Không spam hoặc làm giả, tài khoản có thể bị khóa",
    ],
  },
  {
    id: "deposit",
    title: "Hướng dẫn Nạp tiền",
    icon: TrendingUp,
    description: "Nạp tiền vào tài khoản để tham gia các chương trình đặc biệt",
    steps: [
      {
        title: "Bước 1: Vào Mục Nạp tiền",
        content:
          "Truy cập 'Ví của tôi' -> 'Nạp tiền'. Hệ thống sẽ hiển thị các phương thức nạp tiền có sẵn.",
        icon: Wallet,
      },
      {
        title: "Bước 2: Chọn Phương thức",
        content:
          "Chọn phương thức phù hợp: Chuyển khoản ngân hàng, Momo, ZaloPay, hoặc Crypto (BEP20).",
        icon: CreditCard,
      },
      {
        title: "Bước 3: Nhập Số tiền",
        content:
          "Nhập số tiền muốn nạp (tối thiểu 50,000 VNĐ). Kiểm tra phí giao dịch (nếu có).",
        icon: DollarSign,
      },
      {
        title: "Bước 4: Thực hiện Chuyển khoản",
        content:
          "Chuyển khoản đúng số tiền và nội dung chuyển khoản theo hướng dẫn. Nội dung CẦN CHÍNH XÁC để hệ thống tự động xử lý.",
        icon: Smartphone,
      },
      {
        title: "Bước 5: Chờ Xác nhận",
        content:
          "Tiền sẽ được cộng vào tài khoản sau 5-30 phút (tùy phương thức). Kiểm tra lịch sử giao dịch hoặc liên hệ support nếu chậm.",
        icon: Clock,
      },
    ],
    tips: [
      "Chuyển khoản đúng nội dung để được xử lý tự động nhanh chóng",
      "Lưu lại biên lai giao dịch để đối chiếu nếu cần",
      "Không nạp từ tài khoản của người khác (có thể bị từ chối)",
      "Kiểm tra kỹ thông tin tài khoản nhận trước khi chuyển",
    ],
  },
  {
    id: "withdrawal",
    title: "Hướng dẫn Rút tiền",
    icon: Wallet,
    description: "Rút tiền từ ví về tài khoản ngân hàng hoặc ví điện tử",
    steps: [
      {
        title: "Bước 1: Kiểm tra Số dư",
        content:
          "Vào 'Ví của tôi' để xem số dư khả dụng. Chỉ số tiền 'Available' mới có thể rút (không bao gồm Pending).",
        icon: Wallet,
      },
      {
        title: "Bước 2: Cập nhật Thông tin Thanh toán",
        content:
          "Vào 'Cài đặt' -> 'Phương thức Thanh toán' để thêm/cập nhật tài khoản ngân hàng, Momo hoặc ví BEP20.",
        icon: CreditCard,
      },
      {
        title: "Bước 3: Tạo Yêu cầu Rút tiền",
        content:
          "Vào 'Rút tiền', chọn phương thức và nhập số tiền muốn rút (tối thiểu 100,000 VNĐ). Kiểm tra phí rút (nếu có).",
        icon: DollarSign,
      },
      {
        title: "Bước 4: Xác nhận Yêu cầu",
        content:
          "Xác nhận thông tin và gửi yêu cầu. Hệ thống sẽ gửi OTP qua email/SMS để xác thực (nếu bật bảo mật).",
        icon: Shield,
      },
      {
        title: "Bước 5: Chờ Xử lý",
        content:
          "Yêu cầu sẽ được xử lý trong vòng 1-3 ngày làm việc. Tiền sẽ được chuyển về tài khoản bạn đã đăng ký. Kiểm tra trạng thái trong 'Lịch sử Rút tiền'.",
        icon: Clock,
      },
    ],
    tips: [
      "Đảm bảo thông tin tài khoản chính xác để tránh chậm trễ",
      "Rút tiền trong giờ hành chính để được xử lý nhanh hơn",
      "Số tiền rút phải đạt mức tối thiểu (100,000 VNĐ)",
      "Có thể có phí rút tiền tùy phương thức (thường 10,000-50,000 VNĐ)",
      "Liên hệ support nếu yêu cầu quá 3 ngày chưa được xử lý",
    ],
  },
];

const AccordionItem: React.FC<{
  section: GuideSection;
  isOpen: boolean;
  onToggle: () => void;
}> = ({ section, isOpen, onToggle }) => {
  const Icon = section.icon;

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden transition-all duration-300 hover:shadow-xl">
      {/* Header */}
      <button
        onClick={onToggle}
        className="w-full px-6 py-5 flex items-center justify-between bg-gradient-to-r from-white to-gray-50 hover:from-gray-50 hover:to-gray-100 transition-all"
      >
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-500 via-orange-600 to-amber-600 flex items-center justify-center shadow-lg">
            <Icon className="w-6 h-6 text-white" />
          </div>
          <div className="text-left">
            <h3 className="text-lg font-bold text-gray-900">{section.title}</h3>
            <p className="text-sm text-gray-500 mt-0.5">
              {section.description}
            </p>
          </div>
        </div>
        <div className="flex-shrink-0">
          {isOpen ? (
            <ChevronUp className="w-6 h-6 text-[orange-600]" />
          ) : (
            <ChevronDown className="w-6 h-6 text-gray-400" />
          )}
        </div>
      </button>

      {/* Content */}
      {isOpen && (
        <div className="px-6 py-6 bg-gradient-to-b from-white to-gray-50 border-t border-gray-100">
          {/* Steps */}
          <div className="space-y-6 mb-6">
            {section.steps.map((step, index) => {
              const StepIcon = step.icon || CheckCircle;
              return (
                <div key={index} className="flex gap-4">
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[orange-600]/10 to-[#FF8C1A]/10 flex items-center justify-center border-2 border-[orange-600]/20">
                      <StepIcon className="w-5 h-5 text-[orange-600]" />
                    </div>
                  </div>
                  <div className="flex-1">
                    <h4 className="text-base font-bold text-gray-900 mb-2">
                      {step.title}
                    </h4>
                    <p className="text-sm text-gray-600 leading-relaxed">
                      {step.content}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Tips */}
          {section.tips && section.tips.length > 0 && (
            <div className="bg-gradient-to-r from-orange-50 to-pink-50 rounded-xl p-5 border border-orange-100">
              <div className="flex items-center gap-2 mb-3">
                <AlertCircle className="w-5 h-5 text-[#FF8C1A]" />
                <h4 className="text-sm font-bold text-gray-800">
                  💡 Mẹo quan trọng
                </h4>
              </div>
              <ul className="space-y-2">
                {section.tips.map((tip, index) => (
                  <li
                    key={index}
                    className="flex items-start gap-2 text-sm text-gray-700"
                  >
                    <span className="text-[orange-600] font-bold flex-shrink-0">
                      •
                    </span>
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

const GuidePage: React.FC = () => {
  const [openSections, setOpenSections] = useState<string[]>(["cashback"]);

  const toggleSection = (id: string) => {
    setOpenSections((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id],
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-pink-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-orange-500 via-orange-600 to-amber-600 shadow-xl mb-4">
            <BookOpen className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl  bg-gradient-to-br from-orange-500 via-orange-600 to-amber-600 bg-clip-text text-transparent mb-3">
            Hướng dẫn Sử dụng
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Tìm hiểu cách kiếm tiền, hoàn tiền và quản lý tài khoản của bạn một
            cách dễ dàng
          </p>
        </div>

        {/* Stats Section - Số liệu ấn tượng */}
        <div className="p-6 sm:p-8 lg:p-10 bg-white rounded-2xl shadow-lg mb-10">
          <div className="text-center mb-8">
            <h2 className="text-2xl sm:text-3xl font-black text-gray-800 mb-2">
              Những Con Số Ấn Tượng
            </h2>
            <p className="text-gray-600">
              Hàng ngàn người dùng đã tin tưởng và sử dụng dịch vụ của chúng tôi
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 max-w-5xl mx-auto">
            <div className="text-center p-4 md:p-6 bg-gradient-to-br from-gray-50 to-white rounded-xl md:rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-gray-100">
              <div className="w-12 h-12 md:w-14 md:h-14 bg-gradient-to-br from-orange-500 via-orange-600 to-amber-600 rounded-xl md:rounded-2xl mx-auto mb-3 md:mb-4 flex items-center justify-center">
                <svg
                  className="w-6 h-6 md:w-8 md:h-8 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                  />
                </svg>
              </div>
              <p className="text-2xl md:text-3xl font-black text-gray-800 mb-1">
                50K+
              </p>
              <p className="text-xs md:text-sm text-gray-500 font-medium">
                Người dùng
              </p>
            </div>

            <div className="text-center p-4 md:p-6 bg-gradient-to-br from-gray-50 to-white rounded-xl md:rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-gray-100">
              <div className="w-12 h-12 md:w-14 md:h-14 bg-gradient-to-br from-orange-500 via-orange-600 to-amber-600 rounded-xl md:rounded-2xl mx-auto mb-3 md:mb-4 flex items-center justify-center">
                <svg
                  className="w-6 h-6 md:w-8 md:h-8 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <p className="text-2xl md:text-3xl font-black text-gray-800 mb-1">
                450M+
              </p>
              <p className="text-xs md:text-sm text-gray-500 font-medium">
                Đã hoàn tiền
              </p>
            </div>

            <div className="text-center p-4 md:p-6 bg-gradient-to-br from-gray-50 to-white rounded-xl md:rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-gray-100">
              <div className="w-12 h-12 md:w-14 md:h-14 bg-gradient-to-br from-orange-500 via-orange-600 to-amber-600 rounded-xl md:rounded-2xl mx-auto mb-3 md:mb-4 flex items-center justify-center">
                <svg
                  className="w-6 h-6 md:w-8 md:h-8 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                  />
                </svg>
              </div>
              <p className="text-2xl md:text-3xl font-black text-gray-800 mb-1">
                1000+
              </p>
              <p className="text-xs md:text-sm text-gray-500 font-medium">
                Thương hiệu
              </p>
            </div>

            <div className="text-center p-4 md:p-6 bg-gradient-to-br from-gray-50 to-white rounded-xl md:rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-gray-100">
              <div className="w-12 h-12 md:w-14 md:h-14 bg-gradient-to-br from-orange-500 via-orange-600 to-amber-600 rounded-xl md:rounded-2xl mx-auto mb-3 md:mb-4 flex items-center justify-center">
                <svg
                  className="w-6 h-6 md:w-8 md:h-8 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"
                  />
                </svg>
              </div>
              <p className="text-2xl md:text-3xl font-black text-gray-800 mb-1">
                200+
              </p>
              <p className="text-xs md:text-sm text-gray-500 font-medium">
                Chiến dịch
              </p>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          {GUIDE_SECTIONS.map((section) => {
            const Icon = section.icon;
            return (
              <button
                key={section.id}
                onClick={() => toggleSection(section.id)}
                className={`p-4 rounded-xl border-2 transition-all duration-200 ${
                  openSections.includes(section.id)
                    ? "bg-gradient-to-br from-[orange-600]/10 to-[#FF8C1A]/10 border-[orange-600]/30 shadow-lg"
                    : "bg-white border-gray-200 hover:border-pink-200 hover:shadow-md"
                }`}
              >
                <Icon
                  className={`w-8 h-8 mx-auto mb-2 ${
                    openSections.includes(section.id)
                      ? "text-[orange-600]"
                      : "text-gray-400"
                  }`}
                />
                <p className="text-sm font-semibold text-gray-700 line-clamp-2">
                  {section.title.replace("Hướng dẫn ", "")}
                </p>
              </button>
            );
          })}
        </div>

        {/* Accordion */}
        <div className="space-y-4">
          {GUIDE_SECTIONS.map((section) => (
            <AccordionItem
              key={section.id}
              section={section}
              isOpen={openSections.includes(section.id)}
              onToggle={() => toggleSection(section.id)}
            />
          ))}
        </div>

        {/* Why Choose Us Section */}
        <div className="mt-10 p-6 sm:p-8 lg:p-12 bg-white rounded-2xl shadow-lg">
          <div className="text-center mb-8 sm:mb-10">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-gray-800 mb-3">
              Tại Sao Chọn Chúng Tôi?
            </h2>
            <p className="text-gray-600 text-base sm:text-lg max-w-2xl mx-auto">
              Những lý do khiến hàng ngàn người dùng tin tưởng và lựa chọn
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            <div className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-2xl p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border border-orange-100">
              <div className="w-14 h-14 bg-gradient-to-br from-orange-500 to-amber-600 rounded-xl flex items-center justify-center mb-4 shadow-lg">
                <svg
                  className="w-7 h-7 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-gray-800 mb-2">
                Hoàn Tiền Tức Thì
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Tiền hoàn được cộng tự động vào ví ngay sau khi đơn hàng được
                xác nhận
              </p>
            </div>

            <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border border-blue-100">
              <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-xl flex items-center justify-center mb-4 shadow-lg">
                <svg
                  className="w-7 h-7 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-gray-800 mb-2">
                An Toàn & Bảo Mật
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Thông tin cá nhân và giao dịch được mã hóa và bảo vệ tuyệt đối
              </p>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border border-purple-100">
              <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center mb-4 shadow-lg">
                <svg
                  className="w-7 h-7 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-gray-800 mb-2">
                Quà Tặng Hấp Dẫn
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Nhận thưởng và phần quà giá trị khi tham gia các sự kiện đặc
                biệt
              </p>
            </div>

            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border border-green-100">
              <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center mb-4 shadow-lg">
                <svg
                  className="w-7 h-7 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-gray-800 mb-2">
                Hỗ Trợ 24/7
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Đội ngũ chăm sóc khách hàng luôn sẵn sàng hỗ trợ mọi lúc, mọi
                nơi
              </p>
            </div>
          </div>
        </div>

        {/* How It Works Section */}
        <div className="mt-10 p-6 sm:p-8 lg:p-12 bg-gradient-to-br from-orange-500 via-orange-600 to-amber-600 rounded-2xl relative overflow-hidden shadow-xl">
          <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-white/5 rounded-full blur-3xl" />

          <div className="relative z-10">
            <div className="text-center mb-8 sm:mb-10 lg:mb-12">
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white mb-2 sm:mb-3">
                Cách Thức Hoạt Động
              </h2>
              <p className="text-white/90 text-base sm:text-lg max-w-2xl mx-auto">
                Chỉ 3 bước đơn giản để bắt đầu kiếm tiền hoàn ngay hôm nay
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              {/* Step 1 */}
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 hover:bg-white/15 transition-all duration-300 hover:-translate-y-2">
                <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mb-6 mx-auto shadow-xl">
                  <span className="text-3xl font-black bg-gradient-to-br from-orange-500 via-orange-600 to-amber-600 bg-clip-text text-transparent">
                    1
                  </span>
                </div>
                <h3 className="text-xl font-bold text-white mb-3 text-center">
                  Đăng Ký Tài Khoản
                </h3>
                <p className="text-white/80 text-center leading-relaxed">
                  Tạo tài khoản miễn phí chỉ trong 30 giây. Không cần thẻ tín
                  dụng hay ràng buộc.
                </p>
              </div>

              {/* Step 2 */}
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 hover:bg-white/15 transition-all duration-300 hover:-translate-y-2">
                <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mb-6 mx-auto shadow-xl">
                  <span className="text-3xl font-black bg-gradient-to-br from-orange-500 via-orange-600 to-amber-600 bg-clip-text text-transparent">
                    2
                  </span>
                </div>
                <h3 className="text-xl font-bold text-white mb-3 text-center">
                  Mua Sắm hoặc Làm Nhiệm Vụ
                </h3>
                <p className="text-white/80 text-center leading-relaxed">
                  Mua sắm tại 1000+ thương hiệu hoặc hoàn thành các nhiệm vụ đơn
                  giản để tích điểm.
                </p>
              </div>

              {/* Step 3 */}
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 hover:bg-white/15 transition-all duration-300 hover:-translate-y-2">
                <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mb-6 mx-auto shadow-xl">
                  <span className="text-3xl font-black bg-gradient-to-br from-orange-500 via-orange-600 to-amber-600 bg-clip-text text-transparent">
                    3
                  </span>
                </div>
                <h3 className="text-xl font-bold text-white mb-3 text-center">
                  Nhận Tiền Hoàn
                </h3>
                <p className="text-white/80 text-center leading-relaxed">
                  Tiền hoàn được tự động cộng vào ví. Rút về tài khoản ngân hàng
                  bất cứ lúc nào, 24/7.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Support */}
        <div className="mt-10 bg-gradient-to-br from-orange-500 via-orange-600 to-amber-600 rounded-2xl p-8 text-center text-white shadow-xl">
          <h3 className="text-2xl font-bold mb-3">Cần Hỗ trợ Thêm?</h3>
          <p className="text-white/90 mb-6 max-w-2xl mx-auto">
            Nếu bạn có bất kỳ câu hỏi nào hoặc gặp vấn đề, đội ngũ hỗ trợ của
            chúng tôi luôn sẵn sàng giúp đỡ 24/7
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <a
              href="mailto:support@example.com"
              className="px-6 py-3 bg-white text-[orange-600] font-bold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all"
            >
              📧 Email Support
            </a>
            <a
              href="#"
              className="px-6 py-3 bg-white/20 backdrop-blur-sm text-white font-bold rounded-xl border-2 border-white/50 hover:bg-white/30 transition-all"
            >
              💬 Live Chat
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GuidePage;
