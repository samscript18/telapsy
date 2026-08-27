"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { CartItem, ProductData } from "@/types";
import { isValidPromoCode, normalizePromoCode } from "@/lib/pricing";

interface CartStore {
  items: CartItem[];
  promoCode: string | null;
  hydrated: boolean;
  ownerKey: string;
  carts: Record<string, CartSnapshot>;
  setHydrated: (value: boolean) => void;
  setCartOwner: (userId: string | null) => void;
  addItem: (product: ProductData, quantity?: number) => void;
  setQuantity: (slug: string, quantity: number) => void;
  removeItem: (slug: string) => void;
  clearCart: () => void;
  applyPromo: (code: string) => boolean;
  removePromo: () => void;
}

interface CartSnapshot {
  items: CartItem[];
  promoCode: string | null;
}

const GUEST_CART_KEY = "guest";

export const useCart = create<CartStore>()(
  persist(
    (set, get) => {
      function updateCart(items: CartItem[], promoCode = get().promoCode) {
        set((state) => ({
          items,
          promoCode,
          carts: {
            ...state.carts,
            [state.ownerKey]: { items, promoCode },
          },
        }));
      }

      return {
        items: [],
        promoCode: null,
        hydrated: false,
        ownerKey: GUEST_CART_KEY,
        carts: {},
        setHydrated: (hydrated) => set({ hydrated }),
        setCartOwner: (userId) => {
          const ownerKey = userId ?? GUEST_CART_KEY;
          const cart = get().carts[ownerKey] ?? { items: [], promoCode: null };
          set({ ownerKey, items: cart.items, promoCode: cart.promoCode });
        },
        addItem: (product, quantity = 1) => {
          const current = get().items.find((item) => item.slug === product.slug);
          const items = current
            ? get().items.map((item) => item.slug === product.slug ? { ...item, quantity: Math.min(item.stock, item.quantity + quantity) } : item)
            : [...get().items, { ...product, quantity: Math.min(product.stock, Math.max(1, quantity)) }];
          updateCart(items);
        },
        setQuantity: (slug, quantity) => updateCart(get().items.map((item) => item.slug === slug ? { ...item, quantity: Math.max(1, Math.min(item.stock, quantity)) } : item)),
        removeItem: (slug) => updateCart(get().items.filter((item) => item.slug !== slug)),
        clearCart: () => updateCart([], null),
        applyPromo: (code) => {
          if (!isValidPromoCode(code)) return false;
          updateCart(get().items, normalizePromoCode(code));
          return true;
        },
        removePromo: () => updateCart(get().items, null),
      };
    },
    {
      name: "telapsy-cart",
      version: 2,
      partialize: ({ carts }) => ({ carts }),
      migrate: (persistedState, version) => version < 2 ? { carts: {} } : persistedState,
      onRehydrateStorage: () => (state) => {
        state?.setCartOwner(null);
        state?.setHydrated(true);
      },
    },
  ),
);
