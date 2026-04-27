import { create } from "zustand";
import { CartItem, Dish } from "@/types";

interface CartState {
  items: CartItem[];
  addItem: (dish: Dish, qty?: number, note?: string) => void;
  removeItem: (dishId: number) => void;
  updateQty: (dishId: number, qty: number) => void;
  clearCart: () => void;
  total: () => number;
  count: () => number;
}

export const useCartStore = create<CartState>((set, get) => ({
  items: [],

  addItem: (dish, qty = 1, note) => {
    set((state) => {
      const existing = state.items.find((i) => i.dish.id === dish.id);
      if (existing) {
        return {
          items: state.items.map((i) =>
            i.dish.id === dish.id ? { ...i, quantity: i.quantity + qty } : i
          ),
        };
      }
      return { items: [...state.items, { dish, quantity: qty, specialInstructions: note }] };
    });
  },

  removeItem: (dishId) =>
    set((state) => ({ items: state.items.filter((i) => i.dish.id !== dishId) })),

  updateQty: (dishId, qty) => {
    if (qty <= 0) {
      get().removeItem(dishId);
      return;
    }
    set((state) => ({
      items: state.items.map((i) =>
        i.dish.id === dishId ? { ...i, quantity: qty } : i
      ),
    }));
  },

  clearCart: () => set({ items: [] }),

  total: () =>
    get().items.reduce((sum, i) => sum + i.dish.price * i.quantity, 0),

  count: () =>
    get().items.reduce((sum, i) => sum + i.quantity, 0),
}));
