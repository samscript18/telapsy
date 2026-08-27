"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { BellRing, Check, KeyRound, LayoutPanelTop, MailCheck, MonitorCog, PackageCheck, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { AccountShell } from "@/components/account-shell";
import type { SessionUser } from "@/types";

const defaults = { orderUpdates: true, productNews: false, compactDashboard: false };

export default function SettingsPage() {
  const { data } = useQuery<{ user: SessionUser }>({ queryKey: ["me"], queryFn: () => fetch("/api/auth/me").then((response) => response.json()) });
  return <AccountShell title="Settings" eyebrow="Preferences">{data?.user ? <SettingsForm user={data.user}/> : null}</AccountShell>;
}

function SettingsForm({ user }: { user: SessionUser }) {
  const client = useQueryClient(); const [preferences,setPreferences]=useState(user.preferences ?? defaults); const [saving,setSaving]=useState(false); const [saved,setSaved]=useState(false);
  const toggle=(key:keyof typeof defaults)=>{setSaved(false);setPreferences(current=>({...current,[key]:!current[key]}));};
  async function save(){setSaving(true);setSaved(false);const response=await fetch("/api/auth/me",{method:"PATCH",headers:{"Content-Type":"application/json"},body:JSON.stringify({preferences})});const result=await response.json();if(response.ok){client.setQueryData(["me"],result);setSaved(true)}setSaving(false);}
  return <div className="mx-auto max-w-6xl">
    <section data-reveal className="relative overflow-hidden rounded-[1.8rem] border border-white/10 bg-[radial-gradient(circle_at_90%_0,rgba(232,185,106,.13),transparent_30%),rgba(255,255,255,.025)] p-6 sm:p-9"><span className="grid size-12 place-items-center rounded-2xl border border-[var(--accent)]/20 bg-[var(--accent)]/10 text-[var(--accent)]"><LayoutPanelTop size={20}/></span><p className="eyebrow mt-7">Your experience</p><h2 className="mt-2 text-3xl font-light tracking-[-.045em] sm:text-5xl">Telapsy, tuned to you.</h2><p className="mt-4 max-w-2xl text-sm font-light leading-7 text-[var(--muted)]">Control what reaches you and how your account feels. Every choice is saved privately with your profile.</p></section>

    <div className="mt-5 grid gap-5 xl:grid-cols-[1.3fr_.7fr]">
      <section className="rounded-[1.7rem] border border-white/10 bg-white/[.025] p-5 sm:p-8"><div className="flex items-center gap-3"><BellRing size={18} className="text-[var(--accent)]"/><div><p className="text-sm font-medium">Communication & display</p><p className="mt-1 text-xs text-[var(--faint)]">Choose your updates and dashboard density.</p></div></div><div className="mt-7 divide-y divide-white/10 border-y border-white/10"><SettingRow icon={<PackageCheck size={18}/>} title="Order updates" text="Receive confirmations and important status changes for your orders." checked={preferences.orderUpdates} onToggle={()=>toggle("orderUpdates")}/><SettingRow icon={<MailCheck size={18}/>} title="Collection notes" text="Hear occasionally when new considered products arrive." checked={preferences.productNews} onToggle={()=>toggle("productNews")}/><SettingRow icon={<MonitorCog size={18}/>} title="Compact dashboard" text="Use a denser dashboard layout on supported screens." checked={preferences.compactDashboard} onToggle={()=>toggle("compactDashboard")}/></div><div className="mt-7 flex flex-wrap items-center gap-4"><button type="button" onClick={save} disabled={saving} className="btn btn-primary">{saving?"Saving…":"Save settings"}</button>{saved&&<span role="status" className="flex items-center gap-2 text-xs text-[var(--accent)]"><Check size={14}/>Settings saved.</span>}</div></section>

      <div className="grid content-start gap-5"><section className="rounded-[1.7rem] border border-white/10 bg-white/[.025] p-6"><span className="grid size-11 place-items-center rounded-xl bg-emerald-400/10 text-emerald-300"><ShieldCheck size={18}/></span><h3 className="mt-5 text-xl font-light tracking-[-.035em]">Account security</h3><p className="mt-2 text-xs leading-6 text-[var(--muted)]">Your account uses {user.authProvider === "google" ? "Google authentication" : "email and password authentication"}.</p><div className="mt-5 rounded-2xl border border-white/10 bg-black/15 p-4"><span className="flex items-center gap-2 font-mono text-[8px] uppercase tracking-[.13em] text-[var(--faint)]"><KeyRound size={12}/>Login method</span><strong className="mt-2 block text-sm font-normal capitalize">{user.authProvider ?? "password"}</strong></div>{user.authProvider !== "google" && <Link href="/forgot-password" className="btn btn-secondary mt-5 w-full text-xs">Reset password</Link>}</section><section className="rounded-[1.7rem] border border-[var(--accent)]/20 bg-[var(--accent)]/[.055] p-6"><p className="eyebrow">Need a hand?</p><h3 className="mt-2 text-lg font-light">Your activity is easy to find.</h3><p className="mt-2 text-xs leading-6 text-[var(--muted)]">Visit notifications for account updates or orders for your complete purchase history.</p><div className="mt-5 flex gap-4 text-xs text-[var(--accent)]"><Link href="/notifications">Notifications →</Link><Link href="/orders">Orders →</Link></div></section></div>
    </div>
  </div>;
}

function SettingRow({ icon, title, text, checked, onToggle }: { icon: React.ReactNode; title: string; text: string; checked: boolean; onToggle: () => void }) { return <div className="flex items-start gap-4 py-5 sm:items-center"><span className="grid size-11 shrink-0 place-items-center rounded-xl bg-white/5 text-[var(--accent)]">{icon}</span><span className="min-w-0 flex-1"><strong className="block text-sm font-medium">{title}</strong><small className="mt-1 block max-w-xl text-xs leading-5 text-[var(--faint)]">{text}</small></span><button type="button" role="switch" aria-checked={checked} aria-label={title} onClick={onToggle} className={`settings-switch ${checked?"is-on":""}`}><span/></button></div>; }
