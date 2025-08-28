import { route } from "./routes";

export const USER = {
  ROOT: route("/(user)"),
  ORDERS: route("/(user)/orders"),
  ORDER: {
    TRACK: (id: string) => route(`/orders/track/${id}`),
  },
  RESTAURANT: {
    DETAILS: (id: number) => route(`/restaurant/${id}`),
  },
  PROFILE: route("/(user)/profile"),
  CART: route("/(user)/cart"),
} as const;
