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
  authProvider?: "password" | "google" | "both";
  profileImage?: string;
  createdAt?: string;
  preferences?: { orderUpdates: boolean; productNews: boolean; compactDashboard: boolean };
}

export interface AccountSession {
  id: string;
  device: string;
  browser: string;
  operatingSystem: string;
  createdAt: string;
  lastActiveAt: string;
  expiresAt: string;
  current: boolean;
}

export interface DeliveryAddress {
  id: string;
  address: string;
  city: string;
  state: string;
  country: string;
  lastUsedAt: string;
}

export interface NotificationData {
  id: string;
  type: "account" | "order" | "collection" | "security";
  title: string;
  message: string;
  actionUrl?: string;
  read: boolean;
  createdAt: string;
}
