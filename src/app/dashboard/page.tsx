"use client";

import { useQuery } from "@tanstack/react-query";
import { ArrowRight, Bell, Coins, Layers3, Package, Percent, ShoppingBag, Sparkles, TrendingUp, Truck } from "lucide-react";
import Link from "next/link";
import { AccountShell } from "@/components/account-shell";
import type { OrderViewData } from "@/components/order-view";
import { formatMoney } from "@/lib/pricing";
import type { NotificationData, SessionUser } from "@/types";

export default function DashboardPage() {
	const { data: account } = useQuery<{ user: SessionUser }>({ queryKey: ["me"], queryFn: () => fetch("/api/auth/me").then((response) => response.json()) });
	const { data: orderData } = useQuery<{ orders: OrderViewData[] }>({ queryKey: ["orders"], queryFn: () => fetch("/api/orders").then((response) => response.json()) });
	const { data: notificationData } = useQuery<{ notifications: NotificationData[]; unreadCount: number }>({ queryKey: ["notifications"], queryFn: () => fetch("/api/notifications").then((response) => response.json()) });
	const user = account?.user;
	const orders = orderData?.orders ?? [];
	const totalSpent = orders.reduce((total, order) => total + order.totalCents, 0);

	return (
		<AccountShell title="Dashboard" eyebrow="Overview">
			<div className="mx-auto max-w-7xl">
				<section
					data-reveal
					className="relative overflow-hidden rounded-[2rem] border border-[var(--accent)]/20 bg-[radial-gradient(circle_at_88%_18%,rgba(232,185,106,.2),transparent_23%),linear-gradient(120deg,rgba(232,185,106,.11),rgba(255,255,255,.02))] p-6 sm:p-9 lg:p-11"
				>
					<div className="absolute -right-20 -top-32 size-96 rounded-full border border-[var(--accent)]/10" />
					<div className="absolute -right-5 -top-20 size-64 rounded-full border border-[var(--accent)]/10" />
					<span className="relative inline-flex items-center gap-2 rounded-full border border-[var(--accent)]/25 bg-black/20 px-3 py-1.5 font-mono text-[9px] uppercase tracking-[.15em] text-[var(--accent)]">
						<Sparkles size={12} />
						Collection access active
					</span>
					<h2 className="relative mt-6 max-w-4xl text-4xl font-extralight leading-[.94] tracking-[-.058em] sm:text-6xl">
						Welcome back{user ? `, ${user.name.split(" ")[0]}` : ""}.<br />
						<span className="text-[var(--accent-bright)]">What will you find today?</span>
					</h2>
					<p className="relative mt-5 max-w-xl text-sm font-light leading-7 text-[var(--muted)]">Your balance, orders, and private updates are synchronized here. Pick up exactly where you left off.</p>
					<div className="relative mt-8 flex flex-wrap gap-3">
						<Link href="/dashboard/products" className="btn btn-primary">
							Shop products <ArrowRight size={16} />
						</Link>
						<Link href="/orders" className="btn btn-secondary">
							View orders
						</Link>
					</div>
				</section>

				<div className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
					<Metric icon={<Coins size={19} />} label="Available balance" value={formatMoney(user?.balanceCents ?? 0)} note="Telapsy credits" />
					<Metric icon={<Package size={19} />} label="Orders placed" value={String(orders.length).padStart(2, "0")} note={orders.length ? "Full history available" : "Your first order awaits"} />
					<Metric icon={<TrendingUp size={19} />} label="Total ordered" value={formatMoney(totalSpent)} note="Across completed checkouts" />
					<Metric icon={<Bell size={19} />} label="Unread updates" value={String(notificationData?.unreadCount ?? 0).padStart(2, "0")} note="Private to your account" />
				</div>

				<div className="mt-5 grid gap-5 xl:grid-cols-[1.35fr_.65fr]">
					<section className="rounded-[1.7rem] border border-white/10 bg-white/[.025] p-5 sm:p-7">
						<div className="flex items-end justify-between gap-4">
							<div>
								<p className="eyebrow">Recent activity</p>
								<h3 className="mt-2 text-2xl font-light tracking-[-.04em]">Latest orders</h3>
							</div>
							<Link href="/orders" className="text-xs text-[var(--accent)] hover:text-[var(--accent-bright)]">
								View all
							</Link>
						</div>
						<div className="mt-6 grid gap-2">
							{orders.length ? (
								orders.slice(0, 3).map((order) => (
									<Link
										key={order.orderNumber}
										href={`/orders/${order.orderNumber}`}
										className="group grid gap-3 rounded-2xl border border-white/10 bg-black/15 p-4 transition hover:border-[var(--accent)]/25 sm:grid-cols-[1fr_auto_auto] sm:items-center"
									>
										<span>
											<strong className="block font-mono text-xs font-normal text-[var(--ink)]">{order.orderNumber}</strong>
											<small className="mt-1 block text-[10px] text-[var(--faint)]">
												{new Date(order.createdAt).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" })}
											</small>
										</span>
										<span className="w-fit rounded-full bg-emerald-400/10 px-2.5 py-1 font-mono text-[8px] uppercase tracking-wider text-emerald-300">
											{order.orderStatus}
										</span>
										<strong className="font-mono text-xs font-normal text-[var(--accent-bright)]">{formatMoney(order.totalCents)}</strong>
									</Link>
								))
							) : (
								<div className="grid min-h-44 place-items-center rounded-2xl border border-dashed border-white/10 text-center">
									<div>
										<Package className="mx-auto text-[var(--faint)]" />
										<p className="mt-3 text-sm text-[var(--muted)]">No orders yet.</p>
										<Link href="/dashboard/products" className="mt-2 inline-block text-xs text-[var(--accent)]">
											Browse products →
										</Link>
									</div>
								</div>
							)}
						</div>
					</section>
					<section className="rounded-[1.7rem] border border-white/10 bg-[linear-gradient(145deg,rgba(232,185,106,.08),rgba(255,255,255,.02))] p-5 sm:p-7">
						<p className="eyebrow">Quick access</p>
						<h3 className="mt-2 text-2xl font-light tracking-[-.04em]">Keep moving.</h3>
						<div className="mt-6 grid gap-2">
							<QuickLink href="/dashboard/products" icon={<ShoppingBag size={17} />} title="Products" text="Explore all forty pieces" />
							<QuickLink href="/dashboard/cart" icon={<ShoppingBag size={17} />} title="Cart" text="Review your current picks" />
							<QuickLink href="/notifications" icon={<Bell size={17} />} title="Notifications" text="See your latest updates" />
						</div>
					</section>
				</div>

				<div className="mt-5 grid gap-5 xl:grid-cols-[.8fr_1.2fr]">
					<section className="rounded-[1.7rem] border border-[var(--accent)]/20 bg-[radial-gradient(circle_at_100%_0,rgba(232,185,106,.13),transparent_18rem),rgba(255,255,255,.022)] p-5 sm:p-7" data-reveal>
						<p className="eyebrow">Shopping advantages</p><h3 className="mt-2 text-2xl font-semibold tracking-[-.04em]">More value, less friction.</h3>
						<div className="mt-6 grid gap-2 sm:grid-cols-3 xl:grid-cols-1"><Advantage icon={<Percent size={17}/>} title="20% off" text="Use KANE or KANE2026"/><Advantage icon={<Truck size={17}/>} title="Free delivery" text="On every Telapsy order"/><Advantage icon={<Layers3 size={17}/>} title="Four departments" text="Forty considered pieces"/></div>
					</section>
					<section className="rounded-[1.7rem] border border-white/10 bg-white/[.025] p-5 sm:p-7" data-reveal>
						<div className="flex items-end justify-between gap-4"><div><p className="eyebrow">Account pulse</p><h3 className="mt-2 text-2xl font-semibold tracking-[-.04em]">Latest notifications</h3></div><Link href="/notifications" className="text-xs text-[var(--accent)]">View all</Link></div>
						<div className="mt-6 grid gap-2">{notificationData?.notifications?.length ? notificationData.notifications.slice(0,3).map((notification) => <Link href={notification.actionUrl ?? "/notifications"} key={notification.id} className="group flex items-start gap-3 rounded-2xl border border-white/10 bg-black/15 p-4 transition hover:border-[var(--accent)]/25"><span className={`mt-1 size-2 shrink-0 rounded-full ${notification.read ? "bg-white/20" : "bg-[var(--accent)] shadow-[0_0_10px_var(--accent)]"}`}/><span className="min-w-0 flex-1"><strong className="block text-xs font-semibold">{notification.title}</strong><small className="mt-1 line-clamp-1 block text-[10px] text-[var(--faint)]">{notification.message}</small></span><ArrowRight size={13} className="mt-1 text-[var(--faint)] transition group-hover:translate-x-1 group-hover:text-[var(--accent)]"/></Link>) : <div className="grid min-h-40 place-items-center rounded-2xl border border-dashed border-white/10 text-center"><div><Bell className="mx-auto text-[var(--faint)]"/><p className="mt-3 text-xs text-[var(--muted)]">Your account is all caught up.</p></div></div>}</div>
					</section>
				</div>
			</div>
		</AccountShell>
	);
}

function Metric({ icon, label, value, note }: { icon: React.ReactNode; label: string; value: string; note: string }) {
	return (
		<article data-reveal className="member-stat-card !min-h-48 !p-6">
			<span className="member-stat-icon !right-5 !top-5">{icon}</span>
			<p>{label}</p>
			<strong>{value}</strong>
			<small>{note}</small>
		</article>
	);
}
function Advantage({ icon, title, text }: { icon: React.ReactNode; title: string; text: string }) { return <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-black/15 p-4"><span className="grid size-10 shrink-0 place-items-center rounded-xl bg-[var(--accent)]/10 text-[var(--accent)]">{icon}</span><span><strong className="block text-xs font-semibold">{title}</strong><small className="mt-1 block text-[9px] text-[var(--faint)]">{text}</small></span></div>; }
function QuickLink({ href, icon, title, text }: { href: string; icon: React.ReactNode; title: string; text: string }) {
	return (
		<Link href={href} className="group flex items-center gap-3 rounded-2xl border border-white/10 bg-black/15 p-4 transition hover:border-[var(--accent)]/30 hover:bg-[var(--accent)]/[.045]">
			<span className="grid size-10 shrink-0 place-items-center rounded-xl bg-[var(--accent)]/10 text-[var(--accent)]">{icon}</span>
			<span className="min-w-0 flex-1">
				<strong className="block text-xs font-medium">{title}</strong>
				<small className="mt-1 block truncate text-[10px] text-[var(--faint)]">{text}</small>
			</span>
			<ArrowRight size={14} className="text-[var(--faint)] transition group-hover:translate-x-1 group-hover:text-[var(--accent)]" />
		</Link>
	);
}
