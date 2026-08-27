import Image from "next/image";
import Link from "next/link";
import { ArrowRight, AudioLines, BellRing, ChevronDown, CircleCheck, PackageCheck, RotateCcw, Search, ShieldCheck, Sparkles, WalletCards } from "lucide-react";
import { ProductCard } from "@/components/product-card";
import { catalog } from "@/lib/catalog";
import { getSessionUserId } from "@/lib/auth";

const categories = [
	{ name: "Fashion", count: "10 pieces", step: "01", desc: "Technical forms for motion and everyday rituals." },
	{ name: "Electronics", count: "10 pieces", step: "02", desc: "Precision audio and considered desk technology." },
	{ name: "Home", count: "10 pieces", step: "03", desc: "Quiet objects that reshape the atmosphere of a room." },
	{ name: "Accessories", count: "10 pieces", step: "04", desc: "Everyday carry, refined down to its essentials." },
];

const trustItems = ["Complimentary express delivery", "30-day decision window", "40 considered objects", "Secure simulated checkout", "Twenty percent off with KANE", "Member balance included"];

const faqs = [
	{ question: "What is Telapsy?", answer: "Telapsy is an AI-verified e-commerce experience with forty considered products across Fashion, Electronics, Home, and Accessories." },
	{ question: "How does the $1,000 Telapsy Balance work?", answer: "Every new account receives $1,000.00 in fictional Telapsy credits. You can use them during checkout, and your balance updates after each successful order." },
	{ question: "Can I use a promo code?", answer: "Yes. Enter KANE or KANE2026 in your cart to receive 20% off the merchandise subtotal. The discount carries through checkout and appears in your order record." },
	{ question: "Are payments and card details real?", answer: "No. Telapsy uses a clearly simulated payment experience for demonstration purposes. It never connects to a payment provider or stores real card information." },
	{ question: "Where can I follow my order?", answer: "After checkout, your confirmation is saved to My Orders. You will also receive private updates in your Telapsy notification center." },
	{ question: "What does AI-verified mean?", answer: "Telapsy’s critical shopping journeys are checked in a real browser with KaneAI, helping the development agent find, diagnose, and repair genuine regressions before shipping." },
];

