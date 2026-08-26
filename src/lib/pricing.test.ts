import { describe, expect, it } from "vitest";
import { calculatePricing, isValidPromoCode, normalizePromoCode } from "./pricing";

describe("pricing", () => {
  it("calculates totals in integer cents", () => expect(calculatePricing([{ priceCents: 10000, quantity: 2 }])).toEqual({ subtotalCents: 20000, discountCents: 0, shippingCents: 0, totalCents: 20000, promoCode: null }));
  it.each(["KANE", "kane", " KANE2026 "])("applies 20%% for %s", (code) => expect(calculatePricing([{ priceCents: 10000, quantity: 2 }], code).totalCents).toBe(16000));
  it("rejects invalid codes", () => expect(isValidPromoCode("KANE20")).toBe(false));
  it("normalizes codes", () => expect(normalizePromoCode(" kane ")).toBe("KANE"));
});
