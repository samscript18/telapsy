"use client";

import Image from "next/image";
import Link from "next/link";
import { Check, Minus, Plus, ShieldCheck, Star } from "lucide-react";
import { useState } from "react";
import { formatMoney } from "@/lib/pricing";
import { useCart } from "@/store/cart";
import type { ProductData } from "@/types";

export function ProductDetails({ product }: { product: ProductData }) {
  const [quantity, setQuantity] = useState(1);
  const addItem = useCart((s) => s.addItem);
  const isInCart = useCart((s) => s.items.some((item) => item.slug === product.slug));

  const add = () => {
    if (isInCart) return;
    addItem(product, quantity);
  };

  return (
    <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
      {/* Product Image Frame */}
      <div data-reveal className="product-hero-frame relative aspect-square overflow-hidden rounded-[2rem] border border-[var(--line)] bg-[var(--raised)]">
        <Image src={product.image} alt={product.name} fill priority className="object-cover transition-transform duration-1000 hover:scale-105" sizes="50vw" />
        <span className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-black/35 via-transparent to-white/[0.06]" />
      </div>

      {/* Product Information */}
      <div data-reveal style={{ "--reveal-delay": "120ms" } as React.CSSProperties} className="flex flex-col justify-center">
        <Link href={`/dashboard/products?category=${product.category}`} className="eyebrow">
          {product.category}
        </Link>
        <h1 className="mt-3 text-4xl font-extralight tracking-[-0.04em] text-[var(--ink)] lg:text-6xl">
          {product.name}
        </h1>
        <div className="mt-5 flex items-center gap-6">
          <strong className="font-mono text-2xl font-light text-[var(--accent)]">{formatMoney(product.priceCents)}</strong>
          <span className="flex items-center gap-1.5 text-xs text-[var(--faint)]">
            <Star size={14} className="text-[var(--accent)] fill-[var(--accent)] opacity-80" />
            <span>{product.rating}</span>
            <span>·</span>
            <span>{product.reviewCount} verified reviews</span>
          </span>
        </div>
        <p className="mt-6 max-w-xl text-base leading-relaxed font-extralight text-[var(--muted)]">{product.description}</p>

        <div className="mt-6 flex items-center gap-2 text-xs font-mono text-[var(--accent)]">
          <Check size={15} /> In stock — {product.stock} units ready to ship
        </div>

        {/* Quantity and Add to Cart */}
        <div className="mt-8 flex flex-wrap gap-4">
          <div className="flex h-[46px] items-center rounded-full border border-[var(--line)] bg-[var(--surface)] px-2">
            <button
              onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              disabled={quantity === 1}
              className="grid h-8 w-8 place-items-center rounded-full text-[var(--muted)] hover:text-[var(--ink)] disabled:opacity-30"
              aria-label="Decrease quantity"
            >
              <Minus size={15} />
            </button>
            <output aria-label="Quantity" className="w-10 text-center font-mono text-sm font-medium text-[var(--ink)]">
              {quantity}
            </output>
            <button
              onClick={() => setQuantity((q) => Math.min(product.stock, q + 1))}
              disabled={quantity === product.stock}
              className="grid h-8 w-8 place-items-center rounded-full text-[var(--muted)] hover:text-[var(--ink)] disabled:opacity-30"
              aria-label="Increase quantity"
            >
              <Plus size={15} />
            </button>
          </div>

          <button
            onClick={add}
            disabled={isInCart}
            aria-disabled={isInCart}
            className="flex-1 min-w-[200px] flex items-center justify-center gap-2 rounded-full bg-[var(--accent)] px-8 py-3 text-sm font-semibold text-[var(--canvas)] transition-all hover:bg-[#f5d388] active:scale-95 shadow-[0_0_20px_rgba(229,184,105,0.25)] disabled:cursor-not-allowed disabled:border disabled:border-[var(--line)] disabled:bg-[var(--surface)] disabled:text-[var(--muted)] disabled:shadow-none disabled:hover:bg-[var(--surface)]"
          >
            {isInCart ? (
              <>
                <Check size={17} /> Already in cart
              </>
            ) : (
              `Add ${quantity} to cart`
            )}
          </button>
        </div>

        {/* Guarantee Info */}
        <div className="mt-10 grid gap-3 border-t border-[var(--line)] pt-6 text-xs font-light text-[var(--faint)]">
          <p className="flex items-center gap-2">
            <ShieldCheck size={16} className="text-[var(--accent)]" /> 256-Bit SSL Encrypted Checkout · 100% Insured Delivery
          </p>
          <p>Complimentary express delivery · Simple 30-day decision window · Quality craftsmanship guaranteed</p>
        </div>
      </div>
    </div>
  );
}
