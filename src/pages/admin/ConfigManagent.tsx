import React, { useState, useMemo } from "react";
import {
  Settings,
  Save,
  AlertTriangle,
  X,
  Check,
  Edit,
  Loader,
  Maximize,
  MinusCircle,
  DollarSign,
  TextCursor,
  ToggleRight,
  User,
  Hash,
} from "lucide-react";

// Giả lập dữ liệu cấu hình ban đầu
const initialConfigs = [
  {
    id: "1",
    group: "Giới Hạn Hệ Thống",
    name: "Giao Dịch Tối Đa/Ngày",
    key: "MAX_DAILY_TXNS",
    value: 10,
    type: "number",
    unit: "giao dịch",
  },
  {
    id: "2",
    group: "Giới Hạn Hệ Thống",
    name: "Tải Lên Tối Đa (MB)",
    key: "MAX_UPLOAD_SIZE",
    value: 50,
    type: "number",
    unit: "MB",
  },
  {
    id: "3",
    group: "Chế Độ/Bảo Trì",
    name: "Chế Độ Bảo Trì",
    key: "MAINTENANCE_ACTIVE",
    value: false,
    type: "boolean",
  },
  {
    id: "4",
    group: "Nội Dung & Marketing",
    name: "Text Banner Trang Chủ",
    key: "HOMEPAGE_BANNER_VI",
    value: "Ưu đãi lớn cho người dùng mới trong tháng 11!",
    type: "text",
  },
  {
    id: "5",
    group: "Nội Dung & Marketing",
    name: "Lỗi 404 Message",
    key: "ERROR_404_MSG",
    value: "Không tìm thấy trang. Vui lòng quay lại trang chủ.",
    type: "text",
  },
  {
    id: "6",
    group: "Tính Năng (Toggles)",
    name: "Bật Tính Năng Premium X",
    key: "FEATURE_PREMIUM_X",
    value: true,
    type: "boolean",
  },
  {
    id: "7",
    group: "Tính Năng (Toggles)",
    name: "Bật Đăng Ký Người Dùng Mới",
    key: "ENABLE_NEW_REG",
    value: true,
    type: "boolean",
  },
  {
    id: "8",
    group: "Tài Chính",
    name: "Số Tiền Nạp Tối Thiểu (VND)",
    key: "MIN_DEPOSIT",
    value: 50000,
    type: "currency",
  },
];

// Hàm định dạng tiền tệ
const formatCurrency = (amount) => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(amount);
};

