"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { ArrowUpRight, BellRing, Check, CheckCircle2, Clock3, Eye, EyeOff, KeyRound, LogOut, Mail, MonitorCog, PackageCheck, PencilLine, ShieldCheck, Smartphone, Trash2, UserRound } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { AccountShell } from "@/components/account-shell";
import type { AccountSession, SessionUser } from "@/types";

const defaults = { orderUpdates: true, productNews: false, compactDashboard: false };
type SettingsTab = "profile" | "security" | "privacy";

export default function SettingsPage() {
	const { data } = useQuery<{ user: SessionUser }>({
		queryKey: ["me"],
		queryFn: () => fetch("/api/auth/me").then((response) => response.json()),
	});
	return (
		<AccountShell title="Settings" eyebrow="Preferences">
			{data?.user && <SettingsExperience user={data.user} />}
		</AccountShell>
	);
}

function SettingsExperience({ user }: { user: SessionUser }) {
	const router = useRouter();
	const client = useQueryClient();
	const [activeTab, setActiveTab] = useState<SettingsTab>(() => {
		if (typeof window === "undefined") return "profile";
		const requested = new URLSearchParams(window.location.search).get("tab");
		return requested === "security" || requested === "privacy" ? requested : "profile";
	});
	const [preferences, setPreferences] = useState(user.preferences ?? defaults);
	const [profileStatus, setProfileStatus] = useState("");
	const [preferenceStatus, setPreferenceStatus] = useState("");
	const [securityStatus, setSecurityStatus] = useState("");
	const [deleteStatus, setDeleteStatus] = useState("");
	const [savingProfile, setSavingProfile] = useState(false);
	const [savingPreferences, setSavingPreferences] = useState(false);
	const [changingPassword, setChangingPassword] = useState(false);
	const [visiblePasswords, setVisiblePasswords] = useState({ current: false, next: false, confirm: false });
	const [revokingSession, setRevokingSession] = useState("");
	const [confirmSignOutAll, setConfirmSignOutAll] = useState(false);
	const [deleting, setDeleting] = useState(false);
	const provider = user.authProvider === "google" ? "Google authentication" : "Email and password";
	const togglePasswordVisibility = (field: keyof typeof visiblePasswords) => {
		setVisiblePasswords((current) => ({ ...current, [field]: !current[field] }));
	};
	const {
		data: sessionData,
		isLoading: sessionsLoading,
		refetch: refetchSessions,
	} = useQuery<{ sessions: AccountSession[] }>({
		queryKey: ["account-sessions"],
		queryFn: async () => {
			const response = await fetch("/api/auth/sessions");
			if (!response.ok) throw new Error("Could not load active sessions.");
			return response.json();
		},
		retry: false,
		enabled: activeTab === "security",
	});

	function selectTab(tab: SettingsTab) {
		setActiveTab(tab);
		const url = tab === "profile" ? "/settings" : `/settings?tab=${tab}`;
		window.history.replaceState(null, "", url);
	}

	async function update(body: object) {
		const response = await fetch("/api/auth/me", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
		const result = await response.json();
		if (!response.ok) throw new Error(result.error ?? "Settings could not be saved.");
		client.setQueryData(["me"], result);
	}

	async function saveProfile(event: React.FormEvent<HTMLFormElement>) {
		event.preventDefault();
		setSavingProfile(true);
		setProfileStatus("");
		try {
			await update({ name: String(new FormData(event.currentTarget).get("name") ?? "") });
			setProfileStatus("Your profile details are now up to date.");
		} catch (error) {
			setProfileStatus(error instanceof Error ? error.message : "Could not save profile.");
		}
		setSavingProfile(false);
	}

	async function savePreferences() {
		setSavingPreferences(true);
		setPreferenceStatus("");
		try {
			await update({ preferences });
			setPreferenceStatus("Your notification preferences are now up to date.");
		} catch (error) {
			setPreferenceStatus(error instanceof Error ? error.message : "Could not save preferences.");
		}
		setSavingPreferences(false);
	}

	async function changePassword(event: React.FormEvent<HTMLFormElement>) {
		event.preventDefault();
		const form = new FormData(event.currentTarget);
		const newPassword = String(form.get("newPassword") ?? "");
		if (newPassword !== String(form.get("confirmPassword") ?? "")) {
			setSecurityStatus("New passwords do not match.");
			return;
		}
		setChangingPassword(true);
		setSecurityStatus("");
		const response = await fetch("/api/auth/password", {
			method: "PATCH",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ currentPassword: form.get("currentPassword"), newPassword }),
		});
		const result = await response.json();
		if (!response.ok) {
			setSecurityStatus(result.error ?? "Could not change password.");
			setChangingPassword(false);
			return;
		}
		client.clear();
		router.push("/signin?password=changed");
		router.refresh();
	}

	async function revokeSession(session: AccountSession) {
		setRevokingSession(session.id);
		setSecurityStatus("");
		const response = await fetch(`/api/auth/sessions/${encodeURIComponent(session.id)}`, { method: "DELETE" });
		const result = await response.json();
		if (!response.ok) {
			setSecurityStatus(result.error ?? "Could not revoke this session.");
			setRevokingSession("");
			return;
		}
		if (result.signedOut) {
			client.clear();
			router.push("/");
			router.refresh();
			return;
		}
		await refetchSessions();
		setRevokingSession("");
	}

	async function signOutEverywhere() {
		if (!confirmSignOutAll) {
			setConfirmSignOutAll(true);
			return;
		}
		setRevokingSession("all");
		const response = await fetch("/api/auth/sessions", { method: "DELETE" });
		if (!response.ok) {
			const result = await response.json();
			setSecurityStatus(result.error ?? "Could not sign out every session.");
			setRevokingSession("");
			return;
		}
		client.clear();
		router.push("/");
		router.refresh();
	}

	async function deleteAccount(event: React.FormEvent<HTMLFormElement>) {
		event.preventDefault();
		const form = new FormData(event.currentTarget);
		setDeleting(true);
		setDeleteStatus("");
		const response = await fetch("/api/account", {
			method: "DELETE",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ confirmation: form.get("confirmation"), password: form.get("password") }),
		});
		const result = await response.json();
		if (!response.ok) {
			setDeleteStatus(result.error ?? "Could not delete your account.");
			setDeleting(false);
			return;
		}
		client.clear();
		router.push("/");
		router.refresh();
	}

	const toggle = (key: keyof typeof defaults) => {
		setPreferenceStatus("");
		setPreferences((current) => ({ ...current, [key]: !current[key] }));
	};

	return (
		<div className="account-page mx-auto max-w-6xl">
			<header className="account-page-header" data-reveal>
				<span>Your Telapsy experience</span>
				<h2>Shape the account around how you shop.</h2>
				<p>Keep your identity accurate, notifications intentional, and every active device under your control.</p>
			</header>

			<nav className="settings-section-nav" aria-label="Settings sections" role="tablist">
				<button
					type="button"
					role="tab"
					id="settings-tab-profile"
					aria-selected={activeTab === "profile"}
					aria-controls="settings-panel-profile"
					className={activeTab === "profile" ? "is-active" : ""}
					onClick={() => selectTab("profile")}
				>
					<UserRound size={15} />
					Profile
				</button>
				<button
					type="button"
					role="tab"
					id="settings-tab-security"
					aria-selected={activeTab === "security"}
					aria-controls="settings-panel-security"
					className={activeTab === "security" ? "is-active" : ""}
					onClick={() => selectTab("security")}
				>
					<ShieldCheck size={15} />
					Password &amp; sessions
				</button>
				<button
					type="button"
					role="tab"
					id="settings-tab-privacy"
					aria-selected={activeTab === "privacy"}
					aria-controls="settings-panel-privacy"
					className={activeTab === "privacy" ? "is-active" : ""}
					onClick={() => selectTab("privacy")}
				>
					<Trash2 size={15} />
					Privacy &amp; data
				</button>
			</nav>

			{activeTab === "profile" && (
				<div id="settings-panel-profile" role="tabpanel" aria-labelledby="settings-tab-profile" className="settings-tab-panel">
					<section className="settings-profile-summary" data-reveal aria-labelledby="settings-name">
						{user.profileImage ? (
							<span className="relative size-[72px] overflow-hidden rounded-2xl border border-[var(--line)]">
								<Image src={user.profileImage} alt={`${user.name} profile`} fill unoptimized className="object-cover" sizes="72px" />
							</span>
						) : (
							<div className="profile-avatar !size-[72px] !rounded-2xl !text-2xl">{user.name.slice(0, 1).toUpperCase()}</div>
						)}
						<div>
							<span>
								<UserRound size={13} />
								Account identity
							</span>
							<h2 id="settings-name">{user.name}</h2>
							<p>{user.email}</p>
							<div>
								<span data-tone="positive" className="text-xs!">
									<CheckCircle2 size={13} />
									Active
								</span>
								<span className="text-xs!">
									<ShieldCheck size={13} />
									Verified
								</span>
							</div>
						</div>
						<Link href="/profile">
							View full profile <ArrowUpRight size={15} />
						</Link>
					</section>

					<div className="settings-content-grid">
						<form id="profile" className="account-panel scroll-mt-24" onSubmit={saveProfile}>
							<PanelHeader
								icon={<PencilLine size={17} />}
								kicker="Profile details"
								title="Present a clear identity"
								description="These details identify you throughout your private shopping account."
							/>
							<fieldset className="account-fieldset">
								<legend>Personal identity</legend>
								<p>Keep the name attached to your account and orders accurate.</p>
								<label>
									<span>Full name</span>
									<input name="name" defaultValue={user.name} required minLength={2} />
								</label>
								<label>
									<span>
										<Mail size={13} />
										Email address
									</span>
									<input value={user.email} disabled />
									<small>Your login email cannot be changed here.</small>
								</label>
							</fieldset>
							{profileStatus && (
								<p className="account-form-status" role="status">
									<Check size={14} />
									{profileStatus}
								</p>
							)}
							<footer className="account-form-footer">
								<span>Saved to your Telapsy account.</span>
								<button disabled={savingProfile}>{savingProfile ? "Saving profile…" : "Save profile"}</button>
							</footer>
						</form>

						<section id="notifications" className="account-panel scroll-mt-24">
							<PanelHeader
								icon={<BellRing size={17} />}
								kicker="Notification delivery"
								title="Choose what deserves attention"
								description="Control the account updates and product messages you want to receive."
							/>
							<div className="settings-preference-list">
								<SettingRow
									icon={<PackageCheck size={17} />}
									title="Order updates"
									text="Confirmations and important status changes for your orders."
									checked={preferences.orderUpdates}
									onToggle={() => toggle("orderUpdates")}
								/>
								<SettingRow
									icon={<Mail size={17} />}
									title="Collection notes"
									text="Occasional news when the considered collection changes."
									checked={preferences.productNews}
									onToggle={() => toggle("productNews")}
								/>
								<SettingRow
									icon={<MonitorCog size={17} />}
									title="Compact dashboard"
									text="A denser account overview on supported screens."
									checked={preferences.compactDashboard}
									onToggle={() => toggle("compactDashboard")}
								/>
							</div>
							{preferenceStatus && (
								<p className="account-form-status" role="status">
									<Check size={14} />
									{preferenceStatus}
								</p>
							)}
							<footer className="account-form-footer">
								<span>Security alerts may remain essential.</span>
								<button type="button" onClick={savePreferences} disabled={savingPreferences}>
									{savingPreferences ? "Saving preferences…" : "Save notifications"}
								</button>
							</footer>
						</section>
					</div>
				</div>
			)}

			{activeTab === "security" && (
				<div id="settings-panel-security" role="tabpanel" aria-labelledby="settings-tab-security" className="settings-tab-panel">
					<section id="security" className="account-panel account-security-panel scroll-mt-24">
						<PanelHeader
							icon={<KeyRound size={17} />}
							kicker="Password"
							title="Change your credentials"
							description={`${provider}. A successful password change signs out every active device, including this one.`}
						/>
						{user.authProvider === "google" ? (
							<div className="security-method">
								<span>
									<ShieldCheck size={17} />
								</span>
								<div>
									<small>Password management</small>
									<strong>Managed by Google</strong>
									<p>Telapsy never receives your Google password. Change it from your Google Account security settings.</p>
								</div>
							</div>
						) : (
							<form onSubmit={changePassword} className="mt-6 grid gap-4">
								<label className="grid gap-2 text-xs text-[var(--muted)]">
									<span>Current password</span>
									<span className="relative">
										<input className="field pr-12" name="currentPassword" type={visiblePasswords.current ? "text" : "password"} autoComplete="current-password" required />
										<button type="button" onClick={() => togglePasswordVisibility("current")} className="absolute right-3 top-1/2 grid size-9 -translate-y-1/2 place-items-center rounded-full text-[var(--faint)] transition hover:text-[var(--accent)]" aria-label={visiblePasswords.current ? "Hide current password" : "Show current password"}>
											{visiblePasswords.current ? <EyeOff size={17} /> : <Eye size={17} />}
										</button>
									</span>
								</label>
								<div className="grid gap-4 sm:grid-cols-2">
									<label className="grid gap-2 text-xs text-[var(--muted)]">
										<span>New password</span>
										<span className="relative">
											<input className="field pr-12" name="newPassword" type={visiblePasswords.next ? "text" : "password"} autoComplete="new-password" minLength={12} required />
											<button type="button" onClick={() => togglePasswordVisibility("next")} className="absolute right-3 top-1/2 grid size-9 -translate-y-1/2 place-items-center rounded-full text-[var(--faint)] transition hover:text-[var(--accent)]" aria-label={visiblePasswords.next ? "Hide new password" : "Show new password"}>
												{visiblePasswords.next ? <EyeOff size={17} /> : <Eye size={17} />}
											</button>
										</span>
									</label>
									<label className="grid gap-2 text-xs text-[var(--muted)]">
										<span>Confirm new password</span>
										<span className="relative">
											<input className="field pr-12" name="confirmPassword" type={visiblePasswords.confirm ? "text" : "password"} autoComplete="new-password" minLength={12} required />
											<button type="button" onClick={() => togglePasswordVisibility("confirm")} className="absolute right-3 top-1/2 grid size-9 -translate-y-1/2 place-items-center rounded-full text-[var(--faint)] transition hover:text-[var(--accent)]" aria-label={visiblePasswords.confirm ? "Hide confirm new password" : "Show confirm new password"}>
												{visiblePasswords.confirm ? <EyeOff size={17} /> : <Eye size={17} />}
											</button>
										</span>
									</label>
								</div>
								<div className="mt-2 flex flex-col items-start justify-between gap-4 rounded-2xl border border-[rgba(110,231,183,.18)] bg-[rgba(110,231,183,.04)] p-4 sm:flex-row sm:items-center">
									<p className="text-xs leading-5 text-[#91d8b5]">Use at least 12 characters with uppercase, lowercase, a number, and a special character.</p>
									<button disabled={changingPassword} className="btn btn-primary shrink-0 rounded-full px-6 py-3 text-xs">
										{changingPassword ? "Changing password…" : "Change password"}
									</button>
								</div>
							</form>
						)}
						{securityStatus && (
							<p className="account-form-status" role="status">
								{securityStatus}
							</p>
						)}
					</section>

					<section className="account-panel account-security-panel" aria-labelledby="active-sessions-title">
						<PanelHeader
							icon={<MonitorCog size={17} />}
							kicker="Account access"
							title="Active sessions"
							description="Review the devices currently authenticated to your Telapsy account."
							id="active-sessions-title"
						/>
						{sessionsLoading ? (
							<div className="mt-6 grid gap-4 sm:grid-cols-2">
								<div className="h-56 animate-pulse rounded-2xl bg-white/[.025]" />
								<div className="h-56 animate-pulse rounded-2xl bg-white/[.025]" />
							</div>
						) : (
							<div className="mt-6 grid gap-4 md:grid-cols-2">
								{sessionData?.sessions.map((session) => (
									<SessionCard key={session.id} session={session} loading={revokingSession === session.id} onRevoke={() => revokeSession(session)} />
								))}
							</div>
						)}
						<div className="mt-5 flex flex-col items-start justify-between gap-4 border-t border-[var(--line)] pt-5 sm:flex-row sm:items-center">
							<p className="max-w-xl text-xs leading-5 text-[var(--faint)]">If you do not recognize a device, revoke it immediately. Signing out everywhere invalidates every Telapsy session.</p>
							<button
								type="button"
								onClick={signOutEverywhere}
								disabled={revokingSession === "all"}
								className={`rounded-full border px-5 py-3 text-xs! transition ${confirmSignOutAll ? "border-[#df8585] bg-[#df8585]/10 text-[#f2a6a6]" : "border-[var(--line-strong)] text-[var(--muted)] hover:border-[#df8585]/60 hover:text-[#f2a6a6]"}`}
							>
								{revokingSession === "all" ? "Signing out…" : confirmSignOutAll ? "Confirm sign out everywhere" : "Sign out everywhere"}
							</button>
						</div>
					</section>
				</div>
			)}

			{activeTab === "privacy" && (
				<section id="settings-panel-privacy" role="tabpanel" aria-labelledby="settings-tab-privacy" className="account-panel scroll-mt-24">
					<PanelHeader
						icon={<Trash2 size={17} />}
						kicker="Privacy & data"
						title="Delete your account"
						description="Permanently remove your profile, sessions, notifications, and Telapsy order history."
						id="delete-account-title"
						tone="danger"
					/>
					<form onSubmit={deleteAccount} className="mt-6 grid gap-4 rounded-2xl border border-[#df8585]/20 bg-[#df8585]/[.035] p-5 sm:p-6">
						<div>
							<strong className="text-sm font-medium text-[var(--ink)]">This action cannot be undone.</strong>
							<p className="mt-2 max-w-2xl text-xs leading-6 text-[var(--faint)]">
								Type <span className="font-mono text-[#f2a6a6]">DELETE</span>
								{user.authProvider !== "google" ? " and enter your current password" : ""} to permanently delete the account.
							</p>
						</div>
						<div className="grid gap-4 sm:grid-cols-2">
							<label className="grid gap-2 text-xs text-[var(--muted)]">
								<span>Confirmation</span>
								<input className="field" name="confirmation" placeholder="Type DELETE" autoComplete="off" required />
							</label>
							{user.authProvider !== "google" && (
								<label className="grid gap-2 text-xs text-[var(--muted)]">
									<span>Current password</span>
									<input className="field" name="password" type="password" autoComplete="current-password" required />
								</label>
							)}
						</div>
						{deleteStatus && (
							<p role="alert" className="text-xs text-[#f2a6a6]">
								{deleteStatus}
							</p>
						)}
						<button disabled={deleting} className="w-fit rounded-full border border-[#df8585]/60 px-6 py-3 text-xs! text-[#f2a6a6] transition hover:bg-[#df8585]/10 disabled:opacity-50">
							{deleting ? "Deleting account…" : "Delete account permanently"}
						</button>
					</form>
				</section>
			)}
		</div>
	);
}

