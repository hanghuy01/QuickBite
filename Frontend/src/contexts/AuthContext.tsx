import { loginApi, registerApi } from "@/api/auth.api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as SecureStore from "expo-secure-store";
import React, { createContext, ReactNode, useContext, useEffect, useState } from "react";
import { setAccessToken } from "@/lib/axios";

type User = { id: number; email: string; name: string; role: "ADMIN" | "USER" } | null;

interface AuthContextType {
  isLoggedIn: boolean;
  user: User;
  login: (payload: { email: string; password: string }) => Promise<void>;
  logout: () => Promise<void>;
  register: (payload: { email: string; password: string; name: string }) => Promise<void>;
  loading: boolean;
}

const USER_KEY = "user";
const REFRESH_TOKEN_KEY = "refresh_token";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User>(null);
  const [loading, setLoading] = useState(true);
  const isLoggedIn = !!user;

  // Load user & refresh_token khi mở app
  useEffect(() => {
    const loadAuth = async () => {
      try {
        // TODO: Should fetch new from API
        const user = await AsyncStorage.getItem(USER_KEY);
        if (user) {
          setUser(JSON.parse(user));
        }
      } catch (err) {
        console.error("Load auth error", err);
      } finally {
        setLoading(false);
      }
    };
    loadAuth();
  }, []);

  const login = async ({ email, password }: { email: string; password: string }) => {
    try {
      const res = await loginApi({ email, password });
      if (!res || !res.access_token || !res.refresh_token) {
        throw new Error("Login failed");
      }

      const { access_token, user, refresh_token } = res;

      // Lưu user
      await AsyncStorage.setItem(USER_KEY, JSON.stringify(user));
      setUser(user);

      // Lưu refresh_token bảo mật
      // TODO: Can cache access token if the expired time is short (1d). Can keep the memory way if the expired time is shorter.
      await SecureStore.setItemAsync(REFRESH_TOKEN_KEY, refresh_token);

      // Access token chỉ lưu trong memory
      setAccessToken(access_token);
    } catch (err) {
      console.error("Login error", err);
      throw err;
    }
  };

  const register = async ({ email, password, name }: { email: string; password: string; name: string }) => {
    try {
      const res = await registerApi({ email, password, name });
      if (!res) {
        throw new Error("Registration failed");
      }
      // tuỳ API có trả token + user thì xử lý thêm
    } catch (err) {
      console.error("Registration error", err);
      throw err;
    }
  };

  const logout = async () => {
    setUser(null);
    setAccessToken(undefined);
    await AsyncStorage.removeItem(USER_KEY);
    await SecureStore.deleteItemAsync(REFRESH_TOKEN_KEY);
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, user, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};
