"use client";

import { useQuery } from "@tanstack/react-query";
import { Search, X } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { ProductCard } from "@/components/product-card";
import { CATEGORIES, type ProductData } from "@/types";

export function ProductsClient() {
  const params = useSearchParams();
  const router = useRouter();
  const [search, setSearch] = useState(params.get("search") ?? "");
  const category = params.get("category") ?? "All";

  const { data, isLoading } = useQuery<{ products: ProductData[]; count: number }>({
    queryKey: ["products", search, category],
    queryFn: () => fetch(`/api/products?search=${encodeURIComponent(search)}&category=${encodeURIComponent(category)}`).then((r) => r.json()),
  });

  useEffect(() => {
    const next = new URLSearchParams();
    if (search) next.set("search", search);
    if (category !== "All") next.set("category", category);
    const timer = setTimeout(() => router.replace(`/products${next.size ? `?${next}` : ""}`, { scroll: false }), 250);
    return () => clearTimeout(timer);
  }, [search, category, router]);

  const setCategory = (value: string) => {
    const next = new URLSearchParams(params);
    if (value === "All") next.delete("category");
    else next.set("category", value);
    router.replace(`/products${next.size ? `?${next}` : ""}`, { scroll: false });
  };

  return (
    <div className="shell py-12">
      <div className="max-w-2xl">
        <p className="eyebrow">THE ARCHIVE</p>
        <h1 className="mt-3 text-4xl font-extralight tracking-[-0.04em] text-[var(--ink)] md:text-6xl">
          Discover your next essential.
        </h1>
        <p className="mt-4 text-base font-light leading-relaxed text-[var(--muted)]">
          Forty masterfully crafted pieces across 4 signature departments. Curated for timeless utility and design excellence.
        </p>
      </div>

      <div className="mt-10 flex flex-col gap-4 border-y border-[var(--line)] py-6 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-wrap gap-2">
          {["All", ...CATEGORIES].map((item) => (
            <button
              key={item}
              onClick={() => setCategory(item)}
              aria-pressed={category === item}
              className={`rounded-full border px-4 py-2 text-xs font-light tracking-wide transition-all ${
                category === item
                  ? "border-[var(--accent)] bg-[var(--accent)]/10 text-[var(--accent)]"
                  : "border-[var(--line)] bg-[var(--surface)] text-[var(--muted)] hover:border-[var(--line-strong)] hover:text-[var(--ink)]"
              }`}
            >
              {item}
            </button>
          ))}
        </div>

        <label className="relative block md:w-80">
          <span className="sr-only">Search products</span>
          <Search className="absolute left-4 top-3.5 text-[var(--faint)]" size={17} />
          <input
            className="field !pl-11 !pr-10 text-xs"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search archive by keyword…"
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              className="absolute right-3 top-3 text-[var(--faint)] hover:text-[var(--ink)]"
              aria-label="Clear search"
            >
              <X size={16} />
            </button>
          )}
        </label>
      </div>

      <div className="mt-6 flex items-center justify-between text-xs font-mono text-[var(--faint)]">
        <span>{isLoading ? "Loading collection…" : `${data?.count ?? 0} pieces available`}</span>
        {category !== "All" && <span className="text-[var(--accent)]">Department: {category}</span>}
      </div>

      {!isLoading && data?.products.length === 0 ? (
        <div className="mt-12 rounded-xl border border-[var(--line)] bg-[var(--surface)] py-20 text-center">
          <h2 className="text-2xl font-extralight text-[var(--ink)]">No products match your query.</h2>
          <p className="mt-3 text-sm font-light text-[var(--muted)]">Try adjusting your search terms or filter selection.</p>
          <button
            className="btn btn-secondary mt-6"
            onClick={() => {
              setSearch("");
              setCategory("All");
            }}
          >
            Clear all filters
          </button>
        </div>
      ) : (
        <div className="mt-8 grid grid-cols-2 gap-4 lg:grid-cols-4 lg:gap-6">
          {data?.products.map((product) => (
            <ProductCard key={product.slug} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
