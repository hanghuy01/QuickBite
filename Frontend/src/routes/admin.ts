import { route } from "@/routes/routes";

export const ADMIN = {
  ROOT: route("/(admin)"),
  ORDER_TRACKING: route("/(admin)/order-tracking"),
  RESTAURANTS: route("/(admin)/AdminRestaurants"),
  RESTAURANT_MENU: (id: number) => route(`/(admin)/restaurant-menu/${id}`),
} as const;