// Component con cho từng mục cấu hình
const ConfigItem = ({ config, onValueChange, onSave, isSaving }) => {
  const [localValue, setLocalValue] = useState(config.value);
  const [isEditing, setIsEditing] = useState(false);
  const hasChanged =
    JSON.stringify(localValue) !== JSON.stringify(config.value);

  // Xử lý thay đổi giá trị dựa trên loại config
  const handleChange = (e) => {
    let newValue;
    if (config.type === "boolean") {
      newValue = !localValue;
    } else if (config.type === "number" || config.type === "currency") {
      newValue = parseInt(e.target.value) || 0;
    } else {
      newValue = e.target.value;
    }
    setLocalValue(newValue);
    onValueChange(config.id, newValue);
  };

  const handleSave = () => {
    onSave(config.id, localValue);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setLocalValue(config.value);
    setIsEditing(false);
  };

  // Xác định icon và hiển thị giá trị
  let valueDisplay;
  let icon;
  let inputField;

  switch (config.type) {
    case "number":
    case "currency":
      icon =
        config.type === "currency" ? (
          <DollarSign className="w-5 h-5 text-orange-500" />
        ) : (
          <Hash className="w-5 h-5 text-orange-500" />
        );
      valueDisplay =
        config.type === "currency"
          ? formatCurrency(config.value)
          : `${config.value.toLocaleString("vi-VN")} ${config.unit || ""}`;
      inputField = (
        <input
          type="number"
          value={localValue}
          onChange={handleChange}
          className="w-full border border-gray-300 p-2 rounded-lg focus:ring-orange-500 focus:border-orange-500 transition duration-150"
          min={
            config.type === "number" || config.type === "currency"
              ? 0
              : undefined
          }
        />
      );
      break;
    case "boolean":
      icon = (
        <ToggleRight
          className={`w-5 h-5 ${
            config.value ? "text-orange-500" : "text-red-500"
          }`}
        />
      );
      valueDisplay = (
        <span
          className={`font-bold ${
            config.value ? "text-orange-500" : "text-red-600"
          }`}
        >
          {config.value ? "BẬT (Enabled)" : "TẮT (Disabled)"}
        </span>
      );
      inputField = (
        <button
          onClick={handleChange}
          className={`px-3 py-1 rounded-full font-semibold text-sm transition duration-200 ${
            localValue
              ? "bg-orange-500 text-white hover:bg-orange-500"
              : "bg-gray-300 text-gray-800 hover:bg-gray-400"
          }`}
        >
          {localValue ? "Bật" : "Tắt"}
        </button>
      );
      break;
    case "text":
    default:
      icon = <TextCursor className="w-5 h-5 text-orange-500" />;
      valueDisplay = <p className="truncate max-w-lg">{config.value}</p>;
      inputField = (
        <textarea
          value={localValue}
          onChange={handleChange}
          rows={3}
          className="w-full border border-gray-300 p-2 rounded-lg focus:ring-orange-500 focus:border-orange-500 transition duration-150 resize-none"
        />
      );
      break;
  }

  return (
    <div className="flex justify-between items-start border-b border-gray-100 py-4 last:border-b-0">
      <div className="flex items-start space-x-4 w-1/3">
        {icon}
        <div>
          <p className="font-semibold text-gray-800">{config.name}</p>
          <p className="text-xs text-gray-500 font-mono italic">{config.key}</p>
        </div>
      </div>

      <div className="w-2/5 flex items-center min-h-[40px]">
        {isEditing ? <div className="w-full">{inputField}</div> : valueDisplay}
      </div>

      <div className="w-1/4 flex justify-end space-x-2 pt-1">
        {isEditing ? (
          <>
            <button
              onClick={handleSave}
              disabled={!hasChanged || isSaving}
              className={`px-3 py-1 text-sm font-semibold rounded-lg transition duration-200 flex items-center ${
                hasChanged && !isSaving
                  ? "bg-gradient-to-r from-orange-400 to-orange-1000 text-white hover:from-orange-500 hover:to-orange-600 shadow-md shadow-orange-500/30"
                  : "bg-gray-200 text-gray-500 cursor-not-allowed"
              }`}
            >
              {isSaving ? (
                <Loader className="w-4 h-4 mr-1 animate-spin" />
              ) : (
                <Check className="w-4 h-4 mr-1" />
              )}
              Lưu
            </button>
            <button
              onClick={handleCancel}
              className="px-3 py-1 text-sm font-semibold rounded-lg bg-red-100 text-red-600 hover:bg-red-200 transition duration-200 flex items-center"
            >
              <X className="w-4 h-4 mr-1" />
              Hủy
            </button>
          </>
        ) : (
          <button
            onClick={() => setIsEditing(true)}
            className="px-3 py-1 text-sm font-semibold rounded-lg bg-orange-100 text-orange-500 hover:bg-orange-100 transition duration-200 flex items-center"
          >
            <Edit className="w-4 h-4 mr-1" />
            Chỉnh Sửa
          </button>
        )}
      </div>
    </div>
  );
};

