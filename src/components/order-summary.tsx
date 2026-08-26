import { calculatePricing, formatMoney } from "@/lib/pricing";

export function OrderSummary({ pricing, compact = false }: { pricing: ReturnType<typeof calculatePricing>; compact?: boolean }) {
  return (
    <dl className={`grid gap-3 font-light ${compact ? "text-xs" : "text-sm"}`}>
      <div className="flex justify-between">
        <dt className="text-[var(--muted)]">Subtotal</dt>
        <dd className="font-mono text-[var(--ink)]">{formatMoney(pricing.subtotalCents)}</dd>
      </div>
      <div className="flex justify-between">
        <dt className="text-[var(--muted)]">Discount{pricing.promoCode ? ` (${pricing.promoCode})` : ""}</dt>
        <dd className="font-mono text-[var(--accent)]">
          {pricing.discountCents ? `−${formatMoney(pricing.discountCents)}` : formatMoney(0)}
        </dd>
      </div>
      <div className="flex justify-between">
        <dt className="text-[var(--muted)]">Shipping</dt>
        <dd className="font-mono text-[var(--accent)]">FREE</dd>
      </div>
      <div className="mt-3 flex justify-between border-t border-[var(--line)] pt-4 text-base font-normal">
        <dt className="text-[var(--ink)]">Total</dt>
        <dd className="font-mono text-lg text-[var(--accent)] font-medium">{formatMoney(pricing.totalCents)}</dd>
      </div>
    </dl>
  );
}
