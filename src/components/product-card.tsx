import Image from "next/image";
import Link from "next/link";
import { Star } from "lucide-react";
import type { ProductData } from "@/types";
import { formatMoney } from "@/lib/pricing";

export function ProductCard({ product }: { product: ProductData }) {
  return <article className="group">
    <Link href={`/products/${product.slug}`} className="block overflow-hidden rounded-[22px] border border-[var(--line)] bg-[#ebe7dc]">
      <div className="relative aspect-[4/5]"><Image src={product.image} alt={product.name} fill className="object-cover transition duration-500 group-hover:scale-[1.03]" sizes="(max-width: 768px) 50vw, 25vw" /></div>
    </Link>
    <div className="pt-4"><div className="flex items-start justify-between gap-3"><div><p className="eyebrow">{product.category}</p><Link href={`/products/${product.slug}`} className="mt-1 block font-bold">{product.name}</Link></div><strong>{formatMoney(product.priceCents)}</strong></div>
      <div className="mt-2 flex items-center gap-1 text-xs text-[var(--muted)]"><Star size={13} fill="currentColor" /> {product.rating} <span>({product.reviewCount})</span></div>
    </div>
  </article>;
}
