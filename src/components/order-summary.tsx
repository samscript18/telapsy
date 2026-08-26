import { calculatePricing, formatMoney } from "@/lib/pricing";

export function OrderSummary({ pricing, compact = false }: { pricing: ReturnType<typeof calculatePricing>; compact?: boolean }) {
  return <dl className={`grid gap-3 ${compact ? "text-sm" : ""}`}>
    <div className="flex justify-between"><dt className="text-[var(--muted)]">Subtotal</dt><dd className="font-bold">{formatMoney(pricing.subtotalCents)}</dd></div>
    <div className="flex justify-between"><dt className="text-[var(--muted)]">Discount{pricing.promoCode ? ` (${pricing.promoCode})` : ""}</dt><dd className="font-bold text-[var(--forest)]">{pricing.discountCents ? `−${formatMoney(pricing.discountCents)}` : formatMoney(0)}</dd></div>
    <div className="flex justify-between"><dt className="text-[var(--muted)]">Shipping</dt><dd className="font-bold text-[var(--forest)]">FREE</dd></div>
    <div className="mt-2 flex justify-between border-t border-[var(--line)] pt-5 text-xl"><dt className="font-bold">Total</dt><dd className="font-black">{formatMoney(pricing.totalCents)}</dd></div>
  </dl>;
}
