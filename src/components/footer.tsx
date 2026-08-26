import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-[var(--line)] px-6 py-10">
      <div className="mx-auto flex max-w-[1100px] flex-col gap-4 text-xs font-light text-[var(--faint)] sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <span className="font-light tracking-[-0.03em] text-[var(--ink)] text-sm">TELAPSY</span>
          <span>·</span>
          <span>Luxury Essentials & Modern Architecture</span>
        </div>
        <div className="flex flex-wrap items-center gap-4 text-xs">
          <Link href="/products" className="hover:text-[var(--ink)] transition-colors">Shop All</Link>
          <Link href="/cart" className="hover:text-[var(--ink)] transition-colors">Bag</Link>
          <Link href="/orders" className="hover:text-[var(--ink)] transition-colors">My Orders</Link>
          <Link href="/account" className="hover:text-[var(--ink)] transition-colors">Member Credits</Link>
          <span className="font-mono text-[10px] text-[var(--accent)]">Season 2026 · Curated Archive</span>
        </div>
      </div>
    </footer>
  );
}
