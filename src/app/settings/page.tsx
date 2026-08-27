"use client";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Check, MailCheck, MonitorCog, PackageCheck } from "lucide-react";
import { useState } from "react";
import { AccountShell } from "@/components/account-shell";
import type { SessionUser } from "@/types";

const defaults = { orderUpdates: true, productNews: false, compactDashboard: false };
export default function SettingsPage() {
  const {data}=useQuery<{user:SessionUser}>({queryKey:["me"],queryFn:()=>fetch("/api/auth/me").then(r=>r.json())});
  return <AccountShell title="Settings">{data?.user ? <SettingsForm initial={data.user.preferences ?? defaults}/> : <p className="text-sm text-[var(--muted)]">Loading settings…</p>}</AccountShell>;
}

function SettingsForm({ initial }: { initial: typeof defaults }) {
  const client=useQueryClient(); const [preferences,setPreferences]=useState(initial); const [saving,setSaving]=useState(false); const [saved,setSaved]=useState(false);
  const toggle=(key:keyof typeof defaults)=>setPreferences(current=>({...current,[key]:!current[key]}));
  async function save(){setSaving(true);setSaved(false);const response=await fetch("/api/auth/me",{method:"PATCH",headers:{"Content-Type":"application/json"},body:JSON.stringify({preferences})});const result=await response.json();if(response.ok){client.setQueryData(["me"],result);setSaved(true)}setSaving(false)}
  const items=[{key:"orderUpdates" as const,icon:PackageCheck,title:"Order updates",text:"Receive important status changes for your Telapsy orders."},{key:"productNews" as const,icon:MailCheck,title:"Collection notes",text:"Get occasional news when the considered collection changes."},{key:"compactDashboard" as const,icon:MonitorCog,title:"Compact dashboard",text:"Use a denser account view on supported screens."}];
  return <section className="max-w-4xl rounded-[1.7rem] border border-white/10 bg-white/[.025] p-5 sm:p-8" data-reveal><p className="eyebrow">Preferences</p><h2 className="mt-2 text-3xl font-light tracking-[-.04em] sm:text-4xl">Set your rhythm.</h2><p className="mt-3 max-w-2xl text-sm leading-7 text-[var(--muted)]">Choose how Telapsy keeps you informed. These preferences are stored with your account.</p><div className="mt-8 divide-y divide-white/10 border-y border-white/10">{items.map(({key,icon:Icon,title,text})=><div key={key} className="flex items-start gap-4 py-5 sm:items-center"><span className="grid size-11 shrink-0 place-items-center rounded-xl bg-white/5 text-[var(--accent)]"><Icon size={18}/></span><span className="min-w-0 flex-1"><strong className="block text-sm font-medium">{title}</strong><small className="mt-1 block max-w-xl text-xs leading-5 text-[var(--faint)]">{text}</small></span><button type="button" role="switch" aria-checked={preferences[key]} aria-label={title} onClick={()=>toggle(key)} className={`settings-switch ${preferences[key]?"is-on":""}`}><span/></button></div>)}</div><div className="mt-7 flex flex-wrap items-center gap-4"><button type="button" onClick={save} disabled={saving} className="btn btn-primary">{saving?"Saving…":"Save settings"}</button>{saved&&<span role="status" className="flex items-center gap-2 text-xs text-[var(--accent)]"><Check size={14}/>Settings saved.</span>}</div></section>;
}
