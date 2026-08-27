"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Minus, Plus, ShoppingBag, Trash2, X } from "lucide-react";
import { useState } from "react";
import { calculatePricing, formatMoney } from "@/lib/pricing";
import { OrderSummary } from "@/components/order-summary";
import { useCart } from "@/store/cart";
import { AccountShell } from "@/components/account-shell";

function CartContent() {
  const { items, promoCode, hydrated, setQuantity, removeItem, clearCart, applyPromo, removePromo } = useCart();
  const [code, setCode] = useState("");
  const [message, setMessage] = useState("");
  const pricing = calculatePricing(items, promoCode);

  if (!hydrated) {
    return <div className="shell py-24 text-center text-sm font-light text-[var(--muted)]">Loading your cart…</div>;
  }

  if (!items.length) {
    return (
      <div className="shell py-24 text-center">
        <ShoppingBag className="mx-auto text-[var(--faint)]" size={48} />
        <h1 className="mt-6 text-4xl font-extralight tracking-[-0.04em] text-[var(--ink)] md:text-5xl">Your cart is empty.</h1>
        <p className="mt-3 text-base font-extralight text-[var(--muted)]">Good things are waiting in the collection.</p>
        <Link className="btn btn-primary mt-8 rounded-full px-7 py-3" href="/dashboard/products">
          Try now <ArrowRight size={16} />
        </Link>
      </div>
    );
  }

  const submitPromo = (event: React.FormEvent) => {
    event.preventDefault();
    if (applyPromo(code)) {
      setMessage("20% off applied to your merchandise.");
      setCode("");
    } else {
      setMessage("This promo code is not valid. Try KANE or KANE2026.");
    }
  };

  return (
    <div className="shell py-12">
      <div className="flex items-end justify-between border-b border-[var(--line)] pb-6">
        <div>
          <p className="eyebrow">Your selection</p>
          <h1 className="mt-2 text-4xl font-extralight tracking-[-0.04em] text-[var(--ink)] md:text-5xl">Cart</h1>
        </div>
        <button onClick={clearCart} className="text-xs font-mono text-[var(--faint)] hover:text-[var(--ink)] underline">
          Clear cart
        </button>
      </div>

      <div className="mt-10 grid gap-10 lg:grid-cols-[1.5fr_.8fr]">
        {/* Cart Items List */}
        <section aria-label="Cart items" className="grid content-start gap-4">
          {items.map((item) => (
            <article
              key={item.slug}
              className="rounded-xl border border-[var(--line)] bg-[var(--surface)] p-4 grid grid-cols-[100px_1fr] gap-5 sm:grid-cols-[120px_1fr]"
            >
              <Link href={`/dashboard/products/${item.slug}`} className="relative aspect-square overflow-hidden rounded-lg bg-[var(--raised)] border border-white/5">
                <Image src={item.image} alt={item.name} fill className="object-cover" />
              </Link>
              <div className="flex flex-col justify-between py-1">
                <div className="flex justify-between gap-4">
                  <div>
                    <span className="text-[10px] font-light tracking-[0.2em] uppercase text-[var(--accent)]">{item.category}</span>
                    <Link href={`/dashboard/products/${item.slug}`} className="mt-1 block text-base font-light text-[var(--ink)] hover:text-[var(--accent)] transition-colors">
                      {item.name}
                    </Link>
                    <p className="mt-1 font-mono text-xs text-[var(--faint)]">{formatMoney(item.priceCents)} each</p>
                  </div>
                  <button
                    onClick={() => removeItem(item.slug)}
                    aria-label={`Remove ${item.name}`}
                    className="h-fit text-[var(--faint)] hover:text-[var(--retired)] transition-colors"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>

                <div className="mt-4 flex items-end justify-between">
                  <div className="flex h-9 items-center rounded-full border border-[var(--line)] bg-[var(--canvas)] px-1">
                    <button
                      onClick={() => setQuantity(item.slug, item.quantity - 1)}
                      disabled={item.quantity === 1}
                      aria-label={`Decrease ${item.name} quantity`}
                      className="grid h-7 w-7 place-items-center rounded-full text-[var(--muted)] hover:text-[var(--ink)] disabled:opacity-30"
                    >
                      <Minus size={14} />
                    </button>
                    <output className="w-8 text-center font-mono text-xs font-medium text-[var(--ink)]">{item.quantity}</output>
                    <button
                      onClick={() => setQuantity(item.slug, item.quantity + 1)}
                      disabled={item.quantity === item.stock}
                      aria-label={`Increase ${item.name} quantity`}
                      className="grid h-7 w-7 place-items-center rounded-full text-[var(--muted)] hover:text-[var(--ink)] disabled:opacity-30"
                    >
                      <Plus size={14} />
                    </button>
                  </div>

                  <div className="text-right">
                    <p className="text-[10px] font-mono text-[var(--faint)] uppercase">Line Total</p>
                    <strong className="font-mono text-sm text-[var(--accent)]">{formatMoney(item.priceCents * item.quantity)}</strong>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </section>

        {/* Order Summary Sidebar */}
        <aside className="rounded-xl border border-[var(--line)] bg-[var(--surface)] p-6 h-fit lg:sticky lg:top-28">
          <h2 className="text-lg font-light tracking-tight text-[var(--ink)]">Order Summary</h2>

          {/* Promo Code Form */}
          <form onSubmit={submitPromo} className="mt-6">
            <label className="text-xs font-mono text-[var(--faint)]" htmlFor="promo">
              PROMO CODE
            </label>
            {promoCode ? (
              <div className="mt-2 flex items-center justify-between rounded-lg border border-[var(--accent)]/30 bg-[var(--accent)]/10 px-4 py-2.5 text-xs">
                <span className="font-mono text-[var(--accent)]">
                  <strong>{promoCode}</strong> · 20% OFF
                </span>
                <button type="button" onClick={removePromo} aria-label="Remove promo" className="text-[var(--accent)] hover:opacity-80">
                  <X size={15} />
                </button>
              </div>
            ) : (
              <div className="mt-2 flex gap-2">
                <input
                  id="promo"
                  className="field text-xs font-mono"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  placeholder="KANE or KANE2026"
                />
                <button className="btn btn-secondary !rounded-xl !px-4 !py-2 text-xs">Apply</button>
              </div>
            )}
            {message && (
              <p
                className={`mt-2 text-xs font-light ${message.startsWith("That") ? "text-[var(--retired)]" : "text-[var(--accent)]"}`}
                role="status"
              >
                {message}
              </p>
            )}
          </form>

          <div className="my-6 border-t border-[var(--line)]" />

          <OrderSummary pricing={pricing} />

          <Link href="/dashboard/checkout" className="btn btn-primary mt-6 w-full rounded-full py-3.5 text-sm font-medium">
            Proceed to checkout <ArrowRight size={16} />
          </Link>
          <Link href="/dashboard/products" className="mt-4 block text-center text-xs font-mono text-[var(--faint)] hover:text-[var(--ink)] underline">
            Continue shopping
          </Link>
        </aside>
      </div>
    </div>
  );
}

export default function CartPage() { return <AccountShell title="Cart"><CartContent /></AccountShell>; }
