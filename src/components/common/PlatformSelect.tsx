import React, { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";
import http from "@/services/api";

interface Platform {
  _id: string;
  name: string;
  logo?: string;
  status?: string;
  type?: string;
}

interface PlatformSelectProps {
  value: string | undefined;
  onChange: (value: string) => void;
  required?: boolean;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
  showLogo?: boolean;
}

const PlatformSelect: React.FC<PlatformSelectProps> = ({
  value,
  onChange,
  required = false,
  placeholder = "Chọn nền tảng",
  className = "",
  disabled = false,
  showLogo = false,
}) => {
  const [platforms, setPlatforms] = useState<Platform[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPlatforms = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await http.get<Platform[]>("/platforms");

        // Extract data from response (handle both direct array and {data: array} structure)
        const platformsData = Array.isArray(response.data)
          ? response.data
          : (response.data as any)?.data || [];

        // Filter only active platforms
        const activePlatforms = platformsData.filter(
          (platform: Platform) =>
            !platform.status || platform.status === "active"
        );
        setPlatforms(activePlatforms);
      } catch (err) {
        console.error("Error fetching platforms:", err);
        setError("Không thể tải danh sách nền tảng");
      } finally {
        setLoading(false);
      }
    };

    fetchPlatforms();
  }, []);

  if (loading) {
    return (
      <div className={`relative ${className}`}>
        <select
          disabled
          className="w-full px-3 py-2.5 md:px-4 md:py-3 border-2 border-gray-200 rounded-xl md:rounded-2xl bg-white text-gray-400 text-sm md:text-base"
        >
          <option>Đang tải...</option>
        </select>
        <Loader2 className="w-4 h-4 text-gray-400 animate-spin absolute right-3 md:right-4 top-1/2 -translate-y-1/2 pointer-events-none" />
      </div>
    );
  }

  if (error) {
    return (
      <select
        disabled
        className={`w-full px-3 py-2.5 md:px-4 md:py-3 border-2 border-red-200 rounded-xl md:rounded-2xl bg-red-50 text-red-600 text-sm md:text-base ${className}`}
      >
        <option>{error}</option>
      </select>
    );
  }

  return (
    <select
      value={value || ""}
      onChange={(e) => onChange(e.target.value)}
      required={required}
      disabled={disabled}
      className={`w-full px-3 py-2.5 md:px-4 md:py-3 border-2 border-gray-200 rounded-xl md:rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#E91E63]/20 focus:border-[#E91E63] transition-all bg-white text-gray-800 text-sm md:text-base ${className}`}
    >
      <option value="">{placeholder}</option>
      {platforms.map((platform) => (
        <option key={platform._id} value={platform.name}>
          {showLogo && platform.logo ? `${platform.logo} ` : ""}
          {platform.name}
        </option>
      ))}
    </select>
  );
};

export default PlatformSelect;
