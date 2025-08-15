export const ROUTES = {
  AUTH: {
    ROOT: "/(auth)",
    REGISTER: "/(auth)/register",
    LOGIN: "/(auth)/login",
  },
  CART: {
    ROOT: "/cart",
  },
  ORDER: {
    ROOT: "/orders",
    TRACK: "/orders/track",
  },

  RESTAURANT: {
    DETAILS: "/restaurant/[id]",
  },
  TABS: {
    ROOT: "/(tabs)",
    HOME: "/(tabs)/home",
    ORDERS: "/(tabs)/orders",
    PROFILE: "/(tabs)/profile",
  },
  HOME: "/",
  PROFILE: "/profile",
} as const;
