import http from "./api";

// Task Types
export type TaskType =
  | "survey"
  | "app_install"
  | "registration"
  | "purchase"
  | "social_media"
  | "other";

export interface Task {
  _id: string;
  offerId?: string;
  title: string;
  description?: string;
  requirements?: Array<{ title: string; description: string } | string>;
  logoUrl?: string; // Logo URL for the task
  type: TaskType;
  reward: number;
  platform?: string;
  completedCount: number;
  currentCompletion?: number;
  maxCompletions?: number;
  maxCompletion?: number;
  status: "active" | "inactive";
  isFeatured: boolean;
  proofType?: string;
  verificationMode?: "manual" | "ai";
  createdAt: string;
  updatedAt: string;
}

export interface Submission {
  _id: string;
  taskId: Task | string;
  userId: {
    _id: string;
    name: string;
    email: string;
  };
  proof: string;
  status: "pending" | "approved" | "rejected";
  reviewNote?: string;
  reasonReject?: string;
  reviewedBy?: string;
  reviewedAt?: string;
  aiResult?: any;
  createdAt: string;
  updatedAt: string;
}

export interface CreateTaskData {
  offerId?: string;
  title: string;
  description?: string;
  requirements?: Array<{ title: string; description: string } | string>;
  logoUrl?: string; // Logo URL for the task
  type: string;
  reward: number;
  platform?: string;
  maxCompletions?: number;
  maxCompletion?: number;
  status: string;
  isFeatured?: boolean;
  proofType?: string;
  verificationMode?: "manual" | "ai";
}

export interface TaskFilters {
  type?: string;
  status?: string;
  platform?: string;
  search?: string;
  isFeatured?: boolean;
  page?: number;
  limit?: number;
}

export interface SubmissionFilters {
  taskId?: string;
  userId?: string;
  status?: string;
  page?: number;
  limit?: number;
}

class TaskService {
  // ============ PUBLIC ENDPOINTS ============

  // Get public tasks
  async getTasks(filters: TaskFilters = {}) {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        params.append(key, value.toString());
      }
    });

    const response = await http.get(`/tasks/public?${params.toString()}`);
    return response.data;
  }

  // Get public task by ID
  async getTaskById(id: string) {
    const response = await http.get(`/tasks/public/${id}`);
    return response.data.data;
  }

  // ============ AUTHENTICATED USER ENDPOINTS ============

  // Submit task
  async submitTask(taskId: string, proofImage: string) {
    const response = await http.post("/tasks/submit", {
      taskId,
      proof: proofImage,
    });
    return response.data;
  }

  // Get user's submissions
  async getMySubmissions(filters: SubmissionFilters = {}) {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        params.append(key, value.toString());
      }
    });

    const response = await http.get(
      `/tasks/my-submissions?${params.toString()}`
    );
    return response.data;
  }

  // Get submission by ID
  async getMySubmissionById(id: string) {
    const response = await http.get(`/tasks/my-submissions/${id}`);
    return response.data.data;
  }

  // ============ ADMIN ENDPOINTS ============

  // Create task
  async createTask(data: CreateTaskData) {
    const response = await http.post("/tasks", data);
    return response.data;
  }

  // Get all tasks (admin)
  async getAllTasks(filters: TaskFilters = {}) {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        params.append(key, value.toString());
      }
    });

    const response = await http.get(`/tasks?${params.toString()}`);
    return response.data;
  }

  // Update task
  async updateTask(id: string, data: Partial<CreateTaskData>) {
    const response = await http.put(`/tasks/${id}`, data);
    return response.data;
  }

  // Delete task
  async deleteTask(id: string) {
    const response = await http.delete(`/tasks/${id}`);
    return response.data;
  }

  // Get task statistics
  async getTaskStats() {
    const response = await http.get("/tasks/stats");
    return response.data.data;
  }

  // Get all submissions (admin)
  async getAllSubmissions(filters: SubmissionFilters = {}) {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        params.append(key, value.toString());
      }
    });

    const response = await http.get(
      `/tasks/submissions/all?${params.toString()}`
    );
    return response.data;
  }

  // Approve submission
  async approveSubmission(id: string) {
    const response = await http.put(`/tasks/submissions/${id}/approve`);
    return response.data;
  }

  // Reject submission
  async rejectSubmission(id: string, reasonReject: string) {
    const response = await http.put(`/tasks/submissions/${id}/reject`, {
      reviewNote: reasonReject,
    });
    return response.data;
  }

  // Get task type label - utility method
  getTaskTypeLabel = getTaskTypeLabel;

  // Format reward - utility method
  formatReward = formatReward;
}

// Utility functions
export const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });
};

export const formatReward = (amount: number): string => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(amount);
};

export const getTaskTypeLabel = (type: string): string => {
  const labels: Record<string, string> = {
    survey: "Khảo sát",
    app_install: "Cài đặt ứng dụng",
    registration: "Đăng ký",
    purchase: "Mua hàng",
    social_media: "Mạng xã hội",
    other: "Khác",
  };
  return labels[type] || type;
};

export const getStatusColor = (status: string): string => {
  const colors: Record<string, string> = {
    active: "green",
    inactive: "gray",
    pending: "yellow",
    approved: "green",
    rejected: "red",
  };
  return colors[status] || "gray";
};

export default new TaskService();
