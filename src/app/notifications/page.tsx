"use client";

import { Bell, CheckCircle2, PackageCheck, Sparkles } from "lucide-react";
import { AccountShell } from "@/components/account-shell";

const updates = [
  { icon: PackageCheck, title: "Order updates are on", text: "We’ll let you know when an order moves from confirmed to delivered.", time: "Always active" },
  { icon: Sparkles, title: "KaneAI verified Telapsy", text: "The latest storefront checks confirmed navigation, search, filters, pagination, and member access.", time: "Just now" },
  { icon: Bell, title: "Welcome to Telapsy", text: "Your credits are ready whenever you find the right object.", time: "When you joined" },
];

export default function NotificationsPage() {
  return <AccountShell title="Notifications"><section data-reveal className="max-w-4xl rounded-[1.7rem] border border-white/10 bg-white/[.025] p-5 sm:p-8"><div className="flex items-start justify-between gap-4"><div><p className="eyebrow">Stay in the loop</p><h2 className="mt-2 text-3xl font-light tracking-[-.04em] sm:text-4xl">Notifications</h2><p className="mt-3 max-w-2xl text-sm leading-7 text-[var(--muted)]">Important account, order, and verification updates in one place.</p></div><span className="grid size-11 place-items-center rounded-2xl bg-[var(--accent)]/10 text-[var(--accent)]"><Bell size={19}/></span></div><div className="mt-8 grid gap-3">{updates.map(({icon:Icon,title,text,time})=><article key={title} className="notification-card"><span className="grid size-10 shrink-0 place-items-center rounded-xl border border-white/10 bg-white/5 text-[var(--accent)]"><Icon size={17}/></span><div className="min-w-0 flex-1"><div className="flex flex-wrap items-center justify-between gap-2"><h3 className="text-sm font-medium">{title}</h3><time className="font-mono text-[9px] uppercase tracking-[.12em] text-[var(--faint)]">{time}</time></div><p className="mt-1 text-xs leading-6 text-[var(--muted)]">{text}</p></div><CheckCircle2 size={16} className="shrink-0 text-emerald-300/70"/></article>)}</div></section></AccountShell>;
}