function SessionCard({ session, loading, onRevoke }: { session: AccountSession; loading: boolean; onRevoke: () => void }) {
	return (
		<article className={`overflow-hidden rounded-2xl border ${session.current ? "border-[rgba(232,185,106,.28)] bg-[linear-gradient(145deg,rgba(232,185,106,.08),rgba(255,255,255,.018))]" : "border-[var(--line)] bg-white/[.018]"}`}>
			<header className="flex items-center gap-3 border-b border-[var(--line)] p-5">
				<span className="grid size-11 place-items-center rounded-xl bg-[rgba(232,185,106,.1)] text-[var(--accent)]">
					{session.device.includes("iPhone") || session.device.includes("Android") ? <Smartphone size={19} /> : <MonitorCog size={19} />}
				</span>
				<div className="min-w-0">
					<strong className="block text-sm font-medium text-[var(--ink)]">{session.device}</strong>
					<span className="mt-1 block truncate text-xs text-[var(--faint)]">
						{session.browser} · {session.operatingSystem}
					</span>
				</div>
				{session.current && <span className="ml-auto rounded-full border border-[rgba(110,231,183,.2)] bg-[rgba(110,231,183,.07)] px-2.5 py-1 text-[9px] uppercase tracking-[.12em] text-[#a7f3d0]">This device</span>}
			</header>
			<dl className="grid grid-cols-2">
				<div className="border-b border-r border-[var(--line)] p-4">
					<dt className="flex items-center gap-1.5 text-[9px] uppercase tracking-[.12em] text-[var(--faint)]">
						<Clock3 size={12} />
						Last active
					</dt>
					<dd className="mt-2 text-xs text-[var(--muted)]">{formatDate(session.lastActiveAt)}</dd>
				</div>
				<div className="border-b border-[var(--line)] p-4">
					<dt className="text-[9px] uppercase tracking-[.12em] text-[var(--faint)]">Expires</dt>
					<dd className="mt-2 text-xs text-[var(--muted)]">{formatDate(session.expiresAt)}</dd>
				</div>
			</dl>
			<footer className="flex items-center justify-between gap-3 p-4">
				<span className="text-[10px] leading-4 text-[var(--faint)]">{session.current ? "Signing out ends access on this device." : "Remove access if you do not recognize it."}</span>
				<button
					type="button"
					onClick={onRevoke}
					disabled={loading}
					className="inline-flex shrink-0 items-center gap-2 rounded-full border border-[#df8585]/25 px-4 py-2.5 text-xs! text-[#e9a0a0] transition hover:bg-[#df8585]/08 disabled:opacity-50"
				>
					<LogOut size={13} />
					{loading ? "Revoking…" : session.current ? "Sign out this device" : "Revoke access"}
				</button>
			</footer>
		</article>
	);
}

