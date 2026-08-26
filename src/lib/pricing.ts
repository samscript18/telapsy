import type { PricingSummary } from "@/types";

export const PROMO_CODES = ["KANE", "KANE2026"] as const;

export function normalizePromoCode(code?: string | null) {
  return code?.trim().toUpperCase() ?? "";
}

export function isValidPromoCode(code?: string | null) {
  return PROMO_CODES.includes(normalizePromoCode(code) as (typeof PROMO_CODES)[number]);
}

export function calculatePricing(
  items: Array<{ priceCents: number; quantity: number }>,
  requestedPromo?: string | null,
): PricingSummary {
  const subtotalCents = items.reduce(
    (sum, item) => sum + Math.max(0, Math.trunc(item.priceCents)) * Math.max(0, Math.trunc(item.quantity)),
    0,
  );
  const promoCode = isValidPromoCode(requestedPromo) ? normalizePromoCode(requestedPromo) : null;
  const discountCents = promoCode ? Math.round(subtotalCents * 0.2) : 0;
  const shippingCents = 0;
  return { subtotalCents, discountCents, shippingCents, totalCents: subtotalCents - discountCents, promoCode };
}

export function formatMoney(cents: number) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(cents / 100);
}
