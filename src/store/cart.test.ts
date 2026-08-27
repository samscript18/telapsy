import { beforeEach, describe, expect, it } from "vitest";
import type { ProductData } from "@/types";
import { useCart } from "@/store/cart";

const product: ProductData = {
  id: "product-1",
  name: "Pulse Wireless Headphones",
  slug: "pulse-wireless-headphones",
  description: "Test product",
  priceCents: 12900,
  category: "Electronics",
  image: "/products/pulse-wireless-headphones.svg",
  stock: 10,
  featured: true,
  rating: 4.8,
  reviewCount: 42,
};

describe("account-scoped carts", () => {
  beforeEach(() => {
    useCart.setState({ items: [], promoCode: null, hydrated: true, ownerKey: "guest", carts: {} });
  });

  it("keeps guest and authenticated account carts isolated", () => {
    useCart.getState().addItem(product, 2);

    useCart.getState().setCartOwner("user-a");
    expect(useCart.getState().items).toEqual([]);
    useCart.getState().addItem(product, 1);

    useCart.getState().setCartOwner("user-b");
    expect(useCart.getState().items).toEqual([]);

    useCart.getState().setCartOwner("user-a");
    expect(useCart.getState().items).toHaveLength(1);
    expect(useCart.getState().items[0]?.quantity).toBe(1);

    useCart.getState().setCartOwner(null);
    expect(useCart.getState().items[0]?.quantity).toBe(2);
  });
});