const ConfigManagement = () => {
  const [configs, setConfigs] = useState(initialConfigs);
  const [isSaving, setIsSaving] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Nhóm các config theo 'group'
  const groupedConfigs = useMemo(() => {
    return configs.reduce((acc, config) => {
      if (
        config.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        config.key.toLowerCase().includes(searchQuery.toLowerCase())
      ) {
        (acc[config.group] = acc[config.group] || []).push(config);
      }
      return acc;
    }, {});
  }, [configs, searchQuery]);

  const handleValueChange = (id, newValue) => {
    // Cập nhật giá trị tạm thời (local state) trong configs
    setConfigs((prevConfigs) =>
      prevConfigs.map((config) =>
        config.id === id ? { ...config, value: newValue } : config
      )
    );
  };

  const handleSave = (id, newValue) => {
    setIsSaving(true);
    // Simulate API call delay
    setTimeout(() => {
      // Trong thực tế, bạn sẽ gọi API để lưu vào Firestore/Server tại đây.
      // console.log(`Saving config ${id} with new value: ${newValue}`);
      setIsSaving(false);
      // Cập nhật state sau khi lưu thành công (nếu cần)
    }, 800);
  };

  return (
    <div className="min-h-screen p-4 sm:p-8 font-sans">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between border-b pb-4">
          <div className="flex items-center space-x-3">
            <Settings className="w-8 h-8 text-orange-500" />
            <h1 className="text-3xl font-extrabold text-gray-900">
              Quản Lý Cấu Hình Ứng Dụng
            </h1>
          </div>
        </div>
        <p className="text-gray-500">
          Thiết lập các tham số hệ thống, giới hạn người dùng và nội dung hiển
          thị.
        </p>

        {/* Thanh tìm kiếm */}
        <div className="flex justify-between items-center space-x-4">
          <input
            type="text"
            placeholder="Tìm kiếm theo Tên hoặc Key (e.g. MAX_DAILY_TXNS)"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-xl shadow-sm focus:ring-orange-500 focus:border-orange-500 transition duration-150"
          />
          <button
            className="px-6 py-3 text-sm font-semibold rounded-xl bg-gradient-to-r from-orange-400 to-orange-1000 text-white hover:bg-orange-700 transition duration-150 shadow-md flex items-center shrink-0"
            onClick={() =>
              alert("Chức năng thêm cấu hình mới chưa được hỗ trợ.")
            } // Sử dụng alert thay cho modal
          >
            <Maximize className="w-4 h-4 mr-2" />
            Thêm Config Mới
          </button>
        </div>

        {/* Khu vực Hiển thị Cấu Hình */}
        {Object.keys(groupedConfigs).map((groupName) => (
          <div
            key={groupName}
            className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 space-y-2"
          >
            <h2 className="text-xl font-bold text-gray-800 pb-3 border-b border-orange-100 flex items-center space-x-2">
              <MinusCircle className="w-5 h-5 text-orange-500" />
              <span>{groupName}</span>
              <span className="text-sm text-gray-500 font-normal">
                ({groupedConfigs[groupName].length} mục)
              </span>
            </h2>

            <div className="divide-y divide-gray-50">
              {groupedConfigs[groupName].map((config) => (
                <ConfigItem
                  key={config.id}
                  config={config}
                  onValueChange={handleValueChange}
                  onSave={handleSave}
                  isSaving={isSaving}
                />
              ))}
            </div>
          </div>
        ))}

        {Object.keys(groupedConfigs).length === 0 && (
          <div className="text-center p-10 bg-white rounded-xl shadow-lg border border-gray-100">
            <AlertTriangle className="w-10 h-10 text-yellow-500 mx-auto mb-4" />
            <p className="text-lg font-semibold text-gray-700">
              Không tìm thấy cấu hình nào khớp với tìm kiếm của bạn.
            </p>
            <p className="text-sm text-gray-500">Vui lòng thử từ khóa khác.</p>
          </div>
        )}

        {/* Thông báo trạng thái lưu */}
        {isSaving && (
          <div className="fixed bottom-4 right-4 bg-gradient-to-r from-orange-400 to-orange-1000 text-white p-3 rounded-lg shadow-xl flex items-center space-x-2">
            <Loader className="w-5 h-5 animate-spin" />
            <span>Đang lưu thay đổi...</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default ConfigManagement;
