import React from "react";

interface SkeletonProps {
  className?: string;
  variant?: "text" | "circular" | "rectangular";
  width?: string | number;
  height?: string | number;
  animation?: "pulse" | "wave" | "none";
}

export const Skeleton: React.FC<SkeletonProps> = ({
  className = "",
  variant = "rectangular",
  width,
  height,
  animation = "pulse",
}) => {
  const baseClasses = "bg-gray-200";

  const variantClasses = {
    text: "rounded",
    circular: "rounded-full",
    rectangular: "rounded-lg",
  };

  const animationClasses = {
    pulse: "animate-pulse",
    wave: "animate-shimmer bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 bg-[length:200%_100%]",
    none: "",
  };

  const style: React.CSSProperties = {};
  if (width) style.width = typeof width === "number" ? `${width}px` : width;
  if (height)
    style.height = typeof height === "number" ? `${height}px` : height;

  return (
    <div
      className={`${baseClasses} ${variantClasses[variant]} ${animationClasses[animation]} ${className}`}
      style={style}
      role="status"
      aria-label="Loading..."
    />
  );
};

// Skeleton variants for common use cases
export const SkeletonText: React.FC<{ lines?: number; className?: string }> = ({
  lines = 1,
  className = "",
}) => (
  <div className={`space-y-2 ${className}`}>
    {Array.from({ length: lines }).map((_, i) => (
      <Skeleton
        key={i}
        variant="text"
        height={16}
        width={i === lines - 1 ? "80%" : "100%"}
      />
    ))}
  </div>
);

export const SkeletonCard: React.FC<{ className?: string }> = ({
  className = "",
}) => (
  <div className={`bg-white rounded-xl shadow-md p-4 space-y-4 ${className}`}>
    <div className="flex items-center gap-3">
      <Skeleton variant="circular" width={48} height={48} />
      <div className="flex-1 space-y-2">
        <Skeleton variant="text" height={16} width="60%" />
        <Skeleton variant="text" height={12} width="40%" />
      </div>
    </div>
    <SkeletonText lines={3} />
  </div>
);

export const SkeletonTable: React.FC<{
  rows?: number;
  columns?: number;
  className?: string;
}> = ({ rows = 5, columns = 4, className = "" }) => (
  <div className={`space-y-3 ${className}`}>
    {/* Header */}
    <div className="flex gap-4">
      {Array.from({ length: columns }).map((_, i) => (
        <Skeleton key={i} variant="text" height={20} className="flex-1" />
      ))}
    </div>
    {/* Rows */}
    {Array.from({ length: rows }).map((_, rowIndex) => (
      <div key={rowIndex} className="flex gap-4">
        {Array.from({ length: columns }).map((_, colIndex) => (
          <Skeleton
            key={colIndex}
            variant="text"
            height={16}
            className="flex-1"
          />
        ))}
      </div>
    ))}
  </div>
);

export const SkeletonList: React.FC<{
  items?: number;
  className?: string;
}> = ({ items = 3, className = "" }) => (
  <div className={`space-y-3 ${className}`}>
    {Array.from({ length: items }).map((_, i) => (
      <div key={i} className="flex items-center gap-3 p-3 bg-white rounded-lg">
        <Skeleton variant="circular" width={40} height={40} />
        <div className="flex-1 space-y-2">
          <Skeleton variant="text" height={14} width="70%" />
          <Skeleton variant="text" height={12} width="50%" />
        </div>
      </div>
    ))}
  </div>
);

export const SkeletonPage: React.FC = () => (
  <div className="max-w-6xl mx-auto p-4 space-y-6">
    {/* Hero Section */}
    <div className="bg-gradient-to-r from-orange-50 to-amber-50 rounded-2xl p-8">
      <Skeleton variant="text" height={32} width="60%" className="mb-4" />
      <Skeleton variant="text" height={20} width="40%" className="mb-6" />
      <div className="flex gap-4">
        <Skeleton variant="rectangular" height={48} width={120} />
        <Skeleton variant="rectangular" height={48} width={120} />
      </div>
    </div>

    {/* Content Cards */}
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <SkeletonCard />
      <SkeletonCard />
      <SkeletonCard />
    </div>

    {/* Table/List Section */}
    <div className="bg-white rounded-xl shadow-md p-6">
      <Skeleton variant="text" height={24} width="30%" className="mb-4" />
      <SkeletonTable rows={5} columns={4} />
    </div>
  </div>
);

export default Skeleton;
