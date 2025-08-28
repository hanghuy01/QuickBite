import api from "@/lib/axios";

import { LoginPayload, RegisterPayload } from "@/types/api/auth";

const AUTH_API_URL = "/auth";
// API

export const loginApi = async (data: LoginPayload) => {
  const res = await api.post(`${AUTH_API_URL}/login`, data);
  return res.data;
};

export const registerApi = async (data: RegisterPayload) => {
  const res = await api.post(`${AUTH_API_URL}/register`, data);
  return res.data;
};

export const profileApi = async () => {
  const res = await api.get(`${AUTH_API_URL}/profile`);
  return res.data;
};
