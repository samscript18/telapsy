"use client";

import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import Link from "next/link";
import { Check, CreditCard, LockKeyhole, MapPin, Plus, WalletCards } from "lucide-react";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { calculatePricing, formatMoney } from "@/lib/pricing";
import { OrderSummary } from "@/components/order-summary";
import { useCart } from "@/store/cart";
import type { DeliveryAddress, SessionUser } from "@/types";

const emptyDelivery = { address: "", city: "", state: "", country: "Nigeria" };

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
  const { data: deliveryData, isLoading: addressesLoading } = useQuery<{ addresses: DeliveryAddress[] }>({
    queryKey: ["delivery-addresses"],
    queryFn: async () => {
      const response = await fetch("/api/delivery-addresses");
      if (!response.ok) return { addresses: [] };
      return response.json();
    },
    enabled: Boolean(data?.user),
    retry: false,
  });
  const [payment, setPayment] = useState<"balance" | "simulated-card">("simulated-card");
  const [selectedAddress, setSelectedAddress] = useState("new");
  const [delivery, setDelivery] = useState(emptyDelivery);
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
      delivery,
      paymentMethod: payment,
      promoCode,
      items: items.map(({ slug, quantity }) => ({ slug, quantity })),
      idempotencyKey,
    };
    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error);
      router.push(`/checkout/success/${result.orderNumber}`);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Checkout failed.");
      setLoading(false);
    }
  }

  if (!hydrated) {
    return <div className="shell py-24 text-center text-sm font-light text-[var(--muted)]">Preparing checkout…</div>;
  }

  if (!items.length) {
    return (
      <div className="shell py-24 text-center">
        <h1 className="text-4xl font-extralight tracking-[-0.04em] text-[var(--ink)] md:text-5xl">Your cart is empty.</h1>
        <Link href="/products" className="btn btn-primary mt-7 rounded-full px-7 py-3">
          Browse products
        </Link>
      </div>
    );
  }

  return (
    <div className="shell py-12">
      <div className="border-b border-[var(--line)] pb-6">
        <p className="eyebrow">EXPRESS CHECKOUT</p>
        <h1 className="mt-2 text-4xl font-extralight tracking-[-0.04em] text-[var(--ink)] md:text-5xl">Make it yours.</h1>
      </div>

      <form onSubmit={submit} className="mt-10 grid gap-8 lg:grid-cols-[1fr_400px]">
        <div className="grid gap-6">
          <FormSection title="Contact Information">
            <div className="grid gap-4 sm:grid-cols-2">
              <Field name="name" label="Full name" defaultValue={data?.user?.name} />
              <Field name="email" label="Email address" type="email" defaultValue={data?.user?.email} />
              <Field name="phone" label="Phone number" className="sm:col-span-2" />
            </div>
          </FormSection>

          <FormSection title="Delivery Information">
            {data?.user && (
              <div className="mb-6">
                <div className="mb-3 flex items-end justify-between gap-4">
                  <div>
                    <p className="text-[10px] font-mono uppercase tracking-[0.16em] text-[var(--accent)]">Saved destinations</p>
                    <p className="mt-1 text-xs leading-5 text-[var(--faint)]">Choose an address from a previous order or enter another one.</p>
                  </div>
                  {addressesLoading && <span className="text-[10px] text-[var(--faint)]">Loading…</span>}
                </div>
                <div className="grid gap-3 md:grid-cols-2">
                  {deliveryData?.addresses.map((savedAddress, index) => (
                    <DeliveryChoice
                      key={savedAddress.id}
                      active={selectedAddress === savedAddress.id}
                      title={index === 0 ? "Recently used" : `Saved address ${index + 1}`}
                      address={savedAddress}
                      onClick={() => {
                        setSelectedAddress(savedAddress.id);
                        setDelivery({
                          address: savedAddress.address,
                          city: savedAddress.city,
                          state: savedAddress.state,
                          country: savedAddress.country,
                        });
                      }}
                    />
                  ))}
                  <button
                    type="button"
                    aria-pressed={selectedAddress === "new"}
                    onClick={() => {
                      setSelectedAddress("new");
                      setDelivery(emptyDelivery);
                    }}
                    className={`group relative flex min-h-32 items-center gap-4 rounded-2xl border p-4 pr-12 text-left transition-all ${
                      selectedAddress === "new"
                        ? "border-[var(--accent)] bg-[rgba(232,185,106,.08)]"
                        : "border-[var(--line)] bg-black/15 hover:border-[var(--line-strong)]"
                    }`}
                  >
                    <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-[rgba(232,185,106,.09)] text-[var(--accent)]">
                      <Plus size={17} />
                    </span>
                    <span>
                      <strong className="block text-sm font-medium text-[var(--ink)]">Use another address</strong>
                      <span className="mt-1 block text-xs leading-5 text-[var(--faint)]">Enter a new delivery destination below.</span>
                    </span>
                    <ChoiceIndicator active={selectedAddress === "new"} />
                  </button>
                </div>
              </div>
            )}
            <div className="grid gap-4 sm:grid-cols-2">
              <Field name="address" label="Street address" className="sm:col-span-2" value={delivery.address} onChange={(event) => { setSelectedAddress("new"); setDelivery((current) => ({ ...current, address: event.target.value })); }} />
              <Field name="city" label="City" value={delivery.city} onChange={(event) => { setSelectedAddress("new"); setDelivery((current) => ({ ...current, city: event.target.value })); }} />
              <Field name="state" label="State / region" value={delivery.state} onChange={(event) => { setSelectedAddress("new"); setDelivery((current) => ({ ...current, state: event.target.value })); }} />
              <Field name="country" label="Country" className="sm:col-span-2" value={delivery.country} onChange={(event) => { setSelectedAddress("new"); setDelivery((current) => ({ ...current, country: event.target.value })); }} />
            </div>
          </FormSection>

          <FormSection title="Payment Method">
            <div className="grid gap-3">
              {data?.user && (
                <PaymentChoice
                  active={payment === "balance"}
                  onClick={() => setPayment("balance")}
                  icon={<WalletCards size={18} className="text-[var(--accent)]" />}
                  title="Telapsy Credits"
                  detail={`${formatMoney(data.user.balanceCents)} available`}
                />
              )}
              <PaymentChoice
                active={payment === "simulated-card"}
                onClick={() => setPayment("simulated-card")}
                icon={<CreditCard size={18} className="text-[var(--accent)]" />}
                title="Instant Payment"
                detail="256-bit encrypted checkout"
              />
            </div>
            <div className="mt-4 flex items-center gap-2.5 rounded-lg border border-[var(--line)] bg-[var(--canvas)] p-3.5 text-xs font-light text-[var(--muted)]">
              <LockKeyhole size={16} className="text-[var(--accent)] shrink-0" />
              <p>Encrypted & Secure. Order transactions and credits are protected by 256-bit SSL protocol.</p>
            </div>
          </FormSection>

          {error && (
            <p role="alert" className="rounded-lg border border-[var(--retired)]/30 bg-[var(--retired)]/10 p-4 text-xs font-mono text-[var(--retired)]">
              {error}
            </p>
          )}
        </div>

        <aside className="rounded-xl border border-[var(--line)] bg-[var(--surface)] p-6 h-fit lg:sticky lg:top-28">
          <h2 className="text-lg font-light tracking-tight text-[var(--ink)]">Your Order</h2>
          <div className="my-6 grid gap-3 divide-y divide-[var(--line)]">
            {items.map((item) => (
              <div key={item.slug} className="grid grid-cols-[48px_1fr_auto] items-center gap-3 pt-3 first:pt-0">
                <div className="relative aspect-square overflow-hidden rounded-md bg-[var(--raised)] border border-white/5">
                  <Image src={item.image} alt="" fill className="object-cover" />
                </div>
                <div>
                  <p className="text-xs font-light text-[var(--ink)] line-clamp-1">{item.name}</p>
                  <p className="text-[10px] font-mono text-[var(--faint)]">Qty {item.quantity}</p>
                </div>
                <strong className="font-mono text-xs text-[var(--accent)]">{formatMoney(item.priceCents * item.quantity)}</strong>
              </div>
            ))}
          </div>

          <OrderSummary pricing={pricing} compact />

          <button disabled={loading} className="btn btn-primary mt-6 w-full rounded-full py-3.5 text-sm font-medium disabled:opacity-60">
            {loading ? "Processing order…" : `Place order · ${formatMoney(pricing.totalCents)}`}
          </button>
          <Link href="/cart" className="mt-4 block text-center text-xs font-mono text-[var(--faint)] hover:text-[var(--ink)] underline">
            Back to cart
          </Link>
        </aside>
      </form>
    </div>
  );
}

function FormSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-xl border border-[var(--line)] bg-[var(--surface)] p-6 sm:p-8">
      <h2 className="text-lg font-light tracking-tight text-[var(--ink)]">{title}</h2>
      <div className="mt-5">{children}</div>
    </section>
  );
}

function Field({ label, className = "", ...props }: { label: string; className?: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <label className={`grid gap-1.5 text-xs font-mono text-[var(--faint)] ${className}`}>
      <span>{label.toUpperCase()}</span>
      <input className="field text-xs text-[var(--ink)] font-sans" required {...props} />
    </label>
  );
}

function PaymentChoice({
  active,
  onClick,
  icon,
  title,
  detail,
}: {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  title: string;
  detail: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`flex items-center gap-4 rounded-xl border p-4 text-left transition-all ${
        active
          ? "border-[var(--accent)] bg-[var(--accent)]/10 text-[var(--ink)]"
          : "border-[var(--line)] bg-[var(--canvas)] text-[var(--muted)] hover:border-[var(--line-strong)]"
      }`}
    >
      <span>{icon}</span>
      <span>
        <strong className="block text-sm font-normal text-[var(--ink)]">{title}</strong>
        <span className="text-xs font-light text-[var(--faint)]">{detail}</span>
      </span>
      <span
        className={`ml-auto h-4 w-4 rounded-full border-2 transition-all ${
          active ? "border-[var(--accent)] bg-[var(--accent)]" : "border-[var(--line-strong)] bg-transparent"
        }`}
      />
    </button>
  );
}

