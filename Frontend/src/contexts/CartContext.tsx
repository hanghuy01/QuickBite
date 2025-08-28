import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

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
  const recalc = useCallback((items: CartItem[]) => items.reduce((s, i) => s + i.price * i.quantity, 0), []);

  const addItem = useCallback(
    (item: CartItem) => {
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
    },
    [recalc]
  );

  const decreaseItem = useCallback(
    (menuItemId: number) => {
      setState((prev) => {
        const idx = prev.items.findIndex((i) => i.menuItemId === menuItemId);
        if (idx < 0) return prev;

        const nextItems = [...prev.items];
        if (nextItems[idx].quantity > 1) {
          nextItems[idx] = {
            ...nextItems[idx],
            quantity: nextItems[idx].quantity - 1,
          };
        } else {
          nextItems.splice(idx, 1);
        }
        return {
          items: nextItems,
          restaurantId: nextItems.length ? prev.restaurantId : null,
          total: recalc(nextItems),
        };
      });
    },
    [recalc]
  );

  const removeItem = useCallback(
    (menuItemId: number) => {
      setState((prev) => {
        const nextItems = prev.items.filter((i) => i.menuItemId !== menuItemId);
        return {
          items: nextItems,
          restaurantId: nextItems.length ? prev.restaurantId : null,
          total: recalc(nextItems),
        };
      });
    },
    [recalc]
  );

  const clearCart = useCallback(() => {
    setState({ items: [], restaurantId: null, total: 0 });
  }, []);

  // Memoize context value để không tạo object mới mỗi render

  const value = useMemo(
    () => ({ state, addItem, decreaseItem, removeItem, clearCart }),
    [state, addItem, decreaseItem, removeItem, clearCart]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
};
