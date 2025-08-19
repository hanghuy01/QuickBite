import { Step } from "@/types/types";

export const ROUTES = {
  AUTH: {
    ROOT: "/(auth)",
    REGISTER: "/(auth)/register",
    LOGIN: "/(auth)/login",
  },
  ADMIN: {
    ROOT: "/(admin)",
    ORDER_TRACKING: "/(admin)/order-tracking",
    RESTAURANTS: "/(admin)/restaurants",
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

  // với các route động, dùng kiểu hàm
  | ReturnType<typeof ROUTES.ORDER.TRACK>
  | ReturnType<typeof ROUTES.RESTAURANT.DETAILS>;

export const ORDER_STEPS: Step[] = [
  { key: "confirmed", label: "Confirmed" },
  { key: "preparing", label: "Preparing" },
  { key: "on_the_way", label: "On the way" },
  { key: "delivered", label: "Delivered" },
] as const;
