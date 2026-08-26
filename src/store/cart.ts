"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { CartItem, ProductData } from "@/types";
import { isValidPromoCode, normalizePromoCode } from "@/lib/pricing";

interface CartStore {
  items: CartItem[];
  promoCode: string | null;
  hydrated: boolean;
  setHydrated: (value: boolean) => void;
  addItem: (product: ProductData, quantity?: number) => void;
  setQuantity: (slug: string, quantity: number) => void;
  removeItem: (slug: string) => void;
  clearCart: () => void;
  applyPromo: (code: string) => boolean;
  removePromo: () => void;
}

export const useCart = create<CartStore>()(persist((set, get) => ({
  items: [], promoCode: null, hydrated: false,
  setHydrated: (hydrated) => set({ hydrated }),
  addItem: (product, quantity = 1) => set({ items: (() => {
    const current = get().items.find((item) => item.slug === product.slug);
    if (!current) return [...get().items, { ...product, quantity: Math.min(product.stock, Math.max(1, quantity)) }];
    return get().items.map((item) => item.slug === product.slug ? { ...item, quantity: Math.min(item.stock, item.quantity + quantity) } : item);
  })() }),
  setQuantity: (slug, quantity) => set({ items: get().items.map((item) => item.slug === slug ? { ...item, quantity: Math.max(1, Math.min(item.stock, quantity)) } : item) }),
  removeItem: (slug) => set({ items: get().items.filter((item) => item.slug !== slug) }),
  clearCart: () => set({ items: [], promoCode: null }),
  applyPromo: (code) => { if (!isValidPromoCode(code)) return false; set({ promoCode: normalizePromoCode(code) }); return true; },
  removePromo: () => set({ promoCode: null }),
}), { name: "telapsy-cart", partialize: ({ items, promoCode }) => ({ items, promoCode }), onRehydrateStorage: () => (state) => state?.setHydrated(true) }));
