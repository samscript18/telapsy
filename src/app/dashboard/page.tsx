"use client";
import { useQuery } from "@tanstack/react-query";
import { ArrowRight, Coins, Package, ShoppingBag, Sparkles } from "lucide-react";
import Link from "next/link";
import { AccountShell } from "@/components/account-shell";
import { formatMoney } from "@/lib/pricing";
import type { SessionUser } from "@/types";

export default function DashboardPage() {
  const { data } = useQuery<{ user: SessionUser }>({ queryKey: ["me"], queryFn: () => fetch("/api/auth/me").then((response) => response.json()) });
  const user = data?.user;
  return <AccountShell title="Dashboard"><section data-reveal className="relative overflow-hidden rounded-[1.8rem] border border-[var(--accent)]/20 bg-[linear-gradient(120deg,rgba(232,185,106,.13),rgba(255,255,255,.025))] p-6 sm:p-9"><Sparkles className="absolute right-7 top-7 text-[var(--accent)]/40"/><p className="eyebrow">Good to see you</p><h2 className="mt-4 max-w-3xl text-4xl font-extralight leading-[.95] tracking-[-.055em] sm:text-5xl lg:text-6xl">Your next essential is waiting{user ? `, ${user.name.split(" ")[0]}` : ""}.</h2><p className="mt-5 max-w-xl text-sm font-light leading-7 text-[var(--muted)]">Browse forty considered products, spend your credits, and follow every order from one calm dashboard.</p><Link href="/dashboard/products" className="btn btn-primary mt-7">Buy now <ArrowRight size={16}/></Link></section><div className="mt-5 grid gap-5 md:grid-cols-2"><article data-reveal className="member-stat-card"><span className="member-stat-icon"><Coins size={20}/></span><p>Available balance</p><strong>{formatMoney(user?.balanceCents ?? 0)}</strong><small>Telapsy credits</small></article><Link href="/orders" data-reveal className="member-stat-card group"><span className="member-stat-icon"><Package size={20}/></span><p>Purchase archive</p><strong>My orders</strong><small className="flex items-center gap-2">Track every order <ArrowRight size={13} className="transition group-hover:translate-x-1"/></small></Link></div><section className="mt-5 rounded-[1.6rem] border border-white/10 bg-white/[.025] p-6 sm:p-8"><div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center"><div><p className="eyebrow">Your access</p><h2 className="mt-2 text-2xl font-light tracking-[-.035em]">The entire collection is unlocked.</h2><p className="mt-2 text-sm text-[var(--muted)]">Open product details, build your cart, and checkout with credits or simulated card.</p></div><Link href="/dashboard/products" className="btn btn-secondary shrink-0"><ShoppingBag size={15}/>Try now</Link></div></section></AccountShell>;
}
