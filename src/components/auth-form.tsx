"use client";

import Link from "next/link";
import { Eye, EyeOff, CheckCircle2, Circle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";

const requirements = [
  { label: "At least 12 characters", test: (value: string) => value.length >= 12 },
  { label: "One uppercase letter", test: (value: string) => /[A-Z]/.test(value) },
  { label: "One lowercase letter", test: (value: string) => /[a-z]/.test(value) },
  { label: "One number", test: (value: string) => /[0-9]/.test(value) },
  { label: "One special character", test: (value: string) => /[^A-Za-z0-9]/.test(value) },
];

export function AuthForm({ mode, next }: { mode: "signup" | "signin"; next?: string }) {
  const signup = mode === "signup"; const router = useRouter();
  const [error, setError] = useState(""); const [loading, setLoading] = useState(false); const [showPassword, setShowPassword] = useState(false); const [showConfirm, setShowConfirm] = useState(false); const [password, setPassword] = useState(""); const [confirmPassword, setConfirmPassword] = useState("");
  const checks = useMemo(() => requirements.map((requirement) => requirement.test(password)), [password]);
  async function submit(event: React.FormEvent<HTMLFormElement>) { event.preventDefault(); setLoading(true); setError(""); const form = new FormData(event.currentTarget); if (signup && password !== confirmPassword) { setError("Passwords do not match."); setLoading(false); return; } try { const response = await fetch(`/api/auth/${mode}`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ name: form.get("name"), email: form.get("email"), password }) }); const data = await response.json(); if (!response.ok) throw new Error(data.error); const destination = next?.startsWith("/") && !next.startsWith("//") ? next : "/dashboard"; router.push(destination); router.refresh(); } catch (cause) { setError(cause instanceof Error ? cause.message : "Something went wrong."); setLoading(false); } }
  return <form onSubmit={submit} className="mt-8 grid gap-5">
    {signup && <label className="grid gap-1.5 text-xs font-mono text-[var(--faint)]"><span>FULL NAME</span><input className="field text-xs text-[var(--ink)] font-sans" name="name" autoComplete="name" required minLength={2}/></label>}
    <label className="grid gap-1.5 text-xs font-mono text-[var(--faint)]"><span>EMAIL ADDRESS</span><input className="field text-xs text-[var(--ink)] font-sans" type="email" name="email" autoComplete="email" required/></label>
    <label className="grid gap-1.5 text-xs font-mono text-[var(--faint)]"><span>PASSWORD</span><span className="relative"><input className="field pr-12 text-xs text-[var(--ink)] font-sans" type={showPassword?"text":"password"} name="password" autoComplete={signup?"new-password":"current-password"} required minLength={signup?12:1} value={password} onChange={(event)=>setPassword(event.target.value)}/>{signup&&<button type="button" onClick={()=>setShowPassword((visible)=>!visible)} className="absolute right-3 top-1/2 grid size-9 -translate-y-1/2 place-items-center rounded-full text-[var(--faint)] hover:text-[var(--accent)]" aria-label={showPassword?"Hide password":"Show password"}>{showPassword?<EyeOff size={17}/>:<Eye size={17}/>}</button>}</span></label>
    {signup && <div className="password-requirements"><p>Password must contain:</p>{requirements.map((requirement,index)=>{const met=checks[index];return <div key={requirement.label} className={met?"is-met":""}>{met?<CheckCircle2 size={18}/>:<Circle size={18}/>}<span>{requirement.label}</span></div>;})}</div>}
    {!signup && <Link href="/forgot-password" className="-mt-2 text-right text-xs font-mono text-[var(--accent)] underline hover:text-[var(--accent-bright)]">Forgot password?</Link>}
    {signup && <label className="grid gap-1.5 text-xs font-mono text-[var(--faint)]"><span>CONFIRM PASSWORD</span><span className="relative"><input className="field pr-12 text-xs text-[var(--ink)] font-sans" type={showConfirm?"text":"password"} name="confirmPassword" autoComplete="new-password" required minLength={12} value={confirmPassword} onChange={(event)=>setConfirmPassword(event.target.value)}/><button type="button" onClick={()=>setShowConfirm((visible)=>!visible)} className="absolute right-3 top-1/2 grid size-9 -translate-y-1/2 place-items-center rounded-full text-[var(--faint)] hover:text-[var(--accent)]" aria-label={showConfirm?"Hide confirm password":"Show confirm password"}>{showConfirm?<EyeOff size={17}/>:<Eye size={17}/>}</button></span></label>}
    {error && <p role="alert" className="rounded-lg border border-[var(--retired)]/30 bg-[var(--retired)]/10 p-3 text-xs font-mono text-[var(--retired)]">{error}</p>}
    <button disabled={loading} className="btn btn-primary w-full rounded-full py-3.5 text-sm font-medium disabled:opacity-60">{loading?(signup?"Creating account…":"Logging in…"):(signup?"Sign up":"Login")}</button>
    <p className="text-center text-xs font-light text-[var(--muted)]">{signup?"Already have an account?":"New to Telapsy?"}{" "}<Link className="font-mono text-[var(--accent)] hover:text-[var(--accent-bright)] hover:underline" href={`${signup?"/signin":"/signup"}${next?`?next=${encodeURIComponent(next)}`:""}`}>{signup?"Login":"Sign up"}</Link></p>
  </form>;
}
