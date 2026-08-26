import Image from "next/image";
import { CheckCircle2, MapPin } from "lucide-react";
import { formatMoney } from "@/lib/pricing";

export interface OrderViewData {
  orderNumber: string;
  items: Array<{
    slug: string;
    name: string;
    image: string;
    quantity: number;
    unitPriceCents: number;
    lineTotalCents: number;
  }>;
  subtotalCents: number;
  discountCents: number;
  shippingCents: number;
  totalCents: number;
  promoCode?: string;
  paymentMethod: string;
  paymentStatus: string;
  orderStatus: string;
  createdAt: string;
  delivery: { address: string; city: string; state: string; country: string };
}

export function OrderView({ order }: { order: OrderViewData }) {
  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
      <section className="rounded-xl border border-[var(--line)] bg-[var(--surface)] p-6 sm:p-8">
        <h2 className="text-lg font-light tracking-tight text-[var(--ink)]">Items Purchased</h2>
        <div className="mt-6 grid gap-4 divide-y divide-[var(--line)]">
          {order.items.map((item) => (
            <div key={item.slug} className="grid grid-cols-[64px_1fr_auto] items-center gap-4 pt-4 first:pt-0">
              <div className="relative aspect-square overflow-hidden rounded-lg bg-[var(--raised)] border border-white/5">
                <Image src={item.image} alt={item.name} fill className="object-cover" />
              </div>
              <div>
                <p className="text-sm font-light text-[var(--ink)]">{item.name}</p>
                <p className="mt-0.5 font-mono text-xs text-[var(--faint)]">
                  {item.quantity} × {formatMoney(item.unitPriceCents)}
                </p>
              </div>
              <strong className="font-mono text-sm font-light text-[var(--accent)]">{formatMoney(item.lineTotalCents)}</strong>
            </div>
          ))}
        </div>
      </section>

      <aside className="grid content-start gap-5">
        <section className="rounded-xl border border-[var(--line)] bg-[var(--surface)] p-6">
          <h2 className="text-base font-light tracking-tight text-[var(--ink)]">Payment Summary</h2>
          <dl className="mt-5 grid gap-3 text-xs font-light">
            <Row label="Subtotal" value={formatMoney(order.subtotalCents)} />
            <Row label={`Discount${order.promoCode ? ` (${order.promoCode})` : ""}`} value={`−${formatMoney(order.discountCents)}`} />
            <Row label="Shipping" value="FREE" />
            <div className="mt-3 flex justify-between border-t border-[var(--line)] pt-4 text-sm font-normal">
              <dt className="text-[var(--ink)]">Total Paid</dt>
              <dd className="font-mono text-base font-medium text-[var(--accent)]">{formatMoney(order.totalCents)}</dd>
            </div>
          </dl>
          <div className="mt-5 flex items-center gap-2 text-xs font-mono text-[var(--accent)]">
            <CheckCircle2 size={16} /> Payment Successful
          </div>
          <p className="mt-2 text-[11px] font-mono text-[var(--faint)]">
            Paid with {order.paymentMethod === "balance" ? "Telapsy Balance" : "Simulated Card"}
          </p>
        </section>

        <section className="rounded-xl border border-[var(--line)] bg-[var(--surface)] p-6">
          <h2 className="flex items-center gap-2 text-base font-light tracking-tight text-[var(--ink)]">
            <MapPin size={16} className="text-[var(--accent)]" /> Delivery Address
          </h2>
          <p className="mt-3 text-xs leading-relaxed font-light text-[var(--muted)] font-mono">
            {order.delivery.address}
            <br />
            {order.delivery.city}, {order.delivery.state}
            <br />
            {order.delivery.country}
          </p>
        </section>
      </aside>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between">
      <dt className="text-[var(--muted)]">{label}</dt>
      <dd className="font-mono text-[var(--ink)]">{value}</dd>
    </div>
  );
}
