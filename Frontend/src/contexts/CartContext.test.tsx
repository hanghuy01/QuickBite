import React from "react";
import { renderHook, act } from "@testing-library/react-native";
import { CartProvider, useCart } from "./CartContext";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Mock AsyncStorage
jest.mock("@react-native-async-storage/async-storage", () => ({
  getItem: jest.fn(),
  setItem: jest.fn(),
}));

const wrapper = ({ children }: { children: React.ReactNode }) => <CartProvider>{children}</CartProvider>;

describe("CartProvider / useCart", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (AsyncStorage.getItem as jest.Mock).mockResolvedValue(null);
  });

  it("adds item to cart", async () => {
    const { result } = renderHook(() => useCart(), { wrapper });

    const item = {
      menuItemId: 1,
      nameRestaurant: "Pizza Place",
      name: "Pizza",
      price: 10,
      quantity: 2,
      restaurantId: 123,
    };

    await act(async () => {
      result.current.addItem(item);
    });

    expect(result.current.state.items).toHaveLength(1);
    expect(result.current.state.total).toBe(20);
    expect(AsyncStorage.setItem).toHaveBeenCalled(); // persist được gọi
  });

  it("increases quantity if same item added again", async () => {
    const { result } = renderHook(() => useCart(), { wrapper });

    const item = {
      menuItemId: 1,
      nameRestaurant: "Pizza Place",
      name: "Pizza",
      price: 10,
      quantity: 2,
      restaurantId: 123,
    };

    await act(async () => {
      result.current.addItem(item);
      result.current.addItem(item);
    });

    expect(result.current.state.items[0].quantity).toBe(4);
    expect(result.current.state.total).toBe(40);
  });

  it("decreases item quantity", async () => {
    const { result } = renderHook(() => useCart(), { wrapper });

    const item = {
      menuItemId: 1,
      nameRestaurant: "Pizza Place",
      name: "Pizza",
      price: 10,
      quantity: 2,
      restaurantId: 123,
    };

    await act(async () => {
      result.current.addItem(item);
      result.current.decreaseItem(1);
    });

    expect(result.current.state.items[0].quantity).toBe(1);
  });

  it("removes item from cart", async () => {
    const { result } = renderHook(() => useCart(), { wrapper });

    const item = {
      menuItemId: 1,
      nameRestaurant: "Pizza Place",
      name: "Pizza",
      price: 10,
      quantity: 2,
      restaurantId: 123,
    };

    await act(async () => {
      result.current.addItem(item);
      result.current.removeItem(1);
    });

    expect(result.current.state.items).toHaveLength(0);
    expect(result.current.state.total).toBe(0);
  });

  it("clears the cart", async () => {
    const { result } = renderHook(() => useCart(), { wrapper });

    const item = {
      menuItemId: 1,
      nameRestaurant: "Pizza Place",
      name: "Pizza",
      price: 10,
      quantity: 2,
      restaurantId: 123,
    };

    await act(async () => {
      result.current.addItem(item);
      result.current.clearCart();
    });

    expect(result.current.state.items).toHaveLength(0);
    expect(result.current.state.total).toBe(0);
  });
});
