"use client";

import Link from "next/link";
import { Menu, Search, ShoppingBag, UserRound } from "lucide-react";
import { useCart } from "@/store/cart";

export function Header() {
  const count = useCart((state) => state.items.reduce((sum, item) => sum + item.quantity, 0));
  const hydrated = useCart((state) => state.hydrated);
  return <>
    <div className="bg-[var(--forest)] py-2 text-center text-[11px] font-bold tracking-[.16em] text-white uppercase">Free delivery on every order · Demo payments only</div>
    <header className="sticky top-0 z-40 border-b border-[var(--line)] bg-[rgba(247,245,239,.94)] backdrop-blur-xl">
      <div className="shell flex h-[76px] items-center justify-between gap-5">
        <button className="md:hidden" aria-label="Open menu"><Menu size={22} /></button>
        <Link href="/" className="text-2xl font-black tracking-[-.08em]">TELAPSY<span className="text-[var(--orange)]">.</span></Link>
        <nav aria-label="Primary navigation" className="hidden items-center gap-7 text-sm font-bold md:flex">
          <Link href="/products">Shop all</Link><Link href="/products?category=Fashion">Fashion</Link><Link href="/products?category=Electronics">Electronics</Link><Link href="/products?category=Home">Home</Link>
        </nav>
        <div className="flex items-center gap-4">
          <Link href="/products" aria-label="Search products"><Search size={21} /></Link>
          <Link href="/account" aria-label="Your account"><UserRound size={21} /></Link>
          <Link href="/cart" aria-label={`Shopping bag with ${hydrated ? count : 0} items`} className="relative"><ShoppingBag size={22} />{hydrated && count > 0 && <span className="absolute -right-3 -top-3 grid h-5 min-w-5 place-items-center rounded-full bg-[var(--orange)] px-1 text-[10px] font-black text-white">{count}</span>}</Link>
        </div>
      </div>
    </header>
  </>;
}
