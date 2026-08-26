"use client";

import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import Link from "next/link";
import { CreditCard, LockKeyhole, WalletCards } from "lucide-react";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { calculatePricing, formatMoney } from "@/lib/pricing";
import { OrderSummary } from "@/components/order-summary";
import { useCart } from "@/store/cart";
import type { SessionUser } from "@/types";

export default function CheckoutPage() {
	const router = useRouter();
	const { items, promoCode, hydrated } = useCart();
	const pricing = calculatePricing(items, promoCode);
	const { data } = useQuery<{ user: SessionUser }>({
		queryKey: ["me"],
		queryFn: async () => {
			const r = await fetch("/api/auth/me");
			if (!r.ok) throw new Error();
			return r.json();
		},
		retry: false,
	});
	const [payment, setPayment] = useState<"balance" | "simulated-card">("simulated-card");
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState("");
	const idempotencyKey = useMemo(() => crypto.randomUUID(), []);
	async function submit(event: React.FormEvent<HTMLFormElement>) {
		event.preventDefault();
		setLoading(true);
		setError("");
		const f = new FormData(event.currentTarget);
		const body = {
			customer: { name: f.get("name"), email: f.get("email"), phone: f.get("phone") },
			delivery: { address: f.get("address"), city: f.get("city"), state: f.get("state"), country: f.get("country") },
			paymentMethod: payment,
			promoCode,
			items: items.map(({ slug, quantity }) => ({ slug, quantity })),
			idempotencyKey,
		};
		try {
			const response = await fetch("/api/checkout", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
			const result = await response.json();
			if (!response.ok) throw new Error(result.error);
			router.push(`/checkout/success/${result.orderNumber}`);
		} catch (e) {
			setError(e instanceof Error ? e.message : "Checkout failed.");
			setLoading(false);
		}
	}
	if (!hydrated) return <div className="shell py-24">Preparing checkout…</div>;
	if (!items.length)
		return (
			<div className="shell py-24 text-center">
				<h1 className="display text-5xl">Your bag is empty.</h1>
				<Link href="/products" className="btn btn-primary mt-7">
					Browse products
				</Link>
			</div>
		);
	return (
		<div className="shell py-14">
			<p className="eyebrow">Secure demo checkout</p>
			<h1 className="display mt-3 text-6xl">Make it yours.</h1>
			<form onSubmit={submit} className="mt-10 grid gap-8 lg:grid-cols-[1fr_420px]">
				<div className="grid gap-6">
					<FormSection title="Contact information">
						<div className="grid gap-4 sm:grid-cols-2">
							<Field name="name" label="Full name" defaultValue={data?.user?.name} />
							<Field name="email" label="Email address" type="email" defaultValue={data?.user?.email} />
							<Field name="phone" label="Phone number" className="sm:col-span-2" />
						</div>
					</FormSection>
					<FormSection title="Delivery information">
						<div className="grid gap-4 sm:grid-cols-2">
							<Field name="address" label="Street address" className="sm:col-span-2" />
							<Field name="city" label="City" />
							<Field name="state" label="State / region" />
							<Field name="country" label="Country" className="sm:col-span-2" defaultValue="Nigeria" />
						</div>
					</FormSection>
					<FormSection title="Payment">
						<div className="grid gap-3">
							{data?.user && (
								<PaymentChoice
									active={payment === "balance"}
									onClick={() => setPayment("balance")}
									icon={<WalletCards />}
									title="Telapsy Balance"
									detail={`${formatMoney(data.user.balanceCents)} available`}
								/>
							)}
							<PaymentChoice
								active={payment === "simulated-card"}
								onClick={() => setPayment("simulated-card")}
								icon={<CreditCard />}
								title="Simulated Card"
								detail="Deterministic demo payment—no card details needed"
							/>
						</div>
						<div className="mt-4 flex gap-2 rounded-xl bg-[#f0eee7] p-4 text-sm text-[var(--muted)]">
							<LockKeyhole size={18} />
							<p>This is a simulated payment. Telapsy never asks for or stores real card information.</p>
						</div>
					</FormSection>
					{error && (
						<p role="alert" className="rounded-xl bg-red-50 p-4 text-red-700">
							{error}
						</p>
					)}
				</div>
				<aside className="card h-fit p-6 lg:sticky lg:top-28">
					<h2 className="text-xl font-bold">Your order</h2>
					<div className="my-6 grid gap-4">
						{items.map((item) => (
							<div key={item.slug} className="grid grid-cols-[54px_1fr_auto] items-center gap-3">
								<div className="relative aspect-square overflow-hidden rounded-xl">
									<Image src={item.image} alt="" fill className="object-cover" />
								</div>
								<div>
									<p className="text-sm font-bold">{item.name}</p>
									<p className="text-xs text-[var(--muted)]">Qty {item.quantity}</p>
								</div>
								<strong className="text-sm">{formatMoney(item.priceCents * item.quantity)}</strong>
							</div>
						))}
					</div>
					<OrderSummary pricing={pricing} compact />
					<button disabled={loading} className="btn btn-primary mt-7 w-full disabled:opacity-60">
						{loading ? "Processing order…" : `Place order · ${formatMoney(pricing.totalCents)}`}
					</button>
					<Link href="/cart" className="mt-4 block text-center text-sm font-bold underline">
						Back to bag
					</Link>
				</aside>
			</form>
		</div>
	);
}

function FormSection({ title, children }: { title: string; children: React.ReactNode }) {
	return (
		<section className="card p-6 sm:p-8">
			<h2 className="text-xl font-bold">{title}</h2>
			<div className="mt-5">{children}</div>
		</section>
	);
}
function Field({ label, className = "", ...props }: { label: string; className?: string } & React.InputHTMLAttributes<HTMLInputElement>) {
	return (
		<label className={`grid gap-2 text-sm font-bold ${className}`}>
			{label}
			<input className="field" required {...props} />
		</label>
	);
}
function PaymentChoice({ active, onClick, icon, title, detail }: { active: boolean; onClick: () => void; icon: React.ReactNode; title: string; detail: string }) {
	return (
		<button type="button" onClick={onClick} aria-pressed={active} className={`flex items-center gap-4 rounded-2xl border p-4 text-left ${active ? "border-[var(--forest)] bg-[#f0f6e6]" : "border-[var(--line)] bg-white"}`}>
			<span>{icon}</span>
			<span>
				<strong className="block">{title}</strong>
				<span className="text-sm text-[var(--muted)]">{detail}</span>
			</span>
			<span className={`ml-auto h-4 w-4 rounded-full border-4 ${active ? "border-[var(--forest)]" : "border-gray-300"}`} />
		</button>
	);
}
