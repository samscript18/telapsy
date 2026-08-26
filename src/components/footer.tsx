import Link from "next/link";

export function Footer() {
  return <footer className="mt-24 bg-[var(--ink)] py-14 text-white"><div className="shell grid gap-10 md:grid-cols-[1.5fr_1fr_1fr]">
    <div><div className="text-3xl font-black tracking-[-.08em]">TELAPSY<span className="text-[var(--orange)]">.</span></div><p className="mt-4 max-w-sm text-sm leading-6 text-white/60">Useful, well-made things for the way you live now. Fictional products, genuinely delightful shopping.</p></div>
    <div><p className="eyebrow !text-white/40">Explore</p><div className="mt-4 grid gap-3 text-sm"><Link href="/products">Shop all</Link><Link href="/cart">Your bag</Link><Link href="/orders">My orders</Link></div></div>
    <div><p className="eyebrow !text-white/40">Account</p><div className="mt-4 grid gap-3 text-sm"><Link href="/signup">Create account</Link><Link href="/signin">Sign in</Link><Link href="/account">Telapsy Balance</Link></div></div>
  </div></footer>;
}