function DeliveryChoice({ active, title, address, onClick }: { active: boolean; title: string; address: DeliveryAddress; onClick: () => void }) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      className={`group relative min-h-32 rounded-2xl border p-4 text-left transition-all ${
        active
          ? "border-[var(--accent)] bg-[rgba(232,185,106,.08)] shadow-[0_15px_40px_-28px_rgba(232,185,106,.7)]"
          : "border-[var(--line)] bg-black/15 hover:border-[var(--line-strong)]"
      }`}
    >
      <div className="flex items-start gap-3 pr-8">
        <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-[rgba(232,185,106,.09)] text-[var(--accent)]">
          <MapPin size={16} />
        </span>
        <span className="min-w-0">
          <strong className="block text-[10px] font-medium uppercase tracking-[0.14em] text-[var(--accent)]">{title}</strong>
          <span className="mt-2 block text-sm leading-5 text-[var(--ink)]">{address.address}</span>
          <span className="mt-1 block text-xs text-[var(--faint)]">{address.city}, {address.state} · {address.country}</span>
        </span>
      </div>
      <ChoiceIndicator active={active} />
    </button>
  );
}

function ChoiceIndicator({ active }: { active: boolean }) {
  return (
    <span className={`absolute right-4 top-4 grid size-5 place-items-center rounded-full border transition ${active ? "border-[var(--accent)] bg-[var(--accent)] text-black" : "border-[var(--line-strong)]"}`}>
      {active && <Check size={12} strokeWidth={3} />}
    </span>
  );
}
