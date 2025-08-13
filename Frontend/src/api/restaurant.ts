import { api } from "@/lib/axios";

export type Restaurant = { id: number; name: string; category: string; imageUrl?: string };
export type MenuItem = { id: number; name: string; price: number; restaurantId: number };

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
