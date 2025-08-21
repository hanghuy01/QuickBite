import { api } from "@/lib/axios";
import { MenuItem } from "@/types/types";

const MENU_ITEM_API_URL = "/menu-items";

export const addMenuItem = async (data: Omit<MenuItem, "id">) => {
  const res = await api.post<MenuItem>(MENU_ITEM_API_URL, data);
  return res.data;
};

export const editMenuItem = async (menuid: number, data: MenuItem) => {
  const { id, ...rest } = data;
  const res = await api.patch<MenuItem>(`${MENU_ITEM_API_URL}/${menuid}`, rest);
  return res.data;
};

export const deleteMenuItem = async (id: number) => {
  const res = await api.delete(`${MENU_ITEM_API_URL}/${id}`);
  return res.data;
};
