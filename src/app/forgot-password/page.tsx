"use client";
import Link from "next/link";
import { useState } from "react";
export default function ForgotPasswordPage() {
  const [message, setMessage] = useState("");
  const [preview, setPreview] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setMessage("");
    setPreview("");
    const email = new FormData(event.currentTarget).get("email");
    try {
      const response = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await response.json();
      setMessage(data.message ?? data.error);
      setPreview(data.previewUrl ?? "");
    } catch {
      setMessage("Password recovery is temporarily unavailable. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="shell grid min-h-[620px] place-items-center py-12">
      <section className="rounded-xl border border-[var(--line)] bg-[var(--surface)] w-full max-w-md p-8 sm:p-10 shadow-2xl">
        <p className="eyebrow">Account Recovery</p>
        <h1 className="mt-2 text-3xl font-extralight tracking-[-0.04em] text-[var(--ink)]">Reset Password</h1>
        <p className="mt-3 text-xs leading-relaxed font-light text-[var(--muted)]">
          Enter your registered email address to generate a single-use password recovery link.
        </p>

        <form onSubmit={submit} className="mt-8 grid gap-5">
          <label className="grid gap-1.5 text-xs font-mono text-[var(--faint)]">
            <span>EMAIL ADDRESS</span>
            <input name="email" type="email" className="field text-xs text-[var(--ink)] font-sans" required autoComplete="email" />
          </label>

          {message && (
            <p role="status" className="rounded-lg border border-[var(--accent)]/30 bg-[var(--accent)]/10 p-3.5 text-xs font-mono text-[var(--accent)]">
              {message}
            </p>
          )}

          {preview && (
            <Link href={preview} className="btn btn-secondary rounded-full py-3 text-xs font-mono">
              Open local reset link →
            </Link>
          )}

          <button disabled={loading} className="btn btn-primary rounded-full py-3.5 text-sm font-medium disabled:opacity-60">
            {loading ? "Preparing reset…" : "Send reset link"}
          </button>

          <Link href="/signin" className="text-center text-xs font-mono text-[var(--faint)] hover:text-[var(--ink)] underline">
            Back to sign in
          </Link>
        </form>
      </section>
    </div>
  );
}
