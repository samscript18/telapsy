"use client";

import { useQuery } from "@tanstack/react-query";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { OrderView, type OrderViewData } from "@/components/order-view";
import { AccountShell } from "@/components/account-shell";
export default function OrderPage() {
  const { id } = useParams<{ id: string }>();
  const { data, isLoading, error } = useQuery<{ order: OrderViewData }>({
    queryKey: ["order", id],
    queryFn: async () => {
      const r = await fetch(`/api/orders/${id}`);
      if (!r.ok) throw new Error((await r.json()).error);
      return r.json();
    },
    retry: false,
  });

  if (isLoading) {
    return <AccountShell title="Order details"><div className="py-24 text-center text-sm font-light text-[var(--muted)]">Loading order details…</div></AccountShell>;
  }

  if (error || !data) {
    return (
      <AccountShell title="Order details"><div className="py-24 text-center">
        <h1 className="text-4xl font-extralight tracking-[-0.04em] text-[var(--ink)]">Order unavailable.</h1>
        <p className="mt-3 text-xs font-mono text-[var(--retired)]">
          {error instanceof Error ? error.message : "Order may not exist or belongs to another account."}
        </p>
        <Link href="/orders" className="btn btn-secondary mt-7 rounded-full px-7 py-3 text-sm">
          Back to orders
        </Link>
      </div></AccountShell>
    );
  }

  return (
    <AccountShell title="Order details"><div>
      <Link
        href="/orders"
        className="mb-7 inline-flex min-h-10 items-center gap-2 rounded-full border border-[var(--line)] bg-white/[0.025] px-4 text-xs font-medium text-[var(--muted)] transition hover:border-[var(--accent)]/40 hover:bg-[var(--accent)]/[0.06] hover:text-[var(--accent)]"
      >
        <ArrowLeft size={15} />
        Back to orders
      </Link>
      <div className="mb-10 border-b border-[var(--line)] pb-6">
        <p className="eyebrow">Order Details</p>
        <h1 className="mt-2 font-mono text-3xl font-light text-[var(--accent)] md:text-5xl">
          #{data.order.orderNumber}
        </h1>
        <p className="mt-2 font-mono text-xs text-[var(--faint)]">
          Placed {new Date(data.order.createdAt).toLocaleString()} · Status: {data.order.orderStatus}
        </p>
      </div>

      <OrderView order={data.order} />
    </div></AccountShell>
  );
}
