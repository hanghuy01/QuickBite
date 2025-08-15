import { api } from "@/lib/axios";
import { MenuItem, Restaurant } from "@/types/types";

const RESTAURANT_API_URL = "/restaurants";

export const fetchRestaurants = async (q?: string, category?: string) => {
  const res = await api.get<Restaurant[]>(RESTAURANT_API_URL, { params: { q, category } });
  return res.data;
};
export const fetchRestaurant = async (id: string | number) => {
  const res = await api.get<Restaurant>(`${RESTAURANT_API_URL}/${id}`);
  return res.data;
};
export const fetchMenu = async (restaurantId: string | number) => {
  const res = await api.get<MenuItem[]>(`${RESTAURANT_API_URL}/${restaurantId}/menu`);
  return res.data;
};
