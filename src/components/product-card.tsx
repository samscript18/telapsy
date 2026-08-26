import Image from "next/image";
import Link from "next/link";
import { Star } from "lucide-react";
import type { ProductData } from "@/types";
import { formatMoney } from "@/lib/pricing";

export function ProductCard({ product }: { product: ProductData }) {
  return (
    <article className="group relative flex flex-col justify-between overflow-hidden rounded-xl border border-[var(--line)] bg-[var(--surface)] p-4 transition-all duration-300 hover:border-[var(--line-strong)]">
      <Link href={`/products/${product.slug}`} className="block overflow-hidden rounded-lg bg-[var(--raised)] border border-white/5">
        <div className="relative aspect-square w-full overflow-hidden">
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 768px) 50vw, 25vw"
          />
        </div>
      </Link>
      <div className="pt-4 flex flex-col gap-2">
        <div className="flex items-center justify-between gap-2">
          <span className="text-[10px] font-light tracking-[0.2em] uppercase text-[var(--accent)]">{product.category}</span>
          <span className="font-mono text-sm font-light text-[var(--accent)]">{formatMoney(product.priceCents)}</span>
        </div>
        <Link href={`/products/${product.slug}`} className="font-light text-base text-[var(--ink)] tracking-tight hover:text-[var(--accent)] transition-colors line-clamp-1">
          {product.name}
        </Link>
        <div className="flex items-center justify-between text-xs text-[var(--faint)] pt-1">
          <div className="flex items-center gap-1">
            <Star size={12} className="text-[var(--accent)] fill-[var(--accent)] opacity-80" />
            <span>{product.rating}</span>
            <span>({product.reviewCount})</span>
          </div>
          <span className="text-[10px] font-mono text-[var(--faint)]">{product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}</span>
        </div>
      </div>
    </article>
  );
}
