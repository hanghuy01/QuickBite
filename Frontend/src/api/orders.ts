import { api } from "@/lib/axios";

export type CreateOrderDto = {
  restaurantId: number;
  items: { menuItemId: number; quantity: number }[];
};
export type Order = {
  id: number;
  status: "pending" | "confirmed" | "preparing" | "on_the_way" | "delivered" | "cancelled";
  createdAt: string;
};

const ORDER_API_URL = "/orders";

export const createOrder = async (payload: CreateOrderDto) => {
  const res = await api.post(ORDER_API_URL, payload);
  return res.data;
};
export const fetchOrders = async () => {
  const res = await api.get<Order[]>(ORDER_API_URL);
  return res.data;
};
export const fetchOrder = async (id: number) => {
  const res = await api.get<Order>(`${ORDER_API_URL}/${id}`);
  return res.data;
};
