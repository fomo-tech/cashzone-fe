import React, { useState } from "react";
import { X, Upload, CheckCircle, Loader } from "lucide-react";
import taskService, { fileToBase64, type Task } from "@/services/taskService";
import { notification } from "@/utils/notification";

interface TaskSubmitModalProps {
  isOpen: boolean;
  onClose: () => void;
  task: Task;
  onSuccess?: () => void;
}

export default function TaskSubmitModal({
  isOpen,
  onClose,
  task,
  onSuccess,
}: TaskSubmitModalProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      notification({
        type: "error",
        message: "Vui lòng chọn file ảnh",
      });
      return;
    }

    // Validate file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      notification({
        type: "error",
        message: "Kích thước file không được vượt quá 5MB",
      });
      return;
    }

    setSelectedFile(file);

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewUrl(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async () => {
    if (!selectedFile) {
      notification({
        type: "error",
        message: "Vui lòng chọn ảnh chứng minh",
      });
      return;
    }

    try {
      setIsSubmitting(true);

      // Convert to base64
      const base64 = await fileToBase64(selectedFile);

      // Submit task
      await taskService.submitTask(task._id, base64);

      notification({
        type: "success",
        message: "Gửi nhiệm vụ thành công! Chờ admin duyệt.",
      });

      // Reset and close
      setSelectedFile(null);
      setPreviewUrl("");
      onClose();
      
      if (onSuccess) {
        onSuccess();
      }
    } catch (error: any) {
      notification({
        type: "error",
        message: error.response?.data?.message || "Gửi nhiệm vụ thất bại",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-800">Gửi nhiệm vụ</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition"
          >
            <X size={24} className="text-gray-600" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Task Info */}
          <div className="bg-linear-to-r from-green-50 to-blue-50 rounded-xl p-4">
            <h3 className="font-semibold text-gray-800 mb-2">{task.title}</h3>
            <p className="text-sm text-gray-600 mb-3">{task.description}</p>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">
                Phần thưởng:
              </span>
              <span className="text-lg font-bold text-green-600">
                {new Intl.NumberFormat("vi-VN", {
                  style: "currency",
                  currency: "VND",
                }).format(task.reward)}
              </span>
            </div>
          </div>

          {/* Requirements */}
          {task.requirements && task.requirements.length > 0 && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
              <h4 className="font-semibold text-gray-800 mb-2 flex items-center">
                <CheckCircle size={18} className="mr-2 text-yellow-600" />
                Yêu cầu:
              </h4>
              <ul className="space-y-1 text-sm text-gray-700">
                {task.requirements.map((req, index) => (
                  <li key={index} className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>{req}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* File Upload */}
          <div className="space-y-3">
            <label className="block text-sm font-semibold text-gray-800">
              Ảnh chứng minh hoàn thành nhiệm vụ:
            </label>

            {!selectedFile ? (
              <label className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-xl p-8 cursor-pointer hover:border-green-500 hover:bg-green-50 transition">
                <Upload size={48} className="text-gray-400 mb-3" />
                <span className="text-sm text-gray-600 mb-1">
                  Click để chọn ảnh
                </span>
                <span className="text-xs text-gray-500">
                  PNG, JPG, GIF (Tối đa 5MB)
                </span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </label>
            ) : (
              <div className="relative">
                <img
                  src={previewUrl}
                  alt="Preview"
                  className="w-full h-64 object-contain rounded-xl bg-gray-50"
                />
                <button
                  onClick={() => {
                    setSelectedFile(null);
                    setPreviewUrl("");
                  }}
                  className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition"
                >
                  <X size={20} />
                </button>
                <div className="mt-2 text-sm text-gray-600">
                  <span className="font-medium">{selectedFile.name}</span>
                  <span className="ml-2 text-gray-500">
                    ({(selectedFile.size / 1024 / 1024).toFixed(2)} MB)
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <button
              onClick={onClose}
              disabled={isSubmitting}
              className="flex-1 px-6 py-3 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 disabled:opacity-50 transition"
            >
              Hủy
            </button>
            <button
              onClick={handleSubmit}
              disabled={!selectedFile || isSubmitting}
              className="flex-1 px-6 py-3 bg-linear-to-r from-green-600 to-green-500 text-white rounded-xl font-semibold hover:from-green-700 hover:to-green-600 disabled:opacity-50 disabled:cursor-not-allowed transition flex items-center justify-center"
            >
              {isSubmitting ? (
                <>
                  <Loader size={20} className="animate-spin mr-2" />
                  Đang gửi...
                </>
              ) : (
                "Gửi nhiệm vụ"
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
