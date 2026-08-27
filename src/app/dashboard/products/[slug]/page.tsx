import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AccountShell } from "@/components/account-shell";
import { findProduct, catalog } from "@/lib/catalog";
import { ProductDetails } from "@/app/products/[slug]/product-details";
import { ProductCard } from "@/components/product-card";

export function generateStaticParams() { return catalog.map(({ slug }) => ({ slug })); }

export default async function DashboardProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params; const product = findProduct(slug); if (!product) notFound();
  const related = catalog.filter((item) => item.category === product.category && item.slug !== slug).slice(0, 4);
  return <AccountShell title={product.name} eyebrow={product.category}>
    <Link
      href="/dashboard/products"
      className="mb-7 inline-flex min-h-10 items-center gap-2 rounded-full border border-[var(--line)] bg-white/[0.025] px-4 text-xs font-medium text-[var(--muted)] transition hover:border-[var(--accent)]/40 hover:bg-[var(--accent)]/[0.06] hover:text-[var(--accent)]"
    >
      <ArrowLeft size={15} />
      Back to products
    </Link>
    <ProductDetails product={product}/>
    <section className="mt-24"><p className="eyebrow">Keep looking</p><h2 className="display mt-3 text-5xl">You may also like</h2><div className="mt-8 grid grid-cols-2 gap-4 lg:grid-cols-4 lg:gap-6">{related.map((item)=><ProductCard key={item.slug} product={item} authenticated/>)}</div></section>
  </AccountShell>;
}
