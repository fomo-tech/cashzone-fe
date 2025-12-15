import React from "react";

interface DetailItemUserProps {
  icon: React.ReactElement<{ className?: string }>;
  label: string;
  value: string | number;
  type?: "normal" | "mono";
  className?: string;
}
const DetailItemUser = ({
  icon,
  label,
  value,
  type = "normal",
  className = "",
}: DetailItemUserProps) => (
  <div className={`flex flex-col ${className}`}>
    <span className="font-semibold text-slate-500 flex items-center gap-2 mb-1">
      {React.cloneElement(icon, { className: "w-4 h-4 text-indigo-400" })}{" "}
      {label}
    </span>
    <span
      className={`text-slate-800 ${
        type === "mono"
          ? "font-mono bg-slate-50 p-2 rounded-md border border-slate-200"
          : "font-medium p-2"
      }`}
    >
      {value}
    </span>
  </div>
);
export default DetailItemUser;
