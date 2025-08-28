import api from "@/lib/axios";
import { CreateRestaurantForm } from "@/schemas/restaurant";
import { MenuItem } from "@/types/menu";
import { Restaurant } from "@/types/restaurant";

const RESTAURANT_API_URL = "/restaurants";

export const fetchRestaurants = async (q?: string, category?: string, lat?: number, lon?: number) => {
  const res = await api.get<Restaurant[]>(RESTAURANT_API_URL, { params: { q, category, lat, lon } });
  return res.data;
};

export const fetchRestaurant = async (id: string | number) => {
  const res = await api.get<Restaurant>(`${RESTAURANT_API_URL}/${id}`);
  return res.data;
};

export const createRestaurant = async (data: CreateRestaurantForm) => {
  const res = await api.post<Restaurant>(RESTAURANT_API_URL, data);
  return res.data;
};

export const updateRestaurant = async (id: number, data: Partial<Restaurant>) => {
  const { menuItems, id: restaurantId, lat, lon, ...rest } = data;
  const res = await api.patch<Restaurant>(`${RESTAURANT_API_URL}/${id}`, { ...rest });
  return res.data;
};

export const deleteRestaurant = async (id: string | number) => {
  const res = await api.delete(`${RESTAURANT_API_URL}/${id}`);
  return res.data;
};

export const fetchMenu = async (restaurantId: string | number) => {
  const res = await api.get<MenuItem[]>(`${RESTAURANT_API_URL}/${restaurantId}/menu`);
  return res.data;
};

export const fetchDistance = async (restaurantId: string | number, lat: number, lon: number) => {
  const res = await api.get<{ distance: { distanceKm: number; durationMin: number } }>(
    `${RESTAURANT_API_URL}/${restaurantId}/distance`,
    {
      params: { lat, lon },
    }
  );
  return res.data;
};
