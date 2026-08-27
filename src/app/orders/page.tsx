"use client";

import { useQuery } from "@tanstack/react-query";
import {
  ArrowUpRight,
  CalendarDays,
  CheckCircle2,
  CreditCard,
  PackageOpen,
  ShoppingBag,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { AccountShell } from "@/components/account-shell";
import type { OrderViewData } from "@/components/order-view";
import { formatMoney } from "@/lib/pricing";

function formatStatus(status: string) {
  return status.replaceAll("-", " ");
}

function paymentLabel(paymentMethod: string) {
  return paymentMethod === "balance" ? "Telapsy Balance" : "Simulated Card";
}

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
    return (
      <AccountShell title="Orders">
        <div className="account-page">
          <div className="h-24 animate-pulse rounded-[1.75rem] border border-[var(--line)] bg-[var(--surface)]" />
          <div className="mt-8 grid gap-5">
            {[0, 1, 2].map((item) => (
              <div
                key={item}
                className="h-52 animate-pulse rounded-[1.75rem] border border-[var(--line)] bg-[var(--surface)]"
              />
            ))}
          </div>
        </div>
      </AccountShell>
    );
  }

  if (!data) {
    return (
      <AccountShell title="Orders">
        <div className="py-24 text-center">
          <h1 className="text-4xl font-extralight tracking-[-0.04em] text-[var(--ink)]">
            Sign in to view orders.
          </h1>
          <Link
            href="/signin"
            className="btn btn-primary mt-7 rounded-full px-7 py-3 text-sm"
          >
            Sign in
          </Link>
        </div>
      </AccountShell>
    );
  }

  return (
    <AccountShell title="Orders">
      <div className="account-page">
        <header className="account-page-header">
          <div>
            <p className="eyebrow">Purchase history</p>
            <h1>My Orders</h1>
            <p>Track every Telapsy order and revisit the details whenever you need them.</p>
          </div>
          {data.orders.length > 0 && (
            <div className="hidden items-center gap-3 rounded-2xl border border-[var(--line)] bg-[var(--surface)] px-4 py-3 text-right sm:flex">
              <span className="grid size-10 place-items-center rounded-xl bg-[rgba(232,185,106,.1)] text-[var(--accent)]">
                <ShoppingBag size={18} />
              </span>
              <div>
                <strong className="block text-lg font-medium text-[var(--ink)]">
                  {data.orders.length}
                </strong>
                <span className="text-[10px] uppercase tracking-[0.16em] text-[var(--faint)]">
                  {data.orders.length === 1 ? "Order" : "Orders"}
                </span>
              </div>
            </div>
          )}
        </header>

        {!data.orders.length ? (
          <div className="relative mt-10 overflow-hidden rounded-[1.75rem] border border-[var(--line)] bg-[var(--surface)] px-6 py-20 text-center sm:px-10">
            <div className="pointer-events-none absolute left-1/2 top-0 size-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[rgba(232,185,106,.08)] blur-3xl" />
            <span className="relative mx-auto grid size-16 place-items-center rounded-2xl border border-[rgba(232,185,106,.2)] bg-[rgba(232,185,106,.08)] text-[var(--accent)]">
              <PackageOpen size={28} />
            </span>
            <h2 className="relative mt-5 text-2xl font-light text-[var(--ink)]">
              Your order history starts here.
            </h2>
            <p className="relative mx-auto mt-2 max-w-md text-sm leading-6 text-[var(--muted)]">
              Discover something you love, place your first order, and track it from this page.
            </p>
            <Link
              href="/dashboard/products"
              className="btn btn-primary relative mt-7 rounded-full px-7 py-3 text-sm"
            >
              Shop products
            </Link>
          </div>
        ) : (
          <div className="mt-8 grid gap-5">
            {data.orders.map((order) => {
              const itemCount = order.items.reduce((sum, item) => sum + item.quantity, 0);
              const firstItem = order.items[0];
              const additionalProducts = Math.max(order.items.length - 3, 0);

              return (
                <Link
                  key={order.orderNumber}
                  href={`/orders/${order.orderNumber}`}
                  aria-label={`View order ${order.orderNumber}`}
                  className="group relative overflow-hidden rounded-[1.75rem] border border-[var(--line)] bg-[linear-gradient(135deg,rgba(255,255,255,.045),rgba(255,255,255,.018))] p-5 transition-all duration-300 hover:-translate-y-1 hover:border-[rgba(232,185,106,.32)] hover:shadow-[0_24px_70px_rgba(0,0,0,.3)] sm:p-7"
                >
                  <div className="pointer-events-none absolute -right-20 -top-24 size-56 rounded-full bg-[rgba(232,185,106,.07)] opacity-0 blur-3xl transition-opacity duration-500 group-hover:opacity-100" />

                  <div className="relative flex flex-wrap items-start justify-between gap-4 border-b border-[var(--line)] pb-5">
                    <div>
                      <span className="text-[9px] font-medium uppercase tracking-[0.22em] text-[var(--faint)]">
                        Order number
                      </span>
                      <strong className="mt-1 block font-mono text-sm font-normal tracking-[0.04em] text-[var(--accent)] sm:text-base">
                        #{order.orderNumber}
                      </strong>
                    </div>
                    <span className="inline-flex items-center gap-2 rounded-full border border-[rgba(86,211,142,.18)] bg-[rgba(86,211,142,.07)] px-3 py-1.5 text-[10px] font-medium uppercase tracking-[0.14em] text-[#83dda9]">
                      <CheckCircle2 size={13} />
                      {formatStatus(order.orderStatus)}
                    </span>
                  </div>

                  <div className="relative grid gap-6 py-6 lg:grid-cols-[minmax(0,1.35fr)_minmax(260px,.65fr)] lg:items-center">
                    <div className="flex min-w-0 flex-col gap-5 sm:flex-row sm:items-center">
                      <div className="flex shrink-0 -space-x-3">
                        {order.items.slice(0, 3).map((item, index) => (
                          <span
                            key={`${item.slug}-${index}`}
                            className="relative size-16 overflow-hidden rounded-2xl border-2 border-[#0a0a0a] bg-[#151515] shadow-lg sm:size-[4.5rem]"
                            style={{ zIndex: 3 - index }}
                          >
                            <Image
                              src={item.image}
                              alt=""
                              fill
                              sizes="72px"
                              className="object-cover transition-transform duration-500 group-hover:scale-105"
                            />
                          </span>
                        ))}
                        {additionalProducts > 0 && (
                          <span className="relative z-0 grid size-16 place-items-center rounded-2xl border-2 border-[#0a0a0a] bg-[#1c1914] text-xs font-medium text-[var(--accent)] shadow-lg sm:size-[4.5rem]">
                            +{additionalProducts}
                          </span>
                        )}
                      </div>

                      <div className="min-w-0">
                        <h2 className="truncate text-lg font-medium tracking-[-0.02em] text-[var(--ink)] sm:text-xl">
                          {firstItem?.name ?? "Telapsy order"}
                        </h2>
                        <p className="mt-1 text-sm text-[var(--muted)]">
                          {itemCount} {itemCount === 1 ? "item" : "items"}
                          {order.items.length > 1
                            ? ` across ${order.items.length} products`
                            : " in this order"}
                        </p>
                        {order.discountCents > 0 && (
                          <span className="mt-3 inline-flex rounded-full bg-[rgba(232,185,106,.08)] px-2.5 py-1 text-[10px] uppercase tracking-[0.14em] text-[var(--accent)]">
                            {order.promoCode ? `${order.promoCode} · ` : ""}
                            {formatMoney(order.discountCents)} saved
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-2">
                      <div className="rounded-2xl border border-[var(--line)] bg-black/15 p-3.5">
                        <CalendarDays size={15} className="text-[var(--accent)]" />
                        <span className="mt-3 block text-[9px] uppercase tracking-[0.17em] text-[var(--faint)]">
                          Placed
                        </span>
                        <strong className="mt-1 block text-xs font-normal text-[var(--ink)]">
                          {new Date(order.createdAt).toLocaleDateString(undefined, {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })}
                        </strong>
                      </div>
                      <div className="rounded-2xl border border-[var(--line)] bg-black/15 p-3.5">
                        <CreditCard size={15} className="text-[var(--accent)]" />
                        <span className="mt-3 block text-[9px] uppercase tracking-[0.17em] text-[var(--faint)]">
                          Payment
                        </span>
                        <strong className="mt-1 block truncate text-xs font-normal text-[var(--ink)]">
                          {paymentLabel(order.paymentMethod)}
                        </strong>
                      </div>
                    </div>
                  </div>

                  <div className="relative flex items-end justify-between gap-4 border-t border-[var(--line)] pt-5">
                    <div>
                      <span className="text-[9px] uppercase tracking-[0.2em] text-[var(--faint)]">
                        Order total
                      </span>
                      <strong className="mt-1 block text-2xl font-medium tracking-[-0.03em] text-[var(--ink)]">
                        {formatMoney(order.totalCents)}
                      </strong>
                    </div>
                    <span className="grid size-11 place-items-center rounded-full border border-[rgba(232,185,106,.25)] bg-[rgba(232,185,106,.08)] text-[var(--accent)] transition-all duration-300 group-hover:rotate-6 group-hover:border-[var(--accent)] group-hover:bg-[var(--accent)] group-hover:text-[#090704]">
                      <ArrowUpRight size={18} />
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </AccountShell>
  );
}
