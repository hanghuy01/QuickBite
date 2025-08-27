import { refreshTokenApi } from "@/api/refresh.api";
import axios from "axios";
import * as SecureStore from "expo-secure-store";
// import { API_URL } from "@env";

let logoutFn: (() => void) | null = null;
// TODO: Not call any place?
export const setLogoutFn = (fn: () => void) => {
  logoutFn = fn;
};

const api = axios.create({
  baseURL: process.env.EXPO_PUBLIC_API_URL, // API gốc
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000,
});

// ========== Token Handling ==========
let accessToken: string | undefined;
export const setAccessToken = (token?: string) => {
  accessToken = token;
};

// ========== Refresh Token Queue ==========
let refreshingPromise: Promise<string> | null = null;

async function refreshAccessToken() {
  if (!refreshingPromise) {
    refreshingPromise = (async () => {
      const refresh_token = await SecureStore.getItemAsync("refresh_token");
      if (!refresh_token) throw new Error("No refresh token");

      const res = await refreshTokenApi(refresh_token);
      const { access_token: newAccessToken } = res;

      setAccessToken(newAccessToken);
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
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
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
    // TODO: If there are multiple requests with 401 same time?

    // Nếu token hết hạn và chưa retry => refresh
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const newAccessToken = await refreshAccessToken();
        // const refresh_token = await SecureStore.getItemAsync("refresh_token");
        // if (!refresh_token) throw new Error("No refresh token");

        // // Gọi API refresh
        // const res = await refreshTokenApi(refresh_token);
        // const { access_token: newAccessToken } = res;
        // console.log("newAccessToken", newAccessToken);
        // // Update lại accessToken trong memory
        // setAccessToken(newAccessToken);

        // Retry request cũ với token mới
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return api(originalRequest);
      } catch (err) {
        console.error("Refresh token failed", err);
        // Nếu refresh fail thì logout
        logoutFn?.();
      }
    }

    return Promise.reject(error);
  }
);

export default api;
