import React, { useState, useEffect } from "react";
import { Settings, Save, AlertCircle, Plus, Trash2, Edit2 } from "lucide-react";
import luckywheelService, {
  type LuckyWheelSettings,
} from "../../services/luckywheelService";
import toast from "react-hot-toast";

const LuckyWheelAdmin: React.FC = () => {
  const [settings, setSettings] = useState<LuckyWheelSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [enabled, setEnabled] = useState(true);
  const [costPerSpin, setCostPerSpin] = useState(50);
  const [maxSpinsPerDay, setMaxSpinsPerDay] = useState(1);
  const [prizes, setPrizes] = useState<any[]>([]);

  const loadSettings = async () => {
    setLoading(true);
    try {
      const data = await luckywheelService.getSettings();
      setSettings(data);
      setEnabled(data.enabled);
      setCostPerSpin(data.costPerSpin);
      setMaxSpinsPerDay(data.maxSpinsPerDay || 10);
      setPrizes(data.prizes);
    } catch (error) {
      toast.error("Không thể tải cài đặt vòng quay");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSettings();
  }, []);

  const handleSave = async () => {
    // Validate probabilities
    const totalProbability = prizes.reduce((sum, p) => sum + p.probability, 0);
    if (Math.abs(totalProbability - 100) > 0.01) {
      toast.error("Tổng tỷ lệ phải bằng 100%");
      return;
    }

    setSaving(true);
    try {
      await luckywheelService.updateSettings({
        enabled,
        costPerSpin,
        maxSpinsPerDay,
        prizes,
      });
      toast.success("Đã cập nhật cài đặt vòng quay");
      loadSettings();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Có lỗi xảy ra");
    } finally {
      setSaving(false);
    }
  };

  const updatePrize = (index: number, field: string, value: any) => {
    const newPrizes = [...prizes];
    newPrizes[index] = { ...newPrizes[index], [field]: value };
    setPrizes(newPrizes);
  };

  const addPrize = () => {
    setPrizes([
      ...prizes,
      {
        id: `prize${Date.now()}`,
        name: "Giải mới",
        value: 0,
        probability: 0,
        color: "#000000",
      },
    ]);
  };

  const removePrize = (index: number) => {
    if (prizes.length <= 2) {
      toast.error("Phải có ít nhất 2 giải");
      return;
    }
    setPrizes(prizes.filter((_, i) => i !== index));
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="text-center text-gray-500">Đang tải...</div>
      </div>
    );
  }

  const totalProbability = prizes.reduce((sum, p) => sum + p.probability, 0);
  const probabilityValid = Math.abs(totalProbability - 100) < 0.01;

  return (
    <div className="p-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <Settings className="h-8 w-8 text-amber-600" />
          <h1 className="text-3xl font-bold text-gray-900">
            Quản Lý Vòng Quay May Mắn
          </h1>
        </div>
        <p className="text-gray-600">
          Cấu hình giải thưởng và tỷ lệ trúng thưởng
        </p>
      </div>

      {/* General Settings */}
      <div className="bg-white rounded-xl shadow-sm border mb-6 p-6">
        <h2 className="text-xl font-bold mb-4">Cài Đặt Chung</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Enable/Disable */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">
              Trạng thái
            </label>
            <label className="flex items-center gap-3 p-4 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
              <input
                type="checkbox"
                checked={enabled}
                onChange={(e) => setEnabled(e.target.checked)}
                className="w-5 h-5 text-amber-600 rounded"
              />
              <span className="font-bold">
                {enabled ? "Đang bật" : "Đang tắt"}
              </span>
            </label>
          </div>

          {/* Cost per spin */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">
              Chi phí mỗi lượt quay (VNĐ)
            </label>
            <input
              type="number"
              value={costPerSpin}
              onChange={(e) => setCostPerSpin(Number(e.target.value))}
              min={0}
              className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
              placeholder="Nhập 0 để miễn phí"
            />
            <p className="text-xs text-gray-500 mt-1">
              {costPerSpin === 0
                ? "Miễn phí"
                : `${costPerSpin.toLocaleString("vi-VN")}đ / lượt`}
            </p>
          </div>

          {/* Max spins per day */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">
              Số lượt quay tối đa / ngày
            </label>
            <input
              type="number"
              value={maxSpinsPerDay}
              onChange={(e) => setMaxSpinsPerDay(Number(e.target.value))}
              min={1}
              className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
            />
          </div>
        </div>
      </div>

      {/* Prizes */}
      <div className="bg-white rounded-xl shadow-sm border mb-6 p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-bold">Cấu Hình Giải Thưởng</h2>
            <p className="text-sm text-gray-600 mt-1">
              Tổng tỷ lệ:{" "}
              <span
                className={`font-bold ${
                  probabilityValid ? "text-green-600" : "text-red-600"
                }`}
              >
                {totalProbability.toFixed(1)}%
              </span>
              {!probabilityValid && (
                <span className="text-red-600 ml-2">(Phải bằng 100%)</span>
              )}
            </p>
          </div>
          <button
            onClick={addPrize}
            className="flex items-center gap-2 px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors"
          >
            <Plus className="h-4 w-4" />
            Thêm giải
          </button>
        </div>

        <div className="space-y-4">
          {prizes.map((prize, index) => (
            <div
              key={prize.id}
              className="p-4 border rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors"
            >
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                {/* Prize Name */}
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Tên giải
                  </label>
                  <input
                    type="text"
                    value={prize.name}
                    onChange={(e) => updatePrize(index, "name", e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-amber-500"
                  />
                </div>

                {/* Prize Value */}
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Giá trị (VNĐ)
                  </label>
                  <input
                    type="number"
                    value={prize.value}
                    onChange={(e) =>
                      updatePrize(index, "value", Number(e.target.value))
                    }
                    min={0}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-amber-500"
                  />
                </div>

                {/* Probability */}
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Tỷ lệ (%)
                  </label>
                  <input
                    type="number"
                    value={prize.probability}
                    onChange={(e) =>
                      updatePrize(index, "probability", Number(e.target.value))
                    }
                    min={0}
                    max={100}
                    step={0.1}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-amber-500"
                  />
                </div>

                {/* Color */}
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Màu sắc
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="color"
                      value={prize.color}
                      onChange={(e) =>
                        updatePrize(index, "color", e.target.value)
                      }
                      className="w-12 h-10 rounded cursor-pointer"
                    />
                    <input
                      type="text"
                      value={prize.color}
                      onChange={(e) =>
                        updatePrize(index, "color", e.target.value)
                      }
                      className="flex-1 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-amber-500"
                    />
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-end">
                  <button
                    onClick={() => removePrize(index)}
                    disabled={prizes.length <= 2}
                    className="w-full px-3 py-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
                  >
                    <Trash2 className="h-4 w-4" />
                    Xóa
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Save Button */}
      <div className="flex items-center gap-4">
        <button
          onClick={handleSave}
          disabled={saving || !probabilityValid}
          className="flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-semibold"
        >
          <Save className="h-5 w-5" />
          {saving ? "Đang lưu..." : "Lưu Cài Đặt"}
        </button>

        {!probabilityValid && (
          <div className="flex items-center gap-2 text-red-600">
            <AlertCircle className="h-5 w-5" />
            <span className="text-sm font-bold">
              Vui lòng điều chỉnh tỷ lệ sao cho tổng bằng 100%
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default LuckyWheelAdmin;
