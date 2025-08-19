// Type Restaurant
export type Restaurant = {
  id: number;
  name: string;
  address: string;
  category: string;
  image?: string;
  distance?: number; // Optional for distance calculation
  menuItems: MenuItem[];
};

// Type MenuItem
export type MenuItem = { id: number; name: string; price: number; image?: string; restaurantId: number };

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
