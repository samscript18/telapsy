"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { AtSign, CalendarDays, Check, CheckCircle2, KeyRound, Mail, PencilLine, ShieldCheck, UserRound, WalletCards } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { AccountShell } from "@/components/account-shell";
import { formatMoney } from "@/lib/pricing";
import type { SessionUser } from "@/types";

export default function ProfilePage() {
  const client = useQueryClient();
  const { data } = useQuery<{ user: SessionUser }>({ queryKey: ["me"], queryFn: () => fetch("/api/auth/me").then((response) => response.json()) });
  const [status, setStatus] = useState("");
  const [saving, setSaving] = useState(false);
  async function save(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault(); setSaving(true); setStatus("");
    const name = String(new FormData(event.currentTarget).get("name") ?? "");
    const response = await fetch("/api/auth/me", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ name }) });
    const result = await response.json();
    if (response.ok) { client.setQueryData(["me"], result); setStatus("Your profile details are now up to date."); }
    else setStatus(result.error ?? "Could not update profile.");
    setSaving(false);
  }
  const user = data?.user;
  const provider = user?.authProvider === "google" ? "Google" : "Email and password";
  const joined = user?.createdAt ? new Date(user.createdAt).toLocaleDateString(undefined, { dateStyle: "medium" }) : "Active account";

  return <AccountShell title="Profile" eyebrow="Identity">{user && <div className="account-page mx-auto max-w-6xl">
    <header className="account-page-header" data-reveal><span>Your Telapsy identity</span><h2>A profile built around your shopping experience.</h2><p>Keep your account recognizable and the details attached to every order accurate.</p></header>

    <section className="profile-identity-hero" data-reveal aria-labelledby="profile-name">
      <div className="profile-avatar">{user.name.slice(0,1).toUpperCase()}</div>
      <div className="profile-identity-copy"><span><UserRound size={13}/>Account profile</span><h2 id="profile-name">{user.name}</h2><p>{user.email}</p><div><span data-tone="positive"><CheckCircle2 size={13}/>Active</span><span><ShieldCheck size={13}/>Verified account</span></div></div>
      <div className="profile-hero-actions"><Link href="/settings"><PencilLine size={15}/>Edit profile</Link><Link href="/settings#security"><ShieldCheck size={15}/>Security</Link></div>
    </section>

    <div className="profile-content-grid">
      <section className="account-panel" aria-labelledby="profile-details-title">
        <PanelHeader icon={<UserRound size={17}/>} kicker="Account record" title="Your profile details" description="Identity and account information securely connected to Telapsy." id="profile-details-title" />
        <dl className="profile-detail-grid">
          <Detail icon={<Mail size={16}/>} label="Email address" value={user.email}/>
          <Detail icon={<AtSign size={16}/>} label="Display name" value={user.name}/>
          <Detail icon={<ShieldCheck size={16}/>} label="Account status" value="Active and verified"/>
          <Detail icon={<KeyRound size={16}/>} label="Login method" value={provider}/>
          <Detail icon={<CalendarDays size={16}/>} label="Member since" value={joined}/>
          <Detail icon={<WalletCards size={16}/>} label="Available balance" value={formatMoney(user.balanceCents)}/>
        </dl>
      </section>

      <form onSubmit={save} className="account-panel" aria-labelledby="edit-profile-title">
        <PanelHeader icon={<PencilLine size={17}/>} kicker="Profile details" title="Present a clear identity" description="This name appears throughout your private account and order history." id="edit-profile-title" />
        <fieldset className="account-fieldset"><legend>Personal identity</legend><p>Choose the full name you want Telapsy to use.</p><label><span>Full name</span><input key={user.name} name="name" defaultValue={user.name} required minLength={2} autoComplete="name"/></label><label><span>Email address</span><input value={user.email} disabled/><small>Your login email is locked for account security.</small></label></fieldset>
        {status && <p role="status" className="account-form-status"><Check size={14}/>{status}</p>}
        <footer className="account-form-footer"><span>Changes apply across your Telapsy account.</span><button disabled={saving}>{saving ? "Saving profile…" : "Save profile"}</button></footer>
      </form>
    </div>
  </div>}</AccountShell>;
}

function PanelHeader({ icon, kicker, title, description, id }: { icon: React.ReactNode; kicker: string; title: string; description: string; id: string }) { return <header className="account-panel-header"><span>{icon}</span><div><small>{kicker}</small><h3 id={id}>{title}</h3><p>{description}</p></div></header>; }
function Detail({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) { return <div><span>{icon}</span><div><dt>{label}</dt><dd>{value}</dd></div></div>; }
