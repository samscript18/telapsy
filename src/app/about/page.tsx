import { ArrowRight, BadgeCheck, Calculator, ScanSearch, ShieldCheck } from "lucide-react";
import Link from "next/link";

const principles = [
  { icon: ScanSearch, title: "Real browser evidence", text: "KaneAI navigates the same storefront shoppers use and checks complete user journeys." },
  { icon: Calculator, title: "Consistent commerce", text: "Prices, promotions, checkout totals, balances, and orders share one authoritative calculation." },
  { icon: ShieldCheck, title: "Built to repair", text: "When verification reveals a legitimate regression, the evidence guides a focused code repair and rerun." },
];

export default function AboutPage() {
  return <div className="overflow-hidden pb-20"><section className="shell relative py-16 sm:py-24 lg:py-32"><div className="hero-grid pointer-events-none absolute inset-0"/><div className="relative max-w-4xl" data-reveal><p className="eyebrow flex items-center gap-2"><BadgeCheck size={14}/> About Telapsy</p><h1 className="mt-6 text-[clamp(3.7rem,10vw,8rem)] font-extralight leading-[0.84] tracking-[-0.075em]">A store that proves what it ships.</h1><p className="mt-8 max-w-2xl text-base font-light leading-8 text-[var(--muted)] sm:text-lg">Telapsy is an AI-verified commerce experience. It pairs deliberate product design with a real Codex-to-KaneAI verification loop, so critical shopping journeys are tested in an actual browser.</p><div className="mt-9 flex flex-col gap-3 sm:flex-row"><Link href="/products" className="btn btn-primary">Try now <ArrowRight size={16}/></Link><Link href="/signup" className="btn btn-secondary">Sign up</Link></div></div></section><section className="shell grid gap-4 border-t border-[var(--line)] pt-12 md:grid-cols-3">{principles.map(({ icon: Icon, title, text }, index) => <article key={title} data-reveal style={{ "--reveal-delay": `${index * 80}ms` } as React.CSSProperties} className="rounded-2xl border border-[var(--line)] bg-white/[0.025] p-6 sm:p-8"><Icon className="text-[var(--accent)]"/><h2 className="mt-8 text-2xl font-light tracking-[-0.035em]">{title}</h2><p className="mt-3 text-sm font-light leading-7 text-[var(--muted)]">{text}</p></article>)}</section></div>;
}
