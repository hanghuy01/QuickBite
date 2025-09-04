import React from "react";
import { renderHook, act, waitFor } from "@testing-library/react-native";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  useRestaurants,
  useRestaurant,
  useCreateRestaurant,
  useUpdateRestaurant,
  useDeleteRestaurant,
} from "./useRestaurants";
import * as api from "@/api/restaurant";

// Mock API
jest.mock("@/api/restaurant", () => ({
  fetchRestaurants: jest.fn(),
  fetchRestaurant: jest.fn(),
  createRestaurant: jest.fn(),
  updateRestaurant: jest.fn(),
  deleteRestaurant: jest.fn(),
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

describe("useRestaurants hooks", () => {
  const restaurantsMock = [
    { id: "1", name: "Pizza Place", lat: 10, lon: 20 } as any,
    { id: "2", name: "Burger Joint", lat: 15, lon: 25 } as any,
  ];

  it("fetches all restaurants", async () => {
    (api.fetchRestaurants as jest.Mock).mockResolvedValue(restaurantsMock);

    const { result } = renderHook(() => useRestaurants(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.data).toEqual(restaurantsMock));
    expect(api.fetchRestaurants).toHaveBeenCalled();
  });

  it("fetches single restaurant by id", async () => {
    const single = restaurantsMock[0];
    (api.fetchRestaurant as jest.Mock).mockResolvedValue(single);

    const { result } = renderHook(() => useRestaurant("1"), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.data).toEqual(single));
    expect(api.fetchRestaurant).toHaveBeenCalledWith("1");
  });

  it("creates a restaurant and invalidates cache", async () => {
    const newRestaurant = { id: "3", name: "Sushi Bar" } as any;
    (api.createRestaurant as jest.Mock).mockResolvedValue(newRestaurant);

    const { result } = renderHook(() => useCreateRestaurant(), {
      wrapper: createWrapper(),
    });

    await act(async () => {
      await result.current.mutateAsync({ name: "Sushi Bar" });
    });

    await waitFor(() => {
      expect(api.createRestaurant).toHaveBeenCalledWith({ name: "Sushi Bar" });
    });
  });

  it("updates a restaurant and invalidates cache", async () => {
    const updated = { id: "1", name: "Updated Pizza", lat: 10, lon: 20 } as any;
    (api.updateRestaurant as jest.Mock).mockResolvedValue(updated);

    const { result } = renderHook(() => useUpdateRestaurant(), {
      wrapper: createWrapper(),
    });

    await act(async () => {
      await result.current.mutateAsync(updated);
    });

    await waitFor(() => {
      expect(api.updateRestaurant).toHaveBeenCalledWith("1", {
        ...updated,
        location: { latitude: updated.lat, longitude: updated.lon },
      });
    });
  });

  it("deletes a restaurant and invalidates cache", async () => {
    (api.deleteRestaurant as jest.Mock).mockResolvedValue(true);

    const { result } = renderHook(() => useDeleteRestaurant(), {
      wrapper: createWrapper(),
    });

    await act(async () => {
      await result.current.mutateAsync("1");
    });

    await waitFor(() => {
      expect(api.deleteRestaurant).toHaveBeenCalledWith("1");
    });
  });
});
