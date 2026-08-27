"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { ArrowUpRight, BellRing, Check, CheckCircle2, KeyRound, Mail, MonitorCog, PackageCheck, PencilLine, ShieldCheck, UserRound } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { AccountShell } from "@/components/account-shell";
import type { SessionUser } from "@/types";

const defaults = { orderUpdates: true, productNews: false, compactDashboard: false };

export default function SettingsPage() {
  const { data } = useQuery<{ user: SessionUser }>({ queryKey: ["me"], queryFn: () => fetch("/api/auth/me").then((response) => response.json()) });
  return <AccountShell title="Settings" eyebrow="Preferences">{data?.user && <SettingsExperience user={data.user}/>}</AccountShell>;
}

function SettingsExperience({ user }: { user: SessionUser }) {
  const client = useQueryClient();
  const [preferences, setPreferences] = useState(user.preferences ?? defaults);
  const [profileStatus, setProfileStatus] = useState("");
  const [preferenceStatus, setPreferenceStatus] = useState("");
  const [savingProfile, setSavingProfile] = useState(false);
  const [savingPreferences, setSavingPreferences] = useState(false);
  const provider = user.authProvider === "google" ? "Google authentication" : "Email and password";

  async function update(body: object) { const response = await fetch("/api/auth/me", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) }); const result = await response.json(); if (!response.ok) throw new Error(result.error ?? "Settings could not be saved."); client.setQueryData(["me"], result); }
  async function saveProfile(event: React.FormEvent<HTMLFormElement>) { event.preventDefault(); setSavingProfile(true); setProfileStatus(""); try { await update({ name: String(new FormData(event.currentTarget).get("name") ?? "") }); setProfileStatus("Your profile details are now up to date."); } catch (error) { setProfileStatus(error instanceof Error ? error.message : "Could not save profile."); } setSavingProfile(false); }
  async function savePreferences() { setSavingPreferences(true); setPreferenceStatus(""); try { await update({ preferences }); setPreferenceStatus("Your notification preferences are now up to date."); } catch (error) { setPreferenceStatus(error instanceof Error ? error.message : "Could not save preferences."); } setSavingPreferences(false); }
  const toggle = (key: keyof typeof defaults) => { setPreferenceStatus(""); setPreferences((current) => ({ ...current, [key]: !current[key] })); };

  return <div className="account-page mx-auto max-w-6xl">
    <header className="account-page-header" data-reveal><span>Your Telapsy experience</span><h2>Shape the account around how you shop.</h2><p>Keep your identity accurate, notifications intentional, and account access secure.</p></header>
    <nav className="settings-section-nav" aria-label="Settings sections"><a href="#profile" className="is-active"><UserRound size={15}/>Profile</a><a href="#notifications"><BellRing size={15}/>Notifications</a><a href="#security"><ShieldCheck size={15}/>Security</a></nav>

    <section className="settings-profile-summary" data-reveal aria-labelledby="settings-name"><div className="profile-avatar !size-[72px] !rounded-2xl !text-2xl">{user.name.slice(0,1).toUpperCase()}</div><div><span><UserRound size={13}/>Account identity</span><h2 id="settings-name">{user.name}</h2><p>{user.email}</p><div><span data-tone="positive"><CheckCircle2 size={13}/>Active</span><span><ShieldCheck size={13}/>Verified</span></div></div><Link href="/profile">View full profile <ArrowUpRight size={15}/></Link></section>

    <div className="settings-content-grid">
      <form id="profile" className="account-panel scroll-mt-24" onSubmit={saveProfile}><PanelHeader icon={<PencilLine size={17}/>} kicker="Profile details" title="Present a clear identity" description="These details identify you throughout your private shopping account."/><fieldset className="account-fieldset"><legend>Personal identity</legend><p>Keep the name attached to your account and orders accurate.</p><label><span>Full name</span><input name="name" defaultValue={user.name} required minLength={2}/></label><label><span><Mail size={13}/>Email address</span><input value={user.email} disabled/><small>Your login email cannot be changed here.</small></label></fieldset>{profileStatus&&<p className="account-form-status" role="status"><Check size={14}/>{profileStatus}</p>}<footer className="account-form-footer"><span>Saved to your real Telapsy account.</span><button disabled={savingProfile}>{savingProfile?"Saving profile…":"Save profile"}</button></footer></form>

      <section id="notifications" className="account-panel scroll-mt-24"><PanelHeader icon={<BellRing size={17}/>} kicker="Notification delivery" title="Choose what deserves attention" description="Control the account updates and product messages you want to receive."/><div className="settings-preference-list"><SettingRow icon={<PackageCheck size={17}/>} title="Order updates" text="Confirmations and important status changes for your orders." checked={preferences.orderUpdates} onToggle={()=>toggle("orderUpdates")}/><SettingRow icon={<Mail size={17}/>} title="Collection notes" text="Occasional news when the considered collection changes." checked={preferences.productNews} onToggle={()=>toggle("productNews")}/><SettingRow icon={<MonitorCog size={17}/>} title="Compact dashboard" text="A denser account overview on supported screens." checked={preferences.compactDashboard} onToggle={()=>toggle("compactDashboard")}/></div>{preferenceStatus&&<p className="account-form-status" role="status"><Check size={14}/>{preferenceStatus}</p>}<footer className="account-form-footer"><span>Security alerts may remain essential.</span><button type="button" onClick={savePreferences} disabled={savingPreferences}>{savingPreferences?"Saving preferences…":"Save notifications"}</button></footer></section>
    </div>

    <section id="security" className="account-panel account-security-panel scroll-mt-24"><PanelHeader icon={<ShieldCheck size={17}/>} kicker="Account security" title="Your access is protected" description="Review the method used to authenticate this Telapsy account."/><div className="security-method"><span><KeyRound size={17}/></span><div><small>Login method</small><strong>{provider}</strong><p>{user.authProvider === "google" ? "Use the Google account originally registered with Telapsy." : "Your password is securely hashed and never stored as readable text."}</p></div>{user.authProvider !== "google" && <Link href="/forgot-password">Reset password</Link>}</div></section>
  </div>;
}

function PanelHeader({ icon, kicker, title, description }: { icon: React.ReactNode; kicker: string; title: string; description: string }) { return <header className="account-panel-header"><span>{icon}</span><div><small>{kicker}</small><h3>{title}</h3><p>{description}</p></div></header>; }
function SettingRow({ icon, title, text, checked, onToggle }: { icon: React.ReactNode; title: string; text: string; checked: boolean; onToggle: () => void }) { return <div><span className="settings-row-icon">{icon}</span><span><strong>{title}</strong><small>{text}</small></span><button type="button" role="switch" aria-checked={checked} aria-label={title} onClick={onToggle} className={`settings-switch ${checked?"is-on":""}`}><span/></button></div>; }
