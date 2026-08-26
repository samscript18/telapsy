"use client";

import Link from "next/link";
import { Menu, Search, ShoppingBag, UserRound } from "lucide-react";
import { useCart } from "@/store/cart";

export function Header() {
  const count = useCart((state) => state.items.reduce((sum, item) => sum + item.quantity, 0));
  const hydrated = useCart((state) => state.hydrated);

  return (
    <header className="fixed top-0 right-0 left-0 z-50 flex w-full justify-center px-4 pt-4 md:pt-6">
      <nav className="relative flex w-full items-center justify-between rounded-full border border-white/10 bg-[var(--raised)]/70 backdrop-blur-xl transition-all duration-500 ease-out max-w-5xl py-2.5 pr-2.5 pl-6 shadow-[0_4px_24px_rgba(0,0,0,0.35),inset_0_1px_0_0_rgba(255,255,255,0.05)]">
        <Link href="/" aria-label="Telapsy home" className="transition-transform active:scale-95 flex items-center gap-2.5">
          <svg viewBox="0 0 72 84" width="22" height="22" className="text-[var(--accent)]" role="img" aria-label="Telapsy">
            <g opacity="1"><path d="M 32 6 L 9 6 L 2 17 L 32 17 Z" fill="currentColor"></path><path d="M 40 6 L 63 6 L 70 17 L 40 17 Z" fill="currentColor"></path></g>
            <g opacity="0.75"><path d="M 32 21 L 9 21 L 2 32 L 32 32 Z" fill="currentColor"></path><path d="M 40 21 L 63 21 L 70 32 L 40 32 Z" fill="currentColor"></path></g>
            <g opacity="0.5"><path d="M 32 36 L 9 36 L 2 47 L 32 47 Z" fill="currentColor"></path><path d="M 40 36 L 63 36 L 70 47 L 40 47 Z" fill="currentColor"></path></g>
            <rect x="34.6" y="0" width="2.8" height="84" rx="1.4" fill="currentColor"></rect>
          </svg>
          <span className="font-light tracking-[-0.03em] text-[var(--ink)] text-lg">TELAPSY</span>
        </Link>

        <div className="hidden flex-1 md:block" />

        <div className="hidden items-center gap-1 md:flex" aria-label="Primary navigation">
          <Link href="/products" className="rounded-full px-3.5 py-1.5 text-sm font-light transition-colors duration-200 text-[var(--muted)] hover:bg-white/5 hover:text-[var(--ink)]">
            Shop All
          </Link>
          <Link href="/products?category=Fashion" className="rounded-full px-3.5 py-1.5 text-sm font-light transition-colors duration-200 text-[var(--muted)] hover:bg-white/5 hover:text-[var(--ink)]">
            Fashion
          </Link>
          <Link href="/products?category=Electronics" className="rounded-full px-3.5 py-1.5 text-sm font-light transition-colors duration-200 text-[var(--muted)] hover:bg-white/5 hover:text-[var(--ink)]">
            Electronics
          </Link>
          <Link href="/products?category=Home" className="rounded-full px-3.5 py-1.5 text-sm font-light transition-colors duration-200 text-[var(--muted)] hover:bg-white/5 hover:text-[var(--ink)]">
            Home
          </Link>
          <Link href="/products?category=Accessories" className="rounded-full px-3.5 py-1.5 text-sm font-light transition-colors duration-200 text-[var(--muted)] hover:bg-white/5 hover:text-[var(--ink)]">
            Accessories
          </Link>
        </div>

        <div className="hidden flex-1 md:block" />

        <div className="flex items-center gap-2">
          <Link href="/products" aria-label="Search products" className="flex items-center justify-center rounded-full p-2 text-[var(--muted)] transition-colors hover:bg-white/5 hover:text-[var(--ink)]">
            <Search size={18} />
          </Link>
          <Link href="/account" aria-label="Your account" className="flex items-center justify-center rounded-full p-2 text-[var(--muted)] transition-colors hover:bg-white/5 hover:text-[var(--ink)]">
            <UserRound size={18} />
          </Link>
          <Link
            href="/cart"
            aria-label={`Shopping bag with ${hydrated ? count : 0} items`}
            className="flex items-center justify-center gap-2 rounded-full bg-[var(--accent)] px-4 py-2 text-sm font-semibold text-[var(--canvas)] transition-all duration-200 hover:bg-[#f5d388] active:scale-95 shadow-[0_0_15px_rgba(229,184,105,0.25)]"
          >
            <ShoppingBag size={16} />
            <span>Bag</span>
            {hydrated && count > 0 && (
              <span className="flex h-5 min-w-[20px] items-center justify-center rounded-full bg-[var(--canvas)] px-1.5 font-mono text-[11px] font-bold text-[var(--accent)]">
                {count}
              </span>
            )}
          </Link>
        </div>
      </nav>
    </header>
  );
}
