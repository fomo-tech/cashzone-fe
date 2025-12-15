import React from "react";

const StatCard: React.FC<{
  icon: React.ReactElement<{ style: React.CSSProperties }>;
  title?: string;
  value?: number | string;
  color?: string;
}> = ({ icon, title, value, color }) => {
  return (
    <div className="p-4 bg-white rounded-xl shadow-lg border border-slate-100">
      {/* Icon */}
      <div
        className="flex items-center justify-center w-10 h-10 rounded-full mb-3"
        style={{ backgroundColor: `${color}20` }}
      >
        {React.cloneElement(icon, {
          style: { width: 20, height: 20, color: color },
        })}
      </div>

      <p className="text-sm font-medium text-slate-500">{title}</p>
      <p className="text-xl font-bold text-slate-800 mt-1">{value}</p>
    </div>
  );
};

export default StatCard;
