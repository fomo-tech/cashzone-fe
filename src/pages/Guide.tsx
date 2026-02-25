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
  Users,
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
    title: "Hướng dẫn Hoàn Tiền Mua Sắm",
    icon: ShoppingBag,
    description:
      "Nhận hoàn tiền ngay khi mua sắm tại hơn 1000+ thương hiệu lớn",
    steps: [
      {
        title: "Bước 1: Tìm kiếm Thương hiệu",
        content:
          "Truy cập trang 'Ưu đãi' hoặc 'Thương hiệu', sử dụng thanh tìm kiếm để tìm cửa hàng bạn muốn mua sắm (Shopee, Lazada, Tiki, Sendo, v.v.). Mỗi thương hiệu có mức hoàn tiền khác nhau từ 1%-30% giá trị đơn hàng.",
        icon: Globe,
      },
      {
        title: "Bước 2: Kích hoạt Link Hoàn Tiền",
        content:
          "Nhấn vào nút 'Mua ngay' hoặc 'Nhận ưu đãi' để được chuyển đến trang thương hiệu qua link hoàn tiền của chúng tôi. Link sẽ tự động ghi nhận đơn hàng của bạn để tính hoàn tiền. Lưu ý: Link có hiệu lực trong 24 giờ.",
        icon: Target,
      },
      {
        title: "Bước 3: Mua Sắm & Thanh Toán",
        content:
          "Mua sắm bình thường và hoàn tất thanh toán đơn hàng. QUAN TRỌNG: Không tắt trình duyệt, xóa cookie hoặc sử dụng mã giảm giá từ nguồn khác. Hoàn tất đơn hàng trong cùng một phiên duyệt web để đảm bảo tracking chính xác.",
        icon: CreditCard,
      },
      {
        title: "Bước 4: Theo Dõi Hoàn Tiền",
        content:
          "Sau 24-72 giờ, hoàn tiền sẽ được ghi nhận vào ví với trạng thái 'Đang chờ' (Pending). Vào mục 'Lịch sử hoàn tiền' để theo dõi tình trạng đơn hàng. Tiền hoàn sẽ chuyển sang 'Khả dụng' (Available) sau 30-90 ngày khi thương hiệu xác nhận đơn hàng không bị hoàn trả.",
        icon: Clock,
      },
      {
        title: "Bước 5: Rút Tiền Về Tài Khoản",
        content:
          "Khi hoàn tiền đã ở trạng thái 'Khả dụng', bạn có thể rút về tài khoản ngân hàng, Momo, ZaloPay hoặc ví điện tử BEP20. Số tiền rút tối thiểu là 100,000 VNĐ. Thời gian xử lý: 1-3 ngày làm việc.",
        icon: Wallet,
      },
    ],
    tips: [
      "Luôn truy cập thương hiệu qua link của chúng tôi để đảm bảo được tracking hoàn tiền",
      "Tắt AdBlock, extension chặn quảng cáo hoặc VPN khi mua sắm",
      "Không mở nhiều tab hoặc sử dụng chế độ ẩn danh (Incognito)",
      "Hoàn tất đơn hàng trong vòng 24 giờ sau khi nhấn link hoàn tiền",
      "Chỉ sử dụng mã giảm giá có sẵn trên trang thương hiệu, không dùng mã từ nguồn khác",
      "Kiểm tra điều kiện hoàn tiền: đơn hàng tối thiểu, sản phẩm loại trừ, thời gian khuyến mãi",
      "Giữ lại email xác nhận đơn hàng để đối chiếu nếu cần hỗ trợ",
    ],
  },
  {
    id: "referral",
    title: "Chương Trình Giới Thiệu Bạn Bè",
    icon: Users,
    description: "Nhận hoa hồng 3 cấp từ hoạt động của người bạn giới thiệu",
    steps: [
      {
        title: "Bước 1: Lấy Link Giới Thiệu",
        content:
          "Vào trang 'Giới thiệu' hoặc 'Referral' để lấy link giới thiệu cá nhân của bạn. Mỗi tài khoản có một mã giới thiệu độc nhất (Referral Code) và link riêng biệt. Bạn có thể chia sẻ qua mạng xã hội, tin nhắn hoặc email.",
        icon: Globe,
      },
      {
        title: "Bước 2: Chia Sẻ Link",
        content:
          "Gửi link giới thiệu cho bạn bè, người thân hoặc chia sẻ trên các nền tảng mạng xã hội (Facebook, Zalo, Telegram, TikTok...). Người đăng ký qua link của bạn sẽ tự động trở thành người được giới thiệu cấp 1 (F1).",
        icon: Target,
      },
      {
        title: "Bước 3: Bạn Bè Đăng Ký & Mua Sắm",
        content:
          "Khi bạn bè đăng ký qua link của bạn và bắt đầu mua sắm hoàn tiền, bạn sẽ nhận được % hoa hồng từ hoàn tiền của họ. Hệ thống tính toán theo 3 cấp: F1 (người bạn trực tiếp giới thiệu), F2 (người F1 giới thiệu), F3 (người F2 giới thiệu).",
        icon: ShoppingBag,
      },
      {
        title: "Bước 4: Nhận Hoa Hồng 3 Cấp",
        content:
          "Hoa hồng được tính theo tỷ lệ: F1 (10% hoàn tiền), F2 (5% hoàn tiền), F3 (2% hoàn tiền). Ví dụ: F1 nhận 100,000đ hoàn tiền → Bạn nhận 10,000đ. Hoa hồng được cộng tự động vào ví với trạng thái 'Khả dụng' ngay lập tức.",
        icon: DollarSign,
      },
      {
        title: "Bước 5: Theo Dõi & Phát Triển",
        content:
          "Vào mục 'Thống kê giới thiệu' để xem số lượng F1/F2/F3, tổng hoa hồng đã nhận và biểu đồ tăng trưởng. Bạn có thể xây dựng đội nhóm không giới hạn và thu nhập thụ động từ hệ thống 3 cấp.",
        icon: TrendingUp,
      },
    ],
    tips: [
      "Hướng dẫn F1 cách mua sắm hoàn tiền để họ có trải nghiệm tốt và tiếp tục sử dụng",
      "Chia sẻ các deal tốt, mã giảm giá để thu hút F1 mua sắm nhiều hơn",
      "Tạo nhóm Telegram/Zalo để hỗ trợ F1 và chia sẻ kinh nghiệm",
      "Hoa hồng F1 cao hơn, nên tập trung giới thiệu trực tiếp nhiều người",
      "Càng nhiều F1 active mua sắm, thu nhập hoa hồng càng ổn định",
      "Không spam hoặc gửi link giới thiệu vào các nhóm không cho phép",
      "Xây dựng uy tín cá nhân để F1 tin tưởng và giới thiệu tiếp (tạo F2, F3)",
    ],
  },
  {
    id: "daily",
    title: "Hoạt Động Hàng Ngày",
    icon: Target,
    description: "Kiếm thêm thu nhập từ các hoạt động đơn giản mỗi ngày",
    steps: [
      {
        title: "Bước 1: Điểm Danh Hàng Ngày",
        content:
          "Vào mục 'Điểm danh' (Check-in) mỗi ngày để nhận thưởng tích lũy. Bạn sẽ nhận từ 500-5,000 xu/ngày tùy theo chuỗi ngày điểm danh liên tiếp. Chuỗi 7 ngày sẽ nhận thưởng đặc biệt, chuỗi 30 ngày nhận thưởng VIP.",
        icon: CheckCircle,
      },
      {
        title: "Bước 2: Quay Vòng May Mắn",
        content:
          "Mỗi ngày bạn có 1 lượt quay miễn phí. Phần thưởng bao gồm: tiền mặt (1,000-100,000đ), xu thưởng, voucher giảm giá hoặc lượt quay thêm. Mua thêm lượt quay bằng xu tích lũy để tăng cơ hội trúng thưởng lớn.",
        icon: Gift,
      },
      {
        title: "Bước 3: Hoàn Thành Nhiệm Vụ",
        content:
          "Kiểm tra danh sách nhiệm vụ hàng ngày/tuần/tháng: Đăng nhập, mua sắm đơn hàng đầu tiên, giới thiệu bạn bè, chia sẻ mạng xã hội, v.v. Mỗi nhiệm vụ hoàn thành sẽ nhận xu hoặc tiền thưởng.",
        icon: BookOpen,
      },
      {
        title: "Bước 4: Tham Gia Sự Kiện",
        content:
          "Theo dõi các sự kiện đặc biệt theo mùa: Tết, 8/3, Black Friday, 11.11, 12.12... Tham gia minigame, thử thách hoặc cuộc thi để nhận thưởng lớn như iPhone, tiền mặt, voucher shopping.",
        icon: Smartphone,
      },
      {
        title: "Bước 5: Đổi Xu Tích Lũy",
        content:
          "Sử dụng xu tích lũy để đổi voucher giảm giá, rút tiền mặt (10,000 xu = 10,000đ) hoặc mua thêm lượt quay vòng may mắn. Xu không có hạn sử dụng và được tích lũy vĩnh viễn trong tài khoản.",
        icon: DollarSign,
      },
    ],
    tips: [
      "Điểm danh đều đặn mỗi ngày để nhận thưởng chuỗi ngày cao",
      "Hoàn thành nhiệm vụ hàng ngày trước 23:59 để không bỏ lỡ",
      "Theo dõi thông báo để không bỏ lỡ sự kiện đặc biệt có giải thưởng lớn",
      "Tích lũy xu từ các hoạt động nhỏ để đổi phần thưởng có giá trị",
      "Tham gia đầy đủ các hoạt động để tăng điểm thành viên lên VIP",
      "Thành viên VIP nhận thưởng điểm danh cao hơn và ưu đãi đặc biệt",
      "Kết hợp mua sắm hoàn tiền + hoạt động hàng ngày để tối đa hóa thu nhập",
    ],
  },
  {
    id: "withdrawal",
    title: "Hướng Dẫn Rút Tiền",
    icon: Wallet,
    description: "Rút tiền hoàn về tài khoản ngân hàng hoặc ví điện tử",
    steps: [
      {
        title: "Bước 1: Kiểm Tra Số Dư Khả Dụng",
        content:
          "Vào 'Ví của tôi' để xem tổng số dư. Chỉ số tiền ở trạng thái 'Khả dụng' (Available Balance) mới có thể rút. Tiền hoàn đang chờ xác nhận (Pending) từ thương hiệu chưa thể rút. Kiểm tra mục 'Lịch sử giao dịch' để biết chi tiết.",
        icon: Wallet,
      },
      {
        title: "Bước 2: Thêm Phương Thức Thanh Toán",
        content:
          "Vào 'Cài đặt' → 'Phương thức thanh toán' để thêm tài khoản ngân hàng (ATM/Internet Banking), Momo, ZaloPay hoặc địa chỉ ví BEP20 (USDT). Nhập đầy đủ: Số tài khoản, Tên chủ tài khoản, Ngân hàng. Thông tin cần CHÍNH XÁC 100%.",
        icon: CreditCard,
      },
      {
        title: "Bước 3: Tạo Yêu Cầu Rút Tiền",
        content:
          "Vào mục 'Rút tiền', chọn phương thức rút (Ngân hàng/Momo/ZaloPay/BEP20) và nhập số tiền muốn rút. Số tiền tối thiểu: 100,000 VNĐ. Phí rút tiền: 10,000-30,000 VNĐ tùy phương thức (BEP20: 2 USDT). Số tiền thực nhận = Số tiền rút - Phí.",
        icon: DollarSign,
      },
      {
        title: "Bước 4: Xác Thực Bảo Mật",
        content:
          "Nhập mật khẩu giao dịch hoặc mã OTP được gửi qua email/SMS để xác nhận yêu cầu rút tiền. Đây là lớp bảo mật quan trọng để bảo vệ tài khoản của bạn. Nếu chưa thiết lập mật khẩu giao dịch, vào 'Cài đặt bảo mật' để tạo ngay.",
        icon: Shield,
      },
      {
        title: "Bước 5: Chờ Xử Lý & Nhận Tiền",
        content:
          "Yêu cầu rút tiền được xử lý trong 1-3 ngày làm việc (T2-T6, không bao gồm cuối tuần và lễ). Ngân hàng/Momo/ZaloPay: 1-2 ngày. BEP20: 30 phút - 24 giờ. Kiểm tra trạng thái trong 'Lịch sử rút tiền'. Liên hệ support nếu quá 3 ngày chưa nhận được tiền.",
        icon: Clock,
      },
    ],
    tips: [
      "Đảm bảo thông tin tài khoản 100% chính xác để tránh chậm trễ hoặc thất lạc tiền",
      "Rút tiền vào T2-T5 (giờ hành chính) để được xử lý nhanh nhất",
      "Tránh rút tiền vào cuối tuần, ngày lễ vì ngân hàng không làm việc",
      "Lưu ý phí rút tiền và số tiền tối thiểu trước khi tạo yêu cầu",
      "Không chia sẻ mật khẩu giao dịch hoặc OTP cho bất kỳ ai",
      "Chụp màn hình biên lai rút tiền để đối chiếu nếu cần hỗ trợ",
      "Liên hệ support ngay nếu phát hiện bất thường trong giao dịch",
      "Tích lũy đủ số dư lớn hơn 100,000đ để tối ưu phí rút tiền",
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
              <p className="text-xs md:text-sm text-gray-500 font-bold">
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
              <p className="text-xs md:text-sm text-gray-500 font-bold">
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
              <p className="text-xs md:text-sm text-gray-500 font-bold">
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
              <p className="text-xs md:text-sm text-gray-500 font-bold">
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
                Chỉ 3 bước đơn giản để bắt đầu nhận hoàn tiền ngay hôm nay
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
                  Đăng Ký Miễn Phí
                </h3>
                <p className="text-white/80 text-center leading-relaxed">
                  Tạo tài khoản chỉ trong 30 giây. Hoàn toàn miễn phí, không cần
                  thẻ tín dụng hay ràng buộc gì.
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
                  Mua Sắm & Hoạt Động
                </h3>
                <p className="text-white/80 text-center leading-relaxed">
                  Mua sắm qua 1000+ thương hiệu, điểm danh hàng ngày, giới thiệu
                  bạn bè để tích điểm.
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
                  Nhận Tiền Thật
                </h3>
                <p className="text-white/80 text-center leading-relaxed">
                  Tiền hoàn và hoa hồng tự động cộng vào ví. Rút về ngân hàng
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
