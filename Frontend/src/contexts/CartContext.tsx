import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, useContext, useEffect, useState, type ReactNode } from "react";

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

const CART_KEY = "quickbite_cart";

const CartContext = createContext<Ctx | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [state, setState] = useState<CartState>({ items: [], restaurantId: null, total: 0 });

  // 🔄 Load cart từ AsyncStorage khi app mở
  useEffect(() => {
    (async () => {
      try {
        const saved = await AsyncStorage.getItem(CART_KEY);
        if (saved) {
          const parsed: CartState = JSON.parse(saved);
          setState(parsed);
        }
      } catch (err) {
        console.error("Failed to load cart", err);
      }
    })();
  }, []);

  // 💾 Persist cart mỗi khi state thay đổi
  useEffect(() => {
    (async () => {
      try {
        await AsyncStorage.setItem(CART_KEY, JSON.stringify(state));
      } catch (err) {
        console.error("Failed to save cart", err);
      }
    })();
  }, [state]);

  // tính tổng giá giỏ hàng
  const recalc = (items: CartItem[]) => items.reduce((s, i) => s + i.price * i.quantity, 0);

  const addItem = (item: CartItem) => {
    setState((prev) => {
      // Nếu có restaurantId khác, reset lại giỏ hàng (vì liên quan đến shipping)
      if (prev.restaurantId && prev.restaurantId !== item.restaurantId) {
        return { items: [item], restaurantId: item.restaurantId, total: item.price * item.quantity };
      }
      const idx = prev.items.findIndex((i) => i.menuItemId === item.menuItemId); // tìm món ăn có trong giỏ hàng
      const nextItems = [...prev.items]; // cart items cũ
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
      // tìm món ăn có trong giỏ hàng
      const idx = prev.items.findIndex((i) => i.menuItemId === menuItemId);

      // Nếu không tìm thấy món ăn, trả về trạng thái cũ
      if (idx < 0) return prev;

      // Giảm số lượng món ăn trong giỏ hàng
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
      // Tìm món ăn không có menuItemId
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
