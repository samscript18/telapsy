"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function AuthForm({ mode }: { mode: "signup" | "signin" }) {
  const signup = mode === "signup";
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError("");
    const form = new FormData(event.currentTarget);
    if (signup && form.get("password") !== form.get("confirmPassword")) {
      setError("Passwords do not match.");
      setLoading(false);
      return;
    }
    const body = { name: form.get("name"), email: form.get("email"), password: form.get("password") };
    try {
      const response = await fetch(`/api/auth/${mode}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error);
      router.push("/account");
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong.");
      setLoading(false);
    }
  }

  return (
    <form onSubmit={submit} className="mt-8 grid gap-5">
      {signup && (
        <label className="grid gap-1.5 text-xs font-mono text-[var(--faint)]">
          <span>FULL NAME</span>
          <input className="field text-xs text-[var(--ink)] font-sans" name="name" autoComplete="name" required minLength={2} />
        </label>
      )}

      <label className="grid gap-1.5 text-xs font-mono text-[var(--faint)]">
        <span>EMAIL ADDRESS</span>
        <input className="field text-xs text-[var(--ink)] font-sans" type="email" name="email" autoComplete="email" required />
      </label>

      <label className="grid gap-1.5 text-xs font-mono text-[var(--faint)]">
        <span>PASSWORD</span>
        <input
          className="field text-xs text-[var(--ink)] font-sans"
          type="password"
          name="password"
          autoComplete={signup ? "new-password" : "current-password"}
          required
          minLength={signup ? 8 : 1}
        />
        {signup && <span className="text-[11px] font-light text-[var(--muted)]">At least 8 characters with letters & numbers.</span>}
      </label>

      {!signup && (
        <Link href="/forgot-password" className="-mt-2 text-right text-xs font-mono text-[var(--faint)] hover:text-[var(--ink)] underline">
          Forgot password?
        </Link>
      )}

      {signup && (
        <label className="grid gap-1.5 text-xs font-mono text-[var(--faint)]">
          <span>CONFIRM PASSWORD</span>
          <input className="field text-xs text-[var(--ink)] font-sans" type="password" name="confirmPassword" autoComplete="new-password" required />
        </label>
      )}

      {error && (
        <p role="alert" className="rounded-lg border border-[var(--retired)]/30 bg-[var(--retired)]/10 p-3 text-xs font-mono text-[var(--retired)]">
          {error}
        </p>
      )}

      <button disabled={loading} className="btn btn-primary w-full rounded-full py-3.5 text-sm font-medium disabled:opacity-60">
        {loading ? (signup ? "Creating account…" : "Signing in…") : signup ? "Create my account" : "Sign in"}
      </button>

      <p className="text-center text-xs font-light text-[var(--muted)]">
        {signup ? "Already have an account?" : "New to Telapsy?"}{" "}
        <Link className="font-mono text-[var(--accent)] hover:underline" href={signup ? "/signin" : "/signup"}>
          {signup ? "Sign in" : "Create account"}
        </Link>
      </p>
    </form>
  );
}
