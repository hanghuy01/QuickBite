import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createRestaurant, deleteRestaurant, fetchRestaurants, updateRestaurant } from "@/api/restaurant";
import { Restaurant } from "@/types/restaurant";

export function useRestaurants() {
  return useQuery<Restaurant[]>({
    queryKey: ["restaurants"],
    queryFn: () => fetchRestaurants(),
  });
}

export function useCreateRestaurant() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createRestaurant,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["restaurants"] }),
  });
}

export function useUpdateRestaurant() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Restaurant) =>
      updateRestaurant(data.id, {
        ...data,
        location: { latitude: data.lat, longitude: data.lon },
      }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["restaurants"] }),
  });
}

export function useDeleteRestaurant() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteRestaurant,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["restaurants"] }),
  });
}
