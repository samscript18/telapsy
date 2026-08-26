"use client";

import Image from "next/image";
import Link from "next/link";
import { Check, Minus, Plus, ShieldCheck, Star } from "lucide-react";
import { useState } from "react";
import { formatMoney } from "@/lib/pricing";
import { useCart } from "@/store/cart";
import type { ProductData } from "@/types";

export function ProductDetails({ product }: { product: ProductData }) {
  const [quantity, setQuantity] = useState(1); const [added, setAdded] = useState(false); const addItem = useCart((s)=>s.addItem);
  const add = () => { addItem(product, quantity); setAdded(true); setTimeout(()=>setAdded(false), 1800); };
  return <div className="grid gap-10 lg:grid-cols-2 lg:gap-16"><div className="relative aspect-[4/5] overflow-hidden rounded-[36px] border border-[var(--line)] bg-[#e8e5db]"><Image src={product.image} alt={product.name} fill priority className="object-cover" sizes="50vw"/></div>
    <div className="flex flex-col justify-center"><Link href={`/products?category=${product.category}`} className="eyebrow">{product.category}</Link><h1 className="display mt-4 text-6xl lg:text-7xl">{product.name}</h1><div className="mt-5 flex items-center gap-5"><strong className="text-2xl">{formatMoney(product.priceCents)}</strong><span className="flex items-center gap-1 text-sm text-[var(--muted)]"><Star size={15} fill="currentColor"/> {product.rating} · {product.reviewCount} reviews</span></div><p className="mt-7 max-w-xl text-lg leading-8 text-[var(--muted)]">{product.description}</p><div className="mt-7 flex items-center gap-2 text-sm font-bold text-[var(--forest)]"><Check size={17}/> In stock — {product.stock} ready to ship</div>
      <div className="mt-9 flex flex-wrap gap-3"><div className="flex h-[50px] items-center rounded-full border border-[var(--line)] bg-white"><button onClick={()=>setQuantity((q)=>Math.max(1,q-1))} disabled={quantity===1} className="grid h-full w-12 place-items-center disabled:opacity-30" aria-label="Decrease quantity"><Minus size={17}/></button><output aria-label="Quantity" className="w-9 text-center font-bold">{quantity}</output><button onClick={()=>setQuantity((q)=>Math.min(product.stock,q+1))} disabled={quantity===product.stock} className="grid h-full w-12 place-items-center disabled:opacity-30" aria-label="Increase quantity"><Plus size={17}/></button></div><button onClick={add} className="btn btn-primary min-w-64">{added ? <><Check size={18}/> Added to bag</> : `Add ${quantity} to bag`}</button></div>
      <div className="mt-9 grid gap-3 border-t border-[var(--line)] pt-6 text-sm text-[var(--muted)]"><p className="flex gap-3"><ShieldCheck size={18}/> Secure demo checkout—no real payment data.</p><p>Free delivery · Simple returns · Ships in 1–2 demo days</p></div>
    </div></div>;
}
