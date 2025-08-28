export type CreateOrderDto = {
  userId: number;
  totalAmount: number;
  restaurantId: number;
  items: { menuItemId: number; quantity: number }[];
};

export enum OrderStatus {
  PENDING = "pending",
  CONFIRMED = "confirmed",
  PREPARING = "preparing",
  ON_THE_WAY = "on_the_way",
  DELIVERED = "delivered",
  CANCELLED = "cancelled",
}

export type Order = {
  id: string;
  status: OrderStatus;
  totalAmount: number;
  user: { id: number; name: string };
  createdAt: string;
};
