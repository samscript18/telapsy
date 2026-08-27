"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Star } from "lucide-react";
import type { PointerEvent } from "react";
import { formatMoney } from "@/lib/pricing";
import type { ProductData } from "@/types";

export function ProductCard({ product }: { product: ProductData }) {
  const tilt = (event: PointerEvent<HTMLElement>) => {
    if (event.pointerType === "touch") return;
    const bounds = event.currentTarget.getBoundingClientRect();
    const x = (event.clientX - bounds.left) / bounds.width;
    const y = (event.clientY - bounds.top) / bounds.height;
    event.currentTarget.style.setProperty("--rx", `${(0.5 - y) * 7}deg`);
    event.currentTarget.style.setProperty("--ry", `${(x - 0.5) * 8}deg`);
    event.currentTarget.style.setProperty("--shine-x", `${x * 100}%`);
  };

  const resetTilt = (event: PointerEvent<HTMLElement>) => {
    event.currentTarget.style.setProperty("--rx", "0deg");
    event.currentTarget.style.setProperty("--ry", "0deg");
  };

  return (
    <article
      onPointerMove={tilt}
      onPointerLeave={resetTilt}
      className="product-card group relative flex h-full flex-col justify-between overflow-hidden rounded-2xl border border-[var(--line)] bg-[linear-gradient(155deg,rgba(255,255,255,0.045),rgba(255,255,255,0.012))] p-3 transition-[transform,border-color,box-shadow] duration-500 hover:border-[var(--accent)]/35 hover:shadow-[0_32px_70px_-30px_rgba(232,185,106,0.35)] sm:p-4"
    >
      <Link
        href={`/products/${product.slug}`}
        className="product-card-media relative block overflow-hidden rounded-xl border border-white/5 bg-[var(--raised)]"
      >
        <div className="relative aspect-[4/5] w-full overflow-hidden sm:aspect-square">
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-cover transition duration-700 ease-out group-hover:scale-[1.08] group-hover:rotate-[0.6deg]"
            sizes="(max-width: 768px) 50vw, 25vw"
          />
          <span className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-white/[0.04] opacity-60" />
          <span className="absolute right-3 top-3 grid h-9 w-9 translate-y-2 place-items-center rounded-full border border-white/10 bg-black/40 text-[var(--accent)] opacity-0 backdrop-blur-xl transition duration-400 group-hover:translate-y-0 group-hover:opacity-100">
            <ArrowUpRight size={15} />
          </span>
        </div>
      </Link>
      <div className="product-card-copy flex flex-1 flex-col gap-2 px-1 pb-1 pt-4">
        <div className="flex items-center justify-between gap-2">
          <span className="text-[9px] font-medium tracking-[0.2em] text-[var(--accent)] uppercase">{product.category}</span>
          <span className="font-mono text-xs font-medium text-[var(--accent-bright)] sm:text-sm">{formatMoney(product.priceCents)}</span>
        </div>
        <Link href={`/products/${product.slug}`} className="line-clamp-1 text-sm font-light tracking-[-0.02em] text-[var(--ink)] transition-colors hover:text-[var(--accent)] sm:text-base">
          {product.name}
        </Link>
        <div className="mt-auto flex items-center justify-between pt-2 text-[10px] text-[var(--faint)] sm:text-xs">
          <div className="flex items-center gap-1">
            <Star size={11} className="fill-[var(--accent)] text-[var(--accent)]" />
            <span>{product.rating}</span>
            <span className="hidden sm:inline">({product.reviewCount})</span>
          </div>
          <span className="font-mono text-[9px] uppercase tracking-wide sm:text-[10px]">
            {product.stock > 0 ? `${product.stock} available` : "Out of stock"}
          </span>
        </div>
      </div>
    </article>
  );
}
