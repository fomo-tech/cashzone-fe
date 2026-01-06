import { useState, useEffect } from "react";
import settingsService, { type AppSettings } from "../services/settingsService";

/**
 * Hook để lấy public settings của app
 * Có thể sử dụng ở bất kỳ đâu trong app không cần authentication
 */
export const usePublicSettings = () => {
  const [settings, setSettings] = useState<Partial<AppSettings> | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        setLoading(true);
        const response = await settingsService.getPublicSettings();
        if (response.success) {
          setSettings(response.data);
        }
      } catch (err) {
        setError(err as Error);
        console.error("Error fetching public settings:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, []);

  return { settings, loading, error };
};

/**
 * Hook để kiểm tra maintenance mode
 */
export const useMaintenanceMode = () => {
  const { settings, loading } = usePublicSettings();

  return {
    isMaintenanceMode: settings?.maintenanceMode || false,
    maintenanceMessage: settings?.maintenanceMessage || "Hệ thống đang bảo trì",
    loading,
  };
};
