import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
// import { API_URL } from "@env";

export const api = axios.create({
  baseURL: process.env.EXPO_PUBLIC_API_URL, // API gốc
  timeout: 5000,
});

// Interceptor request (thêm token nếu có)
api.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Interceptor response (bắt lỗi chung)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error(error.response?.data || error.message);
    return Promise.reject(error);
  }
);
