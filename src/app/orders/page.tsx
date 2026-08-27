"use client";

import { useQuery } from "@tanstack/react-query";
import { ArrowUpRight, CalendarDays, CheckCircle2, ChevronLeft, ChevronRight, CreditCard, PackageOpen, Search, SlidersHorizontal, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { AccountShell } from "@/components/account-shell";
import type { OrderViewData } from "@/components/order-view";
import { formatMoney } from "@/lib/pricing";

function formatStatus(status: string) {
	return status.replaceAll("-", " ");
}

function paymentLabel(paymentMethod: string) {
	return paymentMethod === "balance" ? "Telapsy Balance" : "Simulated Card";
}

interface OrdersResponse {
	orders: OrderViewData[];
	pagination: { page: number; pageSize: number; total: number; totalPages: number };
}

const statusOptions = ["all", "processing", "shipped", "delivered", "cancelled"] as const;

export default function OrdersPage() {
	const [searchInput, setSearchInput] = useState("");
	const [search, setSearch] = useState("");
	const [status, setStatus] = useState<(typeof statusOptions)[number]>("all");
	const [page, setPage] = useState(1);

	useEffect(() => {
		const timer = window.setTimeout(() => {
			setSearch(searchInput.trim());
			setPage(1);
		}, 300);
		return () => window.clearTimeout(timer);
	}, [searchInput]);

	const { data, isLoading, isFetching } = useQuery<OrdersResponse>({
		queryKey: ["orders", search, status, page],
		queryFn: async () => {
			const params = new URLSearchParams({ page: String(page) });
			if (search) params.set("q", search);
			if (status !== "all") params.set("status", status);
			const r = await fetch(`/api/orders?${params.toString()}`);
			if (!r.ok) throw new Error();
			return r.json();
		},
		retry: false,
		placeholderData: (previous) => previous,
	});

	if (isLoading) {
		return (
			<AccountShell title="Orders">
				<div className="account-page">
					<div className="h-24 animate-pulse rounded-[1.75rem] border border-[var(--line)] bg-[var(--surface)]" />
					<div className="mt-8 grid gap-5">
						{[0, 1, 2].map((item) => (
							<div key={item} className="h-52 animate-pulse rounded-[1.75rem] border border-[var(--line)] bg-[var(--surface)]" />
						))}
					</div>
				</div>
			</AccountShell>
		);
	}

	if (!data) {
		return (
			<AccountShell title="Orders">
				<div className="py-24 text-center">
					<h1 className="text-4xl font-extralight tracking-[-0.04em] text-[var(--ink)]">Sign in to view orders.</h1>
					<Link href="/signin" className="btn btn-primary mt-7 rounded-full px-7 py-3 text-sm">
						Sign in
					</Link>
				</div>
			</AccountShell>
		);
	}

	return (
		<AccountShell title="Orders">
			<div className="account-page">
				<header className="account-page-header">
					<div>
						<p className="eyebrow">Purchase history</p>
						<h1>My Orders</h1>
						<p>Track every Telapsy order and revisit the details whenever you need them.</p>
					</div>
				</header>

				<section className="rounded-[1.5rem] border border-[var(--line)] bg-[linear-gradient(135deg,rgba(255,255,255,.035),rgba(255,255,255,.015))] p-3 sm:p-4" aria-label="Find orders">
					<div className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center">
						<label className="relative block">
							<span className="sr-only">Search by order number or product</span>
							<Search size={17} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[var(--accent)]" />
							<input
								type="search"
								value={searchInput}
								onChange={(event) => setSearchInput(event.target.value)}
								placeholder="Search order number or product"
								className="h-12 w-full rounded-2xl border border-[var(--line)] bg-black/20 pl-11 pr-11 text-sm text-[var(--ink)] outline-none transition placeholder:text-[var(--faint)] focus:border-[rgba(232,185,106,.4)] focus:ring-4 focus:ring-[rgba(232,185,106,.06)]"
							/>
							{searchInput && (
								<button
									type="button"
									onClick={() => setSearchInput("")}
									aria-label="Clear order search"
									className="absolute right-3 top-1/2 grid size-8 -translate-y-1/2 place-items-center rounded-full text-[var(--faint)] transition hover:bg-white/5 hover:text-[var(--ink)]"
								>
									<X size={15} />
								</button>
							)}
						</label>
						<div className="flex items-center gap-2 overflow-x-auto pb-1 lg:pb-0" role="group" aria-label="Filter orders by status">
							<SlidersHorizontal size={15} className="mr-1 shrink-0 text-[var(--faint)]" />
							{statusOptions.map((option) => (
								<button
									key={option}
									type="button"
									aria-pressed={status === option}
									onClick={() => {
										setStatus(option);
										setPage(1);
									}}
									className={`shrink-0 rounded-full border px-4 py-2.5 text-xs! font-medium capitalize tracking-[0.04em] transition ${status === option ? "border-[rgba(232,185,106,.42)] bg-[rgba(232,185,106,.12)] text-[var(--accent-bright)]" : "border-[var(--line)] bg-black/15 text-[var(--faint)] hover:border-[var(--line-strong)] hover:text-[var(--ink)]"}`}
								>
									{option}
								</button>
							))}
						</div>
					</div>
					<div className="mt-3 flex items-center justify-between border-t border-[var(--line)] px-1 pt-3 text-[10px] text-[var(--faint)]">
						<span>
							{data.pagination.total} {data.pagination.total === 1 ? "matching order" : "matching orders"}
						</span>
						{isFetching && <span className="text-[var(--accent)]">Updating results…</span>}
					</div>
				</section>

				{!data.orders.length ? (
					<div className="relative mt-10 overflow-hidden rounded-[1.75rem] border border-[var(--line)] bg-[var(--surface)] px-6 py-20 text-center sm:px-10">
						<div className="pointer-events-none absolute left-1/2 top-0 size-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[rgba(232,185,106,.08)] blur-3xl" />
						<span className="relative mx-auto grid size-16 place-items-center rounded-2xl border border-[rgba(232,185,106,.2)] bg-[rgba(232,185,106,.08)] text-[var(--accent)]">
							<PackageOpen size={28} />
						</span>
						<h2 className="relative mt-5 text-2xl font-light text-[var(--ink)]">{search || status !== "all" ? "No matching orders found." : "Your order history starts here."}</h2>
						<p className="relative mx-auto mt-2 max-w-md text-sm leading-6 text-[var(--muted)]">
							{search || status !== "all" ? "Try another order number, product name, or status filter." : "Discover something you love, place your first order, and track it from this page."}
						</p>
						{search || status !== "all" ? (
							<button
								type="button"
								onClick={() => {
									setSearchInput("");
									setSearch("");
									setStatus("all");
									setPage(1);
								}}
								className="btn btn-primary relative mt-7 rounded-full px-7 py-3 text-sm"
							>
								Clear filters
							</button>
						) : (
							<Link href="/dashboard/products" className="btn btn-primary relative mt-7 rounded-full px-7 py-3 text-sm">
								Shop products
							</Link>
						)}
					</div>
				) : (
					<div className="mt-8 grid gap-5">
						{data.orders.map((order) => {
							const itemCount = order.items.reduce((sum, item) => sum + item.quantity, 0);
							const firstItem = order.items[0];
							const additionalProducts = Math.max(order.items.length - 3, 0);

							return (
								<Link
									key={order.orderNumber}
									href={`/orders/${order.orderNumber}`}
									aria-label={`View order ${order.orderNumber}`}
									className="group relative overflow-hidden rounded-[1.75rem] border border-[var(--line)] bg-[linear-gradient(135deg,rgba(255,255,255,.045),rgba(255,255,255,.018))] p-5 transition-all duration-300 hover:-translate-y-1 hover:border-[rgba(232,185,106,.32)] hover:shadow-[0_24px_70px_rgba(0,0,0,.3)] sm:p-7"
								>
									<div className="pointer-events-none absolute -right-20 -top-24 size-56 rounded-full bg-[rgba(232,185,106,.07)] opacity-0 blur-3xl transition-opacity duration-500 group-hover:opacity-100" />

									<div className="relative flex flex-wrap items-start justify-between gap-4 border-b border-[var(--line)] pb-5">
										<div>
											<span className="text-[9px] font-medium uppercase tracking-[0.22em] text-[var(--faint)]">Order number</span>
											<strong className="mt-1 block font-mono text-sm font-normal tracking-[0.04em] text-[var(--accent)] sm:text-base">
												#{order.orderNumber}
											</strong>
										</div>
										<span className="inline-flex items-center gap-2 rounded-full border border-[rgba(86,211,142,.18)] bg-[rgba(86,211,142,.07)] px-3 py-1.5 text-[10px] font-medium uppercase tracking-[0.14em] text-[#83dda9]">
											<CheckCircle2 size={13} />
											{formatStatus(order.orderStatus)}
										</span>
									</div>

									<div className="relative grid gap-6 py-6 lg:grid-cols-[minmax(0,1.35fr)_minmax(260px,.65fr)] lg:items-center">
										<div className="flex min-w-0 flex-col gap-5 sm:flex-row sm:items-center">
											<div className="flex shrink-0 -space-x-3">
												{order.items.slice(0, 3).map((item, index) => (
													<span
														key={`${item.slug}-${index}`}
														className="relative size-16 overflow-hidden rounded-2xl border-2 border-[#0a0a0a] bg-[#151515] shadow-lg sm:size-[4.5rem]"
														style={{ zIndex: 3 - index }}
													>
														<Image
															src={item.image}
															alt=""
															fill
															sizes="72px"
															className="object-cover transition-transform duration-500 group-hover:scale-105"
														/>
													</span>
												))}
												{additionalProducts > 0 && (
													<span className="relative z-0 grid size-16 place-items-center rounded-2xl border-2 border-[#0a0a0a] bg-[#1c1914] text-xs font-medium text-[var(--accent)] shadow-lg sm:size-[4.5rem]">
														+{additionalProducts}
													</span>
												)}
											</div>

											<div className="min-w-0">
												<h2 className="truncate text-lg font-medium tracking-[-0.02em] text-[var(--ink)] sm:text-xl">
													{firstItem?.name ?? "Telapsy order"}
												</h2>
												<p className="mt-1 text-sm text-[var(--muted)]">
													{itemCount} {itemCount === 1 ? "item" : "items"}
													{order.items.length > 1 ? ` across ${order.items.length} products` : " in this order"}
												</p>
												{order.discountCents > 0 && (
													<span className="mt-3 inline-flex rounded-full bg-[rgba(232,185,106,.08)] px-2.5 py-1 text-[10px] uppercase tracking-[0.14em] text-[var(--accent)]">
														{order.promoCode ? `${order.promoCode} · ` : ""}
														{formatMoney(order.discountCents)} saved
													</span>
												)}
											</div>
										</div>

										<div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-2">
											<div className="rounded-2xl border border-[var(--line)] bg-black/15 p-3.5">
												<CalendarDays size={15} className="text-[var(--accent)]" />
												<span className="mt-3 block text-[9px] uppercase tracking-[0.17em] text-[var(--faint)]">Placed</span>
												<strong className="mt-1 block text-xs font-normal text-[var(--ink)]">
													{new Date(order.createdAt).toLocaleDateString(undefined, {
														day: "numeric",
														month: "short",
														year: "numeric",
													})}
												</strong>
											</div>
											<div className="rounded-2xl border border-[var(--line)] bg-black/15 p-3.5">
												<CreditCard size={15} className="text-[var(--accent)]" />
												<span className="mt-3 block text-[9px] uppercase tracking-[0.17em] text-[var(--faint)]">Payment</span>
												<strong className="mt-1 block truncate text-xs font-normal text-[var(--ink)]">{paymentLabel(order.paymentMethod)}</strong>
											</div>
										</div>
									</div>

									<div className="relative flex items-end justify-between gap-4 border-t border-[var(--line)] pt-5">
										<div>
											<span className="text-[9px] uppercase tracking-[0.2em] text-[var(--faint)]">Order total</span>
											<strong className="mt-1 block text-2xl font-medium tracking-[-0.03em] text-[var(--ink)]">{formatMoney(order.totalCents)}</strong>
										</div>
										<span className="grid size-11 place-items-center rounded-full border border-[rgba(232,185,106,.25)] bg-[rgba(232,185,106,.08)] text-[var(--accent)] transition-all duration-300 group-hover:rotate-6 group-hover:border-[var(--accent)] group-hover:bg-[var(--accent)] group-hover:text-[#090704]">
											<ArrowUpRight size={18} />
										</span>
									</div>
								</Link>
							);
						})}
						{data.pagination.totalPages > 1 && (
							<nav
								className="mt-3 flex flex-col gap-4 rounded-2xl border border-[var(--line)] bg-white/[.018] p-4 sm:flex-row sm:items-center sm:justify-between"
								aria-label="Order history pages"
							>
								<p className="text-xs text-[var(--faint)]">
									Page <span className="text-[var(--ink)]">{data.pagination.page}</span> of <span className="text-[var(--ink)]">{data.pagination.totalPages}</span>
								</p>
								<div className="grid grid-cols-2 gap-2">
									<button
										type="button"
										disabled={data.pagination.page <= 1 || isFetching}
										onClick={() => setPage((current) => Math.max(1, current - 1))}
										className="inline-flex min-h-10 items-center justify-center gap-2 rounded-full border border-[var(--line)] px-4 text-xs text-[var(--muted)] transition hover:border-[rgba(232,185,106,.3)] hover:text-[var(--accent)] disabled:cursor-not-allowed disabled:opacity-35"
									>
										<ChevronLeft size={15} />
										Previous
									</button>
									<button
										type="button"
										disabled={data.pagination.page >= data.pagination.totalPages || isFetching}
										onClick={() => setPage((current) => Math.min(data.pagination.totalPages, current + 1))}
										className="inline-flex min-h-10 items-center justify-center gap-2 rounded-full border border-[var(--line)] px-4 text-xs text-[var(--muted)] transition hover:border-[rgba(232,185,106,.3)] hover:text-[var(--accent)] disabled:cursor-not-allowed disabled:opacity-35"
									>
										Next
										<ChevronRight size={15} />
									</button>
								</div>
							</nav>
						)}
					</div>
				)}
			</div>
		</AccountShell>
	);
}
