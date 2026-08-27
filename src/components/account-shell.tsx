"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Bell, LayoutDashboard, LogOut, Package, Settings, ShoppingBag, ShoppingCart, UserRound } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState, type ReactNode } from "react";
import { SessionLoadingGate } from "@/components/session-loading-gate";
import { useCart } from "@/store/cart";
import type { SessionUser } from "@/types";

const navigation = [
  { label: "Shop", items: [
    { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/dashboard/products", label: "Products", icon: ShoppingBag },
    { href: "/dashboard/cart", label: "Cart", icon: ShoppingCart },
    { href: "/orders", label: "Orders", icon: Package },
  ] },
  { label: "Account", items: [
    { href: "/notifications", label: "Notifications", icon: Bell },
    { href: "/profile", label: "Profile", icon: UserRound },
    { href: "/settings", label: "Settings", icon: Settings },
  ] },
] as const;

const mobileNavigation = [navigation[0].items[0], navigation[0].items[1], navigation[0].items[2], navigation[0].items[3], navigation[1].items[2]];
let sessionGateShown = false;

function activePath(pathname: string, href: string) { return pathname === href || pathname.startsWith(`${href}/`); }

export function AccountShell({ children, title, eyebrow = "Your account" }: { children: ReactNode; title: string; eyebrow?: string }) {
  const pathname = usePathname();
  const router = useRouter();
  const queryClient = useQueryClient();
  const [showSessionGate, setShowSessionGate] = useState(() => !sessionGateShown);
  const cartCount = useCart((state) => state.items.reduce((total, item) => total + item.quantity, 0));
  const cartHydrated = useCart((state) => state.hydrated);
  const { data, isLoading } = useQuery<{ user: SessionUser }>({
    queryKey: ["me"],
    queryFn: async () => { const response = await fetch("/api/auth/me"); if (!response.ok) throw new Error("unauthorized"); return response.json(); },
    retry: false,
  });
  const { data: notificationData } = useQuery<{ unreadCount: number }>({
    queryKey: ["notifications"],
    queryFn: async () => { const response = await fetch("/api/notifications"); return response.ok ? response.json() : { unreadCount: 0 }; },
    retry: false,
    enabled: Boolean(data?.user),
    refetchInterval: 60000,
  });

  useEffect(() => {
    if (!showSessionGate) return;
    const timer = window.setTimeout(() => { sessionGateShown = true; setShowSessionGate(false); }, 1150);
    return () => window.clearTimeout(timer);
  }, [showSessionGate]);

  async function logout() {
    await fetch("/api/auth/signout", { method: "POST" });
    sessionGateShown = false;
    queryClient.clear();
    router.push("/");
    router.refresh();
  }

  if (isLoading || showSessionGate) return <SessionLoadingGate />;
  if (!data?.user) return <div className="grid min-h-svh place-items-center p-6 text-center"><div><h1 className="text-4xl font-light">Your session has ended.</h1><Link href={`/signin?next=${encodeURIComponent(pathname)}`} className="btn btn-primary mt-6">Login</Link></div></div>;
  const user = data.user;

  return <div className="member-shell min-h-svh">
    <a href="#account-content" className="fixed left-4 top-3 z-[100] -translate-y-24 rounded-full bg-white px-4 py-2 text-xs text-black transition-transform focus:translate-y-0">Skip to content</a>
    <aside className="member-sidebar fixed left-0 top-0 z-40 hidden h-svh flex-col overflow-hidden border-r border-white/10 bg-[#0b0b0b]/95 shadow-2xl backdrop-blur-xl lg:flex">
      <div className="member-sidebar-brand shrink-0">
        <Link href="/dashboard" className="flex items-center gap-3"><span className="grid size-9 place-items-center rounded-xl bg-[var(--accent)] font-mono text-xs font-bold text-black">T</span><span><strong className="block text-sm font-semibold tracking-[.08em]">TELAPSY</strong><small className="text-[10px] text-[var(--faint)]">Your shopping space</small></span></Link>
      </div>
      <div className="member-balance-card shrink-0 rounded-2xl border border-[var(--accent)]/20 bg-[var(--accent)]/[.06] p-4"><span className="font-mono text-[9px] uppercase tracking-[.17em] text-[var(--accent)]">Available balance</span><strong className="mt-2 block font-mono text-xl font-normal text-[var(--accent-bright)]">${(user.balanceCents / 100).toFixed(2)}</strong><p className="mt-2 text-[11px] leading-5 text-[var(--faint)]">Credits ready for your next order.</p></div>
      <nav className="member-nav-scroll min-h-0 flex-1 overflow-x-hidden overflow-y-auto" aria-label="Account navigation">
        {navigation.map((group) => <div className="member-nav-group" key={group.label}><span className="member-nav-label">{group.label}</span>{group.items.map((item) => { const Icon=item.icon; const active=activePath(pathname,item.href); return <Link key={item.href} href={item.href} aria-current={active?"page":undefined} className={`member-nav-item ${active?"is-active":""}`}><Icon size={17} strokeWidth={1.8}/><span>{item.label}</span>{item.href === "/notifications" && Boolean(notificationData?.unreadCount) && <span className="ml-auto rounded-full bg-[var(--accent)] px-1.5 py-0.5 font-mono text-[8px] font-bold text-black">{notificationData?.unreadCount}</span>}</Link>; })}</div>)}
      </nav>
      <div className="member-account-card shrink-0 border-t border-white/10 pt-4"><div className="flex items-center gap-3 px-1"><span className="grid size-9 shrink-0 place-items-center rounded-xl border border-white/10 bg-white/5 text-xs text-[var(--accent)]">{user.name.slice(0,1).toUpperCase()}</span><span className="min-w-0 flex-1"><strong className="block truncate text-xs font-medium">{user.name}</strong><small className="block truncate text-[10px] text-[var(--faint)]">{user.email}</small></span></div><button onClick={logout} className="logout-button mt-3 flex min-h-10 w-full items-center justify-center gap-2 rounded-xl text-xs"><LogOut size={15}/>Log out</button></div>
    </aside>
    <div className="member-workspace min-w-0"><header className="sticky top-0 z-30 flex min-h-16 items-center justify-between gap-4 border-b border-white/10 bg-[#050505]/85 px-4 py-3 backdrop-blur-xl sm:px-6 lg:px-8"><div><span className="font-mono text-[9px] uppercase tracking-[.17em] text-[var(--faint)]">{eyebrow}</span><h1 className="text-base font-semibold tracking-[-.02em] sm:text-lg">{title}</h1></div><div className="flex items-center gap-2"><Link href="/dashboard/cart" className="account-header-action" aria-label={`Open cart with ${cartHydrated ? cartCount : 0} items`}><ShoppingCart size={17}/>{cartHydrated && cartCount > 0 && <span>{cartCount}</span>}</Link><Link href="/notifications" className="account-header-action" aria-label={`Open notifications${notificationData?.unreadCount ? `, ${notificationData.unreadCount} unread` : ""}`}><Bell size={17}/>{Boolean(notificationData?.unreadCount) && <span>{notificationData?.unreadCount}</span>}</Link><Link href="/profile" aria-label="Open profile" className="grid size-10 place-items-center rounded-full border border-[var(--accent)]/20 bg-[var(--accent)]/10 text-xs text-[var(--accent)] transition hover:border-[var(--accent)]/50 hover:bg-[var(--accent)]/15">{user.name.slice(0,1).toUpperCase()}</Link></div></header><main id="account-content" tabIndex={-1} className="min-h-[calc(100svh-64px)] px-4 py-7 pb-28 sm:px-6 lg:px-8 lg:py-8 lg:pb-10">{children}</main></div>
    <nav className="fixed inset-x-0 bottom-0 z-40 grid grid-cols-5 border-t border-white/10 bg-[#070707]/95 px-2 pb-[max(.5rem,env(safe-area-inset-bottom))] pt-2 backdrop-blur-xl lg:hidden" aria-label="Account quick navigation">{mobileNavigation.map((item) => { const Icon=item.icon; const active=activePath(pathname,item.href); return <Link key={item.href} href={item.href} aria-current={active?"page":undefined} className={`member-mobile-nav ${active?"is-active":""}`}><Icon size={17}/><span>{item.label}</span></Link>; })}</nav>
  </div>;
}
