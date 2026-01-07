import React, { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

interface Option {
  label: React.ReactNode;
  value: string | number;
}

interface DropdownProps {
  title: React.ReactNode;
  options: Option[];
  onSelect: (value: string | number) => void;
  selectedValue: string | number | null;
}

const Dropdown: React.FC<DropdownProps> = ({
  title,
  options,
  onSelect,
  selectedValue,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const selectedLabel =
    options.find((opt) => opt.value === selectedValue)?.label || title;

  const handleSelect = (opt: Option) => {
    onSelect(opt.value);
    setIsOpen(false);
  };

  return (
    <div className="relative w-full">
      <button
        type="button"
        className="inline-flex justify-between items-center w-full rounded-lg border border-gray-300 shadow-sm px-4 py-2 bg-white text-sm text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
        onClick={() => setIsOpen((prev) => !prev)}
      >
        {selectedLabel}
        {isOpen ? (
          <ChevronUp className="h-5 w-5 transition-transform duration-200 rotate-180" />
        ) : (
          <ChevronDown className="h-5 w-5 transition-transform duration-200" />
        )}
      </button>

      <div
        className={`absolute right-0 mt-2 w-full rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10 max-h-60 overflow-y-auto transform transition-all duration-200 origin-top ${
          isOpen
            ? "scale-100 opacity-100"
            : "scale-95 opacity-0 pointer-events-none"
        }`}
      >
        <div className="py-1">
          {options.map((opt) => (
            <button
              key={opt.value}
              onClick={() => handleSelect(opt)}
              className={`w-full text-left px-4 py-2 text-sm transition ${
                opt.value === selectedValue
                  ? "bg-[orange-600] text-white font-semibold"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dropdown;
