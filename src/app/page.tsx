import Link from "next/link";
import { ArrowRight, PackageCheck, RotateCcw, ShieldCheck } from "lucide-react";
import { catalog } from "@/lib/catalog";
import { ProductCard } from "@/components/product-card";

export default function HomePage() {
  const featured = catalog.filter((p) => p.featured).slice(0, 4);

  const heroWords = ["Crafted", "for", "life,", "designed", "to", "endure."];

  return (
    <div className="pb-20">
      {/* Canon Bay v2 Animated Hero Section */}
      <section className="relative flex flex-col items-center overflow-hidden px-6 pb-16 pt-8 md:pb-24">
        {/* Ambient Gold Radial Glow Effect */}
        <div className="ambient-glow pointer-events-none absolute -top-24 left-1/2 -translate-x-1/2 w-[700px] h-[700px] rounded-full bg-[radial-gradient(circle,rgba(229,184,105,0.15)_0%,transparent_70%)] blur-3xl" />

        {/* Background Strata Bar Animation & Radial Ellipse */}
        <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden" aria-hidden="true">
          <div className="absolute inset-x-0 top-0 flex h-[62vh] items-end justify-center gap-[2px] opacity-[0.55]">
            {[26, 34, 42, 50, 57, 63, 69, 74, 79, 83, 87, 90, 92, 94, 94, 92, 90, 87, 83, 79, 74, 69, 63, 57, 50, 42, 34, 26].map(
              (height, idx) => (
                <span
                  key={idx}
                  className="strata-bar w-[2.4%] max-w-[46px] rounded-t-[2px]"
                  style={{
                    height: `${height}%`,
                    opacity: 0.1 + (height / 100) * 0.5,
                    animationDelay: `${idx * 45}ms`,
                  }}
                />
              )
            )}
          </div>
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_28%,transparent_18%,var(--color-canvas)_72%)]" />
          <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-b from-transparent to-[var(--canvas)]" />
        </div>

        <div className="relative z-10 mx-auto w-full max-w-[1100px] text-center pt-4 md:pt-8">
          {/* Status Badge Pill */}
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-[var(--accent)]/30 bg-[var(--accent)]/10 px-4 py-1.5 text-xs font-mono tracking-wider text-[var(--accent)] uppercase">
              <ShieldCheck size={14} />
              CURATED COLLECTION · SEASON 2026
            </span>
          </div>

          {/* Animated Masked Heading */}
          <h1 className="flex flex-wrap justify-center gap-x-[0.26em] gap-y-[0.08em] mt-8 text-4xl font-extralight tracking-[-0.04em] text-balance md:text-6xl lg:text-7xl">
            {heroWords.map((word, i) => (
              <span key={i} className="inline-flex overflow-hidden pb-[0.08em]">
                <span className="mask-word text-gradient-gold" style={{ animationDelay: `${120 + i * 65}ms` }}>
                  {word}
                </span>
              </span>
            ))}
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed font-light text-[var(--muted)] md:text-lg">
            A considered collection of technical apparel, precision audio equipment, and modern interior objects. Built to earn their place in your life.
          </p>

          {/* Action Buttons */}
          <div className="mt-10 flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:items-center">
            <Link
              href="/products"
              className="flex w-full items-center justify-center gap-2 rounded-full bg-[var(--accent)] px-8 py-3.5 text-sm font-semibold text-[var(--canvas)] transition-all hover:bg-[#f5d388] active:scale-95 sm:w-auto shadow-[0_0_25px_rgba(229,184,105,0.3)]"
            >
              Explore Collection <ArrowRight size={16} />
            </Link>
            <Link
              href="/signup"
              className="flex w-full items-center justify-center gap-2 rounded-full border border-[var(--line)] bg-[var(--surface)] px-8 py-3.5 text-sm font-medium text-[var(--muted)] transition-all hover:border-[var(--accent)] hover:text-[var(--accent)] active:scale-95 sm:w-auto"
            >
              Get $1,000 Member Credits
            </Link>
          </div>

          {/* Canon Bay Feature Showcase Box v2 */}
          <div className="mt-16 mx-auto max-w-[900px] overflow-hidden rounded-xl border border-[var(--line)] bg-[var(--surface)]/90 backdrop-blur-md shadow-2xl">
            <div className="grid md:grid-cols-2 text-left">
              <div className="p-6 md:p-8 border-b border-[var(--line)] md:border-r md:border-b-0">
                <div className="flex items-center justify-between gap-3">
                  <span className="text-[10px] font-mono tracking-[0.2em] uppercase text-[var(--accent)]">SIGNATURE PIECE</span>
                  <span className="font-mono text-[10px] text-[var(--faint)]">fashion</span>
                </div>
                <p className="mt-3 font-mono text-lg font-light tracking-tight md:text-xl text-[var(--ink)]">Velocity Sneakers</p>
                <p className="mt-3 text-[13px] leading-relaxed font-light text-[var(--muted)]">
                  Ultra-lightweight technical mesh construction with responsive arch support and high-tensile grip.
                </p>
                <div className="mt-5 flex items-center justify-between">
                  <span className="font-mono text-sm font-semibold text-[var(--accent)]">$120.00</span>
                  <Link href="/products/velocity-sneakers" className="text-xs font-mono text-[var(--accent)] hover:underline flex items-center gap-1">
                    View piece <ArrowRight size={12} />
                  </Link>
                </div>
              </div>

              <div className="p-6 md:p-8">
                <div className="flex items-center justify-between gap-3">
                  <span className="text-[10px] font-mono tracking-[0.2em] uppercase text-[var(--accent)]">GUARANTEED QUALITY</span>
                  <span className="font-mono text-[10px] text-[var(--faint)]">integrity</span>
                </div>
                <p className="mt-3 font-mono text-lg font-light tracking-tight md:text-xl text-[var(--accent)]">Masterfully Crafted</p>
                <p className="mt-3 text-[13px] leading-relaxed font-light text-[var(--muted)]">
                  Every item in the Telapsy collection undergoes rigorous quality control and material testing to ensure lasting utility.
                </p>
                <div className="mt-5 flex items-center justify-between">
                  <span className="font-mono text-xs text-[var(--faint)]">Insured Shipping</span>
                  <span className="font-mono text-xs text-[var(--accent)]">30-Day Trial</span>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1 border-t border-[var(--line)] bg-[var(--canvas)]/60 px-5 py-3 text-xs font-light">
              <ShieldCheck size={13} className="text-[var(--accent)]" />
              <span className="text-[10px] font-mono tracking-[0.18em] text-[var(--muted)] uppercase">TELAPSY ARCHIVE</span>
              <span className="text-[var(--faint)]">·</span>
              <span className="font-mono text-[10px] text-[var(--accent)]">UNCOMPROMISING STANDARDS</span>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Highlights Section */}
      <section className="border-y border-[var(--line)] bg-[var(--surface)]/50 py-8">
        <div className="shell grid divide-y divide-[var(--line)] md:grid-cols-3 md:divide-x md:divide-y-0">
          <Trust icon={<PackageCheck size={20} />} title="Complimentary Express Delivery" text="Worldwide insured shipping on every order." />
          <Trust icon={<RotateCcw size={20} />} title="Simple 30-Day Trial" text="Hassle-free decision window & returns." />
          <Trust icon={<ShieldCheck size={20} />} title="256-Bit SSL Checkout" text="Secure transaction & member credit rewards." />
        </div>
      </section>

      {/* Categories Grid (Canon Step Style v2) */}
      <section className="shell py-20">
        <div className="mb-10">
          <p className="eyebrow">Store Departments</p>
          <h2 className="mt-2 text-3xl font-extralight tracking-[-0.03em] md:text-4xl text-[var(--ink)]">Curated Collections</h2>
        </div>
        <div className="grid gap-px overflow-hidden rounded-xl border border-[var(--line)] bg-[var(--line)] md:grid-cols-2 lg:grid-cols-4">
          {[
            { name: "Fashion", count: "10 Products", step: "01", desc: "Technical outerwear and athletic footwear." },
            { name: "Electronics", count: "10 Products", step: "02", desc: "Precision audio, peripherals, and desk lighting." },
            { name: "Home", count: "10 Products", step: "03", desc: "Ceramics, ambient lighting, and textiles." },
            { name: "Accessories", count: "10 Products", step: "04", desc: "Everyday carry bags, timepieces, and eyewear." },
          ].map((cat) => (
            <Link
              key={cat.name}
              href={`/products?category=${cat.name}`}
              className="group bg-[var(--canvas)] p-8 transition-all hover:bg-[var(--surface)] flex flex-col justify-between min-h-[230px]"
            >
              <div>
                <p className="font-mono text-[10px] tracking-[0.2em] text-[var(--faint)] uppercase">DEPT {cat.step}</p>
                <h3 className="mt-2 text-xl font-light tracking-tight text-[var(--ink)] group-hover:text-[var(--accent)] transition-colors">
                  {cat.name}
                </h3>
                <p className="mt-3 text-xs leading-relaxed font-light text-[var(--muted)]">{cat.desc}</p>
              </div>
              <div className="mt-6 flex items-center justify-between text-xs font-mono text-[var(--faint)]">
                <span>{cat.count}</span>
                <ArrowRight size={15} className="transition-transform group-hover:translate-x-1 text-[var(--accent)]" />
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Products Edit */}
      <section className="shell py-12">
        <div className="flex items-end justify-between mb-10">
          <div>
            <p className="eyebrow">Curated Selection</p>
            <h2 className="mt-2 text-3xl font-extralight tracking-[-0.03em] md:text-4xl text-[var(--ink)]">Featured Pieces</h2>
          </div>
          <Link href="/products" className="font-mono text-xs text-[var(--accent)] hover:underline hidden md:block">
            Explore all 40 products →
          </Link>
        </div>
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4 lg:gap-6">
          {featured.map((product) => (
            <ProductCard key={product.slug} product={product} />
          ))}
        </div>
      </section>
    </div>
  );
}

function Trust({ icon, title, text }: { icon: React.ReactNode; title: string; text: string }) {
  return (
    <div className="flex items-center gap-4 px-6 py-4">
      <span className="text-[var(--accent)]">{icon}</span>
      <div>
        <p className="text-sm font-medium text-[var(--ink)]">{title}</p>
        <p className="text-xs font-light text-[var(--muted)]">{text}</p>
      </div>
    </div>
  );
}