function formatDate(value: string) {
	return new Date(value).toLocaleString(undefined, { dateStyle: "medium", timeStyle: "short" });
}
function PanelHeader({ icon, kicker, title, description, id, tone }: { icon: React.ReactNode; kicker: string; title: string; description: string; id?: string; tone?: "danger" }) {
	return (
		<header className={`account-panel-header ${tone === "danger" ? "[&>span]:!bg-[#df8585]/10 [&>span]:!text-[#f2a6a6]" : ""}`}>
			<span>{icon}</span>
			<div>
				<small className={tone === "danger" ? "!text-[#f2a6a6] text-[15px]!" : "text-[15px]!"}>{kicker}</small>
				<h3 className="text-sm!" id={id}>
					{title}
				</h3>
				<p>{description}</p>
			</div>
		</header>
	);
}
function SettingRow({ icon, title, text, checked, onToggle }: { icon: React.ReactNode; title: string; text: string; checked: boolean; onToggle: () => void }) {
	return (
		<div>
			<span className="settings-row-icon">{icon}</span>
			<span>
				<strong>{title}</strong>
				<small>{text}</small>
			</span>
			<button type="button" role="switch" aria-checked={checked} aria-label={title} onClick={onToggle} className={`settings-switch ${checked ? "is-on" : ""}`}>
				<span />
			</button>
		</div>
	);
}
