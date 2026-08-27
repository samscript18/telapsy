"use client";

import { useQuery } from "@tanstack/react-query";
import { ChevronLeft, ChevronRight, Search, X } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { ProductCard } from "@/components/product-card";
import { CATEGORIES, type ProductData, type SessionUser } from "@/types";

const PAGE_SIZE = 12;

export function ProductsClient({ authenticated = false }: { authenticated?: boolean }) {
  const params = useSearchParams();
  const router = useRouter();
  const [search, setSearch] = useState(params.get("search") ?? "");
  const category = params.get("category") ?? "All";
  const page = Math.max(1, Number(params.get("page") ?? "1") || 1);

  const { data: session } = useQuery<{ user: SessionUser | null }>({
    queryKey: ["me"],
    queryFn: async () => { const response = await fetch("/api/auth/me"); return response.ok ? response.json() : { user: null }; },
    retry: false,
  });

  const { data, isLoading } = useQuery<{ products: ProductData[]; count: number }>({
    queryKey: ["products", search, category, page],
    queryFn: () => fetch(`/api/products?search=${encodeURIComponent(search)}&category=${encodeURIComponent(category)}&page=${page}&limit=${PAGE_SIZE}`).then((r) => r.json()),
  });

  useEffect(() => {
    const next = new URLSearchParams();
    if (search) next.set("search", search);
    if (category !== "All") next.set("category", category);
    if (page > 1) next.set("page", String(page));
    const timer = setTimeout(() => router.replace(`/products${next.size ? `?${next}` : ""}`, { scroll: false }), 250);
    return () => clearTimeout(timer);
  }, [search, category, page, router]);

  const setCategory = (value: string) => {
    const next = new URLSearchParams(params);
    if (value === "All") next.delete("category");
    else next.set("category", value);
    next.delete("page");
    router.replace(`/products${next.size ? `?${next}` : ""}`, { scroll: false });
  };

  return (
    <div className="shell py-12">
      <div data-reveal className="max-w-2xl">
        <p className="eyebrow">THE ARCHIVE</p>
        <h1 className="mt-3 text-4xl font-extralight tracking-[-0.04em] text-[var(--ink)] md:text-6xl">
          Discover your next essential.
        </h1>
        <p className="mt-4 text-base font-light leading-relaxed text-[var(--muted)]">
          Forty masterfully crafted pieces across 4 signature departments. Curated for timeless utility and design excellence.
        </p>
      </div>

      <div data-reveal style={{ "--reveal-delay": "100ms" } as React.CSSProperties} className="mt-10 flex flex-col gap-4 border-y border-[var(--line)] py-6 md:flex-row md:items-center md:justify-between">
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
            onChange={(e) => { setSearch(e.target.value); const next = new URLSearchParams(params); next.delete("page"); router.replace(`/products${next.size ? `?${next}` : ""}`, { scroll: false }); }}
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
        <div className="product-grid mt-8 grid grid-cols-2 gap-4 lg:grid-cols-4 lg:gap-6">
          {data?.products.map((product) => (
            <ProductCard key={product.slug} product={product} authenticated={authenticated || Boolean(session?.user)} />
          ))}
        </div>
      )}

      {!isLoading && (data?.count ?? 0) > PAGE_SIZE && (
        <nav className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-[var(--line)] pt-7 sm:flex-row" aria-label="Product pagination">
          <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-[var(--faint)]">Page {page} of {Math.ceil((data?.count ?? 0) / PAGE_SIZE)}</p>
          <div className="flex items-center gap-2">
            <button disabled={page === 1} onClick={() => updatePage(page - 1)} className="pagination-button"><ChevronLeft size={15}/>Previous</button>
            {Array.from({ length: Math.ceil((data?.count ?? 0) / PAGE_SIZE) }, (_, index) => index + 1).map((number) => <button key={number} onClick={() => updatePage(number)} aria-current={number === page ? "page" : undefined} className={`pagination-number ${number === page ? "is-active" : ""}`}>{number}</button>)}
            <button disabled={page >= Math.ceil((data?.count ?? 0) / PAGE_SIZE)} onClick={() => updatePage(page + 1)} className="pagination-button">Next<ChevronRight size={15}/></button>
          </div>
        </nav>
      )}
    </div>
  );

  function updatePage(nextPage: number) {
    const next = new URLSearchParams(params);
    if (nextPage <= 1) next.delete("page"); else next.set("page", String(nextPage));
    router.replace(`/products${next.size ? `?${next}` : ""}`);
  }
}
