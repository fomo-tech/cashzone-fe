import React from "react";
import { Check } from "lucide-react"; // Sử dụng Check icon từ Lucide cho dấu tick

type CheckboxProps = {
  id: string; // Thêm id để liên kết input và label
  label: string;
  value: string;
  checked: boolean;
  onChange: (value: string) => void;
};

// --- Custom Checkbox Component ---
const Checkbox: React.FC<CheckboxProps> = ({
  id,
  label,
  value,
  checked,
  onChange,
}) => {
  return (
    <div className="flex items-center mb-4">
      <label
        htmlFor={id}
        className="flex items-center cursor-pointer select-none"
      >
        {/* 1. Native Input (Ẩn, dùng làm "Peer" cho trạng thái) */}
        <input
          id={id}
          type="checkbox"
          name={id}
          value={value}
          checked={checked}
          onChange={() => onChange(value)}
          // Sử dụng "peer" để tham chiếu đến div tùy chỉnh bên dưới
          className="hidden peer"
        />

        {/* 2. Custom Visual Checkbox (Mục tiêu của Styling) */}
        <div
          className={`
            w-5 h-5 flex items-center justify-center rounded-md border-2 transition-all duration-200 ease-in-out mr-3
            bg-white border-gray-300 hover:border-[#E91E63]
            
            // Trạng thái khi PEER (input) được CHECKED
            peer-checked:bg-[#E91E63] peer-checked:border-[#E91E63]
            
            // Trạng thái khi PEER (input) được FOCUS
            peer-focus:ring-4 peer-focus:ring-offset-2 peer-focus:ring-pink-200
          `}
        >
          {/* Checkmark (Chỉ hiển thị khi checked) */}
          {checked && (
            // Sử dụng SVG hoặc Lucide Icon cho dấu tick
            <Check className="w-4 h-4 text-white stroke-[3px]" />
          )}
        </div>

        {/* 3. Label */}
        <span className="text-base text-slate-700 font-medium select-none">
          {label}
        </span>
      </label>
    </div>
  );
};
export default Checkbox;
