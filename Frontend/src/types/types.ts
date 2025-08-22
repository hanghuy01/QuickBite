// Type Restaurant
export type Restaurant = {
  id: number;
  name: string;
  address: string;
  category: string;
  description?: string;
  image?: string;
  distance?: { distanceKm: number; durationMin: number };
  lat?: number;
  lon?: number;
  location?: { latitude?: number; longitude?: number };
  menuItems?: MenuItem[];
};

// Type MenuItem
export type MenuItem = {
  id: number;
  name: string;
  price: number;
  description?: string;
  image?: string;
  restaurantId?: number;
};

// Type Order
export type CreateOrderDto = {
  userId: number;
  totalAmount: number;
  restaurantId: number;
  items: { menuItemId: number; quantity: number }[];
};
export type Order = {
  id: string;
  status: "pending" | "confirmed" | "preparing" | "on_the_way" | "delivered" | "cancelled";
  totalAmount: number;
  user: { id: number; name: string };
  createdAt: string;
};

export type Step = {
  key: string;
  label: string;
};