export default async function HomePage() {
	const authenticated = Boolean(await getSessionUserId());
	const featured = catalog.filter((product) => product.featured).slice(0, 4);
	const signature = catalog.find((product) => product.slug === "velocity-sneakers") ?? featured[0];
	const heroWords = ["Objects", "with", "gravity."];

	return (
		<div className="overflow-hidden pb-20">
			<section className="relative min-h-[calc(100vh-7rem)] border-b border-[var(--line)]">
				<div className="hero-grid pointer-events-none absolute inset-0" aria-hidden="true" />
				<div className="ambient-glow pointer-events-none absolute -left-40 top-0 h-[620px] w-[620px] rounded-full bg-[radial-gradient(circle,rgba(232,185,106,0.15),transparent_68%)] blur-3xl" />

				<div className="shell relative grid min-h-[calc(100vh-7rem)] items-center gap-10 py-10 lg:grid-cols-[1.02fr_0.98fr] lg:py-6">
					<div className="relative z-10 py-8 lg:py-12">
						<div className="hero-intro inline-flex items-center gap-2 rounded-full border border-[var(--accent)]/25 bg-[var(--accent)]/[0.07] px-4 py-2 font-mono text-[10px] tracking-[0.19em] text-[var(--accent)] uppercase backdrop-blur-xl">
							<Sparkles size={13} /> The 2026 considered collection
						</div>

						<h1 className="mt-7 max-w-[760px] text-[clamp(4.5rem,10vw,8.5rem)] font-extralight leading-[0.78] tracking-[-0.075em]">
							{heroWords.map((word, index) => (
								<span key={word} className="block overflow-hidden pb-[0.12em]">
									<span className={`mask-word block ${index === 2 ? "text-gradient-gold" : "text-[var(--ink)]"}`} style={{ animationDelay: `${120 + index * 110}ms` }}>
										{word}
									</span>
								</span>
							))}
						</h1>

						<div className="mt-6 grid max-w-2xl gap-6 sm:grid-cols-[1fr_auto] sm:items-end">
							<p className="max-w-xl text-base font-light leading-relaxed text-[var(--muted)] md:text-lg">
								Technical apparel, precision electronics, and modern objects selected for presence, utility, and a life beyond trends.
							</p>
							<span className="hidden h-16 w-px bg-gradient-to-b from-transparent via-[var(--accent)] to-transparent sm:block" />
						</div>

						<div className="mt-8 flex flex-col gap-3 sm:flex-row">
							<Link href={authenticated ? "/dashboard/products" : "/signup"} className="btn btn-primary min-h-12 px-7">
								Try now <ArrowRight size={16} />
							</Link>
						</div>

						<form
							action={authenticated ? "/dashboard/products" : "/products"}
							className="mt-6 flex max-w-xl items-center rounded-full border border-white/10 bg-white/[0.035] p-1.5 backdrop-blur-xl transition focus-within:border-[var(--accent)]/50"
						>
							<Search className="ml-3 text-[var(--faint)]" size={17} aria-hidden="true" />
							<label htmlFor="hero-search" className="sr-only">
								Search the Telapsy collection
							</label>
							<input
								id="hero-search"
								name="search"
								placeholder="Search forty considered pieces"
								className="min-w-0 flex-1 bg-transparent px-3 py-2 text-sm outline-none placeholder:text-[var(--faint)]"
							/>
							<button className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-[var(--accent)] text-[var(--canvas)] transition hover:scale-105" aria-label="Search products">
								<ArrowRight size={16} />
							</button>
						</form>

						<div className="mt-7 flex flex-wrap gap-x-7 gap-y-3 font-mono text-[10px] tracking-[0.12em] text-[var(--faint)] uppercase">
							<span className="flex items-center gap-2">
								<span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_10px_#4ade80]" />
								40 pieces online
							</span>
							<span>Four departments</span>
							<span>Free delivery</span>
						</div>
					</div>

					<div className="kinetic-stage hidden lg:block" aria-label={`Featured product: ${signature.name}`}>
						<div className="orbit-ring" aria-hidden="true" />
						<div className="orbit-ring orbit-ring-secondary" aria-hidden="true" />
						<Link href={authenticated ? `/dashboard/products/${signature.slug}` : `/signin?next=${encodeURIComponent(`/dashboard/products/${signature.slug}`)}`} className="artifact-frame group">
							<Image src={signature.image} alt={signature.name} fill priority className="object-cover transition duration-1000 group-hover:scale-110" sizes="(min-width: 1024px) 44vw, 0vw" />
							<span className="absolute inset-x-0 bottom-0 z-10 bg-gradient-to-t from-black via-black/70 to-transparent px-8 pb-8 pt-28">
								<span className="block font-mono text-[10px] tracking-[0.18em] text-[var(--accent)] uppercase">Signature / 001</span>
								<span className="mt-2 flex items-end justify-between gap-4">
									<span className="text-2xl font-light tracking-[-0.03em]">{signature.name}</span>
									<span className="font-mono text-sm text-[var(--accent-bright)]">${(signature.priceCents / 100).toFixed(2)}</span>
								</span>
							</span>
						</Link>
						<div className="float-chip left-0 top-[24%] px-4 py-3">
							<span className="flex items-center gap-2 font-mono text-[10px] tracking-[0.15em] text-[var(--accent)] uppercase">
								<ShieldCheck size={13} /> quality verified
							</span>
						</div>
						<div className="float-chip bottom-[16%] right-0 px-4 py-3">
							<span className="block font-mono text-[9px] tracking-[0.15em] text-[var(--faint)] uppercase">Member price</span>
							<span className="mt-1 block text-sm text-[var(--ink)]">20% off with KANE</span>
						</div>
					</div>
				</div>
			</section>

			<section className="overflow-hidden border-b border-[var(--line)] bg-[var(--accent)] text-[var(--canvas)]" aria-label="Store benefits">
				<div className="marquee-track py-3.5 font-mono text-[10px] font-semibold tracking-[0.15em] uppercase">
					{[...trustItems, ...trustItems].map((item, index) => (
						<span key={`${item}-${index}`} className="flex items-center gap-6 px-6">
							{item}
							<span aria-hidden="true">✦</span>
						</span>
					))}
				</div>
			</section>

			<section className="shell py-24 lg:py-32">
				<div data-reveal className="grid gap-8 border-b border-[var(--line)] pb-10 md:grid-cols-[1fr_0.75fr] md:items-end">
					<div>
						<p className="eyebrow">Four worlds, one point of view</p>
						<h2 className="mt-4 max-w-3xl text-4xl font-extralight leading-[0.95] tracking-[-0.055em] md:text-6xl">Find the object that changes the room.</h2>
					</div>
					<p className="max-w-lg text-sm font-light leading-7 text-[var(--muted)] md:justify-self-end">Each department is intentionally small: ten pieces, no filler, every detail visible before you commit.</p>
				</div>

				<div className="mt-10 grid gap-px overflow-hidden rounded-2xl border border-[var(--line)] bg-[var(--line)] md:grid-cols-2">
					{categories.map((category, index) => (
						<Link
							key={category.name}
							href={`${authenticated ? "/dashboard/products" : "/products"}?category=${category.name}`}
							data-reveal
							style={{ "--reveal-delay": `${index * 80}ms` } as React.CSSProperties}
							className="group relative min-h-[280px] overflow-hidden bg-[var(--canvas)] p-8 transition-colors duration-500 hover:bg-[var(--surface)] md:p-10"
						>
							<span className="absolute -right-3 -top-9 font-mono text-[9rem] font-bold leading-none text-white/[0.025] transition duration-700 group-hover:translate-y-3 group-hover:text-[var(--accent)]/[0.05]">
								{category.step}
							</span>
							<span className="relative flex h-full flex-col justify-between">
								<span>
									<span className="font-mono text-[10px] tracking-[0.2em] text-[var(--faint)] uppercase">Department {category.step}</span>
									<span className="mt-5 block text-3xl font-extralight tracking-[-0.045em] transition-transform duration-500 group-hover:translate-x-2 group-hover:text-[var(--accent-bright)]">
										{category.name}
									</span>
									<span className="mt-4 block max-w-sm text-sm font-light leading-6 text-[var(--muted)]">{category.desc}</span>
								</span>
								<span className="mt-10 flex items-center justify-between font-mono text-[10px] tracking-[0.12em] text-[var(--faint)] uppercase">
									{category.count}
									<ArrowRight size={17} className="text-[var(--accent)] transition-transform duration-500 group-hover:translate-x-2" />
								</span>
							</span>
						</Link>
					))}
				</div>
			</section>

			<section className="border-y border-[var(--line)] bg-white/[0.018] py-20 lg:py-28">
				<div className="shell">
					<div data-reveal className="flex items-end justify-between gap-6">
						<div>
							<p className="eyebrow">Objects in focus</p>
							<h2 className="mt-3 text-4xl font-extralight tracking-[-0.05em] md:text-6xl">The current edit.</h2>
						</div>
						<Link href={authenticated ? "/dashboard/products" : "/products"} className="group hidden items-center gap-2 font-mono text-xs text-[var(--accent)] md:flex">
							All forty pieces <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
						</Link>
					</div>
					<div className="mt-10 grid grid-cols-2 gap-4 lg:grid-cols-4 lg:gap-6">
						{featured.map((product, index) => (
							<div key={product.slug} data-reveal style={{ "--reveal-delay": `${index * 90}ms` } as React.CSSProperties}>
								<ProductCard product={product} authenticated={authenticated} />
							</div>
						))}
					</div>
				</div>
			</section>

			<section className="shell py-24 lg:py-32">
				<div data-reveal className="grid gap-8 lg:grid-cols-[.82fr_1.18fr] lg:items-end">
					<div><p className="eyebrow">From discovery to delivery</p><h2 className="mt-4 text-4xl font-extralight leading-[.96] tracking-[-.055em] md:text-6xl">A smoother way to find what lasts.</h2></div>
					<p className="max-w-xl text-sm font-light leading-7 text-[var(--muted)] lg:justify-self-end">Telapsy keeps the entire decision in one place—from a tightly edited catalogue to live totals, clear order status, and a personal notification trail.</p>
				</div>
				<div className="mt-12 grid gap-4 md:grid-cols-3">
					<JourneyStep step="01" icon={<Search size={20}/>} title="Discover deliberately" text="Search forty considered products or move through four focused departments." />
					<JourneyStep step="02" icon={<WalletCards size={20}/>} title="Checkout your way" text="Use Telapsy credits or a clearly simulated card, with totals recalculated securely." />
					<JourneyStep step="03" icon={<BellRing size={20}/>} title="Stay in the loop" text="See private confirmations and order updates in your personal notification center." />
				</div>
			</section>

			<section className="border-y border-[var(--line)] bg-[linear-gradient(120deg,rgba(232,185,106,.07),rgba(255,255,255,.015))] py-20">
				<div className="shell grid gap-10 lg:grid-cols-[1fr_auto] lg:items-center">
					<div data-reveal><p className="eyebrow">Confidence built into every screen</p><h2 className="mt-4 max-w-3xl text-4xl font-extralight tracking-[-.05em] md:text-5xl">The details agree—from cart to confirmation.</h2><p className="mt-5 max-w-2xl text-sm font-light leading-7 text-[var(--muted)]">Prices are confirmed on the server, payment is simulated safely, and every order preserves exactly what you purchased.</p></div>
					<div data-reveal className="grid min-w-[280px] gap-3 sm:grid-cols-3 lg:grid-cols-1">
						{["Authoritative totals", "Private account activity", "Immutable order history"].map((item) => <div key={item} className="flex items-center gap-3 rounded-2xl border border-white/10 bg-black/20 px-5 py-4 text-xs text-[var(--muted)]"><CircleCheck size={17} className="text-[var(--accent)]"/>{item}</div>)}
					</div>
				</div>
			</section>

			<section className="shell py-24 lg:py-32" aria-labelledby="faq-title">
				<div className="grid gap-10 lg:grid-cols-[.72fr_1.28fr] lg:gap-20">
					<div data-reveal className="lg:sticky lg:top-32 lg:self-start">
						<p className="eyebrow">Questions, answered</p>
						<h2 id="faq-title" className="mt-4 text-4xl font-extralight leading-[.96] tracking-[-.055em] md:text-6xl">Everything before you begin.</h2>
						<p className="mt-5 max-w-md text-sm font-light leading-7 text-[var(--muted)]">The useful details about credits, checkout, orders, and how Telapsy earns its verified mark.</p>
						<Link href={authenticated ? "/dashboard/products" : "/signup"} className="group mt-7 inline-flex items-center gap-2 text-xs text-[var(--accent)] transition hover:text-[var(--accent-bright)]">Try Telapsy <ArrowRight size={14} className="transition-transform group-hover:translate-x-1"/></Link>
					</div>
					<div data-reveal className="overflow-hidden rounded-[1.7rem] border border-white/10 bg-white/[.02] px-5 sm:px-7">
						{faqs.map((faq, index) => <details key={faq.question} className="group border-b border-white/10 py-1 last:border-b-0">
							<summary className="flex min-h-20 cursor-pointer list-none items-center justify-between gap-5 py-5 text-left text-base font-light tracking-[-.02em] text-[var(--ink)] marker:content-none sm:text-lg">
								<span className="flex items-center gap-4"><span className="font-mono text-[9px] tracking-[.14em] text-[var(--accent)]">{String(index + 1).padStart(2, "0")}</span>{faq.question}</span>
								<span className="grid size-9 shrink-0 place-items-center rounded-full border border-white/10 bg-white/[.035] text-[var(--faint)] transition duration-300 group-open:rotate-180 group-open:border-[var(--accent)]/30 group-open:text-[var(--accent)]"><ChevronDown size={15}/></span>
							</summary>
							<div className="faq-answer-grid"><p className="max-w-2xl pb-6 pl-9 pr-12 text-sm font-light leading-7 text-[var(--muted)]">{faq.answer}</p></div>
						</details>)}
					</div>
				</div>
			</section>

			<section className="shell py-24 lg:py-32">
				<div
					data-reveal
					className="relative overflow-hidden rounded-[2rem] border border-[var(--accent)]/20 bg-[linear-gradient(120deg,rgba(232,185,106,0.12),rgba(255,255,255,0.025)_45%,rgba(232,185,106,0.06))] px-7 py-14 md:px-14 lg:px-20 lg:py-20"
				>
					<div className="ambient-glow pointer-events-none absolute -right-28 -top-36 h-96 w-96 rounded-full bg-[var(--accent)]/10 blur-3xl" />
					<div className="relative grid gap-10 lg:grid-cols-[1fr_auto] lg:items-end">
						<div>
							<p className="eyebrow">Membership, without the theatre</p>
							<h2 className="mt-4 max-w-3xl text-4xl font-extralight leading-[0.98] tracking-[-0.055em] md:text-6xl">Start with a thousand reasons to explore.</h2>
							<p className="mt-5 max-w-2xl text-sm font-light leading-7 text-[var(--muted)]">
								Create an account and receive $1,000.00 in fictional Telapsy Balance for the complete demo shopping experience.
							</p>
						</div>
						<Link href="/signup" className="btn btn-primary min-h-12 whitespace-nowrap">
							Sign up <ArrowRight size={16} />
						</Link>
					</div>
					<div className="relative mt-12 grid gap-4 border-t border-white/10 pt-7 sm:grid-cols-3">
						<Trust icon={<PackageCheck size={18} />} title="Express delivery" text="Insured and complimentary." />
						<Trust icon={<RotateCcw size={18} />} title="30-day window" text="Take time to decide." />
						<Trust icon={<AudioLines size={18} />} title="Instant confirmation" text="Every detail stays consistent." />
					</div>
				</div>
			</section>
		</div>
	);
}

