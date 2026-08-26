export const CATEGORIES = ["Fashion", "Electronics", "Home", "Accessories"] as const;
export type Category = (typeof CATEGORIES)[number];

export interface ProductData {
  id: string;
  name: string;
  slug: string;
  description: string;
  priceCents: number;
  category: Category;
  image: string;
  stock: number;
  featured: boolean;
  rating: number;
  reviewCount: number;
}

export interface CartItem extends ProductData { quantity: number }

export interface PricingSummary {
  subtotalCents: number;
  discountCents: number;
  shippingCents: number;
  totalCents: number;
  promoCode: string | null;
}

export interface SessionUser {
  id: string;
  name: string;
  email: string;
  balanceCents: number;
}
