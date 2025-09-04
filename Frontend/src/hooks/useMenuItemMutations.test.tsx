import React from "react";
import { renderHook, act, waitFor } from "@testing-library/react-native";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useMenuItemMutations } from "./useMenuItem";
import { addMenuItem, editMenuItem, deleteMenuItem } from "@/api/menuItem.api";

// Mock API
jest.mock("@/api/menuItem.api", () => ({
  addMenuItem: jest.fn(),
  editMenuItem: jest.fn(),
  deleteMenuItem: jest.fn(),
}));

const createTestQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: { retry: false, gcTime: Infinity },
      mutations: { retry: false },
    },
  });

const createWrapper = () => {
  const queryClient = createTestQueryClient();
  const Wrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
  Wrapper.displayName = "QueryClientTestWrapper";
  return Wrapper;
};

describe("useMenuItemMutations", () => {
  const restaurantId = "123";

  it("calls addMenuItem and invalidates query", async () => {
    (addMenuItem as jest.Mock).mockResolvedValue({ id: 1, name: "Pizza" });

    const { result } = renderHook(() => useMenuItemMutations(restaurantId), {
      wrapper: createWrapper(),
    });

    await act(async () => {
      await result.current.add.mutateAsync({
        name: "Pizza",
        price: 10,
        description: "Cheesy pizza",
        image: "pizza.jpg",
      });
    });

    await waitFor(() => {
      expect(addMenuItem).toHaveBeenCalledWith({
        name: "Pizza",
        price: 10,
        description: "Cheesy pizza",
        image: "pizza.jpg",
      });
    });
  });

  it("calls editMenuItem and invalidates query", async () => {
    (editMenuItem as jest.Mock).mockResolvedValue({ id: 2, name: "Burger" });

    const { result } = renderHook(() => useMenuItemMutations(restaurantId), {
      wrapper: createWrapper(),
    });

    await act(async () => {
      await result.current.edit.mutateAsync({
        id: 2,
        name: "Burger",
        price: 12,
        description: "Juicy burger",
        image: "burger.jpg",
      });
    });

    await waitFor(() => {
      expect(editMenuItem).toHaveBeenCalledWith(2, {
        id: 2,
        name: "Burger",
        price: 12,
        description: "Juicy burger",
        image: "burger.jpg",
      });
    });
  });

  it("calls deleteMenuItem and invalidates query", async () => {
    (deleteMenuItem as jest.Mock).mockResolvedValue(true);

    const { result } = renderHook(() => useMenuItemMutations(restaurantId), {
      wrapper: createWrapper(),
    });

    await act(async () => {
      await result.current.remove.mutateAsync(5);
    });

    await waitFor(() => {
      expect(deleteMenuItem).toHaveBeenCalledWith(5);
    });
  });
});
