"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect } from "react";
import { OrderView, type OrderViewData } from "@/components/order-view";
import { AccountShell } from "@/components/account-shell";
import { useCart } from "@/store/cart";

function SuccessContent() {
  const { orderNumber } = useParams<{ orderNumber: string }>();
  const clear = useCart((s) => s.clearCart);
  const qc = useQueryClient();

  const { data, isLoading, error } = useQuery<{ order: OrderViewData }>({
    queryKey: ["order", orderNumber],
    queryFn: async () => {
      const r = await fetch(`/api/orders/${orderNumber}`);
      if (!r.ok) throw new Error((await r.json()).error);
      return r.json();
    },
  });

  useEffect(() => {
    if (data) {
      clear();
      qc.invalidateQueries({ queryKey: ["me"] });
      qc.invalidateQueries({ queryKey: ["orders"] });
    }
  }, [data, clear, qc]);

  if (isLoading) {
    return <div className="shell py-24 text-center text-sm font-light text-[var(--muted)]">Loading order confirmation…</div>;
  }

  if (error || !data) {
    return (
      <div className="shell py-24 text-center">
        <h1 className="text-4xl font-extralight tracking-[-0.04em] text-[var(--ink)]">Confirmation unavailable.</h1>
        <p className="mt-4 font-mono text-xs text-[var(--retired)]">{error instanceof Error ? error.message : "Order not found."}</p>
      </div>
    );
  }

  return (
    <div className="shell py-12">
      <div className="mb-12 text-center">
        <CheckCircle2 className="mx-auto text-[var(--accent)]" size={48} />
        <p className="eyebrow mt-4">Payment Verified</p>
        <h1 className="mt-2 text-4xl font-extralight tracking-[-0.04em] text-[var(--ink)] md:text-6xl">Order Confirmed</h1>
        <p className="mt-2 font-mono text-sm text-[var(--accent)]">Order #{data.order.orderNumber}</p>

        <div className="mt-8 flex justify-center gap-3">
          <Link href="/dashboard/products" className="btn btn-primary rounded-full px-7 py-3 text-sm">
            Continue shopping
          </Link>
          <Link href={`/orders/${data.order.orderNumber}`} className="btn btn-secondary rounded-full px-7 py-3 text-sm">
            View order details
          </Link>
        </div>
      </div>

      <OrderView order={data.order} />
    </div>
  );
}

export default function SuccessPage() {
  return <AccountShell title="Order confirmed" eyebrow="Payment verified"><SuccessContent /></AccountShell>;
}
