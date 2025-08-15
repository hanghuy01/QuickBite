export type Restaurant = { id: number; name: string; category: string; image?: string; menuItems: MenuItem[] };
export type MenuItem = { id: number; name: string; price: number; image?: string; restaurantId: number };

export type CreateOrderDto = {
  userId: number;
  restaurantId: number;
  items: { menuItemId: number; quantity: number }[];
};
export type Order = {
  id: number;
  status: "pending" | "confirmed" | "preparing" | "on_the_way" | "delivered" | "cancelled";
  createdAt: string;
};
