import { notFound } from "next/navigation";
import { findProduct, catalog } from "@/lib/catalog";
import { ProductDetails } from "./product-details";
import { ProductCard } from "@/components/product-card";

export function generateStaticParams() { return catalog.map(({ slug }) => ({ slug })); }

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params; const product = findProduct(slug); if (!product) notFound();
  const related = catalog.filter((item) => item.category === product.category && item.slug !== slug).slice(0, 4);
  return <div className="shell py-12"><ProductDetails product={product}/><section className="mt-24"><p className="eyebrow">Keep looking</p><h2 className="display mt-3 text-5xl">You may also like</h2><div className="mt-8 grid grid-cols-2 gap-4 lg:grid-cols-4 lg:gap-6">{related.map((item)=><ProductCard key={item.slug} product={item}/>)}</div></section></div>;
}
