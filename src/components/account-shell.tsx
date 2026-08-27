"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Bell, LayoutDashboard, LogOut, Package, Settings, ShoppingBag, UserRound } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import type { ReactNode } from "react";
import type { SessionUser } from "@/types";

const navigation = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/dashboard/products", label: "Products", icon: ShoppingBag },
  { href: "/dashboard/cart", label: "Cart", icon: ShoppingBag },
  { href: "/profile", label: "Profile", icon: UserRound },
  { href: "/orders", label: "Orders", icon: Package },
  { href: "/notifications", label: "Notifications", icon: Bell },
  { href: "/settings", label: "Settings", icon: Settings },
] as const;

function activePath(pathname: string, href: string) { return pathname === href || pathname.startsWith(`${href}/`); }

export function AccountShell({ children, title, eyebrow = "Your account" }: { children: ReactNode; title: string; eyebrow?: string }) {
  const pathname = usePathname();
  const router = useRouter();
  const queryClient = useQueryClient();
  const { data, isLoading } = useQuery<{ user: SessionUser }>({ queryKey: ["me"], queryFn: async () => { const response = await fetch("/api/auth/me"); if (!response.ok) throw new Error("unauthorized"); return response.json(); }, retry: false });
  async function logout() { await fetch("/api/auth/signout", { method: "POST" }); queryClient.clear(); router.push("/"); router.refresh(); }
  if (isLoading) return <div className="grid min-h-svh place-items-center bg-[var(--canvas)]"><span className="font-mono text-xs uppercase tracking-[.18em] text-[var(--accent)]">Opening your workspace…</span></div>;
  if (!data?.user) return <div className="grid min-h-svh place-items-center p-6 text-center"><div><h1 className="text-4xl font-light">Your session has ended.</h1><Link href={`/signin?next=${encodeURIComponent(pathname)}`} className="btn btn-primary mt-6">Login</Link></div></div>;
  const user = data.user;
  return <div className="member-shell min-h-svh lg:grid lg:grid-cols-[248px_minmax(0,1fr)]">
    <a href="#member-content" className="fixed left-4 top-3 z-[100] -translate-y-24 rounded-full bg-white px-4 py-2 text-xs text-black transition-transform focus:translate-y-0">Skip to content</a>
      <aside className="member-sidebar fixed inset-y-0 left-0 z-40 hidden h-svh w-[248px] flex-col overflow-hidden border-r border-white/10 bg-[#0b0b0b]/95 p-4 shadow-2xl backdrop-blur-xl lg:flex">
      <Link href="/" className="flex items-center gap-3 px-2 py-2"><span className="grid size-9 place-items-center rounded-xl bg-[var(--accent)] font-mono text-xs font-bold text-black">T</span><span><strong className="block text-sm font-medium tracking-[.08em]">TELAPSY</strong><small className="text-[10px] text-[var(--faint)]">Your account</small></span></Link>
      <div className="mt-6 rounded-2xl border border-[var(--accent)]/20 bg-[var(--accent)]/[.06] p-4"><span className="font-mono text-[9px] uppercase tracking-[.17em] text-[var(--accent)]">Available balance</span><strong className="mt-2 block font-mono text-xl font-light text-[var(--accent-bright)]">${(user.balanceCents / 100).toFixed(2)}</strong><p className="mt-2 text-[11px] leading-5 text-[var(--faint)]">Credits for your next considered object.</p></div>
      <nav className="member-nav-scroll mt-7 grid min-h-0 flex-1 content-start gap-1 overflow-y-auto pr-1" aria-label="Member navigation">{navigation.map((item) => { const Icon=item.icon; const active=activePath(pathname,item.href); return <Link key={item.href} href={item.href} aria-current={active?"page":undefined} className={`member-nav-item ${active?"is-active":""}`}><Icon size={17}/>{item.label}</Link>; })}</nav>
      <div className="mt-auto border-t border-white/10 pt-4"><div className="flex items-center gap-3 px-2"><span className="grid size-9 shrink-0 place-items-center rounded-xl border border-white/10 bg-white/5 text-xs text-[var(--accent)]">{user.name.slice(0,1).toUpperCase()}</span><span className="min-w-0 flex-1"><strong className="block truncate text-xs font-medium">{user.name}</strong><small className="block truncate text-[10px] text-[var(--faint)]">{user.email}</small></span></div><button onClick={logout} className="logout-button mt-3 flex min-h-11 w-full items-center justify-center gap-2 rounded-xl text-xs"><LogOut size={15}/>Log out</button></div>
    </aside>
    <div className="min-w-0 lg:col-start-2"><header className="sticky top-0 z-30 flex min-h-16 items-center justify-between gap-4 border-b border-white/10 bg-[#050505]/85 px-4 py-3 backdrop-blur-xl sm:px-6 lg:px-9"><div><span className="font-mono text-[9px] uppercase tracking-[.17em] text-[var(--faint)]">{eyebrow}</span><h1 className="text-base font-medium tracking-[-.02em] sm:text-lg">{title}</h1></div><div className="flex items-center gap-2"><Link href="/dashboard/products" className="btn btn-secondary !px-3 !py-2.5 text-xs sm:!px-4"><ShoppingBag size={15}/><span className="hidden sm:inline">Buy now</span></Link><span className="grid size-10 place-items-center rounded-full border border-[var(--accent)]/20 bg-[var(--accent)]/10 text-xs text-[var(--accent)]">{user.name.slice(0,1).toUpperCase()}</span></div></header><main id="member-content" tabIndex={-1} className="min-h-[calc(100svh-64px)] px-4 py-7 pb-28 sm:px-6 lg:px-9 lg:py-9 lg:pb-10">{children}</main></div>
    <nav className="fixed inset-x-0 bottom-0 z-40 grid grid-cols-4 border-t border-white/10 bg-[#070707]/95 px-2 pb-[max(.5rem,env(safe-area-inset-bottom))] pt-2 backdrop-blur-xl lg:hidden" aria-label="Member quick navigation">{navigation.map((item) => { const Icon=item.icon; const active=activePath(pathname,item.href); return <Link key={item.href} href={item.href} aria-current={active?"page":undefined} className={`member-mobile-nav ${active?"is-active":""}`}><Icon size={17}/><span>{item.label}</span></Link>; })}</nav>
  </div>;
}
