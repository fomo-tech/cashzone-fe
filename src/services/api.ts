/* eslint-disable @typescript-eslint/no-explicit-any */

import { useAuthStore } from "@/store/authStore";
import axios, { AxiosError } from "axios";

export const defaultHttp = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "",
  timeout: 15000,
});

const http = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "",
  timeout: 15000,
});

let isRefreshing = false;
let failedQueue: any[] = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });

  failedQueue = [];
};

// REQUEST
http.interceptors.request.use((config) => {
  const { accessToken } = useAuthStore.getState();

  if (accessToken as any) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  config.headers.x_pathname = window.location.pathname;
  return config;
});

// RESPONSE
http.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error?.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({
            resolve: (token: string) => {
              originalRequest.headers.Authorization = "Bearer " + token;
              resolve(http(originalRequest));
            },
            reject: (err: AxiosError) => reject(err),
          });
        });
      }

      isRefreshing = true;

      try {
        const { refreshToken } = useAuthStore.getState();

        if (!refreshToken) {
          useAuthStore.getState().logout();
          return Promise.reject(error);
        }

        const res = await defaultHttp.post("/auth/refresh", {
          refreshToken,
        });

        const { accessToken: newAccessToken, refreshToken: newRefreshToken } =
          res.data.data;

        if (!newAccessToken) {
          useAuthStore.getState().logout();
          window.location.href = "/login";
          return Promise.reject(error);
        }

        // Lưu cả access token và refresh token mới
        useAuthStore.setState({
          accessToken: newAccessToken,
          refreshToken: newRefreshToken || refreshToken,
        });

        http.defaults.headers.common.Authorization = "Bearer " + newAccessToken;

        processQueue(null, newAccessToken);

        return http(originalRequest);
      } catch (err) {
        processQueue(err, null);
        useAuthStore.getState().logout();
        // Redirect to login page
        window.location.href = "/login";
        return Promise.reject(err);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default http;
