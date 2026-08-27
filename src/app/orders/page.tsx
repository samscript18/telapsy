"use client";

import { useQuery } from "@tanstack/react-query";
import { ArrowRight, PackageOpen } from "lucide-react";
import Link from "next/link";
import { formatMoney } from "@/lib/pricing";
import type { OrderViewData } from "@/components/order-view";
import { AccountShell } from "@/components/account-shell";
export default function OrdersPage() {
  const { data, isLoading } = useQuery<{ orders: OrderViewData[] }>({
    queryKey: ["orders"],
    queryFn: async () => {
      const r = await fetch("/api/orders");
      if (!r.ok) throw new Error();
      return r.json();
    },
    retry: false,
  });

  if (isLoading) {
    return <AccountShell title="Orders"><div className="py-24 text-center text-sm font-light text-[var(--muted)]">Loading orders…</div></AccountShell>;
  }

  if (!data) {
    return (
      <AccountShell title="Orders"><div className="py-24 text-center">
        <h1 className="text-4xl font-extralight tracking-[-0.04em] text-[var(--ink)]">Sign in to view orders.</h1>
        <Link href="/signin" className="btn btn-primary mt-7 rounded-full px-7 py-3 text-sm">
          Sign in
        </Link>
      </div></AccountShell>
    );
  }

  return (
    <AccountShell title="Orders"><div>
      <div className="border-b border-[var(--line)] pb-6">
        <p className="eyebrow">Your Account</p>
        <h1 className="mt-2 text-4xl font-extralight tracking-[-0.04em] text-[var(--ink)] md:text-5xl">My Orders</h1>
      </div>

      {!data.orders.length ? (
        <div className="mt-12 rounded-xl border border-[var(--line)] bg-[var(--surface)] py-20 text-center">
          <PackageOpen className="mx-auto text-[var(--faint)]" size={42} />
          <h2 className="mt-4 text-2xl font-extralight text-[var(--ink)]">No orders placed yet.</h2>
          <Link href="/dashboard/products" className="btn btn-primary mt-6 rounded-full px-7 py-3 text-sm">
            Shop products
          </Link>
        </div>
      ) : (
        <div className="mt-8 grid gap-4">
          {data.orders.map((order) => (
            <Link
              key={order.orderNumber}
              href={`/orders/${order.orderNumber}`}
              className="group rounded-xl border border-[var(--line)] bg-[var(--surface)] p-6 transition-all hover:border-[var(--line-strong)] grid items-center gap-4 sm:grid-cols-[1fr_1fr_1fr_auto]"
            >
              <div>
                <span className="text-[10px] font-mono tracking-[0.2em] uppercase text-[var(--faint)]">ORDER NUMBER</span>
                <strong className="block font-mono text-sm text-[var(--accent)] font-normal">#{order.orderNumber}</strong>
              </div>
              <div>
                <span className="text-[10px] font-mono tracking-[0.2em] uppercase text-[var(--faint)]">DATE PLACED</span>
                <span className="block font-mono text-xs text-[var(--muted)]">{new Date(order.createdAt).toLocaleDateString()}</span>
              </div>
              <div>
                <span className="text-[10px] font-mono tracking-[0.2em] uppercase text-[var(--faint)]">TOTAL · {order.orderStatus}</span>
                <strong className="block font-mono text-sm text-[var(--ink)] font-normal">{formatMoney(order.totalCents)}</strong>
              </div>
              <ArrowRight size={16} className="text-[var(--accent)] transition-transform group-hover:translate-x-1" />
            </Link>
          ))}
        </div>
      )}
    </div></AccountShell>
  );
}
