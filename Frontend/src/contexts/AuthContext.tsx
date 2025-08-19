import { loginApi, registerApi } from "@/api/auth.api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, ReactNode, useContext, useEffect, useState } from "react";

type User = { id: number; email: string; name: string; role: "ADMIN" | "USER" } | null;

interface AuthContextType {
  isLoggedIn: boolean;
  user: User;
  login: (payload: { email: string; password: string }) => Promise<void>;
  logout: () => void;
  register: (payload: { email: string; password: string; name: string }) => Promise<void>;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User>(null);
  const [loading, setLoading] = useState(true);
  const isLoggedIn = !!user;

  useEffect(() => {
    const loadAuth = async () => {
      try {
        const user = await AsyncStorage.getItem("user");
        if (user) {
          setUser(JSON.parse(user));
        }
      } catch (err) {
        console.warn("Auth load error", err);
      } finally {
        setLoading(false);
      }
    };
    loadAuth();
  }, []);

  const login = async ({ email, password }: { email: string; password: string }) => {
    try {
      const res = await loginApi({ email, password });
      if (!res || !res.access_token) {
        throw new Error("Login failed");
      }

      const { access_token, user } = res;
      // Lưu token và user
      await AsyncStorage.setItem("token", access_token);
      await AsyncStorage.setItem("user", JSON.stringify(user));

      setUser(user);
    } catch (err) {
      console.error("Login error", err);
      throw err;
    }
  };

  const register = async ({ email, password, name }: { email: string; password: string; name: string }) => {
    try {
      const res = await registerApi({ email, password, name });

      //{"message": "User registered successfully"} nào trả về access_token thì bật lên
      if (!res) {
        throw new Error("Registration failed");
      }

      // const { access_token, user } = res;
      // // Lưu token và user
      // await AsyncStorage.setItem("token", access_token);
      // await AsyncStorage.setItem("user", JSON.stringify(user));

      // setUser(user);
    } catch (err) {
      console.error("Registration error", err);
      throw err;
    }
  };

  const logout = async () => {
    setUser(null);
    await AsyncStorage.multiRemove(["token", "user"]);
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
