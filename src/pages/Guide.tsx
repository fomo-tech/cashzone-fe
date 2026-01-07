import React, { useState } from "react";
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
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
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
          <h1 className="text-4xl font-extrabold bg-gradient-to-br from-orange-500 via-orange-600 to-amber-600 bg-clip-text text-transparent mb-3">
            Hướng dẫn Sử dụng
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Tìm hiểu cách kiếm tiền, hoàn tiền và quản lý tài khoản của bạn một
            cách dễ dàng
          </p>
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
