"use client";

import { useQuery } from "@tanstack/react-query";
import { Search, X } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { ProductCard } from "@/components/product-card";
import { CATEGORIES, type ProductData } from "@/types";

export function ProductsClient() {
  const params = useSearchParams(); const router = useRouter();
  const [search, setSearch] = useState(params.get("search") ?? "");
  const category = params.get("category") ?? "All";
  const { data, isLoading } = useQuery<{ products: ProductData[]; count: number }>({ queryKey: ["products", search, category], queryFn: () => fetch(`/api/products?search=${encodeURIComponent(search)}&category=${encodeURIComponent(category)}`).then((r) => r.json()) });
  useEffect(() => { const next = new URLSearchParams(); if (search) next.set("search", search); if (category !== "All") next.set("category", category); const timer = setTimeout(() => router.replace(`/products${next.size ? `?${next}` : ""}`, { scroll: false }), 250); return () => clearTimeout(timer); }, [search, category, router]);
  const setCategory = (value: string) => { const next = new URLSearchParams(params); if (value === "All") next.delete("category"); else next.set("category", value); router.replace(`/products${next.size ? `?${next}` : ""}`, { scroll: false }); };
  return <div className="shell py-16"><div className="max-w-2xl"><p className="eyebrow">The full collection</p><h1 className="display mt-3 text-6xl">Find your next favorite.</h1><p className="mt-5 text-[var(--muted)]">Forty considered products. No endless scroll, just good choices.</p></div>
    <div className="mt-10 flex flex-col gap-4 border-y border-[var(--line)] py-5 md:flex-row md:items-center md:justify-between"><div className="flex flex-wrap gap-2">{["All",...CATEGORIES].map((item) => <button key={item} onClick={() => setCategory(item)} aria-pressed={category===item} className={`rounded-full border px-4 py-2 text-sm font-bold ${category===item ? "border-[var(--forest)] bg-[var(--forest)] text-white" : "border-[var(--line)] bg-white"}`}>{item}</button>)}</div><label className="relative block md:w-80"><span className="sr-only">Search products</span><Search className="absolute left-4 top-3.5" size={18}/><input className="field !pl-11 !pr-10" value={search} onChange={(e)=>setSearch(e.target.value)} placeholder="Search products…"/>{search && <button onClick={()=>setSearch("")} className="absolute right-3 top-3" aria-label="Clear search"><X/></button>}</label></div>
    <div className="mt-6 flex justify-between text-sm"><span className="text-[var(--muted)]">{isLoading ? "Finding products…" : `${data?.count ?? 0} products`}</span>{category!=="All" && <strong>Filtered by {category}</strong>}</div>
    {!isLoading && data?.products.length === 0 ? <div className="card mt-10 py-20 text-center"><h2 className="display text-4xl">Nothing hiding here.</h2><p className="mt-3 text-[var(--muted)]">Try another search or clear your filters.</p><button className="btn btn-secondary mt-6" onClick={()=>{setSearch("");setCategory("All")}}>Clear filters</button></div> : <div className="mt-8 grid grid-cols-2 gap-x-4 gap-y-10 lg:grid-cols-4 lg:gap-6">{data?.products.map((product)=><ProductCard key={product.slug} product={product}/>)}</div>}
  </div>;
}
