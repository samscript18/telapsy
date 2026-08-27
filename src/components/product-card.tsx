"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, LockKeyhole, LogIn, Sparkles, Star, UserPlus } from "lucide-react";
import type { PointerEvent } from "react";
import { formatMoney } from "@/lib/pricing";
import type { ProductData } from "@/types";

export function ProductCard({ product, authenticated = false }: { product: ProductData; authenticated?: boolean }) {
  const productPath = authenticated ? `/dashboard/products/${product.slug}` : `/products/${product.slug}`;
  const memberProductPath = `/dashboard/products/${product.slug}`;
  const loginHref = `/signin?next=${encodeURIComponent(memberProductPath)}`;
  const signupHref = `/signup?next=${encodeURIComponent(memberProductPath)}`;
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
    <article onPointerMove={tilt} onPointerLeave={resetTilt} className="product-card group relative flex h-full flex-col overflow-hidden rounded-2xl border border-[var(--line)] bg-[linear-gradient(155deg,rgba(255,255,255,0.045),rgba(255,255,255,0.012))] p-3 transition-[transform,border-color,box-shadow] duration-500 hover:border-[var(--accent)]/35 hover:shadow-[0_32px_70px_-30px_rgba(232,185,106,0.35)] sm:p-4">
      <div className="product-card-media relative overflow-hidden rounded-xl border border-white/5 bg-[var(--raised)]">
        <div className="relative aspect-[4/5] w-full overflow-hidden sm:aspect-square">
          <Image src={product.image} alt={product.name} fill className="object-cover transition duration-700 ease-out group-hover:scale-[1.08] group-hover:rotate-[0.6deg]" sizes="(max-width: 768px) 50vw, 25vw"/>
          <span className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-white/[0.04] opacity-70"/>
          {authenticated && <span className="absolute right-3 top-3 grid size-9 translate-y-2 place-items-center rounded-full border border-white/10 bg-black/40 text-[var(--accent)] opacity-0 backdrop-blur-xl transition duration-400 group-hover:translate-y-0 group-hover:opacity-100"><ArrowUpRight size={15}/></span>}
        </div>
      </div>
      <div className="product-card-copy flex flex-1 flex-col gap-2 px-1 pb-1 pt-4">
        <div className="flex items-center justify-between gap-2"><span className="text-[9px] font-medium uppercase tracking-[0.2em] text-[var(--accent)]">{product.category}</span><span className="font-mono text-xs font-medium text-[var(--accent-bright)] sm:text-sm">{formatMoney(product.priceCents)}</span></div>
        <h2 className="line-clamp-1 text-sm font-light tracking-[-0.02em] text-[var(--ink)] sm:text-base">{product.name}</h2>
        <div className="mt-auto flex items-center justify-between pt-2 text-[10px] text-[var(--faint)] sm:text-xs"><span className="flex items-center gap-1"><Star size={11} className="fill-[var(--accent)] text-[var(--accent)]"/>{product.rating}<span className="hidden sm:inline">({product.reviewCount})</span></span><span className="font-mono text-[9px] uppercase tracking-wide sm:text-[10px]">{product.stock > 0 ? `${product.stock} available` : "Out of stock"}</span></div>
      </div>

      {authenticated ? (
        <Link href={productPath} className="absolute inset-0 z-10 rounded-2xl" aria-label={`View ${product.name}`}><span className="sr-only">View product</span></Link>
      ) : (
        <div className="product-lock absolute inset-3 z-20 flex flex-col justify-end overflow-hidden rounded-xl border border-[var(--accent)]/25 bg-[linear-gradient(to_top,rgba(3,3,3,.98)_8%,rgba(3,3,3,.88)_52%,rgba(3,3,3,.08))] p-4 opacity-0 backdrop-blur-[2px] transition-all duration-500 group-hover:opacity-100 group-focus-within:opacity-100 max-md:inset-auto max-md:bottom-3 max-md:left-3 max-md:right-3 max-md:opacity-100 sm:p-5">
          <span className="mb-auto hidden size-11 place-items-center rounded-full border border-[var(--accent)]/30 bg-[var(--accent)]/10 text-[var(--accent)] md:grid"><LockKeyhole size={18}/></span>
          <p className="flex items-center gap-2 font-mono text-[9px] uppercase tracking-[0.16em] text-[var(--accent)]"><Sparkles size={12}/> Member access</p>
          <strong className="mt-2 text-base font-light tracking-[-0.025em] text-white sm:text-lg">Login to view this product</strong>
          <div className="mt-3 grid grid-cols-2 gap-2">
            <Link href={loginHref} className="product-unlock-action is-primary"><LogIn size={13}/>Login</Link>
            <Link href={signupHref} className="product-unlock-action"><UserPlus size={13}/>Sign up</Link>
          </div>
        </div>
      )}
    </article>
  );
}
