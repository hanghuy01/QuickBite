import { Step } from "@/types/types";

// TODO: https://docs.expo.dev/router/reference/typed-routes/
// Should split to specific files
// E.g: router.ts
export const ROUTES = {
  AUTH: {
    ROOT: "/(auth)",
    REGISTER: "/(auth)/register",
    LOGIN: "/(auth)/login",
  },
  ADMIN: {
    ROOT: "/(admin)",
    ORDER_TRACKING: "/(admin)/order-tracking",
    RESTAURANTS: "/(admin)/AdminRestaurants",
    RESTAURANT_MENU: (id: number) => `/(admin)/restaurant-menu/${id}` as const,
  },
  ORDER: {
    TRACK: (id: string) => `/orders/track/${id}` as const,
  },
  RESTAURANT: {
    DETAILS: (id: number) => `/restaurant/${id}` as const,
  },
  TABS: {
    ROOT: "/(tabs)",
    ORDERS: "/(tabs)/orders",
    PROFILE: "/(tabs)/profile",
    CART: "/(tabs)/cart",
  },
} as const;

export type RouteString =
  | typeof ROUTES.AUTH.LOGIN
  | typeof ROUTES.TABS.ROOT
  | typeof ROUTES.ADMIN.ROOT
  | typeof ROUTES.ADMIN.RESTAURANTS

  // với các route động, dùng kiểu hàm
  | ReturnType<typeof ROUTES.ORDER.TRACK>
  | ReturnType<typeof ROUTES.RESTAURANT.DETAILS>
  | ReturnType<typeof ROUTES.ADMIN.RESTAURANT_MENU>;

export const ORDER_STEPS: Step[] = [
  { key: "confirmed", label: "Confirmed" },
  { key: "preparing", label: "Preparing" },
  { key: "on_the_way", label: "On the way" },
  { key: "delivered", label: "Delivered" },
] as const;
