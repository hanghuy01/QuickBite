import React, { createContext, ReactNode, useCallback, useContext, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as SecureStore from "expo-secure-store";
import { logoutEmitter } from "@/events/logoutEvents";
import { loginApi, profileApi, registerApi } from "@/api/auth.api";

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
const ACCESS_TOKEN_KEY = "access_token";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User>(null);
  const [loading, setLoading] = useState(true);
  const isLoggedIn = !!user;

  // Load user & refresh_token when open app
  useEffect(() => {
    const loadAuth = async () => {
      try {
        const refreshToken = await SecureStore.getItemAsync(REFRESH_TOKEN_KEY);
        if (!refreshToken) return;

        // help no loading flash
        const storedUser = await AsyncStorage.getItem(USER_KEY);
        if (storedUser) setUser(JSON.parse(storedUser));

        const res = await profileApi();
        if (res) {
          setUser(res);
          await AsyncStorage.setItem(USER_KEY, JSON.stringify(res));
        }
      } catch (err) {
        console.error("Load auth error", err);
        setUser(null);
        await AsyncStorage.removeItem(USER_KEY);
        await SecureStore.deleteItemAsync(REFRESH_TOKEN_KEY);
        await SecureStore.deleteItemAsync(ACCESS_TOKEN_KEY);
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

      // Lưu access_token và refresh_token bảo mật
      await SecureStore.setItemAsync(REFRESH_TOKEN_KEY, refresh_token);
      await SecureStore.setItemAsync(ACCESS_TOKEN_KEY, access_token);
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

  const logout = useCallback(async () => {
    setUser(null);
    await AsyncStorage.removeItem(USER_KEY);
    await SecureStore.deleteItemAsync(ACCESS_TOKEN_KEY);
    await SecureStore.deleteItemAsync(REFRESH_TOKEN_KEY);
  }, []);

  useEffect(() => {
    logoutEmitter.on("logout", logout);
    return () => {
      logoutEmitter.off("logout", logout);
    };
  }, [logout]);

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
