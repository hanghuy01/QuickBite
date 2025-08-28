import axios from "axios";
import * as SecureStore from "expo-secure-store";
import { logoutEmitter } from "@/events/logoutEvents";
import { refreshTokenApi } from "@/api/refresh.api";

const api = axios.create({
  baseURL: process.env.EXPO_PUBLIC_API_URL, // API gốc
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000,
});

// ========== Refresh Token Queue ==========
let refreshingPromise: Promise<string> | null = null;

// get refresh token and don't call multiple times while refreshing
async function refreshAccessToken() {
  if (!refreshingPromise) {
    refreshingPromise = (async () => {
      const refresh_token = await SecureStore.getItemAsync("refresh_token");
      if (!refresh_token) throw new Error("No refresh token");

      const res = await refreshTokenApi(refresh_token);
      const { access_token: newAccessToken } = res;

      // save new token to SecureStore
      await SecureStore.setItemAsync("access_token", newAccessToken);
      return newAccessToken;
    })();
  }
  try {
    return await refreshingPromise;
  } finally {
    // chỉ reset sau khi tất cả await xong
    refreshingPromise = null;
  }
}

// == ======== Interceptors ==========
api.interceptors.request.use(
  async (config) => {
    const token = await SecureStore.getItemAsync("access_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Add response interceptor => nếu 401 thì tự refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    // Nếu token hết hạn và chưa retry => refresh
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const newAccessToken = await refreshAccessToken();

        // Retry request cũ với token mới
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return api(originalRequest);
      } catch (err) {
        console.error("Refresh token failed", err);
        // Nếu refresh fail thì logout
        logoutEmitter.emit("logout");
      }
    }

    return Promise.reject(error);
  }
);

export default api;
