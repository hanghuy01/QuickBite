import React, { createContext, useContext, useState, type ReactNode } from "react";

type CartItem = {
  menuItemId: number;
  nameRestaurant: string;
  name: string;
  price: number;
  quantity: number;
  restaurantId: number;
};

type CartState = {
  items: CartItem[];
  restaurantId: number | null;
  total: number;
};

type Ctx = {
  state: CartState;
  addItem: (item: CartItem) => void;
  decreaseItem: (menuItemId: number) => void;
  removeItem: (menuItemId: number) => void;
  clearCart: () => void;
};

const CartContext = createContext<Ctx | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [state, setState] = useState<CartState>({ items: [], restaurantId: null, total: 0 });

  const recalc = (items: CartItem[]) => items.reduce((s, i) => s + i.price * i.quantity, 0);

  const addItem = (item: CartItem) => {
    setState((prev) => {
      // Nếu có restaurantId khác, reset lại giỏ hàng (vì liên quan đến shipping)
      if (prev.restaurantId && prev.restaurantId !== item.restaurantId) {
        return { items: [item], restaurantId: item.restaurantId, total: item.price * item.quantity };
      }
      const idx = prev.items.findIndex((i) => i.menuItemId === item.menuItemId);
      const nextItems = [...prev.items];
      if (idx >= 0) {
        nextItems[idx] = { ...nextItems[idx], quantity: nextItems[idx].quantity + item.quantity };
      } else {
        nextItems.push(item);
      }
      return { items: nextItems, restaurantId: item.restaurantId, total: recalc(nextItems) };
    });
  };

  const decreaseItem = (menuItemId: number) => {
    setState((prev) => {
      const idx = prev.items.findIndex((i) => i.menuItemId === menuItemId);
      if (idx < 0) return prev;
      const nextItems = [...prev.items];
      if (nextItems[idx].quantity > 1) {
        nextItems[idx] = { ...nextItems[idx], quantity: nextItems[idx].quantity - 1 };
      } else {
        nextItems.splice(idx, 1);
      }
      return { items: nextItems, restaurantId: nextItems.length ? prev.restaurantId : null, total: recalc(nextItems) };
    });
  };

  const removeItem = (menuItemId: number) => {
    setState((prev) => {
      const nextItems = prev.items.filter((i) => i.menuItemId !== menuItemId);
      return { items: nextItems, restaurantId: nextItems.length ? prev.restaurantId : null, total: recalc(nextItems) };
    });
  };

  const clearCart = () => setState({ items: [], restaurantId: null, total: 0 });

  return (
    <CartContext.Provider value={{ state, addItem, decreaseItem, removeItem, clearCart }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
};
