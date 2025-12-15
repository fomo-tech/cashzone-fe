import axios from "axios";
import http from "./api";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export interface Config {
  id?: string;
  _id?: string;
  key: string;
  value: any;
  description?: string;
  active?: boolean;
  group?: string;
  name?: string;
  type?: "number" | "text" | "boolean" | "currency";
  unit?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

const configService = {
  // Lấy tất cả configs
  getAllConfigs: async (): Promise<ApiResponse<Config[]>> => {
    const response = await http.get(`${API_URL}/configs`);
    return response.data;
  },

  // Lấy một config theo key
  getConfigByKey: async (key: string): Promise<ApiResponse<Config>> => {
    const response = await axios.get(`${API_URL}/configs/${key}`);
    return response.data;
  },

  // Tạo config mới
  createConfig: async (
    config: Partial<Config>
  ): Promise<ApiResponse<Config>> => {
    const response = await axios.post(`${API_URL}/configs`, config);
    return response.data;
  },

  // Cập nhật config
  updateConfig: async (
    key: string,
    value: any
  ): Promise<ApiResponse<Config>> => {
    const response = await axios.put(`${API_URL}/configs/${key}`, { value });
    return response.data;
  },

  // Xóa config
  deleteConfig: async (key: string): Promise<ApiResponse<void>> => {
    const response = await axios.delete(`${API_URL}/configs/${key}`);
    return response.data;
  },

  // Cập nhật nhiều configs cùng lúc
  bulkUpdateConfigs: async (
    configs: { key: string; value: any }[]
  ): Promise<ApiResponse<Config[]>> => {
    const response = await axios.put(`${API_URL}/configs/bulk`, { configs });
    return response.data;
  },
};

export default configService;
