import Link from "next/link";
import Image from "next/image";
import { ArrowRight, PackageCheck, RotateCcw, ShieldCheck } from "lucide-react";
import { catalog } from "@/lib/catalog";
import { ProductCard } from "@/components/product-card";

export default function HomePage() {
  const featured = catalog.filter((p) => p.featured).slice(0, 4);
  return <>
    <section className="shell grid min-h-[650px] items-center gap-10 py-12 lg:grid-cols-[1.05fr_.95fr]">
      <div><p className="eyebrow">New season · considered essentials</p><h1 className="display mt-5 max-w-2xl text-[clamp(4rem,8vw,7.5rem)]">Better things,<br/><em className="font-normal text-[var(--orange)]">chosen well.</em></h1><p className="mt-7 max-w-lg text-lg leading-8 text-[var(--muted)]">A small collection of useful objects, effortless layers, and smart everyday tech—made to earn their place in your life.</p><div className="mt-9 flex flex-wrap gap-3"><Link href="/products" className="btn btn-primary">Shop the collection <ArrowRight size={17}/></Link><Link href="/signup" className="btn btn-secondary">Get $1,000 demo balance</Link></div></div>
      <div className="relative min-h-[540px] overflow-hidden rounded-[40px] bg-[#d9e0c8]"><Image src="/products/fashion.svg" alt="A curated Telapsy fashion selection" fill priority className="object-cover"/><div className="absolute bottom-5 left-5 right-5 rounded-2xl bg-white/90 p-5 backdrop-blur"><p className="eyebrow">Editor’s pick</p><div className="mt-2 flex items-end justify-between"><div className="text-xl font-bold">Velocity Sneakers</div><Link href="/products/velocity-sneakers" className="grid h-10 w-10 place-items-center rounded-full bg-[var(--ink)] text-white" aria-label="View Velocity Sneakers"><ArrowRight size={18}/></Link></div></div></div>
    </section>
    <section className="border-y border-[var(--line)] bg-white/50"><div className="shell grid divide-y divide-[var(--line)] py-6 md:grid-cols-3 md:divide-x md:divide-y-0"><Trust icon={<PackageCheck/>} title="Delivery is on us" text="Free shipping, every order."/><Trust icon={<RotateCcw/>} title="Easy decisions" text="Clear details and simple returns."/><Trust icon={<ShieldCheck/>} title="Demo-safe checkout" text="No real card details are collected."/></div></section>
    <section className="shell py-24"><div className="flex items-end justify-between"><div><p className="eyebrow">Worth a closer look</p><h2 className="display mt-3 text-5xl">This week’s edit</h2></div><Link href="/products" className="hidden text-sm font-bold underline md:block">See all 40 products</Link></div><div className="mt-10 grid grid-cols-2 gap-x-4 gap-y-10 lg:grid-cols-4 lg:gap-6">{featured.map((product) => <ProductCard key={product.slug} product={product}/>)}</div></section>
    <section className="shell grid gap-4 md:grid-cols-4">{["Fashion","Electronics","Home","Accessories"].map((category, index) => <Link key={category} href={`/products?category=${category}`} className={`group relative overflow-hidden rounded-3xl bg-[${index % 2 ? '#dce3d7' : '#edd9cb'}] p-7 min-h-52 border border-[var(--line)]`}><span className="eyebrow">0{index+1}</span><h3 className="display mt-16 text-3xl">{category}</h3><ArrowRight className="absolute bottom-7 right-7 transition group-hover:translate-x-1"/></Link>)}</section>
  </>;
}

function Trust({ icon, title, text }: { icon: React.ReactNode; title: string; text: string }) { return <div className="flex items-center gap-4 px-7 py-4 first:pl-0"><span className="text-[var(--forest)]">{icon}</span><div><p className="font-bold">{title}</p><p className="text-sm text-[var(--muted)]">{text}</p></div></div>; }
