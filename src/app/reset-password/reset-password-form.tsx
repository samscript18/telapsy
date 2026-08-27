"use client";

import Link from "next/link";
import { Eye, EyeOff } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useState } from "react";

export function ResetPasswordForm() {
	const token = useSearchParams().get("token") ?? "";
	const [message, setMessage] = useState("");
	const [error, setError] = useState("");
	const [done, setDone] = useState(false);
	const [loading, setLoading] = useState(false);
	const [showPassword, setShowPassword] = useState(false);
	const [showConfirm, setShowConfirm] = useState(false);

	async function submit(event: React.FormEvent<HTMLFormElement>) {
		event.preventDefault();
		setError("");
		const form = new FormData(event.currentTarget);
		if (form.get("password") !== form.get("confirm")) {
			setError("Passwords do not match.");
			return;
		}

		setLoading(true);
		try {
			const response = await fetch("/api/auth/reset-password", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ token, password: form.get("password") }),
			});
			const data = await response.json();
			if (!response.ok) {
				setError(data.error);
				return;
			}
			setMessage(data.message);
			setDone(true);
		} catch {
			setError("Password reset is temporarily unavailable. Please try again.");
		} finally {
			setLoading(false);
		}
	}

	return (
		<div className="shell grid min-h-[620px] place-items-center py-16">
			<section className="card w-full max-w-lg p-8 sm:p-10">
				<p className="eyebrow">Choose a new password</p>
				<h1 className="display mt-3 text-5xl">Fresh start.</h1>
				{!token ? (
					<p role="alert" className="mt-6 text-red-700">
						This reset link is missing its token.
					</p>
				) : done ? (
					<div className="mt-7">
						<p role="status" className="rounded-xl p-4">
							{message}
						</p>
						<Link href="/signin" className="btn btn-primary mt-5 w-full">
							Sign in
						</Link>
					</div>
				) : (
					<form onSubmit={submit} className="mt-8 grid gap-5">
						<label className="grid gap-2 text-sm font-bold">
							New password
							<span className="relative">
								<input name="password" type={showPassword ? "text" : "password"} className="field pr-12" minLength={8} required autoComplete="new-password" />
								<button type="button" onClick={() => setShowPassword((visible) => !visible)} className="absolute right-3 top-1/2 grid size-9 -translate-y-1/2 place-items-center rounded-full text-[var(--faint)] transition hover:text-[var(--accent)]" aria-label={showPassword ? "Hide new password" : "Show new password"}>
									{showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
								</button>
							</span>
						</label>
						<label className="grid gap-2 text-sm font-bold">
							Confirm new password
							<span className="relative">
								<input name="confirm" type={showConfirm ? "text" : "password"} className="field pr-12" minLength={8} required autoComplete="new-password" />
								<button type="button" onClick={() => setShowConfirm((visible) => !visible)} className="absolute right-3 top-1/2 grid size-9 -translate-y-1/2 place-items-center rounded-full text-[var(--faint)] transition hover:text-[var(--accent)]" aria-label={showConfirm ? "Hide confirm new password" : "Show confirm new password"}>
									{showConfirm ? <EyeOff size={17} /> : <Eye size={17} />}
								</button>
							</span>
						</label>
						{error && (
							<p role="alert" className="rounded-xl bg-red-50 p-3 text-red-700">
								{error}
							</p>
						)}
						<button disabled={loading} className="btn btn-primary disabled:opacity-60">
							{loading ? "Updating password…" : "Update password"}
						</button>
					</form>
				)}
			</section>
		</div>
	);
}
