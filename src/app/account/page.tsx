"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { ArrowRight, Coins, LogOut, Package } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { formatMoney } from "@/lib/pricing";
import type { SessionUser } from "@/types";

export default function AccountPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { data, isLoading } = useQuery<{ user: SessionUser }>({
    queryKey: ["me"],
    queryFn: async () => {
      const r = await fetch("/api/auth/me");
      if (!r.ok) throw new Error("unauthorized");
      return r.json();
    },
    retry: false,
  });

  if (isLoading) {
    return <div className="shell py-24 text-center text-sm font-light text-[var(--muted)]">Loading your account…</div>;
  }

  if (!data?.user) {
    return (
      <div className="shell py-24 text-center">
        <h1 className="text-4xl font-extralight tracking-[-0.04em] text-[var(--ink)] md:text-5xl">Your account awaits.</h1>
        <p className="mt-3 text-base font-extralight text-[var(--muted)]">Sign in or create an account to view your balance and orders.</p>
        <div className="mt-8 flex justify-center gap-3">
          <Link href="/signin" className="btn btn-primary rounded-full px-7 py-3 text-sm">
            Sign in
          </Link>
          <Link href="/signup" className="btn btn-secondary rounded-full px-7 py-3 text-sm">
            Create account
          </Link>
        </div>
      </div>
    );
  }

  const user = data.user;

  async function signout() {
    await fetch("/api/auth/signout", { method: "POST" });
    queryClient.clear();
    router.push("/");
    router.refresh();
  }

  return (
    <div className="shell py-12">
      <div className="flex flex-wrap items-end justify-between gap-4 border-b border-[var(--line)] pb-6">
        <div>
          <p className="eyebrow">Your Account</p>
          <h1 className="mt-2 text-4xl font-extralight tracking-[-0.04em] text-[var(--ink)] md:text-5xl">
            Hello, {user.name.split(" ")[0]}
          </h1>
          <p className="mt-1 font-mono text-xs text-[var(--faint)]">{user.email}</p>
        </div>
        <button
          onClick={signout}
          className="btn btn-secondary !rounded-full text-xs font-mono !px-5 !py-2.5 flex items-center gap-2"
        >
          <LogOut size={15} /> Sign out
        </button>
      </div>

      <div className="mt-10 grid gap-6 md:grid-cols-2">
        {/* Telapsy Balance Display Card */}
        <section className="rounded-xl border border-[var(--accent)]/30 bg-[var(--surface)] p-8 text-[var(--ink)] relative overflow-hidden">
          <div className="flex items-center justify-between">
            <Coins size={24} className="text-[var(--accent)]" />
            <span className="text-[10px] font-mono tracking-[0.2em] uppercase text-[var(--accent)]">TELAPSY REWARDS</span>
          </div>
          <p className="mt-10 text-[10px] font-light tracking-[0.2em] text-[var(--faint)] uppercase">AVAILABLE MEMBER CREDITS</p>
          <p className="mt-2 font-mono text-4xl md:text-5xl font-light text-[var(--accent)]">{formatMoney(user.balanceCents)}</p>
          <p className="mt-4 text-xs font-light text-[var(--faint)]">Member credit rewards applied automatically during checkout.</p>
        </section>

        {/* Order History Link Card */}
        <Link href="/orders" className="group rounded-xl border border-[var(--line)] bg-[var(--surface)] p-8 transition-all hover:border-[var(--line-strong)] flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <Package size={24} className="text-[var(--accent)]" />
              <span className="text-[10px] font-mono tracking-[0.2em] uppercase text-[var(--faint)]">PURCHASE ARCHIVE</span>
            </div>
            <p className="mt-10 text-[10px] font-light tracking-[0.2em] text-[var(--accent)] uppercase">ORDER HISTORY</p>
            <div className="mt-2 flex items-end justify-between">
              <h2 className="text-2xl font-extralight text-[var(--ink)] group-hover:text-[var(--accent)] transition-colors">
                My Orders
              </h2>
              <ArrowRight size={18} className="text-[var(--accent)] transition-transform group-hover:translate-x-1" />
            </div>
          </div>
          <p className="mt-4 text-xs font-light text-[var(--muted)]">Review purchased items, discount totals, and delivery status.</p>
        </Link>
      </div>
    </div>
  );
}
