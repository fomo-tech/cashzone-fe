import React from "react";

interface LoaderProps {
  size?: "sm" | "md" | "lg";
  color?: "green" | "blue" | "gray";
}

const Loader: React.FC<LoaderProps> = ({ size = "md", color = "green" }) => {
  const sizeClass =
    size === "sm"
      ? "w-4 h-4 border-2"
      : size === "lg"
      ? "w-12 h-12 border-4"
      : "w-8 h-8 border-4";

  const colorClass =
    color === "blue"
      ? "border-blue-500"
      : color === "gray"
      ? "border-gray-400"
      : "border-green-500";

  return (
    <div
      className={`
        ${sizeClass}
        ${colorClass}
        border-t-transparent
        rounded-full
        animate-spin
      `}
    />
  );
};

export default Loader;
