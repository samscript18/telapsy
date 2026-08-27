"use client";

import { useQuery } from "@tanstack/react-query";
import { LayoutDashboard, Menu, ShoppingBag, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { useCart } from "@/store/cart";
import type { SessionUser } from "@/types";

const navigation = [
  { href: "/", label: "Home" },
  { href: "/products", label: "Products" },
  { href: "/about", label: "About" },
] as const;

function isActive(pathname: string, href: string) {
  return href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(`${href}/`);
}

export function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const count = useCart((state) => state.items.reduce((sum, item) => sum + item.quantity, 0));
  const hydrated = useCart((state) => state.hydrated);
  const { data } = useQuery<{ user: SessionUser | null }>({
    queryKey: ["me"],
    queryFn: async () => {
      const response = await fetch("/api/auth/me");
      return response.ok ? response.json() : { user: null };
    },
    retry: false,
  });

  return (
    <header className="site-header fixed inset-x-0 top-0 z-50 flex justify-center px-3 pt-3 md:px-4 md:pt-5">
      <nav className="relative flex w-full max-w-6xl items-center justify-between rounded-[1.4rem] border border-white/10 bg-black/70 px-4 py-2.5 shadow-[0_10px_50px_rgba(0,0,0,0.45),inset_0_1px_0_rgba(255,255,255,0.08)] backdrop-blur-2xl md:rounded-full md:px-5" aria-label="Primary navigation">
        <Link href="/" aria-label="Telapsy home" className="flex items-center gap-2.5 transition-transform active:scale-95" onClick={() => setOpen(false)}>
          <svg viewBox="0 0 72 84" width="22" height="22" className="logo-sigil text-[var(--accent)]" aria-hidden="true">
            <g><path d="M 32 6 L 9 6 L 2 17 L 32 17 Z" fill="currentColor"/><path d="M 40 6 L 63 6 L 70 17 L 40 17 Z" fill="currentColor"/></g>
            <g opacity=".7"><path d="M 32 21 L 9 21 L 2 32 L 32 32 Z" fill="currentColor"/><path d="M 40 21 L 63 21 L 70 32 L 40 32 Z" fill="currentColor"/></g>
            <rect x="34.6" y="0" width="2.8" height="84" rx="1.4" fill="currentColor"/>
          </svg>
          <span className="text-lg font-light tracking-[-0.03em] text-[var(--ink)]">TELAPSY</span>
        </Link>

        <div className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-5 lg:gap-9 md:flex">
          {navigation.map((item) => {
            const active = isActive(pathname, item.href);
            const href = data?.user && item.href === "/products" ? "/dashboard/products" : item.href;
            return <Link key={item.href} href={href} aria-current={active ? "page" : undefined} className={`public-nav-link ${active ? "is-active" : ""}`}>{item.label}</Link>;
          })}
        </div>

        <div className="hidden items-center gap-2 md:flex">
          {data?.user ? (
            <>
              <Link href="/dashboard/cart" className="header-icon-link" aria-label={`Cart with ${hydrated ? count : 0} items`}><ShoppingBag size={16}/>{hydrated && count > 0 && <span>{count}</span>}</Link>
              <Link href="/dashboard" className="btn btn-primary !px-5 !py-2.5 text-xs"><LayoutDashboard size={15}/>Dashboard</Link>
            </>
          ) : (
            <><Link href="/signin" className="public-auth-link">Login</Link><Link href="/signup" className="btn btn-primary !px-5 !py-2.5 text-xs">Try Telapsy</Link></>
          )}
        </div>

        <button type="button" className="grid size-10 place-items-center rounded-full border border-white/10 bg-white/5 md:hidden" onClick={() => setOpen((value) => !value)} aria-expanded={open} aria-label={open ? "Close navigation" : "Open navigation"}>{open ? <X size={18}/> : <Menu size={18}/>}</button>
        {open && (
          <div className="absolute inset-x-0 top-[calc(100%+0.6rem)] grid gap-2 rounded-2xl border border-white/10 bg-[#0a0a0a]/95 p-3 shadow-2xl backdrop-blur-2xl md:hidden">
            {navigation.map((item) => { const active = isActive(pathname, item.href); return <Link key={item.href} href={item.href} onClick={() => setOpen(false)} aria-current={active ? "page" : undefined} className={`mobile-public-nav ${active ? "is-active" : ""}`}>{item.label}</Link>; })}
            <div className="mt-1 grid grid-cols-2 gap-2 border-t border-white/10 pt-3">
              {data?.user ? <><Link href="/dashboard/cart" onClick={() => setOpen(false)} className="btn btn-secondary !px-3 !py-3 text-xs">Cart ({hydrated ? count : 0})</Link><Link href="/dashboard" onClick={() => setOpen(false)} className="btn btn-primary !px-3 !py-3 text-xs">Dashboard</Link></> : <><Link href="/signin" onClick={() => setOpen(false)} className="btn btn-secondary !px-3 !py-3 text-xs">Login</Link><Link href="/signup" onClick={() => setOpen(false)} className="btn btn-primary !px-3 !py-3 text-xs">Try Telapsy</Link></>}
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