function Trust({ icon, title, text }: { icon: React.ReactNode; title: string; text: string }) {
	return (
		<div className="flex items-start gap-3">
			<span className="mt-0.5 text-[var(--accent)]">{icon}</span>
			<span>
				<span className="block text-sm font-medium text-[var(--ink)]">{title}</span>
				<span className="mt-1 block text-xs font-light text-[var(--muted)]">{text}</span>
			</span>
		</div>
	);
}

function JourneyStep({ step, icon, title, text }: { step: string; icon: React.ReactNode; title: string; text: string }) {
	return <article data-reveal className="group relative min-h-64 overflow-hidden rounded-[1.6rem] border border-white/10 bg-white/[.025] p-7 transition duration-500 hover:-translate-y-1 hover:border-[var(--accent)]/35">
		<span className="absolute -right-2 -top-7 font-mono text-8xl font-bold text-white/[.025] transition group-hover:text-[var(--accent)]/[.055]">{step}</span>
		<span className="grid size-12 place-items-center rounded-2xl border border-[var(--accent)]/20 bg-[var(--accent)]/10 text-[var(--accent)]">{icon}</span>
		<h3 className="mt-10 text-xl font-light tracking-[-.035em]">{title}</h3><p className="mt-3 text-xs font-light leading-6 text-[var(--muted)]">{text}</p>
	</article>;
}
