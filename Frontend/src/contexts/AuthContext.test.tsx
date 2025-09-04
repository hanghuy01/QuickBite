import React from "react";
import { renderHook, act } from "@testing-library/react-native";
import { AuthProvider, useAuth } from "./AuthContext";
import * as api from "@/api/auth.api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as SecureStore from "expo-secure-store";

// Mock API
jest.mock("@/api/auth.api", () => ({
  loginApi: jest.fn(),
  registerApi: jest.fn(),
  profileApi: jest.fn(),
}));

// Mock AsyncStorage & SecureStore
jest.mock("@react-native-async-storage/async-storage", () => ({
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
}));

jest.mock("expo-secure-store", () => ({
  getItemAsync: jest.fn(),
  setItemAsync: jest.fn(),
  deleteItemAsync: jest.fn(),
}));

const wrapper = ({ children }: { children: React.ReactNode }) => <AuthProvider>{children}</AuthProvider>;

describe("AuthProvider & useAuth", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("login sets user and stores tokens", async () => {
    const fakeUser = { id: 1, email: "test@test.com", name: "Test", role: "USER" };
    (api.loginApi as jest.Mock).mockResolvedValue({
      access_token: "access",
      refresh_token: "refresh",
      user: fakeUser,
    });

    const { result } = renderHook(() => useAuth(), { wrapper });

    await act(async () => {
      await result.current.login({ email: "test@test.com", password: "123456" });
    });

    expect(result.current.user).toEqual(fakeUser);
    expect(AsyncStorage.setItem).toHaveBeenCalledWith("user", JSON.stringify(fakeUser));
    expect(SecureStore.setItemAsync).toHaveBeenCalledWith("refresh_token", "refresh");
    expect(SecureStore.setItemAsync).toHaveBeenCalledWith("access_token", "access");
  });

  it("logout clears user and tokens", async () => {
    const { result } = renderHook(() => useAuth(), { wrapper });

    await act(async () => {
      await result.current.logout();
    });

    expect(result.current.user).toBeNull();
    expect(AsyncStorage.removeItem).toHaveBeenCalledWith("user");
    expect(SecureStore.deleteItemAsync).toHaveBeenCalledWith("refresh_token");
    expect(SecureStore.deleteItemAsync).toHaveBeenCalledWith("access_token");
  });

  it("register calls API", async () => {
    (api.registerApi as jest.Mock).mockResolvedValue(true);
    const { result } = renderHook(() => useAuth(), { wrapper });

    await act(async () => {
      await result.current.register({ email: "a@a.com", password: "123", name: "A" });
    });

    expect(api.registerApi).toHaveBeenCalledWith({ email: "a@a.com", password: "123", name: "A" });
  });
});
