import { BadgeCheck } from "lucide-react";

export function Footer() {
	return (
		<footer className="relative overflow-hidden border-t border-[var(--line)] px-5 py-4 sm:px-6 sm:py-6">
			<div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[var(--accent)]/50 to-transparent" />
			<div className="mx-auto flex max-w-[1180px] flex-col gap-5 text-xs font-light text-[var(--faint)] sm:flex-row sm:items-center sm:justify-between">
				<div className="flex flex-wrap items-center gap-3">
					<span className="text-sm font-light tracking-[-0.03em] text-[var(--ink)]">TELAPSY</span>
					<span>·</span>
					<span>Luxury Essentials &amp; Modern Architecture</span>
				</div>
				<p className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.14em] text-[var(--accent)]">
					<BadgeCheck size={15} aria-hidden="true" /> Verified and tested by KaneAI
				</p>
			</div>
		</footer>
	);
}
